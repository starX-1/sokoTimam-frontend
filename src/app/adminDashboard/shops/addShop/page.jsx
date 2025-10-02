'use client'
import { AlignLeft, Image, Mail, MapPin, Phone, Store, User } from "lucide-react";
import { useState } from "react";

// --- New Component: Add Shop View (Form) ---
const AddShopView = ({ onViewChange }) => {
    // Initial state pre-populated with provided data where available
    const [shopData, setShopData] = useState({
        ownerId: '',
        name: "",
        description: "",
        logoUrl: "",
        coverUrl: "",
        status: "", // Using 'Active' to match the select option for provided 'active'
        // Mock data for fields not provided in the JSON, but required by the form
        location: '',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        verified: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setShopData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Log the final data object, including pre-populated and manually entered fields
        console.log('Submitting new shop with data:', shopData);

        // Removed alert() as per instructions, replaced with console log
        console.log('Shop added successfully! Redirecting back to list.');

        onViewChange('#/shops'); // Navigate back to the shops list
    };

    const InputGroup = ({ label, icon: Icon, disabled, type, name, placeholder, isRequired = true, value }) => (
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
                    onChange={handleChange}
                    className="w-full py-3 pl-10 pr-4 border border-orange-200 rounded-xl shadow-inner focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-800"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-3xl font-bold text-gray-800">Add New Shop</h2>
                <a
                    href="#/shops"
                    onClick={(e) => { e.preventDefault(); onViewChange('#/shops'); }}
                    className="mt-4 sm:mt-0 text-gray-600 hover:text-orange-600 transition text-sm font-medium"
                >
                    ← Back to Shops List
                </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Shop Information Section */}
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Shop Details (Owner ID: {shopData.ownerId})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup
                            label="Shop Name"
                            icon={Store}
                            name="name"
                            placeholder="e.g., Kilimanjaro Crafts"
                            value={shopData.name}
                        />
                        <InputGroup
                            label="Physical Location"
                            icon={MapPin}
                            name="location"
                            placeholder="e.g., Nairobi CBD"
                            value={shopData.location}
                        />
                        <InputGroup
                            label="Logo"
                            icon={Image}
                            type="file"
                            name="logoUrl"
                            placeholder="https://example.com/logo.png"
                            value={shopData.logoUrl}
                            isRequired={false}
                        />
                        <InputGroup
                            label="Cover Image"
                            icon={Image}
                            type="file"
                            name="coverUrl"
                            placeholder="https://example.com/cover.jpg"
                            value={shopData.coverUrl}
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

                    {/* Owner Contact Section */}
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 pt-6">Owner Contact(Search by email)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <InputGroup
                            label="Owner Email"
                            icon={Mail}
                            type="email"
                            name="ownerEmail"
                            placeholder="jane.doe@example.com"
                            value={shopData.ownerEmail}
                        />
                        <InputGroup
                            label="Owner Full Name"
                            icon={User}
                            name="ownerName"
                            placeholder="Jane Doe"
                            value={shopData.ownerName}
                            disabled
                        />
                        <InputGroup
                            label="Phone Number"
                            icon={Phone}
                            type="tel"
                            name="ownerPhone"
                            placeholder="+254 7XX XXX XXX"
                            value={shopData.ownerPhone}
                            disabled
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
                            onClick={() => onViewChange('#/shops')}
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