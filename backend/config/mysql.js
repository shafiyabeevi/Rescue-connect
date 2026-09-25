/**
 * MySQL connection pool - companion relational store.
 * Used specifically by the Fund Received (admin) page for relational
 * financial reporting/joins (donations <-> volunteers), demonstrating
 * a real MySQL integration alongside MongoDB.
 * Run backend/mysql_schema.sql in MySQL Workbench / CLI before starting.
 */
const mysql = require('mysql2/promise');

let pool;

const getMySQLPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'rescue_connect',
      waitForConnections: true,
      connectionLimit: 10
    });
    console.log('[MySQL] Pool created for database: ' + (process.env.MYSQL_DATABASE || 'rescue_connect'));
  }
  return pool;
};

module.exports = getMySQLPool;
