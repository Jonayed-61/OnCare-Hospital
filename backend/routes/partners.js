const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PartnerApplication = require('../models/PartnerApplication'); // Make sure this path is correct

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/partners/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only document and image files are allowed'));
    }
  }
});

// Submit partnership application
router.post('/apply', upload.fields([
  { name: 'businessLicense', maxCount: 1 },
  { name: 'taxCertificate', maxCount: 1 },
  { name: 'additionalDocuments', maxCount: 5 }
]), async (req, res) => {
  try {
    const {
      organizationName,
      organizationType,
      contactPerson,
      email,
      phone,
      address,
      city,
      servicesOffered,
      yearsInOperation,
      numberOfStaff,
      website,
      message
    } = req.body;

    // Create new application
    const application = new PartnerApplication({
      organizationName,
      organizationType,
      contactPerson,
      email,
      phone,
      address,
      city,
      servicesOffered: servicesOffered.split(',').map(service => service.trim()),
      yearsInOperation,
      numberOfStaff,
      website,
      message,
      status: 'pending'
    });

    // Add file paths if uploaded
    if (req.files) {
      if (req.files.businessLicense) {
        application.businessLicense = req.files.businessLicense[0].path;
      }
      if (req.files.taxCertificate) {
        application.taxCertificate = req.files.taxCertificate[0].path;
      }
      if (req.files.additionalDocuments) {
        application.additionalDocuments = req.files.additionalDocuments.map(file => file.path);
      }
    }

    await application.save();
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
});

// Get all applications (admin only)
router.get('/applications', async (req, res) => {
  try {
    const applications = await PartnerApplication.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
});

// Get application by ID
router.get('/applications/:id', async (req, res) => {
  try {
    const application = await PartnerApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
});

// Update application status (admin only)
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const application = await PartnerApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Application status updated',
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message
    });
  }
});

module.exports = router;