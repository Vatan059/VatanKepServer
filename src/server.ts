import "dotenv/config";
import express from "express";
import path from "node:path";
import { getLatestReadings, getHistory } from "./db";

const app = express();
const PORT = process.env.DASHBOARD_PORT ? Number(process.env.DASHBOARD_PORT) : 3500;

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/latest", (_req, res) => {
  res.json(getLatestReadings());
});

app.get("/api/history", (req, res) => {
  const machineId = String(req.query.machineId ?? "");
  const tagLabel = String(req.query.tagLabel ?? "");
  if (!machineId || !tagLabel) {
    res.status(400).json({ error: "machineId ve tagLabel gerekli" });
    return;
  }
  res.json(getHistory(machineId, tagLabel));
});

app.listen(PORT, () => {
  console.log(`Dashboard: http://localhost:${PORT}`);
});
