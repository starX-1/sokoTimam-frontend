'use client'
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";



const slides = [
    {
        title: "Fashion Deep U-neck",
        desc1: "Sleeveless Solid Color Casual Women Maxi",
        desc2: "Dress Summer Clothing Dresses",
        desc3: "Women Lady Elegant",
        price: "$4.88",
        image: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/61/159292/1.jpg?8733"
    },
    {
        title: "Vintage Leather Wallet",
        desc1: "Genuine Cowhide Multi-Card Zipper Pocket",
        desc2: "Durable and Stylish Accessory",
        desc3: "Perfect Gift for Him/Her",
        price: "$19.99",
        image: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/61/159292/1.jpg?8733"

    },
    {
        title: "Minimalist Smart Watch",
        desc1: "Fitness Tracker with Heart Rate Monitor",
        desc2: "IP68 Waterproof, Long Battery Life",
        desc3: "Available in three colors",
        price: "$49.00",
        image: "https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/61/159292/1.jpg?8733"

    }
];

const ProductCarousel = () => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

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

    // Auto slide effect (optional, commented out for manual control emphasis)
    
    useEffect(() => {
        const interval = setInterval(goToNext, 5000); 
        return () => clearInterval(interval);
    }, []);
    

    const currentSlide = slides[currentSlideIndex];

    return (
        <section className="relative max-w-5xl mx-auto my-8 overflow-hidden rounded-xl shadow-2xl">
            <div className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}>

                {slides.map((slide, index) => (
                    <div key={index} className="flex-shrink-0 w-full">
                        <div className="relative flex flex-col md:flex-row items-stretch min-h-[400px]">

                            {/* Product Details (w-full on mobile, w-1/2 on md+) */}
                            <div className="w-full md:w-1/2 p-6 sm:p-10 bg-gray-50 flex flex-col justify-center order-2 md:order-1">
                                <span className="text-sm font-semibold text-orange-600 mb-2 uppercase tracking-widest">Featured Deal</span>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-orange-950 mb-2">{slide.title}</h3>
                                <p className="text-gray-600 mb-1">{slide.desc1}</p>
                                <p className="text-gray-600 mb-1">{slide.desc2}</p>
                                <p className="text-gray-600 mb-4">{slide.desc3}</p>

                                <div className="flex items-center space-x-6 mb-6">
                                    <span className="text-3xl font-bold text-red-600">{slide.price}</span>
                                    <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition font-semibold shadow-lg text-sm">
                                        BUY NOW
                                    </button>
                                </div>
                                <p className="text-sm text-gray-700 border-t pt-4 mt-4">
                                    <strong className="text-lg">2 Pieces (Min. Order)</strong> - Limited Stock!
                                </p>
                            </div>

                            {/* Product Image (w-full on mobile, w-1/2 on md+) */}
                            <div className="w-full md:w-1/2 h-64 md:h-auto order-1 md:order-2">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x400/f0f0f0/333333?text=Product+Image"; }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
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
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentSlideIndex === index ? 'bg-orange-600' : 'bg-orange-950 bg-opacity-50 hover:bg-opacity-80'}`}
                        onClick={() => setCurrentSlideIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};


export default ProductCarousel;