import { CheckCircle, Clock, Truck, XCircle } from "lucide-react";

const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
        delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
        processing: { color: 'bg-blue-100 text-blue-800', icon: Clock },
        shipped: { color: 'bg-purple-100 text-purple-800', icon: Truck },
        cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
        pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <IconComponent className="w-3 h-3 mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default OrderStatusBadge;