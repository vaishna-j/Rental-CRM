const Rental = require('../models/Rental');

const getRentalReports = async (req, res) => {
  try {
    const totalRentals = await Rental.countDocuments();

    const activeRentals = await Rental.countDocuments({
      status: { $ne: 'Returned' },
    });

    const completedRentals = await Rental.countDocuments({
      status: 'Returned',
    });

    const revenue = await Rental.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: '$rentalRate',
          },
          totalLateFee: {
            $sum: '$lateFee',
          },
        },
      },
    ]);

    const totalRevenue = revenue.length > 0 ? revenue[0].totalRevenue : 0;

    const totalLateFee = revenue.length > 0 ? revenue[0].totalLateFee : 0;

    res.status(200).json({
      message: 'Rental reports fetched successfully',
      totalRentals,
      activeRentals,
      completedRentals,
      totalRevenue,
      totalLateFee,
      totalIncome: totalRevenue + totalLateFee,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getRentalReports,
};
