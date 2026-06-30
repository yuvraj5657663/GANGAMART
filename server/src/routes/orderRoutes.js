const express = require('express');
const router = express.Router();
const { addOrderItems } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// POST request aane par pehle 'protect' chalega, fir 'addOrderItems'
router.route('/').post(protect, addOrderItems);

module.exports = router;