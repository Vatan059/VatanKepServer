import "dotenv/config";
import { getThresholds, getAlertState, setAlertState, Threshold } from "./db";
import { sendAlertEmail } from "./mailer";

// Ayni tag surekli sinir disinda kalirsa her okumada degil, bu araliktan
// (dakika) once bir daha mail atmaz - varsayilan 30 dakika.
const REPEAT_MINUTES = process.env.ALERT_REPEAT_MINUTES ? Number(process.env.ALERT_REPEAT_MINUTES) : 30;

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

  const breached =
    (threshold.min_value !== null && value < threshold.min_value) ||
    (threshold.max_value !== null && value > threshold.max_value);

  const state = getAlertState(machineId, tagLabel);
  const wasAlerting = !!state?.is_alerting;

  if (breached) {
    const dueForRepeat = !state?.last_alert_at || now - state.last_alert_at > REPEAT_MINUTES * 60_000;
    if (!wasAlerting || dueForRepeat) {
      const range = `[${threshold.min_value ?? "-"} , ${threshold.max_value ?? "-"}]`;
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
