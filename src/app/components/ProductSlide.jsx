'use client'
import {
    ChevronLeft, ChevronRight, Package, Smartphone, Tv, Home,
    ShoppingBag, Gamepad2, ShoppingCart, Baby, Grid3x3, Truck,
    Shirt, Watch, Zap, Cookie, Luggage, Factory, Gem // Added more icons for better mapping
} from "lucide-react";
import { useEffect, useState } from "react";
import Products from '../api/products/api';
import { useRouter } from "next/navigation";
import Categories from "../api/categories/api";

// --- 1. ICON MAPPING LOGIC ---
const categoryIconMap = {
    // Exact Matches (for general platform-wide categories)
    "Official Stores": Factory,
    "Supermarket": ShoppingCart,
    "Baby Products": Baby,
    "Other categories": Grid3x3,

    // Keyword Matches (Case-insensitive check for shop-specific names)
    "phone": Smartphone,
    "tablet": Smartphone,
    "tv": Tv,
    "audio": Tv,
    "appliance": Home,
    "home": Home,
    "office": Home,
    "beauty": ShoppingBag,
    "health": ShoppingBag,
    "fashion": Shirt,
    "shoe": Shirt,
    "watch": Watch,
    "game": Gamepad2,
    "computer": Gamepad2,
    "electronic": Zap,
    "flour": Cookie,
    "luggage": Luggage,
    "jewelry": Gem,
    "jewellery": Gem,
    "food": Cookie
};

const getCategoryIcon = (categoryName) => {
    if (!categoryName) return Grid3x3;

    const nameLower = categoryName.toLowerCase();

    // 1. Check for Exact Matches (Highest Priority)
    if (categoryIconMap[categoryName]) {
        return categoryIconMap[categoryName];
    }

    // 2. Check for Keyword Matches (Lower Priority)
    for (const keyword in categoryIconMap) {
        if (nameLower.includes(keyword)) {
            return categoryIconMap[keyword];
        }
    }

    // 3. Default Fallback
    return Grid3x3;
};
// ----------------------------------------

const ProductCarousel = () => {
    const [slides, setSlides] = useState([]);
    const router = useRouter();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [fetchedCategories, setFetchedCategories] = useState([]);

    // The static `categories` array is now redundant and can be removed, 
    // or kept as a fallback/initial data set if needed. I've commented it out.
    // const categories = [ ... ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await Categories.getCategories();

                // --- 2. FORMATTING FETCHED CATEGORIES ---
                const formattedCategories = response.categories.map(cat => ({
                    icon: getCategoryIcon(cat.name),
                    name: cat.name,
                    id: cat.id,
                    // You can add logic here to filter for parentId === null if you only want top-level
                }));

                setFetchedCategories(formattedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);
    // Adverts
    const adverts = [
        {
            id: 1,
            title: "WhatsApp",
            subtitle: "Chat To Order",
            bgColor: "bg-green-500",
            icon: "💬"
        },
        {
            id: 3,
            title: "SELL ON SOKO TIMAM",
            subtitle: "Millions Of Visitors",
            bgColor: "bg-orange-500",
            icon: "🏪"
        }
    ];

    useEffect(() => {
        const fetchRandomProducts = async () => {
            try {
                const response = await Products.getProducts();
                const allProducts = response.products;

                // Shuffle and get 3 random products
                const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
                const randomThree = shuffled.slice(0, 3);

                // Fetch images for each product
                const productsWithImages = await Promise.all(
                    randomThree.map(async (product) => {
                        const detailResponse = await Products.getProductWithImages(product.id);
                        return {
                            ...product,
                            images: detailResponse.images,
                        };
                    })
                );

                setSlides(productsWithImages);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchRandomProducts();
    }, []); // Empty dependency - only runs once on mount

    useEffect(() => {
        if (slides.length === 0) return;

        const interval = setInterval(goToNext, 5000);
        return () => clearInterval(interval);
    }, [slides.length, currentSlideIndex]);

    const goToPrevious = () => {
        setCurrentSlideIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentSlideIndex((prevIndex) =>
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleProductClick = (productId) => {
        router.push(`/Customer/product/${productId}`);
    };
    const handleCategoryClick = (categoryId) => {
        router.push(`/Customer/category/${categoryId}`);
    };


    return (
        <div className="max-w-7xl mx-auto my-6 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">

                {/* LEFT COLUMN - Categories */}
                <div className="hidden lg:block col-span-2 bg-white rounded-lg shadow-md overflow-hidden h-full">
                    <nav className="divide-y divide-gray-100 h-full">
                        {/* 3. USING THE MAPPED fetchedCategories STATE */}
                        {fetchedCategories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    // Using category ID for the key is better if available, fallback to index
                                    onClick={() => handleCategoryClick(category.id || index)}
                                    key={category.id || index}
                                    className="w-full px-3 py-2 flex items-center space-x-2 hover:bg-orange-50 transition text-left text-sm"
                                >
                                    <Icon className="w-4 h-4 text-orange-600" />
                                    <span className="text-gray-700">{category.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* CENTER COLUMN - Carousel */}
                <div className="lg:col-span-7 h-full">
                    {loading ? (
                        <div className="bg-gray-100 rounded-xl shadow-lg h-full min-h-[280px] flex items-center justify-center">
                            <p className="text-gray-600 text-base">Loading featured products...</p>
                        </div>
                    ) : slides.length === 0 ? null : (
                        <section className="relative overflow-hidden rounded-xl shadow-lg h-full">
                            <div className="flex transition-transform duration-500 ease-in-out h-full"
                                style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}>

                                {slides.map((slide) => {
                                    // Get main image
                                    const mainImage = slide.images?.find(img => img.isMain)?.imageUrl
                                        || slide.images?.[0]?.imageUrl
                                        || 'https://placehold.co/800x400/f0f0f0/333333?text=Product+Image';

                                    // Format price
                                    const formattedPrice = `KSh ${parseFloat(slide.price).toLocaleString()}`;

                                    return (
                                        <div key={slide.id} className="flex-shrink-0 w-full h-full">
                                            <div className="relative flex flex-col md:flex-row items-stretch h-full">

                                                {/* Product Details */}
                                                <div className="w-full md:w-1/2 p-4 sm:p-6 bg-gray-50 flex flex-col justify-center order-2 md:order-1 h-full">
                                                    <span className="text-xs font-semibold text-orange-600 mb-1 uppercase tracking-widest">Featured Deal</span>
                                                    <h3 className="text-xl sm:text-2xl font-extrabold text-orange-950 mb-1 line-clamp-2">{slide.name}</h3>

                                                    {slide.description && (
                                                        <p className="text-gray-600 mb-2 text-sm line-clamp-2">{slide.description}</p>
                                                    )}

                                                    {slide.stock > 0 ? (
                                                        <p className="text-xs text-green-600 font-semibold mb-1">
                                                            ✓ In Stock ({slide.stock} available)
                                                        </p>
                                                    ) : (
                                                        <p className="text-xs text-red-600 font-semibold mb-1">
                                                            Out of Stock
                                                        </p>
                                                    )}

                                                    <div className="flex items-center space-x-4 mb-3">
                                                        <span className="text-xl font-bold text-red-600">{formattedPrice}</span>
                                                        <button
                                                            onClick={() => handleProductClick(slide.id)}
                                                            className={`px-6 py-2 rounded-full transition font-semibold shadow-lg text-xs ${slide.stock > 0
                                                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                                : 'bg-gray-400 text-white cursor-not-allowed'
                                                                }`}
                                                            disabled={slide.stock === 0}
                                                        >
                                                            {slide.stock > 0 ? 'BUY NOW' : 'SOLD OUT'}
                                                        </button>
                                                    </div>

                                                    <p className="text-xs text-gray-700 border-t pt-2 mt-auto">
                                                        <strong className="text-sm">Limited Time Offer</strong> - Don't miss out!
                                                    </p>
                                                </div>

                                                {/* Product Image */}
                                                <div className="w-full md:w-1/2 h-48 md:h-full order-1 md:order-2">
                                                    <img
                                                        src={mainImage}
                                                        alt={slide.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://placehold.co/800x400/f0f0f0/333333?text=Product+Image";
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Left Arrow */}
                            <button
                                className="absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-white bg-opacity-70 p-2 rounded-r-full hover:bg-opacity-100 transition shadow-lg hidden md:block"
                                onClick={goToPrevious}
                                aria-label="Previous Slide"
                            >
                                <ChevronLeft className="w-5 h-5 text-orange-600" />
                            </button>

                            {/* Right Arrow */}
                            <button
                                className="absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-white bg-opacity-70 p-2 rounded-r-full hover:bg-opacity-100 transition shadow-lg hidden md:block"
                                onClick={goToNext}
                                aria-label="Next Slide"
                            >
                                <ChevronRight className="w-5 h-5 text-orange-600" />
                            </button>

                            {/* Dots for navigation */}
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${currentSlideIndex === index
                                            ? 'bg-orange-600'
                                            : 'bg-orange-950 bg-opacity-50 hover:bg-opacity-80'
                                            }`}
                                        onClick={() => setCurrentSlideIndex(index)}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* RIGHT COLUMN - Adverts */}
                <div className="lg:col-span-3 h-full flex flex-col gap-3">
                    {adverts.map((advert) => (
                        <div
                            key={advert.id}
                            className={`flex-1 ${advert.bgColor} text-white rounded-lg p-4 shadow-md hover:shadow-lg transition transform hover:scale-105 text-left flex flex-col justify-center`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-2xl">{advert.icon}</span>
                            </div>
                            <h3 className="font-bold text-base mb-1">{advert.title}</h3>
                            <p className="text-xs opacity-90">{advert.subtitle}</p>
                        </div>
                    ))}

                    {/* Date/Time Widget */}
                    <div className="flex flex-col bg-black text-white rounded-lg p-4 shadow-md flex items-center justify-center gap-3">

                        {/* Truck Icon Container with Animation Class */}
                        <div className="w-8 h-8 flex items-center justify-center animate-truck-slide">
                            <Truck className="w-6 h-6 text-orange-500 fill-orange-500" />
                        </div>

                        {/* Delivery Text */}
                        <div className="flex flex-col justify-center">
                            <div className="text-sm font-bold mb-1">If you order now,</div>
                            <div className="text-base font-bold text-orange-500">delivery in one day within Nairobi</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        // styles 

    );
};

export default ProductCarousel;