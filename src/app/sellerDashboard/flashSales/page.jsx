'use client'
import { useEffect, useState } from 'react';
import { Search, Clock, Zap, Edit2, Trash2, Plus, X } from 'lucide-react';
import { useShop } from '../../Hooks/ShopContext';
import FlashSales from '../../api/flashsale/api'
import { toast } from 'react-toastify';
import { getSession } from 'next-auth/react';

const FlashSalesPage = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [deleteSaleId, setDeleteSaleId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    discountPercent: '',
    discountPrice: '',
    stockLimit: '',
    startTime: '',
    endTime: '',
    status: 'upcoming',
  });
  const [formErrors, setFormErrors] = useState({});
  const [products, setProducts] = useState([]);
  const { shops } = useShop()
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (shops) {
      setProducts(shops[0]?.products)
    }
  }, [shops])

  // Get user session
  useEffect(() => {
    const getUser = async () => {
      const session = await getSession();
      setUser(session?.user || null);
    }
    getUser();
  }, [])

  // Fetch flash sales from API
  useEffect(() => {
    const getFlashSales = async () => {
      if (!shops?.[0]?.sellerId || !user?.accessToken) return;

      try {
        setIsLoading(true);
        const res = await FlashSales.getSellerFlashSales(shops[0].sellerId, user.accessToken)
        if (res?.data && Array.isArray(res.data)) {
          // Transform API data to match table structure
          const transformedSales = res.data.map(sale => ({
            id: sale.id,
            name: sale.product?.name || `Flash Sale #${sale.id}`,
            discountPercent: sale.discountPercent,
            productCount: 1,
            startTime: sale.startTime,
            endTime: sale.endTime,
            status: sale.status,
            revenue: sale.soldCount ? (sale.discountPrice * sale.soldCount).toLocaleString() : '0',
            participants: sale.soldCount || 0,
            stockLimit: sale.stockLimit,
            discountPrice: sale.discountPrice,
            soldCount: sale.soldCount,
            product: sale.product,
            productId: sale.product?.id
          }));
          setSales(transformedSales);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching flash sales:', error);
        setIsLoading(false);
        toast.error('Failed to load flash sales');
      }
    }

    getFlashSales();
  }, [user, shops])

  const getStatusStyles = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-100';
      case 'upcoming':
        return 'text-blue-700 bg-blue-100';
      case 'ended':
        return 'text-gray-700 bg-gray-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getTimeRemaining = (endTime) => {
    // const end = new Date(endTime);
    // const now = new Date();
    const diff = new Date(endTime).getTime() - new Date().getTime();

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  console.log('sales', sales)

  const filteredSales = sales.filter((sale) => {
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    const matchesSearch = sale.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const validateForm = () => {
    const errors = {};

    if (!formData.productId) {
      errors.productId = 'Product is required';
    }

    // const discountPercent = Number(formData.discountPercent);
    // if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
    //   errors.discountPercent = 'Discount must be between 0 and 100';
    // }

    const discountPrice = Number(formData.discountPrice);
    if (!Number.isFinite(discountPrice) || discountPrice < 0) {
      errors.discountPrice = 'Discount price must be non-negative';
    }

    const stockLimit = parseInt(formData.stockLimit, 10);
    if (!Number.isInteger(stockLimit) || stockLimit <= 0) {
      errors.stockLimit = 'Stock limit must be greater than 0';
    }

    if (!formData.startTime) errors.startTime = 'Start time is required';
    if (!formData.endTime) errors.endTime = 'End time is required';

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);

      if (isNaN(start.getTime())) {
        errors.startTime = 'Start time is invalid';
      }
      if (isNaN(end.getTime())) {
        errors.endTime = 'End time is invalid';
      }
      if (!errors.startTime && !errors.endTime && start >= end) {
        errors.endTime = 'End time must be after start time';
      }
    }

    if (formData.productId && Number.isInteger(stockLimit) && stockLimit > 0) {
      const product = products?.find(p => String(p.id) === String(formData.productId));
      if (!product) {
        errors.productId = 'Selected product not found';
      } else {
        const available = Number(product.stock);
        if (!Number.isFinite(available)) {
          errors.productId = 'Product has invalid stock value';
        } else if (stockLimit > available) {
          errors.stockLimit = `Stock limit cannot exceed available stock (${available})`;
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await FlashSales.createFlashSale(formData, user.accessToken)
        toast.success('Flash Sale created successfully');
        closeModal();
        // Refresh the flash sales list
        const refreshRes = await FlashSales.getSellerFlashSales(shops[0].sellerId, user.accessToken)
        if (refreshRes?.data) {
          const transformedSales = refreshRes.data.map(sale => ({
            id: sale.id,
            name: sale.product?.name || `Flash Sale #${sale.id}`,
            discountPercent: sale.discountPercent,
            productCount: 1,
            startTime: sale.startTime,
            endTime: sale.endTime,
            status: sale.status,
            revenue: sale.soldCount ? (sale.discountPrice * sale.soldCount).toLocaleString() : '0',
            participants: sale.soldCount || 0,
            stockLimit: sale.stockLimit,
            discountPrice: sale.discountPrice,
            soldCount: sale.soldCount,
            product: sale.product,
            productId: sale.product?.id
          }));
          setSales(transformedSales);
        }
      } catch (error) {
        toast.error('Failed to create flash sale');
      }
    }
  };

  const handleEditClick = (sale) => {
    setEditingSaleId(sale.id);
    setFormData({
      productId: sale.productId,
      discountPercent: sale.discountPercent,
      discountPrice: sale.discountPrice,
      stockLimit: sale.stockLimit,
      startTime: sale.startTime,
      endTime: sale.endTime,
      status: sale.status,
    });
    setFormErrors({});
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const updateData = {
          ...formData,
          id: editingSaleId
        };
        const res = await FlashSales.updateFlashSale(updateData, user.accessToken)
        toast.success('Flash Sale updated successfully');
        closeUpdateModal();
        // Refresh the flash sales list
        const refreshRes = await FlashSales.getSellerFlashSales(shops[0].sellerId, user.accessToken)
        if (refreshRes?.data) {
          const transformedSales = refreshRes.data.map(sale => ({
            id: sale.id,
            name: sale.product?.name || `Flash Sale #${sale.id}`,
            discountPercent: sale.discountPercent,
            productCount: 1,
            startTime: sale.startTime,
            endTime: sale.endTime,
            status: sale.status,
            revenue: sale.soldCount ? (sale.discountPrice * sale.soldCount).toLocaleString() : '0',
            participants: sale.soldCount || 0,
            stockLimit: sale.stockLimit,
            discountPrice: sale.discountPrice,
            soldCount: sale.soldCount,
            product: sale.product,
            productId: sale.product?.id
          }));
          setSales(transformedSales);
        }
      } catch (error) {
        toast.error('Failed to update flash sale');
      }
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteSaleId(id);
    setShowDeleteModal(true);
  }

  const handleDelete = async (id) => {
    try {
      const res = await FlashSales.deleteFlashSale(id, user.accessToken)
      toast.success('Flash Sale deleted successfully');
      // Refresh the flash sales list
      const refreshRes = await FlashSales.getSellerFlashSales(shops[0].sellerId, user.accessToken)
      // if (refreshRes?.data) {
      const transformedSales = refreshRes.data.map(sale => ({
        id: sale.id,
        name: sale.product?.name || `Flash Sale #${sale.id}`,
        discountPercent: sale.discountPercent,
        productCount: 1,
        startTime: sale.startTime,
        endTime: sale.endTime,
        status: sale.status,
        revenue: sale.soldCount ? (sale.discountPrice * sale.soldCount).toLocaleString() : '0',
        participants: sale.soldCount || 0,
        stockLimit: sale.stockLimit,
        discountPrice: sale.discountPrice,
        soldCount: sale.soldCount,
        product: sale.product,
        productId: sale.product?.id
      }));
      setSales(transformedSales);
      // }
    } catch (error) {
      toast.error('Failed to delete flash sale');
    }
    finally {
      setShowDeleteModal(false);

    }
  }
  const closeModal = () => {
    setShowModal(false);
    setFormData({
      productId: '',
      discountPercent: '',
      discountPrice: '',
      stockLimit: '',
      startTime: '',
      endTime: '',
      status: 'upcoming',
    });
    setFormErrors({});
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setEditingSaleId(null);
    setFormData({
      productId: '',
      discountPercent: '',
      discountPrice: '',
      stockLimit: '',
      startTime: '',
      endTime: '',
      status: 'upcoming',
    });
    setFormErrors({});
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 flex items-center space-x-2">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.649z"></path>
          </svg>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Zap className="w-8 h-8 text-orange-600" />
            Flash Sales Management
          </h2>
          <p className="text-gray-600 text-sm mt-1">Create and manage time-limited promotional sales</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-orange-700 transition duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Flash Sale
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm border border-green-200">
          <p className="text-gray-600 text-sm font-medium">Active Sales</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{sales.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm border border-blue-200">
          <p className="text-gray-600 text-sm font-medium">Upcoming Sales</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{sales.filter(s => s.status === 'upcoming').length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm border border-purple-200">
          <p className="text-gray-600 text-sm font-medium">Total Participants</p>
          <p className="text-2xl font-bold text-purple-700 mt-1">{sales.reduce((acc, s) => acc + s.participants, 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 shadow-sm border border-orange-200">
          <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-orange-700 mt-1">KSH {sales.reduce((acc, s) => acc + parseInt(s.revenue.replace(/,/g, '') || 0), 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-48 py-2 px-4 border border-gray-200 rounded-xl text-sm focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="ended">Ended</option>
          </select>
        </div>

        {/* Table */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Limit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Remaining</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center text-gray-500">No flash sales found.</td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold">{sale.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600">
                    {sale.discountPercent}% OFF
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    KSH {parseFloat(sale.discountPrice).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {sale.stockLimit} units
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className={sale.status === 'ended' ? 'text-gray-400' : 'font-semibold text-blue-600'}>
                        {getTimeRemaining(sale.endTime)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusStyles(sale.status)}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {sale.participants}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    KSH {sale.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditClick(sale)}
                      className="text-indigo-600 hover:text-indigo-900 transition inline-flex items-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(sale.id)}
                      className="text-red-600 hover:text-red-900 transition inline-flex items-center gap-1">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center p-4">
        <div className="text-sm text-gray-500">Showing {filteredSales.length} of {sales.length} results</div>
      </div>

      {/* Create Flash Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-600" />
                Create Flash Sale
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Product ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-700 focus:border-transparent outline-none transition"
                >
                  <option value="">-- Select a product --</option>
                  {
                    products?.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                </select>
                {formErrors.productId && <p className="text-red-500 text-xs mt-1">{formErrors.productId}</p>}
              </div>

              {/* Discount Percent and Price */}
              <div className="grid grid-cols-1 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Percent (%) *
                  </label>
                  <input
                    type="number"
                    name="discountPercent"
                    value={formData.discountPercent}
                    onChange={handleInputChange}
                    placeholder="0-100"
                    min="0"
                    max="100"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-700 focus:border-transparent outline-none transition ${formErrors.discountPercent ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.discountPercent && <p className="text-red-500 text-xs mt-1">{formErrors.discountPercent}</p>}
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Price (KSH) *
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-700 focus:border-transparent outline-none transition ${formErrors.discountPrice ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.discountPrice && <p className="text-red-500 text-xs mt-1">{formErrors.discountPrice}</p>}
                </div>
              </div>

              {/* Stock Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Limit *
                </label>
                <input
                  type="number"
                  name="stockLimit"
                  value={formData.stockLimit}
                  onChange={handleInputChange}
                  placeholder="Enter stock limit"
                  min="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-700 focus:border-transparent outline-none transition ${formErrors.stockLimit ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.stockLimit && <p className="text-red-500 text-xs mt-1">{formErrors.stockLimit}</p>}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-700 focus:border-transparent outline-none transition ${formErrors.startTime ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.startTime && <p className="text-red-500 text-xs mt-1">{formErrors.startTime}</p>}
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-700 focus:border-transparent outline-none transition ${formErrors.endTime ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.endTime && <p className="text-red-500 text-xs mt-1">{formErrors.endTime}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-700 focus:border-transparent outline-none transition"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Flash Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Flash Sale Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-600" />
                Edit Flash Sale
              </h3>
              <button
                onClick={closeUpdateModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Product ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <select
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700 focus:border-transparent outline-none transition"
                >
                  <option value="">-- Select a product --</option>
                  {
                    products?.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                </select>
                {formErrors.productId && <p className="text-red-500 text-xs mt-1">{formErrors.productId}</p>}
              </div>

              {/* Discount Percent and Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Percent (%) *
                  </label>
                  <input
                    type="number"
                    name="discountPercent"
                    value={formData.discountPercent}
                    onChange={handleInputChange}
                    placeholder="0-100"
                    min="0"
                    max="100"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700 focus:border-transparent outline-none transition ${formErrors.discountPercent ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.discountPercent && <p className="text-red-500 text-xs mt-1">{formErrors.discountPercent}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Price (KSH) *
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700 focus:border-transparent outline-none transition ${formErrors.discountPrice ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.discountPrice && <p className="text-red-500 text-xs mt-1">{formErrors.discountPrice}</p>}
                </div>
              </div>

              {/* Stock Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Limit *
                </label>
                <input
                  type="number"
                  name="stockLimit"
                  value={formData.stockLimit}
                  onChange={handleInputChange}
                  placeholder="Enter stock limit"
                  min="1"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700 focus:border-transparent outline-none transition ${formErrors.stockLimit ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.stockLimit && <p className="text-red-500 text-xs mt-1">{formErrors.stockLimit}</p>}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700 focus:border-transparent outline-none transition ${formErrors.startTime ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.startTime && <p className="text-red-500 text-xs mt-1">{formErrors.startTime}</p>}
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700 focus:border-transparent outline-none transition ${formErrors.endTime ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.endTime && <p className="text-red-500 text-xs mt-1">{formErrors.endTime}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700 focus:border-transparent outline-none transition"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeUpdateModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Update Flash Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* delete modal  */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl text-gray-800 font-bold mb-4">Delete Flash Sale</h2>
            <p className="mb-6 text-orange-600">Are you sure you want to delete this flash sale?</p>
            <div className="flex justify-end gap-4">
              <button className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => handleDelete(deleteSaleId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashSalesPage;