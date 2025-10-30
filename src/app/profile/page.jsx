'use client'
import { Award, CreditCard, Edit, Heart, Inbox, ShoppingBag, Ticket, Eye, Download, Star, MapPin, Truck, CheckCircle, Clock, XCircle, User, LogOut, ChevronRight } from "lucide-react";
import { useState } from "react";
import ProfileSidebarLink from "../components/ProfileSidebarLink";
import MyOrdersPanel from "../components/OrdersPanel";
import Header from "../components/header";
import Footer from "../components/Footer";
const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [orders] = useState([
        {
            id: 'ORD-7842',
            date: '2024-01-15',
            status: 'delivered',
            total: 12499,
            items: [
                {
                    name: 'Wireless Bluetooth Headphones',
                    price: 8499,
                    quantity: 1,
                    image: 'https://placehold.co/64x64/3b82f6/ffffff?text=HP'
                },
                {
                    name: 'Phone Case',
                    price: 1500,
                    quantity: 2,
                    image: 'https://placehold.co/64x64/ef4444/ffffff?text=PC'
                }
            ]
        },
        {
            id: 'ORD-7841',
            date: '2024-01-12',
            status: 'shipped',
            total: 4599,
            items: [
                {
                    name: 'Smart Watch',
                    price: 4599,
                    quantity: 1,
                    image: 'https://placehold.co/64x64/10b981/ffffff?text=SW'
                }
            ]
        },
        {
            id: 'ORD-7839',
            date: '2024-01-08',
            status: 'processing',
            total: 7899,
            items: [
                {
                    name: 'Laptop Backpack',
                    price: 2899,
                    quantity: 1,
                    image: 'https://placehold.co/64x64/f59e0b/ffffff?text=BP'
                },
                {
                    name: 'USB-C Cable',
                    price: 1500,
                    quantity: 3,
                    image: 'https://placehold.co/64x64/6b7280/ffffff?text=UC'
                }
            ]
        },
        {
            id: 'ORD-7835',
            date: '2024-01-02',
            status: 'cancelled',
            total: 3299,
            items: [
                {
                    name: 'Wireless Mouse',
                    price: 3299,
                    quantity: 1,
                    image: 'https://placehold.co/64x64/8b5cf6/ffffff?text=WM'
                }
            ]
        }
    ]);

    const handleLogout = () => {
        alert('Logged out successfully');
    };

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'orders':
                return <MyOrdersPanel orders={orders} />;
            case 'inbox':
            case 'saved':
            case 'vouchers':
            case 'rewards':
            default:
                return (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 text-sm">Content for <strong>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</strong> goes here.</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header/>
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-lg font-bold text-gray-800">My Profile</h1>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row max-w-6xl mx-auto">
                {/* Sidebar */}
                <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-1/4 bg-white md:border-r border-gray-200 p-4 md:p-6 md:min-h-screen`}>
                    {/* Profile Header */}
                    <div className="flex flex-col items-center pb-4 mb-4 border-b border-gray-100 md:block">
                        <img
                            src="https://placehold.co/100x100/f97316/ffffff?text=K"
                            alt="User Profile"
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-orange-600 shadow-md mx-auto md:mx-0"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/f97316/ffffff?text=K"; }}
                        />
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mt-3">Kisilu</h3>
                        <p className="text-xs text-gray-500 mt-1">Premium Member</p>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-1">
                        <ProfileSidebarLink
                            icon={User}
                            label="Profile Info"
                            isActive={activeTab === 'profile'}
                            onClick={() => {
                                setActiveTab('profile');
                                setMobileMenuOpen(false);
                            }}
                        />
                        <ProfileSidebarLink
                            icon={ShoppingBag}
                            label="Orders"
                            isActive={activeTab === 'orders'}
                            onClick={() => {
                                setActiveTab('orders');
                                setMobileMenuOpen(false);
                            }}
                        />
                        <ProfileSidebarLink
                            icon={Inbox}
                            label="Inbox"
                            isActive={activeTab === 'inbox'}
                            onClick={() => {
                                setActiveTab('inbox');
                                setMobileMenuOpen(false);
                            }}
                        />
                        <ProfileSidebarLink
                            icon={Heart}
                            label="Saved Items"
                            isActive={activeTab === 'saved'}
                            onClick={() => {
                                setActiveTab('saved');
                                setMobileMenuOpen(false);
                            }}
                        />
                        <ProfileSidebarLink
                            icon={Ticket}
                            label="Vouchers"
                            isActive={activeTab === 'vouchers'}
                            onClick={() => {
                                setActiveTab('vouchers');
                                setMobileMenuOpen(false);
                            }}
                        />
                        <ProfileSidebarLink
                            icon={Award}
                            label="Rewards"
                            isActive={activeTab === 'rewards'}
                            onClick={() => {
                                setActiveTab('rewards');
                                setMobileMenuOpen(false);
                            }}
                        />
                    </nav>

                    {/* Sign Out Button */}
                    <div className="mt-6 pt-4 border-t">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center w-full py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-150 text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-3/4 p-4 md:p-8">
                    <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
                        {activeTab === 'orders' ? (
                            <MyOrdersPanel orders={orders} />
                        ) : (
                            <>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b">
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                </h2>
                                {renderActiveTabContent()}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer/> 
        </div>
    );
};

export default ProfilePage;