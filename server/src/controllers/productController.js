const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product (Admin feature ideally, but keeping it simple for now)
// @route   POST /api/products
const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, countInStock } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            image,
            category,
            countInStock
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, createProduct };