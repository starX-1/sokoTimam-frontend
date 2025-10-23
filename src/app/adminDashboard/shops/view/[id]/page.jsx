'use client'
import {
    MapPin,
    Store,
    Check,
    XCircle,
    Package,
    Users,
    Mail,
    Phone,
    Briefcase,
    Tag,
    Clock,
    DollarSign,
    Edit3,
    AlertCircle
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
// Assuming the Shops API is available and works as intended
import Shops from '../../../../api/shop/api' 

// --- Dummy Shop Data for Single View Demonstration ---
// Using the data from your prompt's Array[0]
const dummyShop = {
    address: "1234 kinoo",
    businessRegistrationNumber: null,
    businessType: "partnership",
    city: "nairobi",
    createdAt: "2025-10-15T19:19:40.447Z",
    description: "charles shop is a good shop for all your electronics needs. We offer a wide range of products from top brands and excellent customer service. Come visit us!",
    expectedMonthlyOrders: 500,
    id: 34,
    kraPin: "A0123456Z",
    logoUrl: "https://res.cloudinary.com/dlv6jnahg/image/upload/v1760555978/shops/6e336f507480ffc47ae8f35fa7262c1e_dfvntz.jpg",
    // Adding a mock coverUrl for a better single-page view
    coverUrl: "https://images.unsplash.com/photo-1528643501716-e5c92477582c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "charles shop",
    orderItems: [], // Mock data assumes empty
    postalCode: "00100", // Added mock postal code
    primaryCategory: "electronics",
    products: [{ id: 1, name: 'Laptop' }, { id: 2, name: 'Phone' }], // Mock products
    seller: {
        id: 2,
        userId: 12,
        fullname: 'Richard Kyalo',
        email: 'kyalorichardm123@gmail.com',
        phone: '0712345678',
        // Mock seller data
        // ... more seller details
    },
    sellerId: 2,
    status: "active", // Changed status for better display
    taxId: "1234",
    updatedAt: "2025-10-23T10:00:00.000Z",
    verified: true, // Mock verified status
};

// --- SingleShopView Component ---

const SingleShopView = () => {
    // In a real application, you'd fetch the shop data using shopId here.
    // For this demonstration, we'll use the dummy data.
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const router = useRouter();
    const params = useParams()
    const shopId = params?.id;


    // Mock API call to fetch single shop data
    useEffect(() => {
        const fetchShop = async () => {
            // In a real scenario, replace this with:
            // /*
            try {
                const session = await getSession();
                const shopData = await Shops.getShopById(shopId, session.user.accessToken);
                setShop(shopData.shop);
            } catch (error) {
                console.error('Failed to fetch shop:', error);
            } finally {
                setLoading(false);
            }
            // */
            // Mock fetching delay
            // await new Promise(resolve => setTimeout(resolve, 500));
            // Find the shop if you were using the array, or just use the dummy one
            // setShop(dummyShop);
            // setLoading(false);
        };

        fetchShop();
    }, [shopId]);

    console.log('Fetched shop data:', shop);
    const handleSaveShop = async (id, updatedData) => {
        // Implement the logic to save the updated shop data here.
        // This is where you'd call Shops.updateShop(id, updatedData, token);
        console.log('Attempting to save shop changes for ID:', id, updatedData);

        // Mock success update for local state
        setShop(prev => ({
            ...prev,
            ...updatedData,
            // Update the logoUrl/coverUrl if new files were uploaded and processed
            logoUrl: updatedData.logoFile ? 'NEW_MOCK_LOGO_URL' : updatedData.logo,
            coverUrl: updatedData.coverFile ? 'NEW_MOCK_COVER_URL' : updatedData.cover,
        }));
        setIsEditModalOpen(false);
        // You would likely re-fetch the shop data here to ensure consistency
        // e.g., fetchShop(); 
    };


    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'text-green-700 bg-green-100 border-green-300';
            case 'pending':
                return 'text-yellow-700 bg-yellow-100 border-yellow-300';
            case 'suspended':
                return 'text-red-700 bg-red-100 border-red-300';
            default:
                return 'text-gray-700 bg-gray-100 border-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-xl text-orange-500 font-semibold animate-pulse">Loading shop details...</p>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="text-center p-10 bg-red-50 border border-red-200 rounded-xl m-6">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-red-800">Shop Not Found</h3>
                <p className="text-red-600 mt-2">The shop with ID **#{shopId}** could not be loaded or does not exist.</p>
                <button
                    onClick={() => router.push('/adminDashboard/shops')}
                    className="mt-4 text-orange-600 hover:text-orange-700 transition duration-200"
                >
                    &larr; Back to Shops List
                </button>
            </div>
        );
    }

    // Prepare shop info for display
    const businessDetails = [
        { label: "Business Type", value: shop.businessType, icon: Briefcase },
        { label: "Primary Category", value: shop.primaryCategory, icon: Tag },
        { label: "KRA PIN", value: shop.kraPin || 'N/A', icon: Check },
        { label: "Tax ID", value: shop.taxId || 'N/A', icon: DollarSign },
        { label: "Reg. Number", value: shop.businessRegistrationNumber || 'N/A', icon: Briefcase },
    ];

    const ownerDetails = [
        { label: "Full Name", value: shop.seller.fullname, icon: Users },
        { label: "Email", value: shop.seller.email, icon: Mail },
        { label: "Phone", value: shop.seller.phone, icon: Phone },
        { label: "Seller ID", value: `#${shop.seller.id}`, icon: Store },
    ];


    return (
        <div className="space-y-8 p-4 md:p-8">
            {/* Header & Cover Image */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Cover Image */}
                <div className="relative h-48 sm:h-64 bg-gray-200">
                    <img
                        src={shop.coverUrl || 'https://via.placeholder.com/1200x400?text=Shop+Cover+Image'}
                        alt={`${shop.name} cover`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/1200x400?text=No+Cover+Image'; }}
                    />
                    {/* Edit Button */}
                    {/* <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="absolute top-4 right-4 bg-white text-orange-600 p-2 rounded-full shadow-lg hover:bg-orange-50 transition duration-200 flex items-center text-sm font-semibold"
                    >
                        <Edit3 className="w-4 h-4 mr-1" /> Edit Shop
                    </button> */}
                </div>

                {/* Shop Info Card */}
                <div className="p-6 sm:p-8 relative">
                    {/* Logo */}
                    <img
                        src={shop.logoUrl || 'https://via.placeholder.com/100?text=Logo'}
                        alt={`${shop.name} logo`}
                        className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md absolute -top-12 left-6 sm:left-8 bg-white"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100?text=Logo'; }}
                    />

                    <div className="pt-14 sm:pt-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight flex items-center">
                                {shop.name}
                                <span className="ml-3 px-3 py-1 text-sm font-bold tracking-wide rounded-full border shadow-sm uppercase cursor-default"
                                    title={`Status: ${shop.status}`}
                                    style={{
                                        color: getStatusStyles(shop.status).split(' ')[0].replace('text-', '#'),
                                        backgroundColor: getStatusStyles(shop.status).split(' ')[1].replace('bg-', '#'),
                                        borderColor: getStatusStyles(shop.status).split(' ')[2].replace('border-', '#'),
                                    }}
                                >
                                    {shop.status}
                                </span>
                            </h1>
                            <div className="mt-3 sm:mt-0 flex items-center space-x-4">
                                <span className={`flex items-center text-sm font-semibold ${shop.verified ? 'text-green-600' : 'text-red-500'}`}>
                                    {shop.verified ? <Check className="w-5 h-5 mr-1" /> : <XCircle className="w-5 h-5 mr-1" />}
                                    {shop.verified ? 'Verified' : 'Unverified'}
                                </span>
                            </div>
                        </div>

                        <p className="mt-4 text-gray-700 leading-relaxed max-w-3xl">
                            {shop.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-gray-600">
                            <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                                **{shop.address}, {shop.city}** ({shop.postalCode || 'N/A'})
                            </span>
                            <span className="flex items-center">
                                <Package className="w-4 h-4 mr-2 text-orange-500" />
                                **{shop.products?.length || 0} Products** Listed
                            </span>
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-orange-500" />
                                Joined: **{new Date(shop.createdAt).toLocaleDateString()}**
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Business and Owner Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Business Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <Briefcase className="w-6 h-6 mr-2 text-orange-500" />
                            Business Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {businessDetails.map((item, index) => (
                                <DetailCard key={index} icon={item.icon} label={item.label} value={item.value} />
                            ))}
                        </div>
                    </div>

                    {/* Orders & Products Summary */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <Package className="w-6 h-6 mr-2 text-orange-500" />
                            Performance Snapshot
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <PerformanceMetric label="Total Products" value={shop.products?.length || 0} color="blue" />
                            <PerformanceMetric label="Expected Monthly Orders" value={shop.expectedMonthlyOrders} color="green" />
                            <PerformanceMetric label="Total Orders" value={shop.orderItems?.length || 0} color="purple" />
                        </div>
                    </div>
                </div>

                {/* Owner Details (Sidebar) */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg border border-orange-200">
                        <h2 className="text-2xl font-bold text-orange-900 mb-4 flex items-center">
                            <Users className="w-6 h-6 mr-2" />
                            Shop Owner
                        </h2>
                        <div className="space-y-4">
                            {ownerDetails.map((item, index) => (
                                <DetailCard key={index} icon={item.icon} label={item.label} value={item.value} isOwner={true} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Editing */}
            {/* <EditShopModal
                shop={shop}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveShop}
            /> */}

            <button
                onClick={() => router.push('/adminDashboard/shops')}
                className="text-orange-600 hover:text-orange-700 transition duration-200 text-lg font-semibold mt-8 flex items-center"
            >
                <span className="text-2xl mr-2">&larr;</span> Back to Shops List
            </button>
        </div>
    );
};

// --- Helper Components for SingleShopView ---

const DetailCard = ({ icon: Icon, label, value, isOwner = false }) => (
    <div className={`p-4 rounded-lg ${isOwner ? 'bg-white border border-orange-200' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex items-center space-x-3">
            <Icon className={`w-5 h-5 ${isOwner ? 'text-orange-500' : 'text-gray-500'}`} />
            <span className="text-xs font-medium uppercase text-gray-500">{label}</span>
        </div>
        <p className={`mt-1 text-lg font-semibold ${isOwner ? 'text-orange-900' : 'text-gray-800'} break-words`}>{value}</p>
    </div>
);

const PerformanceMetric = ({ label, value, color }) => {
    let style = '';
    switch (color) {
        case 'blue': style = 'bg-blue-100 text-blue-800'; break;
        case 'green': style = 'bg-green-100 text-green-800'; break;
        case 'purple': style = 'bg-purple-100 text-purple-800'; break;
        default: style = 'bg-gray-100 text-gray-800';
    }
    return (
        <div className={`p-4 rounded-xl ${style} border-2 border-dashed border-opacity-50`}>
            <p className="text-sm font-medium opacity-80">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
    );
};

// --- Export the component ---
export default SingleShopView;

// NOTE: The EditShopModal component from your prompt is assumed to be available. 
// For a complete runnable example, you'd place this component in a file like: 
// src/app/adminDashboard/shops/[shopId]/page.jsx