const database = require("./Database.js");

interface OrderData {
    tour_id: string;
    customer_id: string;
    customer_name: string;
    customer_email: string;
    booking_date: string;
    total_price?: string;
}

interface TourData {
    price: string;
}

export default class Orders {
    static getAll(): Promise<OrderData[]> {
        let sql = `SELECT orders.id, tours.name AS tour_name, orders.customer_id, orders.customer_name, orders.customer_email, orders.booking_date, orders.total_price FROM orders LEFT JOIN tours ON orders.tour_id = tours.id`;
        return new Promise((resolve, reject) => {
            database.query(sql, function (err: string, data: OrderData[]) {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    static add(orderData: OrderData): Promise<number> {
        return new Promise((resolve, reject) => {
            const getTourPriceSql = 'SELECT price FROM tours WHERE id = ?';
            database.query(getTourPriceSql, [orderData.tour_id], (err: string, tourData: TourData[]) => {
                if (err) {
                    reject(err);
                } else {
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
                    database.query(sql, values, (err: string, result: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result.insertId);
                        }
                    });
                }
            });
        });
    }

    static getById(id: string): Promise<OrderData | null> {
        let sql = `SELECT * FROM orders WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err: string, data: OrderData[]) {
                if (err) reject(err);
                resolve(data[0] || null);
            });
        });
    }

    static update(id: string, orderData: OrderData): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const getTourPriceSql = 'SELECT price FROM tours WHERE id = ?';
            database.query(getTourPriceSql, [orderData.tour_id], (err: string, tourData: TourData[]) => {
                if (err) {
                    reject(err);
                } else {
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
                    database.query(sql, values, function (err: string, data: any) {
                        if (err) reject(err);
                        resolve(data.affectedRows > 0);
                    });
                }
            });
        });
    }

    static delete(id: number): Promise<boolean> {
        let sql = `DELETE FROM orders WHERE id = ?`;
        return new Promise((resolve, reject) => {
            database.query(sql, [id], function (err: string, data: any) {
                if (err) reject(err);
                resolve(data.affectedRows > 0);
            });
        });
    }
}
