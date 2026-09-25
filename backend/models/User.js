/**
 * COLLECTION: users
 * Used in pages: Registration, Admin Login, Volunteer Login, Dashboard,
 *                Volunteers (search/filter), Leaderboard
 * Holds BOTH the admin account and every registered volunteer (role field
 * separates them). Only role='volunteer' accounts are created via the
 * public Registration page; the admin account is seeded once (see seed/seedAdmin.js)
 * with the fixed credentials admin@rescueconnect / rescueconnect@123 and can never
 * be created through registration.
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, minlength: 3, trim: true },
  lastname:  { type: String, required: true, trim: true },
  phone:     { type: String, required: true, match: /^[0-9]{10}$/ },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true }, // bcrypt hash, min 8 alnum enforced at validation layer
  age:       { type: Number, required: true, min: 18, max: 60 },
  gender:    { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  place:     { type: String, required: true, trim: true },
  role:      { type: String, enum: ['admin', 'volunteer'], default: 'volunteer' },
  score:     { type: Number, default: 0 }, // used by Leaderboard page
  approved:  { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
