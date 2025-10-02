const SidebarLink = ({ name, icon: Icon, href, isActive }) => (
    <a 
        href={href}
        className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition duration-200 ${
            isActive 
                ? 'bg-[#864c37] text-white shadow-md' 
                : 'text-gray-300 hover:bg-[#864c37]/50 hover:text-white'
        }`}
    >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{name}</span>
    </a>
);

export default SidebarLink; 