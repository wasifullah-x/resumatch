import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 pt-16">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:block lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:z-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Mobile Close Button */}
                    <div className="lg:hidden p-4 flex justify-end border-b border-gray-100">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <DashboardSidebar />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden min-w-0">
                {/* Mobile Menu Trigger */}
                <div className="lg:hidden p-4 pb-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
                    >
                        <FiMenu size={20} />
                        <span className="font-medium">Menu</span>
                    </button>
                </div>

                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
