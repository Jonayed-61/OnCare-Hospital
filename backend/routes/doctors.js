const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// GET /api/doctors - fetch all doctors with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      specialty, 
      location, 
      search, 
      available 
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (specialty) {
      filter.specialty = { $regex: specialty, $options: 'i' };
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (available === 'true') {
      filter.isAvailable = true;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: '-__v'
    };

    const doctors = await Doctor.paginate(filter, options);
    
    res.json({
      success: true,
      doctors: doctors.docs,
      pagination: {
        page: doctors.page,
        limit: doctors.limit,
        totalPages: doctors.totalPages,
        totalDoctors: doctors.totalDocs,
        hasNext: doctors.hasNextPage,
        hasPrev: doctors.hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching doctors', 
      error: error.message 
    });
  }
});

// GET /api/doctors/:id - fetch single doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-__v');
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }
    
    res.json({ 
      success: true, 
      doctor 
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid doctor ID' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching doctor', 
      error: error.message 
    });
  }
});

// GET /api/doctors/email/:email - check if email exists
router.get('/email/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase().trim();
    const doctor = await Doctor.findOne({ email }).select('name email');
    
    res.json({ 
      success: true, 
      exists: !!doctor,
      doctor: doctor || null
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error checking email', 
      error: error.message 
    });
  }
});

// POST /api/doctors - create new doctor
router.post('/', async (req, res) => {
  try {
    const { email, name, specialty } = req.body;

    // Basic validation
    if (!email || !name || !specialty) {
      return res.status(400).json({
        success: false,
        message: 'Email, name, and specialty are required'
      });
    }

    // Check if doctor with email already exists
    const existingDoctor = await Doctor.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this email already exists'
      });
    }

    // Prepare data
    const doctorData = {
      ...req.body,
      email: req.body.email.toLowerCase().trim(),
      name: req.body.name.trim(),
      specialty: req.body.specialty.trim(),
      location: req.body.location?.trim(),
      experience: req.body.experience?.trim(),
      education: req.body.education?.trim(),
      availability: req.body.availability?.trim(),
      about: req.body.about?.trim()
    };

    const doctor = new Doctor(doctorData);
    const savedDoctor = await doctor.save();
    
    // Remove sensitive data from response
    const responseDoctor = savedDoctor.toObject();
    delete responseDoctor.__v;
    
    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      doctor: responseDoctor
    });
    
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this email already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }
    
    console.error('Error creating doctor:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating doctor',
      error: error.message
    });
  }
});

// PUT /api/doctors/:id - update doctor
router.put('/:id', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is being updated and if it conflicts with another doctor
    if (email) {
      const existingDoctor = await Doctor.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: req.params.id }
      });
      
      if (existingDoctor) {
        return res.status(400).json({
          success: false,
          message: 'Another doctor with this email already exists'
        });
      }
    }

    // Prepare update data
    const updateData = { ...req.body };
    if (email) updateData.email = email.toLowerCase().trim();
    if (updateData.name) updateData.name = updateData.name.trim();
    if (updateData.specialty) updateData.specialty = updateData.specialty.trim();

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        select: '-__v'
      }
    );
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Doctor updated successfully',
      doctor
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Another doctor with this email already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid doctor ID' 
      });
    }
    
    console.error('Error updating doctor:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating doctor',
      error: error.message
    });
  }
});

// DELETE /api/doctors/:id - delete doctor
router.delete('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Doctor not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Doctor deleted successfully' 
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid doctor ID' 
      });
    }
    
    console.error('Error deleting doctor:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting doctor', 
      error: error.message 
    });
  }
});

// GET /api/doctors/specialties/list - get all unique specialties
router.get('/specialties/list', async (req, res) => {
  try {
    const specialties = await Doctor.distinct('specialty');
    res.json({
      success: true,
      specialties: specialties.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching specialties',
      error: error.message
    });
  }
});

// GET /api/doctors/locations/list - get all unique locations
router.get('/locations/list', async (req, res) => {
  try {
    const locations = await Doctor.distinct('location');
    res.json({
      success: true,
      locations: locations.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching locations',
      error: error.message
    });
  }
});

module.exports = router;