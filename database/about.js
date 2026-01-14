// database/about.js
import * as SQLite from 'expo-sqlite';

let db = null;

// Initialize About DB table
export const initAboutDB = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('app.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS about (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vision TEXT,
      mission TEXT,
      core TEXT,
      goals TEXT
    );
  `);

  // try {
  //   await db.execAsync(`ALTER TABLE about ADD COLUMN goals TEXT;`);
  // } catch (e) {
  //   console.log("Added")
  // }

  // Insert default row if table empty
  const row = await db.getFirstAsync(`SELECT * FROM about WHERE id = 1;`);
  if (!row) {
    await db.runAsync(
      `INSERT INTO about (vision, mission, core, goals) VALUES (?, ?, ?, ?)`,
      ['', '', JSON.stringify([]), '']
    );
  }

  console.log('About DB initialized');
};

// Fetch about data
export const getAboutData = async () => {
  if (!db) throw new Error('Database not initialized');
  const row = await db.getFirstAsync(`SELECT * FROM about WHERE id = 1;`);
  if (!row) {
    return {
      vision: '',
      mission: '',
      core: [],
      goals: '',
    };
  }

  return {
    vision: row.vision,
    mission: row.mission,
    core: JSON.parse(row.core || '[]'),
    goals: row.goals || '',
  };
};

// Update about data
export const updateAboutData = async (data) => {
  if (!db) throw new Error('Database not initialized');
  await db.runAsync(
    `UPDATE about
     SET vision = ?, mission = ?, core = ?, goals = ?
     WHERE id = 1`,
    [
      data.vision,
      data.mission,
      JSON.stringify(data.core || []),
      data.goals || '',
    ]
  );
};
