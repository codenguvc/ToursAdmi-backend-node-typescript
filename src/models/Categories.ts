const database = require("./Database.js");

interface CateData {
  name: string;

}

export default class Categories {
  static getAll() {
    let sql = `SELECT * FROM categories`;
    return new Promise((resolve, reject) => {
      database.query(sql, function (err: string, data: { name: string }) {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  static getAllPage(page: number, limit: number) {
    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM categories LIMIT ${limit} OFFSET ${offset}`;
    return new Promise((resolve, reject) => {
      database.query(sql, (err: any, data: CateData[]) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  static getTotalCount() {
    const sql = `SELECT COUNT(*) as count FROM categories`;
    return new Promise((resolve, reject) => {
      database.query(sql, (err: any, data: { count: number }[]) => {
        if (err) reject(err);
        resolve(data[0].count);
      });
    });
  }

  static add(cateData: { name: string }) {
    return new Promise((resolve, reject) => {
      let sql = `INSERT INTO categories (name) VALUES (?)`;
      let values = [cateData.name];
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
    let sql = `SELECT * FROM categories WHERE id = ?`;
    return new Promise((resolve, reject) => {
      database.query(sql, [id], function (err: string, data: any) {
        if (err) reject(err);
        resolve(data[0]);
      });
    });
  }

  static update(id: string, cateData: { name: string }) {
    let sql = `UPDATE categories SET name = ? WHERE id = ?`;
    let values = [cateData.name, id];
    return new Promise((resolve, reject) => {
      database.query(sql, values, function (err: string, data: any) {
        if (err) reject(err);
        resolve(data.affectedRows > 0);
      });
    });
  }

  static delete(id: number) { 
    let sql = `DELETE FROM categories WHERE id = ?`;
    return new Promise((resolve, reject) => {
      database.query(sql, [id], function (err: string, data: any) {
        if (err) reject(err);
        resolve(data.affectedRows > 0);
      });
    });
  }
  static hasRelatedCaterory(locationId: string) {
    let sql = `SELECT COUNT(*) AS count FROM locations WHERE category_id = ?`;
    return new Promise((resolve, reject) => {
      database.query(sql, [locationId], function (err: string, data: any) {
        if (err) reject(err);
        resolve(data[0].count > 0); 
      });
    });
  }
  
}
