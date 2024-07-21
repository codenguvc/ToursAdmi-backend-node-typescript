"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database = require("./Database.js");
class Location {
    static getAll() {
        const sql = `SELECT locations.*, categories.name AS category_name FROM locations LEFT JOIN categories ON locations.category_id = categories.id`;
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
        const sql = `SELECT locations.*, categories.name AS category_name FROM locations LEFT JOIN categories ON locations.category_id = categories.id LIMIT ${limit} OFFSET ${offset}`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static getTotalCount() {
        const sql = `SELECT COUNT(*) as count FROM locations`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0].count);
            });
        });
    }
    static add(locaData) {
        const sql = 'INSERT INTO locations (name, image, category_id) VALUES (?, ?, ?)';
        const values = [locaData.name, locaData.image, locaData.category_id];
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
    static getById(id) {
        const sql = `SELECT * FROM locations WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err, data) {
                if (err)
                    reject(err);
                resolve(data[0]);
            });
        });
    }
    static update(id, locaData) {
        const sql = 'UPDATE locations SET name = ?, image = ?, category_id = ? WHERE id = ?';
        const values = [locaData.name, locaData.image, locaData.category_id, id];
        return new Promise((resolve, reject) => {
            database.query(sql, values, function (err, data) {
                if (err)
                    reject(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
    static delete(id) {
        const sql = `DELETE FROM locations WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err, data) {
                if (err)
                    reject(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
    static hasRelatedTours(locationId) {
        let sql = `SELECT COUNT(*) AS count FROM tours WHERE location_id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [locationId], function (err, data) {
                if (err)
                    reject(err);
                resolve(data[0].count > 0);
            });
        });
    }
}
exports.default = Location;
