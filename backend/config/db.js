// config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    } catch (error){
        console.error(`ERROR: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB ;