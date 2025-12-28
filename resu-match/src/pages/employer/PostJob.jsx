import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';
import {
    FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiUsers,
    FiFileText, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';

const PostJob = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { toasts, success, error: showError, removeToast } = useToast();
    const [step, setStep] = useState(1); // 1: Basic Info, 2: Details, 3: Review
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        company: user?.current_company || '',
        location: '',
        type: 'Full-time',
        experience: 'Mid-level',
        remote: false,
        industry: '',
        salaryMin: '',
        salaryMax: '',
        salaryCurrency: 'PKR',
        description: '',
        requirements: [''],
        applicationSteps: ['Submit your resume', 'Phone screening', 'Technical interview', 'Final interview'],
        skills: [''],
        benefits: ['']
    });

    const [errors, setErrors] = useState({});

    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'];
    const industries = [
        'Technology & IT', 'Business & Finance', 'Marketing & Sales', 'Healthcare & Medical',
        'Education & Training', 'Design & Creative', 'Engineering', 'Human Resources',
        'Operations & Logistics', 'Retail & Ecommerce', 'Legal', 'Construction', 'Hospitality'
    ];

    const pakistaniCities = [
        'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
        'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Remote'
    ];

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeArrayItem = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.company.trim()) newErrors.company = 'Company name is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.description.trim()) newErrors.description = 'Job description is required';
        if (formData.requirements.filter(r => r.trim()).length === 0) {
            newErrors.requirements = 'At least one requirement is needed';
        }
        if (formData.skills.filter(s => s.trim()).length === 0) {
            newErrors.skills = 'At least one skill is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (step === 2 && validateStep2()) {
            setStep(3);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        setStep(step - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            showError('Please login to post a job');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            // Clean up arrays
            const cleanedData = {
                ...formData,
                requirements: formData.requirements.filter(r => r.trim()),
                applicationSteps: formData.applicationSteps.filter(s => s.trim()),
                skills: formData.skills.filter(s => s.trim()),
                benefits: formData.benefits.filter(b => b.trim()),
                salary_min: parseInt(formData.salaryMin) || null,
                salary_max: parseInt(formData.salaryMax) || null,
                salary_currency: formData.salaryCurrency
            };

            await api.post('/jobs', cleanedData);
            success('Job posted successfully!');
            setTimeout(() => navigate('/employer/dashboard'), 1500);
        } catch (err) {
            console.error('Error posting job:', err);
            showError(err.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
            <Toast toasts={toasts} removeToast={removeToast} />
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Post a Job</h1>
                    <p className="text-gray-600">Find the perfect candidate for your team</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                                {num}
                            </div>
                            {num < 3 && (
                                <div className={`w-16 h-1 mx-2 ${step > num ? 'bg-blue-600' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FiBriefcase className="text-blue-600" />
                                Basic Information
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Job Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="e.g. Senior React Developer"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                            errors.title ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                        placeholder="Your company name"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                            errors.company ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Location *
                                        </label>
                                        <select
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.location ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select location</option>
                                            {pakistaniCities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Job Type *
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => handleInputChange('type', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            {jobTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Experience Level *
                                        </label>
                                        <select
                                            value={formData.experience}
                                            onChange={(e) => handleInputChange('experience', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            {experienceLevels.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Industry *
                                        </label>
                                        <select
                                            value={formData.industry}
                                            onChange={(e) => handleInputChange('industry', e.target.value)}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                                errors.industry ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select industry</option>
                                            {industries.map(ind => (
                                                <option key={ind} value={ind}>{ind}</option>
                                            ))}
                                        </select>
                                        {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.remote}
                                            onChange={(e) => handleInputChange('remote', e.target.checked)}
                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-semibold text-gray-700">Remote work available</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <FiDollarSign className="inline mr-1" />
                                        Salary Range (Optional)
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <input
                                            type="number"
                                            value={formData.salaryMin}
                                            onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                                            placeholder="Min"
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="number"
                                            value={formData.salaryMax}
                                            onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                                            placeholder="Max"
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                        <select
                                            value={formData.salaryCurrency}
                                            onChange={(e) => handleInputChange('salaryCurrency', e.target.value)}
                                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="PKR">PKR</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Next Step
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Job Details */}
                    {step === 2 && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FiFileText className="text-blue-600" />
                                Job Details
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Job Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Describe the role, responsibilities, and what makes your company great..."
                                        rows="6"
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                            errors.description ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Requirements *
                                    </label>
                                    {formData.requirements.map((req, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={req}
                                                onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                                placeholder="e.g. 3+ years of React experience"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                            {formData.requirements.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('requirements', index)}
                                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('requirements')}
                                        className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                    >
                                        + Add Requirement
                                    </button>
                                    {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Required Skills *
                                    </label>
                                    {formData.skills.map((skill, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={skill}
                                                onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                                                placeholder="e.g. React, Node.js, TypeScript"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                            {formData.skills.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('skills', index)}
                                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('skills')}
                                        className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                    >
                                        + Add Skill
                                    </button>
                                    {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Benefits (Optional)
                                    </label>
                                    {formData.benefits.map((benefit, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={benefit}
                                                onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                                                placeholder="e.g. Health insurance, Remote work, Flexible hours"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem('benefits', index)}
                                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('benefits')}
                                        className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                    >
                                        + Add Benefit
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Review
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review & Submit */}
                    {step === 3 && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FiCheckCircle className="text-blue-600" />
                                Review Your Job Posting
                            </h2>

                            <div className="space-y-6">
                                <div className="border-b border-gray-200 pb-4">
                                    <h3 className="font-bold text-gray-900 mb-2">{formData.title}</h3>
                                    <p className="text-gray-600">{formData.company} • {formData.location}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">{formData.type}</span>
                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded-full">{formData.experience}</span>
                                        {formData.remote && (
                                            <span className="px-3 py-1 bg-purple-50 text-purple-600 text-sm rounded-full">Remote</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                    <p className="text-gray-600 whitespace-pre-line">{formData.description}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                        {formData.requirements.filter(r => r.trim()).map((req, idx) => (
                                            <li key={idx}>{req}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.filter(s => s.trim()).map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {formData.benefits.filter(b => b.trim()).length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                                            {formData.benefits.filter(b => b.trim()).map((benefit, idx) => (
                                                <li key={idx}>{benefit}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Posting...
                                        </>
                                    ) : (
                                        <>
                                            <FiCheckCircle />
                                            Post Job
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PostJob;
