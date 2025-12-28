import * as SQLite from 'expo-sqlite';

let db = null; // this will hold the DB instance

// Initialize DB and create table
export const initDB = async () => {
  try {
    db = await SQLite.openDatabaseAsync('app.db'); // ✅ wait for DB

    // await db.execAsync(`
    //   DROP TABLE IF EXISTS users;
    // `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT,
        username TEXT,
        email TEXT UNIQUE,
        password TEXT,
        phoneNumber TEXT,
        address TEXT,
        role TEXT,
        isAccepted INTEGER,
        isRejected INTEGER
      );
    `);
    console.log('DB initialized and users table ready');
  } catch (err) {
    console.error('DB init error:', err);
    throw err;
  }
};

export const getDB = () => {
    if (!db) throw new Error('Database not initialized. Call initDB() first.');
    return db;
};

// Prepopulate super-admin and admin
export const prepopulateUsers = async () => {
  if (!db) throw new Error('Database not initialized');

  try {
    await db.runAsync(
      `INSERT OR IGNORE INTO users (fullName, username, email, password, phoneNumber, address, role, isAccepted, isRejected)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Super Admin', 'superadmin', 'superadmin@slsu.edu.ph', 'superadmin@2025', '09123456789', 'SLSU Main Campus', 'super-admin', 1, 0]
    );

    await db.runAsync(
      `INSERT OR IGNORE INTO users (fullName, username, email, password, phoneNumber, address, role, isAccepted, isRejected)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Administrator', 'admin', 'admin@slsu.edu.ph', 'admin@2025', '09987654321', 'SLSU Admin Office', 'admin', 1, 0]
    );

    console.log('Users prepopulated successfully');
  } catch (err) {
    console.error('Failed to prepopulate users:', err);
  }
};

// Get all users
export const showAllUsers = async () => {
  if (!db) throw new Error('Database not initialized');

  const users = await db.getAllAsync('SELECT * FROM users;');
  console.log('All users:', users);
  return users;
};

// Delete all users
export const deleteAllUsers = async () => {
  if (!db) throw new Error('Database not initialized');

  const result = await db.runAsync('DELETE FROM users;');
  console.log(`Deleted all users, changes: ${result.changes}`);
};
