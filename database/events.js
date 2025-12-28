import * as SQLite from 'expo-sqlite';

let db = null;

// Initialize the database and table
export const initEventsDB = async () => {

  if (!db) db = await SQLite.openDatabaseAsync('app.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      createdAt TEXT
    );
  `);
};

// Fetch all events
export const fetchAllEvents = async () => {
  return await db.getAllAsync(`SELECT * FROM events ORDER BY createdAt DESC`);
};

// Add a new event
export const addEvent = async (title) => {
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO events (title, createdAt) VALUES (?, ?)',
    [title, createdAt]
  );
  return result.lastInsertRowId;
};

// Delete an event
export const deleteEvent = async (id) => {
  await db.runAsync('DELETE FROM events WHERE id = ?', [id]);
};
