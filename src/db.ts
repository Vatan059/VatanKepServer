import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const DB_PATH = path.join(__dirname, "..", "data.db");
const db = new DatabaseSync(DB_PATH);

// WAL: es zamanli okuma (dashboard) ve yazma (toplayici) birbirini kilitlemesin.
// busy_timeout: yine de bir an kilitlenirse hata firlatmadan once bekleyip tekrar dener.
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 5000;
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    machine_id TEXT NOT NULL,
    tag_label TEXT NOT NULL,
    value REAL,
    recorded_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_readings_lookup ON readings(machine_id, tag_label, recorded_at);

  CREATE TABLE IF NOT EXISTS latest (
    machine_id TEXT NOT NULL,
    tag_label TEXT NOT NULL,
    value REAL,
    recorded_at INTEGER NOT NULL,
    PRIMARY KEY (machine_id, tag_label)
  );

  CREATE TABLE IF NOT EXISTS thresholds (
    machine_id TEXT NOT NULL,
    tag_label TEXT NOT NULL,
    min_value REAL,
    max_value REAL,
    PRIMARY KEY (machine_id, tag_label)
  );
`);

const insertReadingStmt = db.prepare(
  "INSERT INTO readings (machine_id, tag_label, value, recorded_at) VALUES (?, ?, ?, ?)"
);
const upsertLatestStmt = db.prepare(`
  INSERT INTO latest (machine_id, tag_label, value, recorded_at) VALUES (?, ?, ?, ?)
  ON CONFLICT(machine_id, tag_label) DO UPDATE SET value = excluded.value, recorded_at = excluded.recorded_at
`);

export function recordReading(machineId: string, tagLabel: string, value: number | null, recordedAt: number) {
  insertReadingStmt.run(machineId, tagLabel, value, recordedAt);
  upsertLatestStmt.run(machineId, tagLabel, value, recordedAt);
}

const getLatestStmt = db.prepare(
  "SELECT machine_id, tag_label, value, recorded_at FROM latest ORDER BY machine_id, tag_label"
);
export function getLatestReadings() {
  return getLatestStmt.all();
}

const getHistoryStmt = db.prepare(
  "SELECT value, recorded_at FROM readings WHERE machine_id = ? AND tag_label = ? AND recorded_at >= ? ORDER BY recorded_at ASC LIMIT ?"
);

export interface HistoryPoint {
  value: number | null;
  recorded_at: number;
}

export function getHistory(machineId: string, tagLabel: string, sinceMs = 0, limit = 3000): HistoryPoint[] {
  return getHistoryStmt.all(machineId, tagLabel, sinceMs, limit) as unknown as HistoryPoint[];
}

const getMachineIdsStmt = db.prepare("SELECT DISTINCT machine_id FROM latest ORDER BY machine_id");
export function getMachineIds(): string[] {
  return (getMachineIdsStmt.all() as { machine_id: string }[]).map((r) => r.machine_id);
}

export interface Threshold {
  machine_id: string;
  tag_label: string;
  min_value: number | null;
  max_value: number | null;
}

const getThresholdsStmt = db.prepare("SELECT machine_id, tag_label, min_value, max_value FROM thresholds");
export function getThresholds(): Threshold[] {
  return getThresholdsStmt.all() as unknown as Threshold[];
}

const upsertThresholdStmt = db.prepare(`
  INSERT INTO thresholds (machine_id, tag_label, min_value, max_value) VALUES (?, ?, ?, ?)
  ON CONFLICT(machine_id, tag_label) DO UPDATE SET min_value = excluded.min_value, max_value = excluded.max_value
`);
export function setThreshold(machineId: string, tagLabel: string, minValue: number | null, maxValue: number | null) {
  upsertThresholdStmt.run(machineId, tagLabel, minValue, maxValue);
}
