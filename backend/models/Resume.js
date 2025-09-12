const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    position: {
        type: String,
        trim: true
    },
    coverLetter: {
        type: String,
        trim: true
    },
    resumePath: {
        type: String,
        required: true
    },
    resumeName: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for better query performance
resumeSchema.index({ email: 1, submittedAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);