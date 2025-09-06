import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaPhone, FaGoogle, FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import '../Styles/register.css';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'patient'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setErrors({}); // Clear previous errors
      setSuccessMessage(''); // Clear previous success message
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // Save token to localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Show success message in UI
          setSuccessMessage('Account created successfully! Redirecting...');
          
          // Redirect to dashboard or home page after a short delay
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          // Set error message in state
          setErrors({ submit: data.message });
        }
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({ submit: 'Network error. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Sign Up Section */}
      <section className="signup-section flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="signup-container">
          <div className="signup-card">
            <div className="signup-header">
              <h2 className="signup-title">Create Your Account</h2>
              <p className="signup-subtitle">Join us to access healthcare services</p>
            </div>

            {/* Success and Error Messages */}
            {successMessage && (
              <div className="success-banner">
                {successMessage}
              </div>
            )}
            
            {errors.submit && (
              <div className="error-banner">
                {errors.submit}
              </div>
            )}

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <div className="input-group">
                    <span className="input-icon">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                      placeholder="Enter your first name"
                    />
                  </div>
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <div className="input-group">
                    <span className="input-icon">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                      placeholder="Enter your last name"
                    />
                  </div>
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-icon">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    placeholder="Enter your email"
                  />
                  </div>
                  {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <div className="input-group">
                  <span className="input-icon">
                    <FaPhone />
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'input-error' : ''}`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">I am a</label>
                <div className="user-type-selector">
                  <label className="user-type-option">
                    <input
                      type="radio"
                      name="userType"
                      value="patient"
                      checked={formData.userType === 'patient'}
                      onChange={handleChange}
                    />
                    <span className="user-type-label">Patient</span>
                  </label>
                  <label className="user-type-option">
                    <input
                      type="radio"
                      name="userType"
                      value="doctor"
                      checked={formData.userType === 'doctor'}
                      onChange={handleChange}
                    />
                    <span className="user-type-label">Doctor</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-icon">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('password')}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
                <div className="password-requirements">
                  <p>Password must contain:</p>
                  <ul>
                    <li className={formData.password.length >= 8 ? 'met' : ''}>At least 8 characters</li>
                    <li className={/(?=.*[a-z])/.test(formData.password) ? 'met' : ''}>One lowercase letter</li>
                    <li className={/(?=.*[A-Z])/.test(formData.password) ? 'met' : ''}>One uppercase letter</li>
                    <li className={/(?=.*\d)/.test(formData.password) ? 'met' : ''}>One number</li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <span className="input-icon">
                    <FaLock />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" className="checkbox-input" required />
                  <span className="checkbox-label">I agree to the <Link to="/terms" className="link">Terms of Service</Link> and <Link to="/privacy" className="link">Privacy Policy</Link></span>
                </label>
              </div>

              <button
                type="submit"
                className="signup-button"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="divider">
              <span>Or sign up with</span>
            </div>

            <div className="social-signup">
              <button className="social-button google-btn">
                <FaGoogle className="social-icon" />
                Google
              </button>
              <button className="social-button facebook-btn">
                <FaFacebook className="social-icon" />
                Facebook
              </button>
            </div>

            <div className="login-link">
              Already have an account? <Link to="/login" className="link">Log in</Link>
            </div>
          </div>

          <div className="signup-info">
            <h3 className="info-title">Benefits of creating an account</h3>
            <ul className="info-list">
              <li className="info-item">Book appointments with top doctors</li>
              <li className="info-item">Access your medical history anytime</li>
              <li className="info-item">Get medicine delivered to your doorstep</li>
              <li className="info-item">Receive personalized health recommendations</li>
              <li className="info-item">24/7 access to healthcare professionals</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}