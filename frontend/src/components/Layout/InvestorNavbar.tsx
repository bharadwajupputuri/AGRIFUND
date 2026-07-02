// components/Layout/InvestorNavbar.tsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Settings, Home, PieChart, CreditCard, History, Menu, TrendingUp } from 'lucide-react';

const InvestorNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const navigation = [
    { name: 'Dashboard', href: '/investor-dashboard', icon: Home },
    { name: 'Marketplace', href: '/investor/marketplace', icon: CreditCard },
    { name: 'Portfolio', href: '/investor/portfolio', icon: PieChart },
    { name: 'Progress', href: '/investor/progress-updates', icon: TrendingUp }, // ADDED
    { name: 'Transactions', href: '/investor/transactions', icon: History },
  ];

  const dropdownNavigation = [
    { name: 'Profile', href: '/investor/profile', icon: User },
    { name: 'Settings', href: '/investor/settings', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/investor-dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 whitespace-nowrap">💼 AgriFund Investor</span>
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden xl:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - User info and dropdown */}
          <div className="flex items-center space-x-6">
            {/* Desktop - User info and dropdown */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span className="whitespace-nowrap">Welcome, {user?.name}</span>
              </div>
              
              {/* Dropdown for Profile & Settings */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {dropdownNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <div className="xl:hidden flex items-center">
              <Link
                to="/investor/profile"
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="xl:hidden border-t pt-3 pb-3">
          <div className="flex justify-between space-x-2 px-2 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors min-w-[80px] flex-shrink-0 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-center leading-tight">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default InvestorNavbar;