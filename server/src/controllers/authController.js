const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // 🔥 Token generation ke liye (Built-in)
const sendEmail = require('../utils/sendEmail'); // 🔥 Hamara email helper

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password - Send Reset Link
// @route   POST /api/auth/forgot-password
// @desc    Forgot Password - Send Reset Link (Atomic Update Version)
// @route   POST /api/auth/forgot-password
// @desc    Forgot Password - Send Reset Link (Case-Insensitive Version)
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide an email address' });
        }

        // 1. Raw token generate karein
        const resetToken = crypto.randomBytes(16).toString('hex');

        // 2. Token ko hash karein aur expiry set karein
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const tokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins expiry

        // 3. 🔥 Case-Insensitive Search using Regex ($options: 'i')
        // Isse small/capital dono tarike ke emails successfully match ho jayenge!
        const user = await User.findOneAndUpdate(
            { email: { $regex: `^${email.trim()}$`, $options: 'i' } },
            { 
                $set: { 
                    resetPasswordToken: hashedToken,
                    resetPasswordExpire: tokenExpiry
                } 
            },
            { new: true } // Updated data return karega
        );

        // Agar database me user nahi milta
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        // 4. Frontend url pipeline generate karein
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const htmlMessage = `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #0f172a; text-align: center;">Ganga<span style="color: #f97316;">Mart</span></h2>
                <p>Aapne apna password reset karne ke liye request kiya hai. Naya password set karne ke liye niche diye button par click karein:</p>
                <div style="text-align: center; margin: 25px 0;">
                    <a href="${resetUrl}" style="background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
                </div>
                <p style="font-size: 12px; color: #64748b;">Ye link sirf 15 minutes ke liye valid hai. Agar aapne ye request nahi ki thi, toh is mail ko ignore kar sakte hain.</p>
            </div>
        `;

        try {
            // Nodemailer helper fire karein
            await sendEmail({
                to: user.email, // Ye automatic DB se wahi email uthayega jo match hua hai
                subject: 'GangaMart - Password Reset Link',
                html: htmlMessage,
            });

            return res.status(200).json({ message: 'Password reset link sent to your email successfully! 🚀' });
        } catch (mailError) {
            // Rollback tokens if email fails
            await User.findOneAndUpdate(
                { email: { $regex: `^${email.trim()}$`, $options: 'i' } },
                { $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 } }
            );
            return res.status(500).json({ message: `Email Error: ${mailError.message}` });
        }

    } catch (error) {
        return res.status(500).json({ message: `Controller Catch: ${error.message}` });
    }
};

// @desc    Reset Password - Update Password in DB
// @route   PUT /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }

        // Naya password hash karke set karein
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Password Reset Successful! 🎉 Ab aap login kar sakte hain.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };