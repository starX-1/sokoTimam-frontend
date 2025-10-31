'use client'
import { useEffect, useState } from 'react';
import { Search, Package, Check, X, Eye, Truck } from 'lucide-react';

const SellerOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Mock orders data
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setOrders([
                {
                    id: 'ORD-001',
                    customerName: 'John Kariuki',
                    customerEmail: 'john@example.com',
                    customerPhone: '+254712345678',
                    orderDate: '2025-10-31T14:30:00',
                    paymentStatus: 'paid',
                    shippingStatus: 'pending',
                    totalAmount: '12,450',
                    itemCount: 3,
                    items: [
                        { name: 'Premium Beef Steak', quantity: 2, price: '1,500' },
                        { name: 'Fresh Tomatoes', quantity: 1, price: '450' },
                    ],
                    shippingAddress: '123 Kiambu Road, Nairobi',
                    notes: 'Please handle with care',
                },
                {
                    id: 'ORD-002',
                    customerName: 'Sarah Njoroge',
                    customerEmail: 'sarah@example.com',
                    customerPhone: '+254723456789',
                    orderDate: '2025-10-30T10:15:00',
                    paymentStatus: 'paid',
                    shippingStatus: 'shipped',
                    totalAmount: '8,900',
                    itemCount: 2,
                    items: [
                        { name: 'Maasai Shuka Blanket', quantity: 1, price: '3,000' },
                        { name: 'Beaded Bracelet', quantity: 5, price: '600' },
                    ],
                    shippingAddress: '456 Westlands Avenue, Nairobi',
                    notes: 'Express delivery',
                    shippedDate: '2025-10-31T08:00:00',
                },
                {
                    id: 'ORD-003',
                    customerName: 'David Mwangi',
                    customerEmail: 'david@example.com',
                    customerPhone: '+254734567890',
                    orderDate: '2025-10-29T16:45:00',
                    paymentStatus: 'paid',
                    shippingStatus: 'pending',
                    totalAmount: '5,650',
                    itemCount: 2,
                    items: [
                        { name: 'Organic Kale Bundle', quantity: 3, price: '250' },
                        { name: 'Fresh Lettuce', quantity: 2, price: '200' },
                    ],
                    shippingAddress: '789 Langata Road, Nairobi',
                    notes: '',
                },
                {
                    id: 'ORD-004',
                    customerName: 'Grace Kipchoge',
                    customerEmail: 'grace@example.com',
                    customerPhone: '+254745678901',
                    orderDate: '2025-10-28T09:20:00',
                    paymentStatus: 'paid',
                    shippingStatus: 'shipped',
                    totalAmount: '15,200',
                    itemCount: 4,
                    items: [
                        { name: 'Artisanal Soap Bar', quantity: 10, price: '600' },
                        { name: 'Shea Butter Lotion', quantity: 5, price: '800' },
                    ],
                    shippingAddress: '321 Valley Road, Nairobi',
                    notes: 'Fragile - beauty products',
                    shippedDate: '2025-10-29T11:30:00',
                },
                {
                    id: 'ORD-005',
                    customerName: 'Peter Ochieng',
                    customerEmail: 'peter@example.com',
                    customerPhone: '+254756789012',
                    orderDate: '2025-10-27T13:00:00',
                    paymentStatus: 'paid',
                    shippingStatus: 'pending',
                    totalAmount: '22,800',
                    itemCount: 5,
                    items: [
                        { name: 'Premium Beef Steak', quantity: 3, price: '1,500' },
                        { name: 'Chicken Breast', quantity: 2, price: '1,200' },
                        { name: 'Fresh Vegetables Mix', quantity: 1, price: '800' },
                    ],
                    shippingAddress: '654 Upper Hill, Nairobi',
                    notes: 'Keep refrigerated',
                },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    const handleShippingStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId
                ? {
                    ...order,
                    shippingStatus: newStatus,
                    shippedDate: newStatus === 'shipped' ? new Date().toISOString() : order.shippedDate,
                }
                : order
        ));
        setSelectedOrder(null);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getShippingStatusStyles = (status) => {
        switch (status) {
            case 'shipped':
                return 'text-green-700 bg-green-100';
            case 'pending':
                return 'text-yellow-700 bg-yellow-100';
            case 'cancelled':
                return 'text-red-700 bg-red-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = filterStatus === 'all' || order.shippingStatus === filterStatus;
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Package className="w-8 h-8 text-orange-600" />
                        Orders Management
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">View and manage all paid orders from your shop</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm border border-blue-200">
                    <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">{orders.length}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 shadow-sm border border-yellow-200">
                    <p className="text-gray-600 text-sm font-medium">Pending Shipment</p>
                    <p className="text-2xl font-bold text-yellow-700 mt-1">{orders.filter(o => o.shippingStatus === 'pending').length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm border border-green-200">
                    <p className="text-gray-600 text-sm font-medium">Shipped Orders</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">{orders.filter(o => o.shippingStatus === 'shipped').length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm border border-purple-200">
                    <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-purple-700 mt-1">KSH {orders.reduce((acc, o) => acc + parseInt(o.totalAmount.replace(',', '')), 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                {/* Search and Filter */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID, customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full md:w-48 py-2 px-4 border border-gray-200 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending Shipment</option>
                        <option value="shipped">Shipped</option>
                    </select>
                </div>

                {/* Table */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        <div className="flex items-center space-x-2">
                                            <Package className="w-4 h-4 text-orange-600" />
                                            <span>{order.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div>
                                            <p className="font-medium">{order.customerName}</p>
                                            <p className="text-xs text-gray-500">{order.customerEmail}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(order.orderDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-semibold">
                                            {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                        KSH {order.totalAmount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getShippingStatusStyles(order.shippingStatus)}`}>
                                            {order.shippingStatus === 'shipped' && <Truck className="w-3 h-3 mr-1" />}
                                            {order.shippingStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowModal(true);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-900 transition inline-flex items-center gap-1"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center p-4">
                <div className="text-sm text-gray-500">Showing {filteredOrders.length} of {orders.length} results</div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">{selectedOrder.id}</h3>
                                <p className="text-orange-100 text-sm">Order Details</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white hover:bg-orange-800 p-2 rounded-lg transition"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h4>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <p><span className="font-medium text-gray-700">Name:</span> {selectedOrder.customerName}</p>
                                    <p><span className="font-medium text-gray-700">Email:</span> {selectedOrder.customerEmail}</p>
                                    <p><span className="font-medium text-gray-700">Phone:</span> {selectedOrder.customerPhone}</p>
                                    <p><span className="font-medium text-gray-700">Address:</span> {selectedOrder.shippingAddress}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h4>
                                <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center pb-2 border-b border-gray-200 last:border-b-0">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-gray-900">KSH {item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h4>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Order Date:</span>
                                        <span className="font-medium">{formatDate(selectedOrder.orderDate)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 border-t border-gray-200 pt-2 mt-2">
                                        <span className="font-semibold">Total Amount:</span>
                                        <span className="font-bold text-green-600 text-lg">KSH {selectedOrder.totalAmount}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Special Notes */}
                            {selectedOrder.notes && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Special Notes</h4>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-gray-700">{selectedOrder.notes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Shipping Status Management */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Update Shipping Status</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                        <div>
                                            <p className="font-medium text-gray-900">Current Status:</p>
                                            <span className={`px-3 py-1 mt-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getShippingStatusStyles(selectedOrder.shippingStatus)}`}>
                                                {selectedOrder.shippingStatus === 'shipped' && <Truck className="w-3 h-3 mr-1" />}
                                                {selectedOrder.shippingStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {selectedOrder.shippingStatus === 'pending' ? (
                                        <button
                                            onClick={() => {
                                                handleShippingStatusChange(selectedOrder.id, 'shipped');
                                                setShowModal(false);
                                            }}
                                            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-5 h-5" />
                                            Mark as Shipped
                                        </button>
                                    ) : (
                                        <div className="text-center py-3 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-green-700 font-medium">✓ Order shipped on {formatDate(selectedOrder.shippedDate)}</p>
                                        </div>
                                    )}

                                    {selectedOrder.shippingStatus === 'shipped' && (
                                        <button
                                            onClick={() => {
                                                handleShippingStatusChange(selectedOrder.id, 'pending');
                                                setShowModal(false);
                                            }}
                                            className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition flex items-center justify-center gap-2"
                                        >
                                            <X className="w-5 h-5" />
                                            Mark as Not Yet Shipped
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerOrdersPage