import React, { useState } from 'react';
import { 
  FaUserMd, 
  FaStethoscope, 
  FaGraduationCap, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaLanguage,
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaDollarSign,
  FaExclamationCircle
} from 'react-icons/fa';
import { IoIosRocket } from 'react-icons/io';
import Navbar from '../components/Navbar';
import '../Styles/registration.css';

const DoctorRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    experience: '',
    education: '',
    location: '',
    availability: '',
    languages: [],
    about: '',
    services: [],
    achievements: [],
    phone: '',
    consultationFee: ''
  });

  const [languageInput, setLanguageInput] = useState('');
  const [serviceInput, setServiceInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Phone number validation function - try multiple patterns
  const validatePhoneNumber = (phone) => {
    // Try multiple patterns to match backend validation
    const patterns = [
      /^(\+\d{1,3}[- ]?)?\d{10,15}$/, // International format
      /^01[3-9]\d{8}$/, // Bangladesh format: 01XXXXXXXXX
      /^\d{11}$/, // Any 11-digit number
      /^\d{10}$/, // Any 10-digit number
    ];
    
    return patterns.some(pattern => pattern.test(phone));
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validate phone number in real-time
    if (name === 'phone' && value && !validatePhoneNumber(value)) {
      setFieldErrors(prev => ({
        ...prev,
        phone: 'Please enter a valid phone number (e.g., 01758130971 or +8801758130971)'
      }));
    }

    // Validate email in real-time
    if (name === 'email' && value && !validateEmail(value)) {
      setFieldErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
    }
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()]
      }));
      setLanguageInput('');
    }
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    if (serviceInput.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, serviceInput.trim()]
      }));
      setServiceInput('');
    }
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()]
      }));
      setAchievementInput('');
    }
  };

  const removeAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.specialty) errors.specialty = 'Specialty is required';
    if (!formData.experience) errors.experience = 'Experience is required';
    if (!formData.education.trim()) errors.education = 'Education is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.availability.trim()) errors.availability = 'Availability is required';
    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      errors.phone = 'Please enter a valid phone number (e.g., 01758130971 or +8801758130971)';
    }
    if (formData.languages.length === 0) errors.languages = 'At least one language is required';
    if (!formData.about.trim()) errors.about = 'About section is required';
    if (formData.services.length === 0) errors.services = 'At least one service is required';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Format phone number to match backend expectations
      let formattedPhone = formData.phone;
      
      // If it's a Bangladesh number without country code, add it
      if (formData.phone.startsWith('01') && formData.phone.length === 11) {
        formattedPhone = '+88' + formData.phone;
      }
      // If it's a Bangladesh number without leading zero
      else if (formData.phone.startsWith('1') && formData.phone.length === 10) {
        formattedPhone = '+880' + formData.phone;
      }

      // Convert number fields to actual numbers
      const submissionData = {
        ...formData,
        phone: formattedPhone,
        experience: parseInt(formData.experience),
        consultationFee: parseInt(formData.consultationFee) || 0
      };

      console.log('Submitting data:', submissionData);

      const response = await fetch('http://localhost:5000/api/auth/doctor-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const responseData = await response.json();
      console.log('Registration successful:', responseData);
      setSubmitted(true);
      
    } catch (err) {
      console.error('Registration error:', err);
      
      // Provide more specific error message for phone validation
      if (err.message.includes('phone') || err.message.includes('Phone')) {
        setError('Phone number validation failed. Please try with country code (e.g., +8801758130971)');
      } else {
        setError(err.message || 'Failed to submit application');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="doctor-registration-page">
        <Navbar />
        <div className="registration-container">
          <div className="registration-success">
            <IoIosRocket className="success-icon" />
            <h2>Application Submitted Successfully!</h2>
            <p>Thank you for your interest in joining our medical team. Our team will review your application and contact you within 3-5 business days.</p>
            <button 
              onClick={() => window.location.href = '/doctors'}
              className="back-to-doctors-btn"
            >
              <FaArrowLeft /> Back to Doctors
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-registration-page">
      <Navbar />
      
      <div className="registration-container">
        <div className="registration-header">
          <h1>Join Our Medical Team</h1>
          <p>Complete the form below to apply as a healthcare professional in our network</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <h2>Account Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <div className="input-with-icon">
                <FaUserMd className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Dr. Firstname Lastname"
                  className={fieldErrors.name ? 'error' : ''}
                />
              </div>
              {fieldErrors.name && (
                <div className="field-error">
                  <FaExclamationCircle /> {fieldErrors.name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div className="input-with-icon">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className={fieldErrors.email ? 'error' : ''}
                />
              </div>
              {fieldErrors.email && (
                <div className="field-error">
                  <FaExclamationCircle /> {fieldErrors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Minimum 6 characters"
                  className={fieldErrors.password ? 'error' : ''}
                />
              </div>
              {fieldErrors.password && (
                <div className="field-error">
                  <FaExclamationCircle /> {fieldErrors.password}
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <h2>Professional Information</h2>
            
            <div className="form-group">
              <label htmlFor="specialty">Specialty *</label>
              <div className="input-with-icon">
                <FaStethoscope className="input-icon" />
                <select
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  className={fieldErrors.specialty ? 'error' : ''}
                >
                  <option value="">Select your specialty</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Oncologist">Oncologist</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {fieldErrors.specialty && (
                <div className="field-error">
                  <FaExclamationCircle /> {fieldErrors.specialty}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="experience">Years of Experience *</label>
              <div className="input-with-icon">
                <FaCalendarAlt className="input-icon" />
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Number of years"
                  className={fieldErrors.experience ? 'error' : ''}
                />
              </div>
              {fieldErrors.experience && (
                <div className="field-error">
                  <FaExclamationCircle /> {fieldErrors.experience}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="education">Education & Qualifications *</label>
              <div className="input-with-icon">
                <FaGraduationCap className="input-icon" />
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  placeholder="MBBS, FCPS, MD, etc."
                  className={fieldErrors.education ? 'error' : ''}
                />
              </div>
              {fieldErrors.education && (
                <div className="field-error">
                  <FaExclamationCircle /> {fieldErrors.education}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="location">Hospital/Clinic Location *</label>
              <div className="input-with-icon">
                <FaMapMarkerAlt className="input-icon" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Hospital Name, City"
                  className={fieldErrors.location ? 'error' : ''}
                />
              </div>
              {fieldErrors.location && (
                <div className="field-error">
                  <FaExclamationCircle /> {fieldErrors.location}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="availability">Availability *</label>
              <div className="input-with-icon">
                <FaCalendarAlt className="input-icon" />
                <input
                  type="text"
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  placeholder="Mon, Wed, Fri or Mon-Fri, etc."
                  className={fieldErrors.availability ? 'error' : ''}
                />
              </div>
              {fieldErrors.availability && (
                <div className="field-error">
                  <FaExclamationCircle /> {fieldErrors.availability}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <div className="input-with-icon">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+8801758130971 or 01758130971"
                  className={fieldErrors.phone ? 'error' : ''}
                />
              </div>
              {fieldErrors.phone && (
                <div className="field-error">
                  <FaExclamationCircle /> {fieldErrors.phone}
                </div>
              )}
              <div className="input-hint">
                Please include country code (e.g., +880 for Bangladesh)
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="consultationFee">Consultation Fee (BDT)</label>
              <div className="input-with-icon">
                <FaDollarSign className="input-icon" />
                <input
                  type="number"
                  id="consultationFee"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  min="0"
                  placeholder="Fee in BDT"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Information</h2>
            
            <div className="form-group">
              <label>Languages Spoken *</label>
              <div className="array-input-group">
                <div className="input-with-icon">
                  <FaLanguage className="input-icon" />
                  <input
                    type="text"
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    placeholder="Add a language (e.g., English)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                  />
                </div>
                <button type="button" onClick={addLanguage} className="add-item-btn">
                  Add Language
                </button>
              </div>
              {fieldErrors.languages && (
                <div className="field-error">
                  <FaExclamationCircle /> {fieldErrors.languages}
                </div>
              )}
              {formData.languages.length > 0 && (
                <div className="items-list">
                  {formData.languages.map((language, index) => (
                    <span key={index} className="item-tag">
                      {language}
                      <button type="button" onClick={() => removeLanguage(index)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="about">About Yourself *</label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Tell us about your medical practice, philosophy, and expertise..."
                className={fieldErrors.about ? 'error' : ''}
              />
              {fieldErrors.about && (
                <div className="field-error">
                  <FaExclamationCircle /> {fieldErrors.about}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Services Offered *</label>
              <div className="array-input-group">
                <div className="input-with-icon">
                  <FaStethoscope className="input-icon" />
                  <input
                    type="text"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    placeholder="Add a service (e.g., Consultation)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  />
                </div>
                <button type="button" onClick={addService} className="add-item-btn">
                  Add Service
                </button>
              </div>
              {fieldErrors.services && (
                <div className="field-error">
                  <FaExclamationCircle /> {fieldErrors.services}
                </div>
              )}
              {formData.services.length > 0 && (
                <div className="items-list">
                  {formData.services.map((service, index) => (
                    <span key={index} className="item-tag">
                      {service}
                      <button type="button" onClick={() => removeService(index)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Achievements & Certifications</label>
              <div className="array-input-group">
                <div className="input-with-icon">
                  <FaGraduationCap className="input-icon" />
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    placeholder="Add an achievement or certification"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                  />
                </div>
                <button type="button" onClick={addAchievement} className="add-item-btn">
                  Add Achievement
                </button>
              </div>
              {formData.achievements.length > 0 && (
                <div className="items-list">
                  {formData.achievements.map((achievement, index) => (
                    <span key={index} className="item-tag">
                      {achievement}
                      <button type="button" onClick={() => removeAchievement(index)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-submit">
            <button 
              type="submit" 
              className="submit-application-btn"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
            <p className="form-note">
              * Required fields. Your application will be reviewed by our team before being added to our platform.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistration;