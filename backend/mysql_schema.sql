-- =====================================================================
-- Rescue Connect - Companion MySQL Schema
-- MongoDB (via Mongoose) is the primary application database.
-- This MySQL schema mirrors the core tables and is used specifically by
-- the ADMIN "Fund Received" page for relational reporting/joins
-- (see backend/routes/fundRoutes.js -> GET /api/funds/mysql-report).
-- Run this file first:  mysql -u root -p < mysql_schema.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS rescue_connect;
USE rescue_connect;

-- Mirrors the `users` Mongo collection
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mongo_id VARCHAR(24) UNIQUE,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  phone VARCHAR(10) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  age INT NOT NULL,
  gender VARCHAR(10) NOT NULL,
  place VARCHAR(100) NOT NULL,
  role ENUM('admin','volunteer') NOT NULL DEFAULT 'volunteer',
  score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mirrors the `donations` Mongo collection
CREATE TABLE IF NOT EXISTS fund_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mongo_id VARCHAR(24) UNIQUE,
  donor_name VARCHAR(100) NOT NULL,
  phone VARCHAR(10) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('UPI','GPay') NOT NULL,
  upi_id VARCHAR(100),
  txn_ref VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mirrors the `reports` Mongo collection
CREATE TABLE IF NOT EXISTS animal_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mongo_id VARCHAR(24) UNIQUE,
  description TEXT NOT NULL,
  place VARCHAR(100) NOT NULL,
  animal_type VARCHAR(50) NOT NULL,
  found_how VARCHAR(255) NOT NULL,
  reported_by INT,
  status ENUM('Pending','In Progress','Rescued') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reported_by) REFERENCES users(id)
);

-- Sample rows so /api/funds/mysql-report returns data immediately
INSERT INTO users (mongo_id, firstname, lastname, phone, email, age, gender, place, role, score) VALUES
('seed001','Rescue','Admin','9999999999','admin@rescueconnect',30,'Other','Head Office','admin',0),
('seed002','Arun','Kumar','9876543210','arun@example.com',24,'Male','Madurai','volunteer',45),
('seed003','Divya','S','9123456780','divya@example.com',22,'Female','Chennai','volunteer',30)
ON DUPLICATE KEY UPDATE firstname=firstname;

INSERT INTO fund_transactions (mongo_id, donor_name, phone, amount, payment_method, upi_id, txn_ref, verified) VALUES
('fseed001','Ravi Shankar','9988776655',500.00,'UPI','ravi@upi','RC1001',TRUE),
('fseed002','Priya M','9090909090',1000.00,'GPay','priya@okhdfcbank','RC1002',TRUE)
ON DUPLICATE KEY UPDATE donor_name=donor_name;
