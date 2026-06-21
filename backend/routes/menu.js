const express = require('express');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const items = await MenuItem.find(query);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, category, price, sizes, image, ingredients } = req.body;

    const item = new MenuItem({
      name,
      description,
      category,
      price,
      sizes,
      image,
      ingredients
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;