const Joi = require('joi');
const User = require('../models/user.model');

// Define the schema for registration
const registrationSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string()
        .min(6)
        .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.pattern.base': 'Password must contain both letters and numbers',
        }),
    role: Joi.string().default('employee')
});

// Register a new user
const register = async (req, res) => {
    // Validate the request body against the schema
    const { error } = registrationSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Authenticate a user and log them in
const login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const token = user.generateAuthToken();
        res.json({ token, username: user.username, role: user.role, message: 'User logged in successfully', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch all users
const allUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    allUsers,
    deleteUser
};
