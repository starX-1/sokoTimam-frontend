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
    AlertCircle,
    Building2,
    CreditCard
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
// Assuming the Shops API is available and works as intended
import Shops from '../../../../api/shop/api'

// --- SingleShopView Component ---

const SingleShopView = () => {
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const router = useRouter();
    const params = useParams()
    const shopId = params?.id;

    // Mock API call to fetch single shop data
    useEffect(() => {
        const fetchShop = async () => {
            try {
                const session = await getSession();
                const shopData = await Shops.getShopById(shopId, session.user.accessToken);
                setShop(shopData.shop);
            } catch (error) {
                console.error('Failed to fetch shop:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchShop();
    }, [shopId]);

    console.log('Fetched shop data:', shop);

    const handleSaveShop = async (id, updatedData) => {
        console.log('Attempting to save shop changes for ID:', id, updatedData);

        setShop(prev => ({
            ...prev,
            ...updatedData,
            logoUrl: updatedData.logoFile ? 'NEW_MOCK_LOGO_URL' : updatedData.logo,
            coverUrl: updatedData.coverFile ? 'NEW_MOCK_COVER_URL' : updatedData.cover,
        }));
        setIsEditModalOpen(false);
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
        { label: "Full Name", value: shop.seller?.fullname, icon: Users },
        { label: "Email", value: shop.seller?.email, icon: Mail },
        { label: "Phone", value: shop.seller?.phone, icon: Phone },
        { label: "Seller ID", value: `#${shop.seller?.id}`, icon: Store },
    ];

    // Bank details
    const bankDetails = [
        { label: "Bank Name", value: shop.seller?.bankAccount?.bankName || 'N/A', icon: Building2 },
        { label: "Account Number", value: shop.seller?.bankAccount?.accountNumber || 'N/A', icon: CreditCard },
        { label: "Account Name", value: shop.seller?.bankAccount?.accountName || 'N/A', icon: Users },
        { label: "Branch Code", value: shop.seller?.bankAccount?.branchCode || 'N/A', icon: Tag },
    ];

    return (
        <div className="space-y-8 p-4 md:p-8">
            {/* Header & Cover Image */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Gradient Header Background */}
                <div className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 h-32 sm:h-40">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    {/* Decorative circles */}
                    <div className="absolute top-4 right-8 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-2 left-12 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl"></div>
                </div>

                {/* Shop Info Card */}
                <div className="p-6 sm:p-8 relative">
                    {/* Logo - positioned to overlap the gradient */}
                    <div className="absolute -top-16 left-6 sm:left-8">
                        <img
                            src={shop.logoUrl || 'https://via.placeholder.com/100?text=Logo'}
                            alt={`${shop.name} logo`}
                            className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl border-4 border-white shadow-xl bg-white ring-4 ring-orange-100"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100?text=Logo'; }}
                        />
                    </div>

                    {/* Content with proper spacing for the logo */}
                    <div className="pt-16 sm:pt-20">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            {/* Shop Name and Status */}
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                                        {shop.name}
                                    </h1>
                                    <span className={`px-3 py-1 text-xs font-bold tracking-wide rounded-full border-2 shadow-sm uppercase ${getStatusStyles(shop.status)}`}>
                                        {shop.status}
                                    </span>
                                </div>
                                {/* Quick Stats under name */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                        <Store className="w-4 h-4 mr-1.5 text-orange-500" />
                                        {shop.primaryCategory}
                                    </span>
                                    <span className="flex items-center">
                                        <Package className="w-4 h-4 mr-1.5 text-orange-500" />
                                        {shop.products?.length || 0} Products
                                    </span>
                                </div>
                            </div>

                            {/* Verification Badge */}
                            <div className="flex items-center gap-3">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm shadow-sm ${shop.verified
                                    ? 'bg-green-50 text-green-700 border-2 border-green-200'
                                    : 'bg-red-50 text-red-700 border-2 border-red-200'
                                    }`}>
                                    {shop.verified ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            <span>Verified Shop</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-5 h-5" />
                                            <span>Unverified</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="mt-6 text-gray-700 leading-relaxed max-w-4xl text-base">
                            {shop.description}
                        </p>

                        {/* Info Cards Grid */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Location Card */}
                            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                <div className="p-2 bg-orange-500 rounded-lg">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-orange-900 uppercase tracking-wide mb-1">Location</p>
                                    <p className="text-sm font-bold text-gray-900 truncate">{shop.city}</p>
                                    <p className="text-xs text-gray-600 truncate">{shop.address}</p>
                                    {shop.postalCode && (
                                        <p className="text-xs text-gray-500 mt-0.5">{shop.postalCode}</p>
                                    )}
                                </div>
                            </div>

                            {/* Products Card */}
                            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">Products</p>
                                    <p className="text-2xl font-bold text-gray-900">{shop.products?.length || 0}</p>
                                    <p className="text-xs text-gray-600">Listed items</p>
                                </div>
                            </div>

                            {/* Join Date Card */}
                            <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                <div className="p-2 bg-purple-500 rounded-lg">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-purple-900 uppercase tracking-wide mb-1">Member Since</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {new Date(shop.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {Math.floor((Date.now() - new Date(shop.createdAt)) / (1000 * 60 * 60 * 24))} days
                                    </p>
                                </div>
                            </div>
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

                    {/* Bank Details Section */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <CreditCard className="w-6 h-6 mr-2 text-orange-500" />
                            Bank Account Details
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {bankDetails.map((item, index) => (
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

export default SingleShopView;