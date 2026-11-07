const Customer = require('../models/Customer');

const addCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json({
      message: 'Customer added successfully',
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();

    res.status(200).json({
      customers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addCustomer,
  getCustomers,
};
