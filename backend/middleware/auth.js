const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Doctor = require('../models/Doctor');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Check if it's a user
    let user = await User.findById(decoded.userId).select('-password');
    
    // If not a user, check if it's a doctor
    if (!user && decoded.doctor) {
      user = await Doctor.findById(decoded.doctor.id).select('-password');
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;