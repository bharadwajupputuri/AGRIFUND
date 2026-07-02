import React, { useState } from 'react';
import { Eye, EyeOff, MapPin, Phone, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import axios from 'axios'; 

const FarmerSignup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    farmName: '',
    farmLocation: '',
    farmSize: '',
    cropTypes: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // ✅ Only one handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Check if terms are agreed
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    try {
      // Prepare data for backend (match your backend expectations)
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        userType: 'farmer',
        phone: formData.phone,
        farmName: formData.farmName,
        farmLocation: formData.farmLocation,
        farmSize: formData.farmSize,
        cropTypes: formData.cropTypes
      };

      // Send data to backend API
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        userData
      );

      console.log('Registration successful:', response.data);
      
      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userType', response.data.user.userType);
      
      alert('Account created successfully!');
      
      // Redirect to farmer dashboard
      navigate('/farmer-dashboard');

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Registration failed:', error);
        alert(error.response?.data?.message || 'Registration failed. Please try again.');
      } else {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    }
  };

  // ✅ Input change handler
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  }

  return (
    <AuthLayout
      title="Farmer Registration"
      subtitle="Join thousands of farmers getting funded"
      showBackButton={true}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="John"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="Doe"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
        </div>

        {/* Farm Information */}
        <div>
          <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 mb-2">
            Farm Name
          </label>
          <input
            type="text"
            id="farmName"
            name="farmName"
            value={formData.farmName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            placeholder="Green Valley Farm"
            required
          />
        </div>

        <div>
          <label htmlFor="farmLocation" className="block text-sm font-medium text-gray-700 mb-2">
            Farm Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="farmLocation"
              name="farmLocation"
              value={formData.farmLocation}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="City, State"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700 mb-2">
            Farm Size (acres)
          </label>
          <select
            id="farmSize"
            name="farmSize"
            value={formData.farmSize}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            required
          >
            <option value="">Select farm size</option>
            <option value="1-10">1-10 acres</option>
            <option value="11-50">11-50 acres</option>
            <option value="51-100">51-100 acres</option>
            <option value="101-500">101-500 acres</option>
            <option value="500+">500+ acres</option>
          </select>
        </div>

        <div>
          <label htmlFor="cropTypes" className="block text-sm font-medium text-gray-700 mb-2">
            Primary Crop Types
          </label>
          <textarea
            id="cropTypes"
            name="cropTypes"
            value={formData.cropTypes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            placeholder="e.g., Corn, Soybeans, Wheat"
            required
          />
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
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="Create a strong password"
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-600">
            I agree to the{' '}
            <Link to="/terms" className="text-green-600 hover:text-green-700 font-medium">
              Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-green-600 hover:text-green-700 font-medium">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 transform hover:scale-105"
        >
          Create Farmer Account
        </button>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/signin" 
              className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default FarmerSignup;
