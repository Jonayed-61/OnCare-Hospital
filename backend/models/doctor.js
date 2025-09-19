// models/doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: Number, required: true },
  education: { type: String, required: true },
  location: { type: String, required: true },
  availability: { type: String, required: true },
  languages: { type: String, required: true },
  about: { type: String, required: true },
  services: { type: String, required: true },
  achievements: { type: String },
  image: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  rejectionReason: { type: String },
  rejectedAt: { type: Date }
});

module.exports = mongoose.model('Doctor', doctorSchema);