import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import '../Styles/login.css';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
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
    
    // Clear API error when user starts typing
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setApiError('');
    
    try {
      // Make API call to your backend login endpoint
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Login successful
        console.log('Login successful:', data);
        
        // Store the token in localStorage or context
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to admin dashboard if admin
        if (data.user && (data.user.role === 'admin' || data.user.email === 'admin@example.com')) {
          navigate('/admin-dashboard');
        } else {
            // Check for post-login redirect
            const redirectPath = localStorage.getItem('postLoginRedirect');
            if (redirectPath) {
              localStorage.removeItem('postLoginRedirect');
              navigate(redirectPath);
            } else {
              navigate('/');
            }
        }
      } else {
        // Login failed - show specific error messages
        if (data.message === 'Invalid credentials') {
          // Check if it's an email issue or password issue
          // For a real application, your backend should provide more specific errors
          // Since your backend returns generic "Invalid credentials", we need to guess
          
          // In a real implementation, your backend should return specific errors
          // For now, we'll check if the email format is valid
          if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setApiError('Please enter a valid email address');
          } else {
            // This could be either wrong password or email doesn't exist
            // We'll check if we've seen this email before (in a real app, the backend would tell us)
            setApiError('Incorrect password. Please try again.');
          }
        } else if (data.message.includes('User')) {
          setApiError('No account found with this email. Please sign up first.');
        } else {
          setApiError(data.message || 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to simulate checking if email exists (for demo purposes)
  // In a real app, this would be an API call to your backend
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/check-email?email=${email}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Login Section */}
      <section className="login-section flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-subtitle">Sign in to access your account</p>
            </div>

            {apiError && (
              <div className="error-banner">
                {apiError}
                {apiError.includes('No account found') && (
                  <div className="mt-2">
                    <Link to="/register" className="text-blue-600 hover:underline font-medium">
                      Create an account now
                    </Link>
                  </div>
                )}
                {apiError.includes('Incorrect password') && (
                  <div className="mt-2">
                    <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
                      Reset your password
                    </Link>
                  </div>
                )}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-icon">
                    <FaUser />
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
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" className="checkbox-input" />
                  <span className="checkbox-label">Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                  style={{ minWidth: '120px' }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
                <button
                  type="button"
                  className="login-button admin-login-btn"
                  style={{ backgroundColor: '#2d3748', color: '#fff', minWidth: '120px' }}
                  onClick={() => navigate('/admin-login')}
                >
                  Admin
                </button>
              </div>
            </form>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="social-login">
              <button className="social-button google-btn">
                <FaGoogle className="social-icon" />
                Google
              </button>
              <button className="social-button facebook-btn">
                <FaFacebook className="social-icon" />
                Facebook
              </button>
            </div>

            <div className="signup-link">
              Don't have an account? <Link to="/register" className="link">Sign up</Link>
            </div>
          </div>

          <div className="login-info">
            <h3 className="info-title">Why create an account?</h3>
            <ul className="info-list">
              <li className="info-item">Book appointments with doctors</li>
              <li className="info-item">Access your medical records</li>
              <li className="info-item">Get medicine delivery</li>
              <li className="info-item">Receive personalized health tips</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}