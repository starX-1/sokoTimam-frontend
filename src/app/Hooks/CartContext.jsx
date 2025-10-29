'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cart from '../api/cart/api';
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';

// Create the Context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Provider
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const cartItems = cart?.items || [];

    // Fetch session/user once on mount
    useEffect(() => {
        const fetchUserData = async () => {
            const session = await getSession();
            setUser(session?.user || null);
        };
        fetchUserData();
    }, []);

    // Fetch cart function
    const fetchCart = useCallback(async (userId) => {
        if (!userId) {
            setLoading(false);
            setCart(null);
            return;
        }

        setLoading(true);
        try {
            const response = await Cart.getUserCart(userId);
            if (response?.message === "Cart with items retrieved successfully") {
                setCart(response.cart);
            } else {
                setCart(null);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            setCart(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // initial load effect
    useEffect(() => {
        if (user) {
            fetchCart(user.id);
        } else {
            setLoading(false);
        }
    }, [user, fetchCart]);

    // subtotal helper
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) =>
            total + (parseFloat(item.product?.price || 0) * item.quantity), 0
        );
    };

    // --- NEW: remove item from cart (exposed) ---
    const removeItemFromCart = async (itemId) => {
        if (!user || !cart) {
            toast.error("Unable to remove item. Please sign in.");
            return { success: false };
        }

        // Find existing items for rollback
        const prevCart = cart;
        const prevItems = cartItems;

        // Optimistic update: remove locally first
        const optimisticItems = prevItems.filter(item => item.id !== itemId && item.productId !== itemId);
        setCart(prevCart => ({
            ...prevCart,
            items: optimisticItems,
        }));

        try {
            // Call API - ensure your API accepts itemId
            const response = await Cart.removeCartItem(itemId);

            // If API says success, optionally re-fetch full cart to ensure sync
            if (response?.message === 'Cart item removed successfully') {
                toast.success("Item removed from cart");
                // re-sync to be safe (optional)
                fetchCart(user.id);
                return { success: true, response };
            } else {
                // rollback
                setCart(prevCart);
                toast.error("Failed to remove item from cart");
                return { success: false, response };
            }
        } catch (error) {
            console.error('removeItemFromCart error:', error);
            // rollback optimistic update
            setCart(prevCart);
            toast.error("Failed to remove item from cart");
            return { success: false, error };
        }
    };

    // --- NEW: addItemToCart example (brief) ---
    const addItemToCart = async ({ productId, quantity = 1 }) => {
        if (!user) {
            toast.error("Please sign in to add items.");
            return;
        }

        try {
            // Call your API (implement accordingly)
            await Cart.addToCart({ userId: user.id, items: [{ productId, quantity }] });
            toast.success("Item added to cart");
            // refresh cart
            fetchCart(user.id);
        } catch (err) {
            console.error('addItemToCart error', err);
            toast.error("Failed to add item to cart");
        }
    };

    // expose context value
    const contextValue = {
        cart,
        items: cartItems,
        loading,
        subtotal: calculateSubtotal(),
        itemCount: cartItems.length,
        fetchCart,
        updateItemQuantity: (productId, newQuantity) => {
            // keep your existing updateItemQuantity or reuse addItemToCart
            // For now call the same fetch flow:
            // (you already have the implementation above)
            // We will re-use the implementation you provided earlier if present.
            // To keep this provider self-contained, call fetchCart after change
            (async () => {
                // naive approach: call Cart.addToCart or your update endpoint
                try {
                    await Cart.addToCart({ userId: user.id, items: [{ productId, quantity: newQuantity }] });
                    fetchCart(user.id);
                } catch (err) {
                    console.error('updateItemQuantity error', err);
                }
            })();
        },
        removeItemFromCart,
        addItemToCart,
        isLoggedIn: !!user,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};
