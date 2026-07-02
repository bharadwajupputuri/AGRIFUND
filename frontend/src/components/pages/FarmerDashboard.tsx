import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { socketService, InvestmentUpdateData } from '../services/socketService';
import { loanApplicationApi } from '../services/api';
import { Loan, transformApiLoan, ApiLoan } from '../types';
import { 
  IndianRupee, 
  TrendingUp, 
  CheckCircle, 
  Calendar,
  AlertCircle,
  Loader
} from 'lucide-react';

interface FarmerStats {
  totalLoans: number;
  activeLoans: number;
  amountFunded: number;
  repaymentRate: number;
}

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<FarmerStats>({
    totalLoans: 0,
    activeLoans: 0,
    amountFunded: 0,
    repaymentRate: 0
  });
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // ✅ Memoize fetchDashboardData to prevent dependency issues
  const fetchDashboardData = useCallback(async () => {
    try {
      console.log('🔄 Farmer fetching ALL dashboard data...');
      setLoading(true);
      
      const [statsResponse, loansResponse] = await Promise.all([
        loanApplicationApi.getDashboardStats(),
        loanApplicationApi.getMyApplications()
      ]);
      
      console.log('📊 Stats Response:', statsResponse);
      console.log('📋 Loans Response:', loansResponse);
      
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
        console.log('✅ Stats updated:', statsResponse.data);
      }
      
      if (loansResponse.success && loansResponse.data) {
        let loansData: ApiLoan[] = [];
        
        // Handle different response structures
        if (loansResponse.data.loans && Array.isArray(loansResponse.data.loans)) {
          loansData = loansResponse.data.loans;
        } else if (Array.isArray(loansResponse.data)) {
          loansData = loansResponse.data;
        }
        
        if (Array.isArray(loansData) && loansData.length > 0) {
          const transformedLoans: Loan[] = loansData.map((loan: ApiLoan) => transformApiLoan(loan));
          setLoans(transformedLoans);
          console.log('✅ Loans updated with', transformedLoans.length, 'items');
        } else {
          setLoans([]);
        }
      }

      console.log('✅ All farmer dashboard data fetched successfully');
    } catch (error) {
      console.error('❌ Error fetching farmer data:', error);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ IMPROVED REAL-TIME UPDATES FOR FARMER WITH FORCE REFRESH
  useEffect(() => {
    if (user?.userType === 'farmer') {
      console.log('👨‍🌾 Farmer dashboard setting up real-time listeners');
      
      socketService.connect();
      
      if (user?.id) {
        socketService.joinFarmerRoom(user.id);
        
        // ✅ Listen for investment updates with proper typing and force refresh
        const handleInvestmentUpdate = (update: InvestmentUpdateData) => {
          console.log('💰 REAL-TIME: Farmer received investment update', update);
          
          // Show notification with investment details
          setNotification(
            update.message || `🎉 New investment of ₹${update.amount.toLocaleString()} received!`
          );
          
          // ✅ FORCE REFRESH - Clear data first to show loading
          setLoading(true);
          
          // Add a small delay to ensure backend has updated
          setTimeout(() => {
            fetchDashboardData();
          }, 500);
          
          // Auto-remove notification after 5 seconds
          setTimeout(() => setNotification(null), 5000);
        };

        // Register listener
        socketService.onInvestmentUpdate(handleInvestmentUpdate);

        // ✅ ADD HEARTBEAT TO CHECK CONNECTION
        const heartbeat = setInterval(() => {
          if (!socketService.isConnected) {
            console.log('🔌 Socket disconnected, reconnecting...');
            socketService.connect();
            if (user.id) {
              socketService.joinFarmerRoom(user.id);
            }
          } else {
            console.log('💓 Socket heartbeat - Connection OK');
          }
        }, 10000); // Check every 10 seconds

        // Cleanup
        return () => {
          console.log('🧹 Cleaning up farmer socket listeners');
          clearInterval(heartbeat);
          socketService.removeAllListeners('investmentUpdate');
          socketService.disconnect();
        };
      }
    }
  }, [user, fetchDashboardData]);

  // ✅ Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'active':
      case 'disbursed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && loans.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Notification */}
        {notification && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg animate-in slide-in-from-top duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <p className="text-green-700 font-medium">{notification}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-green-400 hover:text-green-600 text-xl leading-none"
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Farmer'}! 🌾</h1>
          <p className="text-green-100 mt-1">
            Track your loans and manage your farming finances
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Loans</h3>
              <IndianRupee className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalLoans}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Active Loans</h3>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeLoans}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Amount Funded</h3>
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{stats.amountFunded.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Repayment Rate</h3>
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.repaymentRate}%</p>
          </div>
        </div>

        {/* Loans List */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Loans</h2>
            {loading && loans.length > 0 && (
              <Loader className="h-5 w-5 animate-spin text-blue-600" />
            )}
          </div>
          
          {loans.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No loans found</h3>
              <p className="text-gray-600 mb-6">You haven't applied for any loans yet.</p>
              <button 
                onClick={() => navigate('/apply-loan')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Apply for a Loan
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => (
                <div key={loan.id} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{loan.purpose}</h3>
                      <p className="text-sm text-gray-600">
                        {loan.cropType} • {loan.acreage} acres
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-semibold text-gray-900">₹{loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900">{loan.duration} months</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Interest Rate</p>
                      <p className="font-semibold text-gray-900">{loan.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Applied</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(loan.appliedAt).toLocaleDateString()}
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

export default FarmerDashboard;