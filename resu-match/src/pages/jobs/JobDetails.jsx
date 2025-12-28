import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getJobById, saveJob, unsaveJob, isJobSaved, formatSalary, getTimeAgo } from '../../services/jobs';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/common/Toast';
import {
    FiArrowLeft,
    FiMapPin,
    FiBriefcase,
    FiCalendar,
    FiBookmark,
    FiExternalLink,
    FiClock,
    FiDollarSign,
    FiUsers,
    FiCheck,
    FiSend,
    FiAward,
    FiCheckCircle
} from 'react-icons/fi';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const { toasts, success, error: showError, removeToast } = useToast();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        fetchJobDetails();
        if (isAuthenticated) {
            checkJobStatus();
        }
    }, [id, isAuthenticated]);

    const fetchJobDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const jobData = await getJobById(id);
            setJob(jobData);
        } catch (error) {
            console.error('Error fetching job details:', error);
            setError('Job not found or failed to load');
        } finally {
            setLoading(false);
        }
    };

    const checkJobStatus = async () => {
        try {
            const [savedStatus, appliedRes] = await Promise.all([
                isJobSaved(id),
                api.get(`/applications?jobId=${id}`)
            ]);

            setIsSaved(savedStatus);
            setHasApplied(appliedRes.data.length > 0);
        } catch (error) {
            console.error('Error checking job status:', error);
        }
    };

    const handleSaveJob = async () => {
        if (authLoading) return; // Wait for auth to load
        
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/jobs/${id}` } });
            return;
        }
        
        try {
            if (isSaved) {
                await unsaveJob(id);
                setIsSaved(false);
                success('Job removed from saved list');
            } else {
                await saveJob(id, job);
                setIsSaved(true);
                success('Job saved successfully!');
            }
        } catch (error) {
            console.error('Error saving job:', error);
            showError('Failed to save job. Please try again.');
        }
    };

    const handleApply = async () => {
        // Wait for auth to load
        if (authLoading) return;
        
        // Check authentication first
        if (!isAuthenticated) {
            // Store intended destination for redirect after login
            navigate('/login', { state: { from: `/jobs/${id}`, applyAfterLogin: true } });
            return;
        }

        setApplying(true);
        try {
            const applicationData = {
                job_id: id,
                job_title: job.title,
                company_name: job.company,
                job_location: job.location,
                job_type: job.type,
                job_data: {
                    description: job.description,
                    requirements: job.requirements,
                    salary: job.salary,
                    skills: job.skills,
                    experience: job.experience
                },
                status: 'applied'
            };
            
            const response = await api.post('/applications', applicationData);

            setHasApplied(true);
            success('Application submitted successfully! 🎉');
        } catch (error) {
            console.error('Error applying to job:', error);
            console.error('Error details:', error.response?.data);
            showError(error.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center py-16 px-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiBriefcase className="text-gray-400" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {error || 'Job Not Found'}
                    </h2>
                    <p className="text-gray-500 mb-6">
                        {error ? 'There was an error loading the job details.' : 'The job you\'re looking for doesn\'t exist or has been removed.'}
                    </p>
                    <Link
                        to="/jobs"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        <FiArrowLeft size={18} />
                        Back to Job Search
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header with Back Button */}
            <div className="bg-white border-b border-blue-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        <FiArrowLeft size={20} />
                        Back
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Header Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
                            {/* Gradient Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                                <div className="flex items-start gap-6">
                                    {/* Company Logo */}
                                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <span className="text-3xl font-bold text-blue-600">
                                            {job.company?.charAt(0) || 'C'}
                                        </span>
                                    </div>

                                    {/* Job Title & Company */}
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                                        <p className="text-blue-100 text-lg font-medium">{job.company}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Job Meta Info */}
                            <div className="px-8 py-6">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <FiMapPin className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Location</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {job.location || 'Remote'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                            <FiBriefcase className="text-green-600" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Experience Level</p>
                                            <p className="text-sm font-semibold text-gray-900">{job.experience}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                            <FiCalendar className="text-purple-600" size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Posted Date</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {getTimeAgo(job.postedDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={handleApply}
                                        disabled={hasApplied || applying}
                                        className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all cursor-pointer ${hasApplied
                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                            : applying
                                                ? 'bg-gray-100 text-gray-400'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                                            }`}
                                    >
                                        {hasApplied ? (
                                            <>
                                                <FiCheck size={20} />
                                                Applied Successfully
                                            </>
                                        ) : applying ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                                                Applying...
                                            </>
                                        ) : (
                                            <>
                                                <FiSend size={20} />
                                                {isAuthenticated ? 'Apply Now' : 'Sign in to Apply'}
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={handleSaveJob}
                                        className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 cursor-pointer ${isSaved
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                                            : 'bg-white border border-blue-300 text-blue-700 hover:border-blue-400 hover:bg-blue-50'
                                            }`}
                                    >
                                        <FiBookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
                                        {isSaved ? 'Saved' : 'Save Job'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Skills & Requirements */}
                        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                    <FiCheckCircle className="text-purple-600" size={20} />
                                </div>
                                Requirements
                            </h2>
                            <ul className="space-y-3">
                                {job.requirements.map((req, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                                        <FiCheck className="text-green-600 mt-1 flex-shrink-0" size={18} />
                                        <span className="leading-relaxed">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Application Steps */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FiAward className="text-blue-600" size={20} />
                                </div>
                                Application Process
                            </h2>
                            <div className="space-y-4">
                                {job.applicationSteps.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {idx + 1}
                                        </div>
                                        <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                    <span className="text-green-600 text-xl">💡</span>
                                </div>
                                Required Skills
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {job.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-semibold hover:from-blue-100 hover:to-indigo-100 transition-all border border-blue-200"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        {job.industry && (
                            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                                        <span className="text-orange-600">🏷️</span>
                                    </div>
                                    Industry
                                </h2>
                                <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                                    {job.industry}
                                </span>
                            </div>
                        )}

                        {/* Job Description */}
                        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <FiBriefcase className="text-blue-600" size={20} />
                                </div>
                                Job Description
                            </h2>
                            <div className="prose prose-blue max-w-none">
                                <p className="text-gray-700 leading-relaxed text-lg">{job.description}</p>
                            </div>
                        </div>

                        {/* Benefits */}
                        {job.benefits && job.benefits.length > 0 && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-200 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-green-600 text-xl">🎁</span>
                                    </div>
                                    Benefits & Perks
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {job.benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-gray-700 bg-white rounded-lg p-3 border border-green-200">
                                            <FiCheck className="text-green-600 flex-shrink-0" size={18} />
                                            <span className="font-medium">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Company Info */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <FiUsers className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">About {job.company}</h2>
                                    <p className="text-gray-600 text-sm mt-1">{job.industry}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                Join {job.company}, a leading company in the {job.industry} sector, and be part of a team that's shaping the future of the industry in Pakistan.
                            </p>
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-4 border border-blue-200">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Salary Range</p>
                                    <p className="text-lg font-bold text-blue-600">{formatSalary(job.salary)}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-blue-200">
                                    <p className="text-xs text-gray-500 font-medium mb-1">Applicants</p>
                                    <p className="text-lg font-bold text-blue-600">{job.applicants}+</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6 sticky top-24 self-start">
                        {/* Quick Apply Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiSend className="text-blue-600" size={28} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Apply</h3>
                                <p className="text-sm text-gray-600">
                                    {isAuthenticated ? 'Submit your application now' : 'Sign in to apply'}
                                </p>
                            </div>

                            <button
                                onClick={handleApply}
                                disabled={hasApplied || applying}
                                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all cursor-pointer ${hasApplied
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : applying
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                                    }`}
                            >
                                {hasApplied ? '✓ Applied' : applying ? 'Submitting...' : isAuthenticated ? 'Apply Now' : 'Sign in to Apply'}
                            </button>

                            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Job Type:</span>
                                    <span className="font-semibold text-gray-900">{job.type}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Experience:</span>
                                    <span className="font-semibold text-gray-900">{job.experience}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Posted:</span>
                                    <span className="font-semibold text-gray-900">{getTimeAgo(job.postedDate)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Salary Info Card */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <FiDollarSign className="text-green-600" size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Salary</h3>
                            </div>
                            <p className="text-2xl font-bold text-green-600 mb-1">{formatSalary(job.salary)}</p>
                            <p className="text-sm text-gray-600">per month</p>
                        </div>

                        {/* Job Highlights */}
                        <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiBriefcase className="text-blue-600" size={20} />
                                Job Highlights
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <FiMapPin className="text-blue-600 mt-1 flex-shrink-0" size={16} />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Location</p>
                                        <p className="text-sm font-semibold text-gray-900">{job.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FiUsers className="text-blue-600 mt-1 flex-shrink-0" size={16} />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Applicants</p>
                                        <p className="text-sm font-semibold text-gray-900">{job.applicants} applied</p>
                                    </div>
                                </div>
                                {job.remote && (
                                    <div className="flex items-start gap-3">
                                        <span className="mt-1">🏠</span>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Work Mode</p>
                                            <p className="text-sm font-semibold text-gray-900">Remote Available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default JobDetails;
