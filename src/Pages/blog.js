import React, { useState } from 'react';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaTags, 
  FaArrowRight, 
  FaSearch,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaHeartbeat,
  FaStethoscope,
  FaFlask
} from 'react-icons/fa';
import '../Styles/blog.css';
import Navbar from '../components/Navbar';

const BlogPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4;
    
    const blogPosts = [
        {
            id: 1,
            title: "Advancements in Cardiac Care: What's New in 2023",
            excerpt: "Explore the latest innovations in cardiology that are improving patient outcomes and changing how we approach heart health.",
            content: "Cardiac care has seen remarkable advancements in recent years. From minimally invasive procedures to AI-assisted diagnostics, the field is evolving rapidly. New medications with fewer side effects and wearable technology that monitors heart health in real-time are giving patients more control over their cardiovascular wellness. In this article, we'll examine the most promising developments and what they mean for both medical professionals and patients.",
            author: "Dr. Sarah Johnson",
            date: "October 15, 2023",
            readTime: "5 min read",
            category: "Medical Innovations",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            tags: ["Cardiology", "Technology", "Innovation"],
            featured: true
        },
        {
            id: 2,
            title: "The Importance of Work-Life Balance in Healthcare",
            excerpt: "Healthcare professionals face unique challenges when it comes to maintaining a healthy work-life balance. Learn strategies that really work.",
            content: "The demanding nature of healthcare careers can make work-life balance seem like an impossible goal. However, research shows that balanced healthcare providers deliver better patient care and experience less burnout. This article explores practical strategies for setting boundaries, managing stress, and creating sustainable career paths in medicine. We'll also discuss how our medical center supports our staff in achieving this crucial balance.",
            author: "Michael Chen, HR Director",
            date: "October 10, 2023",
            readTime: "7 min read",
            category: "Career Development",
            image: "https://images.unsplash.com/photo-1504814532849-cff240bbc503?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            tags: ["Wellness", "Burnout Prevention", "Work Culture"],
            featured: false
        },
        {
            id: 3,
            title: "How Our Research Team Is Tackling Rare Diseases",
            excerpt: "A look inside our research division's groundbreaking work on rare genetic disorders and the hope it brings to patients.",
            content: "Our research center has been at the forefront of rare disease treatment for over a decade. Currently, we're participating in clinical trials for three novel therapies that show promise for conditions affecting fewer than 1 in 100,000 people. This deep dive explores our collaborative approach, combining clinical expertise with cutting-edge laboratory science. You'll meet the researchers behind these efforts and learn about the patients whose lives could be transformed by their work.",
            author: "Dr. Alicia Rodriguez",
            date: "October 5, 2023",
            readTime: "8 min read",
            category: "Research",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            tags: ["Research", "Clinical Trials", "Rare Diseases"],
            featured: true
        },
        {
            id: 4,
            title: "Emergency Room Innovations: Saving More Lives",
            excerpt: "How new protocols and technologies are helping our emergency department reduce wait times and improve outcomes.",
            content: "In emergency medicine, minutes matter. Our hospital has implemented several innovative approaches that have reduced average wait times by 37% and improved patient outcomes significantly. From streamlined triage processes to point-of-care testing that delivers results in minutes rather than hours, these changes are making a real difference. This article details our quality improvement initiatives and shares data demonstrating their impact on patient care.",
            author: "Dr. James Wilson",
            date: "September 28, 2023",
            readTime: "6 min read",
            category: "Medical Innovations",
            image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            tags: ["Emergency Medicine", "Technology", "Patient Care"],
            featured: false
        },
        {
            id: 5,
            title: "Building a Career in Healthcare: Pathways and Opportunities",
            excerpt: "From clinical roles to administrative positions, discover the diverse career paths available in modern healthcare.",
            content: "The healthcare industry offers an incredible diversity of career paths beyond the traditional physician and nurse roles. Today's medical centers need experts in health informatics, medical technology, administration, patient advocacy, and more. This comprehensive guide explores the various entry points, educational requirements, and advancement opportunities across different healthcare career tracks. Whether you're just starting out or considering a career change, you'll find valuable insights to help plan your professional journey.",
            author: "Career Development Team",
            date: "September 22, 2023",
            readTime: "9 min read",
            category: "Career Development",
            image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            tags: ["Career Growth", "Education", "Healthcare Jobs"],
            featured: false
        },
        {
            id: 6,
            title: "The Future of Telemedicine: Lessons From Pandemic to Practice",
            excerpt: "How virtual care has evolved from emergency measure to essential service, and what's next for telehealth.",
            content: "The rapid adoption of telemedicine during the pandemic transformed how healthcare is delivered. Now, as we move forward, virtual care has become an integrated component of our medical services. This article examines which telemedicine practices have proven most effective, which specialties benefit most from remote care, and how technology continues to evolve to better serve patients. We also discuss the regulatory changes that have made widespread telemedicine possible and what permanent changes we might expect in healthcare delivery.",
            author: "Dr. Priya Sharma",
            date: "September 15, 2023",
            readTime: "7 min read",
            category: "Medical Innovations",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            tags: ["Telemedicine", "Technology", "Patient Care"],
            featured: true
        }
    ];

    const categories = ['All Topics', 'Medical Innovations', 'Career Development', 'Research', 'Patient Stories'];
    const popularPosts = [...blogPosts].sort((a, b) => b.id - a.id).slice(0, 3);
    const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 2);
    const tags = ["Technology", "Innovation", "Research", "Career Growth", "Patient Care", "Wellness", "Telemedicine"];

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = activeCategory === 'all' || 
                             post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             post.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getCategoryIcon = (category) => {
        switch(category) {
            case 'Medical Innovations': return <FaHeartbeat className="inline mr-2" />;
            case 'Career Development': return <FaUser className="inline mr-2" />;
            case 'Research': return <FaFlask className="inline mr-2" />;
            case 'Patient Stories': return <FaStethoscope className="inline mr-2" />;
            default: return <FaHeartbeat className="inline mr-2" />;
        }
    };

    return (
        <div className="blog-page font-sans bg-gray-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="blog-decorative-circle blog-circle-1"></div>
            <div className="blog-decorative-circle blog-circle-2"></div>
            <div className="blog-decorative-circle blog-circle-3"></div>

            <Navbar />

            {/* Hero Section */}
            <section className="blog-hero-section" style={{
                background: `linear-gradient(135deg, rgba(30, 64, 175, 0.85) 0%, rgba(16, 185, 129, 0.85) 100%), 
                           url('https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover`
            }}>
                <div className="blog-container">
                    <div className="blog-hero-content">
                        <h1 className="blog-hero-title">Medical <span className="blog-gradient-text">Insights</span> Blog</h1>
                        <p className="blog-hero-subtitle">
                            Expert perspectives on healthcare innovations, career development, and medical breakthroughs
                        </p>
                        <div className="blog-hero-stats">
                            <div className="blog-hero-stat">
                                <span className="blog-stat-number">{blogPosts.length}+</span>
                                <span className="blog-stat-label">Articles</span>
                            </div>
                            <div className="blog-hero-stat">
                                <span className="blog-stat-number">{categories.length - 1}</span>
                                <span className="blog-stat-label">Categories</span>
                            </div>
                            <div className="blog-hero-stat">
                                <span className="blog-stat-number">15+</span>
                                <span className="blog-stat-label">Medical Experts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="blog-container blog-main-container">
                <div className="blog-layout">
                    {/* Main Blog Content */}
                    <div className="blog-main-content">
                        {/* Featured Posts */}
                        {activeCategory === 'all' && searchQuery === '' && (
                            <div className="blog-featured-section">
                                <h2 className="blog-section-title">Featured Articles</h2>
                                <div className="blog-featured-grid">
                                    {featuredPosts.map((post, index) => (
                                        <article key={post.id} className="blog-featured-card" data-aos="fade-up" data-aos-delay={index * 100}>
                                            <div className="blog-featured-image">
                                                <img src={post.image} alt={post.title} />
                                                <div className="blog-featured-category">{post.category}</div>
                                            </div>
                                            <div className="blog-featured-content">
                                                <h2 className="blog-featured-title">{post.title}</h2>
                                                <p className="blog-featured-excerpt">{post.excerpt}</p>
                                                <div className="blog-featured-meta">
                                                    <span className="blog-featured-author"><FaUser className="inline mr-1" />{post.author}</span>
                                                    <span className="blog-featured-date"><FaCalendarAlt className="inline mr-1" />{post.date}</span>
                                                </div>
                                                <a href="#" className="blog-featured-readmore">
                                                    Read More <FaArrowRight className="inline ml-1" />
                                                </a>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Filter Section */}
                        <div className="blog-filter-section">
                            <div className="blog-search-box">
                                <div className="blog-search-input">
                                    <FaSearch className="blog-search-icon" />
                                    <input 
                                        type="text" 
                                        placeholder="Search articles..." 
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="blog-category-filters">
                                {categories.map((category, index) => (
                                    <button
                                        key={index}
                                        className={`blog-category-btn ${activeCategory === (category === 'All Topics' ? 'all' : category) ? 'active' : ''}`}
                                        onClick={() => {
                                            setActiveCategory(category === 'All Topics' ? 'all' : category);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {getCategoryIcon(category)}
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Results Info */}
                        <div className="blog-results-info">
                            <p>Showing {currentPosts.length} of {filteredPosts.length} articles</p>
                            <div className="blog-view-options">
                                <span>Sort by:</span>
                                <select>
                                    <option>Newest First</option>
                                    <option>Oldest First</option>
                                    <option>Most Popular</option>
                                </select>
                            </div>
                        </div>

                        {/* Posts Grid */}
                        <div className="blog-posts-grid">
                            {currentPosts.map((post, index) => (
                                <article key={post.id} className="blog-post-card" data-aos="fade-up" data-aos-delay={index * 100}>
                                    <div className="blog-post-image">
                                        <img src={post.image} alt={post.title} />
                                        <div className="blog-post-category">{post.category}</div>
                                        {post.featured && <div className="blog-post-featured-badge">Featured</div>}
                                    </div>
                                    <div className="blog-post-content">
                                        <h2 className="blog-post-title">{post.title}</h2>
                                        <p className="blog-post-excerpt">{post.excerpt}</p>
                                        <div className="blog-post-meta">
                                            <span className="blog-post-author"><FaUser className="inline mr-1" />{post.author}</span>
                                            <span className="blog-post-date"><FaCalendarAlt className="inline mr-1" />{post.date}</span>
                                            <span className="blog-post-readtime">{post.readTime}</span>
                                        </div>
                                        <div className="blog-post-tags">
                                            <FaTags className="inline mr-1" />
                                            {post.tags.map((tag, i) => (
                                                <span key={i} className="blog-post-tag">#{tag}</span>
                                            ))}
                                        </div>
                                        <a href="#" className="blog-post-readmore">
                                            Read More <FaArrowRight className="inline ml-1" />
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {filteredPosts.length === 0 && (
                            <div className="blog-no-results" data-aos="fade-up">
                                <h3>No articles found</h3>
                                <p>Try adjusting your search or filter criteria</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredPosts.length > postsPerPage && (
                            <div className="blog-pagination">
                                <button 
                                    className="blog-pagination-prev" 
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <div className="blog-pagination-pages">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                        <button
                                            key={number}
                                            className={`blog-pagination-page ${currentPage === number ? 'blog-pagination-active' : ''}`}
                                            onClick={() => paginate(number)}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    className="blog-pagination-next" 
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="blog-sidebar">
                        {/* About Widget */}
                        <div className="blog-sidebar-widget">
                            <h3 className="blog-sidebar-title">About Our Blog</h3>
                            <p className="blog-sidebar-content">
                                Our medical blog shares insights, innovations, and stories from our healthcare team. 
                                Stay updated on the latest in medical research, career opportunities, and patient care advancements.
                            </p>
                            <div className="blog-sidebar-cta">
                                <a href="#" className="blog-sidebar-cta-btn">Meet Our Team</a>
                            </div>
                        </div>

                        {/* Popular Posts Widget */}
                        <div className="blog-sidebar-widget">
                            <h3 className="blog-sidebar-title">Popular Articles</h3>
                            <div className="blog-popular-posts">
                                {popularPosts.map(post => (
                                    <div key={post.id} className="blog-popular-post">
                                        <img src={post.image} alt={post.title} />
                                        <div className="blog-popular-post-content">
                                            <h4>{post.title}</h4>
                                            <span className="blog-popular-post-date">{post.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Categories Widget */}
                        <div className="blog-sidebar-widget">
                            <h3 className="blog-sidebar-title">Categories</h3>
                            <ul className="blog-sidebar-categories">
                                {categories.filter(cat => cat !== 'All Topics').map((category, index) => (
                                    <li key={index}>
                                        <a href="#" className="blog-sidebar-category">
                                            {getCategoryIcon(category)}
                                            {category} 
                                            <span className="blog-category-count">({blogPosts.filter(p => p.category === category).length})</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tags Widget */}
                        <div className="blog-sidebar-widget">
                            <h3 className="blog-sidebar-title">Tags</h3>
                            <div className="blog-sidebar-tags">
                                {tags.map((tag, index) => (
                                    <a key={index} href="#" className="blog-sidebar-tag">#{tag}</a>
                                ))}
                            </div>
                        </div>

                        {/* Subscribe Widget */}
                        <div className="blog-sidebar-widget blog-subscribe-widget">
                            <h3 className="blog-sidebar-title">Stay Updated</h3>
                            <p className="blog-sidebar-content">Subscribe to our blog to receive the latest articles and updates</p>
                            <form className="blog-subscribe-form">
                                <input type="email" placeholder="Your email address" />
                                <button type="submit">
                                    <FaEnvelope className="inline mr-1" />
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Newsletter Section */}
            <section className="blog-newsletter-section">
                <div className="blog-container">
                    <div className="blog-newsletter-content">
                        <div className="blog-newsletter-icon">
                            <FaEnvelope />
                        </div>
                        <h2 className="blog-newsletter-title">Never Miss an Update</h2>
                        <p className="blog-newsletter-description">
                            Join our newsletter and stay informed about the latest medical insights, career opportunities, 
                            and healthcare innovations.
                        </p>
                        <form className="blog-newsletter-form">
                            <input type="email" placeholder="Enter your email address" />
                            <button type="submit">Subscribe Now</button>
                        </form>
                        <p className="blog-newsletter-note">We respect your privacy. Unsubscribe at any time.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="blog-footer">
                <div className="blog-container">
                    <div className="blog-footer-content">
                        <div className="blog-footer-section">
                            <h3>Medical Insights Blog</h3>
                            <p>Providing expert perspectives on healthcare innovations, career development, and medical breakthroughs.</p>
                            <div className="blog-footer-social">
                                <a href="#" aria-label="Facebook"><FaFacebook /></a>
                                <a href="#" aria-label="Twitter"><FaTwitter /></a>
                                <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
                                <a href="#" aria-label="Instagram"><FaInstagram /></a>
                            </div>
                        </div>
                        <div className="blog-footer-section">
                            <h4>Categories</h4>
                            <ul>
                                {categories.filter(cat => cat !== 'All Topics').map((category, index) => (
                                    <li key={index}><a href="#">{category}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div className="blog-footer-section">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div className="blog-footer-section">
                            <h4>Contact Info</h4>
                            <ul className="blog-footer-contact">
                                <li>123 Medical Center Drive</li>
                                <li>Health City, HC 12345</li>
                                <li>info@medicalblog.com</li>
                                <li>(555) 123-4567</li>
                            </ul>
                        </div>
                    </div>
                    <div className="blog-footer-bottom">
                        <p>&copy; 2023 Medical Center. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default BlogPage;