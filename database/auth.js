import { getDB } from './db';

export const loginUser = async (username, email, password) => {
  const db = getDB();
  const user = await db.getFirstAsync(
    `SELECT * FROM users WHERE email = ? AND password = ?`,
    [email, password]
  );

  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  if (user.username !== username) {
    throw new Error('USERNAME_MISMATCH');
  }

  if (user.isRejected === 1) {
    throw new Error('REJECTED');
  }

  if (user.isAccepted === 0) {
    throw new Error('PENDING');
  }

  return user;
};

export const registerUser = async ({
    fullName,
    username,
    email,
    password,
    phoneNumber,
    address,
    role = 'admin',
  }) => {
    const db = getDB();
    // Check if email already exists
    const existing = await db.getFirstAsync(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
  
    if (existing) {
      throw new Error('EMAIL_EXISTS');
    }
  
    // Insert new user
    await db.runAsync(
      `
      INSERT INTO users (
        fullName,
        username,
        email,
        password,
        phoneNumber,
        address,
        role,
        isAccepted,
        isRejected
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        fullName,
        username,
        email,
        password,
        phoneNumber,
        address,
        role,
        0, // isAccepted (pending)
        0, // isRejected
      ]
    );
  
    // Optionally return user info
    return { fullName, username, email, phoneNumber, address, role, isAccepted: 0, isRejected: 0 };
};
