const database = require("./Database.js");

interface UserData {
  username: string;
  password: string;
  email: string;
  role_id: string;
}

export default class Users {
  static getAll(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const sql = `SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`;
    return new Promise((resolve, reject) => {
      database.query(sql, (err: any, data: UserData[]) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  static getTotalCount() {
    const sql = `SELECT COUNT(*) as count FROM users`;
    return new Promise((resolve, reject) => {
      database.query(sql, (err: any, data: { count: number }[]) => {
        if (err) reject(err);
        resolve(data[0].count);
      });
    });
  }

  static add(userData: UserData) {
    const sql =
      "INSERT INTO users (username, password, email, role_id) VALUES (?, ?, ?, ?)";
    const values = [
      userData.username,
      userData.password,
      userData.email,
      userData.role_id,
    ];
    return new Promise((resolve, reject) => {
      database.query(sql, values, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      });
    });
  }
  static getUserById(id: string) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
      database.query(sql, [id], function (err: string, data: any) {
        if (err) reject(err);
        resolve(data[0]);
      });
    });
  }
  static delete(id: number) {
    const sql = `DELETE FROM users WHERE id = ?`;
    return new Promise((resolve, reject) => {
      database.query(sql, [id], (err: any, data: any) => {
        if (err) reject(err);
        resolve(data.affectedRows > 0);
      });
    });
  }
  

  static findByEmailOrUsername(
    email: string,
    username: string,
    excludeId?: string
  ) {
    let sql = `SELECT * FROM users WHERE (email = ? OR username = ?)`;
    const values: (string | undefined)[] = [email, username];

    if (excludeId) {
      sql += ` AND id != ?`;
      values.push(excludeId);
    }

    return new Promise((resolve, reject) => {
      database.query(sql, values, (err: any, data: UserData[]) => {
        if (err) reject(err);
        resolve(data.length ? data[0] : null);
      });
    });
  }
  

  static update(id: string, userData: UserData) {
    const sql =
      "UPDATE users SET username = ?, password = ?, email = ?, role_id = ? WHERE id = ?";
    const values = [
      userData.username,
      userData.password,
      userData.email,
      userData.role_id,
      id,
    ];
    return new Promise((resolve, reject) => {
      database.query(sql, values, (err: any, data: any) => {
        if (err) reject(err);
        resolve(data.affectedRows > 0);
      });
    });
  }

  static getRoleById(id: string) {
  const sql = `SELECT role_id FROM users WHERE id = ?`;
  return new Promise((resolve, reject) => {
    database.query(sql, [id], (err: any, data: any) => {
      if (err) reject(err);
      resolve(data[0].role_id);
    });
  });
}


  static async login(
    email: string,
    password: string
  ): Promise<UserData | null> {
    const sql = `SELECT * FROM users WHERE email = ?`;

    try {
      const data: UserData[] = await new Promise((resolve, reject) => {
        database.query(sql, [email], (err: any, results: UserData[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });

      if (data.length === 0) {
        return null;
      }

      const user = data[0];

      const isPasswordValid = password === user.password;

      return isPasswordValid ? user : null;
    } catch (err) {
      console.error("Error logging in user:", err);
      throw err;
    }
  }
}
