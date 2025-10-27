'use client'
import { Plus, Folder, Edit, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

// The 'Categories' import is kept for completeness, but mock data is used for category display
import Categories from '../../api/categories/api'
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import Shops from "../../api/shop/api";

// --- Component: Create Category Modal ---

// Helper component for the modal
const CreateCategoryModal = ({ isOpen, onClose, categories }) => {
    const [name, setName] = useState('');
    // Use 'null' to represent a root category (no parent)
    const [parentId, setParentId] = useState('');
    const [shopId, setShopId] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [parentCategories, setParentCategories] = useState([]);
    const [adminSession, setAdminSession] = useState(null);
    const [shops, setShops] = useState([]);

    // Reset state when the modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setName('');
            setParentId(''); // Reset to default "Select a parent"
            setIsSaving(false);
        }
    }, [isOpen]);

    // fetch all the categories for the parent dropdown
    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                const session = await getSession();
                setAdminSession(session); const response = await Categories.getCategories();
                setParentCategories(response.categories);
            } catch (error) {
                console.error("Failed to fetch parent categories:", error);
            }
        };

        fetchParentCategories();
    }, []);

    // fetch all the shops to get shop ids
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const session = await getSession();
                const response = await Shops.getAllShops(session.user.accessToken);
                setShops(response.shops);
            } catch (error) {
                console.error("Failed to fetch admin session:", error);
            }
        };

        fetchShops();
    }, []);

    console.log('Parent Categories:', parentCategories);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const parentIdValue = parentId === '' ? null : parseInt(parentId);

        // --- Mock API Call to Save Category ---
        // In a real application, you'd call an API here, like:
        try {
            const newCategory = { name, parentId: parentIdValue };
            await Categories.createCategory({ ...newCategory, shopId: shopId }, adminSession.user.accessToken);
            // You would then trigger a re-fetch of the category list in CategoriesView
            onClose(true); // Close and signify a successful action
        } catch (error) {
            console.error("Failed to create category:", error);
            toast.error("Failed to create category.");
            setIsSaving(false);
        }

        // Mock success for demonstration
        console.log(`Submitting new category: Name='${name}'`);
        // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        setIsSaving(false);
        toast.success(`Category/Subcategory '${name}' created!`);
        onClose(true); // Close and signify a successful action, which would trigger a data refresh
    };

    if (!isOpen) return null;

    // Tailwind CSS for animated modal overlay and content
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 transition-opacity duration-300 flex items-center justify-center">
            {/* Modal Content container with animation */}
            <div
                className={`bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg m-4 transform transition-all duration-300 
                ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
            >
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800">Create New Category</h3>
                    <button
                        onClick={() => onClose(false)}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
                        title="Close"
                        disabled={isSaving}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-5">
                    {/* Shop Dropdown */}
                    <div>
                        <label htmlFor="shop" className="block text-sm font-medium text-gray-700 mb-1">
                            Shop <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="shop"
                            value={shopId}
                            onChange={(e) => setShopId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-orange-500 text-orange-500 focus:outline-none focus:border-orange-500 transition duration-150"
                            disabled={isSaving}
                        >
                            <option value="">-- Select Shop --</option>
                            {shops.map((shop) => (
                                <option key={shop.id} value={shop.id}>
                                    {shop.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category Name Input */}
                    <div>
                        <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="category-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-orange-500 text-orange-500 focus:outline-none focus:border-orange-500 transition duration-150"
                            placeholder="e.g., Electronics, Fresh Produce"
                            disabled={isSaving}
                        />
                    </div>

                    {/* Parent Category Dropdown */}
                    <div>
                        <label htmlFor="parent-category" className="block text-sm font-medium text-gray-700 mb-1">
                            Parent Category (Optional)
                        </label>
                        <select
                            id="parent-category"
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value)}
                            className="w-full p-3 border border-gray-300 bg-white rounded-xl focus:ring-orange-500 text-orange-500 focus:outline-none focus:border-orange-500 transition duration-150"
                            disabled={isSaving}
                        >
                            {/* Option for root category (Category) */}
                            <option value="">-- No Parent (Root Category) --</option>

                            {/* Options for subcategory */}
                            {parentCategories
                                .filter(cat => cat.parentId === null) // Only allow top-level categories as direct parents for simplicity
                                .map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            Leave blank to create a main **Category**. Select a parent to create a **Subcategory**.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={!name.trim() || isSaving}
                            className={`flex items-center justify-center px-6 py-2.5 rounded-xl font-semibold shadow-md transition duration-200 ${isSaving || !name.trim()
                                ? 'bg-orange-400 cursor-not-allowed'
                                : 'bg-orange-600 text-white hover:bg-orange-700 transform hover:scale-[1.02]'
                                }`}
                        >
                            {isSaving ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Plus className="w-5 h-5 mr-2" />
                            )}
                            {isSaving ? 'Creating...' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Mock Data and API Replacement for Categories ---
const mockCategoriesData = [
    { createdAt: "2025-10-02T06:37:58.548Z", id: 1, name: "Beef", parentId: 2 },
    { createdAt: "2025-10-02T06:38:00.000Z", id: 2, name: "Meats", parentId: null },
    { createdAt: "2025-10-02T06:39:00.000Z", id: 3, name: "Vegetables", parentId: null },
    { createdAt: "2025-10-02T06:40:00.000Z", id: 5, name: "Beauty & Health", parentId: null },
    { createdAt: "2025-10-02T06:41:00.000Z", id: 6, name: "Dairy", parentId: 3 },
    { createdAt: "2025-10-02T06:42:00.000Z", id: 7, name: "Grains", parentId: null },
];

const mockGetCategories = async () => {
    // Assuming the actual API call is available and the mock is only for structure
    if (typeof Categories !== 'undefined' && Categories.getCategories) {
        try {
            const response = await Categories.getCategories();
            return response;
        } catch (e) {
            console.warn("API call failed, using mock data for display.");
            return { categories: mockCategoriesData };
        }
    }
    return { categories: mockCategoriesData };
};
// -------------------------------------

// --- Component: Categories View ---
const CategoriesView = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal

    // Function to fetch data
    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await mockGetCategories();
            // Ensure data is sorted for better viewing, e.g., by ID
            const sortedCategories = (response.categories || []).sort((a, b) => a.id - b.id);
            setCategories(sortedCategories);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Separate parent categories and subcategories
    const parentCategories = categories.filter(cat => cat.parentId === null);
    const subcategoriesMap = categories.reduce((map, cat) => {
        if (cat.parentId !== null) {
            if (!map[cat.parentId]) {
                map[cat.parentId] = [];
            }
            map[cat.parentId].push(cat);
        }
        return map;
    }, {});

    // Handler to close the modal and conditionally refresh data
    const handleCloseModal = (refresh = false) => {
        setIsModalOpen(false);
        if (refresh) {
            fetchCategories();
        }
    };

    // Function to format the timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500 font-medium">Loading category data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 lg:p-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-3xl font-extrabold text-gray-900">Category Management</h2>
                <button
                    onClick={() => setIsModalOpen(true)} // Open the modal
                    className="mt-4 sm:mt-0 flex items-center bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:bg-orange-700 transition duration-200 transform hover:scale-[1.02]"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Category
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Categories Table */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-orange-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#SN</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Subcategories</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {parentCategories.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No categories have been defined yet.</td>
                            </tr>
                        ) : (
                            parentCategories.map((category, index) => {
                                const subcategories = subcategoriesMap[category.id] || [];
                                return (
                                    <tr key={category.id} className="hover:bg-orange-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                                            <div className="flex items-center">
                                                <Folder className="w-4 h-4 mr-2 text-orange-500" />
                                                {category.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {subcategories.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {subcategories.map((sub) => (
                                                        <span
                                                            key={sub.id}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                                                        >
                                                            {sub.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">No subcategories</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatTimestamp(category.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <button
                                                onClick={() => console.log(`Editing Category ID: ${category.id}`)}
                                                className="text-orange-600 hover:text-orange-900 p-1 rounded-full hover:bg-orange-100 transition"
                                                title="Edit Category"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => console.log(`Deleting Category ID: ${category.id}`)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition"
                                                title="Delete Category"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center p-4">
                <div className="text-sm text-gray-500">
                    Showing 1 to {parentCategories.length} of {parentCategories.length} results
                </div>
            </div>

            {/* The new Modal component is rendered here */}
            <CreateCategoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                categories={categories}
            />
        </div>
    );
};

export default CategoriesView;