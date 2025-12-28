import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import {
    FiBriefcase, FiUsers, FiEye, FiTrendingUp, FiCalendar,
    FiEdit, FiTrash2, FiPlus, FiBarChart2, FiCheckCircle
} from 'react-icons/fi';

const EmployerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        views: 0
    });
    const [jobs, setJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch stats
            const statsResponse = await api.get('/users/employer/stats');
            setStats(statsResponse.data);

            // Fetch employer's jobs
            const jobsResponse = await api.get('/jobs/employer/my-jobs');
            setJobs(jobsResponse.data);

            // Fetch applications for employer's jobs
            const applicationsResponse = await api.get('/users/employer/applications');
            setRecentApplications(applicationsResponse.data.slice(0, 5)); // Show latest 5
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setStats({ totalJobs: 0, activeJobs: 0, totalApplications: 0, totalViews: 0 });
            setJobs([]);
            setRecentApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            applied: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            under_review: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            shortlisted: 'bg-blue-50 text-blue-700 border-blue-200',
            interview_scheduled: 'bg-purple-50 text-purple-700 border-purple-200',
            offered: 'bg-green-50 text-green-700 border-green-200',
            rejected: 'bg-red-50 text-red-700 border-red-200'
        };
        return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const getStatusLabel = (status) => {
        const labels = {
            under_review: 'Under Review',
            shortlisted: 'Shortlisted',
            interview_scheduled: 'Interview Scheduled',
            offered: 'Offered',
            rejected: 'Rejected'
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Employer Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Welcome back, {user?.name || 'Employer'}!
                        </p>
                    </div>
                    <Link
                        to="/employer/post-job"
                        className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-lg"
                    >
                        <FiPlus size={20} />
                        Post New Job
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <FiBriefcase className="text-blue-600" size={24} />
                            </div>
                            <span className="text-sm text-gray-500">Total</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalJobs}</h3>
                        <p className="text-gray-600 text-sm">Job Postings</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <FiCheckCircle className="text-green-600" size={24} />
                            </div>
                            <span className="text-sm text-gray-500">Active</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.activeJobs}</h3>
                        <p className="text-gray-600 text-sm">Active Jobs</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <FiUsers className="text-purple-600" size={24} />
                            </div>
                            <span className="text-sm text-gray-500">Total</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalApplications}</h3>
                        <p className="text-gray-600 text-sm">Applications</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                                <FiEye className="text-orange-600" size={24} />
                            </div>
                            <span className="text-sm text-gray-500">This Month</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalViews?.toLocaleString() || 0}</h3>
                        <p className="text-gray-600 text-sm">Profile Views</p>
                    </div>
                </div>

                {/* Job Postings */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Your Job Postings</h2>
                        <Link
                            to="/employer/jobs"
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div
                                key={job.id}
                                className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex-1 mb-4 md:mb-0">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <FiBriefcase size={14} />
                                                {job.type}
                                            </span>
                                            <span>•</span>
                                            <span>{job.location}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <FiCalendar size={14} />
                                                {new Date(job.posted_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-blue-600">{job.applicants}</p>
                                            <p className="text-xs text-gray-600">Applicants</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-900">{job.views}</p>
                                            <p className="text-xs text-gray-600">Views</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/jobs/${job.id}`}
                                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                            >
                                                <FiEye size={16} />
                                            </Link>
                                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                                <FiEdit size={16} />
                                            </button>
                                            <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
                        <Link
                            to="/employer/applications"
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            View All
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Candidate</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Position</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Experience</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Applied</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentApplications.map(app => (
                                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                                    {app.applicant.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-900">{app.applicant.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">{app.jobTitle}</td>
                                        <td className="py-4 px-4 text-gray-600">N/A</td>
                                        <td className="py-4 px-4 text-gray-600 text-sm">
                                            {new Date(app.appliedDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                                                {getStatusLabel(app.status)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <a 
                                                href={app.applicant.resumeUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium inline-block"
                                            >
                                                View Resume
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <Link
                        to="/employer/candidates"
                        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-xl transition-all group"
                    >
                        <FiUsers className="mb-3 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-xl font-bold mb-2">Browse Candidates</h3>
                        <p className="text-blue-100 text-sm">Find qualified professionals</p>
                    </Link>

                    <Link
                        to="/pricing"
                        className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-xl transition-all group"
                    >
                        <FiTrendingUp className="mb-3 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-xl font-bold mb-2">Upgrade Plan</h3>
                        <p className="text-purple-100 text-sm">Get more features & visibility</p>
                    </Link>

                    <Link
                        to="/employer/analytics"
                        className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white hover:shadow-xl transition-all group"
                    >
                        <FiBarChart2 className="mb-3 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-xl font-bold mb-2">View Analytics</h3>
                        <p className="text-green-100 text-sm">Track your hiring performance</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
