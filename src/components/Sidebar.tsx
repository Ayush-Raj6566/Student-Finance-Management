import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Home, 
  CreditCard, 
  Calendar,
  PieChart, 
  Settings, 
  HelpCircle,
  X,
  User,
  TrendingUp,
  Calculator
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Bot, label: 'Student Bot', path: '/chat', color: 'text-green-400' },
    { icon: Calendar, label: 'Monthly Report', path: '/monthly-summary', color: 'text-blue-400'}
    // { icon: Home, label: 'Dashboard', path: '/dashboard', color: 'text-blue-400' },
    // { icon: CreditCard, label: 'Transactions', path: '/transactions', color: 'text-purple-400' },
    // { icon: PieChart, label: 'Reports', path: '/reports', color: 'text-orange-400' },
    // { icon: TrendingUp, label: 'Analytics', path: '/analytics', color: 'text-cyan-400' },
    // { icon: Calculator, label: 'Budget Planner', path: '/budget', color: 'text-yellow-400' },
    // { icon: User, label: 'Profile', path: '/profile', color: 'text-pink-400' },
    // { icon: Settings, label: 'Settings', path: '/settings', color: 'text-gray-400' },
    // { icon: HelpCircle, label: 'Help & Support', path: '/help', color: 'text-indigo-400' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-slate-800/95 backdrop-blur-sm border-r border-slate-700 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
              >
                <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                <span className="text-slate-300 group-hover:text-white transition-colors">
                  {item.label}
                </span>
                {index === 0 && (
                  <span className="ml-auto bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                    AI
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <p className="text-slate-400 text-sm mb-2">Need help?</p>
              <p className="text-slate-300 text-xs">
                Contact our support team for assistance with your finance management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
