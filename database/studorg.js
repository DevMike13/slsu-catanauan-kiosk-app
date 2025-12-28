// database/studorg.js
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

let db = null;

// Initialize table and default rows
export const initStudorgDB = async (tabList) => {
  if (!db) db = await SQLite.openDatabaseAsync('app.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS studorg (
      tab TEXT PRIMARY KEY,
      imageUri TEXT,
      qrLink TEXT,
      email TEXT
    );
  `);

  for (const tab of tabList) {
    const row = await db.getFirstAsync(`SELECT * FROM studorg WHERE tab = ?`, [tab]);
    if (!row) {
      await db.runAsync(`INSERT INTO studorg (tab, imageUri, qrLink, email) VALUES (?, ?, ?, ?)`, [tab, '', '', '']);
    }
  }
};

// Fetch all tabs
export const fetchAllTabs = async (tabList) => {
  const imagesData = {};
  const qrData = {};
  const emailData = {};
  for (const tab of tabList) {
    const row = await db.getFirstAsync(`SELECT * FROM studorg WHERE tab = ?`, [tab]);
    imagesData[tab] = row?.imageUri || '';
    qrData[tab] = row?.qrLink || '';
    emailData[tab] = row?.email || '';
  }
  return { imagesData, qrData, emailData };
};

// Update image URI for a tab
export const updateImage = async (tab, uri) => {
  await db.runAsync(`UPDATE studorg SET imageUri = ? WHERE tab = ?`, [uri, tab]);
};

// Update QR link and email for a tab
export const updateQrEmail = async (tab, qrLink, email) => {
  await db.runAsync(`UPDATE studorg SET qrLink = ?, email = ? WHERE tab = ?`, [qrLink, email, tab]);
};

// Optional: Delete image from local storage and clear DB entry
export const deleteImage = async (tab) => {
  const row = await db.getFirstAsync(`SELECT * FROM studorg WHERE tab = ?`, [tab]);
  if (row?.imageUri) {
    try {
      await FileSystem.deleteAsync(row.imageUri, { idempotent: true });
    } catch (err) {
      console.log('Failed to delete file:', err);
    }
  }
  await db.runAsync(`UPDATE studorg SET imageUri = '' WHERE tab = ?`, [tab]);
};
