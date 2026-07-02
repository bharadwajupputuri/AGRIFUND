import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MarketplaceLoan } from '../types/investor';
import { investorAPI } from '../services/investorAPI';
import { 
  MapPin, 
  Clock, 
  TrendingUp, 
  Shield, 
  User, 
  Star,
  Calendar,
  Target,
  CheckCircle,
  IndianRupee,
  Loader,
  FileText,
  Eye
} from 'lucide-react';
import FarmerDetailsModal from '../investor/FarmerDetailsModal'; 

interface LoanCardProps {
  loan: MarketplaceLoan;
  onInvestmentSuccess?: () => void;
}

const LoanCard: React.FC<LoanCardProps> = ({ loan, onInvestmentSuccess }) => {
  // DEBUG: Check the actual loan structure
  console.log('🔍 [DEBUG] Full loan object:', loan);
  console.log('📋 [DEBUG] Available loan properties:', Object.keys(loan));
  console.log('🎯 [DEBUG] Critical IDs:', {
    loanId: loan.id,
    farmerId: loan.farmerId,
    farmerObjectId: loan.farmer?.id,
    hasId: !!loan.id,
    hasFarmerId: !!loan.farmerId,
    hasFarmerObjectId: !!loan.farmer?.id
  });

  const [investing, setInvesting] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showFarmerDetails, setShowFarmerDetails] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(loan.minimumInvestment);
  
  const fundingProgress = (loan.amountFunded / loan.amount) * 100;
  
  const calculateDaysLeft = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysLeft = calculateDaysLeft(loan.fundingDeadline);
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getVerificationBadges = (badges: string[]) => {
    const badgeConfig = {
      identity: { icon: CheckCircle, label: 'ID Verified', color: 'text-green-600' },
      land: { icon: Shield, label: 'Land Verified', color: 'text-blue-600' },
      bank: { icon: Target, label: 'Bank Verified', color: 'text-purple-600' },
      phone: { icon: CheckCircle, label: 'Phone Verified', color: 'text-green-600' },
      premium: { icon: Star, label: 'Premium Farmer', color: 'text-yellow-600' },
    };

    return badges.slice(0, 3).map((badge) => {
      const config = badgeConfig[badge as keyof typeof badgeConfig];
      if (!config) return null;
      
      const Icon = config.icon;
      return (
        <div key={badge} className="flex items-center space-x-1" title={config.label}>
          <Icon className={`h-3 w-3 ${config.color}`} />
        </div>
      );
    });
  };

  const handleShowFarmerDetails = () => {
    // Get the correct IDs - try multiple possibilities
    const actualLoanId = loan.id || loan.id;
    const actualFarmerId = loan.farmerId || loan.farmer?.id;
    
    console.log('🖱️ [DEBUG] Farmer button clicked:', {
      loanId: actualLoanId,
      farmerId: actualFarmerId,
      usingIds: {
        loanId: actualLoanId,
        farmerId: actualFarmerId
      }
    });
    
    if (!actualLoanId || !actualFarmerId) {
      console.error('❌ [DEBUG] Missing IDs:', { actualLoanId, actualFarmerId });
      alert('Cannot open farmer details: Missing loan or farmer information');
      return;
    }
    
    setShowFarmerDetails(true);
  };

  const handleQuickInvest = async () => {
    if (investmentAmount < loan.minimumInvestment) {
      alert(`Minimum investment is ₹${loan.minimumInvestment.toLocaleString()}`);
      return;
    }

    if (investmentAmount > loan.amountRemaining) {
      alert(`Maximum investment for this loan is ₹${loan.amountRemaining.toLocaleString()}`);
      return;
    }

    try {
      setInvesting(true);
      const response = await investorAPI.investInLoan(loan.id, investmentAmount);
      
      if (response.success) {
        alert(`Successfully invested ₹${investmentAmount.toLocaleString()}!`);
        setShowInvestmentModal(false);
        if (onInvestmentSuccess) {
          onInvestmentSuccess();
        }
      } else {
        alert(`Investment failed: ${response.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Investment error:', error);
      alert('Investment failed. Please check your connection and try again.');
    } finally {
      setInvesting(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setInvestmentAmount(value);
  };

  const isFullyFunded = loan.amountRemaining <= 0;
  const canInvest = !isFullyFunded && daysLeft > 0;

  // Get the actual IDs to use
  const actualLoanId = loan.id || loan.id;
  const actualFarmerId = loan.farmerId || loan.farmer?.id;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{loan.farmer.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{loan.farmer.location}</span>
                  <span>•</span>
                  <span>{loan.farmer.experience} years exp</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {getVerificationBadges(loan.farmer.verificationBadges)}
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

          {/* Loan Details */}
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">{loan.purpose}</h4>
              <p className="text-sm text-gray-600">{loan.cropType} • {loan.acreage} acres • {loan.season}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Loan Amount</p>
                <p className="font-semibold text-lg">₹{loan.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expected ROI</p>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="font-semibold text-lg text-green-600">{loan.expectedROI}%</p>
                </div>
              </div>
            </div>

            {/* Risk and Duration */}
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(loan.riskLevel)}`}>
                {loan.riskLevel.charAt(0).toUpperCase() + loan.riskLevel.slice(1)} Risk
              </span>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{loan.duration} months</span>
              </div>
            </div>
          </div>
        </div>

        {/* Funding Progress */}
        <div className="px-6 pb-4">
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Funding Progress</span>
              <span className="font-medium">
                {fundingProgress.toFixed(1)}% • ₹{loan.amountRemaining.toLocaleString()} remaining
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(fundingProgress, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Investors */}
          {loan.investors.length > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{loan.investors.length} investors</span>
              <span>Min: ₹{loan.minimumInvestment.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className={daysLeft <= 3 ? 'text-red-600 font-medium' : ''}>
                {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* View Farmer Details Button */}
              <button
                onClick={handleShowFarmerDetails}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex items-center space-x-2"
                title="View Farmer Profile & Documents"
              >
                <Eye className="h-4 w-4" />
                <span>Farmer</span>
              </button>
              
              <Link
                to={`/investor/marketplace/${loan.id}`}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Details</span>
              </Link>
              
              <button
                onClick={() => setShowInvestmentModal(true)}
                disabled={!canInvest}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  canInvest
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {investing ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <IndianRupee className="h-4 w-4" />
                )}
                <span>
                  {isFullyFunded ? 'Fully Funded' : 
                   daysLeft <= 0 ? 'Expired' : 
                   'Invest'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Invest in {loan.farmer.name}'s Loan
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount (₹)
                </label>
                <input
                  type="number"
                  min={loan.minimumInvestment}
                  max={loan.amountRemaining}
                  value={investmentAmount}
                  onChange={handleAmountChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Min: ₹${loan.minimumInvestment.toLocaleString()}`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: ₹{loan.amountRemaining.toLocaleString()}
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  Expected Return: ₹{(investmentAmount * (loan.expectedROI / 100)).toLocaleString()} 
                  ({loan.expectedROI}% ROI)
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowInvestmentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={investing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleQuickInvest}
                  disabled={investing || investmentAmount < loan.minimumInvestment || investmentAmount > loan.amountRemaining}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {investing && <Loader className="h-4 w-4 animate-spin" />}
                  <span>{investing ? 'Processing...' : 'Confirm Invest'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Farmer Details Modal */}
      {showFarmerDetails && actualLoanId && actualFarmerId && (
        <FarmerDetailsModal
          farmerId={actualFarmerId}
          loanId={actualLoanId}
          isOpen={showFarmerDetails}
          onClose={() => {
            console.log('🔒 [DEBUG] Closing farmer details modal');
            setShowFarmerDetails(false);
          }}
        />
      )}
    </>
  );
};

export default LoanCard;