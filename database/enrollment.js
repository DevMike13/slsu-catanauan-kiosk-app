import * as SQLite from 'expo-sqlite';

let db = null;

// Initialize database table
export const initEnrollmentDB = async () => {

    if (!db) db = await SQLite.openDatabaseAsync('app.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS enrollment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program TEXT NOT NULL,
      year TEXT NOT NULL,
      male INTEGER DEFAULT 0,
      female INTEGER DEFAULT 0
    );
  `);
};

// Fetch all enrollment data for a program
export const fetchEnrollmentByProgram = async (program) => {
  return await db.getAllAsync(
    'SELECT * FROM enrollment WHERE program = ? ORDER BY year',
    [program]
  );
};

// Insert a new enrollment row
export const addEnrollmentRow = async (program, year, male = 0, female = 0) => {
  const result = await db.runAsync(
    'INSERT INTO enrollment (program, year, male, female) VALUES (?, ?, ?, ?)',
    [program, year, male, female]
  );
  return result.lastInsertRowId;
};

// Update an enrollment row
export const updateEnrollmentRow = async (id, male, female) => {
  await db.runAsync(
    'UPDATE enrollment SET male = ?, female = ? WHERE id = ?',
    [male, female, id]
  );
};
