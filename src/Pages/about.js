import React, { useEffect, useState } from 'react';
import { FaUsers, FaHistory, FaChartLine, FaAward, FaHandsHelping, FaMapMarkerAlt, FaHeartbeat, FaStethoscope, FaClinicMedical, FaChevronDown } from 'react-icons/fa';
import { IoIosRocket } from 'react-icons/io';
import { GiHealthPotion } from 'react-icons/gi';
import '../Styles/about.css';
import Navbar from '../components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutPage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [activeSection, setActiveSection] = useState('mission');
    
    useEffect(() => {
        AOS.init({
            duration: 1200,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false
        });
        
        // Check if mobile on initial load
        checkIsMobile();
        
        // Add resize listener
        window.addEventListener('resize', checkIsMobile);
        
        // Add scroll listener to update active section
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('resize', checkIsMobile);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
        const sections = ['mission', 'values', 'facilities', 'stats'];
        const scrollPosition = window.scrollY + 100;
        
        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const offsetTop = element.offsetTop;
                const offsetBottom = offsetTop + element.offsetHeight;
                
                if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                    setActiveSection(section);
                    break;
                }
            }
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            setActiveSection(sectionId);
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="about-page font-sans bg-gray-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="about-animated-bg">
                <div className="about-bubble about-bubble-1"></div>
                <div className="about-bubble about-bubble-2"></div>
                <div className="about-bubble about-bubble-3"></div>
                <div className="about-bubble about-bubble-4"></div>
                <div className="about-bubble about-bubble-5"></div>
            </div>

            {/* Enhanced Decorative Elements */}
            <div className="about-decorative-circle about-circle-1"></div>
            <div className="about-decorative-circle about-circle-2"></div>
            <div className="about-decorative-circle about-circle-3"></div>
            <div className="about-pattern-overlay"></div>

            <Navbar />

            {/* Navigation Dots */}
            <div className="about-navigation-dots">
                {['mission', 'values', 'facilities', 'stats'].map(section => (
                    <button
                        key={section}
                        className={`about-dot ${activeSection === section ? 'about-dot-active' : ''}`}
                        onClick={() => scrollToSection(section)}
                        aria-label={`Scroll to ${section} section`}
                    />
                ))}
            </div>

            {/* Enhanced Hero Section */}
            <section className="about-hero-section" style={{
                background: `linear-gradient(135deg, rgba(26, 36, 79, 0.85) 0%, rgba(39, 60, 117, 0.9) 100%), 
               url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover`,
                backgroundAttachment: isMobile ? 'scroll' : 'fixed'
            }}>
                <div className="about-container">
                    <div className="about-hero-content">
                        <div data-aos="fade-down" data-aos-delay="100">
                            <h1 className="about-hero-title">About <span className="about-gradient-text">OnCare</span></h1>
                        </div>
                        <div data-aos="fade-up" data-aos-delay="300">
                            <p className="about-hero-subtitle">
                                Revolutionizing healthcare delivery through innovation and compassion
                            </p>
                        </div>
                        <div data-aos="fade-up" data-aos-delay="500" className="about-hero-cta">
                            <button 
                                className="about-primary-btn" 
                                onClick={() => scrollToSection('mission')}
                                aria-label="Discover our story"
                            >
                                Discover Our Story
                            </button>
                            <button 
                                className="about-secondary-btn" 
                                onClick={() => scrollToSection('values')}
                                aria-label="Learn about our values"
                            >
                                Our Values
                            </button>
                        </div>
                    </div>
                </div>
                <div className="about-scroll-indicator" data-aos="fade-up" data-aos-delay="700" onClick={() => scrollToSection('mission')}>
                    <span>Scroll to explore</span>
                    <div className="about-scroll-line">
                        <FaChevronDown />
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section id="mission" className="about-section about-bg-white">
                <div className="about-container">
                    <div data-aos="fade-up" data-aos-anchor-placement="center-bottom">
                        <h2 className="about-section-title">Our Mission</h2>
                        <div className="about-section-divider"></div>
                    </div>
                    <div className="about-grid about-grid-cols-1 md:about-grid-cols-2 about-gap-12 about-items-center">
                        <div data-aos="fade-right" data-aos-delay="200">
                            <div className="about-mission-card">
                                <p className="about-text-lg about-text-gray-600 about-mb-6">
                                    To make quality healthcare accessible, affordable, and convenient for everyone through technology and compassionate service.
                                </p>
                                <p className="about-text-gray-600 about-mb-6">
                                    Founded in 2020, OnCare began with a simple idea: healthcare should come to you, not the other way around.
                                </p>
                                <div className="about-flex about-flex-wrap about-gap-4 about-mb-6">
                                    <div className="about-stat-pill">
                                        <FaUsers className="about-stat-icon" />
                                        <span>50,000+ Patients Served</span>
                                    </div>
                                    <div className="about-stat-pill">
                                        <FaHandsHelping className="about-stat-icon" />
                                        <span>200+ Healthcare Partners</span>
                                    </div>
                                </div>
                                <div className="about-mission-highlight">
                                    <IoIosRocket className="about-highlight-icon" />
                                    <span>Continually expanding our services to reach more communities</span>
                                </div>
                            </div>
                        </div>
                        <div className="about-floating" data-aos="fade-left" data-aos-delay="300">
                            <div className="about-image-container">
                                <img
                                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                                    alt="OnCare team"
                                    className="about-image about-main-img"
                                />
                                <div className="about-image-overlay about-overlay-1" data-aos="zoom-in" data-aos-delay="500">
                                    <FaHeartbeat className="about-overlay-icon" />
                                    <span>Patient Care</span>
                                </div>
                                <div className="about-image-overlay about-overlay-2" data-aos="zoom-in" data-aos-delay="600">
                                    <FaStethoscope className="about-overlay-icon" />
                                    <span>Expert Staff</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section id="values" className="about-section about-bg-gray-50">
                <div className="about-container">
                    <div data-aos="fade-up">
                        <h2 className="about-section-title">Our Core Values</h2>
                        <div className="about-section-divider"></div>
                        <p className="about-section-subtitle">The principles that guide everything we do</p>
                    </div>
                    <div className="about-grid about-grid-cols-1 md:about-grid-cols-2 lg:about-grid-cols-3 about-gap-6">
                        {[
                            {
                                icon: <FaUsers />,
                                title: "Patient-Centered",
                                description: "We put patients at the heart of everything we do."
                            },
                            {
                                icon: <FaChartLine />,
                                title: "Innovation",
                                description: "We continuously seek new ways to improve healthcare."
                            },
                            {
                                icon: <FaAward />,
                                title: "Excellence",
                                description: "We maintain the highest standards in medical care."
                            },
                            {
                                icon: <FaHandsHelping />,
                                title: "Compassion",
                                description: "We treat every patient with empathy and respect."
                            },
                            {
                                icon: <FaHistory />,
                                title: "Integrity",
                                description: "We uphold the highest ethical standards."
                            },
                            {
                                icon: <FaMapMarkerAlt />,
                                title: "Accessibility",
                                description: "We remove barriers to healthcare."
                            }
                        ].map((value, index) => (
                            <div
                                key={index}
                                className="about-value-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="about-text-center">
                                    <div className="about-icon-container about-mx-auto" data-aos="zoom-in" data-aos-delay={index * 100 + 200}>
                                        {value.icon}
                                    </div>
                                    <h3 className="about-text-xl about-font-semibold about-mb-3 about-text-gray-800">{value.title}</h3>
                                    <p className="about-text-gray-600">{value.description}</p>
                                </div>
                                <div className="about-value-hover-effect"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Facilities Section */}
            <section id="facilities" className="about-section about-bg-white">
                <div className="about-container">
                    <div className="about-grid about-grid-cols-1 md:about-grid-cols-2 about-gap-8 about-items-center">
                        <div className="about-floating" data-aos="fade-right" data-aos-delay="200">
                            <div className="about-image-container">
                                <img
                                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                                    alt="OnCare facility interior"
                                    className="about-image about-main-img"
                                />
                                <div className="about-image-overlay about-overlay-3" data-aos="zoom-in" data-aos-delay="400">
                                    <FaClinicMedical className="about-overlay-icon" />
                                    <span>Modern Facilities</span>
                                </div>
                            </div>
                        </div>
                        <div data-aos="fade-left" data-aos-delay="300">
                            <div className="about-facility-list">
                                <h3 className="about-text-2xl about-font-semibold about-mb-6 about-text-gray-800">Our <span className="about-gradient-text">Facilities</span></h3>
                                <p className="about-text-gray-600 about-mb-8">State-of-the-art medical centers designed for comfort and optimal care delivery</p>
                                <ul className="about-space-y-4">
                                    {[
                                        '10+ consultation rooms',
                                        'On-site diagnostic lab',
                                        '24/7 emergency support',
                                        'Pharmacy with home delivery',
                                        'Telemedicine capabilities',
                                        'Comfortable waiting areas',
                                        'Advanced medical equipment',
                                        'Accessibility features'
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className="about-facility-item"
                                            data-aos="fade-up"
                                            data-aos-delay={i * 100 + 400}
                                        >
                                            <span className="about-facility-checkmark">
                                                <svg className="about-checkmark-svg" viewBox="0 0 24 24">
                                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                </svg>
                                            </span>
                                            <span className="about-text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="about-section about-bg-gradient">
                <div className="about-container">
                    <div data-aos="fade-up">
                        <h2 className="about-section-title about-text-white">By The Numbers</h2>
                        <div className="about-section-divider about-bg-white"></div>
                    </div>
                    <div className="about-grid about-grid-cols-2 md:about-grid-cols-4 about-gap-4 md:about-gap-6 about-text-center">
                        {[
                            { number: '50,000+', label: 'Patients Served' },
                            { number: '200+', label: 'Healthcare Partners' },
                            { number: '98%', label: 'Patient Satisfaction' },
                            { number: '24/7', label: 'Support Availability' }
                        ].map((stat, index) => (
                            <div 
                                key={index} 
                                className="about-stat-card"
                                data-aos="zoom-in"
                                data-aos-delay={index * 150}
                            >
                                <div className="about-stat-number">{stat.number}</div>
                                <div className="about-stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-section about-bg-white">
                <div className="about-container">
                    <div className="about-cta-card" data-aos="zoom-in">
                        <GiHealthPotion className="about-cta-icon" />
                        <h3 className="about-cta-title">Join the OnCare Family Today</h3>
                        <p className="about-cta-text">Experience healthcare that puts you first with our innovative approach to medical services.</p>
                        <div className="about-cta-buttons">
                            <button className="about-primary-btn">Get Started</button>
                            <button className="about-secondary-btn about-cta-secondary">Learn More</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;