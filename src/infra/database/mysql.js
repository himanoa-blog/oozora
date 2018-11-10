"use strict";
exports.__esModule = true;
var mysql = require("promise-mysql");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "", 10),
    database: process.env.DB_NAME
};
var pool = mysql.createPool(connectionConfig);
exports["default"] = pool;
