// src/components/LoanApplication/steps/FarmDetailsStep.tsx
import React from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import { LoanApplication } from '../../types';

const FarmDetailsStep: React.FC = () => {
  const { values, errors, touched } = useFormikContext<LoanApplication>();

  const cropTypes = [
    'Wheat',
    'Rice',
    'Corn',
    'Sugarcane',
    'Cotton',
    'Soybean',
    'Potato',
    'Tomato',
    'Onion',
    'Pulses',
    'Vegetables',
    'Fruits',
    'Other',
  ];

  const seasons = [
    'Kharif (Monsoon)',
    'Rabi (Winter)',
    'Zaid (Summer)',
    'Year-round',
  ];

  // Calculate derived values
  const totalProduction = values.acreage * values.expectedYield;
  const monthlyProduction = values.duration ? totalProduction / values.duration : totalProduction / 6;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Farm Details</h3>
        <p className="text-sm text-gray-600 mb-6">
          Tell us about your farming plans and land details for this loan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-2">
            Crop Type *
          </label>
          <Field
            as="select"
            name="cropType"
            id="cropType"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.cropType && touched.cropType ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select crop type</option>
            {cropTypes.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </Field>
          <ErrorMessage name="cropType" component="div" className="mt-1 text-sm text-red-600" />
        </div>

        <div>
          <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-2">
            Growing Season *
          </label>
          <Field
            as="select"
            name="season"
            id="season"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.season && touched.season ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select season</option>
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </Field>
          <ErrorMessage name="season" component="div" className="mt-1 text-sm text-red-600" />
        </div>
      </div>

      {values.cropType === 'Other' && (
        <div>
          <label htmlFor="customCropType" className="block text-sm font-medium text-gray-700 mb-2">
            Please specify crop type *
          </label>
          <Field
            type="text"
            name="customCropType"
            id="customCropType"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter crop type"
          />
          <ErrorMessage name="customCropType" component="div" className="mt-1 text-sm text-red-600" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="acreage" className="block text-sm font-medium text-gray-700 mb-2">
            Land Area (acres) *
          </label>
          <Field
            type="number"
            name="acreage"
            id="acreage"
            min="0.1"
            max="1000"
            step="0.1"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.acreage && touched.acreage ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., 5.5"
          />
          <ErrorMessage name="acreage" component="div" className="mt-1 text-sm text-red-600" />
          <p className="mt-1 text-xs text-gray-500">Enter the area you plan to cultivate</p>
        </div>

        <div>
          <label htmlFor="expectedYield" className="block text-sm font-medium text-gray-700 mb-2">
            Expected Yield (kg/acre) *
          </label>
          <Field
            type="number"
            name="expectedYield"
            id="expectedYield"
            min="1"
            max="10000"
            step="50"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.expectedYield && touched.expectedYield ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., 2500"
          />
          <ErrorMessage name="expectedYield" component="div" className="mt-1 text-sm text-red-600" />
          <p className="mt-1 text-xs text-gray-500">Based on your farming experience and local conditions</p>
        </div>
      </div>

      {/* Yield Calculation Display */}
      {values.acreage > 0 && values.expectedYield > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Production Estimate</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Total Expected Production:</span>
              <span className="font-medium text-blue-900 ml-2">
                {totalProduction.toLocaleString()} kg
              </span>
            </div>
            <div>
              <span className="text-blue-700">Production per Month:</span>
              <span className="font-medium text-blue-900 ml-2">
                {Math.round(monthlyProduction).toLocaleString()} kg
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Farming Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">💡 Farming Tips</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Consider local weather patterns when estimating yield</li>
          <li>• Factor in soil quality and irrigation availability</li>
          <li>• Research market demand for your chosen crop</li>
          <li>• Plan for crop rotation to maintain soil health</li>
        </ul>
      </div>
    </div>
  );
};

export default FarmDetailsStep;