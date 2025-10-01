'use client'
import { useRef } from "react";
import ProductCard from './ProductCard'
import { ChevronLeft, ChevronRight } from "lucide-react";

const NewAndPopular = () => {
    const carouselRef = useRef(null);

    // Scroll amount is dynamic: scrolls by 90% of the viewport width on mobile, and a fixed amount on desktop
    const scroll = (direction) => {
        if (carouselRef.current) {
            // Check window size dynamically for a better scroll experience
            const scrollDistance = window.innerWidth < 640 ? window.innerWidth * 0.9 : 800;

            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollDistance : scrollDistance,
                behavior: 'smooth',
            });
        }
    };

    const productData = [
        { title: "Hand Crafted Flower Vase...", originalPrice: "1500", salePrice: "999", discount: "20%", imageUrl: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/41/159292/1.jpg?8728" },
        // { title: "African Prince Sneakers", originalPrice: "2500", salePrice: "1200", discount: "10%", imageUrl: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/38/544383/1.jpg" },
        { title: "Wooden decorative giraffe carving", originalPrice: "1500", salePrice: "999", discount: "15%", imageUrl: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/90/4385903/1.jpg?3683" },
        { title: "Wooden decorative giraffe carving", originalPrice: "1500", salePrice: "999", discount: "15%", imageUrl: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/90/4385903/1.jpg?3683" },
        { title: "Hand Crafted Flower Vase...", originalPrice: "1500", salePrice: "999", discount: "20%", imageUrl: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/41/159292/1.jpg?8728" },
        // { title: "High-Quality Bluetooth Headphones", originalPrice: "4000", salePrice: "2999", discount: "25%", imageUrl: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/21/536137/1.jpg" },
        { title: "Classic Analog Wrist Watch", originalPrice: "6000", salePrice: "4500", discount: "25%", imageUrl: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/34/692691/1.jpg?5227" },
        // { title: "Organic Coffee Beans (1kg)", originalPrice: "1200", salePrice: "1000", discount: "17%", imageUrl: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/95/437990/1.jpg" },
        { title: "Classic Analog Wrist Watch", originalPrice: "6000", salePrice: "4500", discount: "25%", imageUrl: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/34/692691/1.jpg?5227" },
        { title: "Stylish Sun Hat", originalPrice: "800", salePrice: "599", discount: "15%", imageUrl: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/41/159292/1.jpg?8728" },
        { title: "Wooden decorative giraffe carving", originalPrice: "1500", salePrice: "999", discount: "15%", imageUrl: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/90/4385903/1.jpg?3683" },
        // { title: "Running Shoes Pro", originalPrice: "7500", salePrice: "6000", discount: "20%", imageUrl: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/38/544383/1.jpg" },
    ];

    return (
        <section className="bg-white py-8 px-0 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl text-orange-950 font-bold mb-6 px-4">New & Popular</h2>
                <div className="relative">
                    {/* Carousel Content Container: uses ref for scrolling, flex for horizontal layout, and snap-x for smooth scrolling stop points */}
                    <div
                        ref={carouselRef}
                        className="flex space-x-4 overflow-x-scroll scrollbar-hide snap-x snap-mandatory px-4 py-2"
                    >
                        {productData.map((product, index) => (
                            <div key={index} className="snap-start">
                                <ProductCard {...product} />
                            </div>
                        ))}
                    </div>

                    {/* Carousel Arrows (Hidden on small screens) */}
                    {/* Left Arrow */}
                    <button
                        className="absolute left-0 z-10 bg-white bg-opacity-90 p-2 rounded-full shadow-lg ml-2 hover:bg-opacity-100 transition top-1/2 transform -translate-y-1/2 hidden sm:block"
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    {/* Right Arrow */}
                    <button
                        className="absolute right-0 z-10 bg-white bg-opacity-90 p-2 rounded-full shadow-lg mr-2 hover:bg-opacity-100 transition top-1/2 transform -translate-y-1/2 hidden sm:block"
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>

                    {/* Note: Pagination dots removed as they require complex state management to accurately track scroll position. */}
                </div>
            </div>
        </section>
    );
};

export default NewAndPopular;