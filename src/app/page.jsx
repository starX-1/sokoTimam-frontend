import React from 'react';
import { Check } from 'lucide-react';
// import Image from 'next/image';
import Header from './components/header';
import DealsOfTheWeek from './components/DealsOfTheWeek';
// import DealCard from './components/DealCard';
import ProductCarousel from './components/ProductSlide';
import NewAndPopular from '@/app/components/NewPopular'
import Footer from '@/app/components/Footer'

const FeaturedProduct = () => (
  <section className="bg-white">
    <div className="max-w-7xl mx-auto relative overflow-hidden">
      <div className="flex items-center">
        <ProductCarousel />
      </div>

      {/* Info Boxes below product banner */}

    </div>
  </section>
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



export default function SokoTiMamiPage() {
  return (
    <div className="mx-auto min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className='max-w-6xl mx-auto'>

        <FeaturedProduct />
        <DealsOfTheWeek />
        {/* <div className="flex justify-around items-center bg-orange-950 text-white py-3 my-4 rounded">
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
        </div> */}

        <NewAndPopular />

        <div className="h-10"></div> {/* Spacer */}
      </main>
      <Footer />
    </div>
  );
}