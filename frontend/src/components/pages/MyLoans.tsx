import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { Loan, ApiLoan, transformApiLoan } from '../types';
import { loanApplicationApi } from '../services/api';
import { socketService } from '../services/socketService'; // ✅ ADD IMPORT
import { useAuth } from '../../hooks/useAuth'; // ✅ ADD IMPORT
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  IndianRupee, 
  Calendar, 
  FileText,
  Filter,
  Search,
  Eye,
  Upload,
  MessageCircle,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';

const MyLoans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth(); // ✅ ADD THIS

  const fetchLoans = async () => {
    try {
      console.log('🔄 Starting to fetch loans...');
      
      // Check authentication
      const token = localStorage.getItem('token');
      console.log('🔑 Auth token exists:', !!token);
      
      if (!token) {
        console.error('❌ No authentication token found');
        setLoading(false);
        return;
      }

      // REAL API CALL
      const response = await loanApplicationApi.getMyApplications();
      
      console.log('📦 Full API response:', response);
      console.log('✅ Response success:', response.success);
      console.log('📊 Response data:', response.data);
      
      if (response.success && response.data) {
        let loansData: ApiLoan[] = [];
        
        // Handle different response structures
        if (response.data.loans && Array.isArray(response.data.loans)) {
          console.log('🎯 Using response.data.loans array');
          loansData = response.data.loans;
        } else if (Array.isArray(response.data)) {
          console.log('🎯 Using response.data directly as array');
          loansData = response.data;
        } else {
          console.log('⚠️ Unexpected data structure, using empty array');
          loansData = [];
        }
        
        console.log('📄 Loans data to transform:', loansData);
        
        if (Array.isArray(loansData) && loansData.length > 0) {
          // Transform backend data to match frontend Loan interface
          const transformedLoans: Loan[] = loansData.map((loan: ApiLoan) => transformApiLoan(loan));
          console.log('🔄 Transformed loans:', transformedLoans);
          setLoans(transformedLoans);
        } else {
          console.log('ℹ️ No loans data found');
          setLoans([]);
        }
      } else {
        console.error('❌ API returned failure:', response.message);
        setLoans([]);
      }
    } catch (error) {
      console.error('💥 Error fetching loans:', error);
      // Fallback to empty array if API fails
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // ✅ ADD REAL-TIME UPDATES FOR FARMER
  useEffect(() => {
    if (user?.userType === 'farmer') {
      socketService.connect();
      
      // Join farmer room
      socketService.joinFarmerRoom(user.id);
      
      // Listen for investment updates
      socketService.onInvestmentUpdate((update) => {
        console.log('💰 Farmer received investment update:', update);
        
        // Refresh loans data
        fetchLoans();
        
        // Show notification - ✅ FIXED: use 'amount' instead of 'investmentAmount'
        alert(`🎉 New investment of ₹${update.amount} received!`);
      });

      // Listen for loan status updates
      socketService.onPortfolioUpdate((update) => {
        console.log('📊 Farmer received portfolio update:', update);
        fetchLoans(); // Refresh data
      });

      return () => {
        socketService.removeAllListeners('investmentUpdate');
        socketService.removeAllListeners('portfolioUpdate');
      };
    }
  }, [user]);

  const getStatusIcon = (status: Loan['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'approved':
      case 'disbursed':
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'disbursed':
      case 'active':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'completed':
        return 'bg-gray-50 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const filteredLoans = loans.filter(loan => {
    const matchesFilter = filter === 'all' || loan.status === filter;
    const matchesSearch = loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.cropType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: loans.length,
    pending: loans.filter(l => l.status === 'pending').length,
    approved: loans.filter(l => l.status === 'approved').length,
    active: loans.filter(l => l.status === 'active').length,
    disbursed: loans.filter(l => l.status === 'disbursed').length,
    completed: loans.filter(l => l.status === 'completed').length,
    rejected: loans.filter(l => l.status === 'rejected').length,
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          </div>
          <div className="grid gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
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
            <h1 className="text-2xl font-bold text-gray-900">My Loans</h1>
            <p className="text-gray-600 mt-1">Track and manage all your loan applications</p>
          </div>
          <Link
            to="/apply-loan"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Apply for Loan
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filter === status
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search loans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Loans List */}
        {filteredLoans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {loans.length === 0 ? "No loans found" : "No matching loans"}
            </h3>
            <p className="text-gray-600 mb-6">
              {loans.length === 0 
                ? "You haven't applied for any loans yet."
                : `No loans match your current filters.`
              }
            </p>
            <Link
              to="/apply-loan"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Apply for Your First Loan
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLoans.map((loan) => (
              <div key={loan.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(loan.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{loan.purpose}</h3>
                        <p className="text-sm text-gray-600">{loan.cropType} • {loan.acreage} acres</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}
                    >
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <IndianRupee className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-semibold">₹{loan.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{loan.duration} months</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Interest Rate</p>
                        <p className="font-semibold">{loan.interestRate}% p.a.</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Applied</p>
                        <p className="font-semibold">{format(new Date(loan.appliedAt), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Application Progress</span>
                      <span>
                        {loan.status === 'completed' ? 100 :
                         loan.status === 'active' ? 90 :
                         loan.status === 'disbursed' ? 75 :
                         loan.status === 'approved' ? 50 :
                         loan.status === 'pending' ? 25 : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            loan.status === 'completed' ? 100 :
                            loan.status === 'active' ? 90 :
                            loan.status === 'disbursed' ? 75 :
                            loan.status === 'approved' ? 50 :
                            loan.status === 'pending' ? 25 : 0
                          }%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/loan-details/${loan.id}`}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Link>
                    
                    {loan.status === 'active' && (
                      <button className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm">
                        <Upload className="h-4 w-4" />
                        <span>Update Progress</span>
                      </button>
                    )}
                    
                    {(loan.status === 'pending' || loan.status === 'approved') && (
                      <button className="flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors text-sm">
                        <MessageCircle className="h-4 w-4" />
                        <span>Contact Support</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyLoans;