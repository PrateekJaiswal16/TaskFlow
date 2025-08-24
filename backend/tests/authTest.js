// tests/auth.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const dotenv =require('dotenv');

// Load environment variables for the test environment
dotenv.config({ path: './.env' });

// We need to create an app instance for testing
const app = express();
app.use(express.json());

// Import and use your routes
const authRoutes = require('../routes/authRoutes');
app.use('/api/auth', authRoutes);

// Connect to a test database before all tests
beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI);
});

// Disconnect after all tests are done
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth API', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                // Use a unique email for each test run to avoid 'user already exists' error
                email: `test${Date.now()}@example.com`,
                password: 'password123',
            });

        // Assertions
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'Test User');
    });
});
