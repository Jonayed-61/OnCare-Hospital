const mongoose = require('mongoose');

const partnerApplicationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
    trim: true
  },
  organizationType: {
    type: String,
    required: true,
    enum: ['hospital', 'clinic', 'diagnostic_center', 'pharmacy', 'ambulance_service', 'other']
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  servicesOffered: [{
    type: String,
    trim: true
  }],
  yearsInOperation: {
    type: Number,
    min: 0
  },
  numberOfStaff: {
    type: Number,
    min: 1
  },
  website: {
    type: String,
    trim: true
  },
  businessLicense: {
    type: String // path to uploaded file
  },
  taxCertificate: {
    type: String // path to uploaded file
  },
  additionalDocuments: [{
    type: String // paths to uploaded files
  }],
  message: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for better query performance
partnerApplicationSchema.index({ email: 1, createdAt: -1 });
partnerApplicationSchema.index({ status: 1 });

module.exports = mongoose.model('PartnerApplication', partnerApplicationSchema);