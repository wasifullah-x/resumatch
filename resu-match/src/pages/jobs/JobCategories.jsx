import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiCode, FiBriefcase, FiTrendingUp, FiHeart, FiBook, FiDollarSign,
    FiLayers, FiTarget, FiUsers, FiSettings, FiShoppingBag, FiGrid,
    FiArrowRight, FiSearch
} from 'react-icons/fi';

const JobCategories = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        {
            id: 'technology',
            name: 'Technology & IT',
            icon: FiCode,
            color: 'blue',
            jobCount: 1245,
            description: 'Software development, cybersecurity, data science, and IT infrastructure'
        },
        {
            id: 'business',
            name: 'Business & Finance',
            icon: FiBriefcase,
            color: 'green',
            jobCount: 892,
            description: 'Accounting, financial analysis, banking, and business consulting'
        },
        {
            id: 'marketing',
            name: 'Marketing & Sales',
            icon: FiTrendingUp,
            color: 'purple',
            jobCount: 673,
            description: 'Digital marketing, SEO, sales management, and brand strategy'
        },
        {
            id: 'healthcare',
            name: 'Healthcare & Medical',
            icon: FiHeart,
            color: 'red',
            jobCount: 543,
            description: 'Nursing, medical research, pharmacy, and healthcare administration'
        },
        {
            id: 'education',
            name: 'Education & Training',
            icon: FiBook,
            color: 'orange',
            jobCount: 421,
            description: 'Teaching, academic research, curriculum development, and training'
        },
        {
            id: 'design',
            name: 'Design & Creative',
            icon: FiLayers,
            color: 'pink',
            jobCount: 387,
            description: 'UI/UX design, graphic design, video editing, and creative direction'
        },
        {
            id: 'engineering',
            name: 'Engineering',
            icon: FiSettings,
            color: 'indigo',
            jobCount: 612,
            description: 'Mechanical, electrical, civil engineering, and industrial design'
        },
        {
            id: 'hr',
            name: 'Human Resources',
            icon: FiUsers,
            color: 'teal',
            jobCount: 298,
            description: 'Talent acquisition, employee relations, benefits, and training'
        },
        {
            id: 'operations',
            name: 'Operations & Logistics',
            icon: FiTarget,
            color: 'yellow',
            jobCount: 456,
            description: 'Supply chain, logistics, operations management, and process optimization'
        },
        {
            id: 'retail',
            name: 'Retail & Ecommerce',
            icon: FiShoppingBag,
            color: 'cyan',
            jobCount: 534,
            description: 'Store management, merchandising, customer service, and online retail'
        },
        {
            id: 'finance',
            name: 'Investment & Banking',
            icon: FiDollarSign,
            color: 'emerald',
            jobCount: 289,
            description: 'Investment banking, wealth management, trading, and portfolio management'
        },
        {
            id: 'other',
            name: 'Other Categories',
            icon: FiGrid,
            color: 'gray',
            jobCount: 723,
            description: 'Legal, real estate, construction, hospitality, and more'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
            green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
            purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
            red: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
            orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
            pink: 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100',
            indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100',
            teal: 'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100',
            yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100',
            cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200 hover:bg-cyan-100',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100',
            gray: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
        };
        return colors[color] || colors.gray;
    };

    const handleCategoryClick = (categoryId) => {
        navigate(`/jobs?industry=${categoryId}`);
    };

    const filteredCategories = categories.filter(cat =>
        searchQuery === '' || 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Browse Jobs by <span className="text-blue-600">Category</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        Explore opportunities across diverse industries and find the perfect role that matches your expertise
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={`
                                    text-left p-6 rounded-xl border-2 transition-all duration-300 
                                    hover:shadow-xl hover:scale-105 cursor-pointer group
                                    ${getColorClasses(category.color)}
                                `}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${getColorClasses(category.color).split(' ')[0]} shadow-sm`}>
                                        <Icon size={28} />
                                    </div>
                                    <FiArrowRight 
                                        className="opacity-0 group-hover:opacity-100 transition-opacity" 
                                        size={24} 
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {category.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-700">
                                        {category.jobCount.toLocaleString()} jobs available
                                    </span>
                                    <div className="px-3 py-1 bg-white rounded-full text-xs font-medium shadow-sm">
                                        View All
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* No Results */}
                {filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No categories match your search</p>
                    </div>
                )}

                {/* CTA Section */}
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-10 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Browse all jobs or set up job alerts to get notified when new opportunities match your preferences
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => navigate('/jobs')}
                            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                        >
                            Browse All Jobs
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors border-2 border-white"
                        >
                            Set Job Alerts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCategories;
