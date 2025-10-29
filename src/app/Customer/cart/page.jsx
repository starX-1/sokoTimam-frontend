'use client'
import { useState, useEffect } from 'react';
import Header from '../../components/header';
import Footer from '../../../app/components/Footer';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, Package, Receipt, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../../Hooks/CartContext'
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import CheckoutAPI from '../../api/checkout/api';

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
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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
        // setConfirmationModalOpen(true);
        // check paymentMethodSelected();
        if (!paymentMethod || !shippingAddress) {
            toast.error("Please fill in all required fields.");
            return;
        }
        setConfirmationModalOpen(true);
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
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [mpesaNumber, setMpesaNumber] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession()
            setLoggedInUser(session?.user || null)
        }
        fetchSession()
    }, [])

    useEffect(() => {
        if (loggedInUser) {
            setMpesaNumber(loggedInUser.phone || '');
        }
    }, [loggedInUser]);

    // console.log(loggedInUser, " Logged in user")
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
    const processOrder = async () => {
        // prevent duplicate submissions
        if (isProcessing) return;

        // basic validations
        if (!loggedInUser?.id) {
            toast.error("Please sign in to place an order.");
            return;
        }
        if (!shippingAddress) {
            toast.error("Please provide a shipping address.");
            return;
        }
        if (!cartItems?.length) {
            toast.error("Your cart is empty.");
            return;
        }

        setIsProcessing(true);

        const orderData = {
            userId: loggedInUser.id,
            shippingAddress,
            items: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        };

        try {
            const res = await CheckoutAPI.createOrder(orderData);
            const orderId = res?.data.orderId;

            if (!orderId) {
                console.error("Order creation returned no id:", res);
                throw new Error("Unable to create order. Please try again.");
            }

            const stkPushPayload = {
                phoneNumber: mpesaNumber,
                amount: total,
                orderId,
            };



            const stkRes = await CheckoutAPI.innitiateStkPush(stkPushPayload);

            // accept a couple of possible success shapes
            const successMessage = stkRes?.message?.toLowerCase() ?? "";
            const success =
                successMessage.includes("stk push initiated") ||
                stkRes?.status === "initiated" ||
                stkRes?.success === true;

            if (success) {
                toast.info("STK Push initiated. Please complete payment on your phone.");

                // Show waiting modal
                setPaymentStatus("pending");

                // Poll backend every few seconds to check payment status
                const interval = setInterval(async () => {
                    try {
                        const statusRes = await CheckoutAPI.checkPaymentStatus(orderId);
                        if (statusRes.status === "SUCCESS") {
                            clearInterval(interval);
                            toast.success("Payment successful!");
                            setConfirmationModalOpen(false);
                            router.push(`/order/success/${orderId}`);
                        } else if (statusRes.status === "FAILED") {
                            clearInterval(interval);
                            toast.error("Payment failed or was cancelled.");
                        }
                    } catch (err) {
                        clearInterval(interval);
                        toast.error("Error checking payment status. Please refresh.");
                    }
                }, 5000); // check every 5 seconds
            }


            console.error("STK push failed:", stkRes);
            toast.error(stkRes?.message || "Failed to initiate payment. Please try again.");
        } catch (err) {
            console.error("processOrder error:", err);
            toast.error(err?.message || "Failed to process order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };


    const ConfirmationModal = () => {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl mx-auto shadow-2xl">
                    {/* Receipt Header */}
                    <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Receipt className="w-8 h-8" />
                                <div>
                                    <h2 className="text-2xl font-bold">ORDER SUMMARY</h2>
                                    <p className="text-orange-100 text-sm">#{Date.now().toString().slice(-6)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setConfirmationModalOpen(false)}
                                className="text-white hover:text-orange-200 transition"
                                disabled={isProcessing}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Receipt Body */}
                    <div className="p-6 max-h-96 overflow-y-auto">
                        {/* Store Info */}
                        <div className="text-center mb-6 border-b border-gray-200 pb-4">
                            <h3 className="font-bold text-lg text-gray-800">SoKoTimam</h3>
                            {/* <p className="text-gray-600 text-sm">Thank you for your purchase!</p> */}
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3 mb-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm">{item.product.name}</p>
                                        <p className="text-gray-600 text-xs">
                                            KSh {item.product.price.toLocaleString()} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-gray-900">
                                        KSh {(item.product.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Receipt Totals */}
                        <div className="space-y-2 border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">
                                    {shipping > 0 ? `KSh ${shipping.toLocaleString()}` : 'FREE'}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                                <span className="text-gray-800">Total</span>
                                <span className="text-orange-600">KSh {total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-900 font-medium capitalize">{paymentMethod}</span>
                                <span className="text-gray-600 text-sm">
                                    {paymentMethod === 'mpesa' ? mpesaNumber : loggedInUser?.email}
                                </span>
                            </div>
                        </div>
                        {/* Shipping Address */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">Pick Up Station</p>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-900 font-medium capitalize">{shippingAddress}</span>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Footer */}
                    <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
                        <div className="flex justify-between gap-4">
                            <button
                                onClick={() => setConfirmationModalOpen(false)}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processOrder}
                                disabled={isProcessing}
                                className="flex-1 px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm Order'
                                )}
                            </button>
                        </div>
                        <p className="text-center text-gray-500 text-xs mt-3">
                            By confirming, you agree to our terms and conditions
                        </p>
                    </div>
                </div>
            </div>
        );
    };

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
                        <div className="w-32 h-32 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <img
                                // Placeholder size also reduced to match the new 40x40 dimension
                                src={product.images?.[0]?.imageUrl || 'https://placehold.co/40x40/f0f0f0/333333?text=Prod'}
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
                        onClick={() => router.push('/')}
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

                {
                    isConfirmationModalOpen && <ConfirmationModal />
                }

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
                        <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl sm:text-2xl text-gray-600 mb-2">Your cart is empty</p>
                        <p className="text-sm sm:text-base text-gray-500 mb-6">Add items to get started</p>
                        <button
                            onClick={() => router.push('/')}
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
                                {/* select input to sellect pick up stattion */}
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="pickupStation">
                                        Choose Pick Up Station <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="pickupStation"
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
                                    >
                                        <option value="">Select a station</option> {/* Added a default unselected option */}
                                        <option value="station1">Station 1 - Nairobi</option>
                                        <option value="station2">Station 2 - Mombasa</option>
                                        <option value="station3">Station 3 - Kisumu</option>
                                    </select>
                                </div>
                                {/* input for selecting payment method  */}
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="paymentMethod">
                                        Choose Payment Method <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="paymentMethod"
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
                                    // You would typically use a state handler (e.g., in React) to track the selected value
                                    // onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <option value="">Select a method</option> {/* Added a default unselected option */}
                                        <option value="mpesa">M-Pesa</option>
                                        <option value="card">Credit/Debit Card</option>
                                        <option value="paypal">PayPal</option>
                                    </select>


                                    {/* --- M-Pesa Input (Show when value is 'mpesa') --- */}
                                    {/* Example: {paymentMethod === 'mpesa' && ( ... )} */}
                                    {paymentMethod === 'mpesa' && (
                                        <div id="mpesa-details" className="mt-4">
                                            <label className="text-sm font-medium text-gray-700" htmlFor="mpesaNumber">
                                                Confirm M-Pesa Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="mpesaNumber"
                                                name="mpesaNumber"
                                                value={mpesaNumber}
                                                onChange={(e) => setMpesaNumber(e.target.value)}
                                                className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                placeholder="e.g., 0712345678"
                                            />
                                        </div>
                                    )
                                    }


                                    {/* --- Card Details Input (Show when value is 'card') --- */}
                                    {/* Example: {paymentMethod === 'card' && ( ... )} */}
                                    {paymentMethod === 'card' && (

                                        <div id="card-details" className="mt-4">
                                            {/* note for comign soon  */}
                                            <p className="text-xs text-gray-900 mb-2 bg-orange-500 p-2 rounded">
                                                💳 Card payments are coming soon! For now, please use M-Pesa.
                                            </p>
                                            <label className="text-sm font-medium text-gray-700" htmlFor="cardNumber">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                placeholder="XXXX XXXX XXXX XXXX"
                                            />
                                            <div className="flex space-x-4 mt-3">
                                                <div className="w-1/2">
                                                    <label className="text-sm font-medium text-gray-700" htmlFor="cardExpiry">
                                                        Expiry Date (MM/YY)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="cardExpiry"
                                                        className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                        placeholder="MM/YY"
                                                    />
                                                </div>
                                                <div className="w-1/2">
                                                    <label className="text-sm font-medium text-gray-700" htmlFor="cardCVC">
                                                        CVC
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="cardCVC"
                                                        className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                        placeholder="123"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- PayPal Input (Show when value is 'paypal') --- */}
                                    {/* Example: {paymentMethod === 'paypal' && ( ... )} */}
                                    {paymentMethod === 'paypal' && (

                                        <div id="paypal-details" className="mt-4">
                                            {/* note for comign soon  */}
                                            <p className="text-xs text-gray-900 mb-2 bg-orange-500 p-2 rounded">
                                                🅿️ PayPal payments are coming soon! For now, please use M-Pesa
                                            </p>
                                            <label className="text-sm font-medium text-gray-700" htmlFor="paypalEmail">
                                                PayPal Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="paypalEmail"
                                                className="mt-1 text-gray-700 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                    )}
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