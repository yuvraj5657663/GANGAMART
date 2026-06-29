const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON data parse karne ke liye


// routes middle ware
app.use('/api/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Gangamart API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});