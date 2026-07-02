export interface InvestorProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  investmentCapacity: number;
  riskTolerance: 'low' | 'medium' | 'high';
  preferredCrops: string[];
  preferredRegions: string[];
  investmentHistory: InvestmentRecord[];
  totalInvested: number;
  totalReturns: number;
  activeInvestments: number;
  averageROI: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  kycDocuments: {
    panCard?: string;
    aadhaar?: string;
    bankStatement?: string;
    incomeProof?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentRecord {
  id: string;
  loanId: string;
  farmerId: string;
  farmerName: string;
  amount: number;
  investmentDate: string;
  expectedReturn: number;
  actualReturn?: number;
  status: 'active' | 'completed' | 'defaulted' | 'partial_return';
  duration: number;
  cropType: string;
  riskLevel: 'low' | 'medium' | 'high';
  repaymentSchedule: RepaymentRecord[];
  progressUpdates: ProgressUpdate[];
}

export interface RepaymentRecord {
  id: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
  paidAmount?: number;
}

export interface ProgressUpdate {
  id: string;
  date: string;
  description: string;
  photos: string[];
  stage: 'planting' | 'growing' | 'harvesting' | 'selling';
}

export interface MarketplaceLoan {
  id: string;
  farmerId: string;
  farmer: {
    id: string;
    name: string;
    profileImage?: string;
    location: string;
    experience: number;
    creditScore: number;
    successfulLoans: number;
    repaymentRate: number;
    verificationBadges: string[];
  };
  amount: number;
  amountFunded: number;
  amountRemaining: number;
  fundingProgress: number; // Added missing field
  purpose: string;
  duration: number;
  interestRate: number;
  expectedROI: number;
  cropType: string;
  acreage: number;
  season: string;
  expectedYield: number;
  expectedMarketPrice: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  fundingDeadline: string;
  status: 'funding' | 'funded' | 'active' | 'completed';
  minimumInvestment: number;
  investors: {
    investorId: string;
    investorName: string;
    amount: number;
    investmentDate: string;
  }[];
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  progressUpdates?: ProgressUpdate[]; // Added optional field
  repaymentSchedule?: RepaymentRecord[]; // Added optional field
  createdAt: string;
  updatedAt: string;
}

export interface InvestorDashboardStats {
  totalInvested: number;
  totalReturns: number;
  activeInvestments: number;
  completedInvestments: number;
  totalInvestments: number; // ✅ ADD THIS LINE
  averageROI: number;
  portfolioValue: number;
  monthlyReturns: number;
  pendingReturns: number;
}

export interface Transaction {
  id: string;
  type: 'investment' | 'return' | 'withdrawal';
  amount: number;
  description: string;
  loanId?: string;
  farmerId?: string;
  farmerName?: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  transactionId: string;
}

export interface InvestmentFilters {
  minAmount?: number;
  maxAmount?: number;
  cropTypes?: string[];
  riskLevels?: string[];
  minROI?: number;
  maxDuration?: number;
  regions?: string[];
  minCreditScore?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface FarmerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  location: {
    state: string;
    district: string;
    village: string;
  };
  farmingExperience: number;
  landDetails: {
    totalAcreage: number;
    landType: string;
    ownershipType: 'owned' | 'leased' | 'shared';
    soilType: string;
    irrigationType: string;
  };
  cropHistory: {
    crop: string;
    season: string;
    yield: number;
    year: number;
    profit: number;
  }[];
  equipment: {
    name: string;
    type: string;
    condition: string;
  }[];
  creditScore: number;
  loanHistory: {
    totalLoans: number;
    successfulLoans: number;
    defaultedLoans: number;
    repaymentRate: number;
    totalAmountBorrowed: number;
    totalAmountRepaid: number;
  };
  verificationStatus: {
    identity: boolean;
    address: boolean;
    landOwnership: boolean;
    bankAccount: boolean;
    phone: boolean;
    email: boolean;
  };
  verificationBadges: string[];
  ratings: {
    average: number;
    count: number;
    breakdown: {
      communication: number;
      reliability: number;
      transparency: number;
      results: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentOpportunity extends MarketplaceLoan {
  recommendationScore: number;
  matchReasons: string[];
  similarInvestments: string[];
}

// Add these new interfaces for real-time data flow
export interface InvestmentCreateResponse {
  investmentId: string;
  amount: number;
  loanId: string;
  newFundingProgress: number;
  loanStatus: string;
}

export interface LoanFundingUpdate {
  loanId: string;
  newAmountFunded: number;
  newAmountRemaining: number;
  newStatus: string;
  fundingProgress: number;
}

export interface PortfolioSummary {
  totalPortfolioValue: number;
  activeInvestmentsCount: number;
  completedInvestmentsCount: number;
  pendingReturns: number;
  receivedReturns: number;
  overallROI: number;
}

export interface RiskMetrics {
  portfolioRiskScore: number;
  diversificationScore: number;
  riskBreakdown: {
    low: number;
    medium: number;
    high: number;
  };
  recommendedActions: string[];
}