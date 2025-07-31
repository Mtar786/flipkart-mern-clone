const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Create order
router.post('/', protect, addOrderItems);

// My orders
router.get('/myorders', protect, getMyOrders);

// Order by ID
router.get('/:id', protect, getOrderById);

// Pay order
router.put('/:id/pay', protect, updateOrderToPaid);

// Deliver order (admin)
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;