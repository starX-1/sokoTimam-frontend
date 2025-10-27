'use client'
import { useEffect, useState } from 'react';
import DealCard from './DealCard';
import Products from '../api/products/api';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

// Countdown Timer Component
const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 15, seconds: 13 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                
                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                }
                
                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-1 text-white text-sm sm:text-base font-medium">
            <span>Time Left:</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>
            <span>:</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
            <span>:</span>
            <span className="bg-white/20 px-2 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
    );
};

const DealsOfTheWeek = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleProductClick = (productId) => {
        router.push(`/Customer/product/${productId}`);
    };

    // Generate random discount between min and max percentage
    const generateRandomDiscount = (min = 10, max = 70) => {
        const discount = Math.floor(Math.random() * (max - min + 1)) + min;
        return discount;
    };

    // Generate random rating between 3.5 and 5.0
    const generateRandomRating = () => {
        return (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
    };

    // Generate random review count
    const generateRandomReviewCount = () => {
        return Math.floor(Math.random() * (500 - 10 + 1)) + 10;
    };

    // Generate random items left
    const generateRandomItemsLeft = () => {
        return Math.floor(Math.random() * (99 - 5 + 1)) + 5;
    };

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await Products.getProducts();
                console.log("this is the response", response);

                // Get first 6 products for horizontal scroll
                const firstProducts = response.products.slice(0, 6);
                setDeals(firstProducts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    useEffect(() => {
        // Only run this if deals have been fetched and don't already have images
        if (deals.length === 0 || deals.some(p => p.images)) return;

        const fetchProductImages = async () => {
            const enrichedProducts = await Promise.all(
                deals.map(async (product) => {
                    const response = await Products.getProductWithImages(product.id);
                    return {
                        ...product,
                        images: response.images,
                    };
                })
            );
            setDeals(enrichedProducts);
        };

        fetchProductImages();
    }, [deals]);

    console.log(deals);

    return (
        <section className="bg-white mt-1 rounded rounded-lg py-4 px-4 sm:px-6 lg:px-8 border-b-8 border-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Flash Sale Header */}
                <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-lg px-4 py-3 mb-4 shadow-md">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🔥</span>
                            <h2 className="text-lg sm:text-xl font-bold text-white">
                               Deals of the Week
                            </h2>
                        </div>
                        
                        {/* <CountdownTimer /> */}
                        
                        <button 
                            onClick={() => router.push('/deals')}
                            className="flex items-center gap-1 text-white hover:underline text-sm font-medium"
                        >
                            See All
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
                        <p className="text-gray-600 mt-3 text-sm">Loading deals...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
                        <div className="flex gap-3 sm:gap-4 min-w-max">
                            {deals.map((product) => {
                                // Get the main image or fallback to first image
                                const mainImage = product.images?.find(img => img.isMain)?.imageUrl
                                    || product.images?.[0]?.imageUrl
                                    || '';

                                if (!mainImage) {
                                    return (
                                        <div key={product.id} className="w-44 sm:w-48 flex-shrink-0 bg-white rounded-lg overflow-hidden animate-pulse border border-gray-200">
                                            <div className="h-40 sm:h-44 bg-gray-200"></div>
                                            <div className="p-3 space-y-2">
                                                <div className="h-3 bg-gray-200 rounded"></div>
                                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    );
                                }

                                // Generate random discount and calculate prices
                                const discountPercentage = generateRandomDiscount(10, 70);
                                const currentPrice = parseFloat(product.price);
                                const originalPrice = currentPrice / (1 - discountPercentage / 100);

                                // Generate random rating and review count
                                const rating = parseFloat(generateRandomRating());
                                const reviewCount = generateRandomReviewCount();
                                const itemsLeft = generateRandomItemsLeft();

                                return (
                                    <div
                                        key={product.id}
                                        className="w-44 sm:w-48 flex-shrink-0"
                                    >
                                        <DealCard
                                            title={product.name}
                                            price={`KSh ${currentPrice.toLocaleString()}`}
                                            originalPrice={`KSh ${Math.round(originalPrice).toLocaleString()}`}
                                            discount={`-${discountPercentage}%`}
                                            rating={rating}
                                            reviewCount={reviewCount}
                                            itemsLeft={itemsLeft}
                                            imageUrl={mainImage}
                                            onClick={() => handleProductClick(product.id)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
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

export default DealsOfTheWeek;