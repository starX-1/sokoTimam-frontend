'use client'
import { Layers, Search } from 'lucide-react';

const getStatusStyles = (status) => {   
    switch (status) {
        case 'Active':
            return 'text-green-700 bg-green-100';
        case 'Pending Review':
            return 'text-yellow-700 bg-yellow-100';
        case 'Suspended':
            return 'text-red-700 bg-red-100';
        default:
            return 'text-gray-700 bg-gray-100';
    }
    }
const CategoriesView = ({ onViewChange }) => {
    // Mock data for categories
    const mockCategories = [
        { id: 1, name: 'Fresh Produce', description: 'Fruits, vegetables, and herbs.', products: 120, status: 'Active', dateCreated: '2023-01-01' },
        { id: 2, name: 'Home & Kitchen', description: 'Appliances, decor, and utensils.', products: 350, status: 'Active', dateCreated: '2023-01-15' },
        { id: 3, name: 'Fashion & Apparel', description: 'Clothing, shoes, and accessories.', products: 580, status: 'Pending Review', dateCreated: '2023-02-10' },
        { id: 4, name: 'Handmade Crafts', description: 'Art, jewelry, and unique creations.', products: 88, status: 'Active', dateCreated: '2023-03-01' },
        { id: 5, name: 'Electronics', description: 'Gadgets, phones, and computers.', products: 15, status: 'Suspended', dateCreated: '2024-05-20' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-3xl font-bold text-gray-800">Category Management</h2>
                <button
                    onClick={() => onViewChange('#/add-category')} // Placeholder for Add Category view
                    className="mt-4 sm:mt-0 bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-orange-700 transition duration-200"
                >
                    + Add New Category
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                {/* Search and Filter Bar */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by category name..."
                            className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-xl text-sm  focus:outline-none text-gray-800 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    <select className="w-full md:w-auto py-2 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-800 focus:ring-orange-500 focus:border-orange-500">
                        <option>All Statuses</option>
                        <option>Active</option>
                        <option>Pending Review</option>
                        <option>Suspended</option>
                    </select>
                </div>

                {/* Categories Table */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {mockCategories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex items-center space-x-2">
                                        <Layers className="w-4 h-4 text-gray-500"/>
                                        <span>{category.name}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">ID: {category.id}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">
                                    {category.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">{category.products}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(category.status)}`}>
                                        {category.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</a>
                                    <a href="#" className="text-red-600 hover:text-red-900">Archive</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center p-4">
                 <div className="text-sm text-gray-500">Showing 1 to {mockCategories.length} of {mockCategories.length} results</div>
            </div>
        </div>
    );
};

export default CategoriesView;