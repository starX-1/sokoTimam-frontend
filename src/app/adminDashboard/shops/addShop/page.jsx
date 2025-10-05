'use client'
import { AlignLeft, Image, Mail, MapPin, Phone, Store, User, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Users from '../../../api/user/api'
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Shops from '../../../api/shop/api'
import { toast } from "react-toastify";


const InputGroup = ({ label, icon: Icon, disabled, type = "text", name, placeholder, isRequired = true, value, onChange: onChange }) => {
    // Use the propOnChange if provided, otherwise use the global/local default one
    // const handler = propOnChange || defaultHandleChange;

    return (
        <div className="mb-6">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type={type}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    required={isRequired}
                    value={value}
                    disabled={disabled}
                    onChange={onChange} // Use the handler
                    className={`w-full py-3 pl-10 pr-4 border border-orange-200 rounded-xl shadow-inner focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-800 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
            </div>
        </div>
    );
};

const AddShopView = () => {
    const router = useRouter();
    const [shopData, setShopData] = useState({
        ownerId: '',
        name: "",
        description: "",
        logoUrl: "",
        coverUrl: "",
        status: "Active",
        location: '',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        verified: false,
    });

    const [userOptions, setUserOptions] = useState([]);
    // const [admin, setAdmin] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);

    // useEffect(() => {
    //     const fetchAdmin = async () => {
    //         const adminSession = await getSession();
    //         setAdmin(adminSession);
    //     };
    //     fetchAdmin();
    // }, []);

    // const fetchUserOptions = async () => {
    //     try {
    //         const response = await Users.getAll(admin);
    //         setUserOptions(response?.users || []);
    //     } catch (error) {
    //         console.error('Error fetching user options:', error);
    //     }
    // };

    useEffect(() => {
        const loadData = async () => {
            const adminSession = await getSession();
            // setAdmin(adminSession);
            const response = await Users.getAll(adminSession);
            setUserOptions(response?.users || []);
        };
        loadData();
    }, []);


    // Filter users based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers([]);
            return;
        }

        const filtered = userOptions.filter(user =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, userOptions]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setShopData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0]
                : type === 'checkbox' ? checked : value
        }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setShowDropdown(true);
    };

    const handleUserSelect = (user) => {
        setShopData(prev => ({
            ...prev,
            ownerId: user.id.toString(),
            ownerEmail: user.email,
            ownerName: `${user.firstname} ${user.lastname}`,
            ownerPhone: user.phone || ''
        }));
        setSearchTerm(user.email);
        setShowDropdown(false);
    };

    // function to validate the shops data required 
    const validateInputs = () => {
        const { ownerId, name, description, location, logoUrl, coverUrl } = shopData;
        if (!ownerId || !name || !description || !location || !logoUrl || !coverUrl) {
            toast.error('Please fill in all fields.');
            return false;
        }
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateInputs()) return;

        // Log all collected data
        console.log('=== SUBMITTING SHOP DATA ===');
        console.log('Shop Information:', {
            ownerId: shopData.ownerId,
            name: shopData.name,
            description: shopData.description,
            location: shopData.location,
            logoUrl: shopData.logoUrl,
            coverUrl: shopData.coverUrl,
            status: shopData.status,
            verified: shopData.verified
        });
        console.log('Owner Information:', {
            ownerName: shopData.ownerName,
            ownerEmail: shopData.ownerEmail,
            ownerPhone: shopData.ownerPhone
        });

        try {
            const res = await Shops.createShop(shopData);
            console.log(res);

        } catch (error) {
            console.log(error);
        } finally {
            console.log('Complete Data Object:', shopData);
            console.log('============================');
        }

    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-3xl font-bold text-gray-800">Add New Shop</h2>
                <a
                    href="#/shops"
                    onClick={() => router.push('/adminDashboard/shops')}
                    className="mt-4 sm:mt-0 text-gray-600 hover:text-orange-600 transition text-sm font-medium"
                >
                    ← Back to Shops List
                </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Shop Information Section */}
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
                        Shop Details {shopData.ownerId && `(Owner ID: ${shopData.ownerId})`}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup
                            label="Shop Name"
                            icon={Store}
                            name="name"
                            onChange={handleChange}
                            placeholder="e.g., Kilimanjaro Crafts"
                            value={shopData.name}
                        />
                        <InputGroup
                            label="Physical Location"
                            icon={MapPin}
                            name="location"
                            onChange={handleChange}
                            placeholder="e.g., Nairobi CBD"
                            value={shopData.location}
                        />
                        <InputGroup
                            label="Logo Image"
                            icon={Image}
                            type="file"
                            onChange={handleChange}
                            name="logoUrl"
                            // placeholder="https://example.com/logo.png"
                            // value={shopData.logoUrl}
                            isRequired={false}
                        />
                        <InputGroup
                            label="Cover Image"
                            icon={Image}
                            type="file"
                            name="coverUrl"
                            onChange={handleChange}
                            // placeholder="https://example.com/cover.jpg"
                            // value={shopData.coverUrl}
                            isRequired={false}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Shop Description</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                placeholder="Provide a brief description of the shop and its products..."
                                required
                                value={shopData.description}
                                onChange={handleChange}
                                className="w-full py-3 pl-10 pr-4 border border-orange-200 rounded-xl shadow-inner focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-800"
                            ></textarea>
                        </div>
                    </div>

                    {/* Owner Contact Section with Search */}
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 pt-6">Owner Contact (Search by email or name)</h3>

                    {/* User Search Field */}
                    <div className="mb-6 relative">
                        <label htmlFor="userSearch" className="block text-sm font-medium text-gray-700 mb-1">Search User</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                id="userSearch"
                                placeholder="Search by email or name..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full py-3 pl-10 pr-4 border border-orange-200 rounded-xl shadow-inner focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-800"
                            />
                        </div>

                        {/* Dropdown */}
                        {showDropdown && filteredUsers.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleUserSelect(user)}
                                        className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="font-medium text-gray-800">{user.firstname} {user.lastname}</div>
                                        <div className="text-sm text-gray-600">{user.email}</div>
                                        {user.phone && <div className="text-xs text-gray-500">{user.phone}</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputGroup
                            label="Owner Email"
                            icon={Mail}
                            type="email"
                            name="ownerEmail"
                            placeholder="jane.doe@example.com"
                            value={shopData.ownerEmail}
                            disabled={true}
                        />
                        <InputGroup
                            label="Owner Full Name"
                            icon={User}
                            name="ownerName"
                            placeholder="Jane Doe"
                            value={shopData.ownerName}
                            disabled={true}
                        />
                        <InputGroup
                            label="Phone Number"
                            icon={Phone}
                            type="tel"
                            name="ownerPhone"
                            placeholder="+254 7XX XXX XXX"
                            value={shopData.ownerPhone}
                            disabled={true}
                        />
                    </div>

                    {/* Administration & Status Section */}
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 pt-6">Administration</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={shopData.status}
                                onChange={handleChange}
                                className="w-full py-3 px-3 border border-gray-200 rounded-xl shadow-inner focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-800"
                            >
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>

                        <div className="sm:col-span-2 flex items-center pt-5">
                            <input
                                id="verified"
                                name="verified"
                                type="checkbox"
                                checked={shopData.verified}
                                onChange={handleChange}
                                className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <label htmlFor="verified" className="ml-2 block text-sm text-gray-900">
                                Mark as verified (Bypass verification process)
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 pt-8">
                        <button
                            type="button"
                            onClick={() => router.push('/adminDashboard/shops')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#985942] text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:bg-[#864c37] transition duration-200"
                        >
                            Save Shop
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddShopView;