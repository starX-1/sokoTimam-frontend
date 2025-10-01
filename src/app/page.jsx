import React from 'react';
import {  Check } from 'lucide-react';
// import Image from 'next/image';
import Header from './components/header';
import DealsOfTheWeek from './components/DealsOfTheWeek';
// import DealCard from './components/DealCard';
import ProductCarousel from './components/ProductSlide';
import NewAndPopular from '@/app/components/NewPopular'

// NOTE: The image uses a very dark brown/maroon (#431407) for the primary background.
// Tailwind's 'orange-950' is a dark brownish-orange. We'll use this for the background,
// but for a closer match to the image, you might want to use a custom color or 'bg-stone-900'.

// const Header = () => (
//   <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
//     <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
//       {/* Logo and Search */}
//       <div className="flex items-center space-x-6">
//         {/* logo */}
//         <img src="/soko.png" alt="" width={80} height={30}/>
//         {/* <a href="#" className="flex flex-col items-center space-y-2 font-serif text-2xl font-bold text-orange-600">
//           <span className='text-orange-950'>Soko</span>Timami
//         </a> */}
//         <div className="relative hidden sm:flex">
//           <input
//             type="text"
//             placeholder="Search"
//             className="border text-gray-800 border-gray-300 p-2 rounded-l-md w-96 focus:outline-none focus:ring-1 focus:ring-orange-500"
//           />
//           <button className="bg-orange-500 text-white p-2 rounded-r-md hover:bg-orange-600 transition">
//             <Search className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* Cart, Login, and App/Address */}
//       <div className="flex items-center space-x-6 text-sm">
//         <a href="#" className="flex items-center space-x-1 hover:text-orange-600 text-orange-950 transition">
//           <ShoppingCart className="w-5 h-5" />
//           <span>Cart | 0</span>
//         </a>
//         <a href="#" className="flex items-center space-x-1 hover:text-orange-600 text-orange-950 transition">
//           <LogIn className="w-5 h-5" />
//           <span>Login</span>
//         </a>
//         <span className="text-gray-400">|</span>
//         <div className="flex space-x-2 text-xs">
//           <button className="text-orange-600 border border-orange-600 px-2 py-1 rounded hover:bg-orange-50 transition">
//             Get the App
//           </button>
//           <button className="text-gray-700 border border-gray-300 px-2 py-1 rounded hover:bg-gray-50 transition">
//             Ship To [Address]
//           </button>
//         </div>
//       </div>
//     </div>

//     {/* Secondary Navigation */}
//     <div className="max-w-7xl mx-auto px-4 py-2 flex items-center space-x-4">
//       <div className="bg-orange-600 text-white p-2 rounded flex items-center space-x-2 cursor-pointer">
//         <Menu className="w-5 h-5" />
//         <span>Categories</span>
//       </div>
//       {/* Add more nav links here */}
//     </div>
//   </header>
// );

// const DealCard = ({ title, price, imageUrl }) => (
//   <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer">
//     <img
//       src={imageUrl}
//       alt={title}
//       className="w-full h-32 sm:h-40 object-cover"
//       // Simple image error fallback to ensure no broken images
//       onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/cccccc/333333?text=Product"; }}
//     />
//     <div className="p-3">
//       <h3 className="text-sm font-semibold text-gray-800 truncate">{title}</h3>
//       <p className="text-lg font-bold text-orange-600 mt-1">{price}</p>
//       <button className="w-full mt-2 bg-orange-500 text-white text-xs py-1.5 rounded-lg hover:bg-orange-600 transition duration-150 shadow-md">
//         Grab Deal
//       </button>
//     </div>
//   </div>
// );
// const DealsOfTheWeek = () => (
//   <section className="bg-white">
//     <div className="max-w-7xl mx-auto py-8">
//       <h2 className="text-xl font-semibold mb-4 text-white p-4 bg-orange-950">
//         Deals of the Week
//       </h2>
//       <div className="grid grid-cols-4 gap-4 p-4">
//         <DealCard title="African Bag" price="KSh 1500" imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/90/4385903/1.jpg?3683" />
//         <DealCard title="Kyondo Print" price="KSh 2000" imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/34/692691/1.jpg?5227" />
//         <DealCard title="Susu Bag" price="KSh 2500" imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/41/159292/1.jpg?8728" />
//         <DealCard title="African Print" price="KSh 1500" imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/61/159292/1.jpg?8733" />
//       </div>
//     </div>
//   </section>
// );

const FeaturedProduct = () => (
  <section className="bg-white">
    <div className="max-w-7xl mx-auto relative overflow-hidden">
      <div className="flex items-center">
        <ProductCarousel/>
      </div>

      {/* Info Boxes below product banner */}
      <div className="flex justify-around items-center bg-orange-950 text-white py-3 my-4 rounded">
        <div className="flex items-center space-x-2 ">
          <Check className="w-5 h-5" />
          <span>Join us:</span>
        </div>
        <span className="text-lg">|</span>
        <div className="flex items-center space-x-2">
          <Check className="w-5 h-5" />
          <span>Customer Care Service:</span>
        </div>
        <span className="text-lg">|</span>
        <div className="flex items-center space-x-2">
          <Check className="w-5 h-5" />
          <span>Privacy Policy:</span>
        </div>
      </div>
    </div>
  </section>
);

const ProductCard = ({ title, originalPrice, salePrice, discount, imageUrl }) => (
  <div className="w-full border border-gray-200 shadow-sm hover:shadow-lg transition duration-300">
    <div className="relative h-64 overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      {discount && (
        <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold p-2">
          {discount} OFF
        </div>
      )}
    </div>
    <div className="p-3 text-center">
      <p className="font-semibold text-gray-800 mb-1">{title}</p>
      <p className="text-gray-500 line-through text-sm">KSh {originalPrice}</p>
      <p className="text-lg font-bold text-red-600">KSh {salePrice}</p>
    </div>
  </div>
);

// const NewAndPopular = () => (
//   <section className="bg-white">
//     <div className="max-w-7xl mx-auto py-8">
//       <h2 className="text-2xl text-orange-950 font-bold mb-6 p-4">New & Popular</h2>
//       <div className="relative flex items-center p-4">
//         {/* Carousel Content */}
//         <div className="flex space-x-4 overflow-hidden">
//           <ProductCard
//             title="Hand Crafted Flower Vase..."
//             originalPrice="1500"
//             salePrice="999"
//             discount="20%"
//             imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/41/159292/1.jpg?8728"
//           />
//           <ProductCard
//             title="African Prince Sneakers"
//             originalPrice="2500"
//             salePrice="1200"
//             discount="10%"
//             imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/41/159292/1.jpg?8728"
//           />
//           <ProductCard
//             title="Wooden decorative gir..."
//             originalPrice="1500"
//             salePrice="999"
//             discount="15%"
//             imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/41/159292/1.jpg?8728"
//           />
//           {/* Duplicate for visual effect - in a real carousel, these would shift */}
//           <ProductCard
//             title="Another Great Item"
//             originalPrice="1800"
//             salePrice="1299"
//             discount="5%"
//             imageUrl="https://ke.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/41/159292/1.jpg?8728"
//           />
//         </div>

//         {/* Carousel Arrows */}
//         <button className="absolute left-0 bg-white bg-opacity-90 p-2 rounded-full shadow-lg ml-2 hover:bg-opacity-100 transition top-1/2 transform -translate-y-1/2">
//           <ChevronLeft className="w-5 h-5" />
//         </button>
//         <button className="absolute right-0 bg-white bg-opacity-90 p-2 rounded-full shadow-lg mr-2 hover:bg-opacity-100 transition top-1/2 transform -translate-y-1/2">
//           <ChevronRight className="w-5 h-5" />
//         </button>

//         {/* Pagination Dots */}
//         <div className="absolute bottom-0 w-full flex justify-center space-x-2 pb-2">
//           <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
//           <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
//           <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
//         </div>
//       </div>
//     </div>
//   </section>
// );

const Footer = () => (
  <footer className="bg-orange-950 text-white mt-8 pt-10 pb-4">
    <div className="max-w-7xl mx-auto px-4">
      {/* Footer Links Grid */}
      <div className="grid grid-cols-4 gap-8 pb-10 border-b border-orange-800">
        <div>
          <h4 className="font-bold mb-3">Need Help?</h4>
          <ul className="space-y-2 text-sm text-orange-200">
            <li><a href="#" className="hover:text-white transition">How to Register</a></li>
            <li><a href="#" className="hover:text-white transition">Forgot Password?</a></li>
            <li><a href="#" className="hover:text-white transition">Open Account</a></li>
            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition">After Sale Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Partner with Us</h4>
          <ul className="space-y-2 text-sm text-orange-200">
            <li><a href="#" className="hover:text-white transition">Seller Center</a></li>
            <li><a href="#" className="hover:text-white transition">Payment Setup</a></li>
            <li><a href="#" className="hover:text-white transition">SokoTiMami Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">About Us</h4>
          <ul className="space-y-2 text-sm text-orange-200">
            <li><a href="#" className="hover:text-white transition">SokoTiMami Careers</a></li>
            <li><a href="#" className="hover:text-white transition">Our Mission</a></li>
            <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">International</h4>
          <ul className="space-y-2 text-sm text-orange-200">
            <li>Kenya</li>
            <li>Uganda</li>
            <li>Tanzania</li>
          </ul>
        </div>
      </div>

      {/* Social and Copyright */}
      <div className="flex flex-col items-center pt-8">
        <div className="flex space-x-6 mb-4">
          <a href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-orange-950 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-2.5v-.5c0-.662.501-1.2 1.5-1.5h1v-2.5h-2c-1.895 0-3.5 1.583-3.5 4.5v2h-2v3h2v7h3v-7h2l1-3z" /></svg>
          </a>
          <a href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-orange-950 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-4.328 6.787c-.85-.18-1.558.17-2.072.76-.51.58-.755 1.34-.734 2.112l.067 1.439-1.995.002c-.172-.888-.363-1.685-.572-2.392-.578-1.921-1.587-3.085-2.585-3.328v1.734c.712.164 1.258.857 1.503 1.954l.32 1.488v.004l1.325 5.922h2.51v-7.394c0-1.077.307-2.074 1.705-2.074.887 0 1.22.457 1.22 1.391v7.625h2.509l.006-7.857c0-2.148-1.056-3.784-3.315-3.784z" /></svg>
          </a>
          <a href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-orange-950 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.64 0-5.88 1.956-6.88 3.73-1.01-1.774-3.25-3.73-6.88-3.73-4.665 0-7.865 3.197-7.865 8.125 0 4.927 3.2 8.125 7.865 8.125 3.63 0 5.87-1.956 6.88-3.73 1.01 1.774 3.25 3.73 6.88 3.73 4.665 0 7.865-3.198 7.865-8.125s-3.2-8.125-7.865-8.125zm-6.615 13.918c-.85 1.54-2.52 2.65-4.11 2.65s-3.26-.74-4.11-2.65c-1.59-2.91-1.76-6.73-1.76-8.995s.17-6.085 1.76-8.995c.85-1.54 2.52-2.65 4.11-2.65s3.26.74 4.11 2.65c1.59 2.91 1.76 6.73 1.76 8.995s-.17 6.085-1.76 8.995z" /></svg>
          </a>
        </div>
        <p className="text-xs text-orange-200">
          © 2021 Copyright: sokoTimamim.com
        </p>
      </div>

      {/* Patterned bottom border */}
      <div className="h-4 mt-4" style={{ backgroundImage: 'url("/images/pattern.png")', backgroundRepeat: 'repeat-x', backgroundSize: 'contain' }}>
      </div>
    </div>
  </footer>
);

export default function SokoTiMamiPage() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main>
        {/* Deals of the Week section uses orange-950 for the header bar */}
        {/* <section className="bg-orange-950 py-2">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-white px-4">Deals of the Week</h2>
            <div className="grid grid-cols-4 gap-4 p-4">
              <DealCard title="African Bag" price="KSh 1500" imageUrl="https://via.placeholder.com/300x200/431407/ffffff?text=African+Bag" />
              <DealCard title="Kyondo Print" price="KSh 2000" imageUrl="https://via.placeholder.com/300x200/431407/ffffff?text=Kyondo+Print" />
              <DealCard title="Susu Bag" price="KSh 2500" imageUrl="https://via.placeholder.com/300x200/431407/ffffff?text=Susu+Bag" />
              <DealCard title="African Print" price="KSh 1500" imageUrl="https://via.placeholder.com/300x200/431407/ffffff?text=African+Print" />
            </div>
          </div>
        </section> */}
        <DealsOfTheWeek />
        <FeaturedProduct />

        <NewAndPopular />

        <div className="h-10"></div> {/* Spacer */}
      </main>
      <Footer />
    </div>
  );
}