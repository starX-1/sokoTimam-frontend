'use client'
import { useEffect, useState } from 'react';
import { Search, Clock, Zap, Edit2, Trash2, Plus } from 'lucide-react';

const FlashSalesPage = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock flash sales data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSales([
        {
          id: 1,
          name: 'Weekend Mega Sale',
          discountPercent: 30,
          productCount: 12,
          startTime: '2025-11-01T08:00:00',
          endTime: '2025-11-01T20:00:00',
          status: 'active',
          revenue: '45,500',
          participants: 234,
        },
        {
          id: 2,
          name: 'Electronics Blowout',
          discountPercent: 50,
          productCount: 8,
          startTime: '2025-11-02T10:00:00',
          endTime: '2025-11-02T18:00:00',
          status: 'upcoming',
          revenue: '0',
          participants: 0,
        },
        {
          id: 3,
          name: 'Clothing Express Deal',
          discountPercent: 25,
          productCount: 20,
          startTime: '2025-10-31T18:00:00',
          endTime: '2025-10-31T23:59:00',
          status: 'ended',
          revenue: '78,900',
          participants: 456,
        },
        {
          id: 4,
          name: 'Beauty & Personal Care',
          discountPercent: 35,
          productCount: 15,
          startTime: '2025-11-03T09:00:00',
          endTime: '2025-11-03T21:00:00',
          status: 'upcoming',
          revenue: '0',
          participants: 0,
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

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
    const end = new Date(endTime);
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const filteredSales = sales.filter((sale) => {
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus;
    const matchesSearch = sale.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
        <button className="mt-4 sm:mt-0 bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-orange-700 transition duration-200 flex items-center gap-2">
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
          <p className="text-2xl font-bold text-orange-700 mt-1">KSH {sales.reduce((acc, s) => acc + parseInt(s.revenue.replace(',', '') || 0), 0).toLocaleString()}</p>
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
              placeholder="Search by sale name..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Remaining</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">No flash sales found.</td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {sale.productCount} products
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
                    <button className="text-indigo-600 hover:text-indigo-900 transition inline-flex items-center gap-1">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900 transition inline-flex items-center gap-1">
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
    </div>
  );
};

export default FlashSalesPage;