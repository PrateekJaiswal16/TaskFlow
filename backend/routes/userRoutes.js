// routes/userRoutes.js

const express = require('express');
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    createUser,
    updateUserProfile,
    verifyPassword
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes in this file will be protected and admin-only


router.route('/profile').put(protect, updateUserProfile);
router.route('/verify-password').post(protect, verifyPassword);
// Routes for user management
router.use(protect);
router.use(admin);
router.route('/')
    .get(getAllUsers) // GET /api/users
    .post(createUser);

router.route('/:id')
    .get(getUserById)      // GET /api/users/:id
    .put(updateUser)       // PUT /api/users/:id
    .delete(deleteUser);   // DELETE /api/users/:id

module.exports = router;