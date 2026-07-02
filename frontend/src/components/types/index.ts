import { FormikErrors, FormikTouched } from "formik";

/**
 * Main loan application form shape used across the wizard.
 */
export interface LoanApplication {
  amount: number;
  purpose: string;
  duration: number;
  cropType: string;
  acreage: number;
  season: string;
  expectedYield: number;
  expectedMarketPrice: number;
  productionCost: number;
  expectedProfit: number;
  documents: Document[];
  customPurpose?: string;
  customCropType?: string;
}

/**
 * Generic Step props used by each step component.
 */
export interface StepProps<T = LoanApplication> {
  values: T;
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
  setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void;
  validateForm?: (values?: T) => Promise<FormikErrors<T>>;
}

export interface DashboardStats {
  totalLoans: number;
  activeLoans: number;
  amountFunded: number;
  repaymentRate: number;
}

export interface Repayment {
  id: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'farmer' | 'investor';
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface ProgressUpdate {
  id: string;
  description: string;
  photos: string[];
  date: string;
}

export interface Loan {
  id: string;
  purpose: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'disbursed' | 'completed';
  cropType: string;
  acreage: number;
  duration: number;
  appliedAt: string;
  repaymentSchedule: Repayment[];
  // Required financial fields
  expectedYield: number;
  expectedMarketPrice: number;
  productionCost: number;
  expectedProfit: number;
  interestRate: number;
  season: string;
  // Optional timeline fields
  approvedAt?: string;
  disbursedAt?: string;
}

export interface ExtendedLoan extends Loan {
  documents: Document[];
  progressUpdates: ProgressUpdate[];
}

// API Response interface for loan data from backend
export interface ApiLoan {
  _id?: string;
  id?: string;
  purpose: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'disbursed' | 'completed';
  cropType: string;
  acreage: number;
  duration: number;
  appliedAt?: string;
  applicationDate?: string;
  interestRate?: number;
  repaymentSchedule?: Repayment[];
  expectedYield?: number;
  expectedMarketPrice?: number;
  productionCost?: number;
  expectedProfit?: number;
  season?: string;
  approvedAt?: string;
  disbursedAt?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
export interface LoansResponse {
  success: boolean;
  data?: ApiLoan[]; // Direct array
  message?: string;
}
export interface CropHistory {
  crop: string;
  season: string;
  yield: number;
  year: number;
}

export interface Equipment {
  name: string;
  type: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface LandDetails {
  totalAcreage: number;
  landType: string;
  location: string;
  ownershipType: 'owned' | 'leased' | 'shared';
}

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}

export interface FarmerProfile {
  farmingExperience: number;
  creditScore: number;
  landDetails: LandDetails;
  cropHistory: CropHistory[];
  equipment: Equipment[];
  bankDetails: BankDetails;
}

// Utility function to transform API loan to Loan type
export const transformApiLoan = (loan: ApiLoan): Loan => ({
  id: loan._id || loan.id || '',
  purpose: loan.purpose || '',
  amount: loan.amount || 0,
  status: loan.status || 'pending',
  cropType: loan.cropType || '',
  acreage: loan.acreage || 0,
  duration: loan.duration || 0,
  appliedAt: loan.appliedAt || loan.applicationDate || new Date().toISOString(),
  interestRate: loan.interestRate || 0,
  repaymentSchedule: loan.repaymentSchedule || [],
  expectedYield: loan.expectedYield || 0,
  expectedMarketPrice: loan.expectedMarketPrice || 0,
  productionCost: loan.productionCost || 0,
  expectedProfit: loan.expectedProfit || 0,
  season: loan.season || '2024-2025',
  approvedAt: loan.approvedAt || undefined,
  disbursedAt: loan.disbursedAt || undefined,
});