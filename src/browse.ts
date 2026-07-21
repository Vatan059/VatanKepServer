import "dotenv/config";
import * as fs from "fs";
import { OPCUAClient, MessageSecurityMode, SecurityPolicy, NodeClass } from "node-opcua";

const endpointUrl = process.env.OPCUA_ENDPOINT ?? "opc.tcp://192.168.5.95:49320";
const MAX_DEPTH = 8;
const OUTPUT_FILE = "tags.txt";

// Kanal filtresi: `npm run browse -- Ex7-Makine` gibi calistirilirsa sadece o kanal taranir.
// Verilmezse Objects altindaki TUM kanallari tarar (uzun surebilir).
const channelFilter = process.argv[2];

let lineCount = 0;
const outStream = fs.createWriteStream(OUTPUT_FILE, { flags: "w" });

function writeLine(line: string) {
  outStream.write(line + "\n");
  lineCount++;
  if (lineCount % 200 === 0) {
    process.stdout.write(`\r${lineCount} satir tarandi...`);
  }
}

async function browseRecursive(session: any, nodeId: string, depth: number, prefix: string) {
  if (depth > MAX_DEPTH) return;

  const browseResult = await session.browse(nodeId);
  for (const ref of browseResult.references ?? []) {
    const name = ref.browseName.toString();
    if (name === "Server") continue; // standart OPC UA diagnostik alt agaci
    if (name.startsWith("_")) continue; // KEPServerEX dahili sistem/istatistik tag'leri

    writeLine(`${prefix}${name}  (${ref.nodeId.toString()})`);
    if (ref.nodeClass === NodeClass.Object || ref.nodeClass === NodeClass.Variable) {
      await browseRecursive(session, ref.nodeId, depth + 1, prefix + "  ");
    }
  }
}

async function main() {
  const client = OPCUAClient.create({
    endpointMustExist: false,
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    connectionStrategy: { maxRetry: 3 },
  });

  console.log(`Baglaniliyor: ${endpointUrl}`);
  await client.connect(endpointUrl);
  console.log("Baglandi.");

  const session = await client.createSession();

  let startNodeId: string = "RootFolder";
  if (channelFilter) {
    console.log(`Sadece "${channelFilter}" kanali taranacak...`);
    const rootBrowse: any = await session.browse("RootFolder");
    const objectsRef = (rootBrowse.references ?? []).find((r: any) => r.browseName.toString() === "Objects");
    if (!objectsRef) throw new Error('"Objects" dugumu bulunamadi.');
    const objectsBrowse: any = await session.browse(objectsRef.nodeId.toString());
    const channelRef = (objectsBrowse.references ?? []).find((r: any) => r.browseName.toString() === channelFilter);
    if (!channelRef) {
      console.error(`"${channelFilter}" adinda bir kanal bulunamadi. Objects altindaki kanallar:`);
      for (const r of objectsBrowse.references ?? []) console.error(`  - ${r.browseName.toString()}`);
      await session.close();
      await client.disconnect();
      process.exit(1);
    }
    startNodeId = channelRef.nodeId.toString();
  } else {
    console.log("Tum kanallar taranacak, bu biraz surebilir...");
  }

  await browseRecursive(session, startNodeId, 0, "");

  outStream.end();
  console.log(`\nBitti. ${lineCount} satir "${OUTPUT_FILE}" dosyasina yazildi.`);

  await session.close();
  await client.disconnect();
}

main().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
