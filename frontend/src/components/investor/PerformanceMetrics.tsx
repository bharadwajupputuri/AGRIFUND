import React from 'react';
import { InvestmentRecord } from '../types/investor';
import { TrendingUp, Target, Calendar, Award, Zap, BarChart3, IndianRupee, Users } from 'lucide-react';

interface PerformanceMetricsProps {
  portfolio: InvestmentRecord[];
  loading?: boolean;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ portfolio, loading = false }) => {
  // Calculate performance metrics
  const calculateMetrics = () => {
    const totalInvested = portfolio.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturns = portfolio.reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);
    const activeInvestments = portfolio.filter(inv => inv.status === 'active').length;
    const completedInvestments = portfolio.filter(inv => inv.status === 'completed').length;
    const defaultedInvestments = portfolio.filter(inv => inv.status === 'defaulted').length;
    const successRate = portfolio.length > 0 ? (completedInvestments / portfolio.length) * 100 : 0;
    
    // Calculate average ROI for completed investments
    const completedROIs = portfolio
      .filter(inv => inv.status === 'completed' && inv.actualReturn)
      .map(inv => ((inv.actualReturn! - inv.amount) / inv.amount) * 100);
    
    const averageROI = completedROIs.length > 0 
      ? completedROIs.reduce((sum, roi) => sum + roi, 0) / completedROIs.length 
      : 0;

    // Calculate total expected returns for active investments
    const totalExpectedReturns = portfolio
      .filter(inv => inv.status === 'active')
      .reduce((sum, inv) => sum + inv.expectedReturn, 0);

    return {
      totalInvested,
      totalReturns,
      activeInvestments,
      completedInvestments,
      defaultedInvestments,
      successRate,
      averageROI,
      totalExpectedReturns,
      totalInvestments: portfolio.length
    };
  };

  const metrics = calculateMetrics();

  const performanceCards = [
    {
      title: 'Total Invested',
      value: metrics.totalInvested,
      icon: IndianRupee,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      format: (val: number) => `₹${val.toLocaleString()}`,
      description: 'Total amount invested'
    },
    {
      title: 'Total Returns',
      value: metrics.totalReturns,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      format: (val: number) => `₹${val.toLocaleString()}`,
      description: 'Returns received'
    },
    {
      title: 'Average ROI',
      value: metrics.averageROI,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      format: (val: number) => `${val.toFixed(1)}%`,
      description: 'Average return on investment'
    },
    {
      title: 'Success Rate',
      value: metrics.successRate,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      format: (val: number) => `${val.toFixed(1)}%`,
      description: 'Successful investments'
    },
    {
      title: 'Active',
      value: metrics.activeInvestments,
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      format: (val: number) => val.toString(),
      description: 'Active investments'
    },
    {
      title: 'Completed',
      value: metrics.completedInvestments,
      icon: Calendar,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      format: (val: number) => val.toString(),
      description: 'Completed investments'
    },
    {
      title: 'Total',
      value: metrics.totalInvestments,
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      format: (val: number) => val.toString(),
      description: 'Total investments'
    },
    {
      title: 'Defaulted',
      value: metrics.defaultedInvestments,
      icon: Users,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      format: (val: number) => val.toString(),
      description: 'Defaulted investments'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (portfolio.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No performance data available</p>
        <p className="text-sm text-gray-400 mt-1">Start investing to see your performance metrics</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {performanceCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-xl font-bold text-gray-900">
                  {card.format(card.value)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
            
            {/* Progress bar for success rate */}
            {card.title === 'Success Rate' && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-green-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${card.value}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PerformanceMetrics;