import React, { useEffect, useState } from 'react';
import { 
  FaUserMd, 
  FaStethoscope, 
  FaStar, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaPhoneAlt,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import '../Styles/doctors.css';
import Navbar from '../components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';

const DoctorsPage = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out-quad',
            once: true
        });
    }, []);

    const doctors = [
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
            isAvailable: true
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
            isAvailable: true
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
            isAvailable: true
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
            isAvailable: false
        },
        {
            id: 5,
            name: "Dr. Tahmina Akhter",
            specialty: "Dermatologist",
            experience: "8 years",
            rating: 4.8,
            reviews: 112,
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            availability: "Wed, Fri, Sat",
            location: "Skin Care Center, Sylhet",
            education: "DDV, BSMMU",
            languages: ["Bengali", "English", "Arabic"],
            isAvailable: true
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
            isAvailable: true
        },
       
    ];

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

    const filteredDoctors = doctors.filter(doctor => {
        const matchesFilter = activeFilter === 'all' || 
                             doctor.specialty.toLowerCase().includes(activeFilter.toLowerCase());
        const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="doctors-page font-sans bg-gray-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="doctors-decorative-circle doctors-circle-1"></div>
            <div className="doctors-decorative-circle doctors-circle-2"></div>
            <div className="doctors-decorative-circle doctors-circle-3"></div>

            <Navbar />

            {/* Hero Section */}
            <section className="doctors-hero-section" style={{
                background: `linear-gradient(135deg, rgba(79, 70, 229, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%), 
                           url('https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover`,
                backgroundAttachment: 'fixed'
            }}>
                <div className="doctors-container">
                    <div className="doctors-hero-content">
                        <h1 className="doctors-hero-title">Our <span className="doctors-gradient-text">Medical Experts</span></h1>
                        <p className="doctors-hero-subtitle">
                            Meet Bangladesh's team of highly qualified and experienced healthcare professionals
                        </p>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="doctors-filter-section">
                <div className="doctors-container">
                    <div className="doctors-filter-content" data-aos="fade-up">
                        <h2 className="doctors-filter-title">Find Your Doctor</h2>
                        
                        <div className="doctors-search-box">
                            <div className="doctors-search-input">
                                <FaSearch className="doctors-search-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Search by name or specialty..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="doctors-specialty-filters">
                            <div className="doctors-filter-label">
                                <FaFilter className="mr-2" /> Filter by Specialty:
                            </div>
                            <div className="doctors-specialty-buttons">
                                {specialties.map((specialty, index) => (
                                    <button
                                        key={index}
                                        className={`doctors-specialty-btn ${activeFilter === specialty.toLowerCase() ? 'active' : ''}`}
                                        onClick={() => setActiveFilter(specialty === 'All Specialties' ? 'all' : specialty.toLowerCase())}
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
                                className="doctors-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="doctors-card-image">
                                    <img src={doctor.image} alt={doctor.name} />
                                    <div className={`doctors-availability ${doctor.isAvailable ? 'available' : 'not-available'}`}>
                                        {doctor.isAvailable ? 'Available Today' : 'Not Available'}
                                    </div>
                                </div>

                                <div className="doctors-card-content">
                                    <h3 className="doctors-card-name">{doctor.name}</h3>
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
                                        <span className="doctors-rating-value">{doctor.rating}</span>
                                        <span className="doctors-reviews">({doctor.reviews} reviews)</span>
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

                                    <div className="doctors-card-actions">
                                        <button className="doctors-book-btn">
                                            Book Appointment
                                        </button>
                                        <button className="doctors-profile-btn">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredDoctors.length === 0 && (
                        <div className="doctors-no-results" data-aos="fade-up">
                            <h3>No doctors found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="doctors-cta-section">
                <div className="doctors-container">
                    <div className="doctors-cta-content" data-aos="fade-up">
                        <h2 className="doctors-cta-title">Can't Find the Right Specialist?</h2>
                        <p className="doctors-cta-description">
                            Our team can help match you with the perfect doctor for your needs
                        </p>
                        <div className="doctors-cta-buttons">
                            <button className="doctors-cta-btn doctors-cta-primary">
                                <FaPhoneAlt className="mr-2" /> Contact Our Support
                            </button>
                            <button className="doctors-cta-btn doctors-cta-secondary">
                                View All Specialties
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DoctorsPage;