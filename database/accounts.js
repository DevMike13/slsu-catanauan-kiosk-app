import * as SQLite from 'expo-sqlite';

let db = null;

// 🔹 Initialize database & table
export const initAccountsDB = async () => {
  if (!db) db = await SQLite.openDatabaseAsync('app.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      fullName TEXT,
      username TEXT,
      email TEXT,
      role TEXT,
      isAccepted INTEGER DEFAULT 0,
      isRejected INTEGER DEFAULT 0
    );
  `);
};

// 🔹 Get pending users
export const fetchPendingUsers = async () => {
  return await db.getAllAsync(`
    SELECT * FROM users
    WHERE isAccepted = 0
      AND isRejected = 0
      AND email != 'superadmin@slsu.edu.ph'
  `);
};

// 🔹 Get approved users
export const fetchApprovedUsers = async () => {
  return await db.getAllAsync(`
    SELECT * FROM users
    WHERE isAccepted = 1
      AND email != 'superadmin@slsu.edu.ph'
  `);
};

// 🔹 Approve user
export const approveUser = async (id) => {
  await db.runAsync(
    'UPDATE users SET isAccepted = 1 WHERE id = ?',
    [id]
  );
};

// 🔹 Reject user
export const rejectUser = async (id) => {
  await db.runAsync(
    'UPDATE users SET isRejected = 1 WHERE id = ?',
    [id]
  );
};
