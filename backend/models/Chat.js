const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isSupport: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String
  },
  // Add these new fields for AI responses
  isAIResponse: {
    type: Boolean,
    default: false
  },
  intent: {
    type: String
  },
  confidence: {
    type: Number
  }
});

// Index for better query performance
chatSchema.index({ userId: 1, timestamp: -1 });
chatSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Chat', chatSchema);