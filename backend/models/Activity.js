/**
 * COLLECTION: activities
 * Used in pages: Leaderboard page (score history), Volunteers page (activity count)
 * Every rescue-related action (submitting a report, rescue confirmed, donation
 * facilitated) writes one Activity doc and increments User.score.
 */
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  volunteerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { type: String, enum: ['Report Submitted', 'Rescue Completed', 'Donation Facilitated'], required: true },
  points:       { type: Number, required: true },
  relatedReport: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', default: null },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
