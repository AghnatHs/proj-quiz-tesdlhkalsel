import db from "./connection.mjs";

const UserQuery = {
  isUsernameExist: async function (username) {
    const [results] = await db.query(
      `SELECT count(username) as isExist FROM users WHERE username = ?`,
      [username]
    );
    return results[0].isExist;
  },
  getUser: async function (username) {
    const [results] = await db.query(
      `SELECT id, username, created_at as createdAt, updated_at as updatedAt, is_admin as isAdmin FROM users
       WHERE username = ?`,
      [username]
    );
    return results[0];
  },
  getUserForAuth: async function (username) {
    const [results] = await db.query(
      `SELECT id, username, password, is_admin as isAdmin FROM users
       WHERE username = ?`,
      [username]
    );
    return results[0];
  },
  registerUser: async function (id, username, password) {
    const [results] = await db.query(
      `INSERT INTO users (id, username, password) VALUES (?, ?, ?)`,
      [id, username, password]
    );
    return results;
  },
};

export default UserQuery;
