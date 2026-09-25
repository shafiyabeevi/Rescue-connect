/**
 * /api/auth
 * Handles Registration, Admin Login and Volunteer Login.
 * RULE ENFORCED: only accounts that exist in the `users` collection with
 * role='volunteer' (created via /register) OR the single seeded role='admin'
 * account may log in. Nobody can log in without having registered first
 * (except the fixed admin).
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const syncMySQLUser = require('../utils/syncMySQLUser');
const router = express.Router();

const sign = (user) => jwt.sign(
  { id: user._id, role: user.role, email: user.email, name: user.firstname + ' ' + user.lastname },
  process.env.JWT_SECRET || 'rescueConnectSuperSecretKey2024',
  { expiresIn: '8h' }
);

// ---------- REGISTER (volunteers only) ----------
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, phone, email, password, age, gender, place } = req.body;

    // ---- server-side validation mirrors the Angular form validation ----
    const errors = [];
    if (!firstname || firstname.trim().length < 3) errors.push('First name must be at least 3 characters.');
    if (!lastname || lastname.trim().length < 1) errors.push('Last name is required.');
    if (!/^[0-9]{10}$/.test(phone || '')) errors.push('Phone number must be exactly 10 digits.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) errors.push('A valid email is required.');
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password || '')) errors.push('Password must be at least 8 characters and contain letters and numbers.');
    const ageNum = Number(age);
    if (!ageNum || ageNum < 18 || ageNum > 60) errors.push('Age must be between 18 and 60.');
    if (!gender) errors.push('Gender is required.');
    if (!place || !place.trim()) errors.push('Place is required.');
    if (errors.length) return res.status(400).json({ message: errors.join(' ') });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered. Please login.' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstname, lastname, phone, email: email.toLowerCase(),
      password: hash, age: ageNum, gender, place, role: 'volunteer'
    });

    let mysqlSynced = false;
    try {
      await syncMySQLUser(user);
      mysqlSynced = true;
    } catch (mysqlError) {
      console.warn('[MySQL] User mirror skipped:', mysqlError.message);
    }

    res.status(201).json({ message: 'Registration successful. You can now log in.', userId: user._id, mysqlSynced });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed: ' + err.message });
  }
});

// ---------- ADMIN LOGIN (fixed single account) ----------
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase(), role: 'admin' });
    if (!user) return res.status(401).json({ message: 'Not a registered admin account.' });
    const match = await bcrypt.compare(password || '', user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password.' });
    res.json({ token: sign(user), role: 'admin', name: user.firstname + ' ' + user.lastname, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Login failed: ' + err.message });
  }
});

// ---------- VOLUNTEER LOGIN (must have registered) ----------
router.post('/volunteer-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase(), role: 'volunteer' });
    if (!user) return res.status(401).json({ message: 'No registered volunteer found with this email. Please register first.' });
    const match = await bcrypt.compare(password || '', user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password.' });
    res.json({ token: sign(user), role: 'volunteer', name: user.firstname + ' ' + user.lastname, userId: user._id, place: user.place });
  } catch (err) {
    res.status(500).json({ message: 'Login failed: ' + err.message });
  }
});

module.exports = router;
