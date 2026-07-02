import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { Loan } from '../types';
import { loanApplicationApi } from '../services/api';
import { 
  ArrowLeft,
  Clock, 
  CheckCircle, 
  XCircle, 
  IndianRupee, 
  Calendar, 
  FileText,
  Upload,
  Download,
  TrendingUp,
  Sprout,
  Camera
} from 'lucide-react';

import { format } from 'date-fns';

// Add these interfaces to your types or keep them here
interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

interface ProgressUpdate {
  id: string;
  description: string;
  photos: string[];
  date: string;
}

interface Repayment {
  id: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

interface ExtendedLoan extends Loan {
  documents: Document[];
  progressUpdates: ProgressUpdate[];
  repaymentSchedule: Repayment[];
  appliedAt: string;
  approvedAt?: string;
  disbursedAt?: string;
  interestRate: number;
  farmerId: string;
}

const LoanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loan, setLoan] = useState<ExtendedLoan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string>('');


  useEffect(() => {
    const fetchLoan = async () => {
      if (!id) {
        setError('Loan ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        setError('');
        // REAL API CALL
        const response = await loanApplicationApi.getLoanDetails(id);
        
        if (response.success && response.data) {
          setLoan(response.data as unknown as ExtendedLoan );
        } else {
          setError(response.message || 'Failed to fetch loan details');
        }
      } catch (error) {
        console.error('Error fetching loan:', error);
        setError('Failed to load loan details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id]);

  const getStatusIcon = (status: Loan['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'approved':
      case 'disbursed':
      case 'active':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-gray-600" />;
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

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
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

  if (error || !loan) {
    return (
      <Layout>
        <div className="text-center py-12">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">{error || 'Loan not found'}</p>
          <Link
            to="/my-loans"
            className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Loans
          </Link>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'documents', name: 'Documents', icon: Upload },
    { id: 'progress', name: 'Progress Updates', icon: TrendingUp },
    { id: 'repayment', name: 'Repayment Schedule', icon: Calendar },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            to="/my-loans"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Loans</span>
          </Link>
        </div>

        {/* Loan Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              {getStatusIcon(loan.status)}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{loan.purpose}</h1>
                <p className="text-gray-600">{loan.cropType} • {loan.acreage} acres</p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(loan.status)}`}
            >
              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
            </span>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <IndianRupee className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">₹{loan.amount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Loan Amount</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{loan.duration}</div>
              <div className="text-sm text-gray-600">Months</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{loan.interestRate}%</div>
              <div className="text-sm text-gray-600">Interest Rate</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Sprout className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{loan.expectedYield}</div>
              <div className="text-sm text-gray-600">kg/acre</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  {/* Loan Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application Date:</span>
                        <span className="font-medium">{format(new Date(loan.appliedAt), 'MMM dd, yyyy')}</span>
                      </div>
                      {loan.approvedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Approved Date:</span>
                          <span className="font-medium">{format(new Date(loan.approvedAt), 'MMM dd, yyyy')}</span>
                        </div>
                      )}
                      {loan.disbursedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Disbursed Date:</span>
                          <span className="font-medium">{format(new Date(loan.disbursedAt), 'MMM dd, yyyy')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly EMI:</span>
                        <span className="font-medium">₹{Math.round(loan.amount / loan.duration).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Farm Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crop Type:</span>
                        <span className="font-medium">{loan.cropType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Land Area:</span>
                        <span className="font-medium">{loan.acreage} acres</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Yield:</span>
                        <span className="font-medium">{loan.expectedYield} kg/acre</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Price:</span>
                        <span className="font-medium">₹{loan.expectedMarketPrice}/kg</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Projections */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Financial Projections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-900">₹{(loan.acreage * loan.expectedYield * loan.expectedMarketPrice).toLocaleString()}</div>
                      <div className="text-sm text-green-700">Expected Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-900">₹{loan.productionCost.toLocaleString()}</div>
                      <div className="text-sm text-green-700">Production Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-900">₹{loan.expectedProfit.toLocaleString()}</div>
                      <div className="text-sm text-green-700">Expected Profit</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
                  {loan.status === 'pending' && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>Upload More</span>
                    </button>
                  )}
                </div>
                
                <div className="grid gap-4">
                  {loan.documents && loan.documents.length > 0 ? (
                    loan.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-600">
                              {doc.type?.replace('_', ' ').toUpperCase()} • 
                              Uploaded {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <button className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No documents uploaded yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Progress Updates Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Cultivation Progress</h3>
                  {loan.status === 'active' && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                      <Camera className="h-4 w-4" />
                      <span>Add Update</span>
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {loan.progressUpdates && loan.progressUpdates.length > 0 ? (
                    loan.progressUpdates.map((update, index) => (
                      <div key={update.id} className="relative">
                        {index !== loan.progressUpdates.length - 1 && (
                          <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200"></div>
                        )}
                        <div className="flex space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-gray-900">{update.description}</p>
                                <span className="text-sm text-gray-500">
                                  {format(new Date(update.date), 'MMM dd, yyyy')}
                                </span>
                              </div>
                              {update.photos && update.photos.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                                  {update.photos.map((photo, photoIndex) => (
                                    <img
                                      key={photoIndex}
                                      src={photo}
                                      alt={`Progress update ${photoIndex + 1}`}
                                      className="w-full h-24 object-cover rounded-md"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No progress updates yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Repayment Schedule Tab */}
            {activeTab === 'repayment' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Repayment Schedule</h3>
                
                {loan.repaymentSchedule && loan.repaymentSchedule.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {loan.repaymentSchedule.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {format(new Date(payment.dueDate), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ₹{payment.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                payment.status === 'paid' 
                                  ? 'bg-green-100 text-green-800'
                                  : payment.status === 'overdue'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.status === 'pending' && (
                                <button className="text-green-600 hover:text-green-900">
                                  Pay Now
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No repayment schedule available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoanDetails;