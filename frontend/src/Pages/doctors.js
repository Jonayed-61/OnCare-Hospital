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
    const [doctors, setDoctors] = useState([]); // <-- fetch from backend
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false
        });
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    useEffect(() => {
        // Fetch doctors from backend
        const fetchDoctors = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('http://localhost:5000/api/doctors');
                const data = await response.json();
                if (data.success) {
                    setDoctors(data.doctors);
                } else {
                    setError(data.message || 'Failed to fetch doctors');
                }
            } catch (err) {
                setError('Failed to fetch doctors');
            }
            setLoading(false);
        };
        fetchDoctors();
    }, []);

        // Check login status
        const isLoggedIn = !!localStorage.getItem('token');
        const handleJoinOurTeam = () => {
            if (isLoggedIn) {
                window.location.href = '/registration';
            } else {
                // Store intended redirect
                localStorage.setItem('postLoginRedirect', '/registration');
                window.location.href = '/login';
            }
        };
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
            (doctor.specialty && doctor.specialty.toLowerCase().includes(activeFilter.toLowerCase()));
        const matchesSearch = (doctor.name && doctor.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (doctor.specialty && doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (doctor.location && doctor.location.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return <div className="doctors-page"><Navbar /><div className="doctors-container">Loading doctors...</div></div>;
    }

    if (error) {
        return <div className="doctors-page"><Navbar /><div className="doctors-container">{error}</div></div>;
    }

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
                                    onClick={handleJoinOurTeam}
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