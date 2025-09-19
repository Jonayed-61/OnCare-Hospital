const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const careersRoutes = require('./routes/careers');
const partnerRoutes = require('./routes/partners');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to database
connectDB();

// Store connected users and support agents
const connectedUsers = new Map();
const supportAgents = new Map();
const typingUsers = new Set();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining the chat
  socket.on('join-chat', (userData) => {
    const { userId, userName } = userData;
    
    // Store user information
    connectedUsers.set(socket.id, {
      userId,
      userName,
      isSupport: false,
      joinedAt: new Date(),
      socketId: socket.id
    });
    
    console.log(`User ${userName} (${userId}) joined the chat`);
    
    // Notify support agents about new user
    socket.broadcast.emit('user-joined', {
      userId,
      userName,
      timestamp: new Date()
    });
  });

  // Handle support agent joining
  socket.on('join-support', (agentData) => {
    const { agentId, agentName } = agentData;
    
    // Store agent information
    connectedUsers.set(socket.id, {
      userId: agentId,
      userName: agentName,
      isSupport: true,
      joinedAt: new Date(),
      socketId: socket.id
    });
    
    supportAgents.set(agentId, socket.id);
    
    console.log(`Support agent ${agentName} (${agentId}) joined the chat`);
    
    // Send list of connected users to the support agent
    const users = Array.from(connectedUsers.values())
      .filter(user => !user.isSupport);
    
    socket.emit('users-list', users);
  });

  // Handle message sending
  socket.on('send-message', (messageData) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const message = {
        ...messageData,
        timestamp: new Date(),
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: user.userId,
        senderName: user.userName,
        isSupport: user.isSupport
      };
      // If admin (support) sends a message, also emit to the specific user if userId is present
      if (user.isSupport && messageData.targetUserId) {
        for (const [sockId, info] of connectedUsers.entries()) {
          if (info.userId === messageData.targetUserId && !info.isSupport) {
            io.to(sockId).emit('receive-message', message);
          }
        }
      }
      // If user sends a message, emit to all support agents and to self only (not all clients)
      if (!user.isSupport) {
        for (const [sockId, info] of connectedUsers.entries()) {
          if (info.isSupport) {
            io.to(sockId).emit('receive-message', message);
          }
        }
        // Also send to self (user)
        socket.emit('receive-message', message);
      }
      // For admin, also send to self
      if (user.isSupport) {
        socket.emit('receive-message', message);
      }
      console.log(`Message from ${user.userName}: ${messageData.message}`);
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    const user = connectedUsers.get(socket.id);
    
    if (user) {
      typingUsers.add(socket.id);
      socket.broadcast.emit('user-typing', {
        userId: user.userId,
        userName: user.userName,
        isTyping: true
      });
    }
  });

  socket.on('typing-stop', (data) => {
    const user = connectedUsers.get(socket.id);
    
    if (user) {
      typingUsers.delete(socket.id);
      socket.broadcast.emit('user-typing', {
        userId: user.userId,
        userName: user.userName,
        isTyping: false
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`User ${socket.id} disconnected: ${reason}`);
    const user = connectedUsers.get(socket.id);
    
    if (user) {
      connectedUsers.delete(socket.id);
      
      if (user.isSupport) {
        supportAgents.delete(user.userId);
        console.log(`Support agent ${user.userName} disconnected`);
      } else {
        console.log(`User ${user.userName} disconnected`);
        
        // Notify support agents about user leaving
        socket.broadcast.emit('user-left', {
          userId: user.userId,
          userName: user.userName,
          timestamp: new Date()
        });
      }
    }
    
    // Remove from typing users
    if (typingUsers.has(socket.id)) {
      typingUsers.delete(socket.id);
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/admin', adminRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Chat stats endpoint
app.get('/api/chat/stats', (req, res) => {
  const users = Array.from(connectedUsers.values());
  const stats = {
    totalUsers: users.filter(user => !user.isSupport).length,
    totalAgents: users.filter(user => user.isSupport).length,
    typingUsers: typingUsers.size,
    connectedSockets: users.length
  };
  
  res.json(stats);
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

module.exports = app;