// src/components/LoanApplication/DocumentUploadStep.tsx
import React, { useState, useCallback } from 'react';
import { ErrorMessage } from 'formik';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { StepProps, LoanApplication, Document } from '../../types';

interface UploadedFile {
  file: File;
  preview?: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

const DocumentUploadStep: React.FC<StepProps<LoanApplication>> = ({
  values,
  setFieldValue,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const requiredDocuments = [
    {
      type: 'land_papers',
      title: 'Land Ownership Papers',
      description: 'Land title, lease agreement, or ownership certificate',
      required: true,
    },
    {
      type: 'id_proof',
      title: 'Identity Proof',
      description: 'Aadhaar card, PAN card, or voter ID',
      required: true,
    },
    {
      type: 'bank_statement',
      title: 'Bank Statements',
      description: 'Last 6 months bank statements',
      required: true,
    },
    {
      type: 'other',
      title: 'Additional Documents',
      description: 'Crop insurance, previous loan documents, etc.',
      required: false,
    },
  ];

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleFiles = useCallback(
    (files: File[]) => {
      const validFiles = files.filter((file) => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        return validTypes.includes(file.type) && file.size <= maxSize;
      });

      if (validFiles.length === 0) return;

      const newUploadedFiles: UploadedFile[] = validFiles.map((file) => ({
        file,
        status: 'uploading',
        progress: 0,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));

      setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);

      // Simulate upload progress
      newUploadedFiles.forEach((uploadedFile) => {
        const interval = setInterval(() => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.file === uploadedFile.file ? { ...f, progress: Math.min(f.progress + 10, 100) } : f
            )
          );
        }, 200);

        setTimeout(() => {
          clearInterval(interval);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.file === uploadedFile.file ? { ...f, status: 'success', progress: 100 } : f
            )
          );

          // Convert File to Document and update formik values
          const currentDocuments = values.documents || [];
          const newDocument: Document = {
            id: Date.now().toString(),
            name: uploadedFile.file.name,
            url: URL.createObjectURL(uploadedFile.file),
            type: uploadedFile.file.type,
            uploadedAt: new Date().toISOString(),
          };
          setFieldValue('documents', [...currentDocuments, newDocument]);
        }, 2000);
      });
    },
    [values.documents, setFieldValue]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (fileToRemove: File) => {
      setUploadedFiles((prev) => prev.filter((f) => f.file !== fileToRemove));
      
      // Remove corresponding document from formik values
      const fileNameToRemove = fileToRemove.name;
      const updatedDocuments = (values.documents || []).filter((doc) => doc.name !== fileNameToRemove);
      setFieldValue('documents', updatedDocuments);
      
      // Clean up preview URL
      const fileToClean = uploadedFiles.find(f => f.file === fileToRemove);
      if (fileToClean?.preview) {
        URL.revokeObjectURL(fileToClean.preview);
      }
    },
    [values.documents, setFieldValue, uploadedFiles]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Document Upload</h3>
        <p className="text-sm text-gray-600 mb-6">Please upload the required documents to complete your loan application.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <h4 className="text-sm font-medium text-blue-800 mb-3">📋 Required Documents</h4>
        <div className="space-y-2">
          {requiredDocuments.map((doc) => (
            <div key={doc.type} className="flex items-start space-x-2">
              <div className={`w-2 h-2 rounded-full mt-2 ${doc.required ? 'bg-red-400' : 'bg-gray-400'}`} />
              <div>
                <p className="text-sm font-medium text-blue-900">{doc.title}</p>
                <p className="text-xs text-blue-700">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">Drop files here or click to upload</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files) handleFiles(Array.from(e.target.files));
                }}
              />
            </label>
            <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG up to 5MB each</p>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
          {uploadedFiles.map((uploadedFile, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border">
              <div className="flex-shrink-0">
                {uploadedFile.preview ? (
                  <img src={uploadedFile.preview} alt="Preview" className="w-10 h-10 object-cover rounded" />
                ) : (
                  <File className="w-10 h-10 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.file.size)}</p>

                {uploadedFile.status === 'uploading' && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadedFile.progress}%` }} 
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{uploadedFile.progress}%</p>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 flex items-center space-x-2">
                {uploadedFile.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {uploadedFile.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                <button 
                  type="button" 
                  onClick={() => removeFile(uploadedFile.file)} 
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ErrorMessage name="documents">
        {(msg: string) => <div className="text-sm text-red-600 mt-2">{msg}</div>}
      </ErrorMessage>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">📝 Upload Guidelines</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Ensure all documents are clear and readable</li>
          <li>• Upload original or certified copies only</li>
          <li>• File size should not exceed 5MB per document</li>
          <li>• Supported formats: PDF, JPG, PNG</li>
          <li>• All required documents must be uploaded to proceed</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUploadStep;