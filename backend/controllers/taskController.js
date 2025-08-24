const Task = require('../models/taskModel');
const User = require('../models/userModel');
const { uploadFileToSupabase, deleteFromSupabase } = require('../utils/uploadSupabase');

// --- handlers --- //

const createTaskHandler = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedToEmail } = req.body;
    let documents = [];

    if (!assignedToEmail) {
      return res.status(400).json({ message: 'An email is required to assign the task.' });
    }
    const userToAssign = await User.findOne({ email: assignedToEmail });
    if (!userToAssign) {
      return res.status(404).json({ message: `User with email ${assignedToEmail} not found.` });
    }

    const files = req.files || [];
    if (files.length) {
      if (files.length > 3) {
        return res.status(400).json({ message: 'Cannot upload more than 3 files.' });
      }
      const userId = (req.user && (req.user._id || req.user.id)) || 'anonymous';
      const uploaded = await Promise.all(files.map(f => uploadFileToSupabase(f, userId)));
      documents = uploaded.map(u => ({
        url: u.url,
        filename: u.filename,
        public_id: u.storagePath,
      }));
    }

    const task = new Task({
      title, description, status, priority, dueDate,
      assignedTo: userToAssign._id,
      createdBy: req.user._id,
      attachedDocuments: documents,
    });

    const createdTask = await task.save();
    return res.status(201).json(createdTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(400).json({ message: 'Error creating task', error: error.message });
  }
};


// This is your existing function, now purely for regular users
const getMyTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    let query = { assignedTo: req.user._id }; // Always filter by the logged-in user
    let sortOptions = { createdAt: -1 };
    
    // Add other filters if provided
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.sortBy) {
      sortOptions = { [req.query.sortBy]: req.query.order === 'desc' ? -1 : 1 };
    }

    const totalTasks = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sortOptions).limit(limit).skip(skip)
      .populate('assignedTo', 'name email');

    return res.json({ tasks, page, pages: Math.ceil(totalTasks / limit), total: totalTasks });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// ** NEW FUNCTION ** specifically for admins
const getAllTasksForAdmin = async (req, res) => {
  // This function is the same as your previous getTasks, but without the user role check
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    let query = {};
    if (req.query.assignedTo) query.assignedTo = req.query.assignedTo;
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    // ... add any other admin filters like date range
    let sortOptions = { createdAt: -1 };
    if (req.query.sortBy) {
        sortOptions = { [req.query.sortBy]: req.query.order === 'desc' ? -1 : 1 };
    }
    const totalTasks = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sortOptions).limit(limit).skip(skip)
      .populate('assignedTo', 'name email').populate('createdBy', 'name email');
    return res.json({ tasks, page, pages: Math.ceil(totalTasks / limit), total: totalTasks });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.assignedTo._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to view this task' });
    }
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateTaskHandler = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Authorization is handled by middleware, but this is a good final check
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to perform this action' });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;

    if (req.body.assignedToEmail) {
      const userToAssign = await User.findOne({ email: req.body.assignedToEmail });
      if (!userToAssign) {
        return res.status(404).json({ message: `User with email ${req.body.assignedToEmail} not found.` });
      }
      task.assignedTo = userToAssign._id;
    }

    const files = req.files || [];
    if (files.length) {
      if (task.attachedDocuments.length + files.length > 3) {
        return res.status(400).json({ message: 'Cannot attach more than 3 files in total.' });
      }
      const userId = (req.user && (req.user._id || req.user.id)) || 'anonymous';
      const uploaded = await Promise.all(files.map(f => uploadFileToSupabase(f, userId)));
      const newDocs = uploaded.map(u => ({
        url: u.url,
        filename: u.filename,
        public_id: u.storagePath,
      }));
      task.attachedDocuments.push(...newDocs);
    }

    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Authorization check
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    for (const doc of task.attachedDocuments) {
      try { await deleteFromSupabase(doc.public_id); } catch (_) {}
    }

    await task.deleteOne();
    return res.json({ message: 'Task removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const requestStatusChange = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to change this task status' });
    }
    task.status = 'Pending Approval';
    const updatedTask = await task.save();
    return res.json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- export as an object (no surprises) --- //
module.exports = {
  createTask: [require('../middleware/uploadSupabase'), createTaskHandler],
  updateTask: [require('../middleware/uploadSupabase'), updateTaskHandler],
  getMyTasks,
  getAllTasksForAdmin,
  getTaskById,
  deleteTask,
  requestStatusChange,
};