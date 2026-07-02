import {
  InvestorProfile,
  InvestorDashboardStats,
  MarketplaceLoan,
  InvestmentRecord,
  Transaction,
  InvestmentFilters,
  FarmerProfile,
  InvestmentOpportunity,
  ApiResponse
} from '../types/investor';

export interface FarmerDocument {
  _id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  verified: boolean;
}

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const investorAPI = {
  // Dashboard
  getDashboardStats: async (): Promise<{ success: boolean; data: InvestorDashboardStats }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/investors/dashboard-stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; data: InvestorDashboardStats } = await response.json();
    return data;
  },

  getFarmerDocuments: async (
    farmerId: string,
    loanId: string
  ): Promise<{ success: boolean; data: FarmerDocument[] }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/investors/farmers/${farmerId}/documents/${loanId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; data: FarmerDocument[] } = await response.json();
    return data;
  },

  // Profile
  getProfile: async (): Promise<{ success: boolean; data: InvestorProfile }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/investors/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; data: InvestorProfile } = await response.json();
    return data;
  },

  updateProfile: async (profile: Partial<InvestorProfile>): Promise<{ success: boolean; data: InvestorProfile }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/investors/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; data: InvestorProfile } = await response.json();
    return data;
  },

  // Marketplace
  getMarketplaceLoans: async (filters?: InvestmentFilters): Promise<ApiResponse<MarketplaceLoan[]>> => {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/marketplace/loans?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  investInLoan: async (
    loanId: string,
    amount: number
  ): Promise<ApiResponse<{ investmentId: string; amount: number; loanId: string }>> => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/marketplace/loans/${loanId}/invest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error investing in loan:', error);
      return {
        success: false,
        message: 'Investment failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiResponse<{ investmentId: string; amount: number; loanId: string; }>;
    }
  },

  getInvestmentOpportunities: async (): Promise<{ success: boolean; data: InvestmentOpportunity[] }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/investors/investment-opportunities`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; data: InvestmentOpportunity[] } = await response.json();
    return data;
  },

  // Investments
  makeInvestment: async (loanId: string, amount: number): Promise<{ success: boolean; data: InvestmentRecord }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/investors/invest/${loanId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; data: InvestmentRecord } = await response.json();
    return data;
  },

  getPortfolio: async (): Promise<{ success: boolean; data: InvestmentRecord[] }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/investors/portfolio`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; data: InvestmentRecord[] } = await response.json();
    return data;
  },

  // Transactions
  getTransactions: async (): Promise<{ success: boolean; data: Transaction[] }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/investors/transactions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; data: Transaction[] } = await response.json();
    return data;
  },

  // Farmer profiles
  getFarmerProfile: async (farmerId: string): Promise<{ success: boolean; data: FarmerProfile }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/investors/farmer-profile/${farmerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: { success: boolean; data: FarmerProfile } = await response.json();
    return data;
  }
};