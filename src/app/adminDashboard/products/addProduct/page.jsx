'use client'
import { useState } from 'react';
import { AlignLeft, Box, DollarSign, Hash, Image, Layers, Package, Store, Tag, TrendingUp } from 'lucide-react';

const AddProductView = ({ onViewChange }) => {
    // Initial state based on the provided JSON data, mapped to React state
    const [productData, setProductData] = useState({
        shopId: 1,
        categoryId: 1,
        name: "Premium Beef Steak",
        description: "Freshly cut premium beef steak, 1kg pack.",
        price: 1500.00,
        stock: 50,
        sku: "BEEF-STEAK-1KG",
        status: "Active", // Mapped from "active" to "Active" for consistency with getStatusStyles
        imageUrl: "https://placehold.co/100x100/f3f4f6/374151?text=IMG", 
        rating: 0,
        salesCount: 0
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setProductData(prev => ({
            ...prev,
            // Convert numbers and IDs to actual numerical types
            [name]: (type === 'number' || name === 'shopId' || name === 'categoryId') ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Log the final data object, including pre-populated and manually entered fields
        // This is where you would call the Firebase addDoc function.
        console.log('Submitting new product with data:', productData);
        
        // Removed alert() as per instructions, replaced with console log
        console.log('Product added successfully! Redirecting back to list.'); 
        
        // Navigate back to the product list
        onViewChange('#/products'); 
    };

    const InputGroup = ({ label, icon: Icon, type = 'text', name, placeholder, isRequired = true, value, min = null }) => (
        <div className="mb-6">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                {/* Only render icon placeholder space if an Icon is provided */}
                {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
                <input
                    type={type}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    required={isRequired}
                    value={value}
                    min={min}
                    onChange={handleChange}
                    className={`w-full py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 border border-gray-200 rounded-xl shadow-inner focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-800`}
                    // Step for number inputs (0.01 for currency, 1 for integers)
                    step={type === 'number' && name === 'price' ? '0.01' : (type === 'number' ? '1' : undefined)}
                />
            </div>
        </div>
    );

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
                        />
                        <InputGroup 
                            label="SKU (Stock Keeping Unit)" 
                            icon={Tag} 
                            name="sku" 
                            placeholder="e.g., WCR-001" 
                            value={productData.sku}
                        />
                    </div>
                    
                    {/* IDs and Numeric Data */}
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 pt-6">Pricing & Categorization</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <InputGroup 
                            label="Shop ID" 
                            icon={Store} 
                            type="number"
                            name="shopId" 
                            placeholder="e.g., 1" 
                            value={productData.shopId}
                            min="1"
                        />
                        <InputGroup 
                            label="Category ID" 
                            icon={Layers} 
                            type="number"
                            name="categoryId" 
                            placeholder="e.g., 10" 
                            value={productData.categoryId}
                            min="1"
                        />
                        <InputGroup 
                            label="Price (KSH)" 
                            icon={DollarSign} 
                            type="number"
                            name="price" 
                            placeholder="e.g., 1500.00" 
                            value={productData.price}
                            min="0"
                        />
                        <InputGroup 
                            label="Stock Quantity" 
                            icon={Box} 
                            type="number"
                            name="stock" 
                            placeholder="e.g., 50" 
                            value={productData.stock}
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
                                className="w-full py-3 px-3 border border-gray-200 rounded-xl shadow-inner focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-800"
                            >
                                <option value="Active">Active</option>
                                <option value="Out of Stock">Out of Stock</option>
                                <option value="Pending Review">Pending Review</option>
                            </select>
                        </div>
                        <InputGroup 
                            label="Image URL" 
                            icon={Image} 
                            name="imageUrl" 
                            placeholder="https://example.com/product.jpg" 
                            value={productData.imageUrl}
                        />
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
                                className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl shadow-inner focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-800"
                            ></textarea>
                        </div>
                    </div>
                    
                    {/* Readonly/Hidden fields (for reference) */}
                    <div className="grid grid-cols-2 gap-6">
                        <InputGroup 
                            label="Initial Rating (Readonly)" 
                            icon={Hash} 
                            type="number"
                            name="rating" 
                            value={productData.rating}
                            isRequired={false}
                            min="0"
                        />
                        <InputGroup 
                            label="Initial Sales Count (Readonly)" 
                            icon={TrendingUp} 
                            type="number"
                            name="salesCount" 
                            value={productData.salesCount}
                            isRequired={false}
                            min="0"
                        />
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
            </div>
        </div>
    );
};

export default AddProductView;