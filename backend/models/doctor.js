const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    trim: true,
    maxlength: [100, 'Specialty cannot exceed 100 characters']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true,
    maxlength: [50, 'Experience cannot exceed 50 characters']
  },
  education: {
    type: String,
    required: [true, 'Education is required'],
    trim: true,
    maxlength: [200, 'Education cannot exceed 200 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [150, 'Location cannot exceed 150 characters']
  },
  availability: {
    type: String,
    required: [true, 'Availability is required'],
    trim: true,
    maxlength: [100, 'Availability cannot exceed 100 characters']
  },
  languages: {
    type: [String],
    required: [true, 'At least one language is required'],
    validate: {
      validator: function(languages) {
        return languages && languages.length > 0;
      },
      message: 'At least one language is required'
    }
  },
  about: {
    type: String,
    required: [true, 'About section is required'],
    trim: true,
    maxlength: [1000, 'About cannot exceed 1000 characters']
  },
  services: {
    type: [String],
    required: [true, 'At least one service is required'],
    validate: {
      validator: function(services) {
        return services && services.length > 0;
      },
      message: 'At least one service is required'
    }
  },
  achievements: {
    type: [String],
    default: [],
    validate: {
      validator: function(achievements) {
        return achievements.length <= 10;
      },
      message: 'Cannot have more than 10 achievements'
    }
  },
  image: {
    type: String,
    default: '',
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i, 'Please enter a valid image URL']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  consultationFee: {
    type: Number,
    min: [0, 'Consultation fee cannot be negative'],
    default: 0
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  // Approval System Fields
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedAt: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  // Additional fields for doctor registration
  licenseNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'License number cannot exceed 50 characters']
  },
  licenseExpiry: {
    type: Date
  },
  hospitalAffiliation: {
    type: String,
    trim: true,
    maxlength: [200, 'Hospital affiliation cannot exceed 200 characters']
  },
  yearsOfExperience: {
    type: Number,
    min: [0, 'Years of experience cannot be negative'],
    default: 0
  },
  consultationHours: {
    type: String,
    trim: true,
    maxlength: [100, 'Consultation hours cannot exceed 100 characters']
  },
  emergencyContact: {
    type: String,
    trim: true,
    maxlength: [20, 'Emergency contact cannot exceed 20 characters']
  },
  // Social media and contact info
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+\..+$/, 'Please enter a valid website URL']
  },
  linkedin: {
    type: String,
    trim: true
  },
  twitter: {
    type: String,
    trim: true
  },
  // Verification status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    documentType: String,
    documentUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],
  // Bank details for payments (optional)
  bankAccount: {
    accountHolder: String,
    accountNumber: String,
    bankName: String,
    branch: String,
    routingNumber: String
  },
  // Statistics
  totalAppointments: {
    type: Number,
    default: 0
  },
  completedAppointments: {
    type: Number,
    default: 0
  },
  cancellationRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  // Availability settings
  workingDays: {
    type: [String],
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  },
  slotDuration: {
    type: Number, // in minutes
    default: 30
  },
  breakTime: {
    start: String, // format: "HH:MM"
    end: String,
    duration: Number // in minutes
  }
}, {
  timestamps: true
});

// Add pagination plugin
doctorSchema.plugin(mongoosePaginate);

// Indexes for better performance
doctorSchema.index({ email: 1 }, { unique: true });
doctorSchema.index({ specialty: 1 });
doctorSchema.index({ location: 1 });
doctorSchema.index({ status: 1 });
doctorSchema.index({ isAvailable: 1 });
doctorSchema.index({ rating: -1 });
doctorSchema.index({ createdAt: -1 });
doctorSchema.index({ 'verificationDocuments.status': 1 });

// Virtual for full name
doctorSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for doctor's approval status
doctorSchema.virtual('isApproved').get(function() {
  return this.status === 'approved';
});

// Virtual for doctor's pending status
doctorSchema.virtual('isPending').get(function() {
  return this.status === 'pending';
});

// Virtual for doctor's rejection status
doctorSchema.virtual('isRejected').get(function() {
  return this.status === 'rejected';
});

// Virtual for experience in years
doctorSchema.virtual('experienceYears').get(function() {
  return this.yearsOfExperience || this.experience;
});

// Method to check if doctor is available
doctorSchema.methods.checkAvailability = function() {
  return this.isAvailable && this.status === 'approved' && this.availability !== 'Not Available';
};

// Method to approve doctor
doctorSchema.methods.approve = function(adminId) {
  this.status = 'approved';
  this.approvedAt = new Date();
  this.approvedBy = adminId;
  this.rejectionReason = '';
  this.rejectedAt = null;
  return this.save();
};

// Method to reject doctor
doctorSchema.methods.reject = function(reason) {
  this.status = 'rejected';
  this.rejectionReason = reason;
  this.rejectedAt = new Date();
  this.approvedAt = null;
  this.approvedBy = null;
  return this.save();
};

// Method to reset approval status to pending
doctorSchema.methods.resetApproval = function() {
  this.status = 'pending';
  this.approvedAt = null;
  this.approvedBy = null;
  this.rejectionReason = '';
  this.rejectedAt = null;
  return this.save();
};

// Method to get doctor's statistics
doctorSchema.methods.getStats = function() {
  return {
    totalAppointments: this.totalAppointments,
    completedAppointments: this.completedAppointments,
    cancellationRate: this.cancellationRate,
    averageRating: this.averageRating,
    reviewCount: this.reviewCount
  };
};

// Static method to find approved doctors
doctorSchema.statics.findApproved = function() {
  return this.find({ status: 'approved' });
};

// Static method to find pending doctors
doctorSchema.statics.findPending = function() {
  return this.find({ status: 'pending' });
};

// Static method to find rejected doctors
doctorSchema.statics.findRejected = function() {
  return this.find({ status: 'rejected' });
};

// Static method to get doctors by specialty
doctorSchema.statics.findBySpecialty = function(specialty) {
  return this.find({ 
    specialty: new RegExp(specialty, 'i'),
    status: 'approved'
  });
};

// Static method to get doctors by location
doctorSchema.statics.findByLocation = function(location) {
  return this.find({ 
    location: new RegExp(location, 'i'),
    status: 'approved'
  });
};

// Transform output when converting to JSON
doctorSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Never send password in responses
    return ret;
  }
});

// Pre-save middleware to hash password
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(candidatePassword, this.password);
};

// Pre-remove middleware to handle related data cleanup
doctorSchema.pre('remove', async function(next) {
  try {
    // Add any cleanup logic here (e.g., remove related appointments, reviews, etc.)
    console.log(`Cleaning up data for doctor: ${this.name}`);
    next();
  } catch (error) {
    next(error);
  }
});

// Prevent OverwriteModelError in development/hot-reload
module.exports = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);