'use client'
import { Plus, Folder, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Categories from '../../api/categories/api'

// --- Mock Data and API Replacement for Categories ---
// Mock Categories data based on the structure provided by the user
const mockCategoriesData = [
    { createdAt: "2025-10-02T06:37:58.548Z", id: 1, name: "Beef", parentId: 2 },
    { createdAt: "2025-10-02T06:38:00.000Z", id: 2, name: "Meats", parentId: null },
    { createdAt: "2025-10-02T06:39:00.000Z", id: 3, name: "Vegetables", parentId: null },
    { createdAt: "2025-10-02T06:40:00.000Z", id: 5, name: "Beauty & Health", parentId: null },
    { createdAt: "2025-10-02T06:41:00.000Z", id: 6, name: "Dairy", parentId: 3 },
    { createdAt: "2025-10-02T06:42:00.000Z", id: 7, name: "Grains", parentId: null },
];

const mockGetCategories = async () => {
   const response = await Categories.getCategories()
   return response
};
// -------------------------------------

// --- Component: Categories View ---
const CategoriesView = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Map to quickly look up category names by ID for parent display
    const categoryNameMap = categories.reduce((map, cat) => {
        map[cat.id] = cat.name;
        return map;
    }, {});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await mockGetCategories();
                // Ensure data is sorted for better viewing, e.g., by ID
                const sortedCategories = response.categories.sort((a, b) => a.id - b.id);
                setCategories(sortedCategories || []);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setCategories([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

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
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-3xl font-extrabold text-gray-900">Category Management</h2>
                <button
                    onClick={() => console.log('Navigation to Add New Category page triggered.')}
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
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Parent Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No categories have been defined yet.</td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-orange-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {category.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                                        <div className="flex items-center">
                                            <Folder className="w-4 h-4 mr-2 text-orange-500" />
                                            {category.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {category.parentId
                                            ? categoryNameMap[category.parentId] || `ID: ${category.parentId}`
                                            : <span className="text-gray-400 italic">Root Category</span>
                                        }
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center p-4">
                <div className="text-sm text-gray-500">
                    Showing 1 to {categories.length} of {categories.length} results
                </div>
            </div>
        </div>
    );
};

export default CategoriesView;
