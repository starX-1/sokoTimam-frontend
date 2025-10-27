'use client'
import { useRef, useEffect, useState } from "react";
import ProductCard from './ProductCard';
import Products from '../api/products/api';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const NewAndPopular = () => {
    const router = useRouter();
    const carouselRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await Products.getProducts();
                
                // Get first 10 products
                const first10 = response.products.slice(0, 10);

                // Fetch images for each product
                const productsWithImages = await Promise.all(
                    first10.map(async (product) => {
                        const detailResponse = await Products.getProductWithImages(product.id);
                        return {
                            ...product,
                            images: detailResponse.images,
                        };
                    })
                );

                setProducts(productsWithImages);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const scroll = (direction) => {
        if (carouselRef.current) {
            const scrollDistance = 400;
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollDistance : scrollDistance,
                behavior: 'smooth',
            });
        }
    };

    const checkScrollButtons = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    // Helper function to calculate discount percentage
    const calculateDiscount = (price) => {
        const discountPercent = Math.floor(Math.random() * 21) + 10;
        return discountPercent;
    };

    // Helper function to calculate original price based on discount
    const calculateOriginalPrice = (salePrice, discountPercent) => {
        return Math.round(salePrice / (1 - discountPercent / 100));
    };

    return (
        <section className="bg-gradient-to-br  from-orange-50/30 via-orange-50/20 to-white rounded rounded-lg py-8 px-4 sm:px-6 lg:px-8 border-b-8 border-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
                            New & Popular
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">Trending products just for you</p>
                    </div>
                    
                    <button 
                        onClick={() => router.push('/products')}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm hover:underline"
                    >
                        View All →
                    </button>
                </div>
                
                {loading ? (
                    <div className="py-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
                        <p className="text-gray-600 mt-3 text-sm">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-gray-600">No products available</p>
                    </div>
                ) : (
                    <div className="relative">
                        <div
                            ref={carouselRef}
                            onScroll={checkScrollButtons}
                            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1"
                        >
                            {products.map((product) => {
                                const mainImage = product.images?.find(img => img.isMain)?.imageUrl 
                                    || product.images?.[0]?.imageUrl 
                                    || 'https://placehold.co/400x300/f0f0f0/333333?text=New+Item';

                                const salePrice = parseFloat(product.price);
                                const discountPercent = calculateDiscount(salePrice);
                                const originalPrice = calculateOriginalPrice(salePrice, discountPercent);

                                return (
                                    <ProductCard 
                                        key={product.id}
                                        title={product.name}
                                        originalPrice={originalPrice.toLocaleString()}
                                        salePrice={salePrice.toLocaleString()}
                                        discount={`${discountPercent}%`}
                                        imageUrl={mainImage}
                                        product={product}
                                    />
                                );
                            })}
                        </div>

                        {/* Navigation Arrows */}
                        {canScrollLeft && (
                            <button
                                onClick={() => scroll('left')}
                                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-xl p-3 rounded-full hover:bg-orange-50 transition-all duration-200 hover:scale-110"
                            >
                                <ChevronLeft className="w-5 h-5 text-orange-600" />
                            </button>
                        )}

                        {canScrollRight && (
                            <button
                                onClick={() => scroll('right')}
                                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-xl p-3 rounded-full hover:bg-orange-50 transition-all duration-200 hover:scale-110"
                            >
                                <ChevronRight className="w-5 h-5 text-orange-600" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
};

export default NewAndPopular;