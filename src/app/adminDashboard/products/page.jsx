'use client'
import { Box, Layers, Search, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

const getStatusStyles = (status) => {
    switch (status) {
        case 'Active':
            return 'text-green-700 bg-green-100';
        case 'Out of Stock':
            return 'text-red-700 bg-red-100';
        case 'Pending':
        case 'Pending Review':
            return 'text-yellow-700 bg-yellow-100';
        case 'Suspended':
            return 'text-red-700 bg-red-100';
        default:
            return 'text-gray-700 bg-gray-100';
    }
};
// --- Component: Products View ---
const ProductsView = ({ onViewChange }) => {
    // Mock data for products
    const mockProducts = [
        { id: 'P001', name: 'Hand-Carved Wooden Rhino', shop: 'Kilimanjaro Crafts', category: 'Home Decor', price: 4500, stock: 15, status: 'Active', sku: 'WCR-001' },
        { id: 'P002', name: 'Ethiopian Yirgacheffe Coffee (250g)', shop: 'Mombasa Spices', category: 'Food & Drink', price: 1250, stock: 500, status: 'Active', sku: 'CFE-002' },
        { id: 'P003', name: 'Men\'s Running Shoe - Black', shop: 'Savage Sneakers', category: 'Footwear', price: 8999, stock: 0, status: 'Out of Stock', sku: 'SNS-003' },
        { id: 'P004', name: 'Organic Kale Bunch', shop: 'Rift Valley Fresh Produce', category: 'Groceries', price: 200, stock: 30, status: 'Pending Review', sku: 'RVP-004' },
        { id: 'P005', name: 'Maasai Shuka Blanket', shop: 'Kilimanjaro Crafts', category: 'Textiles', price: 3000, stock: 75, status: 'Active', sku: 'WCR-005' },
    ];

    const router = useRouter();
    // Function to format KSH currency
    const formatCurrency = (amount) => {
        return `KSH ${new Intl.NumberFormat('en-US').format(amount)}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
                <button
                    // This button would navigate to an Add Product view
                    onClick={() => router.push('/adminDashboard/products/addProduct')}
                    className="mt-4 sm:mt-0 bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-orange-700 transition duration-200"
                >
                    + Add New Product
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                {/* Search and Filter Bar */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by product name or SKU..."
                            className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    <div className="flex space-x-3 w-full md:w-auto">
                        <select className="flex-1 py-2 px-4 border border-gray-200 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500">
                            <option>All Categories</option>
                            <option>Home Decor</option>
                            <option>Food & Drink</option>
                            <option>Footwear</option>
                            <option>Groceries</option>
                        </select>
                        <select className="flex-1 py-2 px-4 border border-gray-200 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500">
                            <option>All Statuses</option>
                            <option>Active</option>
                            <option>Out of Stock</option>
                            <option>Pending Review</option>
                        </select>
                    </div>
                </div>

                {/* Products Table */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop / Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {mockProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex items-center space-x-2">
                                        <Box className="w-4 h-4 text-gray-500" />
                                        <span className="font-semibold">{product.name}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 flex items-center mt-1">
                                        <Tag className="w-3 h-3 mr-1" />
                                        SKU: {product.sku}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <p>{product.shop}</p>
                                    <p className="text-xs text-gray-500 flex items-center mt-1">
                                        <Layers className="w-3 h-3 mr-1" />
                                        {product.category}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                                    {formatCurrency(product.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`font-semibold ${product.stock === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(product.status)}`}>
                                        {product.status}
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
                <div className="text-sm text-gray-500">Showing 1 to {mockProducts.length} of {mockProducts.length} results</div>
            </div>
        </div>
    );
};

export default ProductsView;