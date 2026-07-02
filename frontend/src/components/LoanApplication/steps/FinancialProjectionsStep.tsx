// src/components/LoanApplication/steps/FinancialProjectionsStep.tsx
import React from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import { LoanApplication } from '../../types';

const FinancialProjectionsStep: React.FC = () => {
  const { values, errors, touched } = useFormikContext<LoanApplication>();

  // Calculate projections
  const totalProduction = values.acreage * values.expectedYield;
  const totalRevenue = totalProduction * values.expectedMarketPrice;
  const netProfit = totalRevenue - values.productionCost;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Projections</h3>
        <p className="text-sm text-gray-600 mb-6">
          Provide your financial estimates for this farming season.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="expectedMarketPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Expected Market Price (₹/kg) *
          </label>
          <Field
            type="number"
            name="expectedMarketPrice"
            id="expectedMarketPrice"
            min="1"
            max="1000"
            step="0.5"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.expectedMarketPrice && touched.expectedMarketPrice ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., 25"
          />
          <ErrorMessage name="expectedMarketPrice" component="div" className="mt-1 text-sm text-red-600" />
          <p className="mt-1 text-xs text-gray-500">Expected selling price per kg</p>
        </div>

        <div>
          <label htmlFor="productionCost" className="block text-sm font-medium text-gray-700 mb-2">
            Total Production Cost (₹) *
          </label>
          <Field
            type="number"
            name="productionCost"
            id="productionCost"
            min="1000"
            max="10000000"
            step="1000"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.productionCost && touched.productionCost ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., 50000"
          />
          <ErrorMessage name="productionCost" component="div" className="mt-1 text-sm text-red-600" />
          <p className="mt-1 text-xs text-gray-500">Includes seeds, fertilizers, labor, etc.</p>
        </div>
      </div>

      {/* Financial Summary */}
      {(values.expectedMarketPrice > 0 || values.productionCost > 0) && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-green-800 mb-3">Financial Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-700">Total Expected Revenue:</span>
              <span className="font-medium text-green-900 ml-2">
                ₹{totalRevenue.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-green-700">Net Profit:</span>
              <span className={`font-medium ml-2 ${netProfit >= 0 ? 'text-green-900' : 'text-red-600'}`}>
                ₹{netProfit.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-green-700">Profit Margin:</span>
              <span className={`font-medium ml-2 ${profitMargin >= 0 ? 'text-green-900' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-green-700">Return on Investment:</span>
              <span className={`font-medium ml-2 ${(netProfit / values.productionCost) * 100 >= 0 ? 'text-green-900' : 'text-red-600'}`}>
                {values.productionCost > 0 ? ((netProfit / values.productionCost) * 100).toFixed(1) + '%' : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Financial Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💰 Financial Planning Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Research current market prices for your crop</li>
          <li>• Include all costs: seeds, fertilizers, labor, transportation</li>
          <li>• Consider buffer for unexpected expenses</li>
          <li>• Check historical price trends for better estimates</li>
        </ul>
      </div>
    </div>
  );
};

export default FinancialProjectionsStep;