const User = require('../models/User');
const Bug = require('../models/Bug');

//get all users without password
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//get single user
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user) {
            return res.status(404).json({ error: error.message });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//update user
const updateUser = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).json({ error: 'Invalid Updates' });
    }
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if(user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            
        }
    }
}