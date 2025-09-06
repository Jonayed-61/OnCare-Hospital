import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaIdCard, FaEdit, FaSave, FaTimes, FaLock, FaBell, FaShieldAlt, FaHistory, FaFileMedical, FaCreditCard, FaCamera, FaPlus, FaCheck } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../Styles/profile.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    emergencyContact: '',
    bloodType: '',
    allergies: ''
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || 'Talaimari, Mohanpur, Rajshahi, Bangladesh',
        dateOfBirth: userData.dateOfBirth || '1990-01-01',
        emergencyContact: userData.emergencyContact || '+880XXXXXXXXX',
        bloodType: userData.bloodType || 'O+',
        allergies: userData.allergies || 'None'
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    // In a real application, you would send this data to your backend
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    // Show success notification
    document.querySelector('.notification-toast').classList.add('show');
    setTimeout(() => {
      document.querySelector('.notification-toast').classList.remove('show');
    }, 3000);
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address || 'Talaimari, Mohanpur, Rajshahi, Bangladesh',
      dateOfBirth: user.dateOfBirth || '1990-01-01',
      emergencyContact: user.emergencyContact || '+880XXXXXXXXX',
      bloodType: user.bloodType || 'O+',
      allergies: user.allergies || 'None'
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="profile-loading">
        <Navbar />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      
      {/* Success Notification Toast */}
      <div className="notification-toast">
        <div className="toast-content">
          <FaCheck className="toast-icon" />
          <span>Profile updated successfully!</span>
        </div>
      </div>
      
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <FaUser className="avatar-icon" />
              {isEditing && (
                <label htmlFor="avatar-upload" className="avatar-edit-btn">
                  <FaCamera />
                  <input type="file" id="avatar-upload" accept="image/*" style={{display: 'none'}} />
                </label>
              )}
            </div>
          </div>
          <div className="profile-info">
            <h1>{user.firstName} {user.lastName}</h1>
            <p className="user-role">{user.userType === 'doctor' ? 'Medical Professional' : 'Patient'}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">12</span>
                <span className="stat-label">Appointments</span>
              </div>
              <div className="stat">
                <span className="stat-number">5</span>
                <span className="stat-label">Prescriptions</span>
              </div>
              <div className="stat">
                <span className="stat-number">3</span>
                <span className="stat-label">Reports</span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {isEditing ? (
              <div className="edit-actions">
                <button className="btn btn-save" onClick={handleSave}>
                  <FaSave /> Save Changes
                </button>
                <button className="btn btn-cancel" onClick={handleCancel}>
                  <FaTimes /> Cancel
                </button>
              </div>
            ) : (
              <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="sidebar-tabs">
              <button 
                className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                <FaUser className="tab-icon" />
                <span>Personal Info</span>
              </button>
              <button 
                className={`tab ${activeTab === 'medical' ? 'active' : ''}`}
                onClick={() => setActiveTab('medical')}
              >
                <FaFileMedical className="tab-icon" />
                <span>Medical Info</span>
              </button>
              <button 
                className={`tab ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <FaLock className="tab-icon" />
                <span>Security</span>
              </button>
              <button 
                className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                <FaHistory className="tab-icon" />
                <span>Appointments</span>
              </button>
              <button 
                className={`tab ${activeTab === 'billing' ? 'active' : ''}`}
                onClick={() => setActiveTab('billing')}
              >
                <FaCreditCard className="tab-icon" />
                <span>Billing</span>
              </button>
              <button 
                className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <FaBell className="tab-icon" />
                <span>Notifications</span>
              </button>
            </div>
          </div>

          <div className="profile-details">
            {activeTab === 'personal' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Personal Information</h2>
                  <p>Manage your personal details and contact information</p>
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="firstName">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div className="display-value">{user.firstName}</div>
                    )}
                  </div>
                  <div className="input-group">
                    <label htmlFor="lastName">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div className="display-value">{user.lastName}</div>
                    )}
                  </div>
                  <div className="input-group">
                    <label htmlFor="email">
                      <FaEnvelope className="input-icon" /> Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div className="display-value">{user.email}</div>
                    )}
                  </div>
                  <div className="input-group">
                    <label htmlFor="phone">
                      <FaPhone className="input-icon" /> Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div className="display-value">{user.phone}</div>
                    )}
                  </div>
                  <div className="input-group full-width">
                    <label htmlFor="address">
                      <FaMapMarkerAlt className="input-icon" /> Address
                    </label>
                    {isEditing ? (
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="form-textarea"
                      />
                    ) : (
                      <div className="display-value">{formData.address}</div>
                    )}
                  </div>
                  <div className="input-group">
                    <label htmlFor="dateOfBirth">
                      <FaCalendarAlt className="input-icon" /> Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div className="display-value">{new Date(formData.dateOfBirth).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Medical Information</h2>
                  <p>Important health details for better care</p>
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="bloodType">Blood Type</label>
                    {isEditing ? (
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    ) : (
                      <div className="display-value">{formData.bloodType}</div>
                    )}
                  </div>
                  <div className="input-group full-width">
                    <label htmlFor="allergies">Allergies</label>
                    {isEditing ? (
                      <textarea
                        id="allergies"
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="List any allergies you have"
                        className="form-textarea"
                      />
                    ) : (
                      <div className="display-value">{formData.allergies}</div>
                    )}
                  </div>
                  <div className="input-group full-width">
                    <label htmlFor="emergencyContact">
                      <FaPhone className="input-icon" /> Emergency Contact
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <div className="display-value">{formData.emergencyContact}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Security Settings</h2>
                  <p>Manage your account security and privacy</p>
                </div>
                <div className="security-settings">
                  <div className="security-card">
                    <div className="security-info">
                      <div className="security-icon-container">
                        <FaLock className="security-icon" />
                      </div>
                      <div>
                        <h3>Change Password</h3>
                        <p>Last changed 3 months ago</p>
                      </div>
                    </div>
                    <button className="btn btn-change">Change</button>
                  </div>
                  <div className="security-card">
                    <div className="security-info">
                      <div className="security-icon-container">
                        <FaShieldAlt className="security-icon" />
                      </div>
                      <div>
                        <h3>Two-Factor Authentication</h3>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <button className="btn btn-change">Enable</button>
                  </div>
                  <div className="security-card">
                    <div className="security-info">
                      <div className="security-icon-container">
                        <FaBell className="security-icon" />
                      </div>
                      <div>
                        <h3>Login Alerts</h3>
                        <p>Get notified of new sign-ins</p>
                      </div>
                    </div>
                    <button className="btn btn-change">Configure</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Appointment History</h2>
                  <p>View your past and upcoming appointments</p>
                </div>
                <div className="appointment-list">
                  <div className="appointment-card">
                    <div className="appointment-info">
                      <h3>General Checkup</h3>
                      <p className="doctor-name">Dr. Sarah Johnson</p>
                      <span className="appointment-date">Oct 15, 2023 • 10:00 AM</span>
                    </div>
                    <div className="appointment-status completed">Completed</div>
                  </div>
                  <div className="appointment-card">
                    <div className="appointment-info">
                      <h3>Dental Cleaning</h3>
                      <p className="doctor-name">Dr. Michael Chen</p>
                      <span className="appointment-date">Oct 20, 2023 • 2:30 PM</span>
                    </div>
                    <div className="appointment-status upcoming">Upcoming</div>
                  </div>
                  <div className="appointment-card">
                    <div className="appointment-info">
                      <h3>Eye Examination</h3>
                      <p className="doctor-name">Dr. Emily Williams</p>
                      <span className="appointment-date">Sept 5, 2023 • 11:15 AM</span>
                    </div>
                    <div className="appointment-status completed">Completed</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Billing Information</h2>
                  <p>Manage your payment methods and view billing history</p>
                </div>
                <div className="billing-section">
                  <div className="billing-card">
                    <h3>Payment Methods</h3>
                    <div className="payment-method">
                      <div className="payment-info">
                        <div className="payment-icon-container">
                          <FaCreditCard className="payment-icon" />
                        </div>
                        <div>
                          <h4>Visa ending in 4567</h4>
                          <p>Expires 12/2024</p>
                        </div>
                      </div>
                      <button className="btn btn-edit-small">Edit</button>
                    </div>
                    <button className="btn btn-add-payment">
                      <FaPlus /> Add Payment Method
                    </button>
                  </div>
                  <div className="billing-card">
                    <h3>Billing History</h3>
                    <div className="billing-item">
                      <div>
                        <h4>General Consultation</h4>
                        <p>October 15, 2023</p>
                      </div>
                      <div className="billing-amount">$120.00</div>
                    </div>
                    <div className="billing-item">
                      <div>
                        <h4>Lab Tests</h4>
                        <p>September 5, 2023</p>
                      </div>
                      <div className="billing-amount">$85.50</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Notification Settings</h2>
                  <p>Customize how you receive notifications</p>
                </div>
                <div className="notification-settings">
                  <div className="notification-item">
                    <div>
                      <h3>Email Notifications</h3>
                      <p>Receive emails about appointments, reminders, and health tips</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div>
                      <h3>SMS Notifications</h3>
                      <p>Receive text messages for appointment reminders</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div>
                      <h3>Promotional Emails</h3>
                      <p>Receive emails about new services and health programs</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;