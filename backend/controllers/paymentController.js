const Payment = require('../models/Payment');
const Rental = require('../models/Rental');
const Customer = require('../models/Customer');

const addPayment = async (req, res) => {
  try {
    const {
      rental,
      customer,
      amount,
      paymentType,
      paymentMethod,
      paymentStatus,
      transactionId,
    } = req.body;

    const rentalExists = await Rental.findById(rental);
    const customerExists = await Customer.findById(customer);

    if (!rentalExists) {
      return res.status(404).json({
        message: 'Rental not found',
      });
    }

    if (!customerExists) {
      return res.status(404).json({
        message: 'Customer not found',
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: 'Amount must be greater than zero',
      });
    }

    const payment = await Payment.create({
      rental,
      customer,
      amount,
      paymentType,
      paymentMethod,
      paymentStatus,
      transactionId,
    });

    res.status(201).json({
      message: 'Payment added successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('rental')
      .populate('customer');

    res.status(200).json({
      message: 'Payments fetched successfully',
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addPayment,
  getPayments,
};
