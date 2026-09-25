/**
 * Run once: node seed/seedAdmin.js
 * Seeds the single fixed admin account + a few sample pets/foods so the
 * Pet Booking and Food Details pages aren't empty on first run.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectMongo = require('../config/db');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Food = require('../models/Food');
const syncMySQLUser = require('../utils/syncMySQLUser');

(async () => {
  await connectMongo();

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@rescueconnect').toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD || 'rescueconnect@123';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hash = await bcrypt.hash(adminPass, 10);
    admin = await User.create({
      firstname: 'Rescue', lastname: 'Admin', phone: '9999999999',
      email: adminEmail, password: hash, age: 30, gender: 'Other',
      place: 'Head Office', role: 'admin'
    });
    console.log('Admin created:', adminEmail);
  } else {
    console.log('Admin already exists:', adminEmail);
  }

  try {
    await syncMySQLUser(admin);
    console.log('Admin mirrored to MySQL.');
  } catch (mysqlError) {
    console.warn('[MySQL] Admin mirror skipped:', mysqlError.message);
  }

  const petCount = await Pet.countDocuments();
  if (petCount === 0) {
    await Pet.insertMany([
      { name: 'Bruno', animalType: 'Dog', age: 2, availability: 'Available', foodDetails: 'Dry kibble, 200g twice a day', image: '' },
      { name: 'Whiskers', animalType: 'Cat', age: 1, availability: 'Available', foodDetails: 'Wet food, 100g twice a day', image: '' },
      { name: 'Coco', animalType: 'Rabbit', age: 1, availability: 'Available', foodDetails: 'Hay + pellets, 3 times a day', image: '' }
    ]);
    console.log('Sample pets seeded.');
  }

  const foodCount = await Food.countDocuments();
  if (foodCount === 0) {
    await Food.insertMany([
      { animalType: 'Dog', foodName: 'Dry Kibble / Boiled Rice+Chicken', quantity: '200-400g/day', frequency: 'Twice a day' },
      { animalType: 'Cat', foodName: 'Wet Cat Food / Fish', quantity: '100-200g/day', frequency: 'Twice a day' },
      { animalType: 'Bird', foodName: 'Seeds, Grains, Fruits', quantity: '20-30g/day', frequency: 'Twice a day' },
      { animalType: 'Rabbit', foodName: 'Hay, Pellets, Vegetables', quantity: '150g/day', frequency: 'Three times a day' }
    ]);
    console.log('Sample food details seeded.');
  }

  console.log('Seeding complete.');
  process.exit(0);
})();
