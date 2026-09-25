/**
 * /api/pets
 * Used by: Pet Booking page
 */
const express = require('express');
const Pet = require('../models/Pet');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, async (req, res) => {
  const pets = await Pet.find().sort({ createdAt: -1 });
  res.json(pets);
});

router.post('/', protect, async (req, res) => {
  const pet = await Pet.create(req.body);
  res.status(201).json(pet);
});

router.put('/:id/book', protect, async (req, res) => {
  const pet = await Pet.findByIdAndUpdate(req.params.id, { availability: 'Booked', bookedBy: req.user.id }, { new: true });
  res.json(pet);
});

module.exports = router;
