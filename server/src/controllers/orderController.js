const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Sirf logged-in users ke liye)
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            // Naya order create karein aur req.user.id se connect karein
            const order = new Order({
                user: req.user._id,
                orderItems,
                shippingAddress,
                totalPrice
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addOrderItems };