/**
 * /api/users
 * Used by: Volunteers page (list/search/filter), Dashboard (profile), Fund page (donor list)
 */
const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// list all volunteers (search/filter is also done client-side via Angular filter,
// but a server-side query param is supported too)
router.get('/volunteers', protect, async (req, res) => {
  const { q } = req.query;
  const filter = { role: 'volunteer' };
  if (q) {
    filter.$or = [
      { firstname: new RegExp(q, 'i') },
      { lastname: new RegExp(q, 'i') },
      { place: new RegExp(q, 'i') }
    ];
  }
  const volunteers = await User.find(filter).select('-password').sort({ score: -1 });
  res.json(volunteers);
});

router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

module.exports = router;
