// src/components/LoanApplication/steps/ApplicationWizard.tsx
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './StepIndicator';
import BasicDetailsStep from './BasicDetailsStep';
import FarmDetailsStep from './FarmDetailsStep';
import FinancialProjectionsStep from './FinancialProjectionsStep';
import DocumentUploadStep from './DocumentUploadStep';
import ReviewStep from './ReviewStep';
import { ChevronLeft, ChevronRight, Send, Loader2, AlertCircle } from 'lucide-react';
import { StepProps, LoanApplication } from '../../types';
import { loanApplicationApi } from '../../services/api';

const ApplicationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string>('');
  const navigate = useNavigate();

  const steps = [
    'Basic Details',
    'Farm Details',
    'Financial Projections',
    'Document Upload',
    'Review & Submit',
  ];

  const totalSteps = steps.length;

  // MANUAL VALIDATION - Only validates current step fields
  const validateCurrentStep = (values: LoanApplication, step: number): string[] => {
    const errors: string[] = [];

    if (step === 1) {
      if (!values.amount || values.amount < 10000) errors.push('Loan amount must be at least ₹10,000');
      if (!values.duration || values.duration < 3) errors.push('Loan duration must be at least 3 months');
      if (!values.purpose) errors.push('Loan purpose is required');
    }

    if (step === 2) {
      if (!values.cropType) errors.push('Crop type is required');
      if (!values.season) errors.push('Growing season is required');
      if (!values.acreage || values.acreage < 0.1) errors.push('Land area must be at least 0.1 acres');
      if (!values.expectedYield || values.expectedYield < 1) errors.push('Expected yield must be greater than 0');
      if (values.cropType === 'Other' && !values.customCropType) errors.push('Please specify crop type');
    }

    if (step === 3) {
      if (!values.expectedMarketPrice || values.expectedMarketPrice < 1) errors.push('Market price must be greater than 0');
      if (!values.productionCost || values.productionCost < 1000) errors.push('Production cost must be at least ₹1000');
    }

    if (step === 4) {
      if (!values.documents || values.documents.length === 0) errors.push('At least one document is required');
    }

    return errors;
  };

  const initialValues: LoanApplication = {
    amount: 0,
    purpose: '',
    duration: 0,
    cropType: '',
    acreage: 0,
    season: '',
    expectedYield: 0,
    expectedMarketPrice: 0,
    productionCost: 0,
    expectedProfit: 0,
    documents: [],
    customPurpose: '',
    customCropType: '',
  };

  const handleNext = () => {
    setStepErrors([]);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevious = () => {
    setStepErrors([]);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepEdit = (step: number) => {
    setStepErrors([]);
    setCurrentStep(step);
  };

  const handleSubmit = async (values: LoanApplication) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        setSubmitError('Please login to submit your application');
        navigate('/signin');
        return;
      }

      console.log('Submitting loan application to backend:', values);
      
      // Send empty documents array without destructuring
      const processedData = {
        ...values,
        documents: [] // Send empty array to match backend schema
      };
      
      // Submit to backend API with processed data
      const result = await loanApplicationApi.submitApplication(processedData);
      
      console.log('Backend response:', result);
      console.log('Success:', result.success);
      console.log('Application ID:', result.data?.applicationId);
      
      // Check for success - backend returns data.applicationId
      if (result.success && result.data?.applicationId) {
        console.log('✅ Application submitted successfully, redirecting to dashboard...');
        
        // Move to final step to show checkmark
        setCurrentStep(totalSteps);
        
        // Wait a moment to show the success state
        setTimeout(() => {
          alert('Application submitted successfully! You can view it in your dashboard.');
          navigate('/farmer-dashboard');
        }, 500);
      } else {
        console.error('❌ Submission failed:', result.message);
        setSubmitError(result.message || 'Failed to submit application');
        setIsSubmitting(false);
      }
    } catch (error: unknown) {
      console.error('💥 Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.';
      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
    // Note: Don't set isSubmitting to false here for success case, 
    // let it stay true during redirect to prevent double submission
  };

  // SIMPLE handleNextClick - only validates current step
  const handleNextClick = (values: LoanApplication) => {
    setStepErrors([]);
    
    // Only validate the current step's fields
    const currentErrors = validateCurrentStep(values, currentStep);
    
    if (currentErrors.length === 0) {
      handleNext();
    } else {
      setStepErrors(currentErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <StepIndicator 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          steps={steps} 
        />

        {/* Validation Errors Display */}
        {stepErrors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {stepErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submission Error Display */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          </div>
        )}

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched, submitForm }) => {
            const stepProps: StepProps<LoanApplication> = {
              values,
              errors: errors || {},
              touched: touched || {},
              setFieldValue,
            };

            const renderStep = () => {
              switch (currentStep) {
                case 1:
                  return <BasicDetailsStep {...stepProps} />;
                case 2:
                  return <FarmDetailsStep />;
                case 3:
                  return <FinancialProjectionsStep />;
                case 4:
                  return <DocumentUploadStep {...stepProps} />;
                case 5:
                  return <ReviewStep values={values} onEdit={handleStepEdit} />;
                default:
                  return null;
              }
            };

            return (
              <Form>
                <div className="min-h-[400px]">
                  {renderStep()}
                </div>
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
  <button
    type="button"
    onClick={handlePrevious}
    disabled={currentStep === 1 || isSubmitting}
    className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </button>

  {currentStep < totalSteps ? (
    <button
      type="button"
      onClick={() => handleNextClick(values)}
      disabled={isSubmitting}
      className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <span>Next</span>
      <ChevronRight className="h-4 w-4" />
    </button>
  ) : (
    <button
      type="button"
      onClick={() => {
        console.log('Submit button clicked, isSubmitting:', isSubmitting);
        submitForm();
      }}
      disabled={isSubmitting}
      className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Submitting...</span>
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
          <span>Submit Application</span>
        </>
      )}
    </button>
  )}


               
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default ApplicationWizard;