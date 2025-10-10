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


        const handleProductClick = (productId) => {
        router.push(`/Customer/product/${productId}`);
    };

    const scroll = (direction) => {
        if (carouselRef.current) {
            const scrollDistance = window.innerWidth < 640 ? window.innerWidth * 0.9 : 800;

            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollDistance : scrollDistance,
                behavior: 'smooth',
            });
        }
    };

    // Helper function to calculate discount percentage
    const calculateDiscount = (price) => {
        // Generate a realistic discount between 10-30%
        const discountPercent = Math.floor(Math.random() * 21) + 10; // 10-30%
        return discountPercent;
    };

    // Helper function to calculate original price based on discount
    const calculateOriginalPrice = (salePrice, discountPercent) => {
        return Math.round(salePrice / (1 - discountPercent / 100));
    };

    return (
        <section className="bg-white py-8 px-0 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl text-orange-950 font-bold mb-6 px-4">New & Popular</h2>
                
                {loading ? (
                    <div className="px-4 py-8 text-center">
                        <p className="text-gray-600">Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <p className="text-gray-600">No products available</p>
                    </div>
                ) : (
                    <div className="relative">
                        <div
                            ref={carouselRef}
                            className="flex space-x-4 overflow-x-scroll scrollbar-hide snap-x snap-mandatory px-4 py-2"
                        >
                            {products.map((product) => {
                                // Get main image
                                const mainImage = product.images?.find(img => img.isMain)?.imageUrl 
                                    || product.images?.[0]?.imageUrl 
                                    || 'https://placehold.co/400x300/f0f0f0/333333?text=New+Item';

                                // Calculate discount and prices
                                const salePrice = parseFloat(product.price);
                                const discountPercent = calculateDiscount(salePrice);
                                const originalPrice = calculateOriginalPrice(salePrice, discountPercent);

                                return (
                                    <div key={product.id} className="snap-start">
                                        <ProductCard 
                                            title={product.name}
                                            originalPrice={originalPrice.toLocaleString()}
                                            salePrice={salePrice.toLocaleString()}
                                            discount={`${discountPercent}%`}
                                            imageUrl={mainImage}
                                            product={product}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Carousel Arrows */}
                        <button
                            className="absolute left-0 z-10 bg-white bg-opacity-90 p-2 rounded-full shadow-lg ml-2 hover:bg-opacity-100 transition top-1/2 transform -translate-y-1/2 hidden sm:block"
                            onClick={() => scroll('left')}
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        
                        <button
                            className="absolute right-0 z-10 bg-white bg-opacity-90 p-2 rounded-full shadow-lg mr-2 hover:bg-opacity-100 transition top-1/2 transform -translate-y-1/2 hidden sm:block"
                            onClick={() => scroll('right')}
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewAndPopular;