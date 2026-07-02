import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../Layout/Layout';
import { MarketplaceLoan } from '../../types/investor';
import { investorAPI } from '../../services/investorAPI';
import FarmerDetailsModal from '../../investor/FarmerDetailsModal';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  TrendingUp, 
  User, 
  Calendar,
  IndianRupee,
  FileText,

  CheckCircle,
    BarChart3,
  Users,
  AlertTriangle
} from 'lucide-react';

const LoanDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loan, setLoan] = useState<MarketplaceLoan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await investorAPI.getMarketplaceLoans();
        if (response.success && response.data) {
          const foundLoan = response.data.find((l: MarketplaceLoan) => l.id === id);
          setLoan(foundLoan || null);
        }
      } catch (error) {
        console.error('Error fetching loan details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!loan) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto text-center py-12">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loan Not Found</h2>
          <p className="text-gray-600 mb-6">The loan you're looking for doesn't exist or may have been funded.</p>
          <Link 
            to="/investor/marketplace" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
        </div>
      </Layout>
    );
  }

  const fundingProgress = (loan.amountFunded / loan.amount) * 100;
  const daysLeft = Math.ceil((new Date(loan.fundingDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isFullyFunded = loan.amountRemaining <= 0;
  const canInvest = !isFullyFunded && daysLeft > 0;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'investors', name: 'Investors', icon: Users },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/investor/marketplace" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-md hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Marketplace</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(loan.riskLevel)}`}>
              {loan.riskLevel.charAt(0).toUpperCase() + loan.riskLevel.slice(1)} Risk
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isFullyFunded 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {isFullyFunded ? 'Fully Funded' : 'Funding'}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Loan Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Overview Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{loan.purpose}</h1>
                  <p className="text-gray-600 text-lg">{loan.cropType} • {loan.acreage} acres • {loan.season} season</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <IndianRupee className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">₹{loan.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Loan Amount</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-green-600">{loan.expectedROI}%</div>
                  <div className="text-sm text-gray-600">Expected ROI</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{loan.duration}</div>
                  <div className="text-sm text-gray-600">Months</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{daysLeft}</div>
                  <div className="text-sm text-gray-600">Days Left</div>
                </div>
              </div>

              {/* Funding Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Funding Progress</span>
                  <span className="font-medium">
                    {fundingProgress.toFixed(1)}% • ₹{loan.amountFunded.toLocaleString()} funded
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>₹{loan.amountRemaining.toLocaleString()} remaining</span>
                  <span>Min: ₹{loan.minimumInvestment.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Purpose</h3>
                        <p className="text-gray-700 leading-relaxed">{loan.purpose}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
                        <ul className="space-y-2">
                          {loan.riskFactors.map((factor, index) => (
                            <li key={index} className="flex items-center space-x-2 text-gray-700">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Farm Details */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Details</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Expected Yield</p>
                          <p className="font-semibold">{loan.expectedYield} kg/acre</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Market Price</p>
                          <p className="font-semibold">₹{loan.expectedMarketPrice}/kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Interest Rate</p>
                          <p className="font-semibold">{loan.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Season</p>
                          <p className="font-semibold">{loan.season}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Supporting Documents</h3>
                    <div className="grid gap-4">
                      {loan.documents && loan.documents.length > 0 ? (
                        loan.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-8 w-8 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">{doc.name}</p>
                                <p className="text-sm text-gray-600">{doc.type}</p>
                              </div>
                            </div>
                            <button className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                              <FileText className="h-4 w-4" />
                              <span>View</span>
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">No documents available.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Investors Tab */}
                {activeTab === 'investors' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current Investors</h3>
                    <div className="space-y-3">
                      {loan.investors && loan.investors.length > 0 ? (
                        loan.investors.map((investor, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <User className="h-8 w-8 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">{investor.investorName}</p>
                                <p className="text-sm text-gray-600">
                                  Invested on {new Date(investor.investmentDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">₹{investor.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{((investor.amount / loan.amount) * 100).toFixed(1)}% of loan</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">No investors yet. Be the first to invest!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Farmer & Action */}
          <div className="space-y-6">
            {/* Farmer Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{loan.farmer.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{loan.farmer.location}</span>
                  </div>
                </div>
              </div>

              {/* Farmer Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Credit Score</p>
                  <p className="font-semibold text-sm">{loan.farmer.creditScore}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Success Rate</p>
                  <p className="font-semibold text-sm text-green-600">{loan.farmer.repaymentRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Loans</p>
                  <p className="font-semibold text-sm">{loan.farmer.successfulLoans}</p>
                </div>
              </div>

              <button
                onClick={() => setShowFarmerModal(true)}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                View Full Farmer Profile
              </button>
            </div>

            {/* Investment Action Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Investment Opportunity</h3>
              
              {canInvest ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-700 text-center">
                      ₹{loan.amountRemaining.toLocaleString()} available for investment
                    </p>
                  </div>
                  <Link
                    to="/investor/marketplace"
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center block font-medium"
                  >
                    Invest in this Loan
                  </Link>
                  <p className="text-xs text-gray-500 text-center">
                    Minimum investment: ₹{loan.minimumInvestment.toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">This loan is fully funded</p>
                  <p className="text-sm text-gray-500">Check other opportunities in the marketplace</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Farmer Details Modal */}
      {showFarmerModal && (
        <FarmerDetailsModal
          farmerId={loan.farmerId}
          onClose={() => setShowFarmerModal(false)}
        />
      )}
    </Layout>
  );
};

export default LoanDetailsPage;