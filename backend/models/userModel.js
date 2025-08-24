// models/userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true, // No two users can have the same email
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ['user' , 'admin'], // Role can only be one of these two values
        default: 'user', // New users are 'user' by default
    },

},{
    timestamps: true // Automatically adds createdAt and updatedAt fields
});


// Mongoose middlewaare to  hash password before saving
userSchema.pre('save', async function (next){
    // Only hash the password if it has been modified ( or is new)
    if(!this.isModified('password')) {
        return next();
    }

    // Generate a salt and hash the password

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); 

});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);