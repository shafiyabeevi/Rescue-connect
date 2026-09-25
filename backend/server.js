/**
 * Rescue Connect - Backend Entry Point
 * Node.js + Express + MongoDB (Mongoose) + optional MySQL companion store
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectMongo = require('./config/db');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // 10mb to allow base64 report/pet photos

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/foods', require('./routes/foodRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/funds', require('./routes/fundRoutes'));

app.get('/', (req, res) => res.send('Rescue Connect API is running.'));

const PORT = process.env.PORT || 5000;

connectMongo().then(() => {
  app.listen(PORT, () => console.log(`[Server] Rescue Connect backend running on http://localhost:${PORT}`));
});
