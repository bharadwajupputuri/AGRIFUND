// frontend/src/components/Dashboard/LoanStatusCards.tsx  
import React from 'react';
import { Loan } from '../types';
import { Clock, CheckCircle, XCircle, IndianRupee, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface LoanStatusCardsProps {
  loans: Loan[];
  loading: boolean;
}

const LoanStatusCards: React.FC<LoanStatusCardsProps> = ({ loans, loading }) => {
  const getStatusIcon = (status: Loan['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'approved':
      case 'disbursed':
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'disbursed':
      case 'active':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'completed':
        return 'bg-gray-50 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getProgressPercentage = (loan: Loan) => {
    switch (loan.status) {
      case 'pending':
        return 25;
      case 'approved':
        return 50;
      case 'disbursed':
        return 75;
      case 'active':
        return 90;
      case 'completed':
        return 100;
      case 'rejected':
        return 0;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Loan Applications</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded mb-3"></div>
              <div className="flex justify-between text-sm">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Loan Applications</h2>
      {loans.length === 0 ? (
        <div className="text-center py-8">
          <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No loan applications yet</p>
          <p className="text-sm text-gray-400 mt-1">Apply for your first loan to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.slice(0, 3).map((loan) => (
            <div key={loan.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(loan.status)}
                  <div>
                    <h3 className="font-medium text-gray-900">{loan.purpose}</h3>
                    <p className="text-sm text-gray-600">{loan.cropType} • {loan.acreage} acres</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    loan.status
                  )}`}
                >
                  {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{getProgressPercentage(loan)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(loan)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-gray-600">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    ₹{loan.amount.toLocaleString()}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {loan.duration} months
                  </span>
                </div>
                <span className="text-gray-500">
                  Applied {format(new Date(loan.appliedAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoanStatusCards;