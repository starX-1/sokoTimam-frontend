'use client'
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Products from '../../../api/products/api';
import Header from '../../../components/header'
import Footer from '../../../components/Footer'
import Cart from '../../../../app/api/cart/api'
import { ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Star, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useCart } from '../../../Hooks/CartContext';

const ProductDetailPage = () => {
    const params = useParams();
    const productId = params?.id;
    const [loginModalOpen, setLoginMOdalOpen] = useState(false);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [adding, setAdding] = useState(false);
    const { addItemToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await Products.getProductWithImages(productId);
                setProduct(response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);
    // useefetct to fetch user from session
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const session = await getSession();
                setUser(session?.user || null);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);

    const handleQuantityChange = (action) => {
        if (action === 'increase' && quantity < product.stock) {
            setQuantity(quantity + 1);
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleImageSelect = (index) => {
        setSelectedImage(index);
    };

    const handleNextImage = () => {
        setSelectedImage((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        setSelectedImage((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        );
    };

    const handleLoginRedirection = () => {
        setLoginMOdalOpen(false);
        router.push("/login");
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 text-xl">Product not found</p>
                </div>
            </div>
        );
    }
    const loginModal = () => {
        return (
            <div>
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h2 className="text-2xl text-gray-800 font-bold mb-4">Please Log In</h2>
                        <p className="mb-6 text-orange-600">You need to be logged in to add items to your cart.</p>
                        <div className="flex justify-end gap-4">
                            <button className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={() => setLoginMOdalOpen(false)}>Cancel</button>
                            <button className="px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700" onClick={handleLoginRedirection}>Log In</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const handleAddToCart = async () => {
        console.log("Adding to cart", product.id, quantity);

        if (!user) {
            setLoginMOdalOpen(true);
            return;
        }

        try {
            setAdding(true);
            // call the provider helper which already handles API + refresh
            await addItemToCart({ productId: product.id, quantity: quantity || 1 });

            // addItemToCart already shows success toast — but we can show one here too if you prefer:
            // toast.success("Added to cart");
        } catch (err) {
            console.error("add to cart error", err);
            toast.error("Error adding to cart.");
        } finally {
            setAdding(false);
        }
    };

    const mainImage = product.images?.[selectedImage]?.imageUrl || 'https://placehold.co/800x800/f0f0f0/333333?text=No+Image';
    const formattedPrice = parseFloat(product.price).toLocaleString();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {
                loginModalOpen && loginModal()
            }
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm text-gray-600">
                    <span className="hover:text-orange-600 cursor-pointer">Home</span>
                    <span className="mx-2">/</span>
                    <span className="hover:text-orange-600 cursor-pointer">Products</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                    {/* Left Column - Images */}
                    <div className="space-y-4">
                        {/* Main Image Display */}
                        {/* The container block that wraps the main image */}
                        <div
                            className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group max-w-xl mx-auto lg:max-w-none lg:mx-0 flex items-center justify-center"
                        >
                            <img
                                src={mainImage}
                                alt={product.name}

                                /* * This ensures the image element is free to size itself based on 
                                 * object-contain, and the parent flex container centers it. 
                                 * We do NOT want w-full h-full here, as that would force the image 
                                 * element to fill the entire space, potentially hiding the object-contain effect.
                                */
                                className="object-contain"
                            />

                            {/* All other elements remain unchanged, but are positioned absolutely over the center. */}
                            {/* Image Navigation Arrows */}
                            {product.images?.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-gray-800" />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <ChevronRight className="w-4 h-4 text-gray-800" />
                                    </button>
                                </>
                            )}

                            {/* Favorite & Share Buttons (Reduced size) */}
                            <div className="absolute top-3 right-3 flex gap-1.5">
                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition"
                                >
                                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                                </button>
                                <button className="bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition">
                                    <Share2 className="w-4 h-4 text-gray-700" />
                                </button>
                            </div>

                            {/* Stock Badge (Reduced size) */}
                            {product.stock > 0 ? (
                                <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    In Stock
                                </div>
                            ) : (
                                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    Out of Stock
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.images?.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {product.images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => handleImageSelect(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition ${selectedImage === index
                                            ? 'border-orange-500 ring-2 ring-orange-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={image.imageUrl}
                                            alt={`${product.name} view ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-gray-600 text-sm">(4.8 - 124 reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-4xl font-bold text-orange-600">
                                    KSh {formattedPrice}
                                </span>
                                <span className="text-xl text-gray-400 line-through">
                                    KSh {Math.round(parseFloat(product.price) * 1.25).toLocaleString()}
                                </span>
                                <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded">
                                    20% OFF
                                </span>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    {product.description}
                                </p>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700">Quantity</label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange('decrease')}
                                        className="p-3 hover:bg-gray-100 transition"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <span className="px-6 py-2 font-semibold text-gray-900 min-w-[60px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange('increase')}
                                        className="p-3 hover:bg-gray-100 transition"
                                        disabled={quantity >= product.stock}
                                    >
                                        <Plus className="w-4 h-4 text-gray-700" />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {product.stock} items available
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                            {
                                adding ? (
                                    <button
                                        disabled
                                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded font-medium text-xs transition shadow-md bg-gray-300 text-gray-500 cursor-not-allowed"
                                    >
                                        <svg className="animate-spin w-4 h-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                        </svg>
                                        Adding...
                                    </button>
                                ) : (
                                    <button
                                        disabled={product.stock === 0}
                                        onClick={handleAddToCart}
                                        // Added 'md:flex-1' to let the button expand fully in a row on medium screens
                                        className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded font-medium text-xs transition shadow-md md:flex-1 ${product.stock > 0
                                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        <ShoppingCart className="w-3 h-3" />
                                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
                                )
                            }
                            <button
                                // Added 'flex-1' for full width when stacked, and 'md:flex-initial' to shrink it back when in a row
                                className="flex-1 px-2 py-1 border-2 border-orange-600 text-orange-600 rounded font-medium text-xs hover:bg-orange-50 transition md:flex-initial"
                            >
                                💖 Add to Wishlist
                            </button>
                        </div>

                        {/* Features */}
                        <div className="border-t pt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <Truck className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Free Delivery</h4>
                                    <p className="text-sm text-gray-600">For orders above KSh 5,000</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Shield className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                                    <p className="text-sm text-gray-600">100% secure transactions</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <RotateCcw className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                                    <p className="text-sm text-gray-600">7 days return policy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Product Details */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                    <div className="border-b mb-6">
                        <nav className="flex gap-8">
                            <button className="pb-4 border-b-2 border-orange-600 font-semibold text-orange-600">
                                Description
                            </button>
                            <button className="pb-4 border-b-2 border-transparent font-semibold text-gray-600 hover:text-gray-900">
                                Specifications
                            </button>
                            <button className="pb-4 border-b-2 border-transparent font-semibold text-gray-600 hover:text-gray-900">
                                Reviews (124)
                            </button>
                        </nav>
                    </div>

                    <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                            {product.description || 'This is a high-quality product designed to meet your needs. Made with premium materials and attention to detail, it offers excellent value for money.'}
                        </p>
                        <ul className="mt-4 space-y-2">
                            <li className="text-gray-700">Premium quality materials</li>
                            <li className="text-gray-700">Durable and long-lasting</li>
                            <li className="text-gray-700">Perfect for everyday use</li>
                            <li className="text-gray-700">Satisfaction guaranteed</li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetailPage;