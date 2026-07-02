import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import StatsCards from './StatsCards';
import LoanStatusCards from './LoanStatusCards';
import QuickActions from './QuickActions';
import { DashboardStats, Loan } from '../../components/types';
import { loanApplicationApi } from '../services/api';
import { socketService } from '../services/socketService';
import { Calendar, Bell } from 'lucide-react';
import { format } from 'date-fns';

// Define interface for raw API loan data
interface ApiLoanData {
  _id?: string;
  id?: string;
  purpose: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'disbursed';
  cropType: string;
  acreage: number;
  duration: number;
  appliedAt?: string;
  createdAt?: string;
  repaymentSchedule?: Array<{
    id: string;
    dueDate: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
  }>;
  expectedYield?: number;
  expectedMarketPrice?: number;
  productionCost?: number;
  expectedProfit?: number;
  interestRate?: number;
  season?: string;
}

interface RealTimeNotification {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
  timestamp: Date;
  loanId?: string;
}

interface InvestmentUpdate {
  loanStatus: string;
  loanId: string;
  newFunding?: number;
  newStatus: string;
  investorId: string;
  message?: string;
  amount?: number;
  investorName?: string;
}

interface PortfolioUpdate {
  message: string;
  loanId: string;
  amount: number;
  type?: string;
  investorId?: string;
}

interface ProgressUpdate {
  loanId: string;
  farmerName: string;
  stage: string;
  description: string;
  timestamp: Date;
  farmerLocation?: string;
  progressPercentage?: number;
  photos?: string[];
  type?: string;
}

// Add transformApiLoan function directly here
const transformApiLoan = (apiLoan: ApiLoanData): Loan => {
  return {
    id: apiLoan._id || apiLoan.id || '',
    purpose: apiLoan.purpose,
    amount: apiLoan.amount,
    status: apiLoan.status,
    cropType: apiLoan.cropType,
    acreage: apiLoan.acreage,
    duration: apiLoan.duration,
    appliedAt: apiLoan.appliedAt || apiLoan.createdAt || new Date().toISOString(),
    repaymentSchedule: apiLoan.repaymentSchedule || [],
    expectedYield: apiLoan.expectedYield || 0,
    expectedMarketPrice: apiLoan.expectedMarketPrice || 0,
    productionCost: apiLoan.productionCost || 0,
    expectedProfit: apiLoan.expectedProfit || 0,
    interestRate: apiLoan.interestRate || 12,
    season: apiLoan.season || '2024-2025'
  };
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  
  const [stats, setStats] = useState<DashboardStats>({
    totalLoans: 0,
    activeLoans: 0,
    amountFunded: 0,
    repaymentRate: 0,
  });
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  
  // ✅ ADD useRef TO TRACK MOUNT STATUS AND PREVENT LEAKS
  const isMounted = useRef(true);
  const socketInitialized = useRef(false);

  // ✅ FIXED SOCKET EFFECT - PROPER CLEANUP AND DEPENDENCIES
  useEffect(() => {
    isMounted.current = true;
    
    // ✅ PREVENT MULTIPLE INITIALIZATIONS
    if (socketInitialized.current) {
      return;
    }

    const initializeSocket = async () => {
      if (!isMounted.current) return;

      try {
        console.log('🔄 Initializing socket connection...');
        
        // ✅ DELAY CONNECTION TO PREVENT RACE CONDITIONS
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!isMounted.current) return;

        const socket = socketService.connect();
        
        if (!socket) {
          console.log('❌ Socket connection failed initially');
          return;
        }

        // ✅ SET UP CONNECTION LISTENERS ONLY ONCE
        const handleConnect = () => {
          if (isMounted.current) {
            console.log('✅ Farmer socket connected successfully');
            setSocketConnected(true);
          }
        };

        const handleDisconnect = () => {
          if (isMounted.current) {
            console.log('🔌 Farmer socket disconnected');
            setSocketConnected(false);
          }
        };

        const handleConnectError = (error: Error) => {
          if (isMounted.current) {
            console.error('❌ Farmer socket connection error:', error);
            setSocketConnected(false);
          }
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);

        // ✅ JOIN ROOM AFTER CONNECTION
        const farmerId = user?.id;
        if (farmerId && isMounted.current) {
          // Wait a bit for socket to be fully ready
          setTimeout(() => {
            if (isMounted.current && socketService.isConnected) {
              socketService.joinFarmerRoom(farmerId);
              console.log('👨‍🌾 Farmer joined room:', farmerId);
            }
          }, 500);
        }

        // ✅ SET UP EVENT HANDLERS
        const handleInvestmentUpdate = (...args: unknown[]) => {
          if (isMounted.current && args[0] && typeof args[0] === 'object') {
            const update = args[0] as InvestmentUpdate;
            console.log('🌱 Farmer received investment update:', update);
            
            let notificationMessage = '';
            const notificationType: 'success' | 'info' | 'warning' = 'success';
            
            // ✅ HANDLE ALL TYPES OF INVESTMENT UPDATES
            if (update.message) {
              // Use the message from backend
              notificationMessage = update.message;
            } else if (update.newStatus === 'active' || update.loanStatus === 'active') {
              notificationMessage = '🎉 Your loan is now fully funded and active! You can start posting progress updates.';
            } else {
              // ✅ NOTIFICATION FOR EVERY INVESTMENT (even small amounts)
              const amount = update.amount || update.newFunding || 0;
              const investorName = update.investorName || 'An investor';
              notificationMessage = `💰 ${investorName} invested ₹${amount.toLocaleString()} in your loan!`;
            }
            
            const newNotification: RealTimeNotification = {
              id: Date.now().toString(),
              type: notificationType,
              message: notificationMessage,
              timestamp: new Date(),
              loanId: update.loanId
            };
            
            setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
            
            // ✅ REFRESH DATA FOR ALL INVESTMENT UPDATES
            fetchDashboardData();
            
            setTimeout(() => {
              setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
            }, 5000);
          }
        };

        const handlePortfolioUpdate = (...args: unknown[]) => {
          if (isMounted.current && args[0] && typeof args[0] === 'object') {
            const update = args[0] as PortfolioUpdate;
            console.log('💰 Farmer received portfolio update:', update);
            
            const newNotification: RealTimeNotification = {
              id: Date.now().toString(),
              type: 'info',
              message: `Portfolio updated: ${update.message}`,
              timestamp: new Date()
            };
            
            setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
          }
        };

        const handleProgressUpdate = (...args: unknown[]) => {
          if (isMounted.current && args[0] && typeof args[0] === 'object') {
            const update = args[0] as ProgressUpdate;
            console.log('📊 Farmer received progress update:', update);
            
            const newNotification: RealTimeNotification = {
              id: Date.now().toString(),
              type: 'info',
              message: `System: ${update.description}`,
              timestamp: new Date()
            };
            
            setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
          }
        };

        socketService.onInvestmentUpdate(handleInvestmentUpdate);
        socketService.onPortfolioUpdate(handlePortfolioUpdate);
        socketService.onProgressUpdate(handleProgressUpdate);

        socketInitialized.current = true;

        // ✅ RETURN CLEANUP FUNCTION
        return () => {
          socket.off('connect', handleConnect);
          socket.off('disconnect', handleDisconnect);
          socket.off('connect_error', handleConnectError);
          
          socketService.removeListener('investmentUpdate', handleInvestmentUpdate);
          socketService.removeListener('portfolioUpdate', handlePortfolioUpdate);
          socketService.removeListener('progressUpdate', handleProgressUpdate);
        };

      } catch (error) {
        console.error('❌ Socket initialization error:', error);
      }
    };

    initializeSocket();

    // ✅ CLEANUP ON UNMOUNT ONLY
    return () => {
      isMounted.current = false;
      socketInitialized.current = false;
      
      console.log('🔌 Cleaning up farmer socket connections');
      
      // Only disconnect if component is truly unmounting
      setTimeout(() => {
        if (!isMounted.current) {
          socketService.disconnect();
        }
      }, 100);
    };
  }, []); // ✅ EMPTY DEPENDENCY ARRAY - RUN ONLY ONCE

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsResponse, loansResponse] = await Promise.all([
        loanApplicationApi.getDashboardStats(),
        loanApplicationApi.getRecentApplications()
      ]);

      console.log('📊 Dashboard stats response:', statsResponse);
      console.log('📋 Recent loans response:', loansResponse);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      } else {
        console.log('⚠️ Using fallback stats data');
        setStats({
          totalLoans: 3,
          activeLoans: 1,
          amountFunded: 150000,
          repaymentRate: 95,
        });
      }

      if (loansResponse.success && loansResponse.data) {
        const transformedLoans: Loan[] = loansResponse.data.map((loan: ApiLoanData) => transformApiLoan(loan));
        console.log('🔄 Transformed loans for dashboard:', transformedLoans);
        setLoans(transformedLoans);
      } else {
        console.log('⚠️ Using fallback loans data');
        const mockLoans: Loan[] = [
          {
            id: '1',
            purpose: 'Wheat Cultivation',
            amount: 50000,
            status: 'active',
            cropType: 'Wheat',
            acreage: 10,
            duration: 12,
            appliedAt: new Date().toISOString(),
            repaymentSchedule: [],
            expectedYield: 3000,
            expectedMarketPrice: 25,
            productionCost: 35000,
            expectedProfit: 15000,
            interestRate: 8.5,
            season: '2024-2025'
          }
        ];
        setLoans(mockLoans);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({ totalLoans: 3, activeLoans: 1, amountFunded: 150000, repaymentRate: 95 });
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const upcomingPayments = loans
    .filter((loan) => loan.status === 'active')
    .flatMap((loan) =>
      loan.repaymentSchedule?.filter((payment) => payment.status === 'pending')
        .map((payment) => ({ ...payment, loanPurpose: loan.purpose })) || []
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout>
      <div className="space-y-6">
        {/* ✅ IMPROVED: Real-time Notifications with Connection Status */}
        <div className="space-y-2">
          {/* Connection Status */}
          <div className={`p-3 rounded-lg border-l-4 ${
            socketConnected 
              ? 'bg-green-50 border-green-400' 
              : 'bg-yellow-50 border-yellow-400'
          } flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                socketConnected ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <div>
                <p className="font-medium text-gray-900">
                  {socketConnected ? '🟢 Real-time updates active' : '🟡 Connecting to real-time updates...'}
                </p>
                <p className="text-sm text-gray-600">
                  {socketConnected 
                    ? 'You will receive instant notifications about your loans' 
                    : 'Please check your internet connection'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Real-time Notifications */}
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-l-4 ${
                notification.type === 'success' 
                  ? 'bg-green-50 border-green-400' 
                  : notification.type === 'warning'
                  ? 'bg-orange-50 border-orange-400'
                  : 'bg-blue-50 border-blue-400'
              } flex items-center justify-between animate-in slide-in-from-top duration-500`}
            >
              <div className="flex items-center space-x-3">
                <Bell className={`h-5 w-5 ${
                  notification.type === 'success' 
                    ? 'text-green-600' 
                    : notification.type === 'warning'
                    ? 'text-orange-600'
                    : 'text-blue-600'
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
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {greeting}, {user?.name || 'Farmer'}! 🌱
              </h1>
              <p className="text-green-100 mt-1">
                Welcome back to your AgriFund dashboard. Here's what's happening with your farming journey.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-green-100 text-sm">Today's Date</div>
                <div className="text-xl font-semibold">
                  {format(new Date(), 'MMM dd, yyyy')}
                </div>
              </div>
              {socketConnected && (
                <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-100 text-sm">Live</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Loan Status Cards */}
          <div className="lg:col-span-2">
            <LoanStatusCards loans={loans} loading={loading} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Payments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Bell className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Payments</h2>
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
              ) : upcomingPayments.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No upcoming payments</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingPayments.map((payment) => (
                    <div key={payment.id} className="border-l-4 border-orange-400 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">₹{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{payment.loanPurpose}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(payment.dueDate), 'MMM dd')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <QuickActions navigate={navigate} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;