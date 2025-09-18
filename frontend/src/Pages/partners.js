import React, { useEffect, useState } from 'react';
import { 
  FaHandshake, 
  FaHospital, 
  FaClinicMedical, 
  FaFlask, 
  FaAmbulance,
  FaAward,
  FaChartLine,
  FaUsers,
  FaGlobeAmericas,
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaEnvelope,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaInstagram
} from 'react-icons/fa';
import '../Styles/partners.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import logo from '../Assets/logo.png';

const PartnersPage = () => {
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [applicationSuccess, setApplicationSuccess] = useState(false);
    const [applicationError, setApplicationError] = useState('');
    const [formData, setFormData] = useState({
        organizationName: '',
        organizationType: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        servicesOffered: '',
        yearsInOperation: '',
        numberOfStaff: '',
        website: '',
        message: ''
    });
    const [files, setFiles] = useState({
        businessLicense: null,
        taxCertificate: null,
        additionalDocuments: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out-quad',
            once: true
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e, fileType) => {
        if (fileType === 'additionalDocuments') {
            setFiles(prev => ({
                ...prev,
                additionalDocuments: [...e.target.files]
            }));
        } else {
            setFiles(prev => ({
                ...prev,
                [fileType]: e.target.files[0]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setApplicationError('');

        try {
            const submitData = new FormData();
            
            // Append form data
            Object.keys(formData).forEach(key => {
                if (formData[key] !== '') {
                    submitData.append(key, formData[key]);
                }
            });
            
            // Append files
            if (files.businessLicense) {
                submitData.append('businessLicense', files.businessLicense);
            }
            if (files.taxCertificate) {
                submitData.append('taxCertificate', files.taxCertificate);
            }
            files.additionalDocuments.forEach(file => {
                submitData.append('additionalDocuments', file);
            });

            const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
            
            const response = await fetch(`${API_BASE_URL}/api/partners/apply`, {
                method: 'POST',
                body: submitData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', response.status, errorText);
                
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || `Server error: ${response.status}`);
                } catch (parseError) {
                    throw new Error(`Server returned ${response.status}: ${errorText.substring(0, 100)}...`);
                }
            }

            const result = await response.json();

            if (result.success) {
                setApplicationSuccess(true);
                setShowApplicationModal(false);
                // Reset form
                setFormData({
                    organizationName: '',
                    organizationType: '',
                    contactPerson: '',
                    email: '',
                    phone: '',
                    address: '',
                    city: '',
                    servicesOffered: '',
                    yearsInOperation: '',
                    numberOfStaff: '',
                    website: '',
                    message: ''
                });
                setFiles({
                    businessLicense: null,
                    taxCertificate: null,
                    additionalDocuments: []
                });
                setCurrentStep(1);
            } else {
                setApplicationError(result.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setApplicationError(error.message || 'Network error. Please try again. Make sure the backend server is running on port 5001.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

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

            {/* Application Success Modal */}
            {applicationSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="text-center">
                            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted</h3>
                            <p className="text-gray-600 mb-4">
                                Thank you for your interest in partnering with us. We've received your application and will review it shortly.
                            </p>
                            <button 
                                onClick={() => setApplicationSuccess(false)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Application Modal */}
            {showApplicationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Partnership Application</h2>
                                <p className="text-gray-600 mt-1">Join our network of healthcare providers</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setShowApplicationModal(false);
                                    setCurrentStep(1);
                                }}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <FaTimesCircle size={24} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-blue-600">Step {currentStep} of 3</span>
                                <span className="text-sm font-medium text-gray-500">{Math.round((currentStep/3)*100)}% Complete</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                    style={{ width: `${(currentStep/3)*100}%` }}
                                ></div>
                            </div>
                        </div>

                        {applicationError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                <strong>Error:</strong> {applicationError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Step 1: Basic Information */}
                            {currentStep === 1 && (
                                <div data-aos="fade-right">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Organization Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Organization Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="organizationName"
                                                value={formData.organizationName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Enter organization name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Organization Type *
                                            </label>
                                            <select
                                                name="organizationType"
                                                value={formData.organizationType}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="hospital">Hospital</option>
                                                <option value="clinic">Clinic</option>
                                                <option value="diagnostic_center">Diagnostic Center</option>
                                                <option value="pharmacy">Pharmacy</option>
                                                <option value="ambulance_service">Ambulance Service</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Contact Person *
                                            </label>
                                            <input
                                                type="text"
                                                name="contactPerson"
                                                value={formData.contactPerson}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Full name of contact person"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="organization@example.com"
                                            />
                                        </div>
                                    
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="+880 XXXX XXXXXX"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Enter city"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Address *
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="Full organization address"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Organization Details */}
                            {currentStep === 2 && (
                                <div data-aos="fade-right">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Organization Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Years in Operation
                                            </label>
                                            <input
                                                type="number"
                                                name="yearsInOperation"
                                                value={formData.yearsInOperation}
                                                onChange={handleInputChange}
                                                min="0"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Number of years"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Number of Staff
                                            </label>
                                            <input
                                                type="number"
                                                name="numberOfStaff"
                                                value={formData.numberOfStaff}
                                                onChange={handleInputChange}
                                                min="1"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Total staff members"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Services Offered (comma separated)
                                        </label>
                                        <textarea
                                            name="servicesOffered"
                                            value={formData.servicesOffered}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Cardiology, Radiology, Laboratory Tests, Emergency Care"
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Documents & Final Details */}
                            {currentStep === 3 && (
                                <div data-aos="fade-right">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Documents & Additional Information</h3>
                                    
                                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                        <h4 className="font-medium text-blue-800 mb-2">Required Documents</h4>
                                        <p className="text-sm text-blue-600">Please have the following documents ready for upload. All documents should be clear and legible.</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Business License (PDF, JPG, PNG) *
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <label className="flex-1 cursor-pointer">
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handleFileChange(e, 'businessLicense')}
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        required
                                                        className="hidden"
                                                    />
                                                    <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-between hover:border-blue-500 transition-colors">
                                                        <span className="text-gray-500">
                                                            {files.businessLicense ? files.businessLicense.name : 'Choose file'}
                                                        </span>
                                                        <FaUpload className="text-gray-400" />
                                                    </div>
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Upload a scanned copy of your business license</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tax Certificate (PDF, JPG, PNG) *
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <label className="flex-1 cursor-pointer">
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handleFileChange(e, 'taxCertificate')}
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        required
                                                        className="hidden"
                                                    />
                                                    <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-between hover:border-blue-500 transition-colors">
                                                        <span className="text-gray-500">
                                                            {files.taxCertificate ? files.taxCertificate.name : 'Choose file'}
                                                        </span>
                                                        <FaUpload className="text-gray-400" />
                                                    </div>
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Upload a scanned copy of your tax registration certificate</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Additional Documents (Optional)
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <label className="flex-1 cursor-pointer">
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handleFileChange(e, 'additionalDocuments')}
                                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                        multiple
                                                        className="hidden"
                                                    />
                                                    <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-between hover:border-blue-500 transition-colors">
                                                        <span className="text-gray-500">
                                                            {files.additionalDocuments.length > 0 
                                                                ? `${files.additionalDocuments.length} file(s) selected` 
                                                                : 'Choose files (optional)'}
                                                        </span>
                                                        <FaUpload className="text-gray-400" />
                                                    </div>
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Any other relevant certificates or documents</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Additional Message
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                placeholder="Tell us more about your organization and why you want to partner with us"
                                                rows={4}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between pt-6 border-t border-gray-200">
                                {currentStep > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                                    >
                                        Previous
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowApplicationModal(false)}
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                
                                <div className="flex space-x-4">
                                    {currentStep < 3 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                        >
                                            Next <span className="ml-2">→</span>
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Submitting...
                                                </>
                                            ) : 'Submit Application'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                            <button 
                                className="partners-cta-btn partners-cta-primary"
                                onClick={() => setShowApplicationModal(true)}
                            >
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