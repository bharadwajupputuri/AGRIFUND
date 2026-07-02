import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { InvestorProfile as InvestorProfileType } from '../types/investor';
import { investorAPI } from '../services/investorAPI';
import {  Mail,  Shield, CheckCircle, Edit, Save, X } from 'lucide-react';

const InvestorProfile: React.FC = () => {
  const [profile, setProfile] = useState<InvestorProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<InvestorProfileType>>({});
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await investorAPI.getProfile();
        if (response.success) {
          setProfile(response.data);
          setFormData(response.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const response = await investorAPI.updateProfile(formData);
      if (response.success) {
        setProfile(response.data);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setEditing(false);
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investor Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal and investment preferences</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile?.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{profile?.email}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investment Capacity</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.investmentCapacity || ''}
                      onChange={(e) => setFormData({ ...formData, investmentCapacity: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">₹{profile?.investmentCapacity?.toLocaleString()}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Risk Tolerance</label>
                  {editing ? (
                    <select
                      value={formData.riskTolerance || 'medium'}
                      onChange={(e) => setFormData({ ...formData, riskTolerance: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 capitalize">{profile?.riskTolerance}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Investment Preferences */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Investment Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Crop Types</label>
                  {editing ? (
                    <div className="space-y-2">
                      {['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Vegetables', 'Fruits'].map((crop) => (
                        <label key={crop} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={(formData.preferredCrops || []).includes(crop)}
                            onChange={(e) => {
                              const current = formData.preferredCrops || [];
                              const newCrops = e.target.checked
                                ? [...current, crop]
                                : current.filter(c => c !== crop);
                              setFormData({ ...formData, preferredCrops: newCrops });
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{crop}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile?.preferredCrops?.map((crop) => (
                        <span key={crop} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {crop}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Regions</label>
                  {editing ? (
                    <div className="space-y-2">
                      {['Punjab', 'Haryana', 'Maharashtra', 'Karnataka', 'Tamil Nadu'].map((region) => (
                        <label key={region} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={(formData.preferredRegions || []).includes(region)}
                            onChange={(e) => {
                              const current = formData.preferredRegions || [];
                              const newRegions = e.target.checked
                                ? [...current, region]
                                : current.filter(r => r !== region);
                              setFormData({ ...formData, preferredRegions: newRegions });
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{region}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile?.preferredRegions?.map((region) => (
                        <span key={region} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {region}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Verification Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVerificationStatusColor(profile?.verificationStatus || 'pending')}`}>
                    {profile?.verificationStatus ? (
  profile.verificationStatus.charAt(0).toUpperCase() + profile.verificationStatus.slice(1)
) : (
  'Pending'
)}
                  </span>
                </div>
                {profile?.kycDocuments && Object.entries(profile.kycDocuments).map(([doc, status]) => (
                  <div key={doc} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{doc.replace(/([A-Z])/g, ' $1')}</span>
                    {status === 'verified' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Shield className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Invested</span>
                  <span className="text-sm font-medium text-gray-900">₹{profile?.totalInvested?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Investments</span>
                  <span className="text-sm font-medium text-gray-900">{profile?.activeInvestments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average ROI</span>
                  <span className="text-sm font-medium text-green-600">{profile?.averageROI}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InvestorProfile;