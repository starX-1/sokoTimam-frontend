'use client'
import { useEffect, useState } from 'react';
import DealCard from './DealCard';
import { useRouter } from 'next/navigation';
import { ChevronRight, Clock } from 'lucide-react';
import FlashSales from '../api/flashsale/api'
import Products from '../api/products/api'

// Countdown Timer Component for individual products with EAT timezone support
const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: false
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const endDate = new Date(endTime);
            const now = new Date();

            // EAT is UTC+3, so add 3 hours to current UTC time
            const eatOffset = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
            const currentTimeInEAT = now.getTime() + eatOffset;

            const difference = endDate.getTime() - currentTimeInEAT;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                    expired: false
                });
            } else {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    expired: true
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    if (timeLeft.expired) {
        return (
            <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                <Clock size={12} />
                <span>Expired</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1 text-xs font-medium text-orange-600">
            <Clock size={12} />
            <div className="flex gap-1">
                {timeLeft.days > 0 && (
                    <span className="bg-orange-100 px-1.5 py-0.5 rounded">
                        {timeLeft.days}d
                    </span>
                )}
                <span className="bg-orange-100 px-1.5 py-0.5 rounded">
                    {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span className="bg-orange-100 px-1.5 py-0.5 rounded">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span className="bg-orange-100 px-1.5 py-0.5 rounded">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
            </div>
        </div>
    );
};

const DealsOfTheWeek = () => {
    const [flashSales, setFlashSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchFlashSales = async () => {
            try {
                console.log('Fetching flash sales...');
                const response = await FlashSales.getFlashSales();
                console.log('Flash sales response:', response);

                if (response && response.data && Array.isArray(response.data)) {
                    // Fetch images for each product
                    const flashSalesWithImages = await Promise.all(
                        response.data.map(async (flashSale) => {
                            try {
                                const imageRes = await Products.getProductImagesById(flashSale.product.id);
                                console.log('image', imageRes)
                                const mainImage = imageRes && imageRes.images.length > 0 ? imageRes.images?.[0].imageUrl : null;
                                return {
                                    ...flashSale,
                                    productImage: mainImage
                                };
                            } catch (error) {
                                console.error(`Error fetching images for product ${flashSale.product.id}:`, error);
                                return flashSale;
                            }
                        })
                    );

                    setFlashSales(flashSalesWithImages);
                    console.log('Flash sales with images set:', flashSalesWithImages);
                } else {
                    console.warn('Unexpected response format:', response);
                    setFlashSales([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching flash sales:", error);
                setFlashSales([]);
                setLoading(false);
            }
        };
        fetchFlashSales();
    }, []);

    const handleProductClick = (productId) => {
        router.push(`/Customer/product/${productId}`);
    };

    // Generate random rating between 3.5 and 5.0
    const generateRandomRating = () => {
        return (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
    };

    // Generate random review count
    const generateRandomReviewCount = () => {
        return Math.floor(Math.random() * (500 - 10 + 1)) + 10;
    };

    // Generate random items left based on stock limit
    const generateRandomItemsLeft = (stockLimit) => {
        const remaining = Math.floor(Math.random() * stockLimit) + 1;
        return Math.min(remaining, stockLimit);
    };

    return (
        <section className="bg-white mt-1 rounded rounded-lg py-4 px-4 sm:px-6 lg:px-8 border-b-8 border-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Flash Sale Header */}
                <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-lg px-4 py-3 mb-4 shadow-md">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🔥</span>
                            <h2 className="text-lg sm:text-xl font-bold text-white">
                                Flash Sales
                            </h2>
                        </div>

                        <button
                            onClick={() => router.push('/flashsales')}
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
                        <p className="text-gray-600 mt-3 text-sm">Loading flash sales...</p>
                    </div>
                ) : flashSales.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-sm">No active flash sales at the moment</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
                        <div className="flex gap-3 sm:gap-4 min-w-max">
                            {flashSales.map((flashSale) => {
                                const product = flashSale.product;
                                const mainImage = flashSale.productImage || '';

                                if (!mainImage) {
                                    return (
                                        <div key={flashSale.id} className="w-44 sm:w-48 flex-shrink-0 bg-white rounded-lg overflow-hidden animate-pulse border border-gray-200">
                                            <div className="h-40 sm:h-44 bg-gray-200"></div>
                                            <div className="p-3 space-y-2">
                                                <div className="h-3 bg-gray-200 rounded"></div>
                                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    );
                                }

                                const rating = parseFloat(generateRandomRating());
                                const reviewCount = generateRandomReviewCount();
                                const itemsLeft = generateRandomItemsLeft(flashSale.stockLimit);

                                return (
                                    <div
                                        key={flashSale.id}
                                        className="w-44 sm:w-48 flex-shrink-0"
                                    >
                                        <DealCard
                                            title={product.name}
                                            price={`KSh ${parseFloat(flashSale.discountPrice).toLocaleString()}`}
                                            originalPrice={`KSh ${parseFloat(product.price).toLocaleString()}`}
                                            discount={`-${flashSale.discountPercent}%`}
                                            rating={rating}
                                            reviewCount={reviewCount}
                                            itemsLeft={itemsLeft}
                                            imageUrl={mainImage}
                                            onClick={() => handleProductClick(product.id)}
                                            countdown={<CountdownTimer endTime={flashSale.endTime} />}
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