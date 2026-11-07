const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rental',
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentType: {
      type: String,
      enum: ['Rental', 'Security Deposit', 'Late Fee', 'Damage Fee'],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Card', 'Bank Transfer'],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Paid',
    },

    transactionId: {
      type: String,
      default: '',
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
