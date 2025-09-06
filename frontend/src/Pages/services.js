import React, { useEffect } from 'react';
import { 
  FaStethoscope, 
  FaAmbulance, 
  FaUserMd, 
  FaPills, 
  FaHeartbeat, 
  FaMicroscope,
  FaClock,
  FaShieldAlt,
  FaMobileAlt,
  FaCalendarCheck
} from 'react-icons/fa';
import '../Styles/services.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // Import the Footer component
import AOS from 'aos';
import 'aos/dist/aos.css';

const ServicesPage = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out-quad',
            once: true
        });
    }, []);

    return (
        <div className="services-page font-sans bg-gray-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="services-decorative-circle services-circle-1"></div>
            <div className="services-decorative-circle services-circle-2"></div>
            <div className="services-decorative-circle services-circle-3"></div>

            <Navbar />

            {/* Hero Section */}
            <section className="services-hero-section" style={{
                background: `linear-gradient(135deg, rgba(79, 70, 229, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%), 
                           url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover`,
                backgroundAttachment: 'fixed'
            }}>
                <div className="services-container">
                    <div className="services-hero-content">
                        <h1 className="services-hero-title">Our <span className="services-gradient-text">Healthcare Services</span></h1>
                        <p className="services-hero-subtitle">
                            Comprehensive medical care delivered with compassion and cutting-edge technology
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="services-section services-bg-white">
                <div className="services-container">
                    <div className="services-header" data-aos="fade-up">
                        <h2 className="services-section-title">Comprehensive Medical Services</h2>
                        <p className="services-section-subtitle">
                            We offer a wide range of healthcare services to meet all your medical needs
                        </p>
                    </div>

                    <div className="services-grid">
                        {[
                            {
                                icon: <FaUserMd />,
                                title: "Doctor Consultation",
                                description: "Virtual and in-person consultations with experienced doctors",
                                features: ["24/7 Availability", "Specialist Doctors", "Follow-up Care"],
                                color: "blue"
                            },
                            {
                                icon: <FaAmbulance />,
                                title: "Emergency Care",
                                description: "Immediate medical attention for urgent health concerns",
                                features: ["Rapid Response", "Critical Care", "Ambulance Service"],
                                color: "red"
                            },
                            {
                                icon: <FaMicroscope />,
                                title: "Diagnostic Services",
                                description: "Advanced laboratory tests and imaging services",
                                features: ["Blood Tests", "MRI & CT Scan", "Ultrasound"],
                                color: "purple"
                            },
                            {
                                icon: <FaPills />,
                                title: "Pharmacy Services",
                                description: "Medication delivery and pharmaceutical guidance",
                                features: ["Home Delivery", "Generic Options", "Expert Advice"],
                                color: "green"
                            },
                            {
                                icon: <FaHeartbeat />,
                                title: "Chronic Disease Management",
                                description: "Comprehensive care for long-term health conditions",
                                features: ["Diabetes Care", "Heart Disease", "Hypertension"],
                                color: "pink"
                            },
                            {
                                icon: <FaStethoscope />,
                                title: "Preventive Care",
                                description: "Health screenings and preventive consultations",
                                features: ["Health Checkups", "Vaccinations", "Lifestyle Advice"],
                                color: "orange"
                            }
                        ].map((service, index) => (
                            <div
                                key={index}
                                className={`services-card services-card-${service.color}`}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="services-card-icon">
                                    {service.icon}
                                </div>
                                <h3 className="services-card-title">{service.title}</h3>
                                <p className="services-card-description">{service.description}</p>
                                <ul className="services-features-list">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="services-feature-item">
                                            <span className="services-checkmark">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className="services-learn-more-btn">
                                    Learn More
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="services-section services-bg-gray-50">
                <div className="services-container">
                    <h2 className="services-section-title" data-aos="fade-up">How It Works</h2>
                    <div className="services-process-steps">
                        {[
                            {
                                icon: <FaMobileAlt />,
                                title: "Book Appointment",
                                description: "Schedule your consultation via app, website, or phone call"
                            },
                            {
                                icon: <FaUserMd />,
                                title: "Consult Doctor",
                                description: "Meet with our certified doctors virtually or in-person"
                            },
                            {
                                icon: <FaMicroscope />,
                                title: "Get Diagnosis",
                                description: "Receive accurate diagnosis and treatment plan"
                            },
                            {
                                icon: <FaPills />,
                                title: "Receive Treatment",
                                description: "Get medications delivered and follow-up care"
                            }
                        ].map((step, index) => (
                            <div
                                key={index}
                                className="services-process-step"
                                data-aos="fade-up"
                                data-aos-delay={index * 150}
                            >
                                <div className="services-step-number">{index + 1}</div>
                                <div className="services-step-icon">
                                    {step.icon}
                                </div>
                                <h3 className="services-step-title">{step.title}</h3>
                                <p className="services-step-description">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="services-section services-bg-white">
                <div className="services-container">
                    <h2 className="services-section-title" data-aos="fade-up">Why Choose MediSheba?</h2>
                    <div className="services-features-grid">
                        {[
                            {
                                icon: <FaClock />,
                                title: "24/7 Availability",
                                description: "Round-the-clock medical support for all your needs"
                            },
                            {
                                icon: <FaShieldAlt />,
                                title: "Certified Doctors",
                                description: "All our doctors are certified and experienced professionals"
                            },
                            {
                                icon: <FaCalendarCheck />,
                                title: "Easy Scheduling",
                                description: "Book appointments with just a few clicks"
                            },
                            {
                                icon: <FaMobileAlt />,
                                title: "Mobile Access",
                                description: "Access healthcare services from anywhere, anytime"
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="services-feature-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="services-feature-icon">
                                    {feature.icon}
                                </div>
                                <h3 className="services-feature-title">{feature.title}</h3>
                                <p className="services-feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="services-cta-section">
                <div className="services-container">
                    <div className="services-cta-content" data-aos="fade-up">
                        <h2 className="services-cta-title">Ready to Experience Better Healthcare?</h2>
                        <p className="services-cta-description">
                            Join thousands of satisfied patients who trust MediSheba for their healthcare needs
                        </p>
                        <div className="services-cta-buttons">
                            <button className="services-cta-btn services-cta-primary">
                                Book Appointment Now
                            </button>
                            <button className="services-cta-btn services-cta-secondary">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;