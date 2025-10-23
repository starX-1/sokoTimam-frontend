import { X, Home, ShoppingCart, Package, Users, BarChart3, Truck, Tag, Settings, LogOut, ChartBar } from "lucide-react";
import SidebarLink from './SideBarLink'
import { signOut } from "next-auth/react";

const navItems = [
    { name: 'Dashboard', icon: Home, href: '/sellerDashboard' },
    { name: 'Shops', icon: ShoppingCart, href: '/sellerDashboard/shops' },
    { name: 'Products', icon: Package, href: '/sellerDashboard/products' },
    // { name: 'Users', icon: Users, href: '/sellerDashboard/users' },
    // { name: 'Analytics', icon: BarChart3, href: '#/analytics' },
    { name: 'Categories', icon: ChartBar, href: '/sellerDashboard/categories' },
    // { name: 'Promotions', icon: Tag, href: '#/promotions' },
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const activePath = '#/dashboard';

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-[#4a1f1a] to-[#2d1210] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 md:relative md:flex flex-col transition-transform duration-300 ease-in-out shadow-2xl`}
            >
                {/* Logo Area */}
                <div className="relative flex items-center justify-between p-6 border-b border-[#d9653a]/20">
                    <div className="flex items-center space-x-3">
                        <img src="/sokdash.png" alt="" className='object-cover rounded rounded-full' width={150} height={50} />
                    </div>
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#d9653a] scrollbar-track-transparent">
                    <div className="mb-2">
                        <p className="text-xs font-semibold text-[#d9653a]/60 uppercase tracking-wider px-4 mb-2">
                            Main Menu
                        </p>
                    </div>
                    {navItems.map((item) => (
                        <SidebarLink
                            key={item.name}
                            name={item.name}
                            icon={item.icon}
                            href={item.href}
                            isActive={item.href === activePath}
                        />
                    ))}
                </nav>

                {/* Settings and Logout */}
                <div className="p-4 border-t border-[#d9653a]/20 space-y-1 bg-black/20">
                    <div className="mb-2">
                        <p className="text-xs font-semibold text-[#d9653a]/60 uppercase tracking-wider px-4 mb-2">
                            Account
                        </p>
                    </div>
                    <SidebarLink
                        name="Settings"
                        icon={Settings}
                        href="#/settings"
                        isActive={false}
                    />

                    <button type="button"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 text-red-300 hover:bg-red-900/40 hover:text-white group"
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;