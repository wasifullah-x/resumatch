import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllJobs } from '../services/jobs';
import { AuthContext } from '../context/AuthContext';

const pakistaniCities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'
];

const jobCategories = [
  { name: 'Software Development', count: 245, icon: '💻' },
  { name: 'Data Science', count: 89, icon: '📊' },
  { name: 'Design', count: 156, icon: '🎨' },
  { name: 'Marketing', count: 198, icon: '📱' },
  { name: 'Product Management', count: 67, icon: '📋' },
  { name: 'DevOps', count: 78, icon: '⚙️' },
  { name: 'Quality Assurance', count: 123, icon: '✅' },
  { name: 'Business Analysis', count: 92, icon: '💼' },
];

export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getAllJobs();
                setJobs(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleSearch = () => {
        if (keyword.trim() || location.trim()) {
            navigate(`/jobs?search=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
        } else {
            navigate('/jobs');
        }
    };

    const popularSearches = [
        'Full Stack Developer', 'UI/UX Designer', 'Product Manager',
        'Data Scientist', 'Digital Marketing'
    ];

    const stats = [
        { label: 'Live Jobs', value: '15,000+', icon: '💼' },
        { label: 'Companies', value: '2,500+', icon: '🏢' },
        { label: 'Job Seekers', value: '50,000+', icon: '👥' },
        { label: 'Success Stories', value: '10,000+', icon: '✨' },
    ];

    const featuredCompanies = [
        'Systems Limited', 'Arbisoft', 'TRG Pakistan', 'Netsol Technologies',
        'VentureDive', 'Zameen.com', 'Daraz Pakistan', 'Foodpanda'
    ];

    const testimonials = [
        {
            name: 'Ahmed Hassan',
            role: 'Software Engineer at Systems Limited',
            image: '👨‍💼',
            text: 'ResuMatch helped me land my dream job at Systems Limited. The platform made it incredibly easy to find relevant opportunities in Lahore.',
            rating: 5
        },
        {
            name: 'Ayesha Khan',
            role: 'UI/UX Designer at Arbisoft',
            image: '👩‍💼',
            text: 'The job matching algorithm is spot-on! I found the perfect design role that matched my skills and preferences in just two weeks.',
            rating: 5
        },
        {
            name: 'Ali Raza',
            role: 'Product Manager at Zameen.com',
            image: '👨‍💻',
            text: 'ResuMatch\'s interface is clean and professional. It helped me transition from development to product management seamlessly.',
            rating: 5
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-24 pb-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-fadeIn">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                                <span className="text-2xl">🇵🇰</span>
                                <span className="text-sm font-semibold text-white tracking-wide">
                                    Pakistan's Leading Job Platform
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight font-display">
                                Find Your Dream Job in
                                <span className="block text-blue-200">
                                    Pakistan
                                </span>
                            </h1>

                            <p className="text-xl text-blue-100 leading-relaxed">
                                Connect with top companies across Karachi, Lahore, Islamabad, and beyond. 
                                Your next career opportunity is just a click away.
                            </p>

                            {/* Search Bar */}
                            <div className="card p-8 shadow-2xl border-white/20 backdrop-blur-sm bg-white/95">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Job Title or Keyword
                                        </label>
                                        <div className="relative">
                                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="e.g. Full Stack Developer"
                                                className="input pl-12"
                                                value={keyword}
                                                onChange={(e) => setKeyword(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <div className="relative">
                                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <select
                                                className="input pl-12 appearance-none cursor-pointer"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                            >
                                                <option value="">All Cities</option>
                                                {pakistaniCities.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="md:self-end">
                                        <button
                                            onClick={handleSearch}
                                            className="btn-primary w-full md:w-auto px-8 h-[52px]"
                                        >
                                            Search Jobs
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                    <span className="font-semibold">Popular:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {popularSearches.map((term, index) => (
                                            <button
                                                key={term}
                                                onClick={() => {
                                                    setKeyword(term);
                                                    navigate(`/jobs?search=${encodeURIComponent(term)}`);
                                                }}
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                {term}{index < popularSearches.length - 1 && ','}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-4">
                                {!isAuthenticated ? (
                                    <Link to="/register" className="btn-primary px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                                        🚀 Get Started
                                    </Link>
                                ) : (
                                    <Link to="/dashboard" className="btn-primary px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                                        📊 Dashboard
                                    </Link>
                                )}
                                <Link to="/jobs" className="btn-secondary px-8 py-4 text-lg bg-white/20 border-white/40 text-white hover:bg-white/30 backdrop-blur-sm shadow-lg">
                                    Browse Jobs →
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="hidden lg:block animate-slideUp">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-white rounded-3xl opacity-10 blur-3xl"></div>
                                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                                    <div className="space-y-6">
                                        {/* Mock Job Cards */}
                                        {loading ? (
                                            <div className="text-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                            </div>
                                        ) : (
                                            jobs.slice(0, 3).map((job, index) => (
                                                <div
                                                    key={job.id}
                                                    className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-blue-100"
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                >
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                                                        💼
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-900 truncate">
                                                            {job.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            {job.company} • {job.location}
                                                        </p>
                                                    </div>
                                                    <span className="badge badge-primary">
                                                        {job.type}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-slideUp">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="card p-6 text-center card-hover bg-white/90 backdrop-blur-sm"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="text-4xl mb-3">{stat.icon}</div>
                                <div className="text-3xl font-bold text-blue-600 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Job Categories */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
                            Explore by Category
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover opportunities across various industries and roles in Pakistan's growing job market
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {jobCategories.map((category, index) => (
                            <Link
                                key={category.name}
                                to={`/jobs?category=${encodeURIComponent(category.name)}`}
                                className="card p-6 text-center card-hover group"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {category.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {category.count} Jobs Available
                                </p>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/jobs" className="btn-secondary">
                            View All Categories
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Companies */}
            <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
                            Top Companies Hiring
                        </h2>
                        <p className="text-lg text-gray-600">
                            Join Pakistan's leading organizations
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {featuredCompanies.map((company, index) => (
                            <div
                                key={company}
                                className="card p-8 text-center card-hover"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-2xl font-bold text-blue-600">
                                    {company.charAt(0)}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {company}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Multiple Positions
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
                            <span className="text-2xl">⚡</span>
                            <span className="text-sm font-semibold text-blue-600">Simple & Fast Process</span>
                        </div>
                        <h2 className="text-5xl font-bold text-gray-900 mb-6 font-display">
                            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Works</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Land your dream job in just 3 easy steps. Join thousands of successful job seekers in Pakistan.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting lines */}
                        <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-green-300 -translate-x-1/2"></div>
                        
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-100 group">
                                <div className="relative inline-block mb-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300 rotate-3 group-hover:rotate-0">
                                        <span className="text-4xl">📝</span>
                                    </div>
                                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                        1
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                                    Create Profile
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Sign up in 30 seconds and build your professional profile with resume, skills, experience, and career preferences.
                                </p>
                                <ul className="text-sm text-gray-500 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Upload your resume
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Add skills & experience
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Set job preferences
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-purple-100 group">
                                <div className="relative inline-block mb-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300 rotate-3 group-hover:rotate-0">
                                        <span className="text-4xl">🔍</span>
                                    </div>
                                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                        2
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                                    Search & Apply
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Browse 200+ verified jobs across Pakistan. Filter by location, type, experience, and apply with one click.
                                </p>
                                <ul className="text-sm text-gray-500 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Smart job recommendations
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        One-click applications
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Track application status
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-green-100 group">
                                <div className="relative inline-block mb-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300 rotate-3 group-hover:rotate-0">
                                        <span className="text-4xl">🎉</span>
                                    </div>
                                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                        3
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                                    Get Hired
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Connect with top employers, manage interviews, and celebrate your new career milestone in Pakistan.
                                </p>
                                <ul className="text-sm text-gray-500 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Direct employer contact
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Interview scheduling
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-green-500">✓</span>
                                        Job offer management
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-16">
                        <Link 
                            to={isAuthenticated ? "/jobs" : "/register"}
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                        >
                            <span>{isAuthenticated ? "Browse Jobs" : "Start Your Journey"}</span>
                            <span className="text-2xl">→</span>
                        </Link>
                        <p className="mt-4 text-sm text-gray-500">Join 50,000+ job seekers already using ResuMatch</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
                            Success Stories
                        </h2>
                        <p className="text-lg text-gray-600">
                            Hear from professionals who found their dream jobs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.name}
                                className="card p-8 card-hover"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 italic">
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{testimonial.image}</div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-6 font-display">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Join thousands of professionals finding their dream jobs in Pakistan
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            Create Free Account
                        </Link>
                        <Link
                            to="/jobs"
                            className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
