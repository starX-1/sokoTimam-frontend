'use client'
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Products from '../api/products/api';
import { useRouter } from "next/navigation";

const ProductCarousel = () => {
    const [slides, setSlides] = useState([]);
    const router = useRouter();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <section className="relative max-w-5xl mx-auto my-8 overflow-hidden rounded-xl shadow-2xl bg-gray-100 min-h-[400px] flex items-center justify-center">
                <p className="text-gray-600 text-lg">Loading featured products...</p>
            </section>
        );
    }

    if (slides.length === 0) {
        return null;
    }


    const handleProductClick = (productId) => {
        router.push(`/Customer/product/${productId}`);
    };

    return (
        <section className="relative max-w-5xl mx-auto my-8 overflow-hidden rounded-xl shadow-2xl">
            <div className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}>

                {slides.map((slide, index) => {
                    // Get main image
                    const mainImage = slide.images?.find(img => img.isMain)?.imageUrl
                        || slide.images?.[0]?.imageUrl
                        || 'https://placehold.co/800x400/f0f0f0/333333?text=Product+Image';

                    // Format price
                    const formattedPrice = `KSh ${parseFloat(slide.price).toLocaleString()}`;

                    return (
                        <div key={slide.id} className="flex-shrink-0 w-full">
                            <div className="relative flex flex-col md:flex-row items-stretch min-h-[400px]">

                                {/* Product Details */}
                                <div className="w-full md:w-1/2 p-6 sm:p-10 bg-gray-50 flex flex-col justify-center order-2 md:order-1">
                                    <span className="text-sm font-semibold text-orange-600 mb-2 uppercase tracking-widest">Featured Deal</span>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-orange-950 mb-2">{slide.name}</h3>

                                    {slide.description && (
                                        <p className="text-gray-600 mb-4">{slide.description}</p>
                                    )}

                                    {slide.stock > 0 ? (
                                        <p className="text-sm text-green-600 font-semibold mb-2">
                                            ✓ In Stock ({slide.stock} available)
                                        </p>
                                    ) : (
                                        <p className="text-sm text-red-600 font-semibold mb-2">
                                            Out of Stock
                                        </p>
                                    )}

                                    <div className="flex items-center space-x-6 mb-6">
                                        <span className="text-3xl font-bold text-red-600">{formattedPrice}</span>
                                        <button
                                            onClick={() => handleProductClick(slide.id)}
                                            className={`px-8 py-3 rounded-full transition font-semibold shadow-lg text-sm ${slide.stock > 0
                                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                                    : 'bg-gray-400 text-white cursor-not-allowed'
                                                }`}
                                            disabled={slide.stock === 0}
                                        >
                                            {slide.stock > 0 ? 'BUY NOW' : 'SOLD OUT'}
                                        </button>

                                    </div>

                                    <p className="text-sm text-gray-700 border-t pt-4 mt-4">
                                        <strong className="text-lg">Limited Time Offer</strong> - Don't miss out!
                                    </p>
                                </div>

                                {/* Product Image */}
                                <div className="w-full md:w-1/2 h-64 md:h-auto order-1 md:order-2">
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
                className="absolute top-1/2 -translate-y-1/2 left-0 z-10 bg-white bg-opacity-70 p-3 rounded-r-full hover:bg-opacity-100 transition shadow-lg hidden md:block"
                onClick={goToPrevious}
                aria-label="Previous Slide"
            >
                <ChevronLeft className="w-6 h-6 text-orange-600" />
            </button>

            {/* Right Arrow */}
            <button
                className="absolute top-1/2 -translate-y-1/2 right-0 z-10 bg-white bg-opacity-70 p-3 rounded-l-full hover:bg-opacity-100 transition shadow-lg hidden md:block"
                onClick={goToNext}
                aria-label="Next Slide"
            >
                <ChevronRight className="w-6 h-6 text-orange-600" />
            </button>

            {/* Dots for navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentSlideIndex === index
                            ? 'bg-orange-600'
                            : 'bg-orange-950 bg-opacity-50 hover:bg-opacity-80'
                            }`}
                        onClick={() => setCurrentSlideIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default ProductCarousel;