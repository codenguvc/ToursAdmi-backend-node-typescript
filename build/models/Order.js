"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database = require("./Database.js");
class Orders {
    static getAll() {
        let sql = `SELECT orders.id, tours.name AS tour_name, orders.customer_id, orders.customer_name, orders.customer_email, orders.booking_date, orders.total_price FROM orders LEFT JOIN tours ON orders.tour_id = tours.id`;
        return new Promise((resolve, reject) => {
            database.query(sql, function (err, data) {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    static add(orderData) {
        return new Promise((resolve, reject) => {
            const getTourPriceSql = 'SELECT price FROM tours WHERE id = ?';
            database.query(getTourPriceSql, [orderData.tour_id], (err, tourData) => {
                if (err) {
                    reject(err);
                }
                else {
                    const price = tourData[0].price;
                    const total_price = price; // Here you can apply any further calculation to derive total_price
                    const sql = 'INSERT INTO orders (tour_id, customer_id, customer_name, customer_email, booking_date, total_price) VALUES (?, ?, ?, ?, ?, ?)';
                    const values = [
                        orderData.tour_id,
                        orderData.customer_id,
                        orderData.customer_name,
                        orderData.customer_email,
                        orderData.booking_date,
                        total_price
                    ];
                    database.query(sql, values, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result.insertId);
                        }
                    });
                }
            });
        });
    }
    static getById(id) {
        let sql = `SELECT * FROM orders WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err, data) {
                if (err)
                    reject(err);
                resolve(data[0] || null);
            });
        });
    }
    static update(id, orderData) {
        return new Promise((resolve, reject) => {
            const getTourPriceSql = 'SELECT price FROM tours WHERE id = ?';
            database.query(getTourPriceSql, [orderData.tour_id], (err, tourData) => {
                if (err) {
                    reject(err);
                }
                else {
                    const price = tourData[0].price;
                    const total_price = price; // Here you can apply any further calculation to derive total_price
                    const sql = 'UPDATE orders SET tour_id = ?, customer_id = ?, customer_name = ?, customer_email = ?, booking_date = ?, total_price = ? WHERE id = ?';
                    const values = [
                        orderData.tour_id,
                        orderData.customer_id,
                        orderData.customer_name,
                        orderData.customer_email,
                        orderData.booking_date,
                        total_price,
                        id
                    ];
                    database.query(sql, values, function (err, data) {
                        if (err)
                            reject(err);
                        resolve(data.affectedRows > 0);
                    });
                }
            });
        });
    }
    static delete(id) {
        let sql = `DELETE FROM orders WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err, data) {
                if (err)
                    reject(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
}
exports.default = Orders;
