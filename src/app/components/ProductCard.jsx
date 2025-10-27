'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Eye } from "lucide-react";

const ProductCard = ({ title, originalPrice, salePrice, discount, imageUrl, product }) => {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const handleProductClick = (productId) => {
        router.push(`/Customer/product/${productId}`);
    };

    return (
        <div 
            className="flex-shrink-0 mt-4 w-[160px] sm:w-[180px] lg:w-[200px] bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer border border-gray-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => handleProductClick(product.id)}
        >
            {/* Image Container */}
            <div className="relative h-[180px] sm:h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/400x400/f3f4f6/9ca3af?text=Product"; 
                    }}
                />
                
                {/* Discount Badge */}
                {discount && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
                        -{discount}
                    </div>
                )}

                {/* Quick Actions */}
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

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/10 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            {/* Product Details */}
            <div className="p-3">
                <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight mb-2">
                    {title}
                </h3>

                {/* Pricing */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-base font-bold text-gray-900">
                        KSh {salePrice}
                    </span>
                    {originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                            KSh {originalPrice}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart logic here
                    }}
                    disabled={product.stock === 0}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg font-medium text-xs transition-all duration-300 ${
                        isHovered 
                            ? 'bg-gradient-to-r from-orange-500 to-orange-500 text-white shadow-lg shadow-orange-500/30' 
                            : 'bg-orange-50 text-orange-600 border border-orange-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <ShoppingCart size={14} />
                    <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>

                {/* Rating Stars */}
                <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-yellow-500">★★★★☆</span>
                    <span className="text-gray-400">(4.2)</span>
                </div>
            </div>

            {/* Border Glow on Hover */}
            <div className={`absolute inset-0 rounded-xl border-2 border-orange-500/0 transition-all duration-300 pointer-events-none ${
                isHovered ? 'border-orange-500/50' : ''
            }`} />
        </div>
    );
};

export default ProductCard;