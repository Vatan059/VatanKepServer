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
