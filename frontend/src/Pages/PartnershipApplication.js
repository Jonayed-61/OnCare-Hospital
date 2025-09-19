import React, { useState } from 'react';
import { 
  FaUpload, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaArrowLeft,
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaFileAlt,
  FaClock,
  FaUsers,
  FaHandshake
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../Styles/partners.css';

const PartnershipApplication = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setApplicationError('');

        try {
            const submitData = new FormData();
            
            Object.keys(formData).forEach(key => {
                if (formData[key] !== '') {
                    submitData.append(key, formData[key]);
                }
            });
            
            if (files.businessLicense) submitData.append('businessLicense', files.businessLicense);
            if (files.taxCertificate) submitData.append('taxCertificate', files.taxCertificate);
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
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setApplicationSuccess(true);
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
            } else {
                setApplicationError(result.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setApplicationError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const organizationTypes = [
        'Hospital',
        'Clinic',
        'Diagnostic Center',
        'Pharmacy',
        'Ambulance Service',
        'Medical Equipment Supplier',
        'Healthcare IT Company',
        'Other'
    ];

    if (applicationSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
                <Navbar />
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
                        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Application Submitted!</h1>
                        <p className="text-gray-600 mb-6">
                            Thank you for your interest in partnering with us. We've received your application 
                            and our team will review it within 2-3 business days.
                        </p>
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500">You'll receive a confirmation email shortly.</p>
                            <p className="text-sm text-gray-500">For urgent inquiries, please contact partners@medisheba.com</p>
                        </div>
                        <div className="mt-8 space-x-4">
                            <Link
                                to="/partners"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Back to Partners
                            </Link>
                            <Link
                                to="/"
                                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {/* Decorative Elements */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>

            <Navbar />

            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link 
                        to="/partners"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Partners
                    </Link>
                    
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <FaHandshake className="text-white text-xl" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Partnership Application
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Join our network of healthcare providers and expand your reach while delivering 
                        quality care to more patients across Bangladesh.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-blue-600">Step {currentStep} of 3</span>
                        <span className="text-sm font-medium text-gray-500">{Math.round((currentStep/3)*100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500" 
                            style={{ width: `${(currentStep/3)*100}%` }}
                        ></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className={`text-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                            }`}>
                                1
                            </div>
                            <span className="text-sm font-medium">Organization</span>
                        </div>
                        <div className={`text-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                            }`}>
                                2
                            </div>
                            <span className="text-sm font-medium">Details</span>
                        </div>
                        <div className={`text-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                            }`}>
                                3
                            </div>
                            <span className="text-sm font-medium">Documents</span>
                        </div>
                    </div>
                </div>

                {/* Application Form */}
                <div className="max-w-4xl mx-auto">
                    {applicationError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8">
                            <strong>Error:</strong> {applicationError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Step 1: Organization Information */}
                        {currentStep === 1 && (
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                        <FaBuilding className="text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Organization Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                                            {organizationTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Contact Person *
                                        </label>
                                        <div className="relative">
                                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="contactPerson"
                                                value={formData.contactPerson}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Full name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="email@organization.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="+880 XXXX XXXXXX"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Enter city"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
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
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                        <FaUsers className="text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Organization Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Years in Operation
                                        </label>
                                        <div className="relative">
                                            <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="number"
                                                name="yearsInOperation"
                                                value={formData.yearsInOperation}
                                                onChange={handleInputChange}
                                                min="0"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Number of years"
                                            />
                                        </div>
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

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Services Offered
                                    </label>
                                    <textarea
                                        name="servicesOffered"
                                        value={formData.servicesOffered}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Cardiology, Radiology, Laboratory Tests, Emergency Care, Surgery, Pharmacy"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Website
                                    </label>
                                    <div className="relative">
                                        <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Documents */}
                        {currentStep === 3 && (
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                        <FaFileAlt className="text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Required Documents</h2>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                                    <h3 className="font-semibold text-blue-800 mb-2">📋 Document Requirements</h3>
                                    <p className="text-blue-600 text-sm">
                                        Please upload clear, legible copies of the following documents. 
                                        All documents should be in PDF, JPG, or PNG format.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Business License *
                                        </label>
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">
                                                    {files.businessLicense ? files.businessLicense.name : 'Click to upload Business License'}
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, 'businessLicense')}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                required
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tax Certificate *
                                        </label>
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">
                                                    {files.taxCertificate ? files.taxCertificate.name : 'Click to upload Tax Certificate'}
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, 'taxCertificate')}
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                required
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Additional Documents (Optional)
                                        </label>
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">
                                                    {files.additionalDocuments.length > 0 
                                                        ? `${files.additionalDocuments.length} file(s) selected` 
                                                        : 'Click to upload additional documents'}
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, 'additionalDocuments')}
                                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                multiple
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Additional Message
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Tell us more about your organization, your mission, and why you want to partner with us..."
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                            <div className="flex justify-between">
                                {currentStep > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <FaArrowLeft className="mr-2" />
                                        Previous
                                    </button>
                                ) : (
                                    <Link
                                        to="/partners"
                                        className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <FaTimesCircle className="mr-2" />
                                        Cancel
                                    </Link>
                                )}

                                {currentStep < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                    >
                                        Next Step
                                        <FaArrowLeft className="ml-2 transform rotate-180" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                Submit Application
                                                <FaCheckCircle className="ml-2" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PartnershipApplication;