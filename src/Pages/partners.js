import React, { useEffect } from 'react';
import { 
  FaHandshake, 
  FaHospital, 
  FaClinicMedical, 
  FaFlask, 
  FaAmbulance,
  FaAward,
  FaChartLine,
  FaUsers,
  FaGlobeAmericas
} from 'react-icons/fa';
import '../Styles/partners.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PartnersPage = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out-quad',
            once: true
        });
    }, []);

    // Sample partner data
    const hospitalPartners = [
        {
            id: 1,
            name: "Rajshahi Medical College Hospital",
            logo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            type: "Government Hospital",
            since: "2018"
        },
        {
            id: 2,
            name: "Ibn Sina Hospital",
            logo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            type: "Private Hospital",
            since: "2019"
        },
        {
            id: 3,
            name: "Popular Diagnostic Centre",
            logo: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            type: "Diagnostic Center",
            since: "2020"
        },
        {
            id: 4,
            name: "Labaid Pharmaceuticals",
            logo: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            type: "Pharmaceutical Company",
            since: "2019"
        }
    ];

    const ambulancePartners = [
        {
            id: 1,
            name: "Speed Ambulance Service",
            logo: "https://images.unsplash.com/photo-1585165889571-64d81bcbbbe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            coverage: "Whole Rajshahi Division",
            since: "2020"
        },
        {
            id: 2,
            name: "LifeCare Ambulance",
            logo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            coverage: "Rajshahi City",
            since: "2021"
        }
    ];

    const labPartners = [
        {
            id: 1,
            name: "Central Diagnostic Lab",
            logo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            tests: "200+ Tests Available",
            since: "2018"
        },
        {
            id: 2,
            name: "Medinova Laboratory Services",
            logo: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            tests: "150+ Tests Available",
            since: "2019"
        }
    ];

    const benefits = [
        {
            icon: <FaUsers />,
            title: "Expanded Reach",
            description: "Access to a wider patient base through our platform"
        },
        {
            icon: <FaChartLine />,
            title: "Increased Visibility",
            description: "Featured in our marketing materials and app"
        },
        {
            icon: <FaGlobeAmericas />,
            title: "Digital Integration",
            description: "Seamless integration with our digital healthcare ecosystem"
        },
        {
            icon: <FaAward />,
            title: "Reputation Boost",
            description: "Association with a trusted healthcare platform"
        }
    ];

    return (
        <div className="partners-page font-sans bg-gray-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="partners-decorative-circle partners-circle-1"></div>
            <div className="partners-decorative-circle partners-circle-2"></div>
            <div className="partners-decorative-circle partners-circle-3"></div>

            <Navbar />

            {/* Hero Section */}
            <section className="partners-hero-section" style={{
                background: `linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%), 
                           url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover`,
                backgroundAttachment: 'fixed'
            }}>
                <div className="partners-container">
                    <div className="partners-hero-content">
                        <h1 className="partners-hero-title">Our <span className="partners-gradient-text">Partners</span></h1>
                        <p className="partners-hero-subtitle">
                            Collaborating with the best healthcare providers to deliver exceptional service
                        </p>
                    </div>
                </div>
            </section>

            {/* Partners Introduction */}
            <section className="partners-section partners-bg-white">
                <div className="partners-container">
                    <div className="partners-header" data-aos="fade-up">
                        <h2 className="partners-section-title">Strategic Healthcare Partnerships</h2>
                        <p className="partners-section-subtitle">
                            At MediSheba, we believe in the power of collaboration. Our network of trusted partners 
                            allows us to provide comprehensive healthcare services across Bangladesh.
                        </p>
                    </div>
                </div>
            </section>

            {/* Hospital Partners */}
            <section className="partners-section partners-bg-gray-50">
                <div className="partners-container">
                    <div className="partners-category-header" data-aos="fade-up">
                        <div className="partners-category-icon">
                            <FaHospital />
                        </div>
                        <h2 className="partners-category-title">Hospital & Clinic Partners</h2>
                        <p className="partners-category-subtitle">
                            Leading healthcare institutions that provide specialized medical services
                        </p>
                    </div>

                    <div className="partners-grid">
                        {hospitalPartners.map((partner, index) => (
                            <div
                                key={partner.id}
                                className="partner-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="partner-logo-container">
                                    <img src={partner.logo} alt={partner.name} className="partner-logo" />
                                </div>
                                <h3 className="partner-name">{partner.name}</h3>
                                <p className="partner-type">{partner.type}</p>
                                <div className="partner-details">
                                    <p className="partner-since">Partner since {partner.since}</p>
                                </div>
                                <button className="partner-view-btn">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ambulance Partners */}
            <section className="partners-section partners-bg-white">
                <div className="partners-container">
                    <div className="partners-category-header" data-aos="fade-up">
                        <div className="partners-category-icon">
                            <FaAmbulance />
                        </div>
                        <h2 className="partners-category-title">Emergency Service Partners</h2>
                        <p className="partners-category-subtitle">
                            Reliable ambulance services for emergency medical transportation
                        </p>
                    </div>

                    <div className="partners-grid">
                        {ambulancePartners.map((partner, index) => (
                            <div
                                key={partner.id}
                                className="partner-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="partner-logo-container">
                                    <img src={partner.logo} alt={partner.name} className="partner-logo" />
                                </div>
                                <h3 className="partner-name">{partner.name}</h3>
                                <p className="partner-type">Coverage: {partner.coverage}</p>
                                <div className="partner-details">
                                    <p className="partner-since">Partner since {partner.since}</p>
                                </div>
                                <button className="partner-view-btn">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Laboratory Partners */}
            <section className="partners-section partners-bg-gray-50">
                <div className="partners-container">
                    <div className="partners-category-header" data-aos="fade-up">
                        <div className="partners-category-icon">
                            <FaFlask />
                        </div>
                        <h2 className="partners-category-title">Diagnostic Laboratory Partners</h2>
                        <p className="partners-category-subtitle">
                            Accredited laboratories providing accurate diagnostic services
                        </p>
                    </div>

                    <div className="partners-grid">
                        {labPartners.map((partner, index) => (
                            <div
                                key={partner.id}
                                className="partner-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="partner-logo-container">
                                    <img src={partner.logo} alt={partner.name} className="partner-logo" />
                                </div>
                                <h3 className="partner-name">{partner.name}</h3>
                                <p className="partner-type">{partner.tests}</p>
                                <div className="partner-details">
                                    <p className="partner-since">Partner since {partner.since}</p>
                                </div>
                                <button className="partner-view-btn">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partnership Benefits */}
            <section className="partners-section partners-bg-blue-50">
                <div className="partners-container">
                    <div className="partners-header" data-aos="fade-up">
                        <h2 className="partners-section-title">Benefits of Partnership</h2>
                        <p className="partners-section-subtitle">
                            Join our network of healthcare providers and grow your practice with us
                        </p>
                    </div>

                    <div className="benefits-grid">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="benefit-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="benefit-icon">
                                    {benefit.icon}
                                </div>
                                <h3 className="benefit-title">{benefit.title}</h3>
                                <p className="benefit-description">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Become a Partner CTA */}
            <section className="partners-cta-section">
                <div className="partners-container">
                    <div className="partners-cta-content" data-aos="fade-up">
                        <div className="partners-cta-icon">
                            <FaHandshake />
                        </div>
                        <h2 className="partners-cta-title">Interested in Becoming a Partner?</h2>
                        <p className="partners-cta-description">
                            Join our network of healthcare providers and expand your reach while delivering quality care to more patients.
                        </p>
                        <div className="partners-cta-buttons">
                            <button className="partners-cta-btn partners-cta-primary">
                                Apply for Partnership
                            </button>
                            <button className="partners-cta-btn partners-cta-secondary">
                                Contact Our Team
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PartnersPage;