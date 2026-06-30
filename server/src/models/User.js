const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    // 🔥 Yeh do fields aapke schema me honi zaroori hain password reset ke liye:
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

// Password ko database mein save karne se pehle encrypt karne ke liye middleware
userSchema.pre('save', async function (next) {
    // 1. Agar password modify nahi hua hai, toh aage badhein aur yahin se RETURN kar jayein
    if (!this.isModified('password')) {
        return next(); 
    }

    // 2. Agar password badla hai (ya naya user hai), tabhi hash karein
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);