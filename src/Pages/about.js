import React, { useEffect } from 'react';
import { FaUsers, FaHistory, FaChartLine, FaAward, FaHandsHelping, FaMapMarkerAlt } from 'react-icons/fa';
import '../Styles/about.css';
import Navbar from '../components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutPage = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out-quad',
            once: true
        });
    }, []);

    return (
        <div className="about-page font-sans bg-gray-50 relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="about-decorative-circle about-circle-1"></div>
            <div className="about-decorative-circle about-circle-2"></div>

            <Navbar />

            <section className="about-hero-section1" style={{
                background: `linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%), 
               url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover`,
                backgroundAttachment: 'fixed'
            }}>
                <div className="about-container">
                    <div className="about-hero-content">
                        <h1 className="about-hero-title">About <span className="about-gradient-text">OnCare</span></h1>
                        <p className="about-hero-subtitle">
                            Revolutionizing healthcare delivery through innovation and compassion
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="about-section1 about-bg-white">
                <div className="about-container">
                    <h2 className="about-section-title" data-aos="fade-up">Our Mission</h2>
                    <div className="about-grid about-grid-cols-1 md:about-grid-cols-2 about-gap-12 about-items-center">
                        <div data-aos="fade-right">
                            <div className="about-mission-card">
                                <p className="about-text-lg about-text-gray-600 about-mb-6">
                                    To make quality healthcare accessible, affordable, and convenient for everyone through technology and compassionate service.
                                </p>
                                <p className="about-text-gray-600 about-mb-6">
                                    Founded in 2020, MediSheba began with a simple idea: healthcare should come to you, not the other way around.
                                </p>
                                <div className="about-flex about-flex-wrap about-gap-4">
                                    <div className="about-flex about-items-center about-bg-blue-50 about-px-4 about-py-3 about-rounded-full hover:about-bg-blue-100 about-transition-colors">
                                        <FaUsers className="about-text-blue-600 about-mr-2" />
                                        <span>50,000+ Patients Served</span>
                                    </div>
                                    <div className="about-flex about-items-center about-bg-green-50 about-px-4 about-py-3 about-rounded-full hover:about-bg-green-100 about-transition-colors">
                                        <FaHandsHelping className="about-text-green-600 about-mr-2" />
                                        <span>200+ Healthcare Partners</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="about-floating" data-aos="fade-left">
                            <div className="about-facility-image">
                                <img
                                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                                    alt="OnCare team"
                                    className="about-w-full about-h-auto about-object-cover"
                                    style={{ height: '500px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-section1 about-bg-gray-50">
                <div className="about-container">
                    <h2 className="about-section-title" data-aos="fade-up">Our Core Values</h2>
                    <div className="about-grid about-grid-cols-1 md:about-grid-cols-3 about-gap-8">
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
                                    <div className="about-icon-container about-mx-auto">
                                        {value.icon}
                                    </div>
                                    <h3 className="about-text-xl about-font-semibold about-mb-3 about-text-gray-800">{value.title}</h3>
                                    <p className="about-text-gray-600">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Facilities Section */}
            <section className="about-section1 about-bg-white">
                <div className="about-container">
                    <div className="about-grid about-grid-cols-1 md:about-grid-cols-2 about-gap-12 about-items-center">
                        <div className="about-floating" data-aos="fade-right">
                            <div className="about-facility-image">
                                <img
                                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                                    alt="MediSheba facility interior"
                                    className="about-w-full about-h-auto about-object-cover"
                                    style={{ height: '500px' }}
                                />
                            </div>
                        </div>
                        <div data-aos="fade-left">
                            <div className="about-facility-list">
                                <h3 className="about-text-2xl about-font-semibold about-mb-6 about-text-gray-800">Our <span className="about-gradient-text">Facilities</span></h3>
                                <ul className="about-space-y-4">
                                    {[
                                        '10+ consultation rooms',
                                        'On-site diagnostic lab',
                                        '24/7 emergency support',
                                        'Pharmacy with home delivery'
                                    ].map((item, i) => (
                                        <li
                                            key={i}
                                            className="about-facility-item"
                                            data-aos="fade-up"
                                            data-aos-delay={i * 100 + 300}
                                        >
                                            <span className="about-text-green-500 about-mr-3 about-text-xl">✓</span>
                                            <span className="about-text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;