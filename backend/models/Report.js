/**
 * COLLECTION: reports
 * Used in pages: Report page (create), Notification page (source of notifications),
 *                Dashboard (recent activity)
 */
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  description: { type: String, required: true },
  photo:       { type: String }, // base64 / image URL
  place:       { type: String, required: true },
  animalType:  { type: String, required: true },
  foundHow:    { type: String, required: true }, // how it was found (injured, stray, trapped, etc.)
  reportedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status:      { type: String, enum: ['Pending', 'In Progress', 'Rescued'], default: 'Pending' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
