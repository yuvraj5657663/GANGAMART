const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getProducts, createProduct, deleteProduct, getProductsBySearch } = require('../controllers/productController');

// Search route
router.get('/search', getProductsBySearch);

// Other routes
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').delete(protect, admin, deleteProduct);

module.exports = router;