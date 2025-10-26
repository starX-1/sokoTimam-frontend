'use client'
import React, { useState, useEffect } from 'react';
import { ShoppingCart, LogIn, Menu, Search, X, ChevronDown, ChevronUp, User } from 'lucide-react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
interface User {
    accessToken: string,
    email: string,
    firstname: string,
    id: number,
    lastname: string,
    phone: string,
    role: string,
    sub: number
}
const Header = () => {
    const router = useRouter();
    // State for the main mobile menu (hamburger menu)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // New state for the desktop/tablet Categories dropdown
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [logedInUser, setLogedInUser] = useState<User | null>(null);


    // Function to close the category dropdown
    const handleCategoryToggle = () => {
        setIsCategoriesOpen(prev => !prev);
    };

    const getUserFromSession = async () => {
        const response = await getSession();
        if (response?.user) {
            setLogedInUser(response.user as User)
        }
    }

    useEffect(() => {
        getUserFromSession()
    }, [])

    const categories = [
        { name: 'Electronics & Gadgets', href: '#' },
        { name: 'Fashion & Apparel', href: '#' },
        { name: 'Home & Kitchen', href: '#' },
        { name: 'Sports & Outdoors', href: '#' },
        { name: 'Books & Media', href: '#' },
    ];

    // Effect to close mobile menu on screen resize (better responsiveness)
    useEffect(() => {
        const handleResize = () => {
            // Close mobile menu if screen size is greater than sm (640px)
            if (window.innerWidth >= 640 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);

    const handleSellerOnboarding = () => {
        router.push('/sellerOnboarding')
    }

    return (
        <header className="bg-white border-b sticky top-0 z-30 shadow-md">
            <div className="max-w-7xl mx-auto p-3 sm:p-4 flex justify-between items-center">

                {/* 1. Left Side: Logo and Mobile Menu Button */}
                <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">

                    {/* Mobile Menu Button (Visible on Small Screens) */}
                    <button
                        className="sm:hidden text-gray-700 p-1 rounded-md hover:bg-gray-100 transition"
                        onClick={() => {
                            setIsMobileMenuOpen(!isMobileMenuOpen);
                            setIsCategoriesOpen(false); // Close category dropdown when mobile menu opens
                        }}
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Logo */}
                    {/* Placeholder image for '/soko.png' */}
                    <Link href="/">
                        <img
                            src="/soko.png"
                            alt='Soko Logo'
                            width={100}
                            height={30}
                            // Added w-[80px] for better mobile scaling
                            className="rounded-md w-[80px] sm:w-[100px] h-auto transition-all"
                        />
                    </Link>

                </div>

                {/* 2. Center: Search Bar (Hidden on Small Screens, large on desktop) */}
                <div className="relative hidden md:flex items-center flex-grow mx-4 lg:mx-8 max-w-xl">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="border text-gray-800 border-gray-300 p-2.5 rounded-l-xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150 text-sm"
                    />
                    <button className="bg-orange-500 text-white p-2.5 rounded-r-xl hover:bg-orange-600 transition duration-150 flex-shrink-0">
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* 3. Right Side: Cart, Login, and Utility Buttons */}
                <div className="flex items-center space-x-3 sm:space-x-6 flex-shrink-0 text-sm">

                    {/* Cart & Login (Ensure icons are consistent size) */}
                    <button onClick={()=>router.push('/Customer/cart')} className="flex items-center space-x-1 hover:text-orange-600 text-gray-700 transition">
                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="hidden sm:inline font-medium">Cart | 0</span>
                    </button>
                    {
                        logedInUser ? (
                            <Link href={'/profile'} className="flex items-center space-x-1 hover:text-orange-600 text-gray-700 transition">
                                <User className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="hidden sm:inline font-medium">Profile</span>
                            </Link>
                        ) : (
                            <Link href="/login" className="flex items-center space-x-1 hover:text-orange-600 text-gray-700 transition">
                                <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span className="hidden sm:inline font-medium">Login</span>
                            </Link>
                        )
                    }



                    {/* Utility Buttons (Visible on Larger Screens) */}
                    {/* Utility Buttons (Visible on Medium+ Screens) */}
                    <span className="hidden md:inline text-gray-300">|</span>
                    <div className="hidden md:flex space-x-2 text-xs">
                        <button 
                        onClick={handleSellerOnboarding}
                        className="text-orange-600 border border-orange-600 px-2 md:px-3 py-1.5 rounded-full hover:bg-orange-50 transition duration-150 shadow-sm font-semibold">
                            Seller Center
                        </button>
                        {logedInUser && (
                            <button className="text-gray-700 border border-gray-300 px-2 md:px-3 py-1.5 rounded-full hover:bg-gray-50 transition duration-150 shadow-sm font-semibold">
                                Ship To {logedInUser?.firstname}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar (Appears below main bar on small screens - Full width) */}
            <div className="max-w-7xl mx-auto px-3 pb-3 sm:hidden">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="border text-gray-800 border-gray-300 p-2.5 rounded-xl w-full pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-150 text-sm"
                    />
                    {/* Using absolute positioning for the search icon inside the input field for mobile */}
                    <button className="absolute right-0 top-0 bg-orange-500 text-white p-2.5 rounded-r-xl h-full hover:bg-orange-600 transition duration-150 flex items-center justify-center">
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 4. Secondary Navigation Bar (Hidden on mobile, visible on tablet/desktop) */}
            <div className="hidden sm:flex max-w-7xl mx-auto px-4 py-2 items-center space-x-6 border-t border-gray-100">

                {/* Categories Dropdown Container (Relative positioning for the absolute menu)
                <div className="relative z-40">
                    <button
                        className={`text-white p-2 rounded-xl flex items-center space-x-2 cursor-pointer transition duration-150 shadow-md ${isCategoriesOpen ? 'bg-orange-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                        onClick={handleCategoryToggle}
                        aria-expanded={isCategoriesOpen}
                        aria-controls="category-dropdown"
                    >
                        <Menu className="w-5 h-5" />
                        <span className='font-bold text-sm sm:text-base'>All Categories</span>
                        {isCategoriesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Dropdown Content */}
                    {/* {isCategoriesOpen && (
                        <div
                            id="category-dropdown"
                            className="absolute left-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-fade-in"
                        >
                            {categories.map((category) => (
                                <a
                                    key={category.name}
                                    href={category.href}
                                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 font-medium transition duration-150"
                                    onClick={() => setIsCategoriesOpen(false)} // Close on item click
                                >
                                    {category.name}
                                </a>
                            ))}
                            <div className="border-t border-gray-100 my-1"></div>
                            <a href="#" className="block px-4 py-3 text-sm font-bold text-orange-600 hover:bg-orange-50 transition duration-150">
                                View All Categories &rarr;
                            </a>
                        </div>
                    )} */}
                {/* </div> */} 

                {/* Secondary Links (Visible on Tablet/Desktop) */}
                {/* <nav className='flex space-x-4 sm:space-x-6 text-sm font-medium'>
                    <a href="#" className="text-gray-700 hover:text-orange-600 transition duration-150">New Arrivals</a>
                    <a href="#" className="text-gray-700 hover:text-orange-600 transition duration-150">Best Sellers</a>
                    <a href="#" className="text-gray-700 hover:text-orange-600 transition duration-150">Sale</a>
                    <a href="#" className="text-gray-700 hover:text-orange-600 transition duration-150">Gift Ideas</a>
                </nav> */}
            </div>

            {/* 5. Full-Screen Mobile Menu Dropdown (Visible only on sm screens) */}
            {isMobileMenuOpen && (
                <div className="sm:hidden absolute top-full left-0 w-full bg-white border-t shadow-2xl pb-4 z-20">
                    <div className="p-4 space-y-3">
                        <h3 className="text-lg font-bold text-orange-600 mb-2 border-b pb-2">Categories</h3>
                        {categories.map((category) => (
                            <a
                                key={`mobile-${category.name}`}
                                href={category.href}
                                className="block py-2 text-gray-700 hover:text-orange-600 border-b border-gray-100 transition"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {category.name}
                            </a>
                        ))}
                        <a href="#" className="block py-2 text-orange-600 font-bold border-b border-gray-100 transition">
                            View All Categories
                        </a>
                        <div className="pt-4 space-y-2">
                            <h3 className="text-lg font-bold text-gray-700 mb-2 border-b pb-2">Account & Info</h3>
                            <a href="#" className="block py-1 text-gray-700 hover:text-orange-600 transition">
                                New Arrivals
                            </a>
                            <a href="/sellerOnboarding" className="block py-1 text-gray-700 hover:text-orange-600 transition">
                                Seller Center
                            </a>
                            <a href="#" className="block py-1 text-gray-700 hover:text-orange-600 transition">
                                Ship To {logedInUser?.firstname}
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Tailwind utility class definition for animation (Removed 'jsx' prop) */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </header>
    );
};

export default Header;
