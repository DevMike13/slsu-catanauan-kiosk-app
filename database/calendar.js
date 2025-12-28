import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

let db;

export const initCalendarDB = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('app.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS calendar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imageUri TEXT
    );
  `);

//   const firstRow = await db.getFirstAsync('SELECT * FROM calendar WHERE id = 1');
//   if (!firstRow) {
//     await db.runAsync('INSERT INTO calendar (imageUri) VALUES (?)', ['']);
//   }

  console.log('Calendar DB initialized');
};

export const getCalendarImages = async () => {
  if (!db) throw new Error('Database not initialized');

  const rows = await db.getAllAsync('SELECT * FROM calendar ORDER BY id ASC');
  return rows.map(r => ({ id: r.id, uri: r.imageUri }));
};

export const addCalendarImage = async (uri) => {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync('INSERT INTO calendar (imageUri) VALUES (?)', [uri]);
  return getCalendarImages();
};

export const updateCalendarImage = async (id, uri) => {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync('UPDATE calendar SET imageUri = ? WHERE id = ?', [uri, id]);
};

export const deleteCalendarImage = async (id) => {
  if (!db) throw new Error('Database not initialized');

  const row = await db.getFirstAsync('SELECT * FROM calendar WHERE id = ?', [id]);
  if (row?.imageUri) {
    try {
      await FileSystem.deleteAsync(row.imageUri, { idempotent: true });
    } catch (err) {
      console.log('Failed to delete file:', err);
    }
  }

  await db.runAsync('DELETE FROM calendar WHERE id = ?', [id]);
  return getCalendarImages();
};
