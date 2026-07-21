import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const DB_PATH = path.join(__dirname, "..", "data.db");
const db = new DatabaseSync(DB_PATH);

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
  "SELECT value, recorded_at FROM readings WHERE machine_id = ? AND tag_label = ? ORDER BY recorded_at DESC LIMIT ?"
);
export function getHistory(machineId: string, tagLabel: string, limit = 200) {
  return getHistoryStmt.all(machineId, tagLabel, limit);
}
