import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { InvestmentRecord } from '../types/investor';
import { investorAPI } from '../services/investorAPI';
import { PieChart, TrendingUp, IndianRupee, Calendar, Filter } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<InvestmentRecord[]>([]);
  const [filteredPortfolio, setFilteredPortfolio] = useState<InvestmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed' | 'defaulted'>('all');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await investorAPI.getPortfolio();
        if (response.success) {
          setPortfolio(response.data);
          setFilteredPortfolio(response.data);
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPortfolio(portfolio);
    } else {
      setFilteredPortfolio(portfolio.filter(investment => investment.status === activeFilter));
    }
  }, [activeFilter, portfolio]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'defaulted': return 'text-red-600 bg-red-50';
      case 'partial_return': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const calculateTotalInvested = () => {
    return portfolio.reduce((total, investment) => total + investment.amount, 0);
  };

  const calculateTotalReturns = () => {
    return portfolio.reduce((total, investment) => total + (investment.actualReturn || 0), 0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
          <p className="text-gray-600 mt-1">Track and manage your agricultural investments</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">₹{calculateTotalInvested().toLocaleString()}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Returns</p>
                <p className="text-2xl font-bold text-green-600">₹{calculateTotalReturns().toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Investments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolio.filter(inv => inv.status === 'active').length}
                </p>
              </div>
              <PieChart className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolio.length > 0 ? Math.round((portfolio.filter(inv => inv.status === 'completed').length / portfolio.length) * 100) : 0}%
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            {['all', 'active', 'completed', 'defaulted'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as 'all' | 'active' | 'completed' | 'defaulted')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Investments List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Investment Details</h2>
          </div>
          
          {filteredPortfolio.length === 0 ? (
            <div className="text-center py-12">
              <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No investments found</p>
              <p className="text-sm text-gray-400 mt-1">Try changing your filter criteria</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredPortfolio.map((investment) => (
                <div key={investment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{investment.farmerName}</h3>
                      <p className="text-sm text-gray-600">{investment.cropType} • {investment.duration} months</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{investment.amount.toLocaleString()}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
                        {investment.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Expected Return</p>
                      <p className="font-semibold text-green-600">₹{investment.expectedReturn.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Actual Return</p>
                      <p className="font-semibold">
                        {investment.actualReturn ? `₹${investment.actualReturn.toLocaleString()}` : 'Pending'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Risk Level</p>
                      <p className="font-semibold capitalize">{investment.riskLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Invested On</p>
                      <p className="font-semibold">
                        {new Date(investment.investmentDate).toLocaleDateString()}
                      </p>
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

export default Portfolio;