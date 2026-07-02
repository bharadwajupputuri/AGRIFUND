import React from 'react';
import { InvestmentRecord } from '../types/investor';
import { Calendar, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface InvestmentDetailsCardProps {
  investment: InvestmentRecord;
}

const InvestmentDetailsCard: React.FC<InvestmentDetailsCardProps> = ({ investment }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'defaulted': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'partial_return': return <TrendingUp className="h-5 w-5 text-orange-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-50 text-green-800 border-green-200';
      case 'defaulted': return 'bg-red-50 text-red-800 border-red-200';
      case 'partial_return': return 'bg-orange-50 text-orange-800 border-orange-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(investment.status)}
            <div>
              <h3 className="font-semibold text-gray-900">{investment.farmerName}</h3>
              <p className="text-sm text-gray-600">{investment.cropType} • {investment.duration} months</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(investment.status)}`}>
            {investment.status.charAt(0).toUpperCase() + investment.status.slice(1).replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Investment Details */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Invested Amount</p>
            <p className="font-semibold text-gray-900">₹{investment.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Expected Return</p>
            <p className="font-semibold text-green-600 flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span>₹{investment.expectedReturn.toLocaleString()}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Risk Level</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investment.riskLevel)}`}>
              {investment.riskLevel.charAt(0).toUpperCase() + investment.riskLevel.slice(1)}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Investment Date</p>
            <p className="font-semibold text-gray-900 flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{new Date(investment.investmentDate).toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        {/* Progress Updates */}
        {investment.progressUpdates.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recent Updates</h4>
            <div className="space-y-3">
              {investment.progressUpdates.slice(-2).map((update) => (
                <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {new Date(update.date).toLocaleDateString()}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                      {update.stage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">{update.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentDetailsCard;