// components/Footer.js
import React from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import logo from '../Assets/logo.png';

export default function Footer() {
  return (
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
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Doctors</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700">Contact</h3>
            <address className="text-gray-600 not-italic">
              <p className="mb-2">Talaimari, Mohanpur</p>
              <p className="mb-2">Rajshahi, Bangladesh</p>
              <p className="mb-2">+8809611911666</p>
              <p>info@oncare.com</p>
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
<<<<<<< HEAD
          <p>Â© 2023 OnCare. All rights reserved</p>
=======
          <p>© 2023 OnCare. All rights reserved</p>
>>>>>>> aae9545e939498d798dd79c566d075a596cb4486
        </div>
      </div>
      
      {/* Floating action buttons */}
      <div className="floating-btn floating-phone" data-tooltip="Call Us">
        <FaPhoneAlt className="text-white text-xl" />
        <span className="notification-badge">1</span>
      </div>
      <div className="floating-btn floating-whatsapp" data-tooltip="Chat on WhatsApp">
        <FaWhatsapp className="text-white text-xl" />
        <span className="notification-badge">1</span>
      </div>
    </footer>
  );
}