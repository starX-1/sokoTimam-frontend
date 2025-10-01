'use client'
const DealCard = ({ title, price, imageUrl }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
        <img
            src={imageUrl}
            alt={title}
            className="w-full h-32 sm:h-40 object-cover"
            // Simple image error fallback to ensure no broken images
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/cccccc/333333?text=Product"; }}
        />
        <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-800 truncate">{title}</h3>
            <p className="text-lg font-bold text-orange-600 mt-1">{price}</p>
            <button className="w-full mt-2 bg-orange-500 text-white text-xs py-1.5 rounded-lg hover:bg-orange-600 transition duration-150 shadow-md">
                Grab Deal
            </button>
        </div>
    </div>
);

export default DealCard;