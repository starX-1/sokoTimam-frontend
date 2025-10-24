'use client'
import { Check, MapPin, Search, Store, XCircle, X, Upload, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Shops from '../../api/shop/api'
import sellers from '../../api/seller/api'

// --- Edit Shop Modal Component ---
// import { useState, useEffect } from 'react';
import { Image } from 'lucide-react';

// import React, { useState, useEffect } from 'react';
// Assuming you have these icons imported from a library like 'lucide-react'
import { AlertCircle, BookOpen } from 'lucide-react';

// Mock categories for the Primary Category dropdown
const PRIMARY_CATEGORIES = [
    'Home & Kitchen',
    'Electronics',
    'Fashion & Apparel',
    'Health & Beauty',
    'Sports & Outdoors',
    'Automotive',
    'Toys & Games',
    'Books & Media',
    'Other'
];

const EditShopModal = ({ shop, isOpen, onClose, onSave }) => {
    // 1. Updated formData to match editable fields from your shop data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '', // Mapped from shop.address
        city: '',     // Mapped from shop.city
        postalCode: '', // Mapped from shop.postalCode
        primaryCategory: '', // Mapped from shop.primaryCategory
        status: 'pending', // Mapped from shop.status
        logoUrl: '', // Mapped from shop.logoUrl
    });

    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    // Removed cover-related state (coverFile, coverPreview) as it's not in your data
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 2. Updated useEffect to map new shop properties
    useEffect(() => {
        if (shop) {
            setFormData({
                name: shop.name || '',
                description: shop.description || '',
                address: shop.address || '',
                city: shop.city || '',
                postalCode: shop.postalCode || '',
                primaryCategory: shop.primaryCategory || PRIMARY_CATEGORIES[0], // Use first category as default
                status: shop.status || 'pending',
                logoUrl: shop.logoUrl || '',
            });
            // Use logoUrl from shop data for the initial preview
            setLogoPreview(shop.logoUrl || '');
        }
    }, [shop]);

    // 3. Updated handleChange - remains largely the same, handles all fields in formData
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // 4. handleFileChange is simplified for logo only
    const handleFileChange = (e) => {
        const type = 'logo'; // Only handling logo now
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({
                ...prev,
                [type]: 'Please select a valid image file'
            }));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                [type]: 'File size must be less than 5MB'
            }));
            return;
        }

        // Clear any previous errors
        setErrors(prev => ({ ...prev, [type]: '' }));

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoFile(file);
            setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // 5. removeImage is simplified for logo only
    const removeImage = () => {
        setLogoFile(null);
        setLogoPreview('');
        setFormData(prev => ({ ...prev, logoUrl: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Shop name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 6. handleSubmit updated to reflect the new data structure
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data to send - only send editable fields
            const submitData = {
                name: formData.name,
                description: formData.description,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                primaryCategory: formData.primaryCategory,
                status: formData.status,
                logoFile: logoFile, // This is the actual File object
                logoUrl: formData.logoUrl, // Keep existing URL if no new file
            };

            console.log('Submit Data:', submitData);

            await onSave(shop.id, submitData);
            onClose();
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: 'Failed to save changes. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    // Helper function to get status badge style
    const getStatusStyle = (status) => {
        switch (status) {
            case 'active':
                return 'text-green-700 bg-green-100 border-green-200';
            case 'pending':
                return 'text-yellow-700 bg-yellow-100 border-yellow-200';
            case 'suspended':
                return 'text-red-700 bg-red-100 border-red-200';
            default:
                return 'text-gray-700 bg-gray-100 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold">Edit Shop Details</h3>
                        <p className="text-orange-100 text-sm mt-1">Update your shop information</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/20 rounded-full p-2 transition duration-200"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                    <div className="p-6 space-y-6">
                        {/* Error Alert */}
                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700 text-sm">{errors.submit}</p>
                            </div>
                        )}

                        {/* Shop Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Shop Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200`}
                                    placeholder="Enter shop name"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className={`w-full px-4 py-3 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 resize-none`}
                                placeholder="Describe your shop and what makes it special..."
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.description ? (
                                    <p className="text-red-500 text-xs">{errors.description}</p>
                                ) : (
                                    <p className="text-gray-500 text-xs">Minimum 10 characters</p>
                                )}
                                <p className="text-gray-400 text-xs">{formData.description.length} characters</p>
                            </div>
                        </div>

                        {/* --- Location Group (Address, City, Postal Code) --- */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Address */}
                            <div className="md:col-span-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Shop Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200`}
                                        placeholder="E.g., 123 Main Street"
                                    />
                                </div>
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                )}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border ${errors.city ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:outline-none text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200`}
                                    placeholder="City"
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                                )}
                            </div>

                            {/* Postal Code */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode || ''} // Handle null postalCode
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                                    placeholder="e.g., 00100"
                                />
                            </div>

                            {/* Primary Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Primary Category
                                </label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    <select
                                        name="primaryCategory"
                                        value={formData.primaryCategory}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 bg-white cursor-pointer appearance-none"
                                    >
                                        {PRIMARY_CATEGORIES.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* --- END Location Group --- */}

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Shop Status (only admin can change)
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none text-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200 bg-white cursor-pointer"
                                disabled
                            >
                                <option value="active">✓ Active - Shop is live</option>
                                <option value="pending">⏳ Pending - Awaiting approval</option>
                                <option value="suspended">⚠ Suspended - Temporarily disabled</option>
                            </select>
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Shop Logo
                            </label>
                            <div className="space-y-3">
                                <div className={`relative border-2 border-dashed ${errors.logo ? 'border-red-300' : 'border-gray-300'} rounded-xl p-4 hover:border-orange-400 transition duration-200`}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        id="logo-upload"
                                    />
                                    <div className="text-center">
                                        <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                            <label htmlFor="logo-upload" className="text-orange-500 font-semibold cursor-pointer hover:text-orange-600">
                                                Click to upload
                                            </label> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                </div>
                                {errors.logo && (
                                    <p className="text-red-500 text-xs">{errors.logo}</p>
                                )}
                                {logoPreview && (
                                    <div className="relative flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                        <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {logoFile ? 'New Logo Preview' : 'Current Logo'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {logoFile ? 'Image ready to upload' : 'Will use current logo unless changed'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="p-2 hover:bg-red-100 rounded-lg transition duration-200"
                                            aria-label="Remove logo"
                                        >
                                            <X className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Removed Cover Upload section */}

                        {/* Shop Info Summary */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
                            <h4 className="text-sm font-bold text-orange-900 mb-3 flex items-center">
                                <Check className="w-4 h-4 mr-2" />
                                Current Shop & Seller Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600 font-medium mb-1">Seller Name</p>
                                    <p className="text-gray-900 font-semibold">{shop?.seller?.fullname || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium mb-1">Seller Email</p>
                                    <p className="text-gray-900 font-semibold">{shop?.seller?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium mb-1">Products Count</p>
                                    <p className="text-gray-900 font-semibold">{shop?.products?.length || 0}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium mb-1">Status</p>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(shop?.status)} border`}>
                                        {shop?.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Sticky Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                </form>
            </div>

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
// export default EditShopModal; // Uncomment this if it's the only export

// --- Main Shops View Component ---
const ShopsView = () => {
    const [shops, setShops] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [seller, setSeller] = useState(null);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const sellerSession = await getSession();
                // get sellerData from session storage
                const sellerData = JSON.parse(sessionStorage.getItem('sellerData'));
                setSeller(sellerData);
                const res = await sellers.getAllMyShops(sellerData.id, sellerSession.user.accessToken);
                // const res = await Shops.getAllShops(sellerSession.user.accessToken);
                console.log(res);
                setShops(res.shops);
            } catch (error) {
                console.log(error);
            }
        }
        fetchShops();
    }, []);

    const router = useRouter();

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'text-green-700 bg-green-100';
            case 'pending':
                return 'text-yellow-700 bg-yellow-100';
            case 'suspended':
                return 'text-red-700 bg-red-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };

    // function to handle search and status filter
    // const handleSearchAndFilter = () => {
    //     const filteredShops = shops.filter(shop => {
    //         const shopName = shop.name.toLowerCase();
    //         const shopStatus = shop.status.toLowerCase();
    //         return (
    //             shopName.includes(searchTerm.toLowerCase()) &&
    //             (statusFilter === 'All Statuses' || shopStatus === statusFilter.toLowerCase())
    //         );
    //     });
    //     setShops(filteredShops);
    // };

    const handleEditClick = (shop) => {
        setSelectedShop(shop);
        setIsEditModalOpen(true);
    };

    const handleSaveShop = async (shopId, updatedData) => {
        try {
            const sellerSession = await getSession();

            // Create FormData for file upload
            const formData = new FormData();

            // Append all text fields
            formData.append('name', updatedData.name);
            formData.append('description', updatedData.description);
            formData.append('address', updatedData.address);
            formData.append('city', updatedData.city);
            formData.append('postalCode', updatedData.postalCode || '');
            formData.append('primaryCategory', updatedData.primaryCategory);
            formData.append('status', updatedData.status);

            // Append logo file if a new one was selected
            if (updatedData.logoFile) {
                formData.append('logo', updatedData.logoFile);
            }

            // Call your API to update the shop
            const res = await Shops.updateShop(shopId, formData, sellerSession.user.accessToken);

            console.log(res);

            // Refetch shops using the correct API call
            const res2 = await sellers.getAllMyShops(seller.id, sellerSession.user.accessToken);
            setShops(res2.shops);

            setIsEditModalOpen(false);
            console.log('Shop updated:', shopId, updatedData);
        } catch (error) {
            console.error('Error updating shop:', error);
            // Optionally show error toast/message to user
        }
    };

    const filteredShops = shops.filter(shop => {
        const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shop.owner?.firstname?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All Statuses' ||
            shop.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    // console.log(seller)
    const handleViewClick = (shop) => {
        router.push(`/sellerDashboard/shops/view/${shop.id}`);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-3xl font-bold text-gray-800">Shop Management</h2>
                {/* <button
                    onClick={() => router.push('/adminDashboard/shops/addShop')}
                    className="mt-4 sm:mt-0 bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-orange-700 transition duration-200"
                >
                    + Add New Shop
                </button> */}
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                {/* Search and Filter Bar */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by shop name or owner..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-800 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-auto py-2 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-800 focus:ring-orange-500 focus:border-orange-500"
                    >
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>Pending</option>
                        <option>Suspended</option>
                    </select>
                </div>

                {/* Shops Table */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredShops.map((shop) => (
                            <tr key={shop.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex items-center space-x-2">
                                        <img src={shop.logoUrl} alt="Shop Logo" className="w-8 h-8 rounded-full" />
                                        <span>{shop.name}</span>
                                    </div>
                                    {shop.location && (
                                        <p className="text-xs text-gray-500 flex items-center mt-1">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {shop.location}
                                        </p>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {seller.fullname}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{shop?.products?.length || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(shop.status)}`}>
                                        {shop.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {shop.verified ? (
                                        <Check className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-400" />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEditClick(shop)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-150"
                                    >
                                        Edit
                                    </button>
                                    <button className="text-red-600 hover:text-red-900 transition duration-150">Delete</button>
                                    <button onClick={() => handleViewClick(shop)} className="ml-3 text-green-600 hover:text-green-900 transition duration-150">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center p-4">
                <div className="text-sm text-gray-500">
                    Showing 1 to {filteredShops.length} of {filteredShops.length} results
                </div>
            </div>

            {/* Edit Modal */}
            <EditShopModal
                shop={selectedShop}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveShop}
            />
        </div>
    );
};

export default ShopsView;