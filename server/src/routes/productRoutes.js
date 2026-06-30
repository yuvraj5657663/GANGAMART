const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getProducts, createProduct, deleteProduct } = require('../controllers/productController');

// Routes
// GET se saare products milenge, aur POST (protect + admin) se naya product banega
router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

// DELETE request se product remove hoga id ke basis par
router.route('/:id')
    .delete(protect, admin, deleteProduct);

module.exports = router;