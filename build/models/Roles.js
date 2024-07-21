"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database = require("./Database.js");
function queryAsync(sql, params) {
    return new Promise((resolve, reject) => {
        database.query(sql, params, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}
class Roles {
    static getAll() {
        let sql = `SELECT * FROM roles`;
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
        let sql = `SELECT * FROM roles LIMIT ${limit} OFFSET ${offset}`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static getTotalCount() {
        const sql = `SELECT COUNT(*) as count FROM roles`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0].count);
            });
        });
    }
    static add(roleData) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO roles (name) VALUES (?)`;
            let values = [roleData.name];
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
    static addRolePermissions(roleId, permissionIds) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO Role_permissions (role_id, permission_id) VALUES ?`;
            let values = permissionIds.map((permissionId) => [roleId, permissionId]);
            database.query(sql, [values], (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    static update(roleId, roleData) {
        return new Promise((resolve, reject) => {
            this.updateRolePermissions(roleId, roleData.permissionIds)
                .then(() => {
                const sql = `UPDATE roles SET name = ? WHERE id = ?`;
                const values = [roleData.name, roleId];
                database.query(sql, values, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    static updateRolePermissions(roleId, permissionIds) {
        return new Promise((resolve, reject) => {
            let deleteSql = `DELETE FROM role_permissions WHERE role_id = ?`;
            if (permissionIds.length === 0) {
                database.query(deleteSql, [roleId], (deleteErr) => {
                    if (deleteErr) {
                        reject(deleteErr);
                    }
                    else {
                        resolve();
                    }
                });
            }
            else {
                database.query(deleteSql, [roleId], (deleteErr) => {
                    if (deleteErr) {
                        reject(deleteErr);
                    }
                    else {
                        let index = 0;
                        function insertNextPermission() {
                            if (index < permissionIds.length) {
                                let insertSql = `INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)`;
                                let permissionId = permissionIds[index];
                                database.query(insertSql, [roleId, permissionId], (insertErr) => {
                                    if (insertErr) {
                                        reject(insertErr);
                                    }
                                    else {
                                        index++;
                                        insertNextPermission();
                                    }
                                });
                            }
                            else {
                                resolve();
                            }
                        }
                        insertNextPermission();
                    }
                });
            }
        });
    }
    static getById(id) {
        return new Promise((resolve, reject) => {
            let roleSql = `SELECT * FROM roles WHERE id = ?`;
            let permissionSql = `SELECT * FROM role_permissions WHERE role_id = ?`;
            database.query(roleSql, [id], function (err, roleData) {
                if (err) {
                    reject(err);
                    return;
                }
                if (roleData.length === 0) {
                    resolve(null);
                    return;
                }
                database.query(permissionSql, [id], function (permissionErr, permissionData) {
                    if (permissionErr) {
                        reject(permissionErr);
                        return;
                    }
                    const role = {
                        id: roleData[0].id,
                        name: roleData[0].name,
                        permissions: permissionData.map((permission) => ({
                            id: permission.id,
                            role_id: permission.role_id,
                            permission_id: permission.permission_id,
                        })),
                    };
                    resolve(role);
                });
            });
        });
    }
    static deleteRolePermissions(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM role_permissions WHERE role_id = ?`;
            try {
                const result = yield queryAsync(sql, [roleId]);
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.deleteRolePermissions(id);
                const sql = `DELETE FROM roles WHERE id = ?`;
                const result = yield queryAsync(sql, [id]);
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static checkRoleInUse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = `SELECT COUNT(*) AS count FROM users WHERE role_id = ?`;
            return new Promise((resolve, reject) => {
                database.query(sql, [id], function (err, data) {
                    if (err)
                        reject(err);
                    resolve(data[0].count > 0);
                });
            });
        });
    }
    static checkSlugAndRole(slug, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
      SELECT COUNT(*) AS count 
      FROM role_permissions rp 
      JOIN permissions p ON rp.permission_id = p.id 
      WHERE rp.role_id = ? AND p.slug = ?`;
            try {
                const result = (yield queryAsync(sql, [roleId, slug]));
                return result[0].count > 0;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = Roles;
