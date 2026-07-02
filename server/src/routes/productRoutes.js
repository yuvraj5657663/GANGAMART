const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
// 🔥 1. Yahan getProductById ko controller se import kijiye
const { 
  getProducts, 
  createProduct, 
  deleteProduct, 
  getProductsBySearch,
  getProductById, // Check kijiye ki productController.js mein ye naam hi hai na function ka
  getProductsByCategory,
} = require('../controllers/productController');

// Search route
router.get('/search', getProductsBySearch);

// Other routes
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/category/:categoryName', getProductsByCategory);

// 🔥 2. Yahan delete ke sath .get(getProductById) add kar diya hai
router.route('/:id')
  .get(getProductById) // Yeh line missing thi!
  .delete(protect, admin, deleteProduct);

module.exports = router;