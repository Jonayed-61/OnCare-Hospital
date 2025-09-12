const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const router = express.Router();

// Ensure upload directory exists
const uploadDir = 'uploads/resumes/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Check file type
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

// POST route for resume submission
router.post('/submit-resume', upload.single('resume'), handleMulterError, async (req, res) => {
    try {
        const { name, email, phone, position, coverLetter } = req.body;
        const resumeFile = req.file;

        // Validate required fields
        if (!name || !email || !resumeFile) {
            // If validation fails, delete the uploaded file
            if (resumeFile) {
                fs.unlinkSync(resumeFile.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Name, email, and resume are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (resumeFile) {
                fs.unlinkSync(resumeFile.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Save to database
        const resumeApplication = new Resume({
            name,
            email,
            phone: phone || '',
            position: position || '',
            coverLetter: coverLetter || '',
            resumePath: resumeFile.path,
            resumeName: resumeFile.originalname,
            submittedAt: new Date()
        });

        await resumeApplication.save();

        res.status(200).json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                id: resumeApplication._id,
                name,
                email,
                phone: phone || '',
                position: position || '',
                resume: resumeFile.filename
            }
        });
    } catch (error) {
        console.error('Resume submission error:', error);
        
        // Delete the uploaded file if an error occurs
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            message: 'An error occurred while submitting your application'
        });
    }
});

// GET route to fetch applications (for admin purposes)
router.get('/applications', async (req, res) => {
    try {
        const applications = await Resume.find().sort({ submittedAt: -1 });
        
        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        console.error('Fetch applications error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching applications'
        });
    }
});

// GET route to download a specific resume
router.get('/download-resume/:id', async (req, res) => {
    try {
        const application = await Resume.findById(req.params.id);
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        const filePath = path.join(__dirname, '..', application.resumePath);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.download(filePath, application.resumeName);
    } catch (error) {
        console.error('Download resume error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while downloading the resume'
        });
    }
});

module.exports = router;