import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import Layout from '../../Layout/Layout';
import InvestorStatsCards from '../../../components/investor/InvestorStatsCards';
import PortfolioOverview from '../../../components/investor/PortfolioOverview';
import RecentActivity from '../../../components/investor/RecentActivity';
import InvestmentOpportunities from '../../../components/investor/InvestmentOpportunities';
import { InvestorDashboardStats, InvestmentRecord, Transaction, InvestmentOpportunity } from '../../types/investor';
import { investorAPI } from '../../services/investorAPI';
import { socketService, PortfolioUpdateData, InvestmentUpdateData, ProgressUpdateData } from '../../services/socketService';
import { TrendingUp, ArrowUpRight, Sprout, MapPin, Camera, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProgressUpdate {
  loanId: string;
  loanPurpose: string;
  cropType: string;
  farmerName: string;
  farmerLocation: string;
  currentStage: string;
  progressPercentage: number;
  latestUpdate: {
    title: string;
    description: string;
    stage: string;
    date: string;
    photoCount: number;
  };
  totalUpdates: number;
}

interface RealTimeNotification {
  id: string;
  type: 'investment' | 'progress' | 'return';
  message: string;
  timestamp: Date;
  loanId?: string;
}

const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<InvestorDashboardStats>({
    totalInvested: 0,
    totalReturns: 0,
    activeInvestments: 0,
    completedInvestments: 0,
    totalInvestments: 0,
    averageROI: 0,
    portfolioValue: 0,
    monthlyReturns: 0,
    pendingReturns: 0,
  });
  const [portfolio, setPortfolio] = useState<InvestmentRecord[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [recentProgress, setRecentProgress] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);

  // ✅ Memoize fetchProgressUpdates
  const fetchProgressUpdates = useCallback(async () => {
    try {
      const progressResponse = await fetch('http://localhost:5000/api/progress/investor/updates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (progressResponse.ok) {
        const progressResult = await progressResponse.json();
        if (progressResult.success) {
          setRecentProgress(progressResult.data.slice(0, 3));
        }
      }
    } catch (progressError) {
      console.log('Progress updates not available yet', progressError);
    }
  }, []);

  // ✅ IMPROVED: Fetch all dashboard data with better logging
  const fetchDashboardData = useCallback(async () => {
    try {
      console.log('🔄 Investor fetching ALL dashboard data...');
      setLoading(true);
      
      const [statsResponse, portfolioResponse, transactionsResponse, opportunitiesResponse] = await Promise.all([
        investorAPI.getDashboardStats(),
        investorAPI.getPortfolio(),
        investorAPI.getTransactions(),
        investorAPI.getInvestmentOpportunities()
      ]);

      console.log('📈 Stats response:', statsResponse);
      console.log('📋 Portfolio response:', portfolioResponse);
      console.log('💼 Transactions response:', transactionsResponse);
      console.log('🎯 Opportunities response:', opportunitiesResponse);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
        console.log('✅ Stats updated:', statsResponse.data);
      }
      if (portfolioResponse.success && portfolioResponse.data) {
        setPortfolio(portfolioResponse.data);
        console.log('✅ Portfolio updated with', portfolioResponse.data.length, 'items');
      }
      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(transactionsResponse.data);
        console.log('✅ Transactions updated with', transactionsResponse.data.length, 'items');
      }
      if (opportunitiesResponse.success && opportunitiesResponse.data) {
        setOpportunities(opportunitiesResponse.data);
        console.log('✅ Opportunities updated with', opportunitiesResponse.data.length, 'items');
      }

      await fetchProgressUpdates();
      console.log('✅ All dashboard data fetched successfully');

    } catch (error) {
      console.error('❌ Error fetching investor data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchProgressUpdates]);

  // ✅ IMPROVED REAL-TIME UPDATES WITH FORCE REFRESH
  useEffect(() => {
    if (user?.userType === 'investor') {
      console.log('👤 Setting up investor real-time listeners');
      
      socketService.connect();
      
      if (user.id) {
        socketService.joinInvestorRoom(user.id);
      }

      // ✅ Listen for investment updates
      const handleInvestmentUpdate = (update: InvestmentUpdateData) => {
        console.log('💰 REAL-TIME: Investment update received', update);
        
        const newNotification: RealTimeNotification = {
          id: Date.now().toString(),
          type: 'investment',
          message: update.message || `New investment activity in loan ${update.loanId}`,
          timestamp: new Date(),
          loanId: update.loanId
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
        
        // ✅ FORCE REFRESH - Clear data first to show loading
        setLoading(true);
        
        // Add a small delay to ensure backend has updated
        setTimeout(() => {
          fetchDashboardData();
        }, 500);
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, 5000);
      };

      // ✅ Listen for portfolio updates
      const handlePortfolioUpdate = (update: PortfolioUpdateData) => {
        console.log('📊 REAL-TIME: Portfolio update received', update);
        
        // Show notification
        const newNotification: RealTimeNotification = {
          id: Date.now().toString(),
          type: 'investment',
          message: update.message || 'Portfolio updated',
          timestamp: new Date()
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
        
        // ✅ FORCE REFRESH - Clear data first to show loading
        setLoading(true);
        
        // Add a small delay to ensure backend has updated
        setTimeout(() => {
          fetchDashboardData();
        }, 500);
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, 5000);
      };

      // ✅ Listen for progress updates
      const handleProgressUpdate = (update: ProgressUpdateData) => {
        console.log('🌱 REAL-TIME: Progress update received', update);
        
        const newNotification: RealTimeNotification = {
          id: Date.now().toString(),
          type: 'progress',
          message: `New progress update from ${update.farmerName || 'farmer'}`,
          timestamp: new Date(),
          loanId: update.loanId
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
        
        // Refresh progress updates
        fetchProgressUpdates();
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, 5000);
      };

      // Register all listeners
      socketService.onInvestmentUpdate(handleInvestmentUpdate);
      socketService.onPortfolioUpdate(handlePortfolioUpdate);
      socketService.onProgressUpdate(handleProgressUpdate);

      // ✅ ADD HEARTBEAT TO CHECK CONNECTION
      const heartbeat = setInterval(() => {
        if (!socketService.isConnected) {
          console.log('🔌 Socket disconnected, reconnecting...');
          socketService.connect();
          if (user.id) {
            socketService.joinInvestorRoom(user.id);
          }
        } else {
          console.log('💓 Socket heartbeat - Connection OK');
        }
      }, 10000); // Check every 10 seconds

      // Cleanup
      return () => {
        console.log('🧹 Cleaning up investor socket listeners');
        clearInterval(heartbeat);
        socketService.removeAllListeners('investmentUpdate');
        socketService.removeAllListeners('portfolioUpdate');
        socketService.removeAllListeners('progressUpdate');
        socketService.disconnect();
      };
    }
  }, [user, fetchDashboardData, fetchProgressUpdates]); // ✅ Add fetchDashboardData to dependencies

  // ✅ Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getStageInfo = (stage: string) => {
    const stages: Record<string, { label: string; color: string }> = {
      'land_preparation': { label: 'Land Prep', color: 'bg-yellow-100 text-yellow-800' },
      'sowing': { label: 'Sowing', color: 'bg-blue-100 text-blue-800' },
      'germination': { label: 'Germination', color: 'bg-green-100 text-green-800' },
      'vegetative': { label: 'Growth', color: 'bg-emerald-100 text-emerald-800' },
      'flowering': { label: 'Flowering', color: 'bg-pink-100 text-pink-800' },
      'fruiting': { label: 'Fruiting', color: 'bg-orange-100 text-orange-800' },
      'harvesting': { label: 'Harvesting', color: 'bg-red-100 text-red-800' },
      'post_harvest': { label: 'Complete', color: 'bg-purple-100 text-purple-800' }
    };
    return stages[stage] || { label: stage, color: 'bg-gray-100 text-gray-800' };
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout>
      <div className="space-y-6">
        {/* Real-time Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notification.type === 'investment' 
                    ? 'bg-blue-50 border-blue-400' 
                    : notification.type === 'progress'
                    ? 'bg-green-50 border-green-400'
                    : 'bg-orange-50 border-orange-400'
                } flex items-center justify-between animate-in slide-in-from-top duration-500`}
              >
                <div className="flex items-center space-x-3">
                  <Bell className={`h-5 w-5 ${
                    notification.type === 'investment' 
                      ? 'text-blue-600' 
                      : notification.type === 'progress'
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{notification.message}</p>
                    <p className="text-sm text-gray-600">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                  aria-label="Close notification"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {greeting}, {user?.name || 'Investor'}! 💼
              </h1>
              <p className="text-blue-100 mt-1">
                Welcome to your investment dashboard. Track your agricultural investments and discover new opportunities.
              </p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-blue-100 text-sm">Portfolio Value</div>
              <div className="text-2xl font-bold">
                ₹{stats.portfolioValue.toLocaleString()}
              </div>
              <div className="text-blue-200 text-sm">
                +{stats.averageROI}% Average ROI
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <InvestorStatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Overview */}
          <div className="lg:col-span-2">
            <PortfolioOverview portfolio={portfolio} loading={loading} />
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            {/* Monthly Performance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">This Month</h2>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Returns Received</span>
                    <span className="font-semibold text-green-600">
                      +₹{stats.monthlyReturns.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pending Returns</span>
                    <span className="font-semibold text-orange-600">
                      ₹{stats.pendingReturns.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Investments</span>
                    <span className="font-semibold text-blue-600">
                      {stats.activeInvestments}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Progress Updates */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Farming Progress</h2>
                  <Link 
                    to="/investor/progress-updates" 
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <span>View All</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="p-4">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="h-2 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : recentProgress.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sprout className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm">No progress updates yet</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Farmers will post updates here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentProgress.map((progress, index) => {
                      const stageInfo = getStageInfo(progress.latestUpdate.stage);
                      
                      return (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                                {progress.loanPurpose}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageInfo.color}`}>
                                  {stageInfo.label}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {progress.progressPercentage}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span>{progress.farmerName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{progress.farmerLocation}</span>
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {progress.latestUpdate.description}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-2">
                              {progress.latestUpdate.photoCount > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Camera className="h-3 w-3" />
                                  <span>{progress.latestUpdate.photoCount}</span>
                                </div>
                              )}
                              <span>
                                {new Date(progress.latestUpdate.date).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-blue-600 hover:text-blue-700 cursor-pointer text-xs">
                              View Details
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Investment Opportunities */}
            <InvestmentOpportunities opportunities={opportunities} loading={loading} />
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity transactions={transactions} loading={loading} />
      </div>
    </Layout>
  );
};

export default InvestorDashboard;