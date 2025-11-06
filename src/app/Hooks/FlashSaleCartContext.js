'use client'; 
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

const FlashSaleCartContext = createContext();

export const FlashSaleCartProvider = ({ children }) => {
    const [flashSaleCart, setFlashSaleCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // Add flash sale item to cart
    const addFlashSaleItem = useCallback((flashSale, quantity) => {
        try {
            // Validate time
            const now = new Date();
            const eatOffset = 3 * 60 * 60 * 1000;
            const currentTimeInEAT = now.getTime() + eatOffset;
            const endTime = new Date(flashSale.endTime).getTime();

            if (currentTimeInEAT >= endTime) {
                toast.error('This flash sale has ended');
                return false;
            }

            // Validate stock availability
            const availableStock = flashSale.stockLimit - (flashSale.soldCount || 0);
            if (quantity > availableStock) {
                toast.error(`Only ${availableStock} units available`);
                return false;
            }

            // Check if item already in cart
            setFlashSaleCart(prev => {
                const existingItem = prev.find(
                    item => item.flashSaleId === flashSale.id && item.productId === flashSale.productId
                );

                if (existingItem) {
                    const newQuantity = existingItem.quantity + quantity;
                    if (newQuantity > availableStock) {
                        toast.error(`Maximum ${availableStock} units available for this flash sale`);
                        return prev;
                    }
                    toast.success('Quantity updated');
                    return prev.map(item =>
                        item.id === existingItem.id
                            ? { ...item, quantity: newQuantity }
                            : item
                    );
                }

                const newItem = {
                    id: `flashsale-${flashSale.id}-${Date.now()}`,
                    flashSaleId: flashSale.id,
                    productId: flashSale.product?.id,
                    productName: flashSale.product?.name || flashSale.name,
                    regularPrice: parseFloat(flashSale.product?.price || 0),
                    flashSalePrice: parseFloat(flashSale.discountPrice),
                    discountPercent: flashSale.discountPercent,
                    quantity,
                    stockLimit: flashSale.stockLimit,
                    soldCount: flashSale.soldCount || 0,
                    endTime: flashSale.endTime,
                    startTime: flashSale.startTime,
                    itemType: 'flashsale'
                };

                toast.success('Added to flash sale cart');
                return [...prev, newItem];
            });

            return true;
        } catch (error) {
            console.error('Error adding flash sale item:', error);
            toast.error('Failed to add item');
            return false;
        }
    }, []);

    // Update quantity
    const updateFlashSaleQuantity = useCallback((itemId, newQuantity) => {
        setFlashSaleCart(prev => {
            const item = prev.find(i => i.id === itemId);
            if (!item) return prev;

            const availableStock = item.stockLimit - item.soldCount;

            if (newQuantity > availableStock) {
                toast.error(`Only ${availableStock} units available`);
                return prev;
            }

            if (newQuantity < 1) {
                return prev.filter(i => i.id !== itemId);
            }

            return prev.map(i =>
                i.id === itemId ? { ...i, quantity: newQuantity } : i
            );
        });
    }, []);

    // Remove item
    const removeFlashSaleItem = useCallback((itemId) => {
        setFlashSaleCart(prev => prev.filter(item => item.id !== itemId));
        toast.success('Item removed');
    }, []);

    // Check and remove expired items
    const removeExpiredItems = useCallback(() => {
        const now = new Date();
        const eatOffset = 3 * 60 * 60 * 1000;
        const currentTimeInEAT = now.getTime() + eatOffset;

        setFlashSaleCart(prev => {
            const updated = prev.filter(item => {
                const endTime = new Date(item.endTime).getTime();
                return currentTimeInEAT < endTime;
            });

            if (updated.length < prev.length) {
                toast.warning('Some flash sales have ended and were removed from cart');
            }

            return updated;
        });
    }, []);

    // Clear flash sale cart
    const clearFlashSaleCart = useCallback(() => {
        setFlashSaleCart([]);
        toast.success('Flash sale cart cleared');
    }, []);

    // Calculate subtotal
    const calculateFlashSaleSubtotal = useCallback(() => {
        return flashSaleCart.reduce(
            (sum, item) => sum + item.flashSalePrice * item.quantity,
            0
        );
    }, [flashSaleCart]);

    // Check expiration on mount and periodically
    useEffect(() => {
        removeExpiredItems();
        const interval = setInterval(removeExpiredItems, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, [removeExpiredItems]);

    const value = {
        flashSaleCart,
        addFlashSaleItem,
        updateFlashSaleQuantity,
        removeFlashSaleItem,
        clearFlashSaleCart,
        calculateFlashSaleSubtotal,
        loading
    };

    return (
        <FlashSaleCartContext.Provider value={value}>
            {children}
        </FlashSaleCartContext.Provider>
    );
};

export const useFlashSaleCart = () => {
    const context = useContext(FlashSaleCartContext);
    if (!context) {
        throw new Error('useFlashSaleCart must be used within FlashSaleCartProvider');
    }
    return context;
};