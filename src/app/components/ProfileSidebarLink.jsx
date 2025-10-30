import { ChevronRight } from "lucide-react";

const ProfileSidebarLink = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        className={`flex items-center justify-between py-3 px-4 rounded-lg transition duration-150 cursor-pointer w-full text-left ${isActive
                ? 'bg-orange-100 text-orange-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
        onClick={onClick}
    >
        <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{label}</span>
        </div>
        {isActive && <ChevronRight className="w-4 h-4" />}
    </button>
);

export default ProfileSidebarLink;