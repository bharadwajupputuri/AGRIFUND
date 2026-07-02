import React, { useState, useEffect } from 'react';
import { X, MapPin, User, FileText, Download, Eye, CheckCircle, Calendar } from 'lucide-react';
import { FarmerProfile } from '../types/investor';
import { investorAPI, FarmerDocument } from '../services/investorAPI';

interface FarmerDetailsModalProps {
  farmerId: string;
  loanId: string;
  onClose: () => void;
  isOpen?: boolean;
}

const FarmerDetailsModal: React.FC<FarmerDetailsModalProps> = ({ farmerId, loanId, onClose, isOpen = true }) => {
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [documents, setDocuments] = useState<FarmerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'documents' | 'history'>('profile');

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        setLoading(true);
        
        // Fetch farmer profile
        const profileResponse = await investorAPI.getFarmerProfile(farmerId);
        if (profileResponse.success && profileResponse.data) {
          setFarmer(profileResponse.data);
        }

        // Fetch farmer documents for this loan
        await fetchFarmerDocuments();
      } catch (error) {
        console.error('Error fetching farmer details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchFarmerData();
    }
  }, [farmerId, loanId, isOpen]);

  const fetchFarmerDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const response = await investorAPI.getFarmerDocuments(farmerId, loanId);
      if (response.success && response.data) {
        setDocuments(response.data);
      }
    } catch (error) {
      console.error('Error fetching farmer documents:', error);
    } finally {
      setDocumentsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleViewDocument = (documentUrl: string) => {
    window.open(documentUrl, '_blank');
  };

  const handleDownloadDocument = async (doc: FarmerDocument) => {
    try {
      const response = await fetch(doc.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const getDocumentIcon = (type: string) => {
    const docTypes: { [key: string]: string } = { 
      'landPapers': '🏠',
      'identityProof': '🆔', 
      'bankStatements': '💳',
      'incomeProof': '💰',
      'cropPlan': '🌱',
      'other': '📄'
    };
    return docTypes[type] || '📄';
  };

  const getDocumentCategory = (type: string) => {
    const categories: { [key: string]: string } = {
      'landPapers': 'Land Documents',
      'identityProof': 'Identity Proof',
      'bankStatements': 'Financial Documents',
      'incomeProof': 'Income Proof',
      'cropPlan': 'Farming Plan',
      'other': 'Other Documents'
    };
    return categories[type] || 'Other Documents';
  };

  // Group documents by type
  const groupedDocuments = documents.reduce((acc, d) => {
    const category = getDocumentCategory(d.type);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(d);
    return acc;
  }, {} as { [key: string]: FarmerDocument[] });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="text-center">
            <p className="text-gray-600">Failed to load farmer details</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{farmer.name}</h2>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{farmer.location?.village}, {farmer.location?.district}, {farmer.location?.state}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile & Experience
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Documents & Verification
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Crop History
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && <ProfileTab farmer={farmer} />}
          {activeTab === 'documents' && (
            <DocumentsTab 
              documents={documents} 
              groupedDocuments={groupedDocuments}
              loading={documentsLoading}
              onViewDocument={handleViewDocument}
              onDownloadDocument={handleDownloadDocument}
              getDocumentIcon={getDocumentIcon}
            />
          )}
          {activeTab === 'history' && <HistoryTab farmer={farmer} />}
        </div>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab: React.FC<{ farmer: FarmerProfile }> = ({ farmer }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Experience:</span>
            <span className="font-medium">{farmer.farmingExperience || 'Not specified'} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{farmer.email || 'Not provided'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{farmer.phone || 'Not provided'}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Land Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Acreage:</span>
            <span className="font-medium">{farmer.landDetails?.totalAcreage || 'Not specified'} acres</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Land Type:</span>
            <span className="font-medium">{farmer.landDetails?.landType || 'Not specified'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ownership:</span>
            <span className="font-medium">{farmer.landDetails?.ownershipType || 'Not specified'}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Credit History</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{farmer.creditScore || 'N/A'}</div>
          <div className="text-sm text-gray-600">Credit Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{farmer.loanHistory?.successfulLoans || 0}</div>
          <div className="text-sm text-gray-600">Successful Loans</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{farmer.loanHistory?.repaymentRate || 0}%</div>
          <div className="text-sm text-gray-600">Repayment Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{farmer.loanHistory?.defaultedLoans || 0}</div>
          <div className="text-sm text-gray-600">Defaults</div>
        </div>
      </div>
    </div>
  </div>
);

// Documents Tab Component
const DocumentsTab: React.FC<{
  documents: FarmerDocument[];
  groupedDocuments: { [key: string]: FarmerDocument[] };
  loading: boolean;
  onViewDocument: (url: string) => void;
  onDownloadDocument: (document: FarmerDocument) => void;
  getDocumentIcon: (type: string) => string;
}> = ({ documents, groupedDocuments, loading, onViewDocument, onDownloadDocument, getDocumentIcon }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-20 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
        <p className="text-gray-600">This farmer hasn't uploaded any documents yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Verification Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-700">Identity Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-700">Land Ownership</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-700">Bank Details</span>
          </div>
        </div>
      </div>

      {/* Documents by Category */}
      {Object.entries(groupedDocuments).map(([category, categoryDocs]) => (
        <div key={category} className="border rounded-lg">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-900">{category}</h3>
          </div>
          <div className="divide-y">
            {categoryDocs.map((document) => (
              <div key={document._id} className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getDocumentIcon(document.type)}</span>
                  <div>
                    <div className="font-medium text-gray-900">{document.name}</div>
                    <div className="text-sm text-gray-600">
                      Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    document.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {document.verified ? 'Verified' : 'Pending'}
                  </span>
                  <button
                    onClick={() => onViewDocument(document.url)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="View Document"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDownloadDocument(document)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Download Document"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// History Tab Component
const HistoryTab: React.FC<{ farmer: FarmerProfile }> = ({ farmer }) => (
  <div className="space-y-6">
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Crop History</h3>
      <div className="space-y-4">
        {(farmer.cropHistory || []).map((crop, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">{crop.crop}</div>
                <div className="text-sm text-gray-600">{crop.season} {crop.year}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">{crop.yield} kg/acre</div>
              <div className={`text-sm ${crop.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{Math.abs(crop.profit).toLocaleString()} {crop.profit >= 0 ? 'profit' : 'loss'}
              </div>
            </div>
          </div>
        ))}
        {(!farmer.cropHistory || farmer.cropHistory.length === 0) && (
          <div className="text-center py-4 text-gray-500">
            No crop history available
          </div>
        )}
      </div>
    </div>

    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Equipment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(farmer.equipment || []).map((equip, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div>
              <div className="font-medium text-gray-900">{equip.name}</div>
              <div className="text-sm text-gray-600">{equip.type}</div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              equip.condition === 'good' ? 'bg-green-100 text-green-800' :
              equip.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {equip.condition}
            </span>
          </div>
        ))}
        {(!farmer.equipment || farmer.equipment.length === 0) && (
          <div className="col-span-2 text-center py-4 text-gray-500">
            No equipment information available
          </div>
        )}
      </div>
    </div>
  </div>
);

export default FarmerDetailsModal;