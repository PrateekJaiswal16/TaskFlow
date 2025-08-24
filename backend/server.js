// server.js
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();


const express = require('express');

const cors = require('cors');
const connectDB = require('./config/db');
// const fileupload = require('express-fileupload');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');




// Connect to the database
connectDB();

const app = express();

//Middleware

app.use(cors()); //Enable cross origin resource sharing
app.use(express.json()); //Allow the server to accept JSON in request body
// app.use(fileupload({ useTempFiles: true }));


const PORT = process.env.PORT || 8000;

app.get('/', (req,res) => {
    res.send('Task manager api is running');
});

//Use Routes
app.use('/api/auth', authRoutes); // Any request to /api/auth/... will be handled by authRoutes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT} and is accessible on your local network`);
});