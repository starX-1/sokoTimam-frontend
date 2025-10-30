'use client'
import { Award, CreditCard, Edit, Heart, Inbox, ShoppingBag, Ticket, Eye, Download, Star, MapPin, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/Footer";
import { signOut } from "next-auth/react";

// --- Profile Sidebar Link Component ---
const ProfileSidebarLink = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-150 cursor-pointer w-full text-left ${
            isActive
                ? 'bg-gray-100 text-orange-600 font-semibold border-r-4 border-orange-600'
                : 'text-gray-700 hover:bg-gray-50'
        }`}
        onClick={onClick}
    >
        <Icon className="w-5 h-5" />
        <span className="text-sm">{label}</span>
    </button>
);

// --- Order Status Badge Component ---
const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
        delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
        processing: { color: 'bg-blue-100 text-blue-800', icon: Clock },
        shipped: { color: 'bg-purple-100 text-purple-800', icon: Truck },
        cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
        pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <IconComponent className="w-3 h-3 mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// --- Order Item Component ---
const OrderItem = ({ item }) => (
    <div className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
        <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
            onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "https://placehold.co/64x64/f3f4f6/6b7280?text=Product"; 
            }}
        />
        <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
            <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
            <p className="text-sm font-semibold text-gray-900">KSH {item.price.toLocaleString()}</p>
        </div>
    </div>
);

// --- Order Card Component ---
const OrderCard = ({ order }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
                <p className="text-sm text-gray-500">Placed on {order.date}</p>
            </div>
            <div className="mt-2 sm:mt-0">
                <OrderStatusBadge status={order.status} />
            </div>
        </div>

        {/* Order Items */}
        <div className="mb-4">
            {order.items.slice(0, 2).map((item, index) => (
                <OrderItem key={index} item={item} />
            ))}
            {order.items.length > 2 && (
                <p className="text-sm text-gray-500 text-center py-2">
                    +{order.items.length - 2} more items
                </p>
            )}
        </div>

        {/* Order Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100">
            <div className="mb-3 sm:mb-0">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-gray-900">KSH {order.total.toLocaleString()}</p>
            </div>
            
            <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                </button>
                {order.status === 'delivered' && (
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition duration-150">
                        <Star className="w-4 h-4 mr-2" />
                        Rate Order
                    </button>
                )}
                <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150">
                    <Download className="w-4 h-4 mr-2" />
                    Invoice
                </button>
            </div>
        </div>
    </div>
);

// --- MyOrders Panel Component ---
const MyOrdersPanel = () => {
    // Mock orders data
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

    const [filter, setFilter] = useState('all');

    const filteredOrders = filter === 'all' 
        ? orders 
        : orders.filter(order => order.status === filter);

    return (
        <div className="space-y-6">
            {/* Orders Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
                    <p className="text-gray-600 mt-1">Manage and track your orders</p>
                </div>
                
                {/* Order Filters */}
                <div className="flex space-x-2 mt-4 sm:mt-0 overflow-x-auto pb-2">
                    {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((filterType) => (
                        <button
                            key={filterType}
                            onClick={() => setFilter(filterType)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition duration-150 ${
                                filter === filterType
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-500 mb-6">
                            {filter === 'all' 
                                ? "You haven't placed any orders yet." 
                                : `No ${filter} orders found.`}
                        </p>
                        <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition duration-150 font-medium">
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>

            {/* Order Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center">
                        <Clock className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                            <p className="text-sm text-blue-600">Processing</p>
                            <p className="text-2xl font-bold text-blue-900">
                                {orders.filter(o => o.status === 'processing').length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                            <p className="text-sm text-green-600">Delivered</p>
                            <p className="text-2xl font-bold text-green-900">
                                {orders.filter(o => o.status === 'delivered').length}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center">
                        <Truck className="w-8 h-8 text-purple-600 mr-3" />
                        <div>
                            <p className="text-sm text-purple-600">Total Orders</p>
                            <p className="text-2xl font-bold text-purple-900">{orders.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Updated Profile Page Component ---
const ProfilePage = ({ onViewChange }) => {
    const [activeTab, setActiveTab] = useState('orders');

    const handleLogout = () => {
        sessionStorage.clear();
        signOut({ callbackUrl: '/login' });
    };

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'orders':
                return <MyOrdersPanel />;
            case 'inbox':
            case 'saved':
            case 'vouchers':
            case 'rewards':
            default:
                return (
                    <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-sm">Content for active tab: **{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}** goes here.</p>
                    </div>
                );
        }
    };

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
                            <ProfileSidebarLink 
                                icon={ShoppingBag} 
                                label="Orders" 
                                isActive={activeTab === 'orders'} 
                                onClick={() => setActiveTab('orders')} 
                            />
                            <ProfileSidebarLink 
                                icon={Inbox} 
                                label="Inbox" 
                                isActive={activeTab === 'inbox'} 
                                onClick={() => setActiveTab('inbox')} 
                            />
                            <ProfileSidebarLink 
                                icon={Heart} 
                                label="Saved Items" 
                                isActive={activeTab === 'saved'} 
                                onClick={() => setActiveTab('saved')} 
                            />
                            <ProfileSidebarLink 
                                icon={Ticket} 
                                label="Vouchers" 
                                isActive={activeTab === 'vouchers'} 
                                onClick={() => setActiveTab('vouchers')} 
                            />
                            <ProfileSidebarLink 
                                icon={Award} 
                                label="Rewards" 
                                isActive={activeTab === 'rewards'} 
                                onClick={() => setActiveTab('rewards')} 
                            />
                        </nav>

                        {/* Back to Login/Home link for convenience */}
                        <div className="mt-8 pt-4 border-t text-sm text-center">
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-orange-600 transition"
                            >
                                ← Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Right Content: Dynamic based on active tab */}
                    <div className="w-full md:w-3/4 p-6 sm:p-8">
                        {activeTab === 'orders' ? (
                            <MyOrdersPanel />
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                </h2>
                                {renderActiveTabContent()}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProfilePage;