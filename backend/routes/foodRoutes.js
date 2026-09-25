/**
 * /api/foods
 * Used by: Food Details page
 */
const express = require('express');
const Food = require('../models/Food');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, async (req, res) => {
  const foods = await Food.find().sort({ animalType: 1 });
  res.json(foods);
});

router.post('/', protect, async (req, res) => {
  const food = await Food.create(req.body);
  res.status(201).json(food);
});

module.exports = router;
