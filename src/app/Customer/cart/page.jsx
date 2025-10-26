'use client'
import { useState, useEffect } from 'react';
import Header from '../../components/header';
import Footer from '../../../app/components/Footer';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';

// Mock Cart Item Structure (Replace with your actual API fetch)
const MOCK_CART_ITEMS = [
    {
        id: 1,
        productId: 'prod1',
        name: 'Ergonomic Mechanical Keyboard',
        price: 8500.00,
        quantity: 2,
        imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Keyboard',
        stock: 5,
    },
    {
        id: 2,
        productId: 'prod2',
        name: 'Noise-Cancelling Headphones',
        price: 12500.00,
        quantity: 1,
        imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Headphones',
        stock: 3,
    },
];

const CartPage = () => {
    // Replace MOCK_CART_ITEMS with a state that fetches real cart data
    const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);
    const [loading, setLoading] = useState(false);

    // --- Helper Functions ---

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        // Example: Add a fixed shipping cost if subtotal is below a threshold
        const shipping = subtotal < 10000 ? 500 : 0;
        return { subtotal, shipping, total: subtotal + shipping };
    };

    // --- Handlers ---

    const handleQuantityChange = (itemId, action) => {
        const newCartItems = cartItems.map(item => {
            if (item.id === itemId) {
                let newQuantity = item.quantity;
                if (action === 'increase' && item.quantity < item.stock) {
                    newQuantity += 1;
                } else if (action === 'decrease' && item.quantity > 1) {
                    newQuantity -= 1;
                }
                // *In a real app, you would call your API here to update the cart*
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCartItems(newCartItems);
        // toast.success("Cart quantity updated!"); // Uncomment after API integration
    };

    const handleRemoveItem = (itemId) => {
        // *In a real app, call your API to remove the item first*
        setCartItems(cartItems.filter(item => item.id !== itemId));
        toast.info("Item removed from cart.");
    };

    const handleCheckout = () => {
        // *Implement your checkout logic here*
        toast.success("Proceeding to checkout...");
    };

    const { subtotal, shipping, total } = calculateTotal();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600 text-lg">Loading your cart...</p>
            </div>
        );
    }
    
    // --- Cart Item Component ---
    const CartItem = ({ item }) => (
        <div className="flex items-center border-b border-gray-100 py-4 last:border-b-0">
            {/* Image */}
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Product Info */}
            <div className="ml-4 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 hover:text-orange-600 transition cursor-pointer">
                    {item.name}
                </h3>
                <p className="text-gray-500 text-sm">Unit Price: KSh {item.price.toLocaleString()}</p>
                <p className={`text-sm font-medium ${item.stock < 3 ? 'text-red-500' : 'text-green-600'}`}>
                    Stock: {item.stock} available
                </p>
            </div>

            {/* Quantity Control */}
            <div className="flex items-center border border-gray-300 rounded-lg mx-4">
                <button
                    onClick={() => handleQuantityChange(item.id, 'decrease')}
                    className="p-2 hover:bg-gray-100 transition"
                    disabled={item.quantity <= 1}
                >
                    <Minus className="w-4 h-4 text-gray-700" />
                </button>
                <span className="px-3 py-1 font-semibold text-gray-900 text-sm">
                    {item.quantity}
                </span>
                <button
                    onClick={() => handleQuantityChange(item.id, 'increase')}
                    className="p-2 hover:bg-gray-100 transition"
                    disabled={item.quantity >= item.stock}
                >
                    <Plus className="w-4 h-4 text-gray-700" />
                </button>
            </div>

            {/* Subtotal and Remove */}
            <div className="text-right ml-4 w-28 flex-shrink-0">
                <p className="text-xl font-bold text-gray-900 mb-2">
                    KSh {(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition flex items-center gap-1 text-sm ml-auto"
                >
                    <Trash2 className="w-4 h-4" />
                    Remove
                </button>
            </div>
        </div>
    );
    // --- End Cart Item Component ---


    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                    <ShoppingCart className="w-8 h-8 text-orange-600" />
                    Your Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
                        <p className="text-2xl text-gray-600">Your cart is empty.</p>
                        <button 
                            onClick={() => router.push('/products')}
                            className="mt-6 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 divide-y divide-gray-100">
                            {cartItems.map(item => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-20">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                                Order Summary
                            </h2>

                            <div className="space-y-3 text-gray-700">
                                <div className="flex justify-between text-lg">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping Estimate</span>
                                    <span className={`font-medium ${shipping > 0 ? 'text-gray-900' : 'text-green-600'}`}>
                                        {shipping > 0 ? `KSh ${shipping.toLocaleString()}` : 'Free'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax Estimate (0%)</span>
                                    <span className="font-medium">KSh 0</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between items-baseline text-2xl font-bold text-gray-900">
                                <span>Order Total</span>
                                <span className="text-orange-600">KSh {total.toLocaleString()}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full mt-8 py-3 bg-orange-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-orange-700 transition"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;