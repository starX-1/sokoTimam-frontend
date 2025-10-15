'use client'
import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, Store, User, FileText, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import Users from '../api/user/api'
import auth from '../api/authenticate'
import sellers from '../api/seller/api'
import Shops from '../api/shop/api'
import { toast } from 'react-toastify';


const SellerOnboarding = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [disabled, setDisabled] = useState(false);
    const [formData, setFormData] = useState({
        // Personal Information
        businessOwnerName: '',
        email: '',
        phone: '',
        nationalId: '',

        // Store Information
        storeName: '',
        storeDescription: '',
        storeCategory: '',
        businessType: '',
        storeLogo: null,

        // Business Details
        businessRegistration: '',
        taxId: '',
        kraPin: '',
        businessAddress: '',
        city: '',
        postalCode: '',

        // Bank Information
        bankName: '',
        accountNumber: '',
        accountName: '',
        branchCode: '',

        // Additional Information
        expectedMonthlyOrders: '',
        productCategories: [],
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState({});
    const [logoPreview, setLogoPreview] = useState(null);
    const [newUserPassword, setNewUserPassword] = useState('');

    const steps = [
        { number: 1, title: 'Personal Info', icon: User },
        { number: 2, title: 'Store Details', icon: Store },
        { number: 3, title: 'Business Info', icon: FileText },
        { number: 4, title: 'Payment Info', icon: CreditCard },
    ];

    const categories = [
        'Electronics & Gadgets',
        'Fashion & Apparel',
        'Home & Kitchen',
        'Sports & Outdoors',
        'Books & Media',
        'Beauty & Health',
        'Toys & Games',
        'Automotive',
        'Groceries & Food',
        'Office Supplies'
    ];

    const businessTypes = [
        'Sole Proprietorship',
        'Partnership',
        'Limited Company',
        'Individual/Freelancer'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCategoryToggle = (category) => {
        setFormData(prev => ({
            ...prev,
            productCategories: prev.productCategories.includes(category)
                ? prev.productCategories.filter(c => c !== category)
                : [...prev.productCategories, category]
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, storeLogo: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.businessOwnerName.trim()) newErrors.businessOwnerName = 'Name is required';
            if (!formData.email.trim()) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
            if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
            if (!formData.nationalId.trim()) newErrors.nationalId = 'National ID is required';
        }

        if (step === 2) {
            if (!formData.storeName.trim()) newErrors.storeName = 'Store name is required';
            if (!formData.storeDescription.trim()) newErrors.storeDescription = 'Store description is required';
            if (!formData.storeCategory) newErrors.storeCategory = 'Please select a category';
            if (!formData.businessType) newErrors.businessType = 'Please select business type';
        }

        if (step === 3) {
            if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
            if (!formData.city.trim()) newErrors.city = 'City is required';
            if (!formData.kraPin.trim()) newErrors.kraPin = 'KRA PIN is required';
        }

        if (step === 4) {
            if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
            if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
            if (!formData.accountName.trim()) newErrors.accountName = 'Account name is required';
            if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // using useeffect fetch user details from api using the keyed in email 
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await Users.getUserByEmail(formData.email);
                const user = response?.user;
                if (user) {
                    setDisabled(true)
                    setFormData({
                        ...formData,
                        businessOwnerName: user.firstname + " " + user.lastname,
                        email: user.email,
                        phone: user.phone,
                        userId: user.id,
                        // nationalId: user.nationalId,
                    })
                }

                // setUserData(user);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (formData.email) {
            fetchUserDetails();
        }
    }, [formData.email]);


    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        try {
            // toast.info("Submitting your details...");

            let userId = formData.userId;

            // Step 1: Register user if not already registered
            if (!disabled) {
                const randomPassword = Math.random().toString(36).slice(-8);
                const [firstName, lastName = ""] = formData.businessOwnerName.split(" ");
                setNewUserPassword(randomPassword);
                const registrationData = {
                    firstname: firstName,
                    lastname: lastName,
                    email: formData.email,
                    phone: formData.phone,
                    password: randomPassword,
                };

                const regResponse = await auth.register(registrationData);
                userId = regResponse.user.id;
                setFormData((prev) => ({ ...prev, userId }));

                toast.success("User registered successfully!");
            }

            // Step 2: Create seller
            const sellerData = {
                userId,
                nationalId: formData.nationalId,
            };

            const sellerResponse = await sellers.createSeller(sellerData);

            // Step 3: Create shop
            const shopData = {
                sellerId: sellerResponse.id,
                name: formData.storeName,
                description: formData.storeDescription,
                primaryCategory: formData.storeCategory,
                businessType: formData.businessType,
                address: formData.businessAddress,
                city: formData.city,
                kraPin: formData.kraPin,
                businessRegistrationNumber: formData.businessRegistration,
                taxId: formData.taxId,
                expectedMonthlyOrders: formData.expectedMonthlyOrders,
                logo: formData.storeLogo,
            };

            const shopResponse = await Shops.createShop(shopData);
            const shopId = shopResponse?.shop.id;
            setFormData((prev) => ({ ...prev, shopId }));

            // Step 4: Create bank account details
            const bankData = {
                shopId,
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                accountName: formData.accountName,
                branchCode: formData.branchCode,
            };

            await Shops.createBankAccount(bankData);

            toast.success("Business registration completed successfully!");
            setCurrentStep(5);
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };


    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                                placeholder="your@email.com"
                                disabled={disabled}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                                type="text"
                                name="businessOwnerName"
                                value={formData.businessOwnerName}
                                onChange={handleInputChange}
                                className={`w-full border ${errors.businessOwnerName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                                placeholder="Enter your full name"
                                disabled={disabled}
                            />
                            {errors.businessOwnerName && <p className="text-red-500 text-sm mt-1">{errors.businessOwnerName}</p>}
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                                placeholder="+254 700 000 000"
                                disabled={disabled}
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">National ID / Passport *</label>
                            <input
                                type="text"
                                name="nationalId"
                                value={formData.nationalId}
                                onChange={handleInputChange}
                                className={`w-full border ${errors.nationalId ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                                placeholder="Enter ID number"
                            />
                            {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Information</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
                            <input
                                type="text"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleInputChange}
                                className={`w-full border ${errors.storeName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                                placeholder="Your Store Name"
                            />
                            {errors.storeName && <p className="text-red-500 text-sm mt-1">{errors.storeName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Description *</label>
                            <textarea
                                name="storeDescription"
                                value={formData.storeDescription}
                                onChange={handleInputChange}
                                rows="4"
                                className={`w-full border ${errors.storeDescription ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                                placeholder="Tell customers about your store..."
                            />
                            {errors.storeDescription && <p className="text-red-500 text-sm mt-1">{errors.storeDescription}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Category *</label>
                            <select
                                name="storeCategory"
                                value={formData.storeCategory}
                                onChange={handleInputChange}
                                className={`w-full border ${errors.storeCategory ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.storeCategory && <p className="text-red-500 text-sm mt-1">{errors.storeCategory}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                            <select
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleInputChange}
                                className={`w-full border ${errors.businessType ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                            >
                                <option value="">Select business type</option>
                                {businessTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
                            <div className="flex items-center space-x-4">
                                {logoPreview && (
                                    <img src={logoPreview} alt="Logo preview" className="w-20 h-20 rounded-lg object-cover border-2 border-gray-300" />
                                )}
                                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    Choose File
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Recommended: Square image, min 200x200px</p>
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Categories (Select all that apply)</label>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.productCategories.includes(cat)}
                                            onChange={() => handleCategoryToggle(cat)}
                                            className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div> */}
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Registration Number</label>
                            <input
                                type="text"
                                name="businessRegistration"
                                value={formData.businessRegistration}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Optional - If registered"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">KRA PIN *</label>
                            <input
                                type="text"
                                name="kraPin"
                                value={formData.kraPin}
                                onChange={handleInputChange}
                                className={`w-full border ${errors.kraPin ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                                placeholder="A000000000A"
                            />
                            {errors.kraPin && <p className="text-red-500 text-sm mt-1">{errors.kraPin}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID / VAT Number</label>
                            <input
                                type="text"
                                name="taxId"
                                value={formData.taxId}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Optional - If applicable"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Address *</label>
                            <input
                                type="text"
                                name="businessAddress"
                                value={formData.businessAddress}
                                onChange={handleInputChange}
                                className={`w-full border ${errors.businessAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                                placeholder="Street address, building"
                            />
                            {errors.businessAddress && <p className="text-red-500 text-sm mt-1">{errors.businessAddress}</p>}
                        </div>

                        <div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                                    placeholder="Nairobi"
                                />
                                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                            </div>

                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="00100"
                                />
                            </div> */}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Monthly Orders</label>
                            <select
                                name="expectedMonthlyOrders"
                                value={formData.expectedMonthlyOrders}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="">Select range</option>
                                <option value="0-50">0-50 orders</option>
                                <option value="51-200">51-200 orders</option>
                                <option value="201-500">201-500 orders</option>
                                <option value="500+">500+ orders</option>
                            </select>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Important:</strong> This information will be used to transfer your earnings. Please ensure all details are accurate.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                            <select
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                className={`w-full border ${errors.bankName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                            >
                                <option value="">Select your bank</option>
                                <option value="Equity Bank">Equity Bank</option>
                                <option value="KCB">Kenya Commercial Bank (KCB)</option>
                                <option value="Cooperative Bank">Cooperative Bank</option>
                                <option value="Standard Chartered">Standard Chartered</option>
                                <option value="ABSA">ABSA Bank</option>
                                <option value="NCBA">NCBA Bank</option>
                                <option value="DTB">Diamond Trust Bank (DTB)</option>
                                <option value="I&M Bank">I&M Bank</option>
                                <option value="Stanbic">Stanbic Bank</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                className={`w-full border ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                                placeholder="Enter account number"
                            />
                            {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label>
                            <input
                                type="text"
                                name="accountName"
                                value={formData.accountName}
                                onChange={handleInputChange}
                                className={`w-full border ${errors.accountName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent`}
                                placeholder="Name as it appears on account"
                            />
                            {errors.accountName && <p className="text-red-500 text-sm mt-1">{errors.accountName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
                            <input
                                type="text"
                                name="branchCode"
                                value={formData.branchCode}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none text-gray-700 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Optional"
                            />
                        </div>

                        <div className="pt-6">
                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleInputChange}
                                    className={`w-5 h-5 text-orange-600 rounded focus:ring-orange-500 mt-0.5 ${errors.agreeToTerms ? 'border-red-500' : ''}`}
                                />
                                <span className="text-sm text-gray-700">
                                    I agree to the <a href="#" className="text-orange-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-orange-600 hover:underline">Seller Policy</a>. I understand that Soko will verify my information before activating my account.
                                </span>
                            </label>
                            {errors.agreeToTerms && <p className="text-red-500 text-sm mt-2">{errors.agreeToTerms}</p>}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Application Submitted!</h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Thank you for registering as a seller on Soko. We're reviewing your application and will notify you via email within 1-2 business days.
                        </p>
                        {!disabled && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 max-w-md mx-auto mb-8">
                                <h3 className="font-semibold text-red-600 mb-3">This is your password, please copy it as it won't be shown again</h3>
                                <p className="text-left text-sm text-gray-700">{newUserPassword}</p>
                            </div>
                        )}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 max-w-md mx-auto mb-8">
                            <h3 className="font-semibold text-gray-800 mb-3">Next Steps:</h3>
                            <ul className="text-left text-sm text-gray-700 space-y-2">
                                <li>✓ Verify your email address</li>
                                <li>✓ Check your email for verification status</li>
                                <li>✓ Prepare product listings</li>
                                <li>✓ Review seller guidelines</li>
                            </ul>
                        </div>
                        <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-semibold">
                            Go to Dashboard
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    if (currentStep === 5) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                    {renderStepContent()}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Become a Soko Seller</h1>
                    <p className="text-gray-600">Join thousands of sellers and grow your business</p>
                </div>

                {/* Step Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                                <React.Fragment key={step.number}>
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition ${currentStep >= step.number
                                            ? 'bg-orange-600 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            <StepIcon className="w-6 h-6" />
                                        </div>
                                        <span className={`text-xs font-medium ${currentStep >= step.number ? 'text-orange-600' : 'text-gray-500'
                                            }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-1 flex-1 mx-2 rounded transition ${currentStep > step.number ? 'bg-orange-600' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition ${currentStep === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Previous</span>
                        </button>

                        {currentStep < 4 ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
                            >
                                <span>Next</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                            >
                                <span>Submit Application</span>
                                <CheckCircle className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Need help? <a href="#" className="text-orange-600 hover:underline font-medium">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SellerOnboarding;