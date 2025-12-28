// database/orgchart.js
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

let db = null;

export const initOrgchartDB = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('app.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS orgchart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imageUri TEXT
    );
  `);

  // insert default row if table is empty
  const row = await db.getFirstAsync(`SELECT * FROM orgchart WHERE id = 1;`);
  if (!row) {
    await db.runAsync(
      `INSERT INTO orgchart (imageUri) VALUES (?)`,
      ['']
    );
  }

  console.log('Orgchart DB initialized');
};

// Fetch orgchart image URI
export const getOrgchartData = async () => {
  if (!db) throw new Error('Database not initialized');
  const row = await db.getFirstAsync(`SELECT * FROM orgchart WHERE id = 1;`);
  return row?.imageUri || '';
};

// Update orgchart image URI
export const updateOrgchartData = async (uri) => {
  if (!db) throw new Error('Database not initialized');
  await db.runAsync(
    `UPDATE orgchart SET imageUri = ? WHERE id = 1`,
    [uri]
  );
};
