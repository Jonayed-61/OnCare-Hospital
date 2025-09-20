const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Doctor = require('../models/Doctor');
const router = express.Router();

// User registration route
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, userType } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      userType: userType || 'patient'
    });

    // Save user to database
    await user.save();

    // Create JWT token
    const payload = {
      userId: user.id,
      userType: user.userType
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          message: 'Registration successful',
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType: user.userType
          }
        });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'yoursecretkey',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Doctor registration route (keep your existing code)
router.post('/doctor-register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialty,
      experience,
      education,
      location,
      availability,
      languages,
      about,
      services,
      achievements,
      phone,
      consultationFee
    } = req.body;

    // Check if doctor already exists
    let doctor = await Doctor.findOne({ email });
    if (doctor) {
      return res.status(400).json({ message: 'Doctor already exists with this email' });
    }

    // Create new doctor
    doctor = new Doctor({
      name,
      email,
      password,
      specialty,
      experience: parseInt(experience) || 0,
      education,
      location,
      availability,
      languages: Array.isArray(languages) ? languages : [],
      about,
      services: Array.isArray(services) ? services : [],
      achievements: Array.isArray(achievements) ? achievements : [],
      phone,
      consultationFee: parseInt(consultationFee) || 0
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(password, salt);

    // Save doctor to database
    await doctor.save();

    // Create JWT token
    const payload = {
      doctor: {
        id: doctor.id,
        role: 'doctor'
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          message: 'Doctor registration successful',
          token,
          doctor: {
            id: doctor._id,
            name: doctor.name,
            email: doctor.email,
            specialty: doctor.specialty
          }
        });
      }
    );
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;