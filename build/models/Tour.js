"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database = require("./Database.js");
class Tours {
    static getAll() {
        const sql = `SELECT * FROM tours`;
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
        const sql = `SELECT * FROM tours LIMIT ${limit} OFFSET ${offset}`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static getTotalCount() {
        const sql = `SELECT COUNT(*) as count FROM tours`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0].count);
            });
        });
    }
    static add(tourData) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO tours (name, location_id, start_date, end_date, price, description) VALUES (?, ?, ?, ?, ?, ?)';
            let values = [tourData.name, tourData.location_id, tourData.start_date, tourData.end_date, tourData.price, tourData.description];
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
        let sql = `SELECT * FROM tours WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err, data) {
                if (err)
                    reject(err);
                resolve(data[0]);
            });
        });
    }
    static update(id, tourData) {
        const sql = 'UPDATE tours SET name = ?, location_id = ?, start_date = ?, end_date = ?, price = ?, description = ? WHERE id = ?';
        const values = [tourData.name, tourData.location_id, tourData.start_date, tourData.end_date, tourData.price, tourData.description, id];
        return new Promise((resolve, reject) => {
            database.query(sql, values, function (err, data) {
                if (err)
                    reject(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
    static delete(id) {
        let sql = `DELETE FROM tours WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err, data) {
                if (err)
                    reject(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
    static hasRelatedTour(tourId) {
        let sql = `SELECT COUNT(*) AS count FROM orders WHERE tour_id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [tourId], function (err, data) {
                if (err)
                    reject(err);
                resolve(data[0].count > 0);
            });
        });
    }
}
exports.default = Tours;
