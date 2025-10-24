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
    CreditCard,
    Plus,
    Globe
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
// Assuming the Shops API is available and works as intended
import Shops from '../../../../api/shop/api'
import Accounts from '../../../../api/bank/api'
import { X, Banknote, Landmark, User, Hash, Code } from 'lucide-react';
import { toast } from "react-toastify";

const EditBankModal = ({ isOpen, onClose, bankDetails, onSave }) => {
    // 1. Initialize component state with the current bankDetails
    const [formData, setFormData] = useState({
        bankName: '',
        accountName: '',
        accountNumber: '',
        branchCode: '',
        swiftCode: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 2. useEffect to update formData when bankDetails changes
    useEffect(() => {
        if (bankDetails) {
            setFormData({
                bankName: bankDetails.bankName || '',
                accountName: bankDetails.accountName || '',
                accountNumber: bankDetails.accountNumber || '',
                branchCode: bankDetails.branchCode || '',
                swiftCode: bankDetails.swiftCode || '',
            });
            setErrors({}); // Clear errors when new details are loaded/modal opens
        }
    }, [bankDetails]);

    // 3. Handler for input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Basic validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.bankName.trim()) {
            newErrors.bankName = 'Bank Name is required';
        }
        if (!formData.accountName.trim()) {
            newErrors.accountName = 'Account Name is required';
        }
        if (!formData.accountNumber.trim()) {
            newErrors.accountNumber = 'Account Number is required';
        } else if (!/^\d+$/.test(formData.accountNumber.trim())) {
            newErrors.accountNumber = 'Account Number must be digits only';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 4. Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Call the onSave prop, passing the updated data
            await onSave(formData);
            // Only close if onSave was successful (assuming it's an async operation)
            onClose();
        } catch (error) {
            // Handle save error if necessary, maybe a toast or setting a global error state
            console.error("Save failed:", error);
            setErrors(prev => ({ ...prev, submit: 'Failed to save changes. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Do not render anything if the modal is not open
    if (!isOpen) {
        return null;
    }

    // 5. Modal Structure (using Tailwind CSS for styling)
    return (
        <div
            className="fixed h-screen inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={onClose} // Close on backdrop click
        >
            <div
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp"
            >
                {/* Modal Header (Orange/White Scheme) */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center">
                        <Banknote className="w-6 h-6 mr-2" />
                        Edit Bank Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/20 rounded-full p-2 transition duration-200"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body with Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6">
                    <div className="space-y-5">
                        {/* Global Error Alert */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                                {errors.submit}
                            </div>
                        )}

                        {/* Bank Name */}
                        <InputField
                            id="bankName"
                            label="Bank Name"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            placeholder="e.g., KCB Bank"
                            icon={Landmark}
                            error={errors.bankName}
                            required
                        />

                        {/* Account Name */}
                        <InputField
                            id="accountName"
                            label="Account Name"
                            name="accountName"
                            value={formData.accountName}
                            onChange={handleChange}
                            placeholder="Name exactly as it appears on the account"
                            icon={User}
                            error={errors.accountName}
                            required
                        />

                        {/* Account Number */}
                        <InputField
                            id="accountNumber"
                            label="Account Number"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            placeholder="Enter account number"
                            icon={Hash}
                            error={errors.accountNumber}
                            required
                            type="number" // Use type number for better mobile input but keep 'text' for non-numeric input validation
                        />

                        {/* Branch Code (Optional) */}
                        <InputField
                            id="branchCode"
                            label="Branch Code (Optional)"
                            name="branchCode"
                            value={formData.branchCode}
                            onChange={handleChange}
                            placeholder="e.g., 01000"
                            icon={Code}
                        />

                        {/* SWIFT Code (Optional) */}
                        {/* <InputField
                            id="swiftCode"
                            label="SWIFT Code (Optional)"
                            name="swiftCode"
                            value={formData.swiftCode}
                            onChange={handleChange}
                            placeholder="e.g., KCBLKENX"
                            icon={Code}
                        /> */}
                    </div>
                </form>

                {/* Action Buttons - Sticky Footer (Gray/Orange Scheme) */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition duration-200 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit} // Call handleSubmit from here to use async/try/finally logic
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-50 flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>

            {/* Animation Styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

// Reusable Input Field Component for clean JSX
const InputField = ({ id, label, name, value, onChange, placeholder, icon: Icon, error, required, type = 'text' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full pl-10 pr-4 py-3 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200`}
                placeholder={placeholder}
            />
        </div>
        {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
    </div>
);

// export default EditBankModal;
// --- SingleShopView Component ---

const SingleShopView = () => {
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const router = useRouter();
    const params = useParams()
    const shopId = params?.id;
    const [sellerBankAccount, setSellerBankAccount] = useState(null);

    // Mock API call to fetch single shop data
    useEffect(() => {
        const fetchShop = async () => {
            try {
                const session = await getSession();
                const shopData = await Shops.getShopById(shopId, session.user.accessToken);
                const bankData = await Accounts.getBySHopId(shopId);
                // console.log('Fetched bank data:', bankData);
                setSellerBankAccount(bankData.data);
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

    // const handleSaveShop = async (id, updatedData) => {
    //     console.log('Attempting to save shop changes for ID:', id, updatedData);

    //     setShop(prev => ({
    //         ...prev,
    //         ...updatedData,
    //         logoUrl: updatedData.logoFile ? 'NEW_MOCK_LOGO_URL' : updatedData.logo,
    //         coverUrl: updatedData.coverFile ? 'NEW_MOCK_COVER_URL' : updatedData.cover,
    //     }));
    //     setIsEditModalOpen(false);
    // };

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
    const actualBankAccount = sellerBankAccount && sellerBankAccount.length > 0 ? sellerBankAccount[0] : null;

    const bankDetails = actualBankAccount ? [
        { label: "Bank Name", value: actualBankAccount.bankName, icon: Building2 },
        { label: "Account Name", value: actualBankAccount.accountName, icon: Users },
        { label: "Account Number", value: actualBankAccount.accountNumber, icon: CreditCard },
        { label: "Branch Code", value: actualBankAccount.branchCode || 'N/A', icon: MapPin },
        // { label: "SWIFT Code", value: actualBankAccount.swiftCode || 'N/A', icon: Globe },
    ] : [];

    console.log('Actual bank account details:', actualBankAccount);
    const handleUpdateBankDetails = async (updatedData) => {
        const response = await Accounts.updateAccount(actualBankAccount.id, updatedData);
        if (response.message === 'Bank account updated') {
            toast.success('Bank details updated successfully!');
            const bankData = await Accounts.getBySHopId(shopId);
            // console.log('Fetched bank data:', bankData);
            setSellerBankAccount(bankData.data);
            
            // setSellerBankAccount([response.data]);
        }
    }

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
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">Products</p>
                                            <p className="text-2xl font-bold text-gray-900">{shop.products?.length || 0}</p>
                                            <p className="text-xs text-gray-600">Listed items</p>
                                        </div>
                                        <button
                                            onClick={
                                                // Handle add product
                                                () => router.push('/sellerDashboard/products/addProduct')
                                                // router.push('/seller/products/add');
                                            }
                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition duration-200 shadow-sm hover:shadow-md"
                                            title="Add New Product"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Add</span>
                                        </button>
                                    </div>
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
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                <CreditCard className="w-6 h-6 mr-2 text-orange-500" />
                                Bank Account Details
                            </h2>
                            <button
                                onClick={() => {
                                    // Handle edit bank details
                                    // console.log('Edit bank details');
                                    setIsEditModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold rounded-lg transition duration-200"
                            >
                                <Edit3 className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit Details</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {bankDetails.map((item, index) => (
                                <DetailCard key={index} icon={item.icon} label={item.label} value={item.value} />
                            ))}
                        </div>
                    </div>

                    {/* edit modal */}
                    <EditBankModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        bankDetails={actualBankAccount}
                        onSave={(updatedData) =>
                            // Handle saving updated bank details
                            handleUpdateBankDetails(updatedData)
                        }
                    />

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
                onClick={() => router.push('/sellerDashboard/shops')}
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