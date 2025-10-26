'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Assuming you have an API client for cart operations
import Cart from '../api/cart/api'; 
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';

// 1. Create the Context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// 2. Define the Provider Component
export const CartProvider = ({ children }) => {
    // State to hold the entire cart object from the backend
    const [cart, setCart] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Helper to extract the item array (for easy iteration)
    const cartItems = cart?.items || [];
    
    // --- AUTHENTICATION & INITIAL FETCH ---
    useEffect(() => {
        const fetchUserData = async () => {
            const session = await getSession();
            setUser(session?.user || null);
        };
        fetchUserData();
    }, []);

    // Function to fetch the cart data from the backend
    const fetchCart = useCallback(async (userId) => {
        if (!userId) {
            setLoading(false);
            setCart(null);
            return;
        }
        
        try {
            const response = await Cart.getUserCart(userId);
            if (response.message === "Cart with items retrieved successfully") {
                setCart(response.cart);
            } else {
                setCart(null); // Set to null if the response is empty or error
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            setCart(null);
            // Optionally show a toast error
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load effect
    useEffect(() => {
        if (user) {
            fetchCart(user.id);
        } else {
            setLoading(false);
        }
    }, [user, fetchCart]);

    // --- CART LOGIC FUNCTIONS ---

    /**
     * Calculates the subtotal price of all items in the cart.
     * @returns {number} The total price.
     */
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => 
            total + (parseFloat(item.product.price) * item.quantity), 0
        );
    };

    /**
     * Updates the quantity of a specific item in the cart via API.
     * @param {number} productId - The ID of the product to update.
     * @param {number} newQuantity - The new quantity.
     */
    const updateItemQuantity = async (productId, newQuantity) => {
        if (!user || !cart) return;

        // Optimistic UI update (optional, but good for UX)
        const prevItems = cartItems;
        setCart(prevCart => ({
            ...prevCart,
            items: prevItems.map(item => 
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            ),
        }));

        try {
            // NOTE: You'll need to implement an API call for quantity update
            // call api with userId, items[{productId, newQuantity- prevQuantity}]
            await Cart.addToCart({ userId: user.id, items: [{ productId, quantity: newQuantity - cartItems.find(item => item.productId === productId).quantity}] });
            // await Cart.updateItem({ cartId: cart.id, productId, quantity: newQuantity });
            toast.success("Cart quantity updated!");
            // Re-fetch cart for confirmation/sync if needed:
            fetchCart(user.id); 
        } catch (error) {
            console.error("Failed to update cart quantity:", error);
            setCart(prevItems); // Rollback optimistic update
            toast.error("Failed to update quantity.");
        }
    };
    
    // NOTE: You would add other functions here: 
    // - removeItemFromCart(productId)
    // - addItemToCart(productId, quantity)

    // --- CONTEXT VALUE ---

    const contextValue = {
        cart: cart,
        items: cartItems,
        loading: loading,
        subtotal: calculateSubtotal(),
        itemCount: cartItems.length,
        fetchCart: fetchCart, // expose for manual refresh
        updateItemQuantity: updateItemQuantity,
        isLoggedIn: !!user,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};