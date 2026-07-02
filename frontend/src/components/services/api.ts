import {  LoanApplication } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token
const getAuthToken = (): string | null => localStorage.getItem('token');

// API Response types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  applicationId?: string;
  data?: T;
}

// Loan types for API responses
interface Loan {
  _id: string;
  user: string;
  amount: number;
  purpose: string;
  duration: number;
  cropType: string;
  acreage: number;
  season: string;
  expectedYield: number;
  expectedMarketPrice: number;
  productionCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Extended Loan interface for detailed view
interface ExtendedLoan extends Loan {
  documents: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>;
  progressUpdates: Array<{
    id: string;
    description: string;
    photos: string[];
    date: string;
  }>;
  repaymentSchedule: Array<{
    id: string;
    dueDate: string;
    amount: number;
    status: 'pending' | 'paid' | 'overdue';
  }>;
  approvedAt?: string;
  disbursedAt?: string;
  interestRate: number;
  expectedProfit: number;
}

// LoansResponse interface
interface LoansResponse {
  count: number;
  loans: Loan[];
}

// NEW: Dashboard stats response
interface DashboardStatsResponse {
  totalLoans: number;
  activeLoans: number;
  amountFunded: number;
  repaymentRate: number;
}

export const loanApplicationApi = {
  submitApplication: async (application: LoanApplication): Promise<ApiResponse<{ applicationId: string }>> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    

    const response = await fetch(`${API_BASE_URL}/loans/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(application)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getMyApplications: async (): Promise<ApiResponse<LoansResponse>> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('🔍 Making API call to:', `${API_BASE_URL}/loans/my-applications`);
    
    const response = await fetch(`${API_BASE_URL}/loans/my-applications`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error('❌ API response not OK:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<LoansResponse> = await response.json();
    console.log('📦 Raw API response data:', data);
    return data;
  },

  getLoanDetails: async (loanId: string): Promise<ApiResponse<ExtendedLoan>> => {
    const token = getAuthToken();
    
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/loans/${loanId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<ExtendedLoan> = await response.json();
    return data;
  },

  // FIXED: Get dashboard statistics
  getDashboardStats: async (): Promise<ApiResponse<DashboardStatsResponse>> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/loans/dashboard-stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<DashboardStatsResponse> = await response.json();
    return data;
  },

  // FIXED: Get recent loan applications for dashboard
  getRecentApplications: async (): Promise<ApiResponse<Loan[]>> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/loans/recent-applications`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<Loan[]> = await response.json();
    return data;
  }
};