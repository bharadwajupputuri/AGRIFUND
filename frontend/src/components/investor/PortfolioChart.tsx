import React from 'react';
import { InvestmentRecord } from '../types/investor';
import { PieChart, TrendingUp, AlertTriangle } from 'lucide-react';

interface PortfolioChartProps {
  portfolio: InvestmentRecord[];
  loading?: boolean;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ portfolio, loading = false }) => {
  // Calculate portfolio distribution by status
  const calculateDistribution = () => {
    const distribution = {
      active: { amount: 0, count: 0, color: 'bg-blue-500', textColor: 'text-blue-600' },
      completed: { amount: 0, count: 0, color: 'bg-green-500', textColor: 'text-green-600' },
      defaulted: { amount: 0, count: 0, color: 'bg-red-500', textColor: 'text-red-600' },
      partial_return: { amount: 0, count: 0, color: 'bg-orange-500', textColor: 'text-orange-600' }
    };

    portfolio.forEach(investment => {
      distribution[investment.status as keyof typeof distribution].amount += investment.amount;
      distribution[investment.status as keyof typeof distribution].count += 1;
    });

    return distribution;
  };

  const distribution = calculateDistribution();
  const totalValue = Object.values(distribution).reduce((sum, item) => sum + item.amount, 0);
  const totalInvestments = portfolio.length;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'defaulted': return 'Defaulted';
      case 'partial_return': return 'Partial Return';
      default: return status;
    }
  };

  // Calculate angles for pie chart
  const calculateAngles = () => {
    const angles: { [key: string]: number } = {};
    

    Object.entries(distribution).forEach(([status, data]) => {
      if (data.amount > 0) {
        const percentage = (data.amount / totalValue) * 100;
        angles[status] = percentage;
      }
    });

    return angles;
  };

  const angles = calculateAngles();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex items-center justify-center mb-6">
          <div className="w-40 h-40 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (portfolio.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <PieChart className="h-5 w-5" />
          <span>Portfolio Distribution</span>
        </h3>
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No investments yet</p>
          <p className="text-sm text-gray-400 mt-1">Start investing to see portfolio distribution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <PieChart className="h-5 w-5" />
        <span>Portfolio Distribution</span>
      </h3>
      
      {/* Chart Visualization */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Pie Chart */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
          
          {/* Pie segments */}
          {Object.entries(angles).map(([status, percentage], index, array) => {
            if (percentage === 0) return null;
            
            const previousPercentages = array
              .slice(0, index)
              .reduce((sum, [,prevPercentage]) => sum + prevPercentage , 0);
            
            const startAngle = previousPercentages * 3.6;
            const endAngle = startAngle + percentage * 3.6;

            return (
              <div
                key={status}
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    from ${startAngle}deg,
                    transparent 0 ${endAngle}deg,
                    transparent ${endAngle}deg 360deg
                  )`
                }}
              >
                <div className={`absolute inset-0 rounded-full ${distribution[status as keyof typeof distribution].color} opacity-80`}></div>
              </div>
            );
          })}
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{totalInvestments}</p>
              <p className="text-xs text-gray-600">Investments</p>
            </div>
          </div>
        </div>

        {/* Legend and Details */}
        <div className="flex-1 min-w-0">
          <div className="space-y-4">
            {Object.entries(distribution).map(([status, data]) => {
              if (data.amount === 0) return null;
              
              const percentage = (data.amount / totalValue) * 100;
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${data.color}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{getStatusLabel(status)}</p>
                      <p className="text-xs text-gray-500">{data.count} investment{data.count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹{data.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Portfolio Value</span>
              <span className="text-lg font-bold text-gray-900">₹{totalValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">Active Investments</span>
              <span className="text-sm font-medium text-blue-600">{distribution.active.count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Success Rate</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {totalInvestments > 0 ? Math.round((distribution.completed.count / totalInvestments) * 100) : 0}%
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Default Rate</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {totalInvestments > 0 ? Math.round((distribution.defaulted.count / totalInvestments) * 100) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;