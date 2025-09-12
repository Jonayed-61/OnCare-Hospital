import React, { useEffect, useState, useRef } from 'react';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaPaperPlane,
  FaHeadset,
  FaComments,
  FaArrowRight,
  FaTimes,
  FaUser,
  FaPaperclip,
  FaSmile,
  FaVideo,
  FaPhoneAlt
} from 'react-icons/fa';
import '../Styles/contact.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import io from 'socket.io-client';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeFAQ, setActiveFAQ] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatConnected, setChatConnected] = useState(false);
    const [userId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out-quad',
            once: true
        });

        // Initialize socket connection
        socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

        socketRef.current.on('connect', () => {
            console.log('Connected to chat server');
            setChatConnected(true);
            
            // Join chat as user
            socketRef.current.emit('join-chat', {
                userId,
                userName: 'Guest User'
            });
        });

        socketRef.current.on('receive-message', (message) => {
            setChatMessages(prev => [...prev, message]);
            scrollToBottom();
        });

        socketRef.current.on('user-typing', (data) => {
            setIsTyping(data.isTyping);
        });

        socketRef.current.on('disconnect', () => {
            setChatConnected(false);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [userId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
        
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        }, 3000);
    };

    const toggleFAQ = (index) => {
        setActiveFAQ(activeFAQ === index ? null : index);
    };

    const handleChatToggle = () => {
        setShowChat(!showChat);
    };

    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
        
        // Handle typing indicators
        if (socketRef.current && chatConnected) {
            socketRef.current.emit('typing-start', { userId, isSupport: false });
            
            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            
            // Set timeout to stop typing indicator
            typingTimeoutRef.current = setTimeout(() => {
                socketRef.current.emit('typing-stop', { userId, isSupport: false });
            }, 1000);
        }
    };

    const sendMessage = () => {
        if (newMessage.trim() && socketRef.current && chatConnected) {
            const messageData = {
                userId,
                userName: 'Guest User',
                message: newMessage.trim(),
                isSupport: false,
                timestamp: new Date()
            };
            
            socketRef.current.emit('send-message', messageData);
            setNewMessage('');
            
            // Stop typing indicator
            if (socketRef.current) {
                socketRef.current.emit('typing-stop', { userId, isSupport: false });
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const contactInfo = [
        {
            icon: <FaPhone />,
            title: "Phone",
            details: "+880 1234 567890",
            description: "Mon to Fri 9am to 6pm",
            color: "bg-blue-500"
        },
        {
            icon: <FaEnvelope />,
            title: "Email",
            details: "info@medisheba.com",
            description: "Send us your query anytime!",
            color: "bg-purple-500"
        },
        {
            icon: <FaMapMarkerAlt />,
            title: "Address",
            details: "123 Medical Street, Rajshahi",
            description: "Bangladesh",
            color: "bg-pink-500"
        },
        {
            icon: <FaClock />,
            title: "Office Hours",
            details: "9:00 AM - 6:00 PM",
            description: "Saturday to Thursday",
            color: "bg-teal-500"
        }
    ];

    const supportOptions = [
        {
            icon: <FaHeadset />,
            title: "General Support",
            description: "Get help with general questions about our services",
            contact: "support@medisheba.com"
        },
        {
            icon: <FaComments />,
            title: "Technical Support",
            description: "Experiencing technical issues? Contact our tech team",
            contact: "tech@medisheba.com"
        },
        {
            icon: <FaPaperPlane />,
            title: "Partnership Inquiries",
            description: "Interested in partnering with us? Let's talk",
            contact: "partners@medisheba.com"
        }
    ];

    const socialLinks = [
        {
            icon: <FaFacebookF />,
            url: "#",
            name: "Facebook",
            color: "hover:bg-blue-600"
        },
        {
            icon: <FaTwitter />,
            url: "#",
            name: "Twitter",
            color: "hover:bg-blue-400"
        },
        {
            icon: <FaLinkedinIn />,
            url: "#",
            name: "LinkedIn",
            color: "hover:bg-blue-700"
        },
        {
            icon: <FaInstagram />,
            url: "#",
            name: "Instagram",
            color: "hover:bg-pink-600"
        }
    ];

    const faqItems = [
        {
            question: "How do I book an appointment through MediSheba?",
            answer: "You can book appointments through our website or mobile app by selecting your preferred doctor, date, and time. You'll receive a confirmation email with all details."
        },
        {
            question: "What should I do in case of a medical emergency?",
            answer: "In case of emergency, please call our emergency helpline at +880 1234 567890 immediately. For critical situations, visit the nearest hospital emergency room."
        },
        {
            question: "How can I become a partner healthcare provider?",
            answer: "Healthcare institutions interested in partnership can apply through our Partners page or contact our business development team at partners@medisheba.com."
        },
        {
            question: "Do you offer home sample collection for lab tests?",
            answer: "Yes, we offer home sample collection services through our partner laboratories. You can schedule a collection through our app or website."
        }
    ];

    return (
        <div className="contact-page font-sans bg-gray-50 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="contact-animated-bg">
                <div className="contact-circle"></div>
                <div className="contact-circle"></div>
                <div className="contact-circle"></div>
                <div className="contact-square"></div>
                <div className="contact-square"></div>
                <div className="contact-x"></div>
                <div className="contact-x"></div>
            </div>

            <Navbar />

            {/* Live Chat Widget */}
            {showChat && (
                <div className="live-chat-widget" data-aos="fade-left">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <div className="chat-avatar">
                                <FaUser />
                            </div>
                            <div>
                                <h3>MediSheba Support</h3>
                                <div className={`chat-status ${chatConnected ? 'online' : 'offline'}`}>
                                    {chatConnected ? 'Online' : 'Offline'}
                                </div>
                            </div>
                        </div>
                        <button className="chat-close-btn" onClick={handleChatToggle}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {chatMessages.length === 0 ? (
                            <div className="chat-welcome">
                                <div className="welcome-avatar">
                                    <FaHeadset />
                                </div>
                                <h4>Welcome to MediSheba Support!</h4>
                                <p>How can we help you today? Our team is here to assist you.</p>
                            </div>
                        ) : (
                            chatMessages.map((msg, index) => (
                                <div key={index} className={`chat-message ${msg.isSupport ? 'support' : 'user'}`}>
                                    <div className="message-content">
                                        <p>{msg.message}</p>
                                        <span className="message-time">
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                        {isTyping && (
                            <div className="typing-indicator">
                                <div className="typing-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <span>Support is typing...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-container">
                        <div className="chat-input-actions">
                            <button className="chat-action-btn">
                                <FaPaperclip />
                            </button>
                            <button className="chat-action-btn">
                                <FaSmile />
                            </button>
                        </div>
                        <textarea
                            value={newMessage}
                            onChange={handleMessageChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="chat-input"
                            rows="1"
                            disabled={!chatConnected}
                        />
                        <button 
                            onClick={sendMessage}
                            className="chat-send-btn"
                            disabled={!newMessage.trim() || !chatConnected}
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}

            {/* Chat Toggle Button */}
            <button className="chat-toggle-btn" onClick={handleChatToggle}>
                <FaHeadset />
                <span className="chat-badge">{chatConnected ? 'Live' : 'Off'}</span>
            </button>

            {/* Hero Section */}
            <section className="contact-hero-section" style={{
                background: `linear-gradient(135deg, rgba(59, 130, 246, 0.85) 0%, rgba(139, 92, 246, 0.85) 100%), 
                           url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover`,
            }}>
                <div className="contact-container">
                    <div className="contact-hero-content" data-aos="fade-up">
                        <div className="contact-breadcrumb">
                            <span className="contact-breadcrumb-item">Home</span>
                            <span className="contact-breadcrumb-separator">/</span>
                            <span className="contact-breadcrumb-item active">Contact</span>
                        </div>
                        <h1 className="contact-hero-title">Get in <span className="contact-gradient-text">Touch</span></h1>
                        <p className="contact-hero-subtitle">
                            We're here to answer your questions and connect you with the healthcare services you need
                        </p>
                        <div className="contact-hero-cta">
                            <button className="contact-hero-btn contact-hero-btn-primary">
                                Emergency Contact
                            </button>
                            <button 
                                className="contact-hero-btn contact-hero-btn-secondary"
                                onClick={handleChatToggle}
                            >
                                <FaHeadset className="mr-2" /> Live Chat
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Information */}
            <section className="contact-section contact-bg-white relative z-10">
                <div className="contact-container">
                    <div className="contact-header" data-aos="fade-up">
                        <div className="contact-section-badge">CONTACT US</div>
                        <h2 className="contact-section-title">We're Here to Help</h2>
                        <p className="contact-section-subtitle">
                            Reach out to us through any of these channels. Our team is ready to assist you.
                        </p>
                    </div>

                    <div className="contact-info-grid">
                        {contactInfo.map((item, index) => (
                            <div
                                key={index}
                                className="contact-info-card group"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className={`contact-info-icon ${item.color} group-hover:scale-110`}>
                                    {item.icon}
                                </div>
                                <h3 className="contact-info-title">{item.title}</h3>
                                <p className="contact-info-detail">{item.details}</p>
                                <p className="contact-info-description">{item.description}</p>
                                <div className="contact-info-hover-effect"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support Options */}
            <section className="contact-section contact-bg-gradient relative z-10">
                <div className="contact-container">
                    <div className="contact-header" data-aos="fade-up">
                        <div className="contact-section-badge">SUPPORT</div>
                        <h2 className="contact-section-title text-white">Direct Support Channels</h2>
                        <p className="contact-section-subtitle text-blue-100">
                            Get specialized assistance based on your needs
                        </p>
                    </div>

                    <div className="support-grid">
                        {supportOptions.map((option, index) => (
                            <div
                                key={index}
                                className="support-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="support-icon">
                                    {option.icon}
                                </div>
                                <h3 className="support-title">{option.title}</h3>
                                <p className="support-description">{option.description}</p>
                                <div className="support-contact">
                                    <span className="support-contact-label">Email:</span>
                                    <a href={`mailto:${option.contact}`} className="support-contact-link">
                                        {option.contact}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="contact-section contact-bg-white relative z-10">
                <div className="contact-container">
                    <div className="contact-content-wrapper">
                        {/* Contact Form */}
                        <div className="contact-form-container" data-aos="fade-right">
                            <div className="contact-form-header">
                                <h2 className="contact-form-title">Send us a Message</h2>
                                <p className="contact-form-subtitle">We'll respond within 24 hours</p>
                            </div>
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        placeholder="Enter your email address"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject" className="form-label">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                        placeholder="What is this regarding?"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message" className="form-label">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="form-textarea"
                                        rows="5"
                                        required
                                        placeholder="Please describe your inquiry in detail..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="contact-submit-btn">
                                    <FaPaperPlane className="mr-2" /> Send Message
                                </button>
                                {isSubmitted && (
                                    <div className="form-success-message">
                                        <div className="success-icon">✓</div>
                                        <div>
                                            <h4>Thank you for your message!</h4>
                                            <p>We'll get back to you within 24 hours.</p>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Map */}
                        <div className="contact-map-container" data-aos="fade-left">
                            <div className="contact-map-header">
                                <h2 className="contact-map-title">Our Location</h2>
                                <p className="contact-map-subtitle">Visit our headquarters</p>
                            </div>
                            <div className="map-wrapper">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58144.941032139345!2d88.5894992!3d24.3743792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbefa96a38d031%3A0x10be9285e69f37d!2sRajshahi!5e0!3m2!1sen!2sbd!4v1652345678901!5m2!1sen!2sbd"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="MediSheba Location"
                                ></iframe>
                            </div>
                            <div className="map-details">
                                <h3 className="map-details-title">MediSheba Headquarters</h3>
                                <p className="map-details-address">123 Medical Street, Rajshahi, Bangladesh</p>
                                <div className="map-details-hours">
                                    <span className="font-semibold">Open:</span> Saturday - Thursday, 9:00 AM - 6:00 PM
                                </div>
                            </div>
                            <div className="social-links-section">
                                <h3 className="social-links-title">Follow Us On Social Media</h3>
                                <p className="social-links-subtitle">Stay updated with our latest news and updates</p>
                                <div className="social-icons">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            className={`social-icon ${social.color}`}
                                            aria-label={social.name}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="contact-section contact-bg-gray-50 relative z-10">
                <div className="contact-container">
                    <div className="contact-header" data-aos="fade-up">
                        <div className="contact-section-badge">FAQs</div>
                        <h2 className="contact-section-title">Frequently Asked Questions</h2>
                        <p className="contact-section-subtitle">
                            Quick answers to common questions about our services
                        </p>
                    </div>

                    <div className="faq-container" data-aos="fade-up">
                        {faqItems.map((faq, index) => (
                            <div 
                                key={index} 
                                className={`faq-item ${activeFAQ === index ? 'active' : ''}`}
                                onClick={() => toggleFAQ(index)}
                            >
                                <button className="faq-question">
                                    {faq.question}
                                    <span className="faq-icon">
                                        <FaArrowRight />
                                    </span>
                                </button>
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="contact-cta-section">
                <div className="contact-container">
                    <div className="contact-cta-content" data-aos="fade-up">
                        <h2 className="contact-cta-title">Still Have Questions?</h2>
                        <p className="contact-cta-description">
                            Can't find the answer you're looking for? Please chat with our friendly team.
                        </p>
                        <div className="contact-cta-buttons">
                            <button 
                                className="contact-cta-btn contact-cta-primary"
                                onClick={handleChatToggle}
                            >
                                <FaHeadset className="mr-2" /> Start Live Chat
                            </button>
                            <button className="contact-cta-btn contact-cta-secondary">
                                View Full FAQ Page
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ContactPage;