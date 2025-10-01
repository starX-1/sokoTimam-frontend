// / --- Reusable Product Card Component for Carousels/Grids ---
const ProductCard = ({ title, originalPrice, salePrice, discount, imageUrl }) => (
    // Card width set responsively: w-[45vw] (approx 2 cards + spacing on mobile), fixed width on desktop
    <div className="flex-shrink-0 w-[45vw] sm:w-[200px] lg:w-[240px] bg-white border border-gray-100 rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-xl duration-300 cursor-pointer">
        <div className="relative">
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-36 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/f0f0f0/333333?text=New+Item"; }}
            />
            {/* Discount Badge */}
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                -{discount}
            </span>
        </div>
        <div className="p-3">
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10">{title}</h3>
            <div className="flex items-end mt-2">
                <span className="text-lg font-bold text-orange-600">KSh {salePrice}</span>
                <span className="text-xs text-gray-400 line-through ml-2">KSh {originalPrice}</span>
            </div>
            <button className="w-full mt-3 bg-orange-500 text-white text-xs py-1.5 rounded-lg hover:bg-orange-600 transition duration-150 shadow-md">
                Add to Cart
            </button>
        </div>
    </div>
);


export default ProductCard;