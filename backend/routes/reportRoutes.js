/**
 * /api/reports
 * Used by: Report page (create), Dashboard (recent), Notification page (trigger)
 * Writes to `reports` collection AND auto-creates linked docs in
 * `notifications` + `activities` -> this is the "report table connected to
 * notification" + leaderboard-scoring requirement.
 */
const express = require('express');
const Report = require('../models/Report');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const syncMySQLReport = require('../utils/syncMySQLReport');
const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { description, photo, place, animalType, foundHow } = req.body;
    if (!description || !place || !animalType || !foundHow) {
      return res.status(400).json({ message: 'Description, place, animal type and how-found are all required.' });
    }
    const report = await Report.create({
      description, photo, place, animalType, foundHow, reportedBy: req.user.id
    });

    // Notify volunteers near that place (nearest-place matching on `place` field)
    const nearbyVolunteers = await User.find({ role: 'volunteer', place: new RegExp(place, 'i') });
    const notifDocs = (nearbyVolunteers.length ? nearbyVolunteers : [{ _id: null }]).map(v => ({
      message: `New ${animalType} reported near ${place}. Tap to help!`,
      place, reportId: report._id, volunteerId: v._id
    }));
    await Notification.insertMany(notifDocs);

    // Score the reporter
    await Activity.create({ volunteerId: req.user.id, activityType: 'Report Submitted', points: 10, relatedReport: report._id });
    await User.findByIdAndUpdate(req.user.id, { $inc: { score: 10 } });

    let mysqlSynced = false;
    try {
      await syncMySQLReport(report);
      mysqlSynced = true;
    } catch (mysqlError) {
      console.warn('[MySQL] Animal report mirror skipped:', mysqlError.message);
    }

    res.status(201).json({ message: 'Report submitted. Nearby volunteers notified.', report, mysqlSynced });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit report: ' + err.message });
  }
});

router.get('/', protect, async (req, res) => {
  const reports = await Report.find().populate('reportedBy', 'firstname lastname place').sort({ createdAt: -1 });
  res.json(reports);
});

router.put('/:id/status', protect, async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (report.status === 'Rescued') {
    await Activity.create({ volunteerId: req.user.id, activityType: 'Rescue Completed', points: 25, relatedReport: report._id });
    await User.findByIdAndUpdate(req.user.id, { $inc: { score: 25 } });
  }
  res.json(report);
});

module.exports = router;
