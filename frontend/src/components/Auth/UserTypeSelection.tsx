
import { Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';

const UserTypeSelection = () => {
  return (
    <AuthLayout
      title="Join AgriFund"
      subtitle="Choose your role to get started"
      showBackButton={true}
    >
      <div className="space-y-6">
        {/* Farmer Option */}
        <Link
          to="/signup/farmer"
          className="group block w-full p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-700">
                  I'm a Farmer
                </h3>
                <p className="text-gray-600 group-hover:text-green-600">
                  Looking for funding to grow my farm
                </p>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-green-600 transition-colors duration-300" />
          </div>
        </Link>

        {/* Investor Option */}
        <Link
          to="/signup/investor"
          className="group block w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700">
                  I'm an Investor
                </h3>
                <p className="text-gray-600 group-hover:text-blue-600">
                  Looking to invest in agriculture
                </p>
              </div>
            </div>
            <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
          </div>
        </Link>

        {/* Sign In Link */}
        <div className="text-center pt-4 border-t border-gray-200">
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
      </div>
    </AuthLayout>
  );
};

export default UserTypeSelection;