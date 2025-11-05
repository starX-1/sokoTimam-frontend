'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Products from '../../../api/products/api';
import Categories from '../../../api/categories/api';
import Header from '../../../components/header';
import Footer from '../../../components/Footer';
import { Filter, Search, Grid, List, Star, ChevronDown } from 'lucide-react';

const CategoryProductsPage = () => {
    const params = useParams();
    const categoryId = params?.id; // Assuming the route is /Customer/category/[id]
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('Category');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const router = useRouter();

    useEffect(() => {
        const fetchCategoryData = async () => {
            if (!categoryId) return;

            try {
                setLoading(true);

                // 1️⃣ Fetch products for the category
                const productResponse = await Categories.getProductsByCategory(categoryId);
                const productsData = productResponse?.products || [];


                // 2️⃣ Fetch images for each product concurrently using Promise.all
                const enrichedProducts = await Promise.all(
                    productsData.map(async (product) => {
                        try {
                            const imageData = await Products.getProductImagesById(product.id);

                            return {
                                ...product,
                                images: imageData?.images || [], // Attach images to each product
                            };
                        } catch (err) {
                            console.error(`Error fetching images for product ${product.id}:`, err);
                            return {
                                ...product,
                                images: [], // Default to empty images on error
                            };
                        }
                    })
                );

                // Update the enriched products state
                setProducts(enrichedProducts);

                // 3️⃣ Fetch the category name for the title
                const categoryResponse = await Categories.getCategoryById(categoryId);

                setCategoryName(categoryResponse?.category?.name || 'Products');
            } catch (error) {
                console.error("Error fetching category products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [categoryId]);

    // Product Card Component (Reused from elsewhere, adapted slightly)
    const ProductCard = ({ product }) => (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer "
            onClick={() => router.push(`/Customer/product/${product.id}`)}
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={product.images?.[0]?.imageUrl || 'https://placehold.co/400x400/f0f0f0/333333?text=Product'}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-300 hover:scale-105"
                />
            </div>

            {/* Details */}
            <div className="p-4 space-y-1">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-orange-600">
                    {product.name}
                </h3>
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">(4.5)</span>
                </div>
                <p className="text-lg font-bold text-orange-600">
                    KSh {parseFloat(product.price).toLocaleString()}
                </p>
                <p className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading {categoryName} products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 ">

                {/* Breadcrumb / Title */}
                <div className="mb-8">
                    <nav className="text-sm text-gray-600 mb-2">
                        <span onClick={() => router.push('/')} className="hover:text-orange-600 cursor-pointer">Home</span>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{categoryName}</span>
                    </nav>
                    <h1 className="text-4xl font-extrabold text-gray-900">{categoryName}</h1>
                </div>

                {/* Filters and View Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm mb-6 gap-3">

                    {/* Search & Filter Button (Mobile/Tablet) */}
                    <div className="flex gap-3 w-full md:w-auto">
                        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                        <div className="relative flex-grow">
                            <input type="text" placeholder={`Search in ${categoryName}...`} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition duration-150" />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Sorting and View Mode */}
                    <div className="flex items-center gap-4 mt-3 md:mt-0">
                        {/* Sorting Dropdown */}
                        <div className="relative">
                            <select className="appearance-none bg-white border border-gray-300 py-2 pl-3 pr-8 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-orange-500 focus:border-orange-500">
                                <option>Sort by: Latest</option>
                                <option>Sort by: Price Low to High</option>
                                <option>Sort by: Price High to Low</option>
                                <option>Sort by: Top Rated</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>

                        {/* View Mode Toggles */}
                        <div className="hidden sm:flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 transition ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Listing Area */}
                {products.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-10 text-center mt-8">
                        <p className="text-2xl text-gray-600">No products found in {categoryName}.</p>
                        <p className="text-gray-500 mt-2">Try checking other categories or shops.</p>
                    </div>
                ) : (
                    // Product Grid View
                    <div className={`mt-8 ${viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' : 'space-y-4'}`}>
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    // NOTE: You would implement the 'list' view rendering here too, 
                    // perhaps by passing the viewMode prop to ProductCard and changing its layout.
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CategoryProductsPage;