"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database = require("./Database");
class Permissions {
    static getAll() {
        let sql = `SELECT * FROM permissions`;
        return new Promise((resolve, reject) => {
            database.query(sql, function (err, data) {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static getAllPage(page, limit) {
        const offset = (page - 1) * limit;
        let sql = `SELECT * FROM permissions LIMIT ${limit} OFFSET ${offset}`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static getTotalCount() {
        const sql = `SELECT COUNT(*) as count FROM permissions`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0].count);
            });
        });
    }
    static add(permissionsData) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO permissions (name, slug) VALUES (?, ?)`;
            let values = [permissionsData.name, permissionsData.slug];
            database.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result.insertId);
                }
            });
        });
    }
    static getById(id) {
        let role;
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM permissions WHERE id = ?`;
            database.query(sql, [id], (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    role = data[0];
                    if (!role) {
                        reject("Không tìm thấy vai trò");
                    }
                    else {
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
    static getRolePermissions(roleId) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT permissions.* FROM permissions
                INNER JOIN Role_permissions ON permissions.id = Role_permissions.permission_id
                WHERE Role_permissions.role_id = ?`;
            database.query(sql, [roleId], (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    static update(id, permissionsData) {
        let sql = `UPDATE permissions SET name = ?, slug = ? WHERE id = ?`;
        let values = [permissionsData.name, permissionsData.slug, id];
        return new Promise((resolve, reject) => {
            database.query(sql, values, function (err, data) {
                if (err)
                    reject(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
    static delete(id) {
        const sql = `DELETE FROM permissions WHERE id = ?`;
        return new Promise((resolve, reject) => {
            try {
                database.query(sql, [id], (err, data) => {
                    if (err) {
                        if (err.code === "ER_ROW_IS_REFERENCED" ||
                            err.code === "ER_ROW_IS_REFERENCED_2") {
                            reject(new Error("Cannot delete permission due to existing references."));
                        }
                        else {
                            reject(err);
                        }
                    }
                    else {
                        resolve(data.affectedRows > 0);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.default = Permissions;
