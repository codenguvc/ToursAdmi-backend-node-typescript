"use strict";
var mysql = require("mysql");
var database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "tour",
});
database.connect(function (err) {
    if (err)
        throw err;
    console.log("ket noi database thanh cong !");
});
module.exports = database;
