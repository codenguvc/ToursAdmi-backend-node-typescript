"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database = require("./Database.js");
class Categories {
    static getAll() {
        let sql = `SELECT * FROM categories`;
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
        let sql = `SELECT * FROM categories LIMIT ${limit} OFFSET ${offset}`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static getTotalCount() {
        const sql = `SELECT COUNT(*) as count FROM categories`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0].count);
            });
        });
    }
    static add(cateData) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO categories (name) VALUES (?)`;
            let values = [cateData.name];
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
        console.log(id);
        let sql = `SELECT * FROM categories WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err, data) {
                if (err)
                    reject(err);
                resolve(data[0]);
            });
        });
    }
    static update(id, cateData) {
        let sql = `UPDATE categories SET name = ? WHERE id = ?`;
        let values = [cateData.name, id];
        return new Promise((resolve, reject) => {
            database.query(sql, values, function (err, data) {
                if (err)
                    reject(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
    static delete(id) {
        let sql = `DELETE FROM categories WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err, data) {
                if (err)
                    reject(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
    static hasRelatedCaterory(locationId) {
        let sql = `SELECT COUNT(*) AS count FROM locations WHERE category_id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [locationId], function (err, data) {
                if (err)
                    reject(err);
                resolve(data[0].count > 0);
            });
        });
    }
}
exports.default = Categories;
