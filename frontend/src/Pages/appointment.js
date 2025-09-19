import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, 
  FaArrowLeft, FaCheck, FaSearch, FaStethoscope, FaStar,
  FaMapMarkerAlt, FaChevronRight, FaInfoCircle, FaTimes
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import '../Styles/appointment.css';

const AppointmentPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    doctor: '',
    date: '',
    time: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Fetch doctors data (in a real app, this would be an API call)
  useEffect(() => {
    // Simulating data import from doctors page
    const mockDoctors = [
      {
        id: 1,
        name: "Dr. Ayesha Rahman",
        specialty: "Cardiologist",
        experience: "12 years",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        availability: "Mon, Wed, Fri",
        location: "Apollo Hospitals, Dhaka",
        isAvailable: true,
      },
      {
        id: 2,
        name: "Dr. Mohammad Hasan",
        specialty: "Neurologist",
        experience: "15 years",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        availability: "Tue, Thu, Sat",
        location: "Square Hospital, Dhaka",
        isAvailable: true,
      },
      {
        id: 3,
        name: "Dr. Fatima Begum",
        specialty: "Pediatrician",
        experience: "10 years",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        availability: "Mon-Fri",
        location: "Child Health Care, Chittagong",
        isAvailable: true,
      },
      {
        id: 4,
        name: "Dr. Rajib Ahmed",
        specialty: "Orthopedic Surgeon",
        experience: "14 years",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        availability: "Mon, Tue, Thu",
        location: "Labaid Specialized Hospital, Dhaka",
        isAvailable: false,
      },
      {
        id: 5,
        name: "Dr. Sunita Chowdhury",
        specialty: "Dermatologist",
        experience: "8 years",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1591604021695-0c54b7b564ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        availability: "Tue, Thu, Sat",
        location: "Skin Care Center, Dhaka",
        isAvailable: true,
      },
      {
        id: 6,
        name: "Dr. Anwar Hossain",
        specialty: "General Physician",
        experience: "18 years",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        availability: "Mon-Sat",
        location: "Popular Hospital, Dhaka",
        isAvailable: true,
      },
    ];
    
    setDoctors(mockDoctors);
    setFilteredDoctors(mockDoctors);
  }, []);

  // Filter doctors based on search and specialty
  useEffect(() => {
    let result = doctors;
    
    if (selectedSpecialty !== 'all') {
      result = result.filter(doctor => 
        doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(query) || 
        doctor.specialty.toLowerCase().includes(query)
      );
    }
    
    setFilteredDoctors(result);
  }, [searchQuery, selectedSpecialty, doctors]);

  const services = [
    "Doctor Consultation",
    "Lab Tests",
    "Medicine Delivery",
    "Ambulance Service",
    "Specialist Advice",
    "Health Checkup"
  ];

  const specialties = [
    "All Specialties",
    "Cardiologist",
    "Neurologist",
    "Pediatrician",
    "Orthopedic Surgeon",
    "Dermatologist",
    "General Physician"
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
    "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDoctorSelect = (doctorId) => {
    const selectedDoctor = doctors.find(d => d.id === doctorId);
    setFormData({ 
      ...formData, 
      doctor: doctorId,
      service: selectedDoctor ? `${selectedDoctor.specialty} Consultation` : formData.service
    });
  };

  const nextStep = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const selectedDoctor = doctors.find(d => d.id === formData.doctor);

  return (
    <div className="appointment-page">
      {/* Animated Background Elements */}
      <div className="appointment-animated-bg">
        <div className="appointment-bubble appointment-bubble-1"></div>
        <div className="appointment-bubble appointment-bubble-2"></div>
        <div className="appointment-bubble appointment-bubble-3"></div>
        <div className="appointment-bubble appointment-bubble-4"></div>
        
        <div className="appointment-decorative-circle appointment-circle-1"></div>
        <div className="appointment-decorative-circle appointment-circle-2"></div>
        <div className="appointment-decorative-circle appointment-circle-3"></div>
      </div>

      <Navbar />

      {/* Main Content */}
      <div className="appointment-container">
        <Link to="/" className="appointment-back-link">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="appointment-form-container">
          <div className="appointment-header">
            <h1>Book an Appointment</h1>
            <p>Fill out the form below to schedule your appointment</p>
          </div>

          <div className="appointment-content">
            {/* Step Indicator */}
            <div className="appointment-steps">
              {[1, 2, 3, 4].map(step => (
                <div key={step} className="appointment-step">
                  <div className={`appointment-step-circle ${
                    step === currentStep 
                      ? 'active' 
                      : step < currentStep 
                        ? 'completed' 
                        : 'pending'
                  }`}>
                    {step < currentStep ? (
                      <FaCheck className="w-4 h-4" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 4 && (
                    <div className={`appointment-step-connector ${step < currentStep ? 'completed' : ''}`}></div>
                  )}
                </div>
              ))}
            </div>

            {isSubmitted ? (
              <div className="appointment-success appointment-fade-in">
                <div className="appointment-success-icon">
                  <FaCheck className="w-10 h-10" />
                </div>
                <h2 className="appointment-success-title">Appointment Booked Successfully!</h2>
                <p className="appointment-success-message">
                  Your appointment with {selectedDoctor?.name} for {formData.service} on {formData.date} at {formData.time} has been confirmed.
                </p>
                <p className="appointment-success-message">
                  A confirmation email has been sent to {formData.email}.
                </p>
                <div className="appointment-success-actions">
                  <Link to="/" className="appointment-success-btn appointment-success-primary">
                    Return Home
                  </Link>
                  <button 
                    onClick={() => {
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        service: '',
                        doctor: '',
                        date: '',
                        time: '',
                        notes: ''
                      });
                      setCurrentStep(1);
                      setIsSubmitted(false);
                    }}
                    className="appointment-success-btn appointment-success-secondary"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="appointment-form-section appointment-slide-in">
                    <h3 className="appointment-form-title">
                      <span className="appointment-form-title-number">1</span>
                      Personal Information
                    </h3>
                    
                    <div className="appointment-input-group">
                      <div className="appointment-input-icon">
                        <FaUser />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="appointment-input"
                        placeholder="Full Name"
                        required
                      />
                    </div>

                    <div className="appointment-input-group">
                      <div className="appointment-input-icon">
                        <FaPhone />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="appointment-input"
                        placeholder="Phone Number"
                        required
                      />
                    </div>

                    <div className="appointment-input-group">
                      <div className="appointment-input-icon">
                        <FaEnvelope />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="appointment-input"
                        placeholder="Email Address"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Doctor Selection */}
                {currentStep === 2 && (
                  <div className="appointment-form-section appointment-slide-in">
                    <h3 className="appointment-form-title">
                      <span className="appointment-form-title-number">2</span>
                      Select a Doctor
                    </h3>
                    
                    {/* Search and Filter */}
                    <div className="appointment-doctor-search">
                      <div className="appointment-search-filters">
                        <div className="appointment-input-group">
                          <div className="appointment-input-icon">
                            <FaSearch />
                          </div>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="appointment-input"
                            placeholder="Search doctors..."
                          />
                        </div>
                        
                        <div className="appointment-input-group">
                          <div className="appointment-input-icon">
                            <FaStethoscope />
                          </div>
                          <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="appointment-input appointment-select"
                          >
                            {specialties.map(specialty => (
                              <option key={specialty} value={specialty === 'All Specialties' ? 'all' : specialty}>
                                {specialty}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <p className="appointment-doctor-count">
                        {filteredDoctors.length} doctors found
                        {selectedSpecialty !== 'all' ? ` in ${selectedSpecialty}` : ''}
                        {searchQuery ? ` matching "${searchQuery}"` : ''}
                      </p>
                    </div>
                    
                    {/* Doctors List */}
                    <div className="appointment-doctors-grid">
                      {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => (
                          <div 
                            key={doctor.id}
                            className={`appointment-doctor-card ${
                              formData.doctor === doctor.id 
                                ? 'selected' 
                                : ''
                            } ${!doctor.isAvailable ? 'unavailable' : ''}`}
                            onClick={() => doctor.isAvailable && handleDoctorSelect(doctor.id)}
                          >
                            <div className="appointment-doctor-header">
                              <img 
                                src={doctor.image} 
                                alt={doctor.name}
                                className="appointment-doctor-image"
                              />
                              <div className="appointment-doctor-info">
                                <h4 className="appointment-doctor-name">{doctor.name}</h4>
                                <p className="appointment-doctor-specialty">{doctor.specialty}</p>
                                <div className="appointment-doctor-rating">
                                  <div className="appointment-doctor-stars">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar 
                                        key={i}
                                        className={i < Math.floor(doctor.rating) ? 'star-filled' : 'star-empty'} 
                                        size={12}
                                      />
                                    ))}
                                  </div>
                                  <span className="appointment-rating-text">
                                    {doctor.rating} ({doctor.experience} experience)
                                  </span>
                                </div>
                              </div>
                              <div className={`appointment-doctor-availability ${doctor.isAvailable ? 'available' : 'unavailable'}`}>
                                {doctor.isAvailable ? 'Available' : 'Not Available'}
                              </div>
                            </div>
                            <div className="appointment-doctor-details">
                              <div className="appointment-doctor-detail">
                                <FaMapMarkerAlt className="appointment-doctor-detail-icon" />
                                {doctor.location}
                              </div>
                              <div className="appointment-doctor-detail">
                                <FaCalendarAlt className="appointment-doctor-detail-icon" />
                                {doctor.availability}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="appointment-no-results">
                          <FaSearch className="appointment-no-results-icon" />
                          <h3>No doctors found</h3>
                          <p>Try adjusting your search or filter criteria.</p>
                          <button 
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedSpecialty('all');
                            }}
                            className="appointment-clear-filters"
                          >
                            Clear Filters
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {formData.doctor && (
                      <div className="appointment-summary">
                        <h4 className="appointment-summary-title">
                          <FaCheck className="appointment-summary-title-icon" /> Selected Doctor
                        </h4>
                        <p>
                          {doctors.find(d => d.id === formData.doctor)?.name} - 
                          {doctors.find(d => d.id === formData.doctor)?.specialty}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Appointment Details */}
                {currentStep === 3 && (
                  <div className="appointment-form-section appointment-slide-in">
                    <h3 className="appointment-form-title">
                      <span className="appointment-form-title-number">3</span>
                      Appointment Details
                    </h3>
                    
                    {selectedDoctor && (
                      <div className="appointment-summary">
                        <h4 className="appointment-summary-title">
                          <FaInfoCircle className="appointment-summary-title-icon" /> Selected Doctor
                        </h4>
                        <div className="appointment-doctor-header">
                          <img 
                            src={selectedDoctor.image} 
                            alt={selectedDoctor.name}
                            className="appointment-doctor-image"
                          />
                          <div>
                            <p className="appointment-doctor-name">{selectedDoctor.name}</p>
                            <p className="appointment-doctor-specialty">{selectedDoctor.specialty}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="appointment-input-group">
                      <div className="appointment-input-icon">
                        <FaUser />
                      </div>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="appointment-input appointment-select"
                        required
                      >
                        <option value="">Select Service</option>
                        {services.map(service => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <div className="appointment-search-filters">
                      <div className="appointment-input-group">
                        <div className="appointment-input-icon">
                          <FaCalendarAlt />
                        </div>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="appointment-input"
                          required
                        />
                      </div>

                      <div className="appointment-input-group">
                        <div className="appointment-input-icon">
                          <FaClock />
                        </div>
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="appointment-input appointment-select"
                          required
                        >
                          <option value="">Select Time</option>
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Additional Notes and Confirmation */}
                {currentStep === 4 && (
                  <div className="appointment-form-section appointment-slide-in">
                    <h3 className="appointment-form-title">
                      <span className="appointment-form-title-number">4</span>
                      Additional Information
                    </h3>
                    
                    <div className="appointment-input-group">
                      <label className="appointment-input-label">Additional Notes (Optional)</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        className="appointment-input appointment-textarea"
                        placeholder="Any special requirements or notes for the doctor..."
                      ></textarea>
                    </div>

                    <div className="appointment-summary">
                      <h4 className="appointment-summary-title">
                        <FaCheck className="appointment-summary-title-icon" /> Appointment Summary
                      </h4>
                      <div className="appointment-summary-details">
                        {selectedDoctor && (
                          <div className="appointment-summary-item">
                            <div className="appointment-summary-label">Doctor:</div>
                            <div className="appointment-summary-value">{selectedDoctor.name} ({selectedDoctor.specialty})</div>
                          </div>
                        )}
                        <div className="appointment-summary-item">
                          <div className="appointment-summary-label">Service:</div>
                          <div className="appointment-summary-value">{formData.service}</div>
                        </div>
                        <div className="appointment-summary-item">
                          <div className="appointment-summary-label">Date & Time:</div>
                          <div className="appointment-summary-value">{formData.date} at {formData.time}</div>
                        </div>
                        <div className="appointment-summary-item">
                          <div className="appointment-summary-label">Patient:</div>
                          <div className="appointment-summary-value">{formData.name}</div>
                        </div>
                        <div className="appointment-summary-item">
                          <div className="appointment-summary-label">Contact:</div>
                          <div className="appointment-summary-value">{formData.phone} | {formData.email}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="appointment-navigation">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="appointment-btn appointment-btn-prev"
                    >
                      <FaArrowLeft className="mr-2" /> Back
                    </button>
                  ) : (
                    <Link to="/" className="appointment-btn appointment-btn-prev">
                      <FaTimes className="mr-2" /> Cancel
                    </Link>
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        (currentStep === 1 && (!formData.name || !formData.phone || !formData.email)) ||
                        (currentStep === 2 && !formData.doctor) ||
                        (currentStep === 3 && (!formData.service || !formData.date || !formData.time))
                      }
                      className="appointment-btn appointment-btn-next"
                    >
                      Next <FaChevronRight className="ml-2" size={12} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="appointment-btn appointment-btn-submit"
                    >
                      Confirm Appointment <FaCheck className="ml-2" size={12} />
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AppointmentPage;