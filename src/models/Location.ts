const database = require("./Database.js");

interface LocationData {
  name: string;
  image: string;
  category_id: string;
}

export default class Location {
  static getAll() {
    const sql = `SELECT locations.*, categories.name AS category_name FROM locations LEFT JOIN categories ON locations.category_id = categories.id`;
    return new Promise((resolve, reject) => {
      database.query(sql, function (err: string, data: { id: string, name: string, image: string, category_id: string, category_name: string }[]) {
        if (err) reject(err);
        resolve(data);
      });
    });
  }


  static getAllPage(page: number, limit: number) {
    const offset = (page - 1) * limit;
    const sql = `SELECT locations.*, categories.name AS category_name FROM locations LEFT JOIN categories ON locations.category_id = categories.id LIMIT ${limit} OFFSET ${offset}`;
    return new Promise((resolve, reject) => {
      database.query(sql, (err: any, data: LocationData[]) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  static getTotalCount() {
    const sql = `SELECT COUNT(*) as count FROM locations`;
    return new Promise((resolve, reject) => {
      database.query(sql, (err: any, data: { count: number }[]) => {
        if (err) reject(err);
        resolve(data[0].count);
      });
    });
  }

  static add(locaData: { name: string, image: string, category_id: string }) {
    const sql = 'INSERT INTO locations (name, image, category_id) VALUES (?, ?, ?)';
    const values = [locaData.name, locaData.image, locaData.category_id];
    return new Promise((resolve, reject) => {
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
    const sql = `SELECT * FROM locations WHERE id = ?`;
    return new Promise((resolve, reject) => {
      database.query(sql, [id], function (err: string, data: any) {
        if (err) reject(err);
        resolve(data[0]);
      });
    });
  }

  static update(id: string, locaData: { name: string, image: string, category_id: string}) {
    const sql = 'UPDATE locations SET name = ?, image = ?, category_id = ? WHERE id = ?';
    const values = [locaData.name, locaData.image, locaData.category_id, id];
    return new Promise((resolve, reject) => {
      database.query(sql, values, function (err: string, data: any) {
        if (err) reject(err);
        resolve(data.affectedRows > 0);
      });
    });
  }

  static delete(id: number) {
    const sql = `DELETE FROM locations WHERE id = ?`;
    return new Promise((resolve, reject) => {
      database.query(sql, [id], function (err: string, data: any) {
        if (err) reject(err);
        resolve(data.affectedRows > 0);
      });
    });
  }

  static hasRelatedTours(locationId: string) {
    let sql = `SELECT COUNT(*) AS count FROM tours WHERE location_id = ?`;
    return new Promise((resolve, reject) => {
      database.query(sql, [locationId], function (err: string, data: any) {
        if (err) reject(err);
        resolve(data[0].count > 0); 
      });
    });
  }
}