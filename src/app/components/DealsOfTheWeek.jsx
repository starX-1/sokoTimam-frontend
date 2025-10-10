'use client'
import { useEffect, useState } from 'react';
import DealCard from './DealCard';
import Products from '../api/products/api';
import { useRouter } from 'next/navigation';

const DealsOfTheWeek = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleProductClick = (productId) => {
        router.push(`/Customer/product/${productId}`);
    };

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await Products.getProducts();
                console.log("this is the response", response);

                // Get first 4 products
                const firstFourProducts = response.products.slice(0, 4);
                setDeals(firstFourProducts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    useEffect(() => {
        // Only run this if deals have been fetched and don't already have images
        if (deals.length === 0 || deals.some(p => p.images)) return;

        const fetchProductImages = async () => {
            const enrichedProducts = await Promise.all(
                deals.map(async (product) => {
                    const response = await Products.getProductWithImages(product.id);
                    return {
                        ...product,
                        images: response.images,
                    };
                })
            );
            setDeals(enrichedProducts);
        };

        fetchProductImages();
    }, [deals]);

    console.log(deals);

    return (
        <section className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white p-4 bg-orange-950 rounded-xl shadow-lg">
                    🔥 Deals of the Week
                </h2>

                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Loading deals...</p>
                    </div>
                ) : (
                    <div
                        // onClick={() => handleProductClick(product.id)}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {deals.map((product) => {
                            // Get the main image or fallback to first image
                            const mainImage = product.images?.find(img => img.isMain)?.imageUrl
                                || product.images?.[0]?.imageUrl
                                || '';

                            return (
                                <div
                                    key={product.id}
                                    onClick={() => handleProductClick(product.id)}
                                >
                                    {
                                        mainImage && (

                                            <DealCard
                                                key={product.id}
                                                title={product.name}
                                                price={`KSh ${parseFloat(product.price).toLocaleString()}`}
                                                imageUrl={mainImage}
                                            />
                                        )}

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DealsOfTheWeek;