const jwt = require('jsonwebtoken');

const generateToken = (id, companyId) => {
    // Add both the user ID and company ID to the token's payload
    return jwt.sign({ id, companyId }, process.env.JWT_SECRET, {
        expiresIn: '7d', // The token will expire in 7 days
    });
};

module.exports = generateToken;