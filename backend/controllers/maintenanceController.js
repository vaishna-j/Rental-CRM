const Maintenance = require('../models/Maintenance');
const Product = require('../models/Product');

const addMaintenance = async (req, res) => {
  try {
    const { product, issue, maintenanceDate, cost } = req.body;

    const productExists = await Product.findById(product);

    if (!productExists) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    const maintenance = await Maintenance.create({
      product,
      issue,
      maintenanceDate,
      cost,
    });

    productExists.status = 'Maintenance';
    await productExists.save();

    res.status(201).json({
      message: 'Maintenance added successfully',
      maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.find().populate('product');

    res.status(200).json({
      maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateMaintenance = async (req, res) => {
  try {
    const { status } = req.body;

    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        message: 'Maintenance not found',
      });
    }

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid maintenance status',
      });
    }

    maintenance.status = status;
    await maintenance.save();

    if (status === 'Completed') {
      await Product.findByIdAndUpdate(maintenance.product, {
        status: 'Available',
      });
    }

    res.status(200).json({
      message: 'Maintenance status updated successfully',
      maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addMaintenance,
  getMaintenance,
  updateMaintenance,
};
