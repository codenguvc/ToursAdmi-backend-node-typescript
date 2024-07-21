const database = require("./Database.js");

interface RoleData {
  name: string;
}

function queryAsync(sql: any, params: any) {
  return new Promise((resolve, reject) => {
    database.query(sql, params, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export default class Roles {
  static getAll() {
    let sql = `SELECT * FROM roles`;
    return new Promise((resolve, reject) => {
      database.query(sql, function (err: string, data: { name: string }) {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  static getAllPage(page: number, limit: number) {
    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM roles LIMIT ${limit} OFFSET ${offset}`;
    return new Promise((resolve, reject) => {
      database.query(sql, (err: any, data: RoleData[]) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  static getTotalCount() {
    const sql = `SELECT COUNT(*) as count FROM roles`;
    return new Promise((resolve, reject) => {
      database.query(sql, (err: any, data: { count: number }[]) => {
        if (err) reject(err);
        resolve(data[0].count);
      });
    });
  }

  static add(roleData: { name: string }): Promise<number> {
    return new Promise((resolve, reject) => {
      let sql = `INSERT INTO roles (name) VALUES (?)`;
      let values = [roleData.name];
      database.query(sql, values, (err: string, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      });
    });
  }

  static addRolePermissions(
    roleId: number,
    permissionIds: number[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let sql = `INSERT INTO Role_permissions (role_id, permission_id) VALUES ?`;
      let values = permissionIds.map((permissionId) => [roleId, permissionId]);
      database.query(sql, [values], (err: string, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static update(
    roleId: number,
    roleData: { name: string; permissionIds: number[] }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.updateRolePermissions(roleId, roleData.permissionIds)
        .then(() => {
          const sql = `UPDATE roles SET name = ? WHERE id = ?`;
          const values = [roleData.name, roleId];
          database.query(sql, values, (err: string, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateRolePermissions(
    roleId: number,
    permissionIds: number[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let deleteSql = `DELETE FROM role_permissions WHERE role_id = ?`;

      if (permissionIds.length === 0) {
        database.query(deleteSql, [roleId], (deleteErr: string | null) => {
          if (deleteErr) {
            reject(deleteErr);
          } else {
            resolve();
          }
        });
      } else {
        database.query(deleteSql, [roleId], (deleteErr: string | null) => {
          if (deleteErr) {
            reject(deleteErr);
          } else {
            let index = 0;
            function insertNextPermission() {
              if (index < permissionIds.length) {
                let insertSql = `INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)`;
                let permissionId = permissionIds[index];
                database.query(
                  insertSql,
                  [roleId, permissionId],
                  (insertErr: string | null) => {
                    if (insertErr) {
                      reject(insertErr);
                    } else {
                      index++;
                      insertNextPermission();
                    }
                  }
                );
              } else {
                resolve();
              }
            }
            insertNextPermission();
          }
        });
      }
    });
  }

  static getById(id: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
      let roleSql = `SELECT * FROM roles WHERE id = ?`;
      let permissionSql = `SELECT * FROM role_permissions WHERE role_id = ?`;

      database.query(roleSql, [id], function (err: string, roleData: any) {
        if (err) {
          reject(err);
          return;
        }

        if (roleData.length === 0) {
          resolve(null);
          return;
        }

        database.query(
          permissionSql,
          [id],
          function (permissionErr: string, permissionData: any) {
            if (permissionErr) {
              reject(permissionErr);
              return;
            }

            const role: any = {
              id: roleData[0].id,
              name: roleData[0].name,
              permissions: permissionData.map((permission: any) => ({
                id: permission.id,
                role_id: permission.role_id,
                permission_id: permission.permission_id,
              })),
            };

            resolve(role);
          }
        );
      });
    });
  }

  static async deleteRolePermissions(roleId: number): Promise<any> {
    const sql = `DELETE FROM role_permissions WHERE role_id = ?`;
    try {
      const result = await queryAsync(sql, [roleId]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      await this.deleteRolePermissions(id);
      const sql = `DELETE FROM roles WHERE id = ?`;
      const result = await queryAsync(sql, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async checkRoleInUse(id: number): Promise<boolean> {
    let sql = `SELECT COUNT(*) AS count FROM users WHERE role_id = ?`;
    return new Promise((resolve, reject) => {
      database.query(sql, [id], function (err: string, data: any) {
        if (err) reject(err);
        resolve(data[0].count > 0);
      });
    });
  }

  static async checkSlugAndRole(
    slug: string,
    roleId: number
  ): Promise<boolean> {
    const sql = `
      SELECT COUNT(*) AS count 
      FROM role_permissions rp 
      JOIN permissions p ON rp.permission_id = p.id 
      WHERE rp.role_id = ? AND p.slug = ?`;
    try {
      const result = (await queryAsync(sql, [roleId, slug])) as any;
      return result[0].count > 0;
    } catch (error) {
      throw error;
    }
  }
}
