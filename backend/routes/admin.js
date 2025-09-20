const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      user: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware for admin authentication
function adminAuth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

// Example protected admin route
router.get('/dashboard', adminAuth, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard!' });
});

// Get all pending doctor applications
router.get('/pending-doctors', adminAuth, async (req, res) => {
  try {
    const pendingDoctors = await Doctor.find({ status: 'pending' })
      .select('-password') // Exclude password
      .sort({ createdAt: -1 }); // Newest first
    res.json(pendingDoctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor by ID
router.get('/doctor/:id', adminAuth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve a doctor application
router.post('/approve-doctor/:id', adminAuth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    
    doctor.status = 'approved';
    doctor.approvedAt = new Date();
    doctor.approvedBy = req.admin.id;
    
    await doctor.save();
    
    // Remove password from response
    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;
    
    res.json({ 
      message: 'Doctor approved successfully',
      doctor: doctorResponse
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject a doctor application
router.post('/reject-doctor/:id', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    
    doctor.status = 'rejected';
    doctor.rejectionReason = reason;
    doctor.rejectedAt = new Date();
    
    await doctor.save();
    res.json({ message: 'Doctor application rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all approved doctors
router.get('/approved-doctors', adminAuth, async (req, res) => {
  try {
    const approvedDoctors = await Doctor.find({ status: 'approved' })
      .select('-password')
      .sort({ approvedAt: -1 });
    res.json(approvedDoctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all rejected doctors
router.get('/rejected-doctors', adminAuth, async (req, res) => {
  try {
    const rejectedDoctors = await Doctor.find({ status: 'rejected' })
      .select('-password')
      .sort({ rejectedAt: -1 });
    res.json(rejectedDoctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const pendingDoctors = await Doctor.countDocuments({ status: 'pending' });
    const approvedDoctors = await Doctor.countDocuments({ status: 'approved' });
    const rejectedDoctors = await Doctor.countDocuments({ status: 'rejected' });
    
    // Get recent approved doctors (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentApprovals = await Doctor.countDocuments({
      status: 'approved',
      approvedAt: { $gte: oneWeekAgo }
    });

    res.json({
      totalDoctors,
      pendingDoctors,
      approvedDoctors,
      rejectedDoctors,
      recentApprovals
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor information (admin edit)
router.put('/doctor/:id', adminAuth, async (req, res) => {
  try {
    const { name, specialty, experience, education, location, availability, languages, about, services, achievements } = req.body;
    
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    
    // Update fields
    if (name) doctor.name = name;
    if (specialty) doctor.specialty = specialty;
    if (experience) doctor.experience = experience;
    if (education) doctor.education = education;
    if (location) doctor.location = location;
    if (availability) doctor.availability = availability;
    if (languages) doctor.languages = languages;
    if (about) doctor.about = about;
    if (services) doctor.services = services;
    if (achievements) doctor.achievements = achievements;
    
    await doctor.save();
    
    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;
    
    res.json({ 
      message: 'Doctor updated successfully',
      doctor: doctorResponse
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete doctor (permanent deletion)
router.delete('/doctor/:id', adminAuth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctors by status with pagination
router.get('/doctors', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: '-password'
    };
    
    const doctors = await Doctor.paginate(query, options);
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;