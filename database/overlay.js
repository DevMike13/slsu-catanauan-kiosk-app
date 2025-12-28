import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

let db = null;

// Initialize the DB
export const initOverlayDB = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('app.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS overlay (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fileUri TEXT
    );
  `);
};

// Fetch overlay video
export const fetchOverlayVideo = async () => {
  return await db.getFirstAsync('SELECT * FROM overlay');
};

// Insert or update overlay video
export const upsertOverlayVideo = async (fileUri) => {
  const row = await db.getFirstAsync('SELECT * FROM overlay');
  if (row) {
    await db.runAsync('UPDATE overlay SET fileUri = ? WHERE id = ?', [fileUri, row.id]);
  } else {
    await db.runAsync('INSERT INTO overlay (fileUri) VALUES (?)', [fileUri]);
  }
};

// Save video locally
export const saveVideoLocally = async (uri) => {
  const ext = uri.split('.').pop();
  const localUri = `${FileSystem.documentDirectory}overlay-${Date.now()}.${ext}`;
  await FileSystem.copyAsync({ from: uri, to: localUri });
  return localUri;
};
