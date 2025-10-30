import { Download, Eye, Star } from "lucide-react";
import OrderStatusBadge from "./OerderStatus";
import OrderItem from "./OrderItem";
const OrderCard = ({ order }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Order Header */}
        <div className="flex flex-col space-y-2 mb-3">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-800">Order #{order.id}</h3>
                    <p className="text-xs text-gray-500">{order.date}</p>
                </div>
                <div className="flex-shrink-0">
                    <OrderStatusBadge status={order.status} />
                </div>
            </div>
        </div>

        {/* Order Items */}
        <div className="mb-3 pb-3 border-b border-gray-100">
            {order.items.slice(0, 2).map((item, index) => (
                <OrderItem key={index} item={item} />
            ))}
            {order.items.length > 2 && (
                <p className="text-xs text-gray-500 text-center py-2">
                    +{order.items.length - 2} more items
                </p>
            )}
        </div>

        {/* Order Footer */}
        <div className="flex items-center justify-between mb-3">
            <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-lg font-bold text-gray-900">KSH {order.total.toLocaleString()}</p>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150">
                <Eye className="w-3 h-3 mr-1" />
                View
            </button>
            {order.status === 'delivered' && (
                <button className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition duration-150">
                    <Star className="w-3 h-3 mr-1" />
                    Rate
                </button>
            )}
            <button className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150">
                <Download className="w-3 h-3 mr-1" />
                Invoice
            </button>
        </div>
    </div>
);
export default OrderCard;