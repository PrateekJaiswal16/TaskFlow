const express = require('express');
const router = express.Router();

const {
    createTask,
    getMyTasks,
    getAllTasksForAdmin,
    getTaskById,
    updateTask,
    deleteTask,
    requestStatusChange
} = require('../controllers/taskController');

const { protect, admin } = require('../middleware/authMiddleware');

// This middleware ensures a user is logged in for all task-related routes
router.use(protect);

// --- ROUTES FOR REGULAR USERS ---
// A regular user gets their own tasks from the root endpoint
router.route('/').get(getMyTasks);

// A regular user can view a specific task by ID (authorization is in the controller)
// and request a status change for it.
router.route('/:id').get(getTaskById);
router.route('/:id/request-change').patch(requestStatusChange);

// --- ROUTES FOR ADMINS ---
// Admins have their own endpoint to get ALL tasks with full filtering
router.route('/admin/all').get(admin, getAllTasksForAdmin);

// Admins can create, update, and delete tasks
// The middleware from the controller is spread here
router.route('/').post(admin, ...createTask);
router.route('/:id').put(admin, ...updateTask);
router.route('/:id').delete(admin, deleteTask);


module.exports = router;