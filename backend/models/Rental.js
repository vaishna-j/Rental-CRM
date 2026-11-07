const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    returnDate: {
      type: Date,
    },

    rentalRate: {
      type: Number,
      required: true,
    },

    securityDeposit: {
      type: Number,
      required: true,
    },

    lateFee: {
      type: Number,
      default: 0,
    },

    returnCondition: {
      type: String,
      enum: ['Good', 'Damaged'],
      default: 'Good',
    },

    damageDescription: {
      type: String,
      default: '',
    },

    damageCost: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ['Reserved', 'Dispatched', 'Returned'],
      default: 'Reserved',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rental', rentalSchema);
