'use client'
import {
    ChevronLeft, ChevronRight, Package, Smartphone, Tv, Home,
    ShoppingBag, Gamepad2, ShoppingCart, Baby, Grid3x3, Truck,
    Shirt, Watch, Zap, Cookie, Luggage, Factory, Gem
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
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [childrenCategories, setChildrenCategories] = useState({});

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

    // Fetch children categories when hovering over a parent category
    const handleCategoryHover = async (categoryId) => {
        setHoveredCategory(categoryId);
        
        // Only fetch if we haven't already fetched children for this category
        if (!childrenCategories[categoryId]) {
            try {
                const response = await Categories.getCategoryChildren(categoryId);
                setChildrenCategories(prev => ({
                    ...prev,
                    [categoryId]: response.category.children || []
                }));
            } catch (error) {
                console.error("Error fetching category children:", error);
                setChildrenCategories(prev => ({
                    ...prev,
                    [categoryId]: []
                }));
            }
        }
    };

    const handleCategoryLeave = () => {
        setHoveredCategory(null);
    };

    return (
        <div className="mx-auto mt-3 px-4 overflow-x-hidden">

            {/* MOBILE LAYOUT */}
            {/* MOBILE LAYOUT - IMAGE ON RIGHT, DETAILS ON LEFT */}
            <div className="lg:hidden">
                {loading ? (
                    <div className="bg-gray-100 rounded-xl shadow-lg h-full min-h-[280px] flex items-center justify-center">
                        <p className="text-gray-600 text-base">Loading featured products...</p>
                    </div>
                ) : slides.length === 0 ? null : (
                    <section className="relative overflow-hidden rounded-xl shadow-lg">
                        <div className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}>

                            {slides.map((slide) => {
                                const mainImage = slide.images?.find(img => img.isMain)?.imageUrl
                                    || slide.images?.[0]?.imageUrl
                                    || 'https://placehold.co/800x400/f0f0f0/333333?text=Product+Image';

                                const formattedPrice = `KSh ${parseFloat(slide.price).toLocaleString()}`;

                                return (
                                    <div key={slide.id} className="flex-shrink-0 w-full">
                                        <div className="relative flex flex-row h-48 sm:h-56">

                                            {/* Product Details - LEFT */}
                                            <div className="w-full sm:w-1/2 p-3 bg-gray-50 flex flex-col justify-between">

                                                <span className="text-xs font-semibold text-orange-600 mb-0.5 uppercase tracking-wider">Featured Deal</span>
                                                <h3 className="text-sm sm:text-base font-bold text-orange-950 mb-0.5 line-clamp-2">{slide.name}</h3>

                                                {slide.description && (
                                                    <p className="text-gray-600 mb-1 text-xs line-clamp-2">{slide.description}</p>
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

                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="text-sm font-bold text-red-600">{formattedPrice}</span>
                                                    <button
                                                        onClick={() => handleProductClick(slide.id)}
                                                        className={`px-3 py-1 rounded-full transition font-semibold text-xs ${slide.stock > 0
                                                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                            : 'bg-gray-400 text-white cursor-not-allowed'
                                                            }`}
                                                        disabled={slide.stock === 0}
                                                    >
                                                        {slide.stock > 0 ? 'BUY' : 'SOLD'}
                                                    </button>
                                                </div>

                                                <p className="text-xs text-gray-700 border-t pt-1 mt-1">
                                                    <strong>Offer</strong> - Don't miss!
                                                </p>

                                            </div>

                                            {/* Product Image - RIGHT */}
                                            <div className="w-full sm:w-1/2 h-32 sm:h-48">
                                                <img
                                                    src={mainImage}
                                                    alt={slide.name}
                                                    className="w-full h-full object-cover rounded-r-lg"
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

            {/* MOBILE CATEGORIES - HORIZONTAL SCROLL */}
            <div className="lg:hidden mt-4">
                {fetchedCategories.length > 0 ? (
                    <div className="flex space-x-4 overflow-x-auto pb-2 px-2 w-full">
                        {fetchedCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id || category.name}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className="flex flex-col items-center justify-center flex-shrink-0 w-16"
                                >
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-1">
                                        <Icon className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <span className="text-xs text-gray-700 text-center leading-tight max-w-full line-clamp-2">
                                        {category.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-12 flex items-center justify-center text-gray-500 text-sm">
                        Loading categories...
                    </div>
                )}
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden lg:block">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">

                    {/* LEFT COLUMN - Categories */}
                    <div className="hidden lg:block col-span-2 bg-white rounded-lg shadow-md overflow-visible h-full relative">
                        <nav className="divide-y divide-gray-100 h-full">
                            {fetchedCategories.slice(0, 7).map((category, index) => {
                                const Icon = category.icon;
                                const hasChildren = childrenCategories[category.id]?.length > 0;
                                
                                return (
                                    <div
                                        key={category.id || index}
                                        className="relative"
                                        onMouseEnter={() => handleCategoryHover(category.id)}
                                        onMouseLeave={handleCategoryLeave}
                                    >
                                        <button
                                            onClick={() => handleCategoryClick(category.id)}
                                            className="w-full px-3 py-2 flex items-center justify-between hover:bg-orange-50 transition text-left text-sm"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Icon className="w-4 h-4 text-orange-600" />
                                                <span className="text-gray-700">{category.name}</span>
                                            </div>
                                            {hasChildren && (
                                                <ChevronRight className="w-3 h-3 text-gray-400" />
                                            )}
                                        </button>

                                        {/* Children Dropdown */}
                                        {hoveredCategory === category.id && childrenCategories[category.id]?.length > 0 && (
                                            <div className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[200px] max-w-[300px] z-50">
                                                <div className="py-2">
                                                    {childrenCategories[category.id].map((child) => (
                                                        <button
                                                            key={child.id}
                                                            onClick={() => handleCategoryClick(child.id)}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                                                        >
                                                            {child.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Conditional "More" Button */}
                            {fetchedCategories.length > 7 && (
                                <button
                                    className="w-full px-3 py-2 flex items-center justify-center space-x-2 bg-gray-50 hover:bg-orange-100 transition text-left text-sm font-semibold text-orange-600"
                                >
                                    <span>View All ({fetchedCategories.length})</span>
                                </button>
                            )}
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
                                        const mainImage = slide.images?.find(img => img.isMain)?.imageUrl
                                            || slide.images?.[0]?.imageUrl
                                            || 'https://placehold.co/800x400/f0f0f0/333333?text=Product+Image';
                                        const formattedPrice = `KSh ${parseFloat(slide.price).toLocaleString()}`;

                                        return (
                                            <div key={slide.id} className="flex-shrink-0 w-full h-full">
                                                <div className="relative flex flex-col md:flex-row items-stretch h-full">
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
                                                            <strong>Limited Time Offer</strong> - Don't miss out!
                                                        </p>
                                                    </div>
                                                    <div className="w-full md:w-1/2 h-48 md:h-full order-1 md:order-2 flex items-center justify-center">
                                                        <img
                                                            src={mainImage}
                                                            alt={slide.name}
                                                            className="max-h-full max-w-full object-contain"
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

                                {/* Arrows */}
                                <button
                                    className="absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-white bg-opacity-70 p-2 rounded-r-full hover:bg-opacity-100 transition shadow-lg hidden md:block"
                                    onClick={goToPrevious}
                                    aria-label="Previous Slide"
                                >
                                    <ChevronLeft className="w-5 h-5 text-orange-600" />
                                </button>
                                <button
                                    className="absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-white bg-opacity-70 p-2 rounded-l-full hover:bg-opacity-100 transition shadow-lg hidden md:block"
                                    onClick={goToNext}
                                    aria-label="Next Slide"
                                >
                                    <ChevronRight className="w-5 h-5 text-orange-600" />
                                </button>

                                {/* Dots */}
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
                    <div className="lg:col-span-3 h-full flex flex-col gap-2">
                        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-3">
                            {adverts.map((advert) => (
                                <div
                                    key={advert.id}
                                    className="flex flex-row items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                                >
                                    <div className="flex-shrink-0">{advert.icon}</div>
                                    <div className="flex flex-col text-left">
                                        <h3 className="font-semibold text-gray-800 text-sm leading-tight">{advert.title}</h3>
                                        <p className="text-gray-600 text-xs leading-tight">{advert.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col bg-white border border-gray-200 text-gray-800 rounded-lg p-3 shadow-sm flex items-center justify-center gap-2 mt-2">
                            <div className="w-6 h-6 flex items-center justify-center animate-truck-slide flex-shrink-0">
                                <Truck className="w-5 h-5 text-orange-500 fill-orange-500" />
                            </div>
                            <div className="flex flex-col justify-center text-center">
                                <div className="text-xs font-medium mb-0.5 leading-tight">If you order now,</div>
                                <div className="text-sm font-bold text-orange-600 leading-tight">delivery in one day within Nairobi</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ProductCarousel;