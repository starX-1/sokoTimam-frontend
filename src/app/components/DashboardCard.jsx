const DashboardCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform duration-300 hover:scale-[1.02] border-t-4" style={{ borderColor: color }}>
        <div>
            <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: color, color: color }}>
            <Icon className="w-8 h-8" />
        </div>
    </div>
);

export default DashboardCard