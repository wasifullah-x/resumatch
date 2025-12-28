import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api, { API_URL } from '../../services/api';
import ResumeUpload from '../../components/dashboard/ResumeUpload';
import {
    FiUser,
    FiBriefcase,
    FiAward,
    FiTarget,
    FiFileText,
    FiBell,
    FiLock,
    FiMapPin,
    FiGlobe,
    FiLinkedin,
    FiX,
    FiPlus,
    FiUpload,
    FiTrash2,
    FiCamera
} from 'react-icons/fi';

const Settings = () => {
    const { user, logout, updateUser } = useAuth();
    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await api.delete('/users/profile');
                logout();
            } catch (error) {
                console.error('Failed to delete account:', error);
                setMessage({ type: 'error', text: 'Failed to delete account' });
            }
        }
    };

    // Personal Information
    const [personalInfo, setPersonalInfo] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || '',
        linkedIn: user?.linkedin_profile || '',
        portfolio: user?.portfolio_website || '',
        profilePicture: user?.profile_picture_url || null
    });

    // Professional Background
    const [professionalInfo, setProfessionalInfo] = useState({
        currentTitle: user?.job_title || '',
        yearsOfExperience: user?.years_of_experience || '',
        experienceLevel: user?.experience_level || '',
        currentCompany: user?.current_company || '',
        industry: user?.industry || '',
        professionalSummary: user?.professional_summary || ''
    });

    // Skills & Qualifications
    const [skillsInfo, setSkillsInfo] = useState({
        primarySkills: user?.skills?.primary || [],
        secondarySkills: user?.skills?.secondary || [],
        technicalSkills: user?.skills?.technical || [],
        softSkills: user?.skills?.soft || [],
        certifications: user?.skills?.certifications || [],
        languages: user?.skills?.languages || [],
        education: user?.education || []
    });

    // Job Preferences
    const [jobPreferences, setJobPreferences] = useState({
        desiredTitles: user?.job_preferences?.jobTitles || [],
        preferredLocations: user?.job_preferences?.locations || [],
        workMode: user?.job_preferences?.workMode || [],
        jobType: user?.job_preferences?.jobType || [],
        salaryMin: user?.job_preferences?.salary?.min || '',
        salaryMax: user?.job_preferences?.salary?.max || '',
        companySizes: user?.job_preferences?.companySize || [],
        preferredIndustries: user?.job_preferences?.industries || []
    });

    // Password Settings
    const [passwordSettings, setPasswordSettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Update state when user object changes (e.g. after refresh)
    useEffect(() => {
        if (user) {
            setPersonalInfo({
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ')[1] || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                linkedIn: user.linkedin_profile || '',
                portfolio: user.portfolio_website || '',
                profilePicture: user.profile_picture_url || null
            });
            setProfessionalInfo({
                currentTitle: user.job_title || '',
                yearsOfExperience: user.years_of_experience || '',
                experienceLevel: user.experience_level || '',
                currentCompany: user.current_company || '',
                industry: user.industry || '',
                professionalSummary: user.professional_summary || ''
            });
            setSkillsInfo({
                primarySkills: user.skills?.primary || [],
                secondarySkills: user.skills?.secondary || [],
                technicalSkills: user.skills?.technical || [],
                softSkills: user.skills?.soft || [],
                certifications: user.skills?.certifications || [],
                languages: user.skills?.languages || [],
                education: user.education || []
            });
            setJobPreferences({
                desiredTitles: user.job_preferences?.jobTitles || [],
                preferredLocations: user.job_preferences?.locations || [],
                workMode: user.job_preferences?.workMode || [],
                jobType: user.job_preferences?.jobType || [],
                salaryMin: user.job_preferences?.salary?.min || '',
                salaryMax: user.job_preferences?.salary?.max || '',
                companySizes: user.job_preferences?.companySize || [],
                preferredIndustries: user.job_preferences?.industries || []
            });
        }
    }, [user]);

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        jobAlerts: true,
        applicationUpdates: true,
        weeklyDigest: false
    });

    // Temporary inputs for arrays
    const [newSkill, setNewSkill] = useState('');
    const [newCertification, setNewCertification] = useState({ name: '', organization: '', date: '' });
    const [newLanguage, setNewLanguage] = useState({ language: '', proficiency: '' });
    const [newEducation, setNewEducation] = useState({ degree: '', institution: '', year: '' });

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: FiUser },
        { id: 'professional', label: 'Professional', icon: FiBriefcase },
        { id: 'skills', label: 'Skills & Certs', icon: FiAward },
        { id: 'preferences', label: 'Job Preferences', icon: FiTarget },
        { id: 'resume', label: 'Resume', icon: FiFileText },
        { id: 'security', label: 'Security', icon: FiLock },
        { id: 'notifications', label: 'Notifications', icon: FiBell }
    ];

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);

        setLoading(true);
        try {
            const response = await api.put('/users/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update local state and context
            const newUrl = response.data.profilePictureUrl;
            setPersonalInfo(prev => ({ ...prev, profilePicture: newUrl }));
            updateUser({ ...user, profile_picture_url: newUrl });

            setMessage({ type: 'success', text: 'Profile picture updated!' });
        } catch (error) {
            console.error('Error uploading picture:', error);
            setMessage({ type: 'error', text: 'Failed to upload profile picture' });
        } finally {
            setLoading(false);
        }
    };

    const handleRemovePicture = async () => {
        if (!window.confirm('Remove profile picture?')) return;

        setLoading(true);
        try {
            await api.delete('/users/profile/picture');

            // Update local state and context
            setPersonalInfo(prev => ({ ...prev, profilePicture: null }));
            updateUser({ ...user, profile_picture_url: null });

            setMessage({ type: 'success', text: 'Profile picture removed!' });
        } catch (error) {
            console.error('Error removing picture:', error);
            setMessage({ type: 'error', text: 'Failed to remove profile picture' });
        } finally {
            setLoading(false);
        }
    };

    const handlePersonalInfoUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/users/profile/personal', personalInfo);
            setMessage({ type: 'success', text: 'Personal information updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update information' });
        } finally {
            setLoading(false);
        }
    };

    const handleProfessionalInfoUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/users/profile/professional', professionalInfo);
            setMessage({ type: 'success', text: 'Professional information updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update information' });
        } finally {
            setLoading(false);
        }
    };

    const handleSkillsUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/users/profile/skills', skillsInfo);
            setMessage({ type: 'success', text: 'Skills and certifications updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update information' });
        } finally {
            setLoading(false);
        }
    };

    const handleJobPreferencesUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/users/profile/preferences', jobPreferences);
            setMessage({ type: 'success', text: 'Job preferences updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update preferences' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/users/password', {
                currentPassword: passwordSettings.currentPassword,
                newPassword: passwordSettings.newPassword
            });
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordSettings({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/users/notifications', notificationSettings);
            setMessage({ type: 'success', text: 'Notification preferences updated!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update preferences' });
        } finally {
            setLoading(false);
        }
    };

    // Array management helpers
    const addSkill = (type) => {
        if (!newSkill.trim()) return;
        setSkillsInfo({
            ...skillsInfo,
            [type]: [...skillsInfo[type], newSkill.trim()]
        });
        setNewSkill('');
    };

    const removeSkill = (type, index) => {
        setSkillsInfo({
            ...skillsInfo,
            [type]: skillsInfo[type].filter((_, i) => i !== index)
        });
    };

    const addCertification = () => {
        if (!newCertification.name.trim()) return;
        setSkillsInfo({
            ...skillsInfo,
            certifications: [...skillsInfo.certifications, newCertification]
        });
        setNewCertification({ name: '', organization: '', date: '' });
    };

    const removeCertification = (index) => {
        setSkillsInfo({
            ...skillsInfo,
            certifications: skillsInfo.certifications.filter((_, i) => i !== index)
        });
    };

    const addLanguage = () => {
        if (!newLanguage.language.trim()) return;
        setSkillsInfo({
            ...skillsInfo,
            languages: [...skillsInfo.languages, newLanguage]
        });
        setNewLanguage({ language: '', proficiency: '' });
    };

    const removeLanguage = (index) => {
        setSkillsInfo({
            ...skillsInfo,
            languages: skillsInfo.languages.filter((_, i) => i !== index)
        });
    };

    const addEducation = () => {
        if (!newEducation.degree.trim()) return;
        setSkillsInfo({
            ...skillsInfo,
            education: [...skillsInfo.education, newEducation]
        });
        setNewEducation({ degree: '', institution: '', year: '' });
    };

    const removeEducation = (index) => {
        setSkillsInfo({
            ...skillsInfo,
            education: skillsInfo.education.filter((_, i) => i !== index)
        });
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
                        <p className="text-xl text-gray-600">Manage your profile and preferences</p>
                    </div>

                    {/* Message */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="border-b border-gray-200 overflow-x-auto">
                            <div className="flex whitespace-nowrap px-4">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${isActive
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <Icon size={18} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Personal Information Tab */}
                            {activeTab === 'personal' && (
                                <form onSubmit={handlePersonalInfoUpdate} className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                                    </div>

                                    {/* Profile Picture Section */}
                                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md">
                                                {user?.profile_picture_url ? (
                                                    <img
                                                        src={`${API_URL}/${user.profile_picture_url.replace(/\\/g, '/')}`}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-2xl font-bold">
                                                        {user?.name?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Profile Picture</h3>
                                            <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 5MB</p>

                                            <div className="flex gap-3">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                                                >
                                                    <FiCamera size={16} />
                                                    Change Picture
                                                </button>
                                                {user?.profile_picture_url && (
                                                    <button
                                                        type="button"
                                                        onClick={handleRemovePicture}
                                                        className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                                    >
                                                        <FiTrash2 size={16} />
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={personalInfo.firstName}
                                                onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={personalInfo.lastName}
                                                onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={personalInfo.email}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <FiMapPin className="inline mr-1" size={14} />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={personalInfo.phone}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <FiMapPin className="inline mr-1" size={14} />
                                            Current Location
                                        </label>
                                        <input
                                            type="text"
                                            value={personalInfo.location}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                                            placeholder="City, State/Country"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <FiLinkedin className="inline mr-1" size={14} />
                                            LinkedIn Profile
                                        </label>
                                        <input
                                            type="url"
                                            value={personalInfo.linkedIn}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, linkedIn: e.target.value })}
                                            placeholder="https://linkedin.com/in/yourprofile"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <FiGlobe className="inline mr-1" size={14} />
                                            Portfolio/Personal Website
                                        </label>
                                        <input
                                            type="url"
                                            value={personalInfo.portfolio}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                                            placeholder="https://yourportfolio.com"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Professional Background Tab */}
                            {activeTab === 'professional' && (
                                <form onSubmit={handleProfessionalInfoUpdate} className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Background</h2>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Current Job Title
                                        </label>
                                        <input
                                            type="text"
                                            value={professionalInfo.currentTitle}
                                            onChange={(e) => setProfessionalInfo({ ...professionalInfo, currentTitle: e.target.value })}
                                            placeholder="e.g. Senior Software Engineer"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Years of Experience
                                            </label>
                                            <select
                                                value={professionalInfo.yearsOfExperience}
                                                onChange={(e) => setProfessionalInfo({ ...professionalInfo, yearsOfExperience: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select range</option>
                                                <option value="0-1">0-1 years</option>
                                                <option value="1-3">1-3 years</option>
                                                <option value="3-5">3-5 years</option>
                                                <option value="5-10">5-10 years</option>
                                                <option value="10+">10+ years</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Experience Level
                                            </label>
                                            <select
                                                value={professionalInfo.experienceLevel}
                                                onChange={(e) => setProfessionalInfo({ ...professionalInfo, experienceLevel: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select level</option>
                                                <option value="Entry">Entry</option>
                                                <option value="Mid">Mid</option>
                                                <option value="Senior">Senior</option>
                                                <option value="Lead">Lead</option>
                                                <option value="Executive">Executive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Current/Most Recent Company
                                        </label>
                                        <input
                                            type="text"
                                            value={professionalInfo.currentCompany}
                                            onChange={(e) => setProfessionalInfo({ ...professionalInfo, currentCompany: e.target.value })}
                                            placeholder="e.g. Google, Microsoft"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Industry/Field
                                        </label>
                                        <input
                                            type="text"
                                            value={professionalInfo.industry}
                                            onChange={(e) => setProfessionalInfo({ ...professionalInfo, industry: e.target.value })}
                                            placeholder="e.g. Technology, Healthcare, Finance"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Professional Summary
                                        </label>
                                        <textarea
                                            value={professionalInfo.professionalSummary}
                                            onChange={(e) => setProfessionalInfo({ ...professionalInfo, professionalSummary: e.target.value })}
                                            rows="4"
                                            placeholder="Brief description of your professional background (2-3 sentences)"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Skills & Certifications Tab */}
                            {activeTab === 'skills' && (
                                <form onSubmit={handleSkillsUpdate} className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Qualifications</h2>
                                    </div>

                                    {/* Primary Skills */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Primary Skills (Top 5-10)
                                        </label>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('primarySkills'))}
                                                placeholder="Add a skill"
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => addSkill('primarySkills')}
                                                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                            >
                                                <FiPlus size={18} />
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {skillsInfo.primarySkills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill('primarySkills', index)}
                                                        className="hover:text-blue-900"
                                                    >
                                                        <FiX size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Technical Skills */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Technical Skills (Languages, Tools, Software)
                                        </label>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('technicalSkills'))}
                                                placeholder="Add a technical skill"
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => addSkill('technicalSkills')}
                                                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                            >
                                                <FiPlus size={18} />
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {skillsInfo.technicalSkills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill('technicalSkills', index)}
                                                        className="hover:text-green-900"
                                                    >
                                                        <FiX size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Soft Skills */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Soft Skills (Communication, Leadership, etc.)
                                        </label>
                                        <div className="flex gap-2 mb-3">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill('softSkills'))}
                                                placeholder="Add a soft skill"
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => addSkill('softSkills')}
                                                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                            >
                                                <FiPlus size={18} />
                                                Add
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {skillsInfo.softSkills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill('softSkills', index)}
                                                        className="hover:text-purple-900"
                                                    >
                                                        <FiX size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Certifications */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Certifications
                                        </label>
                                        <div className="flex gap-3 mb-3">
                                            <input
                                                type="text"
                                                value={newCertification.name}
                                                onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                                                placeholder="Certification Name"
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <input
                                                type="text"
                                                value={newCertification.organization}
                                                onChange={(e) => setNewCertification({ ...newCertification, organization: e.target.value })}
                                                placeholder="Issuing Organization"
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <input
                                                type="text"
                                                value={newCertification.date}
                                                onChange={(e) => setNewCertification({ ...newCertification, date: e.target.value })}
                                                placeholder="Date (e.g. 2023)"
                                                className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={addCertification}
                                                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                                            >
                                                <FiPlus size={18} />
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {skillsInfo.certifications.map((cert, index) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{cert.name}</p>
                                                        <p className="text-sm text-gray-600">{cert.organization} • {cert.date}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCertification(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <FiX size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Languages */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Languages
                                        </label>
                                        <div className="flex gap-3 mb-3">
                                            <input
                                                type="text"
                                                value={newLanguage.language}
                                                onChange={(e) => setNewLanguage({ ...newLanguage, language: e.target.value })}
                                                placeholder="Language"
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <select
                                                value={newLanguage.proficiency}
                                                onChange={(e) => setNewLanguage({ ...newLanguage, proficiency: e.target.value })}
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Proficiency Level</option>
                                                <option value="Basic">Basic</option>
                                                <option value="Conversational">Conversational</option>
                                                <option value="Professional">Professional</option>
                                                <option value="Fluent">Fluent</option>
                                                <option value="Native">Native</option>
                                            </select>
                                            <button
                                                type="button"
                                                onClick={addLanguage}
                                                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                                            >
                                                <FiPlus size={18} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {skillsInfo.languages.map((lang, index) => (
                                                <span key={index} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                                                    {lang.language} ({lang.proficiency})
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLanguage(index)}
                                                        className="hover:text-indigo-900"
                                                    >
                                                        <FiX size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Education */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Education
                                        </label>
                                        <div className="flex gap-3 mb-3">
                                            <input
                                                type="text"
                                                value={newEducation.degree}
                                                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                                                placeholder="Degree"
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <input
                                                type="text"
                                                value={newEducation.institution}
                                                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                                                placeholder="Institution"
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <input
                                                type="text"
                                                value={newEducation.year}
                                                onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                                                placeholder="Year"
                                                className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={addEducation}
                                                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                                            >
                                                <FiPlus size={18} />
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {skillsInfo.education.map((edu, index) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{edu.degree}</p>
                                                        <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeEducation(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <FiX size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Job Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <form onSubmit={handleJobPreferencesUpdate} className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Preferences</h2>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Desired Job Titles
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Software Engineer, Product Manager (comma-separated)"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Preferred Locations
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. New York, San Francisco, Remote (comma-separated)"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Work Mode
                                            </label>
                                            <select
                                                value={jobPreferences.workMode}
                                                onChange={(e) => setJobPreferences({ ...jobPreferences, workMode: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select preference</option>
                                                <option value="Remote">Remote</option>
                                                <option value="Hybrid">Hybrid</option>
                                                <option value="On-site">On-site</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Job Type
                                            </label>
                                            <select
                                                value={jobPreferences.jobType}
                                                onChange={(e) => setJobPreferences({ ...jobPreferences, jobType: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select type</option>
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Freelance">Freelance</option>
                                                <option value="Internship">Internship</option>
                                                <option value="Remote">Remote</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Salary Range
                                        </label>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <input
                                                type="number"
                                                value={jobPreferences.salaryMin}
                                                onChange={(e) => setJobPreferences({ ...jobPreferences, salaryMin: e.target.value })}
                                                placeholder="Minimum ($)"
                                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <input
                                                type="number"
                                                value={jobPreferences.salaryMax}
                                                onChange={(e) => setJobPreferences({ ...jobPreferences, salaryMax: e.target.value })}
                                                placeholder="Maximum ($)"
                                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Preferred Company Sizes
                                        </label>
                                        <div className="space-y-2">
                                            {['Startup (1-50)', 'Small (51-200)', 'Medium (201-1000)', 'Large (1001-5000)', 'Enterprise (5000+)'].map((size) => (
                                                <label key={size} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{size}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Preferred Industries
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Technology, Healthcare, Finance (comma-separated)"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Preferences'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Resume Upload Tab */}
                            {activeTab === 'resume' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Resume Management</h2>
                                    </div>
                                    <ResumeUpload />
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <>
                                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordSettings.currentPassword}
                                                onChange={(e) => setPasswordSettings({ ...passwordSettings, currentPassword: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordSettings.newPassword}
                                                onChange={(e) => setPasswordSettings({ ...passwordSettings, newPassword: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordSettings.confirmPassword}
                                                onChange={(e) => setPasswordSettings({ ...passwordSettings, confirmPassword: e.target.value })}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                                            >
                                                {loading ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </form>

                                    <div className="mt-12 pt-8 border-t border-gray-200">
                                        <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                            <h4 className="font-semibold text-red-900 mb-2">Delete Account</h4>
                                            <p className="text-sm text-red-700 mb-4">
                                                Once you delete your account, there is no going back. Please be certain.
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleDeleteAccount}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                                            >
                                                <FiTrash2 size={18} />
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <form onSubmit={handleNotificationUpdate} className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                                                <p className="text-sm text-gray-600">Receive email notifications</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.emailNotifications}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Job Alerts</h3>
                                                <p className="text-sm text-gray-600">Get notified about new job matches</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.jobAlerts}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, jobAlerts: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Application Updates</h3>
                                                <p className="text-sm text-gray-600">Updates on your job applications</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.applicationUpdates}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, applicationUpdates: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Weekly Digest</h3>
                                                <p className="text-sm text-gray-600">Weekly summary of your activity</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.weeklyDigest}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyDigest: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Preferences'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
};

export default Settings;
