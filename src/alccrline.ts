// AL CCRLINE (Rejen / Dinlendirme_A / Dinlendirme_B) icin ayri toplayici.
// machines.ts'teki digerlerinin aksine tag'ler elle tanimlanmiyor: bu 3 dal
// program baslarken otomatik taranir (browse). Her firinin altinda binlerce
// tag var (brulor sira kontrolu, timer'lar, ham I/O bitleri) - bunlarin buyuk
// kismi gurultu, bu yuzden sadece asagidaki WANTED_TOP_GROUPS / shouldKeep
// filtresinden gecenlere abone olunur:
//   - KalibrasyonDB.<sensor>.Value  (kalibre edilmis basinc sensoru degerleri)
//   - DB6000 - Alarmlar.*           (alarm bitleri)
//   - Genel Datatlar.* / GenelDatalar.*  (sicaklik PV, klape/damper pozisyonu, tarih/saat haric)
//   - ScadaDB.*                     (Dinlendirme_A/B icin pota pozisyonu/durum bilgileri)
//   - TOP_LEVEL_EXTRA               (firin kokunde dogrudan duran birkac gaz sayaci/basinc tag'i)
// Kesif sonucu ayni zamanda alccrline-structure.json'a yazilir ki dashboard
// (server.ts) hangi makine/tag'lerin var oldugunu bilebilsin.
import "dotenv/config";
import * as fs from "fs";
import path from "node:path";
import {
  OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy,
  AttributeIds,
  TimestampsToReturn,
  ClientSubscription,
  ClientMonitoredItem,
  DataValue,
  NodeClass,
} from "node-opcua";
import { recordReading } from "./db";
import { checkThresholdAndAlert } from "./alerts";

const endpointUrl = process.env.OPCUA_ENDPOINT ?? "opc.tcp://192.168.5.95:49320";
const CHANNEL_NAME = "ALCCRLINE";
const BRANCHES = ["Rejen", "Dinlendirme_A", "Dinlendirme_B"];
const MAX_DEPTH = 10;
const STRUCTURE_FILE = path.join(__dirname, "..", "alccrline-structure.json");

interface DiscoveredTag {
  label: string;
  nodeId: string;
}

// Furin dogrudan altinda sadece bu isimdeki klasorlere inilir - geri kalani
// (brulor/timer sira kontrolu, iletisim paketleri vb.) hic taranmaz.
const WANTED_TOP_GROUPS = ["KalibrasyonDB", "DB6000 - Alarmlar", "Genel Datatlar", "GenelDatalar", "ScadaDB"];

// Firin kokunde (klasorsuz, dogrudan) duran ama gerekli olan birkac tag -
// bunlar WANTED_TOP_GROUPS'taki bir klasorun altinda degil, bu yuzden ayrica
// isimle allowlist'e alinmalari gerekiyor.
const TOP_LEVEL_EXTRA = ["Fark Baınç 1", "Fark Baınç 2", "Fırın İç basınç", "TüketilenGazMiktarı", "TüketilenHavaMiktarı"];

// Genel Datatlar/GenelDatalar icinde gercek proses verisi olmayan, gurultu
// sayilan alt dizeler (sistem saati, deneme/test alanlari).
const GENEL_DATATLAR_EXCLUDE = ["SistemGercekZamanSaati", "denemetarih", "FarkTarih"];

function shouldKeep(label: string): boolean {
  if (label.startsWith("DB6000 - Alarmlar.")) return true;
  if (/^KalibrasyonDB\..*\.Value$/.test(label)) return true;
  if (label.startsWith("Genel Datatlar.") || label.startsWith("GenelDatalar.")) {
    return !GENEL_DATATLAR_EXCLUDE.some((ex) => label.includes(ex));
  }
  if (label.startsWith("ScadaDB.")) return true;
  if (TOP_LEVEL_EXTRA.includes(label)) return true;
  return false;
}

// browseName.toString() namespace on ekiyle gelir (orn. "2:ALCCRLINE") - karsilastirma
// icin bu onek atilmali.
function bare(browseName: string): string {
  return browseName.replace(/^\d+:/, "");
}

async function discoverTags(session: any, nodeId: string, prefix: string, depth: number, out: DiscoveredTag[]) {
  if (depth > MAX_DEPTH) return;

  const browseResult = await session.browse(nodeId);
  for (const ref of browseResult.references ?? []) {
    const name = bare(ref.browseName.toString());
    if (name === "Server") continue; // standart OPC UA diagnostik alt agaci
    if (name.startsWith("_")) continue; // KEPServerEX dahili sistem/istatistik tag'leri
    // Firin kokunde istenmeyen klasorlere hic girilmez. Kokte dogrudan duran
    // Variable'lar (klasorsuz tag'ler) burada elenmez - TOP_LEVEL_EXTRA icin
    // shouldKeep'e birakilir.
    if (depth === 0 && ref.nodeClass === NodeClass.Object && !WANTED_TOP_GROUPS.includes(name)) continue;

    const label = prefix ? `${prefix}.${name}` : name;

    if (ref.nodeClass === NodeClass.Variable && shouldKeep(label)) {
      out.push({ label, nodeId: ref.nodeId.toString() });
    }
    if (ref.nodeClass === NodeClass.Object || ref.nodeClass === NodeClass.Variable) {
      await discoverTags(session, ref.nodeId.toString(), label, depth + 1, out);
    }
  }
}

async function main() {
  const client = OPCUAClient.create({
    endpointMustExist: false,
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    connectionStrategy: { maxRetry: -1 },
  });

  client.on("connection_lost", () => console.warn("[alccrline] Baglanti koptu, yeniden denenecek..."));
  client.on("connection_reestablished", () => console.log("[alccrline] Baglanti yeniden kuruldu."));

  await client.connect(endpointUrl);
  const session = await client.createSession();
  console.log("[alccrline] OPC UA session acildi.");

  const rootBrowse: any = await session.browse("RootFolder");
  const objectsRef = (rootBrowse.references ?? []).find((r: any) => bare(r.browseName.toString()) === "Objects");
  if (!objectsRef) throw new Error('"Objects" dugumu bulunamadi.');

  const objectsBrowse: any = await session.browse(objectsRef.nodeId.toString());
  const channelRef = (objectsBrowse.references ?? []).find((r: any) => bare(r.browseName.toString()) === CHANNEL_NAME);
  if (!channelRef) throw new Error(`"${CHANNEL_NAME}" kanali bulunamadi.`);

  const channelBrowse: any = await session.browse(channelRef.nodeId.toString());

  const machines: { id: string; tags: DiscoveredTag[] }[] = [];
  for (const branch of BRANCHES) {
    const branchRef = (channelBrowse.references ?? []).find((r: any) => bare(r.browseName.toString()) === branch);
    if (!branchRef) {
      const available = (channelBrowse.references ?? []).map((r: any) => bare(r.browseName.toString())).join(", ");
      console.warn(`[alccrline] "${branch}" dugumu bulunamadi, atlaniyor. ${CHANNEL_NAME} altindakiler: ${available}`);
      machines.push({ id: branch, tags: [] });
      continue;
    }
    const tags: DiscoveredTag[] = [];
    await discoverTags(session, branchRef.nodeId.toString(), "", 0, tags);
    console.log(`[alccrline] ${branch}: ${tags.length} tag bulundu.`);
    machines.push({ id: branch, tags });
  }

  fs.writeFileSync(
    STRUCTURE_FILE,
    JSON.stringify(
      {
        id: "alccrline",
        label: "AL CCRLINE (Firinlar)",
        machines: machines.map((m) => ({ id: m.id, tags: m.tags.map((t) => t.label) })),
      },
      null,
      2
    )
  );
  console.log(`[alccrline] Yapi "${STRUCTURE_FILE}" dosyasina yazildi.`);

  const subscription = ClientSubscription.create(session, {
    requestedPublishingInterval: 1000,
    requestedLifetimeCount: 1000,
    requestedMaxKeepAliveCount: 20,
    maxNotificationsPerPublish: 200,
    publishingEnabled: true,
    priority: 10,
  });

  subscription.on("started", () => console.log(`[alccrline] Subscription basladi (id=${subscription.subscriptionId}).`));
  subscription.on("terminated", () => console.log("[alccrline] Subscription sonlandi."));

  for (const machine of machines) {
    for (const tag of machine.tags) {
      const monitoredItem = ClientMonitoredItem.create(
        subscription,
        { nodeId: tag.nodeId, attributeId: AttributeIds.Value },
        { samplingInterval: 1000, discardOldest: true, queueSize: 10 },
        TimestampsToReturn.Both
      );

      monitoredItem.on("changed", (dataValue: DataValue) => {
        const value = dataValue.value.value;
        const now = Date.now();
        const numericValue = typeof value === "number" ? value : null;
        recordReading(machine.id, tag.label, numericValue, now);
        checkThresholdAndAlert(machine.id, tag.label, numericValue, now).catch((err) =>
          console.error(`[alccrline] ${machine.id}.${tag.label} kontrol hatasi:`, err)
        );
      });

      monitoredItem.on("err", (message: string) => {
        console.error(`[alccrline] ${machine.id}.${tag.label} (${tag.nodeId}) HATA: ${message}`);
      });
    }
  }

  process.on("SIGINT", async () => {
    console.log("\n[alccrline] Kapatiliyor...");
    await subscription.terminate();
    await session.close();
    await client.disconnect();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("[alccrline] Hata:", err);
  process.exit(1);
});
