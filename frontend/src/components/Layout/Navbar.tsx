// components/Layout/Navbar.tsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Settings, Home, FileText, CreditCard } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = localStorage.getItem('userData'); // ✅ CHANGED: 'user' → 'userData'
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // ✅ CHANGED: 'token' → 'authToken'
    localStorage.removeItem('userData');  // ✅ CHANGED: 'user' → 'userData'
    navigate('/signin');
  };

  const navigation = [
    { name: 'Dashboard', href: '/farmer-dashboard', icon: Home },
    { name: 'My Loans', href: '/my-loans', icon: FileText },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/farmer-dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-green-600">🌱 AgriFund</span>
            </Link>
          </div>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <User className="h-4 w-4" />
              <span>Welcome, {user?.name}</span>
            </div>
            
            {/* Mobile menu button (hidden on desktop) */}
            <div className="md:hidden flex items-center space-x-2">
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
              
              <Link
                to="/settings"
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t pt-2 pb-3">
          <div className="flex space-x-4 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md text-xs font-medium transition-colors min-w-max ${
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;