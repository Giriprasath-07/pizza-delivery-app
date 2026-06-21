const express = require('express');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { customerId, items, deliveryAddress, paymentMethod, notes } = req.body;

    let subtotal = 0;
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      subtotal += menuItem.price * item.quantity;
    }

    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryFee = 50;
    const totalAmount = subtotal + tax + deliveryFee;

    const orderNumber = 'ORD' + Date.now();

    const order = new Order({
      orderNumber,
      customerId,
      items,
      deliveryAddress,
      subtotal,
      tax,
      deliveryFee,
      totalAmount,
      paymentMethod,
      notes
    });

    await order.save();

    res.status(201).json({
      order,
      message: 'Order placed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.userId })
      .populate('items.menuItemId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('customerId')
      .populate('items.menuItemId')
      .populate('deliveryPartnerId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:orderId/rate', async (req, res) => {
  try {
    const { rating, review } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { rating, review, updatedAt: Date.now() },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;