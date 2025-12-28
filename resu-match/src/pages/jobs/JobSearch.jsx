import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { getAllJobs, formatSalary, getTimeAgo } from '../../services/jobs';

const pakistaniCities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'
];
import {
    FiSearch,
    FiMapPin,
    FiBriefcase,
    FiDollarSign,
    FiFilter,
    FiX,
    FiExternalLink,
    FiCalendar,
    FiChevronDown,
    FiBookmark,
    FiClock,
    FiUsers
} from 'react-icons/fi';

const JobSearch = () => {
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        location: searchParams.get('location') || '',
        jobType: '',
        experienceLevel: '',
        industry: '',
        remote: ''
    });
    const [sortBy, setSortBy] = useState('recent');
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Fetch jobs from API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllJobs();
                setJobs(data);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Failed to load jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Filter and search jobs
    const filteredJobs = useMemo(() => {
        let results = [...jobs];

        // Search filter
        if (debouncedSearch) {
            const searchLower = debouncedSearch.toLowerCase();
            results = results.filter(job =>
                job.title.toLowerCase().includes(searchLower) ||
                job.company.toLowerCase().includes(searchLower) ||
                job.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
                job.description.toLowerCase().includes(searchLower)
            );
        }

        // Location filter
        if (filters.location) {
            results = results.filter(job =>
                job.location.toLowerCase().includes(filters.location.toLowerCase()) ||
                (filters.location.toLowerCase() === 'remote' && job.remote)
            );
        }

        // Job type filter
        if (filters.jobType) {
            results = results.filter(job => job.type === filters.jobType);
        }

        // Experience level filter
        if (filters.experienceLevel) {
            results = results.filter(job =>
                job.experience.toLowerCase().includes(filters.experienceLevel.toLowerCase())
            );
        }

        // Industry filter
        if (filters.industry) {
            results = results.filter(job =>
                job.industry.toLowerCase().includes(filters.industry.toLowerCase())
            );
        }

        // Remote filter
        if (filters.remote) {
            const isRemote = filters.remote === 'true';
            results = results.filter(job => job.remote === isRemote);
        }

        // Sorting
        switch (sortBy) {
            case 'recent':
                results.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
                break;
            case 'salary-high':
                results.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
                break;
            case 'salary-low':
                results.sort((a, b) => (a.salary?.min || 0) - (b.salary?.min || 0));
                break;
            case 'applicants':
                results.sort((a, b) => b.applicants - a.applicants);
                break;
            default:
                break;
        }

        return results;
    }, [jobs, debouncedSearch, filters, sortBy]);

    // Pagination logic
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (filterName, value) => {
        setFilters({
            ...filters,
            [filterName]: value
        });
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleClearFilters = () => {
        setFilters({
            location: '',
            jobType: '',
            experienceLevel: '',
            industry: '',
            remote: ''
        });
        setSearchQuery('');
        setCurrentPage(1); // Reset to first page when clearing filters
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchQuery !== '';

    // Get unique industries from loaded jobs
    const industries = [...new Set(jobs.map(job => job.industry))].sort();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading jobs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <p className="text-red-600 text-lg font-semibold mb-2">Error Loading Jobs</p>
                        <p className="text-red-500">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-4 btn-primary"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Search Section */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 py-16 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 animate-fadeIn">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                            Find Your Dream Job
                        </h1>
                        <p className="text-blue-100 text-lg">
                            Explore {jobs.length}+ opportunities from top Pakistani companies
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-2xl p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by title, company, or skills..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all"
                                    />
                                </div>
                                <div className="relative md:w-64">
                                    <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                    <select
                                        value={filters.location}
                                        onChange={(e) => handleFilterChange('location', e.target.value)}
                                        className="w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer transition-all"
                                    >
                                        <option value="">All Locations</option>
                                        <option value="remote">Remote</option>
                                        {pakistaniCities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-4">
                            {/* Filters Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <FiFilter className="text-blue-600" size={20} />
                                    Filters
                                </h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors clickable"
                                    >
                                        <FiX size={16} />
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Job Type Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        <FiBriefcase className="inline mr-1" size={16} />
                                        Job Type
                                    </label>
                                    <div className="space-y-2">
                                        {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map(type => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="jobType"
                                                    value={type}
                                                    checked={filters.jobType === type}
                                                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                                                    {type}
                                                </span>
                                            </label>
                                        ))}
                                        {filters.jobType && (
                                            <button
                                                onClick={() => handleFilterChange('jobType', '')}
                                                className="text-xs text-blue-600 hover:text-blue-700 ml-6"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Experience Level Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Experience Level
                                    </label>
                                    <div className="space-y-2">
                                        {['Entry', 'Mid', 'Senior'].map(level => (
                                            <label key={level} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="experienceLevel"
                                                    value={level}
                                                    checked={filters.experienceLevel === level}
                                                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                                                    className="w-4 h-4 text-blue-600 cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                                                    {level} Level
                                                </span>
                                            </label>
                                        ))}
                                        {filters.experienceLevel && (
                                            <button
                                                onClick={() => handleFilterChange('experienceLevel', '')}
                                                className="text-xs text-blue-600 hover:text-blue-700 ml-6"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Industry Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Industry
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={filters.industry}
                                            onChange={(e) => handleFilterChange('industry', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm cursor-pointer"
                                        >
                                            <option value="">All Industries</option>
                                            {industries.map(industry => (
                                                <option key={industry} value={industry}>{industry}</option>
                                            ))}
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                {/* Remote Work Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Work Location
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="remote"
                                                value="true"
                                                checked={filters.remote === 'true'}
                                                onChange={(e) => handleFilterChange('remote', e.target.value)}
                                                className="w-4 h-4 text-blue-600 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                                                Remote Only
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="remote"
                                                value="false"
                                                checked={filters.remote === 'false'}
                                                onChange={(e) => handleFilterChange('remote', e.target.value)}
                                                className="w-4 h-4 text-blue-600 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                                                On-site Only
                                            </span>
                                        </label>
                                        {filters.remote && (
                                            <button
                                                onClick={() => handleFilterChange('remote', '')}
                                                className="text-xs text-blue-600 hover:text-blue-700 ml-6"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Jobs List */}
                    <div className="lg:col-span-3">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <p className="text-gray-700 font-medium">
                                <span className="text-blue-600 font-bold text-xl">{filteredJobs.length}</span>
                                <span className="text-gray-600"> jobs found</span>
                                {filteredJobs.length > jobsPerPage && (
                                    <span className="text-gray-500 text-sm ml-2">
                                        (Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)})
                                    </span>
                                )}
                            </p>
                            
                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600 font-medium">Sort by:</label>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm font-medium cursor-pointer"
                                    >
                                        <option value="recent">Most Recent</option>
                                        <option value="salary-high">Highest Salary</option>
                                        <option value="salary-low">Lowest Salary</option>
                                        <option value="applicants">Most Popular</option>
                                    </select>
                                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        {filteredJobs.length > 0 ? (
                            <>
                                {/* Jobs Grid */}
                                <div className="space-y-4">
                                    {currentJobs.map((job) => (
                                        <div
                                            key={job.id}
                                            className="modern-card hover-lift p-6 group cursor-pointer"
                                            onClick={() => window.location.href = `/jobs/${job.id}`}
                                        >
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Company Logo */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-200 group-hover:border-blue-400 transition-colors">
                                                        <span className="text-2xl font-bold text-blue-600">
                                                            {job.company.charAt(0)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Job Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4 mb-3">
                                                        <div className="flex-1">
                                                            <Link
                                                                to={`/jobs/${job.id}`}
                                                                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-1 block"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {job.title}
                                                            </Link>
                                                            <p className="text-gray-600 font-medium">{job.company}</p>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-lg font-bold text-blue-600">{formatSalary(job.salary)}</p>
                                                            <p className="text-xs text-gray-500">per month</p>
                                                        </div>
                                                    </div>

                                                    {/* Tags */}
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                            <FiMapPin size={14} />
                                                            {job.location}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                                            <FiBriefcase size={14} />
                                                            {job.type}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                                                            <FiClock size={14} />
                                                            {job.experience}
                                                        </span>
                                                        {job.remote && (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                                                                🏠 Remote
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Skills */}
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {job.skills.slice(0, 5).map((skill, idx) => (
                                                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {job.skills.length > 5 && (
                                                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-medium">
                                                                +{job.skills.length - 5} more
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <FiCalendar size={14} />
                                                                {getTimeAgo(job.postedDate)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <FiUsers size={14} />
                                                                {job.applicants} applicants
                                                            </span>
                                                        </div>
                                                        <Link
                                                            to={`/jobs/${job.id}`}
                                                            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            View Details
                                                            <FiExternalLink size={14} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                currentPage === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600'
                                            }`}
                                        >
                                            Previous
                                        </button>
                                        
                                        <div className="flex gap-1">
                                            {[...Array(totalPages)].map((_, index) => {
                                                const pageNumber = index + 1;
                                                // Show first page, last page, current page, and pages around current
                                                if (
                                                    pageNumber === 1 ||
                                                    pageNumber === totalPages ||
                                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => handlePageChange(pageNumber)}
                                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                                currentPage === pageNumber
                                                                    ? 'bg-blue-600 text-white shadow-md'
                                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600'
                                                            }`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                } else if (
                                                    pageNumber === currentPage - 2 ||
                                                    pageNumber === currentPage + 2
                                                ) {
                                                    return <span key={pageNumber} className="px-2 py-2 text-gray-400">...</span>;
                                                }
                                                return null;
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                currentPage === totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600'
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FiSearch className="text-blue-400" size={48} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">No Jobs Found</h2>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    We couldn't find any jobs matching your criteria. Try adjusting your search or filters.
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2 hover-lift"
                                    >
                                        <FiX size={18} />
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSearch;
