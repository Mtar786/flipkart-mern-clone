const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getUsers,
  deleteUser,
  updateUser
} = require('../controllers/userController');
const {
  deleteProduct,
  createProduct,
  updateProduct
} = require('../controllers/productController');
const { getOrders } = require('../controllers/orderController');
const { getDashboardSummary } = require('../controllers/adminController');

// Users
router.route('/users').get(protect, admin, getUsers);
router
  .route('/users/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

// Products
router.post('/products', protect, admin, createProduct);
router
  .route('/products/:id')
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

// Orders
router.get('/orders', protect, admin, getOrders);

// Dashboard Summary
router.get('/summary', protect, admin, getDashboardSummary);

module.exports = router;