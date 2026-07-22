import "dotenv/config";
import express from "express";
import path from "node:path";
import { getLatestReadings, getHistory, getMachineIds } from "./db";
import { groups } from "./machines";

const app = express();
const PORT = process.env.DASHBOARD_PORT ? Number(process.env.DASHBOARD_PORT) : 3500;

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/latest", (_req, res) => {
  res.json(getLatestReadings());
});

app.get("/api/machines", (_req, res) => {
  res.json(getMachineIds());
});

// Grup/makine/tag yapisini tarayiciya verir (nodeId'ler PLC ic adresleme
// detayi oldugu icin disaridaki istemciye sizdirilmiyor, sadece etiketler).
app.get("/api/groups", (_req, res) => {
  res.json(
    groups.map((g) => ({
      id: g.id,
      label: g.label,
      machines: g.machines.map((m) => ({ id: m.id, tags: m.tags.map((t) => t.label) })),
    }))
  );
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

app.listen(PORT, () => {
  console.log(`Dashboard: http://localhost:${PORT}`);
});
