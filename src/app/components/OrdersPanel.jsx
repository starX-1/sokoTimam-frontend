'use client'
import OrderCard from "./OrderCard";
import { ShoppingBag, Clock, CheckCircle, Truck } from "lucide-react";
import { useState } from "react";

const MyOrdersPanel = ({ orders }) => {

    const [filter, setFilter] = useState('all');

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    return (
        <div className="space-y-4">
            {/* Orders Header */}
            <div className="flex flex-col">
                <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
                <p className="text-sm text-gray-600 mt-1">Manage and track your orders</p>
            </div>

            {/* Order Filters */}
            <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((filterType) => (
                    <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition duration-150 ${filter === filterType
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-3">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-base font-medium text-gray-900 mb-1">No orders found</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {filter === 'all'
                                ? "You haven't placed any orders yet."
                                : `No ${filter} orders found.`}
                        </p>
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-150 font-medium text-sm">
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>

            {/* Order Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center">
                        <Clock className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs text-blue-600">Processing</p>
                            <p className="text-xl font-bold text-blue-900">
                                {orders.filter(o => o.status === 'processing').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                        <CheckCircle className="w-6 h-6 text-green-600 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs text-green-600">Delivered</p>
                            <p className="text-xl font-bold text-green-900">
                                {orders.filter(o => o.status === 'delivered').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center">
                        <Truck className="w-6 h-6 text-purple-600 mr-2 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs text-purple-600">Total</p>
                            <p className="text-xl font-bold text-purple-900">{orders.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPanel;