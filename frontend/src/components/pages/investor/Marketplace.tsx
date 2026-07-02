import React, { useState, useEffect } from 'react';
import Layout from '../../Layout/Layout';
import MarketplaceFilters from '../../../components/investor/MarketplaceFilters';
import LoanCard from '../../../components/investor/LoanCard';
import { MarketplaceLoan, InvestmentFilters } from '../../types/investor';
import { investorAPI } from '../../services/investorAPI';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const Marketplace: React.FC = () => {
  const [loans, setLoans] = useState<MarketplaceLoan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<MarketplaceLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'amount' | 'roi' | 'deadline'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<InvestmentFilters>({});

  // Fetch loans from API
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const response = await investorAPI.getMarketplaceLoans(filters);

        if (response.success && response.data) {
          setLoans(response.data);
          setFilteredLoans(response.data);
        } else {
          setLoans([]);
          setFilteredLoans([]);
        }
      } catch (error) {
        console.error('Error fetching marketplace loans:', error);
        setLoans([]);
        setFilteredLoans([]);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchLoans();

    // ✅ ONLY REQUIRED ADDITION (auto refresh on page focus)
    window.addEventListener('focus', fetchLoans);

    return () => {
      window.removeEventListener('focus', fetchLoans);
    };
  }, [filters]);

  // Filter and sort loans
  useEffect(() => {
    const filtered = loans.filter(loan => {
      const matchesSearch =
        loan.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.farmer.location.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    const sortedLoans = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'roi':
          return b.expectedROI - a.expectedROI;
        case 'deadline':
          return new Date(a.fundingDeadline).getTime() - new Date(b.fundingDeadline).getTime();
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredLoans(sortedLoans);
  }, [loans, searchTerm, sortBy]);

  const handleFiltersChange = (newFilters: InvestmentFilters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({});
    setSortBy('newest');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Marketplace</h1>
          <p className="text-gray-600 mt-1">
            Discover agricultural investment opportunities from verified farmers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by farmer, crop, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'newest' | 'amount' | 'roi' | 'deadline')
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="amount">Highest Amount</option>
                  <option value="roi">Highest ROI</option>
                  <option value="deadline">Deadline Soon</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-md transition-colors ${
                  showFilters
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <MarketplaceFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${filteredLoans.length} investment opportunities found`}
          </p>
          {(Object.keys(filters).length > 0 || searchTerm) && (
            <button
              onClick={clearAllFilters}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Loan Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more opportunities.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLoans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Marketplace;
