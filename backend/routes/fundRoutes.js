/**
 * /api/funds  (ADMIN ONLY)
 * Used by: Fund Received page.
 * Primary data comes from MongoDB `donations` collection, but on each
 * successful verified donation a mirrored row is also written into MySQL
 * (rescue_connect.fund_transactions) so admin can additionally run
 * relational SQL reports/joins with the volunteers table. This route
 * demonstrates the live MySQL query.
 */
const express = require('express');
const Donation = require('../models/Donation');
const User = require('../models/User');
const getMySQLPool = require('../config/mysql');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// All verified donations (Mongo) - who paid, how much, via what method
router.get('/', protect, adminOnly, async (req, res) => {
  const donations = await Donation.find({ verified: true }).sort({ createdAt: -1 });
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  res.json({ totalAmount, count: donations.length, donations });
});

// All registered users (volunteers + admin) - for the admin "details of all registered volunteers" view
router.get('/registered-users', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// Optional relational report via MySQL (falls back gracefully if MySQL isn't running)
router.get('/mysql-report', protect, adminOnly, async (req, res) => {
  try {
    const pool = getMySQLPool();
    const [rows] = await pool.query(
      'SELECT payment_method, COUNT(*) AS txn_count, SUM(amount) AS total FROM fund_transactions GROUP BY payment_method'
    );
    res.json({ source: 'MySQL', connected: true, rows });
  } catch (err) {
    res.status(200).json({ source: 'MySQL', connected: false, rows: [], warning: 'MySQL is not connected. Start MySQL and run backend/mysql_schema.sql. ' + err.message });
  }
});

module.exports = router;
