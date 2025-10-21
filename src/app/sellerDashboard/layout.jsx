'use client'
import Header from '../components/AdminDashboardHeader.jsx'
import SideBar from '../components/sellerSideBar.jsx'
import { useState } from 'react';

const AdminDashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock data for the cards

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar (visible on large screens, toggled on mobile) */}
            <SideBar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Overlay for mobile view when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Header setIsSidebarOpen={setIsSidebarOpen} />

                {/* Content */}
                <main className="flex-1 p-4 sm:p-6 pb-10">
                    {children ? children : defaultChildren}
                </main>
            </div>
        </div>
    );
};

// Since this is a standalone component for preview, we export it as App
export default AdminDashboardLayout;