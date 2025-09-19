import React, { useState, useEffect } from 'react';
import {
    FaUpload,
    FaCheckCircle,
    FaTimesCircle,
    FaHandshake
} from 'react-icons/fa';
import '../Styles/application.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

const PartnershipApplicationPage = () => {
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

    return (
        <div className="partners-page font-sans bg-gray-50 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="partners-decorative-circle partners-circle-1"></div>
            <div className="partners-decorative-circle partners-circle-2"></div>
            <div className="partners-decorative-circle partners-circle-3"></div>

            <Navbar />

            {/* Application Success Modal */}
            {applicationSuccess && (
                <div className="success-modal-overlay">
                    <div className="success-modal-content">
                        <div className="text-center">
                            <FaCheckCircle className="success-modal-icon" />
                            <h3 className="success-modal-title">Application Submitted</h3>
                            <p className="success-modal-message">
                                Thank you for your interest in partnering with us. We've received your application and will review it shortly.
                            </p>
                            <Link
                                to="/partners"
                                className="success-modal-button"
                            >
                                Back to Partners
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="partners-hero-section" style={{
                background: `linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%), 
                           url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') center/cover`,
                backgroundAttachment: 'fixed',
                minHeight: '300px'
            }}>
                <div className="partners-container">
                    <div className="partners-hero-content">
                        <h1 className="partners-hero-title">Partnership <span className="partners-gradient-text">Application</span></h1>
                        <p className="partners-hero-subtitle">
                            Join our network of healthcare providers and expand your reach
                        </p>
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section className="partners-section partners-bg-white py-12">
                <div className="partners-container">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
                        <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                            <div className="mr-4 text-blue-600">
                                <FaHandshake size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Partnership Application</h2>
                                <p className="text-gray-600 mt-1">Join our network of healthcare providers</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-blue-600">Step {currentStep} of 3</span>
                                <span className="text-sm font-medium text-gray-500">{Math.round((currentStep / 3) * 100)}% Complete</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${(currentStep / 3) * 100}%` }}
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
                                    <Link
                                        to="/partners"
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors inline-block"
                                    >
                                        Back to Partners
                                    </Link>
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
            </section>

           
        </div>
    );
};

export default PartnershipApplicationPage;
