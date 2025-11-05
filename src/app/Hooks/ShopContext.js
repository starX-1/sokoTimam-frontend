'use client'
import { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import sellers from '../api/seller/api'; // Adjust path

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Auto-load shops when provider mounts
    useEffect(() => {
        const loadShops = async () => {
            try {
                const sellerData = JSON.parse(sessionStorage.getItem('sellerData'));
                if (!sellerData?.id) {
                    setLoading(false);
                    return;
                }

                const session = await getSession();
                const res = await sellers.getAllMyShops(
                    sellerData.id,
                    session.user.accessToken
                );

                setShops(res.shops || []);
            } catch (err) {
                console.error('Error auto-loading shops:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadShops();
    }, []);

    return (
        <ShopContext.Provider value={{ shops, setShops, loading, error }}>
            {children}
        </ShopContext.Provider>
    );
}

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
}