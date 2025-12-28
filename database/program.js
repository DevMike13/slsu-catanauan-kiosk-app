import * as SQLite from 'expo-sqlite';

let db = null;

export const initProgramDB = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('app.db');

  // Create table if not exists
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS program_texts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tabName TEXT UNIQUE,
      objectives TEXT,
      goals TEXT
    );
  `);

  // Default tabs
  const tabs = [
    'Bachelor of Elementary Education Major in General Education',
    'Bachelor of Industrial Technology Major in Computer Technology',
    'Bachelor of Industrial Technology Major in Mechanical Technology',
    'Bachelor of Science in Agriculture Major in Crop Science'
  ];

  // Insert default rows if not exists
  for (const tab of tabs) {
    const row = await getProgramData(tab);
    if (!row) {
      await updateProgramData(tab, { objectives: '', goals: '' });
    }
  }

  console.log('Program DB initialized');
};

// Fetch program data by tab
export const getProgramData = async (tabName) => {
  if (!db) throw new Error('Database not initialized');

  const row = await db.getFirstAsync(
    `SELECT * FROM program_texts WHERE tabName = ?`,
    [tabName]
  );

  if (!row) return { objectives: '', goals: '' };

  return {
    objectives: row.objectives,
    goals: row.goals
  };
};

// Update program data by tab
export const updateProgramData = async (tabName, data) => {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync(
    `INSERT OR REPLACE INTO program_texts (id, tabName, objectives, goals)
     VALUES ((SELECT id FROM program_texts WHERE tabName = ?), ?, ?, ?)`,
    [tabName, tabName, data.objectives, data.goals]
  );
};
