import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';


let db = null;

// Initialize table
export const initAttireDB = async () => {
    if (!db) db = await SQLite.openDatabaseAsync('app.db');
    
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS attire (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tab TEXT NOT NULL,
      gender TEXT NOT NULL,
      imageUri TEXT
    );
  `);
};

// Fetch all images for a tab
export const fetchAttireByTab = async (tab) => {
  return await db.getAllAsync(
    'SELECT * FROM attire WHERE tab = ?',
    [tab]
  );
};

// Insert or update image
export const upsertAttireImage = async (tab, gender, localUri) => {
  // Check if row exists
  const row = await db.getFirstAsync(
    'SELECT * FROM attire WHERE tab = ? AND gender = ?',
    [tab, gender]
  );
  
  if (row) {
    await db.runAsync(
      'UPDATE attire SET imageUri = ? WHERE id = ?',
      [localUri, row.id]
    );
  } else {
    await db.runAsync(
      'INSERT INTO attire (tab, gender, imageUri) VALUES (?, ?, ?)',
      [tab, gender, localUri]
    );
  }
};

// Save image to local file system
export const saveImageLocally = async (uri, tab, gender) => {
  const ext = uri.split('.').pop();
  const localUri = `${FileSystem.documentDirectory}attire-${tab}-${gender}-${Date.now()}.${ext}`;
  await FileSystem.copyAsync({ from: uri, to: localUri });
  return localUri;
};
