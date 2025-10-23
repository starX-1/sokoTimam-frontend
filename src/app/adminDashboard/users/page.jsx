'use client'
import { Mail, Calendar, Search } from "lucide-react";
import { useEffect, useState } from "react";

import User from '../../api/user/api'
import { getSession } from "next-auth/react";
import sellers from "../../api/seller/api";
import { toast } from "react-toastify";

const fetchUsers = async (userSession) => {
    const response = await User.getAll(userSession)
    return response
}

const getStatusStyles = (status) => {
    switch (status) {
        case 'Active':
        case 'Verified':
            return 'text-green-700 bg-green-100';
        case 'Out of Stock':
        case 'Suspended':
            return 'text-red-700 bg-red-100';
        case 'Pending':
        case 'Pending Review':
            return 'text-yellow-700 bg-yellow-100';
        default:
            return 'text-gray-700 bg-gray-100';
    }
};


const getRoleStyles = (role) => {
    switch (role) {
        case 'Admin':
            return 'text-purple-700 bg-purple-100';
        case 'Shop Owner':
            return 'text-blue-700 bg-blue-100';
        case 'Customer':
            return 'text-indigo-700 bg-indigo-100';
        default:
            return 'text-gray-700 bg-gray-100';
    }
}

const UsersView = ({ onViewChange }) => {
    // Mock data for users

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [users, setUsers] = useState([]);
    const [adminDetails, setAdminDetails] = useState(null);
    const fetchAllUsers = async () => {
        try {
            const adminSession = await getSession();
            setAdminDetails(adminSession.user);
            const response = await fetchUsers(adminSession)
            console.log(response)
            setUsers(response.users)
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    }
    useEffect(() => {
        fetchAllUsers()
    }, [])

    // function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
        // const matchesStatus = statusFilter === 'All Statuses' || user.status === statusFilter;
        return matchesSearch && matchesRole ;
    });

    const handleActivateSeller = async (user) => {
        try {

            const res = await sellers.adminMakeSellerVerified(user.id, adminDetails.accessToken);
            fetchAllUsers();
            toast.success('Seller activated successfully');
        } catch (error) {
            toast.error('Failed to activate seller');
        }
    }

    return (
        <div className="space-y-6">
            {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
                <button
                    onClick={() => console.log('Add user modal triggered')} // Placeholder for Add User
                    className="mt-4 sm:mt-0 bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-orange-700 transition duration-200"
                >
                    + Add New User
                </button>
            </div> */}

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                {/* Search and Filter Bar */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            placeholder="Search by name or email..."
                            className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none text-orange-700 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                    <div className="flex space-x-3 w-full md:w-auto">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="flex-1 py-2 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none text-orange-700 focus:ring-orange-500 focus:border-orange-500">
                            <option>All Roles</option>
                            <option value={'admin'}>Admin</option>
                            <option value={'seller'}>Shop Owner</option>
                            <option value={'customer'}>Customer</option>
                        </select>
                        {/* <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="flex-1 py-2 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none text-orange-700 focus:ring-orange-500 focus:border-orange-500">
                            <option>All Statuses</option>
                            <option>Verified</option>
                            <option>unverified</option>
                            <option>Suspended</option>
                        </select> */}
                    </div>
                </div>

                {/* Users Table */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            className="h-10 w-10 rounded-full"
                                            src={user.image_url}
                                            alt={`${user.firstname} avatar`}
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/94A3B8/ffffff?text=User"; }}
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{user.firstname}</p>
                                            <p className="text-gray-500 text-xs flex items-center">
                                                <Mail className="w-3 h-3 mr-1" />{user.email.length > 10 ? user.email.slice(0, 10) + '...' : user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleStyles(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(user.status)}`}>
                                        {user.isVerified ? 'Verified' : 'Not Verified'}
                                    </span>
                                </td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                        {formatDate(user.updatedAt)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {/* <a href="#" className="text-indigo  -600 hover:text-indigo-900 mr-3">Edit</a> */}
                                    {user.role === 'seller' ? (
                                        <a href="#" className="text-red-600 hover:text-red-900">Suspend</a>
                                    ) : (
                                        <button onClick={() => handleActivateSeller(user)} className="text-green-600 hover:text-green-900">Make Seller</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center p-4">
                <div className="text-sm text-gray-500">Showing 1 to {filteredUsers.length} of {filteredUsers.length} results</div>
            </div>
        </div>
    );
};


export default UsersView;