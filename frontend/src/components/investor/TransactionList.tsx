import React from 'react';
import { Transaction } from '../types/investor';
import { ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, XCircle } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
  showCount?: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  loading = false, 
  showCount 
}) => {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'investment':
        return <ArrowDownLeft className="h-5 w-5 text-red-600" />;
      case 'return':
        return <ArrowUpRight className="h-5 w-5 text-green-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-5 w-5 text-blue-600" />;
      default:
        return <ArrowUpRight className="h-5 w-5 text-gray-600" />;
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

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(showCount || 5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
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
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No transactions found</p>
        <p className="text-sm text-gray-400 mt-1">Your transactions will appear here</p>
      </div>
    );
  }

  const displayedTransactions = showCount ? transactions.slice(0, showCount) : transactions;

  return (
    <div className="space-y-4">
      {displayedTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {getTransactionIcon(transaction.type)}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {transaction.description}
            </p>
            <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                {getStatusIcon(transaction.status)}
                <span className="capitalize">{transaction.status}</span>
              </div>
              <span>•</span>
              <span>{new Date(transaction.date).toLocaleDateString()}</span>
              {transaction.farmerName && (
                <>
                  <span>•</span>
                  <span>Farmer: {transaction.farmerName}</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </span>
              <span className="text-xs text-gray-500">ID: {transaction.transactionId}</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className={`text-lg font-semibold ${getAmountColor(transaction.type)}`}>
              {getAmountPrefix(transaction.type)}₹{transaction.amount.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
