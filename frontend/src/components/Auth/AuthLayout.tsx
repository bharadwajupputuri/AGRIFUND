import React from 'react';
import { Sprout, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {showBackButton && (
            <Link 
              to="/" 
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-4 transition-colors duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          )}
          
          <div className="flex items-center justify-center mb-6">
            <Sprout className="h-10 w-10 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">AgriFund</h1>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 AgriFund. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;