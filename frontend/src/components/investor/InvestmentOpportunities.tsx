import React from 'react';
import { Link } from 'react-router-dom';
import { InvestmentOpportunity } from '../types/investor';
import { Star, TrendingUp, MapPin, Clock, Target } from 'lucide-react';

interface InvestmentOpportunitiesProps {
  opportunities: InvestmentOpportunity[];
  loading: boolean;
}

const InvestmentOpportunities: React.FC<InvestmentOpportunitiesProps> = ({ opportunities, loading }) => {
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h2>
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-2 bg-gray-200 rounded mb-2"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
        <Link
          to="/investor/marketplace"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View All →
        </Link>
      </div>

      {opportunities.length === 0 ? (
        <div className="text-center py-6">
          <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No recommendations available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.slice(0, 2).map((opportunity) => (
            <div key={opportunity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900">{opportunity.farmer.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">{opportunity.recommendationScore}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{opportunity.farmer.location}</span>
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(opportunity.riskLevel)}`}>
                  {opportunity.riskLevel.charAt(0).toUpperCase() + opportunity.riskLevel.slice(1)} Risk
                </span>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900 mb-1">{opportunity.purpose}</p>
                <p className="text-xs text-gray-600">{opportunity.cropType} • {opportunity.acreage} acres</p>
              </div>

              {/* Funding Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Funding Progress</span>
                  <span>
                    ₹{opportunity.amountFunded.toLocaleString()} / ₹{opportunity.amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(opportunity.amountFunded / opportunity.amount) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">{opportunity.expectedROI}% ROI</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{opportunity.duration}m</span>
                  </div>
                </div>
                <Link
                  to={`/investor/marketplace/${opportunity.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Invest →
                </Link>
              </div>

              {/* Match Reasons */}
              {opportunity.matchReasons.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-1">Why this matches you:</p>
                  <p className="text-xs text-blue-600">
                    {opportunity.matchReasons[0]}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestmentOpportunities;