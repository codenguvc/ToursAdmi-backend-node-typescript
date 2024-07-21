const database = require("./Database");

interface PermissionData {
    name: string;
    slug: string;
}

export default class Permissions {
  static getAll() {
    let sql = `SELECT * FROM permissions`;
    return new Promise((resolve, reject) => {
      database.query(
        sql,
        function (
          err: string,
          data: { id: string; name: string; slug: string }[]
        ) {
          if (err) reject(err);
          resolve(data);
        }
      );
    });
  }

  static getAllPage(page: number, limit: number) {
    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM permissions LIMIT ${limit} OFFSET ${offset}`;
    return new Promise((resolve, reject) => {
      database.query(sql, (err: any, data: PermissionData[]) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  static getTotalCount() {
    const sql = `SELECT COUNT(*) as count FROM permissions`;
    return new Promise((resolve, reject) => {
      database.query(sql, (err: any, data: { count: number }[]) => {
        if (err) reject(err);
        resolve(data[0].count);
      });
    });
  }

  static add(permissionsData: { name: string; slug: string }) {
    return new Promise((resolve, reject) => {
      let sql = `INSERT INTO permissions (name, slug) VALUES (?, ?)`;
      let values = [permissionsData.name, permissionsData.slug];
      database.query(sql, values, (err: string, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      });
    });
  }

  static getById(id: string): Promise<any> {
    let role: any;
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM permissions WHERE id = ?`;
      database.query(sql, [id], (err: string, data: any) => {
        if (err) {
          reject(err);
        } else {
          role = data[0];
          if (!role) {
            reject("Không tìm thấy vai trò");
          } else {
            this.getRolePermissions(id)
              .then((permissions) => {
                role.permissions = permissions;
                resolve(role);
              })
              .catch((error) => {
                reject(error);
              });
          }
        }
      });
    });
  }

  static getRolePermissions(roleId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let sql = `SELECT permissions.* FROM permissions
                INNER JOIN Role_permissions ON permissions.id = Role_permissions.permission_id
                WHERE Role_permissions.role_id = ?`;
      database.query(sql, [roleId], (err: string, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  static update(id: string, permissionsData: { name: string; slug: string }) {
    let sql = `UPDATE permissions SET name = ?, slug = ? WHERE id = ?`;
    let values = [permissionsData.name, permissionsData.slug, id];
    return new Promise((resolve, reject) => {
      database.query(sql, values, function (err: string, data: any) {
        if (err) reject(err);
        resolve(data.affectedRows > 0);
      });
    });
  }

  static delete(id: number): Promise<boolean> {
    const sql = `DELETE FROM permissions WHERE id = ?`;
    return new Promise((resolve, reject) => {
      try {
        database.query(sql, [id], (err: any, data: any) => {
          if (err) {
            if (
              err.code === "ER_ROW_IS_REFERENCED" ||
              err.code === "ER_ROW_IS_REFERENCED_2"
            ) {
              reject(
                new Error(
                  "Cannot delete permission due to existing references."
                )
              );
            } else {
              reject(err);
            }
          } else {
            resolve(data.affectedRows > 0);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
