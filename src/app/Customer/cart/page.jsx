'use client'
import { useState, useEffect } from 'react';
import Header from '../../components/header';
import Footer from '../../../app/components/Footer';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../../Hooks/CartContext'
import { useRouter } from 'next/navigation';

const CartPage = () => {
    // 1. Access global state and actions from context
    const {
        items: cartItems, // Rename items to cartItems for existing JSX compatibility
        loading,
        subtotal: calculatedSubtotal, // Get subtotal directly from context
        updateItemQuantity,
        // removeItemFromCart, // Use the real action when implemented in context
        isLoggedIn
    } = useCart();

    const router = useRouter();

    // 2. Adjust handlers to use context actions
    const handleQuantityChange = (itemId, action) => {
        const item = cartItems.find(i => i.id === itemId);
        if (!item) return;

        let newQuantity = item.quantity;
        if (action === 'increase' && newQuantity < item.product.stock) {
            newQuantity += 1;
        } else if (action === 'decrease' && newQuantity > 1) {
            newQuantity -= 1;
        }

        if (newQuantity !== item.quantity) {
            // Call the global context action to update quantity
            updateItemQuantity(item.productId, newQuantity);
        }
    };

    const handleRemoveItem = (itemId) => {
        // *Placeholder: When you implement removeItemFromCart in your context, use it here.*
        // removeItemFromCart(itemId);
        toast.info("Item removed from cart. (Placeholder action)");
    };

    const handleCheckout = () => {
        if (!isLoggedIn) {
            toast.error("Please log in to proceed to checkout.");
            router.push('/login');
            return;
        }
        toast.success("Proceeding to checkout...");
        // *Implement your checkout logic/redirection here*
    };

    // 3. Keep shipping calculation logic (now using subtotal from context)
    const calculateTotal = () => {
        const shipping = calculatedSubtotal < 10000 ? 500 : 0;
        return {
            subtotal: calculatedSubtotal,
            shipping,
            total: calculatedSubtotal + shipping
        };
    };

    const { subtotal, shipping, total } = calculateTotal();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your cart...</p>
                </div>
            </div>
        );
    }

    // --- Cart Item Component - Enhanced Responsive Design ---
    const CartItem = ({ item }) => {
        const product = item.product || {};
        const price = parseFloat(product.price);
        const quantity = item.quantity;
        const itemTotal = price * quantity;

        return (
            <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                    {/* Product Image - Small, crisp display */}
                    {/* Image: Default size is now w-10 h-10 (40x40px) for a compact look */}
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <img
                                // Placeholder size also reduced to match the new 40x40 dimension
                                src={product.ImageUrl || 'https://placehold.co/40x40/f0f0f0/333333?text=Prod'}
                                alt={product.name}
                                // Use max-w/h-full to ensure the image scales to fit the w-10 h-10 container
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Product Details - Flexible layout */}
                    <div className="flex-grow min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4">
                            {/* Product Info */}
                            <div className="flex-grow min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-orange-600 transition cursor-pointer">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-gray-600 mb-1">
                                    KSh {price.toLocaleString()} each
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${product.stock < 5
                                            ? 'bg-red-50 text-red-700'
                                            : 'bg-green-50 text-green-700'
                                        }`}>
                                        <Package className="w-3 h-3" />
                                        {product.stock < 5 ? `Only ${product.stock} left` : 'In Stock'}
                                    </span>
                                </div>
                            </div>

                            {/* Price (Desktop) */}
                            <div className="hidden sm:block text-right flex-shrink-0 sm:ml-4">
                                <p className="text-base font-bold text-gray-900">
                                    KSh {itemTotal.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Quantity Controls & Actions */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                            {/* Quantity Control */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">Qty:</span>
                                <div className="flex items-center border border-gray-300 rounded-md bg-white">
                                    <button
                                        onClick={() => handleQuantityChange(item.id, 'decrease')}
                                        className="p-1.5 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                        disabled={quantity <= 1}
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-3 h-3 text-gray-700" />
                                    </button>
                                    <span className="px-3 font-semibold text-gray-900 text-sm min-w-[28px] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(item.id, 'increase')}
                                        className="p-1.5 hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                        disabled={quantity >= product.stock}
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-3 h-3 text-gray-700" />
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Price & Remove */}
                            <div className="flex items-center gap-3">
                                <p className="sm:hidden text-sm font-bold text-gray-900">
                                    KSh {itemTotal.toLocaleString()}
                                </p>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition flex items-center gap-1 text-xs px-2 py-1 rounded"
                                    aria-label="Remove item"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Remove</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    // --- End Cart Item Component ---

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8">
                    <button
                        onClick={() => router.push('/Customer/products')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm sm:text-base transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </button>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                        <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                        Shopping Cart
                        {cartItems.length > 0 && (
                            <span className="text-lg sm:text-xl text-gray-500 font-normal">
                                ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                            </span>
                        )}
                    </h1>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
                        <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl sm:text-2xl text-gray-600 mb-2">Your cart is empty</p>
                        <p className="text-sm sm:text-base text-gray-500 mb-6">Add items to get started</p>
                        <button
                            onClick={() => router.push('/Customer/products')}
                            className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                            {cartItems.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Order Summary - Sticky on desktop */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 lg:sticky lg:top-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 pb-3 border-b border-gray-200">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 sm:space-y-4 text-gray-700">
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                                        <span className="font-semibold">KSh {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span>Shipping</span>
                                        <span className={`font-semibold ${shipping > 0 ? 'text-gray-900' : 'text-green-600'}`}>
                                            {shipping > 0 ? `KSh ${shipping.toLocaleString()}` : 'FREE'}
                                        </span>
                                    </div>
                                    {subtotal < 10000 && shipping > 0 && (
                                        <p className="text-xs text-gray-500 bg-orange-50 p-2 rounded">
                                            💡 Add KSh {(10000 - subtotal).toLocaleString()} more for free shipping!
                                        </p>
                                    )}
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span>Tax (0%)</span>
                                        <span className="font-semibold">KSh 0</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 mt-5 sm:mt-6 pt-5 sm:pt-6">
                                    <div className="flex justify-between items-baseline mb-6">
                                        <span className="text-lg sm:text-xl font-bold text-gray-900">Order Total</span>
                                        <span className="text-2xl sm:text-3xl font-bold text-orange-600">
                                            KSh {total.toLocaleString()}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-3 sm:py-4 bg-orange-600 text-white text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Proceed to Checkout
                                    </button>

                                    <div className="mt-4 text-center">
                                        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                                            🔒 Secure checkout
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default CartPage;