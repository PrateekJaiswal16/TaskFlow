// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


//Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    //1. Check if the token exists in the header
    if(req.headers.authorization &&  req.headers.authorization.startsWith('Bearer')){
        try{
            //2. Get token from the header (it's in the formate of  "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            //3. Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //4. Get user from the token's payload (the user ID)
            // Attach the user object to the request, but exclude the password
            req.user = await User.findById(decoded.id).select('-password');

            //5. Move to the next function in the chain
            next();
        }catch (error){
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if(!token){
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    // We check the user object that is attached in the 'protect' middleware
    if(req.user && req.user.role === 'admin'){
        next();
    }
    else{
        res.status(403)
    }
};

module.exports = {protect, admin};