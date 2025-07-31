const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public get products
router.route('/').get(getProducts);

// Create product (admin) - also accessible at /api/admin/products but keep for convenience
router.route('/').post(protect, admin, createProduct);

// Reviews
router.route('/:id/reviews').post(protect, createProductReview);

router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

module.exports = router;