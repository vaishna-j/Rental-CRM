const Rental = require('../models/Rental');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

const createRental = async (req, res) => {
  try {
    const {
      customer,
      product,
      startDate,
      dueDate,
      rentalRate,
      securityDeposit,
    } = req.body;

    const customerExists = await Customer.findById(customer);
    const productExists = await Product.findById(product);

    if (!customerExists) {
      return res.status(404).json({
        message: 'Customer not found',
      });
    }

    if (!productExists) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    if (productExists.status !== 'Available') {
      return res.status(400).json({
        message: 'Product is not available',
      });
    }

    if (new Date(dueDate) <= new Date(startDate)) {
      return res.status(400).json({
        message: 'Due date must be after start date',
      });
    }

    const rental = await Rental.create({
      customer,
      product,
      startDate,
      dueDate,
      rentalRate,
      securityDeposit,
      status: 'Reserved',
    });

    productExists.status = 'Rented';
    await productExists.save();

    res.status(201).json({
      message: 'Rental created successfully',
      rental,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('customer')
      .populate('product');

    res.status(200).json({
      message: 'Rentals fetched successfully',
      rentals,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const dispatchRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        message: 'Rental not found',
      });
    }

    if (rental.status !== 'Reserved') {
      return res.status(400).json({
        message: 'Only Reserved rentals can be dispatched',
      });
    }

    rental.status = 'Dispatched';

    await rental.save();

    res.status(200).json({
      message: 'Rental dispatched successfully',
      rental,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const returnRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        message: 'Rental not found',
      });
    }

    if (rental.status !== 'Dispatched') {
      return res.status(400).json({
        message: 'Only Dispatched rentals can be returned',
      });
    }

    const { returnCondition, damageDescription, damageCost } = req.body;

    if (returnCondition && !['Good', 'Damaged'].includes(returnCondition)) {
      return res.status(400).json({
        message: 'Invalid return condition',
      });
    }

    const cost = Number(damageCost) || 0;

    if (cost < 0) {
      return res.status(400).json({
        message: 'Damage cost cannot be negative',
      });
    }

    const today = new Date();
    const dueDate = new Date(rental.dueDate);

    let lateDays = 0;

    if (today > dueDate) {
      lateDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
    }

    rental.lateFee = lateDays * rental.rentalRate;
    rental.returnDate = today;

    rental.returnCondition = returnCondition || 'Good';
    rental.damageDescription = damageDescription || '';
    rental.damageCost = cost;

    rental.status = 'Returned';

    await rental.save();

    const product = await Product.findById(rental.product);

    if (product) {
      product.status =
        rental.returnCondition === 'Damaged' ? 'Maintenance' : 'Available';

      await product.save();
    }

    res.status(200).json({
      message: 'Rental returned successfully',
      lateDays,
      lateFee: rental.lateFee,
      returnCondition: rental.returnCondition,
      damageDescription: rental.damageDescription,
      damageCost: rental.damageCost,
      rental,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createRental,
  getRentals,
  dispatchRental,
  returnRental,
};
