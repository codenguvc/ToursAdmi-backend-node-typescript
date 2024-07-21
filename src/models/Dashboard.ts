    const database = require("./Database.js");

    export default class DashBoard {
        static getCountTotal() {
            const sql = `SELECT SUM(total_price) AS total FROM orders`;
            return new Promise<number>((resolve, reject) => {
                database.query(sql, function (err: any, result: any) {
                    if (err) reject(err);
                    resolve(result[0].total);
                });
            });
        }


        static getAmountCus() {
            const sql = `SELECT COUNT(*) AS total_customers FROM customers`;
            return new Promise<number>((resolve, reject) => {
                database.query(sql, function (err: any, result: any) {
                    if (err) reject(err);
                    resolve(result[0].total_customers);
                });
            });
        }
        static getAmountOrder() {
            const sql = `SELECT COUNT(*) AS total_orders FROM orders`;
            return new Promise<number>((resolve, reject) => {
                database.query(sql, function (err: any, result: any) {
                    if (err) reject(err);
                    resolve(result[0].total_orders);
                });
            });
        }
        

        static getOrdersByLocation() {
            const sql = `
                SELECT l.id AS location_id, l.name AS location_name, COUNT(o.id) AS order_count
                FROM locations l
                LEFT JOIN tours t ON l.id = t.location_id
                LEFT JOIN orders o ON t.id = o.tour_id
                GROUP BY l.id, l.name
                ORDER BY l.id
            `;
            return new Promise<any[]>((resolve, reject) => {
                database.query(sql, function (err: any, result: any) {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        }

        static getRevenuePercentageByLocation() {
            const sql = `
                SELECT l.name AS location_name, 
                       SUM(o.total_price) AS total_revenue, 
                       (SUM(o.total_price) / (SELECT SUM(total_price) FROM orders)) * 100 AS revenue_percentage
                FROM locations l
                LEFT JOIN tours t ON l.id = t.location_id
                LEFT JOIN orders o ON t.id = o.tour_id
                GROUP BY l.id, l.name
                ORDER BY l.id
            `;
            return new Promise<any[]>((resolve, reject) => {
                database.query(sql, function (err: any, result: any) {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        }

    }

    

  
