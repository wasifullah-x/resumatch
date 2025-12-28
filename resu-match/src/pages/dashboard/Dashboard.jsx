import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api, { API_URL } from '../../services/api';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import RecommendedJobs from '../../components/dashboard/RecommendedJobs';
import { FiBriefcase, FiBookmark, FiBell, FiArrowRight, FiCheck, FiMapPin } from 'react-icons/fi';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        appliedJobs: 0,
        savedJobs: 0,
        recommendations: 0
    });
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [statsRes, applicationsRes] = await Promise.all([
                api.get('/dashboard/stats').catch(err => {
                    console.error('Error fetching stats:', err);
                    return { data: { appliedJobs: 0, savedJobs: 0, recommendations: 0 } };
                }),
                api.get('/applications?limit=5').catch(err => {
                    console.error('Error fetching applications:', err);
                    return { data: [] };
                })
            ]);

            setStats(statsRes.data || { appliedJobs: 0, savedJobs: 0, recommendations: 0 });
            setRecentApplications(Array.isArray(applicationsRes.data) ? applicationsRes.data : []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
            // Set default values on error
            setStats({ appliedJobs: 0, savedJobs: 0, recommendations: 0 });
            setRecentApplications([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg font-medium">Loading dashboard...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto text-center">
                        <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchDashboardData}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Hello, {user?.name || `${user?.firstName} ${user?.lastName}`} 👋
                        </h1>
                        <p className="text-gray-600 text-lg">Here is your daily activities and job alerts</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300 border border-blue-200">
                            <div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.appliedJobs}</h3>
                                <p className="text-gray-700 font-semibold">Applied jobs</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-lg">
                                <FiBriefcase className="text-3xl text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300 border border-orange-200">
                            <div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stats.savedJobs}</h3>
                                <p className="text-gray-700 font-semibold">Favorite jobs</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-lg">
                                <FiBookmark className="text-3xl text-orange-600" />
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300 border border-green-200">
                            <div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-2">574</h3>
                                <p className="text-gray-700 font-semibold">Job Alerts</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-lg">
                                <FiBell className="text-3xl text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Recommended Jobs */}
                    <div className="mb-8">
                        <RecommendedJobs />
                    </div>

                    {/* Profile Banner */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 mb-8 flex items-center justify-between text-white shadow-xl border border-red-400">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden border-3 border-white shadow-lg">
                                {user?.profile_picture_url ? (
                                    <img
                                        src={`${API_URL}/${user.profile_picture_url.replace(/\\/g, '/')}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Complete Your Profile</h3>
                                <p className="text-red-100 text-sm">Build your profile and create your custom resume to get better matches</p>
                            </div>
                        </div>
                        <Link to="/settings" className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            Edit Profile <FiArrowRight />
                        </Link>
                    </div>

                    {/* Recently Applied */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Recently Applied</h2>
                            <Link
                                to="/applications"
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 hover:underline"
                            >
                                View all <FiArrowRight />
                            </Link>
                        </div>

                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-500 border-b border-gray-100">
                                <div className="col-span-5">Job</div>
                                <div className="col-span-3">Date Applied</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Action</div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {recentApplications.map((application) => (
                                    <div key={application.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                                        <div className="col-span-5 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-500">
                                                {application.company_name?.charAt(0) || 'C'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-gray-900">{application.job_title || 'Job Title'}</h3>
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">{application.job_type || 'Full Time'}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1"><FiMapPin size={12} /> {application.job_location || 'Remote'}</span>
                                                    <span className="font-medium">{application.company_name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3 text-sm text-gray-500">
                                            {new Date(application.applied_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                        </div>
                                        <div className="col-span-2">
                                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                <FiCheck /> {application.status || 'Active'}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <Link
                                                to={`/jobs/${application.job_id}`}
                                                className="inline-block px-4 py-2 bg-gray-100 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                {recentApplications.length === 0 && (
                                    <div className="p-8 text-center text-gray-500">
                                        No applications yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
