import React from 'react';
import { Field, ErrorMessage, FormikErrors, FormikTouched } from 'formik';
import { LoanApplication } from '../../types';


interface BasicDetailsStepProps {
  values: LoanApplication;
  errors: FormikErrors<LoanApplication>;
  touched: FormikTouched<LoanApplication>;
}

const BasicDetailsStep: React.FC<BasicDetailsStepProps> = ({ values, errors, touched }) => {
  const loanPurposes = [
    'Seed and fertilizer purchase',
    'Equipment purchase',
    'Land preparation',
    'Irrigation setup',
    'Crop protection',
    'Harvesting equipment',
    'Storage facilities',
    'Working capital',
    'Other',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Loan Details</h3>
        <p className="text-sm text-gray-600 mb-6">
          Let's start with the basic information about your loan requirement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount (₹) *
          </label>
          <Field
            type="number"
            name="amount"
            id="amount"
            min="10000"
            max="1000000"
            step="1000"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.amount && touched.amount ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., 50000"
          />
          <ErrorMessage name="amount" component="div" className="mt-1 text-sm text-red-600" />
          <p className="mt-1 text-xs text-gray-500">Minimum: ₹10,000 | Maximum: ₹10,00,000</p>
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Duration (months) *
          </label>
          <Field
            as="select"
            name="duration"
            id="duration"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              errors.duration && touched.duration ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select duration</option>
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="9">9 months</option>
            <option value="12">12 months</option>
            <option value="18">18 months</option>
            <option value="24">24 months</option>
          </Field>
          <ErrorMessage name="duration" component="div" className="mt-1 text-sm text-red-600" />
        </div>
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
          Loan Purpose *
        </label>
        <Field
          as="select"
          name="purpose"
          id="purpose"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
            errors.purpose && touched.purpose ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select loan purpose</option>
          {loanPurposes.map((purpose) => (
            <option key={purpose} value={purpose}>
              {purpose}
            </option>
          ))}
        </Field>
        <ErrorMessage name="purpose" component="div" className="mt-1 text-sm text-red-600" />
      </div>

      {values.purpose === 'Other' && (
        <div>
          <label htmlFor="customPurpose" className="block text-sm font-medium text-gray-700 mb-2">
            Please specify *
          </label>
          <Field
            type="text"
            name="customPurpose"
            id="customPurpose"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Describe your loan purpose"
          />
          <ErrorMessage name="customPurpose" component="div" className="mt-1 text-sm text-red-600" />
        </div>
      )}

      {/* Interest Rate Display */}
      {values.amount && values.duration && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">Estimated Loan Terms</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-green-700">Interest Rate:</span>
              <span className="font-medium text-green-900 ml-2">12% per annum</span>
            </div>
            <div>
              <span className="text-green-700">Monthly EMI:</span>
              <span className="font-medium text-green-900 ml-2">
                ₹{Math.round((values.amount * 0.12 * Math.pow(1.01, values.duration)) / (Math.pow(1.01, values.duration) - 1)).toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            *Final terms may vary based on your profile and risk assessment
          </p>
        </div>
      )}
    </div>
  );
};

export default BasicDetailsStep;