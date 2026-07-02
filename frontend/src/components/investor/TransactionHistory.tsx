import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { Transaction } from '../types/investor';
import { investorAPI } from '../services/investorAPI';
import { Download, Filter, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'investment' | 'return' | 'withdrawal'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await investorAPI.getTransactions();
        if (response.success) {
          setTransactions(response.data);
          setFilteredTransactions(response.data);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const filtered: Transaction[] = transactions.filter(transaction => {
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.farmerName && transaction.farmerName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });

    // Sort by date, newest first
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, typeFilter, statusFilter]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'investment': return <ArrowDownLeft className="h-5 w-5 text-red-600" />;
      case 'return': return <ArrowUpRight className="h-5 w-5 text-green-600" />;
      case 'withdrawal': return <ArrowUpRight className="h-5 w-5 text-blue-600" />;
      default: return <ArrowUpRight className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'return': return 'text-green-600';
      case 'investment': return 'text-red-600';
      case 'withdrawal': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getAmountPrefix = (type: string) => {
    switch (type) {
      case 'return': return '+';
      case 'investment':
      case 'withdrawal': return '-';
      default: return '';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded mb-3"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-600 mt-1">Complete history of all your financial transactions</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | 'investment' | 'return' | 'withdrawal')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="investment">Investments</option>
                <option value="return">Returns</option>
                <option value="withdrawal">Withdrawals</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'completed' | 'pending' | 'failed' )}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredTransactions.length} Transactions Found
            </h2>
          </div>
          
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="capitalize">{transaction.type}</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        {transaction.farmerName && (
                          <p className="text-sm text-gray-600 mt-1">Farmer: {transaction.farmerName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${getAmountColor(transaction.type)}`}>
                        {getAmountPrefix(transaction.type)}₹{transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">ID: {transaction.transactionId}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TransactionHistory;