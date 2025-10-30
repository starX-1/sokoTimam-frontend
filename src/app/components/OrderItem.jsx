const OrderItem = ({ item }) => (
    <div className="flex items-center space-x-3 py-2">
        <img
            src={item.image.imageUrl}
            alt={item.name}
            className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/64x64/f3f4f6/6b7280?text=Product";
            }}
        />
        <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-800 truncate">{item.name}</h4>
            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            <p className="text-sm font-semibold text-gray-900">KSH {item.price.toLocaleString()}</p>
        </div>
    </div>
);
export default OrderItem;