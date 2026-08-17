import "dotenv/config";
import express from "express";
import * as fs from "fs";
import path from "node:path";
import { getLatestReadings, getHistory, getMachineIds, getThresholds, setThreshold } from "./db";
import { groups } from "./machines";

const app = express();
const PORT = process.env.DASHBOARD_PORT ? Number(process.env.DASHBOARD_PORT) : 3500;
const ALCCRLINE_STRUCTURE_FILE = path.join(__dirname, "..", "alccrline-structure.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// AL CCRLINE'in makine/tag yapisi machines.ts'te elle tanimli degil - src/alccrline.ts
// baslarken OPC UA'yi otomatik tarayip bu dosyaya yaziyor. Dosya yoksa (toplayici hic
// calismadiysa) o grup listede gorunmez.
function loadAlccrlineGroup(): { id: string; label: string; machines: { id: string; tags: string[] }[] } | null {
  try {
    return JSON.parse(fs.readFileSync(ALCCRLINE_STRUCTURE_FILE, "utf-8"));
  } catch {
    return null;
  }
}

app.get("/api/latest", (_req, res) => {
  res.json(getLatestReadings());
});

app.get("/api/machines", (_req, res) => {
  res.json(getMachineIds());
});

// Grup/makine/tag yapisini tarayiciya verir (nodeId'ler PLC ic adresleme
// detayi oldugu icin disaridaki istemciye sizdirilmiyor, sadece etiketler).
app.get("/api/groups", (_req, res) => {
  const staticGroups = groups.map((g) => ({
    id: g.id,
    label: g.label,
    machines: g.machines.map((m) => ({ id: m.id, tags: m.tags.map((t) => t.label) })),
  }));
  const alccrline = loadAlccrlineGroup();
  res.json(alccrline ? [...staticGroups, alccrline] : staticGroups);
});

app.get("/api/history", (req, res) => {
  const machineId = String(req.query.machineId ?? "");
  const tagLabel = String(req.query.tagLabel ?? "");
  const hours = req.query.hours ? Number(req.query.hours) : 1;
  if (!machineId || !tagLabel) {
    res.status(400).json({ error: "machineId ve tagLabel gerekli" });
    return;
  }
  const sinceMs = hours > 0 ? Date.now() - hours * 3600_000 : 0;
  res.json(getHistory(machineId, tagLabel, sinceMs));
});

// Periyodik "rapor" tablosu: birden fazla tag'in, sabit araliklarla (orn. her 30
// saniyede bir) o ana kadarki en son degerini tek satirda gosterir (basamak/step
// fonksiyonu - bir sonraki okuma gelene kadar onceki deger gecerli sayilir).
// Tagler arasi zaman damgalari hic uyusmadigi icin (her biri kendi hizinda OPC
// event'i ile guncelleniyor) boyle bir "hizalanmis" tabloya ihtiyac var.
app.get("/api/report", (req, res) => {
  const machineId = String(req.query.machineId ?? "");
  const tagLabels = String(req.query.tagLabels ?? "")
    .split("|")
    .filter(Boolean);
  const periodSeconds = req.query.periodSeconds ? Number(req.query.periodSeconds) : 30;
  const hours = req.query.hours ? Number(req.query.hours) : 1;

  if (!machineId || tagLabels.length === 0 || !Number.isFinite(periodSeconds) || periodSeconds <= 0) {
    res.status(400).json({ error: "machineId, tagLabels ve periodSeconds gerekli" });
    return;
  }
  if (!Number.isFinite(hours) || hours <= 0) {
    res.status(400).json({ error: "hours pozitif olmali (rapor 'Tumu' araligini desteklemiyor)" });
    return;
  }

  const now = Date.now();
  const sinceMs = now - hours * 3600_000;
  const periodMs = periodSeconds * 1000;
  const bucketCount = Math.floor((now - sinceMs) / periodMs) + 1;
  const MAX_BUCKETS = 5000;
  if (bucketCount > MAX_BUCKETS) {
    res.status(400).json({
      error: `Bu araliktaki periyot sayisi (${bucketCount}) cok fazla (limit ${MAX_BUCKETS}) - daha kisa bir sure secin veya periyodu buyutun.`,
    });
    return;
  }

  // getHistory varsayilani 3000 satirla sinirli - rapor icin gerektigi kadarini
  // (secilen saat araligindaki tum ham okumalari) almak icin genis bir limit veriliyor.
  const perTagHistory = tagLabels.map((tag) => getHistory(machineId, tag, sinceMs, 500_000));
  const pointers = perTagHistory.map(() => 0);

  const rows: { t: number; values: (number | null)[] }[] = [];
  for (let i = 0; i < bucketCount; i++) {
    const bucketEnd = sinceMs + i * periodMs;
    const values: (number | null)[] = [];
    for (let ti = 0; ti < tagLabels.length; ti++) {
      const hist = perTagHistory[ti];
      let p = pointers[ti];
      while (p + 1 < hist.length && hist[p + 1].recorded_at <= bucketEnd) p++;
      pointers[ti] = p;
      const point = hist[p];
      values.push(point && point.recorded_at <= bucketEnd && point.value !== null ? point.value : null);
    }
    rows.push({ t: bucketEnd, values });
  }

  res.json({ periodSeconds, tagLabels, rows });
});

app.get("/api/thresholds", (_req, res) => {
  res.json(getThresholds());
});

app.post("/api/thresholds", (req, res) => {
  const { machineId, tagLabel, minValue, maxValue } = req.body ?? {};
  if (!machineId || !tagLabel) {
    res.status(400).json({ error: "machineId ve tagLabel gerekli" });
    return;
  }
  const min = minValue === null || minValue === undefined || minValue === "" ? null : Number(minValue);
  const max = maxValue === null || maxValue === undefined || maxValue === "" ? null : Number(maxValue);
  setThreshold(machineId, tagLabel, min, max);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Dashboard: http://localhost:${PORT}`);
});
