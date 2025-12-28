import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiGrid, FiBriefcase, FiBookmark, FiSettings, FiLogOut } from 'react-icons/fi';

const DashboardSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        {
            icon: FiGrid,
            label: 'Overview',
            path: '/dashboard',
        },
        {
            icon: FiBriefcase,
            label: 'Applied Jobs',
            path: '/applications',
        },
        {
            icon: FiBookmark,
            label: 'Favorite Jobs',
            path: '/jobs/saved',
        },
        {
            icon: FiSettings,
            label: 'Settings',
            path: '/settings',
        },
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <aside className="w-full bg-white h-full flex flex-col shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    CANDIDATE DASHBOARD
                </h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`relative flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200 ${active
                                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    {active && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                                    )}
                                    <item.icon className={`text-xl ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 mt-auto border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 w-full group"
                >
                    <FiLogOut className="text-xl text-red-500 group-hover:translate-x-1 transition-transform" />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
