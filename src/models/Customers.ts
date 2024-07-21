import { rejects } from "assert";
import { resolve } from "path";

const database = require("./Database.js");

interface CustomerData {
  name: string;
  phone: string;
}

export default class Customers {
    static getAll() {
        let sql = `SELECT * FROM customers`;
        return new Promise((resolve, reject) => {
          database.query(sql, function (err: string, data: { name: string }) {
            if (err) reject(err);
            resolve(data);
          });
        });
      }

      static getAllPage(page: number, limit: number) {
        const offset = (page - 1) * limit;
        let sql = `SELECT * FROM customers LIMIT ${limit} OFFSET ${offset}`;
        return new Promise((resolve, reject) => {
          database.query(sql, (err: any, data: CustomerData[]) => {
            if (err) reject(err);
            resolve(data);
          });
        });
      }

      static getTotalCount() {
        const sql = `SELECT COUNT(*) as count FROM customers`;
        return new Promise((resolve, reject) => {
          database.query(sql, (err: any, data: { count: number }[]) => {
            if (err) reject(err);
            resolve(data[0].count);
          });
        });
      }

      static add(customersData: { name: string, phone: string }) {
        return new Promise((resolve, reject) => {
          let sql = `INSERT INTO customers (name, phone) VALUES (?, ?)`;
          let values = [customersData.name, customersData.phone];
          database.query(sql, values, (err: string, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.insertId);
            }
          });
        });
      }

      static getById(id: string) {
        console.log(id);
        let sql = `SELECT * FROM customers WHERE id = ?`;
        return new Promise((resolve, reject) => {
          database.query(sql, [id], function (err: string, data: any) {
            if (err) reject(err);
            resolve(data[0]);
          });
        });
      }

      static update(id: string, customerData: { name: string, phone: string }){
        let sql = `UPDATE customers SET name = ?, phone = ? WHERE id = ?`;
        let values = [customerData.name, customerData.phone, id];
        return new Promise((resolve, rejects) => {
            database.query(sql, values, function (err: string, data: any){
                if (err) rejects(err);
                resolve(data.affectedRows > 0)
            })
        })
      }

      static delete(id: number) { 
        let sql = `DELETE FROM customers WHERE id = ?`;
        return new Promise((resolve, reject) => {
          database.query(sql, [id], function (err: string, data: any) {
            if (err) reject(err);
            resolve(data.affectedRows > 0);
          });
        });
      }
      static hasRelatedOrders(customerId: string) {
        let sql = `SELECT COUNT(*) AS count FROM orders WHERE customer_id = ?`;
        return new Promise((resolve, reject) => {
          database.query(sql, [customerId], function (err: string, data: any) {
            if (err) reject(err);
            resolve(data[0].count > 0); 
          });
        });
    }
    
}