// controllers/authController.js

const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// Controller function for registering the new user
exports.registerUser = async  (req,res) => {
    console.log(req.body);
    try{
        //1. Destructure name , email , password from req.body
        const {name, email, password, role} = req.body;

        //2. Check if the user with that email already exists
        const userExists = await User.findOne({email});

        if(userExists){
            //If the user.exists, send a 400 bad request response
            return res.status(400).json({messge: 'User already exists'});
        }

        //3. Crete a new user document
        const user = new User({
            name,
            email,
            password, //The plain text password
            role
        });

        //4. Save the new user to the database
        // Our pre-save middleware in userModel.js will automatically has the hash password 
        await user.save();

        //5. Send success response
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        })

    } catch (error){
        // If any error occurs , send a 500 Internal Server Error Response
        res.status(500).json({
            messge: 'Server Error', error: error.message
        });

    }
};


//Function for logging in a User
// Function for logging in a User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                // Pass both the user ID and their company ID to the token generator
                token: generateToken(user._id, user.company),
            });
        } else {
            res.status(401).json({
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
}