import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    FiFileText, FiUsers, FiTrendingUp, FiAward, FiBook, FiTarget,
    FiClock, FiArrowRight, FiSearch, FiBookmark
} from 'react-icons/fi';

const CareerAdvice = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'All Topics', icon: FiBook },
        { id: 'resume', name: 'Resume & CV', icon: FiFileText },
        { id: 'interview', name: 'Interview Tips', icon: FiUsers },
        { id: 'career', name: 'Career Growth', icon: FiTrendingUp },
        { id: 'skills', name: 'Skills Development', icon: FiAward }
    ];

    const articles = [
        {
            id: 1,
            title: '10 Tips to Write a Winning Resume in 2024',
            category: 'resume',
            excerpt: 'Learn how to craft a resume that stands out to recruiters and applicant tracking systems.',
            readTime: '8 min read',
            image: '📄',
            author: 'Sarah Johnson',
            date: '2024-01-15'
        },
        {
            id: 2,
            title: 'How to Answer "Tell Me About Yourself" in Interviews',
            category: 'interview',
            excerpt: 'Master the most common interview question with our proven framework and examples.',
            readTime: '6 min read',
            image: '💼',
            author: 'Michael Chen',
            date: '2024-01-12'
        },
        {
            id: 3,
            title: 'Negotiating Your Salary: A Complete Guide',
            category: 'career',
            excerpt: 'Learn strategies to negotiate better compensation packages and maximize your worth.',
            readTime: '12 min read',
            image: '💰',
            author: 'Emma Davis',
            date: '2024-01-10'
        },
        {
            id: 4,
            title: 'Top 10 In-Demand Skills for 2024',
            category: 'skills',
            excerpt: 'Discover the most sought-after skills employers are looking for this year.',
            readTime: '10 min read',
            image: '🎯',
            author: 'David Wilson',
            date: '2024-01-08'
        },
        {
            id: 5,
            title: 'How to Switch Careers Successfully',
            category: 'career',
            excerpt: 'A step-by-step guide to transitioning into a new industry or role.',
            readTime: '15 min read',
            image: '🔄',
            author: 'Lisa Anderson',
            date: '2024-01-05'
        },
        {
            id: 6,
            title: 'Common Interview Mistakes to Avoid',
            category: 'interview',
            excerpt: 'Learn what NOT to do in interviews and how to recover from common pitfalls.',
            readTime: '7 min read',
            image: '⚠️',
            author: 'James Taylor',
            date: '2024-01-03'
        },
        {
            id: 7,
            title: 'Building a Strong LinkedIn Profile',
            category: 'resume',
            excerpt: 'Optimize your LinkedIn to attract recruiters and expand your professional network.',
            readTime: '9 min read',
            image: '🔗',
            author: 'Rachel Green',
            date: '2024-01-01'
        },
        {
            id: 8,
            title: 'Remote Work: Tips for Success',
            category: 'skills',
            excerpt: 'Master remote work with productivity tips, communication strategies, and work-life balance.',
            readTime: '11 min read',
            image: '🏡',
            author: 'Tom Harris',
            date: '2023-12-28'
        },
        {
            id: 9,
            title: 'Following Up After an Interview',
            category: 'interview',
            excerpt: 'Learn the art of following up professionally to stay top-of-mind with employers.',
            readTime: '5 min read',
            image: '📧',
            author: 'Anna Martinez',
            date: '2023-12-25'
        },
        {
            id: 10,
            title: 'Building Your Personal Brand',
            category: 'career',
            excerpt: 'Create a compelling personal brand that sets you apart in your industry.',
            readTime: '13 min read',
            image: '✨',
            author: 'Chris Brown',
            date: '2023-12-22'
        },
        {
            id: 11,
            title: 'Resume Keywords That Get You Hired',
            category: 'resume',
            excerpt: 'Understand ATS systems and optimize your resume with the right keywords.',
            readTime: '8 min read',
            image: '🔑',
            author: 'Sarah Johnson',
            date: '2023-12-20'
        },
        {
            id: 12,
            title: 'Upskilling: Free Online Courses',
            category: 'skills',
            excerpt: 'Discover top platforms offering free courses to boost your skills and resume.',
            readTime: '10 min read',
            image: '📚',
            author: 'David Wilson',
            date: '2023-12-18'
        }
    ];

    const filteredArticles = articles.filter(article => {
        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
        const matchesSearch = searchQuery === '' || 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Career <span className="text-blue-600">Advice</span> & Resources
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        Expert tips and insights to help you succeed in your job search and career growth
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 justify-center mb-12">
                    {categories.map(category => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`
                                    px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2
                                    ${selectedCategory === category.id
                                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
                                    }
                                `}
                            >
                                <Icon size={18} />
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {/* Articles Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredArticles.map(article => (
                        <Link
                            key={article.id}
                            to={`/advice/${article.id}`}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                        >
                            {/* Category Badge & Bookmark */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                                    {categories.find(c => c.id === article.category)?.name}
                                </span>
                                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                    <FiBookmark size={18} />
                                </button>
                            </div>

                            {/* Emoji Icon */}
                            <div className="text-5xl mb-4">
                                {article.image}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {article.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {article.excerpt}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-2">
                                    <FiClock size={14} />
                                    {article.readTime}
                                </div>
                                <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>

                            {/* Author */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-sm text-gray-700 font-medium">
                                    {article.author}
                                </span>
                                <FiArrowRight className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* No Results */}
                {filteredArticles.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No articles match your search</p>
                    </div>
                )}

                {/* CTA Section */}
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-10 text-center text-white">
                    <FiTarget className="mx-auto mb-4" size={48} />
                    <h2 className="text-3xl font-bold mb-4">Ready to take the next step?</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Apply what you've learned and start your job search journey with ResuMatch today
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/jobs"
                            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg inline-flex items-center gap-2"
                        >
                            Browse Jobs
                            <FiArrowRight />
                        </Link>
                        <Link
                            to="/register"
                            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors border-2 border-white"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerAdvice;
