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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      joinedAt: new Date()
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
      joinedAt: new Date()
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
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Broadcast to all connected clients
      io.emit('receive-message', message);
      
      console.log(`Message from ${user.userName}: ${messageData.message}`);
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    const user = connectedUsers.get(socket.id);
    
    if (user) {
      typingUsers.add(socket.id);
      socket.broadcast.emit('user-typing', {
        userId: data.userId,
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
        userId: data.userId,
        userName: user.userName,
        isTyping: false
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
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

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Chat stats endpoint
app.get('/api/chat/stats', (req, res) => {
  const stats = {
    totalUsers: Array.from(connectedUsers.values()).filter(user => !user.isSupport).length,
    totalAgents: Array.from(connectedUsers.values()).filter(user => user.isSupport).length,
    typingUsers: typingUsers.size
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
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});