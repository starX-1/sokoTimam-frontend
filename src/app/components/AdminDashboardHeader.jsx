import { Bell, Menu, Search, ChevronDown } from "lucide-react";

const AdminHeader = ({ setIsSidebarOpen }) => (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-md sticky top-0 z-20 backdrop-blur-sm">

        {/* Mobile Menu Button (Only visible on small screens) */}
        <button
            className="md:hidden p-2 text-gray-600 hover:text-[#d9653a] hover:bg-[#d9653a]/10 rounded-lg transition-all duration-200"
            onClick={() => setIsSidebarOpen(true)}
        >
            <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar (Hidden on small screens) */}
        <div className="hidden md:block flex-1 max-w-xl ml-4">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d9653a] transition-colors" />
                <input
                    type="text"
                    placeholder="Search for users, products, or categories..."
                    className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-xl focus:outline-none text-gray-800 focus:ring-[#d9653a]/20 focus:border-[#d9653a] text-sm transition-all bg-white shadow-sm hover:shadow-md"
                />
            </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3 ml-auto">
            {/* Mobile Search Button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-[#d9653a] hover:bg-[#d9653a]/10 rounded-lg transition-all duration-200">
                <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-[#d9653a] hover:bg-[#d9653a]/10 rounded-lg transition-all duration-200 group">
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d9653a] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d9653a] border-2 border-white text-[9px] font-bold text-white items-center justify-center">3</span>
                </span>
            </button>

            {/* Divider */}
            <div className="hidden sm:block h-8 w-px bg-gray-300"></div>

            {/* User Profile */}
            <div className="flex items-center space-x-2 cursor-pointer group hover:bg-gray-100 px-3 py-2 rounded-xl transition-all duration-200">
                <div className="relative">
                    <img
                        src="https://placehold.co/40x40/4a1f1a/ffffff?text=AK"
                        alt="Admin Profile"
                        className="w-9 h-9 rounded-full border-2 border-[#d9653a] object-cover group-hover:border-[#d9653a]/80 transition-colors shadow-sm"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/4a1f1a/ffffff?text=AK"; }}
                    />
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-500"></span>
                </div>
                <div className="hidden sm:block text-sm">
                    <p className="font-semibold text-gray-800 group-hover:text-[#d9653a] transition-colors">Admin K</p>
                    <p className="text-xs text-gray-500">Super User</p>
                </div>
                <ChevronDown className="hidden sm:block w-4 h-4 text-gray-400 group-hover:text-[#d9653a] transition-colors" />
            </div>
        </div>
    </header>
);

export default AdminHeader;