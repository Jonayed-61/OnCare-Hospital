const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const router = express.Router();

// Doctor registration route
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