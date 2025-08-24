// models/taskModel.js

const mongoose = require('mongoose');

//This is a sub-Schema for the attched documents

const documentSchema = new mongoose.Schema({
    url: {type: String, required: true},
    filename: { type: String, required: true},
    public_id: { type: String, required: true}
})

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: '',
    },

    status: {
        type: String,
        enum: ['To Do', 'In Progress', 'Pending Approval', 'Done'],
        default: 'To Do',
    },

    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },

    dueDate: {
        type: Date,
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId, // A special type for unique IDs
        ref: 'User', // This creates a reference to the 'User' model
        required: true,
    },

    createdBy: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    attachedDocuments: [documentSchema], // An array of documents using the sub-schema

    
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);