'use client'
import { Check, MapPin, Search, Store, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// --- New Component: Shops View ---
const ShopsView = () => {
    // Mock data for shops
    const mockShops = [
        { id: 1, name: 'Kilimanjaro Crafts', owner: 'Jane Doe', location: 'Nairobi CBD', products: 120, status: 'Active', verified: true, date: '2023-01-15' },
        { id: 2, name: 'Mombasa Spices', owner: 'Omar Hassan', location: 'Mombasa', products: 45, status: 'Active', verified: true, date: '2023-03-20' },
        { id: 3, name: 'Rift Valley Fresh Produce', owner: 'Kiplagat A.', location: 'Nakuru', products: 22, status: 'Pending', verified: false, date: '2024-06-01' },
        { id: 4, name: 'Savage Sneakers', owner: 'Ken Kisilu', location: 'Kasarani', products: 88, status: 'Active', verified: true, date: '2022-11-01' },
    ];

    const router = useRouter();
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Active':
                return 'text-green-700 bg-green-100';
            case 'Pending':
                return 'text-yellow-700 bg-yellow-100';
            case 'Suspended':
                return 'text-red-700 bg-red-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-3xl font-bold text-gray-800">Shop Management</h2>
                <button
                    onClick={()=> router.push('/adminDashboard/shops/addShop')}
                    className="mt-4 sm:mt-0 bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-orange-700 transition duration-200"
                >
                    + Add New Shop
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                {/* Search and Filter Bar */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by shop name or owner..."
                            className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-800 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    <select className="w-full md:w-auto py-2 px-4 border border-gray-200 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500">
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
                        {mockShops.map((shop) => (
                            <tr key={shop.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex items-center space-x-2">
                                        <Store className="w-4 h-4 text-gray-500"/>
                                        <span>{shop.name}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 flex items-center mt-1">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {shop.location}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{shop.owner}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{shop.products}</td>
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
                                    <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</a>
                                    <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center p-4">
                 <div className="text-sm text-gray-500">Showing 1 to 4 of 4 results</div>
            </div>
        </div>
    );
};

export default ShopsView;