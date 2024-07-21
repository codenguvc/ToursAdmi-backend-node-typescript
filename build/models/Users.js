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
class Users {
    static getAll(page, limit) {
        const offset = (page - 1) * limit;
        const sql = `SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static getTotalCount() {
        const sql = `SELECT COUNT(*) as count FROM users`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0].count);
            });
        });
    }
    static add(userData) {
        const sql = "INSERT INTO users (username, password, email, role_id) VALUES (?, ?, ?, ?)";
        const values = [
            userData.username,
            userData.password,
            userData.email,
            userData.role_id,
        ];
        return new Promise((resolve, reject) => {
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
    static getUserById(id) {
        const sql = `SELECT * FROM users WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err, data) {
                if (err)
                    reject(err);
                resolve(data[0]);
            });
        });
    }
    static delete(id) {
        const sql = `DELETE FROM users WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], (err, data) => {
                if (err)
                    reject(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
    static findByEmailOrUsername(email, username, excludeId) {
        let sql = `SELECT * FROM users WHERE (email = ? OR username = ?)`;
        const values = [email, username];
        if (excludeId) {
            sql += ` AND id != ?`;
            values.push(excludeId);
        }
        return new Promise((resolve, reject) => {
            database.query(sql, values, (err, data) => {
                if (err)
                    reject(err);
                resolve(data.length ? data[0] : null);
            });
        });
    }
    static update(id, userData) {
        const sql = "UPDATE users SET username = ?, password = ?, email = ?, role_id = ? WHERE id = ?";
        const values = [
            userData.username,
            userData.password,
            userData.email,
            userData.role_id,
            id,
        ];
        return new Promise((resolve, reject) => {
            database.query(sql, values, (err, data) => {
                if (err)
                    reject(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
    static getRoleById(id) {
        const sql = `SELECT role_id FROM users WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0].role_id);
            });
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM users WHERE email = ?`;
            try {
                const data = yield new Promise((resolve, reject) => {
                    database.query(sql, [email], (err, results) => {
                        if (err) {
                            reject(err);
                        }
                        else {
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
            }
            catch (err) {
                console.error("Error logging in user:", err);
                throw err;
            }
        });
    }
}
exports.default = Users;
