'use client'
import { useEffect, useState, useRef } from 'react';
import { Search, Package, Check, X, Eye, Truck, User } from 'lucide-react';
import { getSession } from 'next-auth/react';
import Orders from '../../api/Orders/api'
import Users from '../../api/user/api'
import Products from '../../api/products/api'
import { useShop } from '../../Hooks/ShopContext';

const SellerOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const { shops } = useShop();
    const hasEnrichedOrders = useRef(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const session = await getSession();
            setUser(session?.user || null);
        };
        fetchUserData();
    }, []);

    // Fetch seller orders from backend 
    useEffect(() => {
        const fetchOrders = async () => {
            if (!shops?.[0]?.sellerId || !user?.accessToken) return;

            try {
                setIsLoading(true);
                const response = await Orders.getSellerOrders(shops[0].sellerId, user.accessToken);

                if (response?.data) {
                    // Transform backend data to match component expectations
                    const transformedOrders = response.data.map(order => ({
                        id: `ORD-${String(order.id).padStart(3, '0')}`,
                        orderId: order.id,
                        customerName: 'Customer',
                        customerEmail: 'customer@example.com',
                        customerPhone: 'N/A',
                        orderDate: order.createdAt,
                        paymentStatus: order.paymentStatus,
                        shippingStatus: order.status,
                        totalAmount: order.totalAmount,
                        itemCount: order.items?.length || 0,
                        items: order.items?.map(item => ({
                            name: `Product #${item.productId}`,
                            quantity: item.quantity,
                            price: item.price,
                            orderItemId: item.orderItemId,
                            productId: item.productId
                        })) || [],
                        shippingAddress: order.shippingAddress,
                        notes: '',
                        shippedDate: order.updatedAt,
                        userId: order.userId,
                        enriched: false
                    }));

                    setOrders(transformedOrders);
                    hasEnrichedOrders.current = false; // Reset flag when new orders arrive
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [shops, user]);

    // Fetch user and product details for each order - runs ONCE after initial fetch
    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!user?.accessToken || orders.length === 0 || hasEnrichedOrders.current) return;

            try {
                setIsLoading(true);
                const promises = orders.map(async order => {
                    try {
                        // Fetch user details
                        const userResponse = await Users.getUserById(order.userId);

                        // Fetch product details for each item
                        const productResponses = await Promise.all(
                            order.items.map(async item => {
                                try {
                                    return await Products.getProductWithImages(item.productId);
                                } catch (error) {
                                    console.error(`Error fetching product ${item.productId}:`, error);
                                    return null;
                                }
                            })
                        );

                        return {
                            ...order,
                            customerName: userResponse?.user?.firstname || 'Unknown Customer',
                            customerEmail: userResponse?.user?.email || 'N/A',
                            customerPhone: userResponse?.user?.phone || 'N/A',
                            items: order.items.map((item, idx) => ({
                                ...item,
                                name: productResponses[idx]?.name || `Product #${item.productId}`,
                                price: productResponses[idx]?.price || item.price,
                                image: productResponses[idx]?.images?.[0] || null
                            })),
                            enriched: true
                        };
                    } catch (error) {
                        console.error(`Error fetching details for order ${order.orderId}:`, error);
                        return { ...order, enriched: true };
                    }
                });

                const updatedOrders = await Promise.all(promises);
                setOrders(updatedOrders);
                hasEnrichedOrders.current = true; // Prevent re-running
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [user?.accessToken, orders.length]); // Changed dependency




    const handleShippingStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.orderId === orderId
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
        switch (status?.toLowerCase()) {
            case 'shipped':
                return 'text-green-700 bg-green-100';
            case 'pending':
                return 'text-yellow-700 bg-yellow-100';
            case 'cancelled':
                return 'text-red-700 bg-red-100';
            case 'delivered':
                return 'text-blue-700 bg-blue-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };

    const getPaymentStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'text-green-700 bg-green-100';
            case 'unpaid':
                return 'text-red-700 bg-red-100';
            case 'pending':
                return 'text-yellow-700 bg-yellow-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };

    const formatCurrency = (amount) => {
        const num = parseFloat(amount) || 0;
        return num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = filterStatus === 'all' || order.shippingStatus === filterStatus;
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase());
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
                    Loading Orders...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Package className="w-8 h-8 text-orange-600" />
                        Orders Management
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">View and manage all orders from your shop</p>
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
                    <p className="text-2xl font-bold text-purple-700 mt-1">KSH {formatCurrency(orders.reduce((acc, o) => acc + parseFloat(o.totalAmount), 0))}</p>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                {/* Search and Filter */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 gap-3">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID, address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 border border-gray-200 text-gray-700 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500 outline-none"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full md:w-48 py-2 px-4 border border-gray-200 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping</th>
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
                                <tr key={order.orderId} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        <div className="flex items-center space-x-2">
                                            <Package className="w-4 h-4 text-orange-600" />
                                            <span>{order.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <User className="w-4 h-4 text-orange-600" />
                                            <div className="flex flex-col">
                                                <span>{order.customerName}</span>
                                                <p>{order.customerEmail}</p>
                                            </div>
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
                                        KSH {formatCurrency(order.totalAmount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getPaymentStatusStyles(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
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
                            {/* Order Status Overview */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 font-medium">Payment Status</p>
                                    <span className={`px-3 py-1 mt-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getPaymentStatusStyles(selectedOrder.paymentStatus)}`}>
                                        {selectedOrder.paymentStatus}
                                    </span>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 font-medium">Shipping Status</p>
                                    <span className={`px-3 py-1 mt-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getShippingStatusStyles(selectedOrder.shippingStatus)}`}>
                                        {selectedOrder.shippingStatus === 'shipped' && <Truck className="w-3 h-3 mr-1" />}
                                        {selectedOrder.shippingStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Shipping Address</h4>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h4>
                                <div className="space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                                            {/* Product Image */}
                                            {item.image && (
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.image.imageUrl}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                                                    />
                                                </div>
                                            )}

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-semibold text-gray-900">KSH {formatCurrency(item.price)}</p>
                                                <p className="text-xs text-gray-500">per unit</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h4>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Order Date:</span>
                                        <span className="font-medium">{formatDate(selectedOrder.orderDate)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Last Updated:</span>
                                        <span className="font-medium">{formatDate(selectedOrder.shippedDate)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700 border-t border-gray-200 pt-3 mt-3">
                                        <span className="font-semibold">Total Amount:</span>
                                        <span className="font-bold text-green-600 text-lg">KSH {formatCurrency(selectedOrder.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Status Management */}
                            {selectedOrder.paymentStatus === 'paid' && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Update Shipping Status</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.shippingStatus === 'pending' ? (
                                            <button
                                                onClick={() => {
                                                    handleShippingStatusChange(selectedOrder.orderId, 'shipped');
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
                                    </div>
                                </div>
                            )}

                            {selectedOrder.paymentStatus === 'unpaid' && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-700 font-medium">⚠ Payment not received yet. Order cannot be shipped.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerOrdersPage