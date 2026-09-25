/**
 * COLLECTION: notifications
 * Used in page: Notification page
 * Auto-created whenever a new Report is submitted (see routes/reportRoutes.js) -
 * this is the "report table connected to notification" requirement: every
 * volunteer located in/near the report's place gets a notification document.
 */
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message:     { type: String, required: true },
  place:       { type: String, required: true },
  reportId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null = broadcast to all
  read:        { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
