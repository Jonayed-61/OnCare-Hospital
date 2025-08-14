import React, { useEffect } from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp, FaArrowDown, FaUserMd, FaClinicMedical, FaBriefcase, FaBlog, FaEnvelope, FaFlask, FaAmbulance, FaPills, FaNotesMedical } from 'react-icons/fa';
import '../Styles/home.css';
import logo from '../Assets/logo.png';
import Doctors from '../Assets/doctors.png';

export default function HomePage() {
  useEffect(() => {
    // Header scroll effect
    const header = document.querySelector('header');
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Scroll indicator
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.querySelector('.scroll-indicator').style.width = `${scrolled}%`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const services = [
    {
      name: "Doctor Consultation",
      description: "Get specialist doctor advice from home",
      icon: <FaUserMd />
    },
    {
      name: "Lab Tests",
      description: "Home lab test facilities",
      icon: <FaFlask />
    },
    {
      name: "Medicine Delivery",
      description: "Prescription medicines delivered to your home",
      icon: <FaPills />
    },
    {
      name: "Ambulance Service",
      description: "24/7 emergency ambulance service",
      icon: <FaAmbulance />
    },
    {
      name: "Specialist Advice",
      description: "Consultation with various specialist doctors",
      icon: <FaNotesMedical />
    },
    {
      name: "Health Blog",
      description: "Regular health tips and updates",
      icon: <FaBlog />
    }
  ];

  return (
    <div className="font-sans bg-gray-50">
      {/* Scroll indicator */}
      <div className="scroll-indicator"></div>

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

      {/* Navbar with animated underline */}
      <nav className="navbar nav-animation bg-white shadow-lg">
        <div className="nav container mx-auto flex justify-center py-4 space-x-6 md:space-x-10 text-blue-700 font-medium">
          <a href="#" className="nav-link flex items-center group">
            <FaUserMd className="mr-2 group-hover:text-blue-600 transition-colors" />
            Home
          </a>
          <a href="#" className="nav-link flex items-center group">
            <FaClinicMedical className="mr-2 group-hover:text-blue-600 transition-colors" />
            About Us
          </a>
          <a href="#" className="nav-link flex items-center group">
            <FaUserMd className="mr-2 group-hover:text-blue-600 transition-colors" />
            Services
          </a>
          <a href="#" className="nav-link flex items-center group">
            <FaClinicMedical className="mr-2 group-hover:text-blue-600 transition-colors" />
            Partners
          </a>
          <a href="#" className="nav-link flex items-center group">
            <FaBriefcase className="mr-2 group-hover:text-blue-600 transition-colors" />
            Careers
          </a>
          <a href="#" className="nav-link flex items-center group">
            <FaBlog className="mr-2 group-hover:text-blue-600 transition-colors" />
            Blog
          </a>
          <a href="#" className="nav-link flex items-center group">
            <FaEnvelope className="mr-2 group-hover:text-blue-600 transition-colors" />
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Section with animated gradient background */}
      <section className="hero-section hero-animation relative py-20">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <div className="md:w-1/2 mb-10 md:mb-0 text-white animate-fadeInGrow">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Medi Sheba</h1>
            <p className="text-xl mb-8">Your healthcare now at your fingertips</p>
            <div className="flex space-x-4">
              <div className="button-group">
                <button onClick={createRipple} className="action-btn primary-btn">
                  Book an Appointment Now
                  <span className="ripple-effect"></span>
                </button>
                <button className="action-btn secondary-btn">
                  Learn More
                  <FaArrowDown className="btn-icon" />
                </button>
              </div>
            </div>
          </div>
          {/* This empty div maintains the layout spacing */}
          <div className="md:w-1/2"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container mx-auto px-6 services-container">
          <h2 className="services-title">Our Services</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">
                  {service.icon}
                </div>
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <button className="service-btn">
                  Details <FaArrowDown className="transform rotate-90" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonial-section">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-700">Customer Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Ahmed Rahman", comment: "Excellent service, the doctor gave very good advice" },
              { name: "Fatema Begum", comment: "Got medicines at home, thanks to Medi Sheba" },
              { name: "Jahid Hasan", comment: "Ambulance service arrived very quickly, saved my life" }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card"
              >
                <div className="flex items-center mb-4">
                  <div className="testimonial-avatar">
                    {testimonial.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                </div>
                <p className="testimonial-text">"{testimonial.comment}"</p>
                <div className="flex mt-4 text-yellow-400">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer with gradient border */}
      <footer className="footer footer-animation bg-white pt-12 pb-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={logo} alt="Logo" className="footer-logo h-12 mb-4" />
              <p className="text-gray-600">Your health is our priority</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Links</h3>
              <ul className="space-y-2">
                {['Home', 'Services', 'Doctors', 'Pricing'].map((item, index) => (
                  <li key={index}><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Contact</h3>
              <address className="text-gray-600 not-italic">
                <p className="mb-2">Talaimari, Mohanpur</p>
                <p className="mb-2">Rajshahi, Bangladesh</p>
                <p className="mb-2">+8809611911666</p>
                <p>info@medisheba.com</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Newsletter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Medi Sheba. All rights reserved</p>
          </div>
        </div>
      </footer>

      {/* Floating action buttons */}
      <div className="floating-btn floating-phone" data-tooltip="Call Us">
        <FaPhoneAlt className="text-white text-xl" />
        <span className="notification-badge">1</span>
      </div>
      <div className="floating-btn floating-whatsapp" data-tooltip="Chat on WhatsApp">
        <FaWhatsapp className="text-white text-xl" />
        <span className="notification-badge">1</span>
      </div>
    </div>
  );
}