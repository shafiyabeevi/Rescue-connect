/**
 * COLLECTION: pets
 * Used in page: Pet Booking / Adoption page
 */
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  animalType:   { type: String, required: true },
  age:          { type: Number, required: true },
  image:        { type: String },
  availability: { type: String, enum: ['Available', 'Booked', 'Adopted'], default: 'Available' },
  foodDetails:  { type: String },
  bookedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pet', petSchema);
