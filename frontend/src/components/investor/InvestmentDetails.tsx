import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { InvestmentRecord } from '../types/investor';
import { investorAPI } from '../services/investorAPI';
import { ArrowLeft, Calendar, TrendingUp, User, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const InvestmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [investment, setInvestment] = useState<InvestmentRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestmentDetails = async () => {
      if (!id) return;
      
      try {
        // For now, we'll filter from portfolio - replace with actual API when available
        const response = await investorAPI.getPortfolio();
        if (response.success) {
          const foundInvestment = response.data.find(inv => inv.id === id);
          setInvestment(foundInvestment || null);
        }
      } catch (error) {
        console.error('Error fetching investment details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentDetails();
  }, [id]);

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

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!investment) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Investment Not Found</h3>
          <p className="text-gray-600 mb-6">The investment you're looking for doesn't exist.</p>
          <Link
            to="/investor/portfolio"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Portfolio
          </Link>
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
            <Link
              to="/investor/portfolio"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portfolio
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Investment Details</h1>
            <p className="text-gray-600 mt-1">Detailed view of your investment</p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(investment.status)}`}>
              {investment.status.charAt(0).toUpperCase() + investment.status.slice(1).replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Investment Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Investment Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Farmer</p>
                    <p className="font-semibold text-gray-900 flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{investment.farmerName}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Crop Type</p>
                    <p className="font-semibold text-gray-900">{investment.cropType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900 flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{investment.duration} months</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Investment Amount</p>
                    <p className="font-semibold text-gray-900">₹{investment.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expected Return</p>
                    <p className="font-semibold text-green-600 flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>₹{investment.expectedReturn.toLocaleString()}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Investment Date</p>
                    <p className="font-semibold text-gray-900 flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(investment.investmentDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Updates */}
            {investment.progressUpdates.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Updates</h2>
                <div className="space-y-4">
                  {investment.progressUpdates.map((update, index) => (
                    <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(update.date).toLocaleDateString()}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                          {update.stage}
                        </span>
                      </div>
                      <p className="text-gray-900">{update.description}</p>
                      {update.photos.length > 0 && (
                        <div className="mt-2 flex space-x-2">
                          {update.photos.map((photo, photoIndex) => (
                            <img
                              key={photoIndex}
                              src={photo}
                              alt={`Progress update ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Investment Status</h3>
              <div className="flex items-center space-x-3">
                {getStatusIcon(investment.status)}
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {investment.status.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {investment.status === 'active' && 'Investment is active and growing'}
                    {investment.status === 'completed' && 'Investment successfully completed'}
                    {investment.status === 'defaulted' && 'Investment has defaulted'}
                    {investment.status === 'partial_return' && 'Partial returns received'}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Profile */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Risk Profile</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <span className={`text-sm font-medium capitalize ${
                    investment.riskLevel === 'low' ? 'text-green-600' :
                    investment.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {investment.riskLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Expected ROI</span>
                  <span className="text-sm font-medium text-green-600">
                    {Math.round(((investment.expectedReturn - investment.amount) / investment.amount) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InvestmentDetails;