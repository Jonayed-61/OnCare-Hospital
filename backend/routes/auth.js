const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Doctor = require('../models/doctor'); // Add Doctor model
const multer = require('multer'); // Add multer for file uploads
const path = require('path');
const router = express.Router();

// Configure multer for file uploads (add this after imports)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Your existing register endpoint remains the same
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword, userType } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      userType
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (excluding password)
    const userResponse = {
      _id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      phone: savedUser.phone,
      userType: savedUser.userType,
      createdAt: savedUser.createdAt
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Your existing login endpoint remains the same
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if credentials match an admin
    const Admin = require('../models/admin');
    const bcrypt = require('bcryptjs');
    const admin = await Admin.findOne({ email });
    if (admin && await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({
        message: 'Login successful',
        user: {
          id: admin._id,
          email: admin.email,
          role: admin.role ? admin.role.toLowerCase() : 'admin',
          phone: admin.phone
        },
        token
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (excluding password)
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add doctor registration endpoint (new endpoint)
router.post('/doctor-register', upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      specialty,
      experience,
      education,
      location,
      availability,
      languages,
      about,
      services,
      achievements
    } = req.body;

    // Validation
    if (!name || !specialty || !experience || !education || !location || !availability || !languages || !about || !services) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Create new doctor
    const doctor = new Doctor({
      name,
      specialty,
      experience,
      education,
      location,
      availability,
      languages: languages.split(',').map(lang => lang.trim()),
      about,
      services: services.split(',').map(service => service.trim()),
      achievements: achievements ? achievements.split(',').map(ach => ach.trim()) : [],
      image: req.file ? req.file.filename : null,
      status: 'pending' // Set initial status as pending
    });

    // Save to database
    await doctor.save();

    res.status(201).json({ 
      message: 'Application submitted successfully!', 
      doctorId: doctor._id 
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Failed to submit application' });
  }
});

module.exports = router;