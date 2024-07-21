"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database = require("./Database.js");
class Customers {
    static getAll() {
        let sql = `SELECT * FROM customers`;
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
        let sql = `SELECT * FROM customers LIMIT ${limit} OFFSET ${offset}`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static getTotalCount() {
        const sql = `SELECT COUNT(*) as count FROM customers`;
        return new Promise((resolve, reject) => {
            database.query(sql, (err, data) => {
                if (err)
                    reject(err);
                resolve(data[0].count);
            });
        });
    }
    static add(customersData) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO customers (name, phone) VALUES (?, ?)`;
            let values = [customersData.name, customersData.phone];
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
        let sql = `SELECT * FROM customers WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err, data) {
                if (err)
                    reject(err);
                resolve(data[0]);
            });
        });
    }
    static update(id, customerData) {
        let sql = `UPDATE customers SET name = ?, phone = ? WHERE id = ?`;
        let values = [customerData.name, customerData.phone, id];
        return new Promise((resolve, rejects) => {
            database.query(sql, values, function (err, data) {
                if (err)
                    rejects(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
    static delete(id) {
        let sql = `DELETE FROM customers WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err, data) {
                if (err)
                    reject(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
    static hasRelatedOrders(customerId) {
        let sql = `SELECT COUNT(*) AS count FROM orders WHERE customer_id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [customerId], function (err, data) {
                if (err)
                    reject(err);
                resolve(data[0].count > 0);
            });
        });
    }
}
exports.default = Customers;
