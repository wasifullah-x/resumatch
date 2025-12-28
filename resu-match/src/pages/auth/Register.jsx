import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Basic Information
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        profilePicture: null,
        password: '',
        confirmPassword: '',

        // Step 2: Professional Background
        jobTitle: '',
        yearsOfExperience: '',
        experienceLevel: '',
        currentCompany: '',
        industry: '',
        professionalSummary: '',

        // Step 3: Skills & Qualifications
        primarySkills: [],
        secondarySkills: [],
        technicalSkills: [],
        softSkills: [],
        certifications: [],
        languages: [],
        education: [],

        // Step 4: Job Preferences
        desiredJobTitles: [],
        preferredLocations: [],
        workMode: [],
        jobType: [],
        salaryMin: '',
        salaryMax: '',
        salaryCurrency: 'USD',
        companySize: [],
        preferredIndustries: [],

        // Step 5: Resume
        resume: null
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [userType, setUserType] = useState('Job Seekers');

    // Temporary inputs for array fields
    const [tempSkill, setTempSkill] = useState('');
    const [tempCertification, setTempCertification] = useState({ name: '', organization: '', date: '' });
    const [tempLanguage, setTempLanguage] = useState({ language: '', proficiency: '' });
    const [tempEducation, setTempEducation] = useState({ degree: '', institution: '', year: '' });
    const [tempJobTitle, setTempJobTitle] = useState('');
    const [tempLocation, setTempLocation] = useState('');

    const totalSteps = 5;

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleArrayToggle = (field, value) => {
        const currentArray = formData[field];
        if (currentArray.includes(value)) {
            setFormData({
                ...formData,
                [field]: currentArray.filter(item => item !== value)
            });
        } else {
            setFormData({
                ...formData,
                [field]: [...currentArray, value]
            });
        }
    };

    const addToArray = (field, value) => {
        if (value && !formData[field].includes(value)) {
            setFormData({
                ...formData,
                [field]: [...formData[field], value]
            });
            return true;
        }
        return false;
    };

    const removeFromArray = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [field]: newArray
        });
    };

    const addCertification = () => {
        if (tempCertification.name && tempCertification.organization) {
            setFormData({
                ...formData,
                certifications: [...formData.certifications, { ...tempCertification }]
            });
            setTempCertification({ name: '', organization: '', date: '' });
        }
    };

    const addLanguage = () => {
        if (tempLanguage.language && tempLanguage.proficiency) {
            setFormData({
                ...formData,
                languages: [...formData.languages, { ...tempLanguage }]
            });
            setTempLanguage({ language: '', proficiency: '' });
        }
    };

    const addEducation = () => {
        if (tempEducation.degree && tempEducation.institution) {
            setFormData({
                ...formData,
                education: [...formData.education, { ...tempEducation }]
            });
            setTempEducation({ degree: '', institution: '', year: '' });
        }
    };

    const validateStep = () => {
        setError('');

        switch (currentStep) {
            case 1:
                if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.location) {
                    setError('Please fill in all required fields');
                    return false;
                }
                if (!formData.password || !formData.confirmPassword) {
                    setError('Please enter password');
                    return false;
                }
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    return false;
                }
                if (formData.password.length < 8) {
                    setError('Password must be at least 8 characters long');
                    return false;
                }
                if (!agreedToTerms) {
                    setError('Please agree to the Terms of Services');
                    return false;
                }
                break;
            case 2:
                // Making these optional for flexibility or stick to required as per previous
                if (!formData.jobTitle || !formData.yearsOfExperience || !formData.experienceLevel) {
                    setError('Please fill in required fields');
                    return false;
                }
                break;
            case 3:
                if (formData.primarySkills.length === 0) {
                    setError('Please add at least one primary skill');
                    return false;
                }
                break;
            case 4:
                if (formData.desiredJobTitles.length === 0 || formData.workMode.length === 0) {
                    setError('Please select at least one desired job title and work mode');
                    return false;
                }
                break;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            if (currentStep < totalSteps) {
                setCurrentStep(currentStep + 1);
                window.scrollTo(0, 0);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setError('');
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = new FormData();

            // Basic Fields
            data.append('name', `${formData.firstName} ${formData.lastName}`);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('phone', formData.phone);
            data.append('location', formData.location);
            data.append('linkedin', formData.linkedin);
            data.append('portfolio', formData.portfolio);

            // Professional
            data.append('jobTitle', formData.jobTitle);
            data.append('yearsOfExperience', formData.yearsOfExperience);
            data.append('experienceLevel', formData.experienceLevel);
            data.append('currentCompany', formData.currentCompany);
            data.append('industry', formData.industry);
            data.append('professionalSummary', formData.professionalSummary);

            // Json Fields
            data.append('primarySkills', JSON.stringify(formData.primarySkills));
            data.append('secondarySkills', JSON.stringify(formData.secondarySkills));
            data.append('technicalSkills', JSON.stringify(formData.technicalSkills));
            data.append('softSkills', JSON.stringify(formData.softSkills));
            data.append('certifications', JSON.stringify(formData.certifications));
            data.append('languages', JSON.stringify(formData.languages));
            data.append('education', JSON.stringify(formData.education));
            data.append('desiredJobTitles', JSON.stringify(formData.desiredJobTitles));
            data.append('preferredLocations', JSON.stringify(formData.preferredLocations));
            data.append('workMode', JSON.stringify(formData.workMode));
            data.append('jobType', JSON.stringify(formData.jobType));
            data.append('salaryMin', formData.salaryMin);
            data.append('salaryMax', formData.salaryMax);
            data.append('salaryCurrency', formData.salaryCurrency);
            data.append('companySize', JSON.stringify(formData.companySize));
            data.append('preferredIndustries', JSON.stringify(formData.preferredIndustries));

            // Files
            if (formData.profilePicture) {
                data.append('profilePicture', formData.profilePicture);
            }
            if (formData.resume) {
                data.append('resume', formData.resume);
            }

            await register(data);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        // Social login implementation coming soon
        console.log(`${provider} login requested`);
    };

    const renderProgressBar = () => (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${step < currentStep ? 'bg-green-500 text-white' :
                            step === currentStep ? 'bg-blue-600 text-white' :
                                'bg-gray-200 text-gray-500'
                            }`}>
                            {step < currentStep ? '✓' : step}
                        </div>
                        <span className="text-xs mt-1 text-gray-600 font-medium hidden sm:block">
                            {step === 1 ? 'Basic' : step === 2 ? 'Professional' : step === 3 ? 'Skills' : step === 4 ? 'Preferences' : 'Resume'}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex px-4">
                {[1, 2, 3, 4].map((step) => (
                    <div key={step} className={`h-1 flex-1 transition-colors duration-300 ${step < currentStep ? 'bg-green-500' : step === currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                ))}
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First Name *"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last Name *"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
            </div>

            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email *"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />

            <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Phone Number *"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />

            <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Current Location (City, State/Country) *"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />

            <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn Profile (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />

            <input
                type="url"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="Portfolio/Personal Website (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />

            <div>
                <label className="block text-sm text-gray-600 mb-2">Profile Picture (optional)</label>
                <input
                    type="file"
                    name="profilePicture"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
            </div>

            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password *"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                    </svg>
                </button>
            </div>

            <div className="relative">
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm Password *"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirmPassword ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                    </svg>
                </button>
            </div>

            <div className="flex items-center gap-2 py-2">
                <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                    I've read and agree with your{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                        Terms of Services
                    </a>
                </label>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Background</h2>

            <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                placeholder="Current Job Title *"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />

            <select
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            >
                <option value="">Years of Experience *</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
            </select>

            <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            >
                <option value="">Experience Level *</option>
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Executive">Executive</option>
            </select>

            <input
                type="text"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                placeholder="Current/Most Recent Company"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />

            <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="Industry/Field"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />

            <textarea
                name="professionalSummary"
                value={formData.professionalSummary}
                onChange={handleChange}
                placeholder="Brief Professional Summary (2-3 sentences)"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills & Qualifications</h2>

            {/* Primary Skills */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Skills (Top 5-10) *</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={tempSkill}
                        onChange={(e) => setTempSkill(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (addToArray('primarySkills', tempSkill)) {
                                    setTempSkill('');
                                }
                            }
                        }}
                        placeholder="Add a skill and press Enter"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            if (addToArray('primarySkills', tempSkill)) {
                                setTempSkill('');
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.primarySkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeFromArray('primarySkills', index)}
                                className="text-blue-700 hover:text-blue-900"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Secondary Skills */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Skills</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (addToArray('secondarySkills', e.target.value)) {
                                    e.target.value = '';
                                }
                            }
                        }}
                        placeholder="Add a skill and press Enter"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.secondarySkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2">
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeFromArray('secondarySkills', index)}
                                className="text-gray-700 hover:text-gray-900"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Technical Skills */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (addToArray('technicalSkills', e.target.value)) {
                                    e.target.value = '';
                                }
                            }
                        }}
                        placeholder="Programming languages, software, tools"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.technicalSkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-2">
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeFromArray('technicalSkills', index)}
                                className="text-green-700 hover:text-green-900"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Soft Skills */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (addToArray('softSkills', e.target.value)) {
                                    e.target.value = '';
                                }
                            }
                        }}
                        placeholder="Communication, Leadership, etc."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.softSkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeFromArray('softSkills', index)}
                                className="text-purple-700 hover:text-purple-900"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Certifications */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                <div className="space-y-2 mb-2">
                    <input
                        type="text"
                        value={tempCertification.name}
                        onChange={(e) => setTempCertification({ ...tempCertification, name: e.target.value })}
                        placeholder="Certification Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <input
                        type="text"
                        value={tempCertification.organization}
                        onChange={(e) => setTempCertification({ ...tempCertification, organization: e.target.value })}
                        placeholder="Issuing Organization"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <input
                        type="text"
                        value={tempCertification.date}
                        onChange={(e) => setTempCertification({ ...tempCertification, date: e.target.value })}
                        placeholder="Date (e.g., Jan 2024)"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <button
                        type="button"
                        onClick={addCertification}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                        Add Certification
                    </button>
                </div>
                <div className="space-y-2">
                    {formData.certifications.map((cert, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-start">
                            <div className="text-sm">
                                <div className="font-medium">{cert.name}</div>
                                <div className="text-gray-600">{cert.organization}</div>
                                <div className="text-gray-500 text-xs">{cert.date}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFromArray('certifications', index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Languages */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                        type="text"
                        value={tempLanguage.language}
                        onChange={(e) => setTempLanguage({ ...tempLanguage, language: e.target.value })}
                        placeholder="Language"
                        className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <select
                        value={tempLanguage.proficiency}
                        onChange={(e) => setTempLanguage({ ...tempLanguage, proficiency: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    >
                        <option value="">Proficiency</option>
                        <option value="Basic">Basic</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Native">Native</option>
                    </select>
                </div>
                <button
                    type="button"
                    onClick={addLanguage}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm mb-2"
                >
                    Add Language
                </button>
                <div className="flex flex-wrap gap-2">
                    {formData.languages.map((lang, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2">
                            {lang.language} ({lang.proficiency})
                            <button
                                type="button"
                                onClick={() => removeFromArray('languages', index)}
                                className="text-indigo-700 hover:text-indigo-900"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Education */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                <div className="space-y-2 mb-2">
                    <input
                        type="text"
                        value={tempEducation.degree}
                        onChange={(e) => setTempEducation({ ...tempEducation, degree: e.target.value })}
                        placeholder="Degree"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <input
                        type="text"
                        value={tempEducation.institution}
                        onChange={(e) => setTempEducation({ ...tempEducation, institution: e.target.value })}
                        placeholder="Institution"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <input
                        type="text"
                        value={tempEducation.year}
                        onChange={(e) => setTempEducation({ ...tempEducation, year: e.target.value })}
                        placeholder="Year (e.g., 2020)"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <button
                        type="button"
                        onClick={addEducation}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                        Add Education
                    </button>
                </div>
                <div className="space-y-2">
                    {formData.education.map((edu, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-start">
                            <div className="text-sm">
                                <div className="font-medium">{edu.degree}</div>
                                <div className="text-gray-600">{edu.institution}</div>
                                <div className="text-gray-500 text-xs">{edu.year}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFromArray('education', index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Preferences</h2>

            {/* Desired Job Titles */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desired Job Titles *</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={tempJobTitle}
                        onChange={(e) => setTempJobTitle(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (addToArray('desiredJobTitles', tempJobTitle)) {
                                    setTempJobTitle('');
                                }
                            }
                        }}
                        placeholder="Add a job title and press Enter"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            if (addToArray('desiredJobTitles', tempJobTitle)) {
                                setTempJobTitle('');
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.desiredJobTitles.map((title, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                            {title}
                            <button
                                type="button"
                                onClick={() => removeFromArray('desiredJobTitles', index)}
                                className="text-blue-700 hover:text-blue-900"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Preferred Locations */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={tempLocation}
                        onChange={(e) => setTempLocation(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (addToArray('preferredLocations', tempLocation)) {
                                    setTempLocation('');
                                }
                            }
                        }}
                        placeholder="Add location (or type 'Remote')"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            if (addToArray('preferredLocations', tempLocation)) {
                                setTempLocation('');
                            }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.preferredLocations.map((loc, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2">
                            {loc}
                            <button
                                type="button"
                                onClick={() => removeFromArray('preferredLocations', index)}
                                className="text-gray-700 hover:text-gray-900"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Work Mode */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode *</label>
                <div className="grid grid-cols-3 gap-2">
                    {['Remote', 'Hybrid', 'On-site'].map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => handleArrayToggle('workMode', mode)}
                            className={`px-4 py-2 border rounded text-sm ${formData.workMode.includes(mode)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            {/* Job Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <div className="grid grid-cols-3 gap-2">
                    {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => handleArrayToggle('jobType', type)}
                            className={`px-4 py-2 border rounded text-sm ${formData.jobType.includes(type)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Salary Range */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <div className="grid grid-cols-3 gap-2">
                    <input
                        type="number"
                        name="salaryMin"
                        value={formData.salaryMin}
                        onChange={handleChange}
                        placeholder="Min"
                        className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <input
                        type="number"
                        name="salaryMax"
                        value={formData.salaryMax}
                        onChange={handleChange}
                        placeholder="Max"
                        className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    />
                    <select
                        name="salaryCurrency"
                        value={formData.salaryCurrency}
                        onChange={handleChange}
                        className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="PKR">PKR</option>
                    </select>
                </div>
            </div>

            {/* Company Size */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Company Size</label>
                <div className="grid grid-cols-3 gap-2">
                    {['Startup', 'Small', 'Medium', 'Large', 'Enterprise'].map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => handleArrayToggle('companySize', size)}
                            className={`px-4 py-2 border rounded text-sm ${formData.companySize.includes(size)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preferred Industries */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Industries</label>
                <div className="grid grid-cols-2 gap-2">
                    {['Tech', 'Finance', 'Healthcare', 'Education', 'E-commerce', 'Manufacturing', 'Consulting', 'Media'].map((industry) => (
                        <button
                            key={industry}
                            type="button"
                            onClick={() => handleArrayToggle('preferredIndustries', industry)}
                            className={`px-4 py-2 border rounded text-sm ${formData.preferredIndustries.includes(industry)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {industry}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resume Upload</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="mt-4">
                    <label htmlFor="resume-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">Upload a file</span>
                        <span className="text-gray-600"> or drag and drop</span>
                        <input
                            id="resume-upload"
                            name="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">PDF or DOCX up to 10MB</p>
                </div>
                {formData.resume && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg text-green-700 text-sm flex items-center justify-between">
                        <span>✓ {formData.resume.name}</span>
                        <button type="button" onClick={() => setFormData({ ...formData, resume: null })} className="text-red-500 hover:text-red-700">×</button>
                    </div>
                )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>AI Parsing:</strong> Once you upload your resume, our AI will automatically extract keywords, skills, and experience. You'll be able to review and confirm the parsed data before finalizing your profile.
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
            <div className="max-w-2xl w-full">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Log in
                                </Link>
                            </p>
                        </div>
                        <div className="relative">
                            <select
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option>Employers</option>
                                <option>Job Seekers</option>
                            </select>
                            <svg
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {renderProgressBar()}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form Steps */}
                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}
                        {currentStep === 5 && renderStep5()}

                        {/* Navigation Buttons */}
                        <div className="mt-8 flex gap-4">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 transition-all duration-200"
                                >
                                    Previous
                                </button>
                            )}
                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    Next
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Social Login - Only on Step 1 */}
                    {currentStep === 1 && (
                        <>
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">or</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleSocialLogin('Facebook')}
                                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="text-sm text-gray-700">Facebook</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleSocialLogin('Google')}
                                    className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm text-gray-700">Google</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;
