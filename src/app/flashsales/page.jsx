'use client'
import { useState, useEffect } from 'react';
import { Clock, Grid, List, Heart, ShoppingCart } from 'lucide-react';
import Header from '../components/header'
import Footer from '../components/Footer'
import FlashSales from '../api/flashsale/api'
import Products from '../api/products/api'
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useCart } from '../Hooks/CartContext'

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
      const difference = new Date(endTime).getTime() - new Date().getTime();

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

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`}>★</span>);
  }

  if (hasHalfStar) {
    stars.push(<span key="half">☆</span>);
  }

  for (let i = stars.length; i < 5; i++) {
    stars.push(<span key={`empty-${i}`}>☆</span>);
  }

  return stars;
};

const SkeletonCard = ({ isGridView }) => {
  if (isGridView) {
    return (
      <div className="mt-4 bg-white rounded-xl overflow-hidden animate-pulse">
        <div className="h-32 sm:h-36 bg-gray-200" />
        <div className="p-2.5 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="flex gap-2">
            <div className="h-3 bg-gray-200 rounded flex-1" />
            <div className="h-3 bg-gray-200 rounded flex-1" />
          </div>
          <div className="h-8 bg-gray-200 rounded" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 w-3 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden animate-pulse flex gap-4 p-3">
      <div className="h-24 w-24 flex-shrink-0 bg-gray-200 rounded-lg" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-3 bg-gray-200 rounded flex-1" />
          <div className="h-3 bg-gray-200 rounded flex-1" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
};

const DealCard = ({ flashSale, isGridView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const product = flashSale.product;
  const mainImage = flashSale.productImage || 'https://placehold.co/400x400/f3f4f6/9ca3af?text=Product';
  const rating = 4.5;
  const reviewCount = 245;

  const router = useRouter();

  if (isGridView) {
    return (
      <div
        className="group mt-4 relative bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Discount Badge */}
        <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          -{flashSale.discountPercent}%
        </div>

        {/* Quick Action Buttons */}
        <div className={`absolute top-2 right-2 z-10 flex flex-col gap-1.5 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <button
            onClick={(e) => e.stopPropagation()}
            className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all duration-300 hover:scale-110"
          >
            <Heart size={14} />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative h-32 sm:h-36 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400x400/f3f4f6/9ca3af?text=Product";
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Product Details */}
        <div className="relative p-2.5">
          <h3 className="text-xs font-semibold text-gray-800 mb-1.5 line-clamp-2 min-h-[2rem] leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mb-2">
            <p className="text-base font-bold text-gray-900">
              KSh {parseFloat(flashSale.discountPrice).toLocaleString()}
            </p>
            <span className="text-[10px] text-gray-400 line-through">
              KSh {parseFloat(product.price).toLocaleString()}
            </span>
          </div>

          {/* Countdown Timer */}
          <div className="mb-2">
            <CountdownTimer endTime={flashSale.endTime} />
          </div>

          <button
            onClick={()=>router.push(`/Customer/product/${flashSale.productId}`)}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium text-xs transition-all duration-300 ${isHovered
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
              : 'bg-orange-50 text-orange-600 border border-orange-200'
              }`}
          >
            <ShoppingCart size={14} />
            <span>Add to Cart</span>
          </button>

          <div className={`mt-2 flex items-center justify-between text-[10px] text-gray-500 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'
            }`}>
            <span className="flex items-center gap-0.5 text-yellow-500">
              {renderStars(rating)}
            </span>
            <span className="text-gray-400">({reviewCount})</span>
          </div>
        </div>

        <div className={`absolute inset-0 rounded-xl border-2 border-orange-500/0 transition-all duration-300 pointer-events-none ${isHovered ? 'border-orange-500/50' : ''
          }`} />
      </div>
    );
  }

  // List View
  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-lg cursor-pointer flex gap-4 p-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-24 w-24 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x400/f3f4f6/9ca3af?text=Product";
          }}
        />
        <div className="absolute top-1 left-1 z-10 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          -{flashSale.discountPercent}%
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-2">
            <p className="text-base font-bold text-gray-900">
              KSh {parseFloat(flashSale.discountPrice).toLocaleString()}
            </p>
            <span className="text-[10px] text-gray-400 line-through">
              KSh {parseFloat(product.price).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <CountdownTimer endTime={flashSale.endTime} />
          <div className="flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-0.5 text-yellow-500">
              {renderStars(rating)}
            </span>
            <span className="text-gray-400">({reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <button
          onClick={(e) => e.stopPropagation()}
          className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all duration-300 hover:scale-110"
        >
          <Heart size={14} />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className={`p-1.5 rounded-full transition-all duration-300 ${isHovered
            ? 'bg-orange-500 text-white shadow-lg'
            : 'bg-orange-50 text-orange-600'
            }`}
        >
          <ShoppingCart size={14} />
        </button>
      </div>
    </div>
  );
};

export default function AllFlashSalesPage() {
  const [isGridView, setIsGridView] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [flashSales, setFlashSales] = useState([]);
  const [displayedSales, setDisplayedSales] = useState([]);
  const [itemsPerPage] = useState(20);
  const [displayCount, setDisplayCount] = useState(20);

  const sortFlashSales = (sales, sortType) => {
    const sorted = [...sales];
    switch (sortType) {
      case 'discount':
        return sorted.sort((a, b) => b.discountPercent - a.discountPercent);
      case 'ending':
        return sorted.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
      case 'price-low':
        return sorted.sort((a, b) => parseFloat(a.discountPrice) - parseFloat(b.discountPrice));
      case 'price-high':
        return sorted.sort((a, b) => parseFloat(b.discountPrice) - parseFloat(a.discountPrice));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        setLoading(true);
        const response = await FlashSales.getFlashSales();

        if (response && response.data && Array.isArray(response.data)) {
          const flashSalesWithImages = await Promise.all(
            response.data.map(async (flashSale) => {
              try {
                const imageRes = await Products.getProductImagesById(flashSale.product.id);
                const mainImage = imageRes && imageRes.images?.length > 0 ? imageRes.images[0].imageUrl : flashSale.productImage;
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
          const sorted = sortFlashSales(flashSalesWithImages, 'newest');
          setDisplayedSales(sorted.slice(0, itemsPerPage));
        } else {
          setFlashSales([]);
          setDisplayedSales([]);
        }
      } catch (error) {
        console.error("Error fetching flash sales:", error);
        setFlashSales([]);
        setDisplayedSales([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSales();
  }, []);

  useEffect(() => {
    const sorted = sortFlashSales(flashSales, sortBy);
    setDisplayedSales(sorted.slice(0, displayCount));
  }, [sortBy, flashSales, displayCount]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setDisplayCount(prev => prev + itemsPerPage);
    setLoadingMore(false);
  };

  const hasMoreItems = displayCount < flashSales.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Flash Sales</h1>
              <p className="text-gray-600 text-sm mt-1">Browse all our active flash sales and limited time deals</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-600">{flashSales.length}</p>
              <p className="text-gray-600 text-sm">Active Sales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="discount">Highest Discount</option>
                <option value="ending">Ending Soon</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setIsGridView(true)}
                className={`p-2 rounded transition-colors ${
                  isGridView
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setIsGridView(false)}
                className={`p-2 rounded transition-colors ${
                  !isGridView
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div
            className={
              isGridView
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'
                : 'space-y-2'
            }
          >
            {[...Array(20)].map((_, i) => (
              <SkeletonCard key={i} isGridView={isGridView} />
            ))}
          </div>
        ) : displayedSales.length > 0 ? (
          <div
            className={
              isGridView
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'
                : 'space-y-2'
            }
          >
            {displayedSales.map((flashSale) => (
              <DealCard
                key={flashSale.id}
                flashSale={flashSale}
                isGridView={isGridView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No flash sales available at the moment</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMoreItems && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={`px-8 py-3 border-2 border-orange-600 text-orange-600 font-semibold rounded-lg transition-all ${
              loadingMore
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-orange-50'
            }`}
          >
            {loadingMore ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent"></div>
                Loading...
              </span>
            ) : (
              `Load More Deals (${displayedSales.length}/${flashSales.length})`
            )}
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}