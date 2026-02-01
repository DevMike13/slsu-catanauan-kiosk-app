import * as SQLite from 'expo-sqlite';

let db = null;

export const initAnnouncementsDB = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('app.db');
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      createdAt TEXT
    );
  `);
};

export const fetchAllAnnouncements = async () => {
    return await db.getAllAsync(`SELECT * FROM announcements ORDER BY createdAt DESC`);
};

export const addAnnouncement = async (title) => {
    const createdAt = new Date().toISOString();
    const result = await db.runAsync(
      'INSERT INTO announcements (title, createdAt) VALUES (?, ?)',
      [title, createdAt]
    );
    return result.lastInsertRowId;
};

export const deleteAnnouncement = async (id) => {
    await db.runAsync('DELETE FROM announcements WHERE id = ?', [id]);
};
  