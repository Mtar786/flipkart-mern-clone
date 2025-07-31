const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * @desc    Get summary stats for admin dashboard
 * @route   GET /api/admin/summary
 * @access  Private/Admin
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments({});
  const productsCount = await Product.countDocuments({});
  const ordersCount = await Order.countDocuments({});
  const totalSalesAgg = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$totalPrice' }
      }
    }
  ]);
  const totalSales = totalSalesAgg[0] ? totalSalesAgg[0].totalSales : 0;
  res.json({ usersCount, productsCount, ordersCount, totalSales });
});

module.exports = { getDashboardSummary };