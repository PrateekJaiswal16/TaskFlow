// controllers/userController.js

const User = require('../models/userModel');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    // Find the full user document, including the hashed password
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // If the user is trying to change their password
        if (req.body.newPassword) {
            // 1. Check if the 'currentPassword' was provided
            if (!req.body.currentPassword) {
                return res.status(400).json({ message: 'Current password is required to change password.' });
            }
            
            // 2. Check if the provided current password matches the one in the database
            const isMatch = await user.matchPassword(req.body.currentPassword);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid current password.' });
            }

            // 3. If it matches, set the new password
            user.password = req.body.newPassword;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// ** NEW FUNCTION **
// @desc    Verify user's current password
// @route   POST /api/users/verify-password
// @access  Private
exports.verifyPassword = async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(req.user._id);
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({ message: 'Password verified successfully.' });
    } else {
        res.status(401).json({ message: 'Invalid password.' });
    }
};


// ** NEW FUNCTION **
// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password, // The pre-save hook in your model will hash this automatically
        role,
        company: req.user.company,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};


// @desc Get all users
// @routes GET /api/users
// @access Private/Admin
exports.getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc Get user by Id
// @routes GET /api/users/:id
// @access Private/Admin
exports.getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if(user){
        res.json(user);
    }
    else{
        res.status(404).json({message: 'User not found'});
    }
};


// @desc Update user
// @routes PUT /api/users/:id
// @access Private/Admin
exports.updateUser = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });

    }
    else{
        res.status(404).json({message: 'User not found'});
    }
};

// @desc delete user by Id
// @routes Delete /api/users/:id
// @access Private/Admin
exports.deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if(user){
        await user.deleteOne();
        res.json({message: 'User removed'});
    }
    else{
        res.status(404).json({message: 'User not found'});
    }
};