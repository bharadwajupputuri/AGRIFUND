import React from 'react';
import { LoanApplication } from '../../types';

export interface ReviewStepProps {
  values: LoanApplication;
  onEdit: (step: number) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ values, onEdit }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">Review Your Application</h2>

      {/* Basic Details */}
      <section className="bg-gray-50 p-4 rounded mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Basic Details</h3>
          <button type="button" className="text-blue-600 hover:underline text-sm" onClick={() => onEdit(1)}>
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div>
            <span className="font-medium">Amount:</span> ₹{values.amount?.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Purpose:</span> {values.purpose === 'Other' ? values.customPurpose : values.purpose}
          </div>
          <div>
            <span className="font-medium">Duration:</span> {values.duration} months
          </div>
        </div>
      </section>

      {/* Farm Details */}
      <section className="bg-gray-50 p-4 rounded mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Farm Details</h3>
          <button type="button" className="text-blue-600 hover:underline text-sm" onClick={() => onEdit(2)}>
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div>
            <span className="font-medium">Crop Type:</span> {values.cropType === 'Other' ? values.customCropType : values.cropType}
          </div>
          <div>
            <span className="font-medium">Season:</span> {values.season}
          </div>
          <div>
            <span className="font-medium">Acreage:</span> {values.acreage} acres
          </div>
          <div>
            <span className="font-medium">Expected Yield:</span> {values.expectedYield} kg/acre
          </div>
        </div>
      </section>

      {/* Financial Projections */}
      <section className="bg-gray-50 p-4 rounded mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Financial Projections</h3>
          <button type="button" className="text-blue-600 hover:underline text-sm" onClick={() => onEdit(3)}>
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div>
            <span className="font-medium">Expected Market Price:</span> ₹{values.expectedMarketPrice}
          </div>
          <div>
            <span className="font-medium">Production Cost:</span> ₹{values.productionCost}
          </div>
          <div>
            <span className="font-medium">Expected Profit:</span> ₹
            {values.expectedProfit ||
              ((values.acreage * values.expectedYield * values.expectedMarketPrice) - values.productionCost).toLocaleString()}
          </div>
        </div>
      </section>

      {/* Document Upload */}
      <section className="bg-gray-50 p-4 rounded mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Documents</h3>
          <button type="button" className="text-blue-600 hover:underline text-sm" onClick={() => onEdit(4)}>
            Edit
          </button>
        </div>
        <ul className="list-disc pl-5 text-sm">
          {values.documents && values.documents.length > 0 ? (
            values.documents.map((file, idx) => (
              <li key={idx}>{typeof file === 'string' ? file : file.name}</li>
            ))
          ) : (
            <li>No documents uploaded.</li>
          )}
        </ul>
      </section>

      {/* Summary */}
      <section className="bg-green-50 p-4 rounded">
        <h3 className="font-semibold text-lg mb-2">Summary</h3>
        <div className="text-sm">
          <div>
            <span className="font-medium">Total Expected Production:</span>{' '}
            {values.acreage && values.expectedYield
              ? (values.acreage * values.expectedYield).toLocaleString() + ' kg'
              : 'N/A'}
          </div>
          <div>
            <span className="font-medium">Production per Month:</span>{' '}
            {values.acreage && values.expectedYield && values.duration
              ? Math.round((values.acreage * values.expectedYield) / values.duration).toLocaleString() + ' kg'
              : 'N/A'}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReviewStep;
