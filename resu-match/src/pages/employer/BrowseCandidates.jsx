import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
    FiSearch, FiFilter, FiMapPin, FiBriefcase, FiAward, FiStar,
    FiMail, FiPhone, FiLinkedin, FiExternalLink, FiBookmark
} from 'react-icons/fi';

const BrowseCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        experienceLevel: '',
        skills: '',
        jobTitle: ''
    });

    useEffect(() => {
        fetchCandidates();
    }, [filters]);

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.location) params.location = filters.location;
            if (filters.experienceLevel) params.experience = filters.experienceLevel;
            if (filters.search) params.search = filters.search;
            
            const response = await api.get('/users/candidates', { params });
            setCandidates(response.data);
        } catch (error) {
            console.error('Error fetching candidates:', error);
            setCandidates([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredCandidates = candidates;

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Browse <span className="text-blue-600">Candidates</span>
                    </h1>
                    <p className="text-gray-600">Find the perfect talent for your team</p>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, job title, or skills..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <div className="relative">
                                <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Experience Level */}
                        <div>
                            <select
                                value={filters.experienceLevel}
                                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Experience Levels</option>
                                <option value="Entry-level">Entry-level</option>
                                <option value="Mid-level">Mid-level</option>
                                <option value="Senior">Senior</option>
                                <option value="Lead">Lead</option>
                                <option value="Executive">Executive</option>
                            </select>
                        </div>

                        {/* Skills */}
                        <div>
                            <input
                                type="text"
                                placeholder="Skills (e.g. React, Python)"
                                value={filters.skills}
                                onChange={(e) => handleFilterChange('skills', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Job Title */}
                        <div>
                            <input
                                type="text"
                                placeholder="Job Title"
                                value={filters.jobTitle}
                                onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        Showing <span className="font-semibold">{filteredCandidates.length}</span> candidates
                    </div>
                </div>

                {/* Candidates List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading candidates...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredCandidates.map(candidate => (
                            <div
                                key={candidate.id}
                                className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-all"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                                            {candidate.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                                            <p className="text-gray-600 font-medium">{candidate.job_title}</p>
                                            <p className="text-sm text-gray-500">{candidate.current_company}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                        <FiBookmark size={20} />
                                    </button>
                                </div>

                                {/* Meta Info */}
                                <div className="flex flex-wrap gap-3 mb-4">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full flex items-center gap-1">
                                        <FiMapPin size={14} />
                                        {candidate.location}
                                    </span>
                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-sm rounded-full flex items-center gap-1">
                                        <FiBriefcase size={14} />
                                        {candidate.years_of_experience}+ years
                                    </span>
                                    <span className="px-3 py-1 bg-purple-50 text-purple-600 text-sm rounded-full flex items-center gap-1">
                                        <FiAward size={14} />
                                        {candidate.experience_level}
                                    </span>
                                </div>

                                {/* Summary */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {candidate.professional_summary}
                                </p>

                                {/* Skills */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.skills?.primary?.slice(0, 5).map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact Actions */}
                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <a
                                        href={`mailto:${candidate.email}`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                    >
                                        <FiMail size={16} />
                                        Contact
                                    </a>
                                    {candidate.linkedin_profile && (
                                        <a
                                            href={candidate.linkedin_profile}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <FiLinkedin size={18} />
                                        </a>
                                    )}
                                    <Link
                                        to={`/candidates/${candidate.id}`}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <FiExternalLink size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && filteredCandidates.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
                        <p className="text-gray-500 text-lg mb-2">No candidates found</p>
                        <p className="text-gray-400">Try adjusting your filters</p>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-10 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Need help finding the right talent?</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Our recruitment team can help you find perfect candidates for your open positions
                    </p>
                    <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg">
                        Contact Recruitment Team
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrowseCandidates;
