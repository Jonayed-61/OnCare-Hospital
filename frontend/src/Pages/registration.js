import React, { useState } from 'react';
import { 
  FaUserMd, 
  FaStethoscope, 
  FaGraduationCap, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaLanguage,
  FaPaperclip,
  FaArrowLeft
} from 'react-icons/fa';
import { IoIosRocket } from 'react-icons/io';
import Navbar from '../components/Navbar';
import '../Styles/registration.css';
import axios from 'axios';

const DoctorRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    experience: '',
    education: '',
    location: '',
    availability: '',
    languages: '',
    about: '',
    services: '',
    achievements: '',
    image: null
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      image: e.target.files[0]
    }));
  };

// In your DoctorRegistration component
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const data = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        data.append(key, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    const response = await fetch('http://localhost:5000/api/auth/doctor-register', {
      method: 'POST',
      body: data,
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
    setError(err.message || 'Failed to submit application');
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
            <h2>Personal Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <div className="input-with-icon">
                <FaUserMd />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Dr. Firstname Lastname"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="specialty">Specialty *</label>
              <div className="input-with-icon">
                <FaStethoscope />
                <select
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
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
            </div>

            <div className="form-group">
              <label htmlFor="experience">Years of Experience *</label>
              <div className="input-with-icon">
                <FaCalendarAlt />
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Number of years"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Professional Details</h2>
            
            <div className="form-group">
              <label htmlFor="education">Education & Qualifications *</label>
              <div className="input-with-icon">
                <FaGraduationCap />
                <input
                  type="text"
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  placeholder="MBBS, FCPS, MD, etc."
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Hospital/Clinic Location *</label>
              <div className="input-with-icon">
                <FaMapMarkerAlt />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Hospital Name, City"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="availability">Availability *</label>
              <div className="input-with-icon">
                <FaCalendarAlt />
                <input
                  type="text"
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  placeholder="Mon, Wed, Fri or Mon-Fri, etc."
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="languages">Languages Spoken *</label>
              <div className="input-with-icon">
                <FaLanguage />
                <input
                  type="text"
                  id="languages"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  required
                  placeholder="English, Bengali, Hindi, etc."
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Information</h2>
            
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="services">Services Offered *</label>
              <textarea
                id="services"
                name="services"
                value={formData.services}
                onChange={handleChange}
                required
                rows="3"
                placeholder="List the medical services you provide (comma-separated)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="achievements">Achievements & Certifications</label>
              <textarea
                id="achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                rows="3"
                placeholder="List any awards, publications, or special certifications"
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">Professional Photo</label>
              <div className="file-upload">
                <FaPaperclip className="upload-icon" />
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <label htmlFor="image" className="file-upload-label">
                  {formData.image ? formData.image.name : 'Choose a professional photo'}
                </label>
              </div>
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