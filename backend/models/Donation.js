/**
 * COLLECTION: donations
 * Used in pages: Donation page (create), Fund Received page (admin view/verify)
 */
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  phone:         { type: String, required: true, match: /^[0-9]{10}$/ },
  amount:        { type: Number, required: true, min: 1 },
  age:           { type: Number, required: true, min: 1 },
  paymentMethod: { type: String, enum: ['UPI', 'GPay'], required: true },
  upiId:         { type: String, required: true },
  txnRef:        { type: String }, // self-generated verification reference
  otp:           { type: String }, // demo OTP-style verification code
  verified:      { type: Boolean, default: false },
  donorId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
