import React from 'react';
import { Transaction } from '../types/investor';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';

interface RecentActivityProps {
  transactions: Transaction[];
  loading: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ transactions, loading }) => {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'investment':
        return <ArrowUpRight className="h-5 w-5 text-red-600" />;
      case 'return':
        return <ArrowDownLeft className="h-5 w-5 text-green-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAmountColor = (type: Transaction['type']) => {
    switch (type) {
      case 'return':
        return 'text-green-600';
      case 'investment':
        return 'text-red-600';
      case 'withdrawal':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getAmountPrefix = (type: Transaction['type']) => {
    switch (type) {
      case 'return':
        return '+';
      case 'investment':
      case 'withdrawal':
        return '-';
      default:
        return '';
    }
  };

  // Format date without date-fns dependency
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {getTransactionIcon(transaction.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {transaction.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(transaction.status)}
                  <p className="text-xs text-gray-500">
                    {formatDate(transaction.date)}
                  </p>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    ID: {transaction.transactionId}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`text-sm font-semibold ${getAmountColor(transaction.type)}`}>
                  {getAmountPrefix(transaction.type)}₹{transaction.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {transactions.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;