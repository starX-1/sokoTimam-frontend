'use client'
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useState } from 'react';

const DealCard = ({ title, price, originalPrice, discount, rating, reviewCount, imageUrl, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Generate star rating display
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <>
                {'★'.repeat(fullStars)}
                {hasHalfStar && '☆'}
                {'☆'.repeat(emptyStars)}
            </>
        );
    };

    return (
        <div
            className="group mt-4 relative bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Discount Badge */}
            {discount && (
                <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {discount}
                </div>
            )}

            {/* Quick Action Buttons */}
            <div className={`absolute top-2 right-2 z-10 flex flex-col gap-1.5 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all duration-300 hover:scale-110"
                >
                    <Heart size={14} />
                </button>
                {/* <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all duration-300 hover:scale-110"
                >
                    <Eye size={14} />
                </button> */}
            </div>

            {/* Image Container */}
            <div className="relative h-32 sm:h-36 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x400/f3f4f6/9ca3af?text=Product";
                    }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            {/* Product Details */}
            <div className="relative p-2.5">
                <h3 className="text-xs font-semibold text-gray-800 mb-1.5 line-clamp-2 min-h-[2rem] leading-tight">
                    {title}
                </h3>

                <div className="flex items-center gap-1.5 mb-2">
                    <p className="text-base font-bold text-gray-900">
                        {price}
                    </p>
                    {originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">{originalPrice}</span>
                    )}
                </div>

                <button
                    className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium text-xs transition-all duration-300 ${isHovered
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                            : 'bg-orange-50 text-orange-600 border border-orange-200'
                        }`}
                >
                    <ShoppingCart size={14} />
                    <span>Add to Cart</span>
                </button>

                <div className={`mt-2 flex items-center justify-between text-[10px] text-gray-500 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'
                    }`}>
                    <span className="flex items-center gap-0.5">
                        <span className="text-yellow-500">{renderStars(rating)}</span>
                    </span>
                    <span className="text-gray-400">({reviewCount})</span>
                </div>
            </div>

            <div className={`absolute inset-0 rounded-xl border-2 border-orange-500/0 transition-all duration-300 pointer-events-none ${isHovered ? 'border-orange-500/50' : ''
                }`} />
        </div>
    );
};

export default DealCard;