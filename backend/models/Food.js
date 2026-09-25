/**
 * COLLECTION: foods
 * Used in page: Food Details page
 */
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  animalType: { type: String, required: true },
  foodName:   { type: String, required: true },
  quantity:   { type: String, required: true }, // e.g. "200g/day"
  frequency:  { type: String, required: true }, // e.g. "Twice a day"
  notes:      { type: String },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', foodSchema);
