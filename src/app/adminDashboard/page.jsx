import DashboardCard from '../components/DashboardCard.jsx'
import { CreditCard, ShoppingCart, Users, MessageSquare } from 'lucide-react';
const mockCards = [
    { title: 'Total Revenue', value: 'KSH 345k', icon: CreditCard, color: '#10B981' }, // Emerald Green
    { title: 'New Orders', value: '12', icon: ShoppingCart, color: '#F97316' }, // Orange
    { title: 'New Users', value: '45', icon: Users, color: '#3B82F6' }, // Blue
    { title: 'Pending Support', value: '3', icon: MessageSquare, color: '#EF4444' }, // Red
];

// Placeholder for the main content if no children are passed
const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockCards.map((card, index) => (
                    <DashboardCard key={index} {...card} />
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed rounded-lg">
                    [Placeholder for Charts or Recent Logs]
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h3>
                <div className="h-40 flex items-center justify-center text-gray-500 border border-dashed rounded-lg">
                    [Placeholder for Table View]
                </div>
            </div>
        </div>
    )
};
export default Dashboard;