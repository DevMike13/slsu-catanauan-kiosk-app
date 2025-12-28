// database/pages.js
import * as SQLite from 'expo-sqlite';

let db = null;

export const initPagesDB = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('app.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT UNIQUE,
      content TEXT
    );
  `);

  // Insert default content if missing
  await db.runAsync(
    `INSERT OR IGNORE INTO pages (page, content) VALUES (?, ?)`,
    ['history', 'Default history content...']
  );
};

export const getPageContent = async (page) => {
  const usersDB = db || (await SQLite.openDatabaseAsync('app.db'));
  const row = await usersDB.getFirstAsync(
    `SELECT content FROM pages WHERE page = ?`,
    [page]
  );
  return row?.content || '';
};

export const updatePageContent = async (page, content) => {
  const usersDB = db || (await SQLite.openDatabaseAsync('app.db'));
  await usersDB.runAsync(
    `UPDATE pages SET content = ? WHERE page = ?`,
    [content, page]
  );
};
