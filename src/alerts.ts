import "dotenv/config";
import { getThresholds, getAlertState, setAlertState, Threshold } from "./db";
import { sendAlertEmail } from "./mailer";

// Ayni tag surekli sinir disinda kalirsa her okumada degil, bu araliktan
// (dakika) once bir daha mail atmaz - varsayilan 30 dakika.
const REPEAT_MINUTES = process.env.ALERT_REPEAT_MINUTES ? Number(process.env.ALERT_REPEAT_MINUTES) : 30;

// "Ramp" modu: firin bos/soguk oldugunda alt sinirin altinda kalmak normaldir
// (orn. Maden PV=0 - icinde metal yok) - bu yuzden REPEAT_MINUTES'e gore tekrar
// tekrar mail atmak yerine sadece 1 kere "sinir asimi" maili atilir. Sonrasinda
// sicaklik yukselirken (firin isinirken) her RAMP_BUCKET_SIZE derecede bir
// ilerleme maili gider - boylece "hala dusuk" spam'i olmadan isinma takip edilir.
const RAMP_BUCKET_SIZE = 100;
const RAMP_ALERT_TAGS = new Set<string>(["Rejen::Genel Datatlar.MadenSıcaklığı PV"]);

function isRampTag(machineId: string, tagLabel: string): boolean {
  return RAMP_ALERT_TAGS.has(`${machineId}::${tagLabel}`);
}

let thresholdCache: Map<string, Threshold> = new Map();
let cacheLoadedAt = 0;
const CACHE_TTL_MS = 30_000; // thresholds.html'den yapilan degisiklikler 30sn icinde yansir

function loadThresholds() {
  thresholdCache = new Map(getThresholds().map((t) => [`${t.machine_id}::${t.tag_label}`, t]));
  cacheLoadedAt = Date.now();
}

function getThreshold(machineId: string, tagLabel: string): Threshold | undefined {
  if (Date.now() - cacheLoadedAt > CACHE_TTL_MS) loadThresholds();
  return thresholdCache.get(`${machineId}::${tagLabel}`);
}

export async function checkThresholdAndAlert(machineId: string, tagLabel: string, value: number | null, now: number) {
  if (value === null || !Number.isFinite(value)) return;

  const threshold = getThreshold(machineId, tagLabel);
  if (!threshold || (threshold.min_value === null && threshold.max_value === null)) return;

  const belowMin = threshold.min_value !== null && value < threshold.min_value;
  const aboveMax = threshold.max_value !== null && value > threshold.max_value;
  const breached = belowMin || aboveMax;

  const state = getAlertState(machineId, tagLabel);
  const wasAlerting = !!state?.is_alerting;
  const range = `[${threshold.min_value ?? "-"} , ${threshold.max_value ?? "-"}]`;

  // Ramp modu sadece alt sinirin altinda (firin bos/isiniyor senaryosu) devreye
  // girer - ust sinir asimi (asiri isinma) her zaman normal tekrar mantigini kullanir.
  if (isRampTag(machineId, tagLabel) && belowMin) {
    const bucket = Math.floor(value / RAMP_BUCKET_SIZE) * RAMP_BUCKET_SIZE;
    if (!wasAlerting) {
      await sendAlertEmail(
        `⚠ Sinir asimi: ${machineId}.${tagLabel}`,
        `${machineId}.${tagLabel} tanimli sinirin altina dustu (firin bos/soguk olabilir).\n\nDeger: ${value}\nBeklenen aralik: ${range}\nZaman: ${new Date(now).toLocaleString("tr-TR")}\n\nBu durumda tekrar tekrar mail atilmaz - sicaklik yukselirken her ${RAMP_BUCKET_SIZE} derecede bir ilerleme maili gelecek.`
      );
      setAlertState(machineId, tagLabel, true, now, bucket);
    } else if (state && (state.last_bucket === null || bucket > state.last_bucket)) {
      await sendAlertEmail(
        `↑ Isiniyor: ${machineId}.${tagLabel}`,
        `${machineId}.${tagLabel} yukseliyor.\n\nDeger: ${value}\nBeklenen aralik: ${range}\nZaman: ${new Date(now).toLocaleString("tr-TR")}`
      );
      setAlertState(machineId, tagLabel, true, now, bucket);
    }
    return;
  }

  if (breached) {
    const dueForRepeat = !state?.last_alert_at || now - state.last_alert_at > REPEAT_MINUTES * 60_000;
    if (!wasAlerting || dueForRepeat) {
      await sendAlertEmail(
        `⚠ Sinir asimi: ${machineId}.${tagLabel}`,
        `${machineId}.${tagLabel} tanimli sinirin disina cikti.\n\nDeger: ${value}\nBeklenen aralik: ${range}\nZaman: ${new Date(now).toLocaleString("tr-TR")}`
      );
      setAlertState(machineId, tagLabel, true, now);
    }
  } else if (wasAlerting) {
    await sendAlertEmail(
      `✅ Normale dondu: ${machineId}.${tagLabel}`,
      `${machineId}.${tagLabel} tekrar tanimli sinirlar icine girdi.\n\nDeger: ${value}\nZaman: ${new Date(now).toLocaleString("tr-TR")}`
    );
    setAlertState(machineId, tagLabel, false, now);
  }
}
