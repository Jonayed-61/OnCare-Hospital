import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserMd, 
  FaClinicMedical, 
  FaBriefcase, 
  FaBlog, 
  FaEnvelope, 
  FaNotesMedical, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaUserCircle,
  FaUser,        
  FaCalendarAlt, 
  FaSignOutAlt,  
  FaSignInAlt    
} from 'react-icons/fa';
import logo from '../Assets/logo.png';
import '../Styles/navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Update state
    setIsLoggedIn(false);
    setUser(null);

    // Redirect to home page
    navigate('/');
  };

  const createRipple = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple-effect");

    const ripple = button.getElementsByClassName("ripple-effect")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  };

  return (
    <>
      {/* Header Section */}
      <header className="header">
        <div className="container1">
          {/* Left Side - Logo */}
          <div className="logo-container">
            <img src={logo} alt="Logo" className="header-logo" />
          </div>

          {/* Right Side - Content */}
          <div className="right-content">
            <div className="tagline hidden md:block">
              "Service at your doorstep, stay healthy with confidence"
            </div>

            <div className="address hidden md:flex">
              <FaMapMarkerAlt className="address-icon" />
              <span className="address-text">
                Talaimari, Mohanpur, Rajshahi, Bangladesh
              </span>
            </div>

            <div className="phone">
              <FaPhoneAlt className="phone-icon" />
              <span className="phone-text">
                +8809611911666
              </span>
            </div>

            {isLoggedIn ? (
              <div className="profile-button-container relative group">
                <button className="profile-button ripple flex items-center justify-center">
                  <FaUserCircle className="profile-icon mr-2" />
                  {user?.firstName || 'Profile'}
                  <span className="ripple-effect"></span>
                </button>

                {/* Dropdown menu */}
                <div className="profile-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user?.firstName} {user?.lastName}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                  >
                    <FaUser className="profile-icon" />
                    My Profile
                  </Link>
                  <Link
                    to="/appointments"
                    className="dropdown-item"
                  >
                    <FaCalendarAlt className="profile-icon" />
                    My Appointments
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-item"
                  >
                    <FaSignOutAlt className="profile-icon" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="login-button ripple">
                <FaSignInAlt className="profile-icon mr-2" />
                Login
                <span className="ripple-effect"></span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Section */}
      <nav className="navbar nav-animation bg-white shadow-lg">
        <div className="nav container mx-auto flex justify-center py-4 space-x-6 md:space-x-10 text-blue-700 font-medium">
          <Link to="/" className="nav-link flex items-center group">
            <FaUserMd className="mr-2 group-hover:text-blue-600 transition-colors" />
            Home
          </Link>
          <Link to="/about" className="nav-link flex items-center group">
            <FaClinicMedical className="mr-2 group-hover:text-blue-600 transition-colors" />
            About Us
          </Link>
          <Link to="/services" className="nav-link flex items-center group">
            <FaUserMd className="mr-2 group-hover:text-blue-600 transition-colors" />
            Services
          </Link>
          <Link to="/doctors" className="nav-link flex items-center group">
            <FaUserMd className="mr-2 group-hover:text-blue-600 transition-colors" />
            Doctors
          </Link>
          <Link to="/partners" className="nav-link flex items-center group">
            <FaClinicMedical className="mr-2 group-hover:text-blue-600 transition-colors" />
            Partners
          </Link>
          <Link to="/careers" className="nav-link flex items-center group">
            <FaBriefcase className="mr-2 group-hover:text-blue-600 transition-colors" />
            Careers
          </Link>
          <Link to="/blog" className="nav-link flex items-center group">
            <FaBlog className="mr-2 group-hover:text-blue-600 transition-colors" />
            Blog
          </Link>
          <Link to="/contact" className="nav-link flex items-center group">
            <FaEnvelope className="mr-2 group-hover:text-blue-600 transition-colors" />
            Contact
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;