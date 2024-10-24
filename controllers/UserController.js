const User = require('../models/UserSchema');
const jwt = require('jsonwebtoken');
const bycrypt = require('bcrypt');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // all input required
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false,
            });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User with this email already exists',
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bycrypt.hash(password, 10);

        // Create a new user
        await User.create({ name, email, password: hashedPassword });
        return res.status(201).json({
            message: 'User created successfully',
            success: true,
        });
    } catch (error) {
        console.error(error);
    }
}

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // all input required
        if (!email || !password) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false,
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        // Compare password
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Incorrect password',
                success: false,
            });
        }

        // Create and send JWT token
        const token = jwt.sign({ _id: user._id, userName: user.name, email }, process.env.SECRET_KEY);

        return res.cookie('token', token, { expiresIn: '24h' }).json({
            message: `Welcome ${user.name}`,
            success: true,
        });
    } catch (error) {
        console.error(error);
    }
}

const logout = async (req, res) => {
    try {
        return res.clearCookie('token').status(200).json({
            message: 'Logged out successfully',
            success: true,
        })
    } catch (error) {
        console.error(error);
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.user;

        const user = await User.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        return res.status(200).json({
            message: 'User profile',
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    signup, signin, logout, getProfile,
};