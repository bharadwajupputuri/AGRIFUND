import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import axios from 'axios';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'farmer' | 'investor'>('farmer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/login',
      {
        email: formData.email,
        password: formData.password
      }
      // ❌ Remove: { withCredentials: true } - You don't use cookies!
    );

    console.log('Login successful:', response.data);
    
    // ✅ Store BOTH token AND user data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Redirect based on user type
    if (response.data.user.userType === 'farmer') {
      window.location.href = '/farmer-dashboard';
    } else {
      window.location.href = '/investor-dashboard';
    }

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Signin failed:', error);
      alert(error.response?.data?.message || 'Sign in failed. Please try again.');
    } else {
      console.error('Signin failed:', error);
      alert('Signin failed. Please try again.');
    }
  }
};

 

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your AgriFund account"
      showBackButton={true}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Type Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setUserType('farmer')}
            className={`p-4 border-2 rounded-xl transition-all duration-300 ${
              userType === 'farmer'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <Users className={`h-6 w-6 mx-auto mb-2 ${
              userType === 'farmer' ? 'text-green-600' : 'text-gray-400'
            }`} />
            <span className="text-sm font-medium">Farmer</span>
          </button>
          <button
            type="button"
            onClick={() => setUserType('investor')}
            className={`p-4 border-2 rounded-xl transition-all duration-300 ${
              userType === 'investor'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <TrendingUp className={`h-6 w-6 mx-auto mb-2 ${
              userType === 'investor' ? 'text-blue-600' : 'text-gray-400'
            }`} />
            <span className="text-sm font-medium">Investor</span>
          </button>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ${
                userType === 'farmer' ? 'focus:ring-green-500' : 'focus:ring-blue-500'
              }`}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ${
                userType === 'farmer' ? 'focus:ring-green-500' : 'focus:ring-blue-500'
              }`}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className={`h-4 w-4 border-gray-300 rounded ${
                userType === 'farmer' 
                  ? 'text-green-600 focus:ring-green-500' 
                  : 'text-blue-600 focus:ring-blue-500'
              }`}
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>
          <Link 
            to="/forgot-password" 
            className={`text-sm font-medium transition-colors duration-300 ${
              userType === 'farmer'
                ? 'text-green-600 hover:text-green-700'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-white ${
            userType === 'farmer'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Sign In as {userType === 'farmer' ? 'Farmer' : 'Investor'}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social Sign In */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="ml-2">Google</span>
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="ml-2">Facebook</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link 
              to={userType === 'farmer' ? "/signup/farmer" : "/signup/investor"} 
              className={`font-semibold transition-colors duration-300 ${
                userType === 'farmer'
                  ? 'text-green-600 hover:text-green-700'
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;