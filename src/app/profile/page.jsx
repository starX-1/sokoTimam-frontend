'use client'
import { Award, CreditCard, Edit, Heart, Inbox, ShoppingBag, Ticket } from "lucide-react";
import { useState } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/Footer";
import { Sign } from "crypto";
import { signOut } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";

// --- Profile Sidebar Link Component ---
const ProfileSidebarLink = ({ icon: Icon, label, isActive }) => (
    <a
        href="#"
        className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-150 cursor-pointer ${isActive
            ? 'bg-gray-100 text-orange-600 font-semibold border-r-4 border-orange-600'
            : 'text-gray-700 hover:bg-gray-50'
            }`}
    >
        <Icon className="w-5 h-5" />
        <span className="text-sm">{label}</span>
    </a>
);



// --- New Profile Page Component ---
const ProfilePage = ({ onViewChange }) => {

    const [activeTab, setActiveTab] = useState('overview'); // State for active tab
    const handleLogout = () => {
        // clear sessionStorage
        sessionStorage.clear();
        signOut({ callbackUrl: '/login' });
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                    {/* Left Sidebar: Profile Info and Navigation */}
                    <div className="w-full md:w-1/4 p-6 border-b md:border-b-0 md:border-r border-gray-100 bg-white flex flex-col">

                        {/* Profile Header */}
                        <div className="flex flex-col items-center pb-4 mb-4 border-b border-gray-100">
                            <img
                                src="https://placehold.co/100x100/f97316/ffffff?text=K"
                                alt="User Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-orange-600 shadow-md"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/f97316/ffffff?text=K"; }}
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mt-3">Kisilu</h3>
                        </div>

                        {/* Navigation Links */}
                        <nav className="space-y-1">
                            <ProfileSidebarLink icon={ShoppingBag} label="Orders" isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                            <ProfileSidebarLink icon={Inbox} label="Inbox" isActive={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} />
                            <ProfileSidebarLink icon={Heart} label="Saved Items" isActive={activeTab === 'saved'} onClick={() => setActiveTab('saved')} />
                            <ProfileSidebarLink icon={Ticket} label="Vouchers" isActive={activeTab === 'vouchers'} onClick={() => setActiveTab('vouchers')} />
                            <ProfileSidebarLink icon={Award} label="Rewards" isActive={activeTab === 'rewards'} onClick={() => setActiveTab('rewards')} />
                        </nav>

                        {/* Back to Login/Home link for convenience */}
                        <div className="mt-8 pt-4 border-t text-sm text-center">
                            <a
                                href="#"
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-orange-600 transition"
                            >
                                ← Sign Out
                            </a>

                        </div>
                    </div>

                    {/* Right Content: Account Overview */}
                    <div className="w-full md:w-3/4 p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Account Overview</h2>

                        {/* Account Details & Shipping Address */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Account Details Card */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-700 mb-3">Account Details</h3>
                                <p className="text-gray-800 font-medium">Kenneth Kisilu</p>
                                <p className="text-sm text-gray-500 mb-4">kkisilu@biztimamventures.com</p>
                                <button className="flex items-center text-orange-600 text-xs font-semibold hover:opacity-80 transition">
                                    <Edit className="w-3 h-3 mr-1" /> EDIT
                                </button>
                            </div>

                            {/* Shipping Address Card */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-gray-700 mb-3">Shipping Address</h3>
                                <p className="text-gray-800 font-medium">Building 23, Equity Stage, Kasarani</p>
                                <button className="flex items-center text-orange-600 text-xs font-semibold hover:opacity-80 transition mt-4">
                                    <Edit className="w-3 h-3 mr-1" /> EDIT
                                </button>
                            </div>

                            {/* Store Credit Card */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm lg:col-span-1">
                                <h3 className="text-base font-semibold text-gray-700 mb-3">Store Credit</h3>
                                <div className="flex items-center space-x-3">
                                    <CreditCard className="w-7 h-7 text-blue-600" />
                                    <span className="text-xl font-bold text-gray-800">KSH 0.00</span>
                                </div>
                            </div>

                        </div>

                        {/* Placeholder for more content based on activeTab */}
                        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-sm">Content for active tab: **{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}** goes here.</p>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProfilePage;