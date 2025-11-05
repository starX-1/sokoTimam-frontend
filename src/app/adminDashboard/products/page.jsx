'use client'
import { Box, Layers, Search, Tag } from "lucide-react";
// Removed: import { useRouter } from "next/navigation";
import Products from '../../api/products/api'
import Shop from '../../api/shop/api'
import Categories from '../../api/categories/api'
import { useEffect, useState } from "react";
import Link from "next/link";

// --- Mock Data and API Replacement ---
// Since the external file '../../api/products/api' cannot be resolved in this environment, 
// we use mock data that mimics the structure provided by the user to ensure the component renders.
// const mockProductsData = [
//     { id: 5, name: 'Premium Beef Steak', shopId: 1, categoryId: 1, price: '1500.00', stock: 50, status: 'active', sku: 'BEEF-STEAK-1KG', ImageUrl: "https://res.cloudinary.com/demo/image/upload/beef-steak.jpg" },
//     { id: 3, name: 'Fresh Organic Kale', shopId: 2, categoryId: 3, price: '250.00', stock: 10, status: 'pending review', sku: 'VEG-KALE-01', ImageUrl: "https://placehold.co/100x100/CCCCCC/333333?text=Kale" },
//     { id: 8, name: 'Artisanal Soap Bar', shopId: 1, categoryId: 5, price: '600.00', stock: 0, status: 'out of stock', sku: 'BEA-SOAP-08', ImageUrl: "https://placehold.co/100x100/AAAAAA/FFFFFF?text=Soap" },
//     { id: 12, name: 'Maasai Shuka Blanket', shopId: 3, categoryId: 2, price: '3000.00', stock: 75, status: 'active', sku: 'TEX-MSB-12', ImageUrl: "https://placehold.co/100x100/CC6666/FFFFFF?text=Shuka" },
// ];

const mockGetProducts = async () => {
    const response = await Products.getProducts();
    return response;
}
// -------------------------------------

// Helper function to determine badge styling based on status
const getStatusStyles = (status) => {
    // Note: status from backend is expected to be lowercase, e.g., 'active'
    const lowerStatus = status ? status.toLowerCase() : '';
    switch (lowerStatus) {
        case 'active':
            return 'text-green-700 bg-green-100';
        case 'out of stock':
            return 'text-red-700 bg-red-100';
        case 'pending':
        case 'pending review':
            return 'text-yellow-700 bg-yellow-100';
        case 'suspended':
            return 'text-red-700 bg-red-100';
        default:
            return 'text-gray-700 bg-gray-100';
    }
};

// --- Component: Products View ---
const ProductsView = () => {
    // State to hold the fetched products
    const [products, setProducts] = useState([]);
    // State to track loading status (optional but good practice)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Using mock function to resolve the build error
                const response = await mockGetProducts();
                // Assuming response.products is the array of product objects
                setProducts(response.products || [])
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]); // Clear products on error
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts()
    }, [])

    // useeffect to fetch shops by id and also categories by id and display them
    useEffect(() => {
        const enrichProducts = async () => {
            try {
                const shoRes = await Promise.all(
                    products.map(async (product) => {
                        const shopRes = await Shop.getShopById(product.shopId);
                        const categoryRes = await Categories.getCategoryById(product.categoryId);
                        return {
                            ...product,
                            shop: shopRes?.shop,
                            category: categoryRes.category.name,
                        };
                    })
                );
                setProducts(shoRes);
            } catch (error) {
                console.error("Error enriching products:", error);
            }
        }
        if (products.length > 0) {
            enrichProducts()
        }
    }, [products])


    // Function to format KSH currency
    const formatCurrency = (amountString) => {
        // Safely convert the price string (e.g., "1500.00") to a number
        const amount = parseFloat(amountString || 0);
        return `KSH ${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)}`;
    };

    // Conditional render for loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 flex items-center space-x-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.649z"></path>
                    </svg>
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
                <Link
                    href="/adminDashboard/products/addProduct"
                    // Replaced router.push with a console log to fix Next.js dependency error
                    className="mt-4 sm:mt-0 bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-orange-700 transition duration-200"
                >
                    + Add New Product
                </Link>
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
                            {/* In a real app, these options would be fetched from the backend */}
                        </select>
                        <select className="flex-1 py-2 px-4 border border-gray-200 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500">
                            <option>All Statuses</option>
                            <option value="active">Active</option>
                            <option value="out of stock">Out of Stock</option>
                            <option value="pending review">Pending Review</option>
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
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No products found.</td>
                            </tr>
                        ) : (
                            products.map((product) => {
                                // Capitalize the status for display (e.g., "active" -> "Active")
                                // const displayStatus = product.status.charAt(0).toUpperCase() + product.status.slice(1);
                                const stockCount = product.stock || 0; // Use 0 if stock is null/undefined

                                return (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <div className="flex items-center space-x-2">
                                                <Box className="w-4 h-4 text-gray-500" />
                                                <span className="font-semibold">{product.name}</span>
                                            </div>
                                            {/* <p className="text-xs text-gray-500 flex items-center mt-1">
                                                <Tag className="w-3 h-3 mr-1" />
                                                SKU: {product.sku}
                                            </p> */}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {/* Using shopId as a placeholder for the shop name */}
                                            <p>Shop: {product?.shop?.name}</p>
                                            <p className="text-xs text-gray-500 flex items-center mt-1">
                                                <Layers className="w-3 h-3 mr-1" />
                                                {/* Using categoryId as a placeholder for the category name */}
                                                Category: {product.category}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                                            {formatCurrency(product.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`font-semibold ${stockCount === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                                                {stockCount}
                                            </span>
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(product.status)}`}>
                                                {displayStatus}
                                            </span>
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</a>
                                            <a href="#" className="text-red-600 hover:text-red-900">Archive</a>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center p-4">
                <div className="text-sm text-gray-500">Showing 1 to {products.length} of {products.length} results</div>
            </div>
        </div>
    );
};

export default ProductsView;
