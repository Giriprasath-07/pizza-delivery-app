const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['pizza', 'sides', 'beverages', 'desserts'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sizes: [
    {
      size: { type: String, enum: ['small', 'medium', 'large', 'xlarge'] },
      price: Number
    }
  ],
  image: String,
  ingredients: [String],
  isAvailable: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);