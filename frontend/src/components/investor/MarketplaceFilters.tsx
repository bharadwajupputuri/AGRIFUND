import React from 'react';
import { InvestmentFilters } from '../types/investor';

interface MarketplaceFiltersProps {
  filters: InvestmentFilters;
  onFiltersChange: (filters: InvestmentFilters) => void;
}

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({ filters, onFiltersChange }) => {
  const cropTypes = [
    'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Corn', 'Soybean', 
    'Potato', 'Tomato', 'Onion', 'Pulses', 'Vegetables', 'Fruits'
  ];

  const regions = [
    'Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 
    'Andhra Pradesh', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Madhya Pradesh'
  ];

  const handleFilterChange = (key: keyof InvestmentFilters, value: number|string|undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleArrayFilterChange = (key: keyof InvestmentFilters, value: string, checked: boolean) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    onFiltersChange({
      ...filters,
      [key]: newArray.length > 0 ? newArray : undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Amount Range */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Investment Amount</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Minimum (₹)</label>
            <input
              type="number"
              value={filters.minAmount || ''}
              onChange={(e) => handleFilterChange('minAmount', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10,000"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Maximum (₹)</label>
            <input
              type="number"
              value={filters.maxAmount || ''}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="100,000"
            />
          </div>
        </div>
      </div>

      {/* Crop Types */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Crop Types</h4>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {cropTypes.map((crop) => (
            <label key={crop} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={(filters.cropTypes || []).includes(crop)}
                onChange={(e) => handleArrayFilterChange('cropTypes', crop, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{crop}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Risk & ROI */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Risk & Returns</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Risk Level</label>
            <div className="space-y-1">
              {['low', 'medium', 'high'].map((risk) => (
                <label key={risk} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(filters.riskLevels || []).includes(risk)}
                    onChange={(e) => handleArrayFilterChange('riskLevels', risk, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{risk}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Minimum ROI (%)</label>
            <input
              type="number"
              value={filters.minROI || ''}
              onChange={(e) => handleFilterChange('minROI', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="15"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Duration & Location */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Duration & Location</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max Duration (months)</label>
            <select
              value={filters.maxDuration || ''}
              onChange={(e) => handleFilterChange('maxDuration', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any duration</option>
              <option value="6">Up to 6 months</option>
              <option value="12">Up to 12 months</option>
              <option value="18">Up to 18 months</option>
              <option value="24">Up to 24 months</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Regions</label>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {regions.slice(0, 5).map((region) => (
                <label key={region} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(filters.regions || []).includes(region)}
                    onChange={(e) => handleArrayFilterChange('regions', region, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{region}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min Credit Score</label>
            <select
              value={filters.minCreditScore || ''}
              onChange={(e) => handleFilterChange('minCreditScore', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any score</option>
              <option value="600">600+</option>
              <option value="650">650+</option>
              <option value="700">700+</option>
              <option value="750">750+</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceFilters;