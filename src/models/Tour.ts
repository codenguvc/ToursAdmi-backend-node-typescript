const database = require("./Database.js");

interface TourData {
  name: string;
  location_id: string;
  start_date: string;
  end_date: string;
  price: string;
  description: string;
}

export default class Tours {
  static getAll() {
    const sql = `SELECT * FROM tours`;
    return new Promise((resolve, reject) => {
      database.query(sql, function (err: string, data: { id: string, name: string, location_id: string, start_date: string, end_date: string, price: string, description: string }[]) {
        if (err) reject(err);
        resolve(data);
      });
    });
}

static getAllPage(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const sql = `SELECT * FROM tours LIMIT ${limit} OFFSET ${offset}`;
  return new Promise((resolve, reject) => {
    database.query(sql, (err: any, data: TourData[]) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

static getTotalCount() {
  const sql = `SELECT COUNT(*) as count FROM tours`;
  return new Promise((resolve, reject) => {
    database.query(sql, (err: any, data: { count: number }[]) => {
      if (err) reject(err);
      resolve(data[0].count);
    });
  });
}

  static add(tourData: { name: string, location_id: string, start_date: string, end_date: string, price: string, description: string }) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO tours (name, location_id, start_date, end_date, price, description) VALUES (?, ?, ?, ?, ?, ?)';
      let values = [tourData.name, tourData.location_id, tourData.start_date, tourData.end_date, tourData.price, tourData.description];
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
    let sql = `SELECT * FROM tours WHERE id = ?`;
    return new Promise((resolve, reject) => {
      database.query(sql, [id], function (err: string, data: any) {
        if (err) reject(err);
        resolve(data[0]);
      });
    });
  }

  static update(id: string, tourData: { name: string, location_id: string, start_date: string, end_date: string, price: string, description: string }) {
    const sql = 'UPDATE tours SET name = ?, location_id = ?, start_date = ?, end_date = ?, price = ?, description = ? WHERE id = ?';
    const values = [tourData.name, tourData.location_id, tourData.start_date, tourData.end_date, tourData.price, tourData.description, id];
    return new Promise((resolve, reject) => {
      database.query(sql, values, function (err: string, data: any) {
        if (err) reject(err);
        resolve(data.affectedRows > 0);
      });
    });
  }

  static delete(id: Number) {
    let sql = `DELETE FROM tours WHERE id = ?`;
    return new Promise((resolve, reject) => {
      database.query(sql, [id], function (err: string, data: any) {
        if (err) reject(err);
        resolve(data.affectedRows > 0);
      });
    });
  }

  static hasRelatedTour(tourId: string) {
    let sql = `SELECT COUNT(*) AS count FROM orders WHERE tour_id = ?`;
    return new Promise((resolve, reject) => {
      database.query(sql, [tourId], function (err: string, data: any) {
        if (err) reject(err);
        resolve(data[0].count > 0); 
      });
    });
  }
}
