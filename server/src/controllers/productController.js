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

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductsBySearch = async (req, res) => {
    try {
        const { q } = req.query;
        // Limit lagayi hai taaki 5 se zyada results dropdown mein na aayein
        const products = await Product.find({
            name: { $regex: q, $options: 'i' }
        }).limit(5).select('name price image'); 
        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Dono ko export list mein jodiye (jo file ke end mein hoti hai)
module.exports = { getProducts, createProduct, deleteProduct, getProductsBySearch };