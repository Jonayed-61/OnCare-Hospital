import React, { useEffect, useState } from 'react';
import {
  FaUserMd,
  FaStethoscope,
  FaStar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFilter,
  FaSearch,
  FaArrowRight,
  FaClock,
  FaGraduationCap,
  FaLanguage,
  FaHeart
} from 'react-icons/fa';
import { IoIosRocket } from 'react-icons/io';
import '../Styles/doctors.css';
import Navbar from '../components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';

const DoctorsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDoctor, setExpandedDoctor] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false
    });

    // Check if mobile on initial load
    checkIsMobile();

    // Add resize listener
    window.addEventListener('resize', checkIsMobile);

    // Load doctors from localStorage
    const savedDoctors = localStorage.getItem('doctors');
    if (savedDoctors) {
      setDoctors(JSON.parse(savedDoctors));
    } else {
      // Load initial doctors if none in localStorage
      setDoctors([
        {
          id: 1,
          name: "Dr. Ayesha Rahman",
          specialty: "Cardiologist",
          experience: "12 years",
          rating: 4.8,
          reviews: 156,
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          availability: "Mon, Wed, Fri",
          location: "Apollo Hospitals, Dhaka",
          education: "FCPS, Dhaka Medical College",
          languages: ["Bengali", "English"],
          isAvailable: true,
          about: "Dr. Ayesha Rahman is a renowned cardiologist with over 12 years of experience in treating complex heart conditions. She has performed over 500 successful surgeries and is known for her compassionate patient care.",
          services: ["Echocardiography", "Angioplasty", "Cardiac Consultation", "Pacemaker Implantation"],
          achievements: ["Best Cardiologist Award 2022", "Published 25+ Research Papers", "Member of Bangladesh Cardiac Society"]
        },
        {
          id: 2,
          name: "Dr. Mohammad Hasan",
          specialty: "Neurologist",
          experience: "15 years",
          rating: 4.7,
          reviews: 132,
          image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          availability: "Tue, Thu, Sat",
          location: "Square Hospital, Dhaka",
          education: "MD, BSMMU",
          languages: ["Bengali", "English", "Hindi"],
          isAvailable: true,
          about: "Dr. Mohammad Hasan is a leading neurologist specializing in the treatment of brain and nervous system disorders. He has extensive experience in managing stroke, epilepsy, and neurodegenerative diseases.",
          services: ["EEG", "EMG", "Neurological Consultation", "Stroke Management"],
          achievements: ["Neurology Excellence Award 2021", "International Research Fellow", "Founder of NeuroCare Bangladesh"]
        },
        {
          id: 3,
          name: "Dr. Fatima Begum",
          specialty: "Pediatrician",
          experience: "10 years",
          rating: 4.9,
          reviews: 187,
          image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          availability: "Mon-Fri",
          location: "Child Health Care, Chittagong",
          education: "MBBS, MCPS, Chittagong Medical College",
          languages: ["Bengali", "English"],
          isAvailable: true,
          about: "Dr. Fatima Begum is a compassionate pediatrician dedicated to providing comprehensive healthcare for children from newborns to adolescents. She believes in preventive care and parent education.",
          services: ["Child Vaccination", "Growth Monitoring", "Nutrition Counseling", "Developmental Assessment"],
          achievements: ["Pediatric Care Excellence Award", "Child Health Advocate", "15+ Years of Service"]
        },
        {
          id: 4,
          name: "Dr. Rajib Ahmed",
          specialty: "Orthopedic Surgeon",
          experience: "14 years",
          rating: 4.6,
          reviews: 98,
          image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          availability: "Mon, Tue, Thu",
          location: "Labaid Specialized Hospital, Dhaka",
          education: "MS (Ortho), Dhaka Medical College",
          languages: ["Bengali", "English"],
          isAvailable: false,
          about: "Dr. Rajib Ahmed is a skilled orthopedic surgeon specializing in joint replacement, sports injuries, and fracture management. He has successfully performed over 1000 surgeries with excellent outcomes.",
          services: ["Joint Replacement", "Arthroscopy", "Fracture Management", "Sports Injury Treatment"],
          achievements: ["Best Orthopedic Surgeon 2020", "Advanced Training in Germany", "Pioneer in Minimally Invasive Surgery"]
        },
        {
          id: 5,
          name: "Dr. Tahmina Akhter",
          specialty: "Dermatologist",
          experience: "8 years",
          rating: 4.8,
          reviews: 112,
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          availability: "Wed, Fri, Sat",
          location: "Skin Care Center, Sylhet",
          education: "DDV, BSMMU",
          languages: ["Bengali", "English", "Arabic"],
          isAvailable: true,
          about: "Dr. Tahmina Akhter is a dermatologist with expertise in medical, surgical, and cosmetic dermatology. She provides personalized treatment plans for various skin conditions.",
          services: ["Acne Treatment", "Skin Cancer Screening", "Cosmetic Procedures", "Laser Therapy"],
          achievements: ["Dermatology Innovation Award", "International Conference Speaker", "Advanced Laser Certification"]
        },
        {
          id: 6,
          name: "Dr. Sajal Kumar",
          specialty: "General Physician",
          experience: "16 years",
          rating: 4.7,
          reviews: 204,
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          availability: "Mon-Thu",
          location: "Popular Diagnostic Centre, Dhaka",
          education: "MBBS, FCPS, Dhaka University",
          languages: ["Bengali", "English", "Hindi"],
          isAvailable: true,
          about: "Dr. Sajal Kumar is an experienced general physician providing comprehensive primary care for adults. He focuses on preventive medicine and managing chronic conditions.",
          services: ["Health Check-ups", "Chronic Disease Management", "Preventive Care", "Vaccinations"],
          achievements: ["Primary Care Excellence Award", "Community Health Leader", "20+ Years of Service"]
        },
      ]);
    }

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Save doctors to localStorage whenever doctors state changes
  useEffect(() => {
    localStorage.setItem('doctors', JSON.stringify(doctors));
  }, [doctors]);

  // Check for new doctors when page becomes visible
  useEffect(() => {
    const checkForNewDoctor = () => {
      const doctorsFromStorage = JSON.parse(localStorage.getItem('doctors') || '[]');
      if (doctorsFromStorage.length !== doctors.length) {
        setDoctors(doctorsFromStorage);
      }
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForNewDoctor();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [doctors.length]);

  const checkIsMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleDoctorDetails = (doctorId) => {
    if (expandedDoctor === doctorId) {
      setExpandedDoctor(null);
    } else {
      setExpandedDoctor(doctorId);
    }
  };

  const specialties = [
    'All Specialties',
    'Cardiologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedic',
    'Dermatologist',
    'Gynecologist',
    'Oncologist',
    'General Physician'
  ];

  const stats = [
    { number: '50+', label: 'Specialized Doctors' },
    { number: '10,000+', label: 'Patients Treated' },
    { number: '98%', label: 'Success Rate' },
    { number: '24/7', label: 'Availability' }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesFilter = activeFilter === 'all' ||
      doctor.specialty.toLowerCase().includes(activeFilter.toLowerCase());
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="doctors-page font-sans bg-gray-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="doctors-animated-bg">
        <div className="doctors-bubble doctors-bubble-1"></div>
        <div className="doctors-bubble doctors-bubble-2"></div>
        <div className="doctors-bubble doctors-bubble-3"></div>
        <div className="doctors-bubble doctors-bubble-4"></div>
      </div>

      {/* Decorative Elements */}
      <div className="doctors-decorative-circle doctors-circle-1"></div>
      <div className="doctors-decorative-circle doctors-circle-2"></div>
      <div className="doctors-decorative-circle doctors-circle-3"></div>

      <Navbar />

      {/* Hero Section */}
      <section className="doctors-hero-section" style={{
        background: `linear-gradient(135deg, rgba(26, 36, 79, 0.85) 0%, rgba(39, 60, 117, 0.9) 100%), 
                   url('https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover`,
        backgroundAttachment: isMobile ? 'scroll' : 'fixed'
      }}>
        <div className="doctors-container">
          <div className="doctors-hero-content">
            <h1 className="doctors-hero-title" data-aos="fade-down" data-aos-delay="100">
              Our <span className="doctors-gradient-text">Medical Experts</span>
            </h1>
            <p className="doctors-hero-subtitle" data-aos="fade-up" data-aos-delay="300">
              Meet Bangladesh's team of highly qualified and experienced healthcare professionals
            </p>
            <div className="doctors-hero-cta" data-aos="fade-up" data-aos-delay="500">
              <button className="doctors-primary-btn" onClick={() => scrollToSection('find-doctor')}>
                Find Your Doctor
              </button>
              <button className="doctors-secondary-btn">
                Emergency Contact
              </button>
            </div>
          </div>
        </div>
        <div className="doctors-scroll-indicator" data-aos="fade-up" data-aos-delay="700" onClick={() => scrollToSection('find-doctor')}>
          <span>Scroll to explore</span>
          <div className="doctors-scroll-line">
            <FaArrowRight />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="doctors-stats-section">
        <div className="doctors-container">
          <div className="doctors-stats-grid">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="doctors-stat-card"
                data-aos="zoom-in"
                data-aos-delay={index * 150}
              >
                <div className="doctors-stat-number">{stat.number}</div>
                <div className="doctors-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="find-doctor" className="doctors-filter-section">
        <div className="doctors-container">
          <div className="doctors-filter-content" data-aos="fade-up">
            <h2 className="doctors-filter-title">Find Your Doctor</h2>
            <p className="doctors-filter-subtitle">Search from our team of experienced medical professionals</p>

            <div className="doctors-search-box" data-aos="fade-up" data-aos-delay="200">
              <div className="doctors-search-input">
                <FaSearch className="doctors-search-icon" />
                <input
                  type="text"
                  placeholder="Search by name, specialty or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="doctors-specialty-filters" data-aos="fade-up" data-aos-delay="300">
              <div className="doctors-filter-label">
                <FaFilter className="doctors-filter-icon" /> Filter by Specialty:
              </div>
              <div className="doctors-specialty-buttons">
                {specialties.map((specialty, index) => (
                  <button
                    key={index}
                    className={`doctors-specialty-btn ${activeFilter === (specialty === 'All Specialties' ? 'all' : specialty.toLowerCase()) ? 'active' : ''}`}
                    onClick={() => setActiveFilter(specialty === 'All Specialties' ? 'all' : specialty.toLowerCase())}
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="doctors-listing-section">
        <div className="doctors-container">
          <h2 className="doctors-listing-title" data-aos="fade-up">
            Our Medical Team <span className="doctors-count">({filteredDoctors.length} doctors)</span>
          </h2>

          <div className="doctors-grid">
            {filteredDoctors.map((doctor, index) => (
              <div
                key={doctor.id}
                className={`doctors-card ${expandedDoctor === doctor.id ? 'expanded' : ''}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="doctors-card-image">
                  <img src={doctor.image} alt={doctor.name} />
                  <div className={`doctors-availability ${doctor.isAvailable ? 'available' : 'not-available'}`}>
                    {doctor.isAvailable ? 'Available Today' : 'Not Available'}
                  </div>
                  <div className="doctors-image-overlay"></div>
                </div>

                <div className="doctors-card-content">
                  <div className="doctors-card-header">
                    <h3 className="doctors-card-name">{doctor.name}</h3>
                    <button
                      className="doctors-card-toggle"
                      onClick={() => toggleDoctorDetails(doctor.id)}
                    >
                      <FaArrowRight className={`doctors-toggle-icon ${expandedDoctor === doctor.id ? 'expanded' : ''}`} />
                    </button>
                  </div>
                  <p className="doctors-card-specialty">{doctor.specialty}</p>

                  <div className="doctors-card-rating">
                    <div className="doctors-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < Math.floor(doctor.rating) ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                    </div>
                    <span className="doctors-rating-text">
                      <span className="doctors-rating-value">{doctor.rating}</span>
                      <span className="doctors-reviews">({doctor.reviews} reviews)</span>
                    </span>
                  </div>

                  <div className="doctors-card-details">
                    <div className="doctors-detail-item">
                      <FaStethoscope className="doctors-detail-icon" />
                      <span>{doctor.experience} experience</span>
                    </div>
                    <div className="doctors-detail-item">
                      <FaMapMarkerAlt className="doctors-detail-icon" />
                      <span>{doctor.location}</span>
                    </div>
                    <div className="doctors-detail-item">
                      <FaCalendarAlt className="doctors-detail-icon" />
                      <span>{doctor.availability}</span>
                    </div>
                  </div>

                  {expandedDoctor === doctor.id && (
                    <div className="doctors-card-expanded">
                      <div className="doctors-about">
                        <h4>About Dr. {doctor.name.split(' ')[1]}</h4>
                        <p>{doctor.about}</p>
                      </div>

                      <div className="doctors-services">
                        <h4>Services Offered</h4>
                        <div className="doctors-services-list">
                          {doctor.services.map((service, i) => (
                            <span key={i} className="doctors-service-tag">{service}</span>
                          ))}
                        </div>
                      </div>

                      <div className="doctors-additional-info">
                        <div className="doctors-info-item">
                          <FaGraduationCap className="doctors-info-icon" />
                          <span>{doctor.education}</span>
                        </div>
                        <div className="doctors-info-item">
                          <FaLanguage className="doctors-info-icon" />
                          <span>{doctor.languages.join(', ')}</span>
                        </div>
                      </div>

                      <div className="doctors-achievements">
                        <h4>Notable Achievements</h4>
                        <ul>
                          {doctor.achievements.map((achievement, i) => (
                            <li key={i}>
                              <FaHeart className="doctors-achievement-icon" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="doctors-card-actions">
                    <button className="doctors-book-btn">
                      <FaCalendarAlt className="doctors-btn-icon" />
                      Book Appointment
                    </button>
                    <button
                      className="doctors-profile-btn"
                      onClick={() => toggleDoctorDetails(doctor.id)}
                    >
                      {expandedDoctor === doctor.id ? 'Less Details' : 'View Profile'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="doctors-no-results" data-aos="fade-up">
              <div className="doctors-no-results-icon">
                <FaUserMd />
              </div>
              <h3>No doctors found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button
                className="doctors-clear-filters"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="doctors-cta-section">
        <div className="doctors-container">
          <div className="doctors-cta-content" data-aos="zoom-in">
            <div className="doctors-cta-icon">
              <IoIosRocket />
            </div>
            <h2 className="doctors-cta-title">Can't Find the Right Specialist?</h2>
            <p className="doctors-cta-description">
              Our medical concierge team can help match you with the perfect doctor for your specific needs and preferences
            </p>
            <div className="doctors-cta-buttons">
              <button className="doctors-cta-btn doctors-cta-primary">
                <FaPhoneAlt className="doctors-cta-btn-icon" /> Contact Our Support
              </button>
              <button className="doctors-cta-btn doctors-cta-secondary">
                View All Specialties
              </button>
              <button
                className="doctors-cta-btn doctors-cta-tertiary"
                onClick={() => window.location.href = '/doctor-registration'}
              >
                <FaUserMd className="doctors-cta-btn-icon" /> Join Our Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorsPage;