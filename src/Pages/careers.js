import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaGraduationCap, 
  FaHandshake, 
  FaHeart, 
  FaChartLine,
  FaSearch,
  FaMapMarkerAlt,
  FaFilter,
  FaClock,
  FaArrowRight,
  FaPlus,
  FaCheck
} from 'react-icons/fa';
import '../Styles/careers.css';
import Navbar from '../components/Navbar';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CareersPage = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedJob, setExpandedJob] = useState(null);
    
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false
        });
    }, []);
    
    const jobListings = [
        {
            id: 1,
            title: "Senior Cardiologist",
            department: "Cardiology",
            type: "Full-time",
            location: "Main Hospital",
            experience: "5+ years",
            postedDate: "2 days ago",
            description: "We're seeking an experienced cardiologist to join our renowned heart care team. You'll work with state-of-the-art equipment and a supportive staff.",
            requirements: ["Board Certified in Cardiology", "5+ years experience", "Strong diagnostic skills", "Excellent patient communication"],
            benefits: ["Signing bonus", "Research opportunities", "Flexible schedule"]
        },
        {
            id: 2,
            title: "Registered Nurse",
            department: "Emergency",
            type: "Full-time",
            location: "Downtown Clinic",
            experience: "2+ years",
            postedDate: "1 week ago",
            description: "Join our emergency department team providing critical care to patients in need. Fast-paced environment with opportunities for growth.",
            requirements: ["BSN degree", "Active RN license", "ACLS certification", "2+ years ER experience"],
            benefits: ["Shift differentials", "Tuition reimbursement", "Overtime available"]
        },
        {
            id: 3,
            title: "Medical Researcher",
            department: "Research",
            type: "Full-time",
            location: "Research Center",
            experience: "3+ years",
            postedDate: "3 days ago",
            description: "Work on cutting-edge medical research projects with our team of dedicated scientists and physicians.",
            requirements: ["PhD in related field", "Published research", "Statistical analysis skills", "Lab experience"],
            benefits: ["Publication support", "Conference travel", "Flexible hours"]
        },
        {
            id: 4,
            title: "Physical Therapist",
            department: "Rehabilitation",
            type: "Part-time",
            location: "Rehabilitation Center",
            experience: "2+ years",
            postedDate: "5 days ago",
            description: "Help patients recover mobility and improve their quality of life through targeted therapy programs.",
            requirements: ["DPT degree", "State licensure", "Manual therapy skills", "Patient evaluation experience"],
            benefits: ["Flexible scheduling", "CEU allowance", "Career advancement"]
        },
        {
            id: 5,
            title: "Medical Billing Specialist",
            department: "Administration",
            type: "Full-time",
            location: "Main Hospital",
            experience: "3+ years",
            postedDate: "1 day ago",
            description: "Join our finance team handling medical billing, insurance claims, and patient accounts.",
            requirements: ["Associate's degree", "Medical billing certification", "3+ years experience", "Knowledge of ICD-10 codes"],
            benefits: ["Remote work options", "Performance bonuses", "Comprehensive benefits"]
        },
        {
            id: 6,
            title: "Pediatric Surgeon",
            department: "Surgery",
            type: "Full-time",
            location: "Children's Wing",
            experience: "7+ years",
            postedDate: "1 week ago",
            description: "Specialized surgeon needed for our growing pediatric surgery department. Work with cutting-edge technology.",
            requirements: ["Board Certified Surgeon", "Fellowship in Pediatric Surgery", "7+ years experience", "Excellent surgical skills"],
            benefits: ["Research opportunities", "Teaching positions available", "Generous vacation time"]
        }
    ];

    const departments = [
        'All Departments',
        'Cardiology',
        'Emergency',
        'Research',
        'Rehabilitation',
        'Administration',
        'Surgery',
        'Nursing'
    ];

    const jobTypes = ['All Types', 'Full-time', 'Part-time', 'Contract'];

    const benefits = [
        {
            icon: <FaGraduationCap />,
            title: "Continuing Education",
            description: "Tuition reimbursement and ongoing training opportunities"
        },
        {
            icon: <FaHandshake />,
            title: "Retirement Planning",
            description: "401(k) with company matching and financial counseling"
        },
        {
            icon: <FaHeart />,
            title: "Health & Wellness",
            description: "Comprehensive medical, dental, and vision insurance"
        },
        {
            icon: <FaChartLine />,
            title: "Career Growth",
            description: "Clear pathways for advancement and leadership development"
        },
        {
            icon: <FaUsers />,
            title: "Collaborative Culture",
            description: "Work with talented professionals in a supportive environment"
        },
        {
            icon: <FaClock />,
            title: "Work-Life Balance",
            description: "Flexible scheduling and generous paid time off"
        }
    ];

    const filteredJobs = jobListings.filter(job => {
        const matchesFilter = activeFilter === 'all' || 
                             job.department.toLowerCase().includes(activeFilter.toLowerCase());
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             job.department.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const toggleJobDetails = (jobId) => {
        if (expandedJob === jobId) {
            setExpandedJob(null);
        } else {
            setExpandedJob(jobId);
        }
    };

    return (
        <div className="careers-page font-sans bg-gray-50 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="careers-animated-bg">
                <div className="careers-bubble careers-bubble-1"></div>
                <div className="careers-bubble careers-bubble-2"></div>
                <div className="careers-bubble careers-bubble-3"></div>
                <div className="careers-bubble careers-bubble-4"></div>
            </div>

            {/* Decorative Elements */}
            <div className="careers-decorative-circle careers-circle-1"></div>
            <div className="careers-decorative-circle careers-circle-2"></div>
            <div className="careers-decorative-circle careers-circle-3"></div>

            <Navbar />

            {/* Hero Section */}
            <section className="careers-hero-section" style={{
                background: `linear-gradient(135deg, rgba(26, 36, 79, 0.85) 0%, rgba(39, 60, 117, 0.9) 100%), 
                           url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover`
            }}>
                <div className="careers-container">
                    <div className="careers-hero-content">
                        <h1 className="careers-hero-title" data-aos="fade-down" data-aos-delay="100">
                            Join Our <span className="careers-gradient-text">Medical Team</span>
                        </h1>
                        <p className="careers-hero-subtitle" data-aos="fade-up" data-aos-delay="300">
                            Build a rewarding career while making a difference in patients' lives
                        </p>
                        <div className="careers-hero-cta" data-aos="fade-up" data-aos-delay="500">
                            <button className="careers-primary-btn">View Open Positions</button>
                            <button className="careers-secondary-btn">Learn About Our Culture</button>
                        </div>
                    </div>
                </div>
                <div className="careers-scroll-indicator" data-aos="fade-up" data-aos-delay="700">
                    <span>Scroll to explore</span>
                    <div className="careers-scroll-line">
                        <FaArrowRight />
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="careers-benefits-section">
                <div className="careers-container">
                    <h2 className="careers-section-title" data-aos="fade-up">
                        Why Work With Us
                    </h2>
                    <p className="careers-section-subtitle" data-aos="fade-up" data-aos-delay="100">
                        We invest in our team's growth and well-being
                    </p>
                    
                    <div className="careers-benefits-grid">
                        {benefits.map((benefit, index) => (
                            <div 
                                key={index}
                                className="careers-benefit-card"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="careers-benefit-icon">
                                    {benefit.icon}
                                </div>
                                <h3 className="careers-benefit-title">{benefit.title}</h3>
                                <p className="careers-benefit-description">{benefit.description}</p>
                                <div className="careers-benefit-hover-effect"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Job Search Section */}
            <section className="careers-filter-section">
                <div className="careers-container">
                    <div className="careers-filter-content" data-aos="fade-up">
                        <h2 className="careers-filter-title">Find Your Position</h2>
                        <p className="careers-filter-subtitle">Discover opportunities that match your skills and passion</p>
                        
                        <div className="careers-search-box" data-aos="fade-up" data-aos-delay="200">
                            <div className="careers-search-input">
                                <FaSearch className="careers-search-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Search by job title or department..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="careers-department-filters" data-aos="fade-up" data-aos-delay="300">
                            <div className="careers-filter-label">
                                <FaFilter className="careers-filter-label-icon" /> Filter by Department:
                            </div>
                            <div className="careers-department-buttons">
                                {departments.map((department, index) => (
                                    <button
                                        key={index}
                                        className={`careers-department-btn ${activeFilter === (department === 'All Departments' ? 'all' : department.toLowerCase()) ? 'active' : ''}`}
                                        onClick={() => setActiveFilter(department === 'All Departments' ? 'all' : department.toLowerCase())}
                                        data-aos="fade-up"
                                        data-aos-delay={index * 50}
                                    >
                                        {department}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Jobs Listing Section */}
            <section className="careers-listing-section">
                <div className="careers-container">
                    <h2 className="careers-listing-title" data-aos="fade-up">
                        Open Positions <span className="careers-count">({filteredJobs.length} jobs)</span>
                    </h2>

                    <div className="careers-list">
                        {filteredJobs.map((job, index) => (
                            <div
                                key={job.id}
                                className={`careers-job-card ${expandedJob === job.id ? 'expanded' : ''}`}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="careers-job-main">
                                    <div className="careers-job-header">
                                        <h3 className="careers-job-title">{job.title}</h3>
                                        <button 
                                            className="careers-job-toggle"
                                            onClick={() => toggleJobDetails(job.id)}
                                        >
                                            <FaPlus className={`careers-toggle-icon ${expandedJob === job.id ? 'expanded' : ''}`} />
                                        </button>
                                    </div>
                                    <div className="careers-job-meta">
                                        <span className="careers-job-department">{job.department}</span>
                                        <span className="careers-job-type">{job.type}</span>
                                        <span className="careers-job-location">
                                            <FaMapMarkerAlt className="careers-meta-icon" />
                                            {job.location}
                                        </span>
                                        <span className="careers-job-experience">{job.experience} experience</span>
                                        <span className="careers-job-posted">{job.postedDate}</span>
                                    </div>
                                    <p className="careers-job-description">{job.description}</p>
                                    
                                    {expandedJob === job.id && (
                                        <div className="careers-job-details">
                                            <div className="careers-details-section">
                                                <h4>Requirements</h4>
                                                <ul>
                                                    {job.requirements.map((req, i) => (
                                                        <li key={i}>
                                                            <FaCheck className="careers-check-icon" />
                                                            {req}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="careers-details-section">
                                                <h4>Benefits & Perks</h4>
                                                <ul>
                                                    {job.benefits.map((benefit, i) => (
                                                        <li key={i}>
                                                            <FaCheck className="careers-check-icon" />
                                                            {benefit}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="careers-job-actions">
                                    <button className="careers-apply-btn">
                                        Apply Now
                                    </button>
                                    <button 
                                        className="careers-details-btn"
                                        onClick={() => toggleJobDetails(job.id)}
                                    >
                                        {expandedJob === job.id ? 'Less Details' : 'View Details'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <div className="careers-no-results" data-aos="fade-up">
                            <h3>No positions found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Culture Section */}
            <section className="careers-culture-section">
                <div className="careers-container">
                    <div className="careers-culture-content">
                        <div className="careers-culture-text" data-aos="fade-right">
                            <h2 className="careers-culture-title">Our Culture</h2>
                            <p className="careers-culture-description">
                                At our medical center, we foster an environment of collaboration, innovation, and compassion. 
                                We believe that the best patient care comes from a team that feels supported, valued, and empowered 
                                to grow both personally and professionally.
                            </p>
                            <p className="careers-culture-description">
                                Our staff represents diverse backgrounds and specialties, united by a common mission to provide 
                                exceptional healthcare to our community. We prioritize work-life balance and create opportunities 
                                for our team members to thrive in all aspects of their lives.
                            </p>
                            <button className="careers-culture-btn">
                                Learn More About Our Values
                            </button>
                        </div>
                        <div className="careers-culture-image" data-aos="fade-left">
                            <img 
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Medical team collaboration" 
                            />
                            <div className="careers-image-overlay"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="careers-cta-section">
                <div className="careers-container">
                    <div className="careers-cta-content" data-aos="zoom-in">
                        <h2 className="careers-cta-title">Ready to Make a Difference?</h2>
                        <p className="careers-cta-description">
                            Join our team of dedicated healthcare professionals and contribute to our mission of providing exceptional care
                        </p>
                        <div className="careers-cta-buttons">
                            <button className="careers-cta-btn careers-cta-primary">
                                Explore All Positions
                            </button>
                            <button className="careers-cta-btn careers-cta-secondary">
                                Submit Your Resume
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;