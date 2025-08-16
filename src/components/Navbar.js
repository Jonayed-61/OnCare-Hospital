import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaClinicMedical, FaBriefcase, FaBlog, FaEnvelope, FaNotesMedical, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import logo from '../Assets/logo.png'; // Make sure to import your logo

const Navbar = () => {
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

            <button onClick={createRipple} className="app-button ripple">
              Download App
            </button>
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