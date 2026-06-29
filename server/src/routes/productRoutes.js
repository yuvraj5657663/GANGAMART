const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');

// Routes
router.route('/').get(getProducts).post(createProduct);

module.exports = router;