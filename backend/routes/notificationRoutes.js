/**
 * /api/notifications
 * Used by: Notification page
 */
const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { $or: [{ volunteerId: req.user.id }, { volunteerId: null }] };
  const notifications = await Notification.find(filter).populate('reportId').sort({ createdAt: -1 });
  res.json(notifications);
});

router.put('/:id/read', protect, async (req, res) => {
  const n = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  res.json(n);
});

module.exports = router;
