const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// First define the schema
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
        return achievements.length <= 10; // Maximum 10 achievements
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
  }
}, {
  timestamps: true
});

// Add the plugin AFTER schema definition
doctorSchema.plugin(mongoosePaginate);

// Index for better search performance
doctorSchema.index({ email: 1 }, { unique: true });
doctorSchema.index({ specialty: 1 });
doctorSchema.index({ location: 1 });
doctorSchema.index({ isAvailable: 1 });

// Virtual for doctor's full profile (optional)
doctorSchema.virtual('fullProfile').get(function() {
  return {
    name: this.name,
    specialty: this.specialty,
    experience: this.experience,
    location: this.location,
    rating: this.rating
  };
});

// Method to check if doctor is available
doctorSchema.methods.checkAvailability = function() {
  return this.isAvailable && this.availability !== 'Not Available';
};

// Transform output when converting to JSON
doctorSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Prevent OverwriteModelError in development/hot-reload
module.exports = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);