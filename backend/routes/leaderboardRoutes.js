/**
 * /api/leaderboard
 * Used by: Leaderboard page. Reads `users` (score) + `activities` (breakdown)
 */
const express = require('express');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, async (req, res) => {
  const ranking = await User.find({ role: 'volunteer' })
    .select('firstname lastname place score')
    .sort({ score: -1 })
    .limit(50);
  res.json(ranking);
});

router.get('/activities/:volunteerId', protect, async (req, res) => {
  const activities = await Activity.find({ volunteerId: req.params.volunteerId }).sort({ createdAt: -1 });
  res.json(activities);
});

module.exports = router;
