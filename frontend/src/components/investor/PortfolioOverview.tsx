import React from 'react';
import { Link } from 'react-router-dom';
import { InvestmentRecord } from '../types/investor';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Eye, User } from 'lucide-react';

interface PortfolioOverviewProps {
  portfolio: InvestmentRecord[];
  loading: boolean;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ portfolio, loading }) => {
  const getStatusIcon = (status: InvestmentRecord['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'defaulted':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'partial_return':
        return <TrendingUp className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: InvestmentRecord['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'defaulted':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'partial_return':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'high':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Format date without date-fns dependency
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Overview</h2>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Portfolio Overview</h2>
        <Link
          to="/investor/portfolio"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All →
        </Link>
      </div>

      {portfolio.length === 0 ? (
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No investments yet</p>
          <p className="text-sm text-gray-400 mt-1">Start investing to build your portfolio</p>
          <Link
            to="/investor/marketplace"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-4"
          >
            Explore Opportunities
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {portfolio.slice(0, 3).map((investment) => (
            <div key={investment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(investment.status)}
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{investment.farmerName}</span>
                    </h3>
                    <p className="text-sm text-gray-600">
                      {investment.cropType} • {investment.duration} months
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      investment.status
                    )}`}
                  >
                    {investment.status.charAt(0).toUpperCase() + investment.status.slice(1).replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Investment Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Invested</p>
                  <p className="font-semibold text-gray-900">₹{investment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expected Return</p>
                  <p className="font-semibold text-green-600">₹{investment.expectedReturn.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Risk Level</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investment.riskLevel)}`}>
                    {investment.riskLevel.charAt(0).toUpperCase() + investment.riskLevel.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Investment Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(investment.investmentDate)}
                  </p>
                </div>
              </div>

              {/* Progress Updates */}
              {investment.progressUpdates.length > 0 && (
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Latest Update: {investment.progressUpdates[investment.progressUpdates.length - 1].description}
                    </p>
                    <Link
                      to={`/investor/investments/${investment.id}`}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioOverview;