/**
 * /api/donations
 * Used by: Donation page (create), Fund Received page (admin view).
 * This demo records the payment immediately because it does not connect to a
 * real UPI or GPay payment gateway.
 */
const express = require('express');
const Donation = require('../models/Donation');
const Activity = require('../models/Activity');
const User = require('../models/User');
const syncMySQLDonation = require('../utils/syncMySQLDonation');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Create and immediately confirm the demo donation.
router.post('/initiate', protect, async (req, res) => {
  try {
    const { name, phone, amount, age, paymentMethod, upiId } = req.body;
    if (!name || !/^[0-9]{10}$/.test(phone || '') || !amount || amount < 1 || !age || !paymentMethod || !upiId) {
      return res.status(400).json({ message: 'All donation fields are required and must be valid.' });
    }
    const txnRef = 'RC' + Date.now();
    const donation = await Donation.create({
      name, phone, amount, age, paymentMethod, upiId, txnRef,
      verified: true, donorId: req.user ? req.user.id : null
    });
    if (req.user && req.user.role === 'volunteer') {
      await Activity.create({ volunteerId: req.user.id, activityType: 'Donation Facilitated', points: 5 });
      await User.findByIdAndUpdate(req.user.id, { $inc: { score: 5 } });
    }
    let mysqlSynced = false;
    try {
      await syncMySQLDonation(donation);
      mysqlSynced = true;
    } catch (mysqlError) {
      console.warn('[MySQL] Donation mirror skipped:', mysqlError.message);
    }
    res.status(201).json({ donationId: donation._id, txnRef, mysqlSynced, message: `Donation recorded successfully via ${paymentMethod}. Thank you for your contribution.` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to initiate donation: ' + err.message });
  }
});

// Step 2: verify -> checks OTP, marks verified, scores volunteer if logged in
router.post('/verify', protect, async (req, res) => {
  try {
    const { donationId, otp } = req.body;
    const donation = await Donation.findById(donationId);
    if (!donation) return res.status(404).json({ message: 'Donation not found.' });
    if (donation.otp !== otp) return res.status(400).json({ message: 'Incorrect OTP. Payment not verified.' });
    donation.verified = true;
    await donation.save();

    if (req.user && req.user.role === 'volunteer') {
      await Activity.create({ volunteerId: req.user.id, activityType: 'Donation Facilitated', points: 5 });
      await User.findByIdAndUpdate(req.user.id, { $inc: { score: 5 } });
    }
    res.json({ message: 'Donation verified successfully! Thank you for your contribution.', donation });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed: ' + err.message });
  }
});

router.get('/', protect, async (req, res) => {
  const donations = await Donation.find().sort({ createdAt: -1 });
  res.json(donations);
});

module.exports = router;
