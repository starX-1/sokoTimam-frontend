'use client'
import { useState, useEffect } from 'react';
import { AlignLeft, Box, DollarSign, Hash, Image, Layers, Package, Store, Tag, TrendingUp } from 'lucide-react';
import Shops from '../../../api/shop/api'
import { getSession } from 'next-auth/react';
import Categories from '../../../api/categories/api'
import Products from '../../../api/products/api'
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import sellers from '../../../api/seller/api'


// InputGroup component remains the same
// ✅ DEFINE THE COMPONENT OUTSIDE
const InputGroup = ({ label, icon: Icon, type = 'text', name, placeholder, isRequired = true, value, min = null, onChange }) => (
    <div className="mb-6">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                required={isRequired}
                value={value}
                min={min}
                onChange={onChange} // Use the passed-in onChange prop
                className={`w-full py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 border border-gray-200 rounded-xl shadow-inner focus:ring-orange-500 focus:outline-none focus:border-orange-500 transition duration-150 text-gray-800`}
                step={type === 'number' && name === 'price' ? '0.01' : (type === 'number' ? '1' : undefined)}
            />
        </div>
    </div>
);


const AddProductView = ({ onViewChange }) => {
    // State for product data
    const [productData, setProductData] = useState({
        shopId: '',
        categoryId: '',
        name: "",
        description: "",
        price: 0,
        stock: 0,
        // sku: "",
        status: "",
        images: [], // Changed from imageUrl to images array
        subcategoryId: '', // Added subcategory ID
        // rating: 0,
        // salesCount: 0
    });

    // State for fetched data
    const [shops, setShops] = useState([]);
    const [categories, setCategories] = useState([]);
    const [everyCat, setEveryCat] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sellerSession, setSellerSession] = useState(null);
    const router = useRouter();

    // Fetch shops and categories on component mount
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const session = await getSession();
                setSellerSession(session);
                // get seller data from sission storage 
                const sellerData = JSON.parse(sessionStorage.getItem('sellerData'));
                // Fetch shops
                const shopsResponse = await sellers.getAllMyShops(sellerData.id, session.user.accessToken);
                // const shopsData = await shopsResponse.json();
                setShops(shopsResponse.shops);

                // Fetch categories
                const categoriesResponse = await Categories.getCategories();
                // const categoriesData = await categoriesResponse.json();
                // filter out categories with parentId because they are sub categories by default 
                const filteredCategories = categoriesResponse.categories.filter(category => !category.parentId);
                setCategories(filteredCategories);
                setEveryCat(categoriesResponse.categories);
                // 
                // setCategories(categoriesResponse.categories);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Filter subcategories when category changes
    useEffect(() => {
        if (productData.categoryId) {
            const fetchSubcategories = async () => {
                try {
                    // filter out the categories whose parentId equal the selected category id 
                    const filteredCategories = everyCat.filter(category => category.parentId === parseInt(productData.categoryId));
                    setSubcategories(filteredCategories);
                } catch (error) {
                    console.error('Error fetching subcategories:', error);
                    setSubcategories([]);
                }
            };
            fetchSubcategories();
        } else {
            setSubcategories([]);
        }
    }, [productData.categoryId]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: (type === 'number' || name === 'price' || name === 'stock') ? parseFloat(value) : value
        }));
    };

    // Handle multiple file selection
    const handleFileChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setProductData(prev => ({
                ...prev,
                images: filesArray
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Append all product data
            Object.keys(productData).forEach(key => {
                if (key === 'images') {
                    // Append each image file
                    productData.images.forEach((image, index) => {
                        formData.append('images', image);
                    });
                } else {
                    formData.append(key, productData[key]);
                }
            });

            const response = await Products.createProduct(sellerSession.user.accessToken, formData);

            if (response.message === "Product created successfully") {
                toast.success("Product created successfully");
                router.push('/sellerDashboard/products');
                // onViewChange('#/products');
            } else {
                console.error('Failed to add product');
            }
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };



    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-3xl font-bold text-gray-800">Add New Product</h2>
                <a
                    href="#/products"
                    onClick={(e) => { e.preventDefault(); onViewChange('#/products'); }}
                    className="mt-4 sm:mt-0 text-gray-600 hover:text-orange-600 transition text-sm font-medium"
                >
                    ← Back to Products List
                </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Primary Product Details */}
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Core Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup
                                label="Product Name"
                                icon={Package}
                                name="name"
                                placeholder="e.g., Hand-Carved Wooden Rhino"
                                value={productData.name}
                                onChange={handleChange}
                            />
                            {/* <InputGroup
                                label="SKU (Stock Keeping Unit)"
                                icon={Tag}
                                name="sku"
                                placeholder="e.g., WCR-001"
                                value={productData.sku}
                                onChange={handleChange}
                            /> */}
                        </div>

                        {/* IDs and Numeric Data */}
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 pt-6">Pricing & Categorization</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Shop Selection */}
                            <div className="mb-6">
                                <label htmlFor="shopId" className="block text-sm font-medium text-gray-700 mb-1">Shop</label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        id="shopId"
                                        name="shopId"
                                        value={productData.shopId}
                                        onChange={handleChange}
                                        required
                                        className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl shadow-inner focus:ring-orange-500 focus:outline-none focus:border-orange-500 transition duration-150 text-gray-800"
                                    >
                                        <option value="">Select a Shop</option>
                                        {shops.map(shop => (
                                            <option key={shop.id} value={shop.id}>
                                                {shop.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Category Selection */}
                            <div className="mb-6">
                                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <div className="relative">
                                    <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        value={productData.categoryId}
                                        onChange={handleChange}
                                        required
                                        className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl shadow-inner focus:ring-orange-500 focus:outline-none focus:border-orange-500 transition duration-150 text-gray-800"
                                    >
                                        <option value="">Select a Category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Subcategory Selection - Only show if category is selected */}
                            {productData.categoryId && (
                                <div className="mb-6">
                                    <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700 mb-1">Subcategory (Optional)</label>
                                    <div className="relative">
                                        <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            id="subcategoryId"
                                            name="subcategoryId"
                                            value={productData.subcategoryId}
                                            onChange={handleChange}
                                            className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl shadow-inner focus:ring-orange-500 focus:outline-none focus:border-orange-500 transition duration-150 text-gray-800"
                                        >
                                            <option value="">Select a Subcategory</option>
                                            {subcategories.map(subcategory => (
                                                <option key={subcategory.id} value={subcategory.id}>
                                                    {subcategory.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <InputGroup
                                label="Price (KSH)"
                                icon={DollarSign}
                                type="number"
                                name="price"
                                placeholder="e.g., 1500.00"
                                value={productData.price}
                                onChange={handleChange}
                                min="0"
                            />
                            <InputGroup
                                label="Stock Quantity"
                                icon={Box}
                                type="number"
                                name="stock"
                                placeholder="e.g., 50"
                                value={productData.stock}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        {/* Status and Media */}
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 pt-6">Media & Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={productData.status}
                                    onChange={handleChange}
                                    className="w-full py-3 px-3 border border-gray-200 rounded-xl shadow-inner focus:ring-orange-500 focus:outline-none focus:border-orange-500 transition duration-150 text-gray-800"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                    <option value="Pending Review">Pending Review</option>
                                </select>
                            </div>

                            {/* Multiple Image Upload */}
                            <div className="mb-6">
                                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Images (Multiple)
                                </label>
                                <div className="relative">
                                    <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="file"
                                        id="images"
                                        name="images"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl shadow-inner focus:ring-orange-500 focus:outline-none focus:border-orange-500 transition duration-150 text-gray-800"
                                    />
                                </div>
                                {productData.images.length > 0 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        {productData.images.length} image(s) selected
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    placeholder="Describe the product, its features, and materials..."
                                    required
                                    value={productData.description}
                                    onChange={handleChange}
                                    className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl shadow-inner focus:ring-orange-500 focus:outline-none focus:border-orange-500 transition duration-150 text-gray-800"
                                ></textarea>
                            </div>
                        </div>

                        {/* Readonly/Hidden fields */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* <InputGroup
                                label="Initial Rating (Readonly)"
                                icon={Hash}
                                type="number"
                                name="rating"
                                value={productData.rating}
                                onChange={handleChange}
                                isRequired={false}
                                min="0"
                            /> */}
                            {/* <InputGroup
                                label="Initial Sales Count (Readonly)"
                                icon={TrendingUp}
                                type="number"
                                name="salesCount"
                                value={productData.salesCount}
                                onChange={handleChange}
                                isRequired={false}
                                min="0"
                            /> */}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-4 pt-8">
                            <button
                                type="button"
                                onClick={() => onViewChange('#/products')}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-[#985942] text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:bg-[#864c37] transition duration-200"
                            >
                                Save Product
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
};

export default AddProductView;