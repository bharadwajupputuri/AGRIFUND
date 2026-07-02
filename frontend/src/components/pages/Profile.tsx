import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import { FarmerProfile } from '../types';
import { User, MapPin, TrendingUp, Tractor, Building, CreditCard as Edit, Save, X, Plus, Trash2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<FarmerProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await farmerAPI.getProfile();
        
        // Mock profile data for now
        const mockProfile: FarmerProfile = {
          farmingExperience: 5,
          creditScore: 720,
          landDetails: {
            totalAcreage: 25,
            landType: 'Agricultural',
            location: 'Rural Area, Karnataka',
            ownershipType: 'owned'
          },
          cropHistory: [
            {
              crop: 'Wheat',
              season: 'Rabi',
              yield: 3500,
              year: 2023
            },
            {
              crop: 'Sugarcane',
              season: 'Year-round',
              yield: 80000,
              year: 2022
            }
          ],
          equipment: [
            {
              name: 'Tractor',
              type: 'Heavy Equipment',
              condition: 'good'
            },
            {
              name: 'Harvester',
              type: 'Harvesting Equipment',
              condition: 'excellent'
            }
          ],
          bankDetails: {
            accountNumber: 'XXXXXX7890',
            bankName: 'State Bank of India',
            ifscCode: 'SBIN0001234'
          }
        };
        
        setProfile(mockProfile);
        setEditedProfile(mockProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!editedProfile) return;
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // await farmerAPI.updateProfile(editedProfile);
      
      setProfile(editedProfile);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setEditing(false);
  };

  const addCropHistory = () => {
    if (!editedProfile) return;
    
    const newCrop = {
      crop: '',
      season: '',
      yield: 0,
      year: new Date().getFullYear()
    };
    
    setEditedProfile({
      ...editedProfile,
      cropHistory: [...editedProfile.cropHistory, newCrop]
    });
  };

  const removeCropHistory = (index: number) => {
    if (!editedProfile) return;
    
    const updatedHistory = editedProfile.cropHistory.filter((_, i) => i !== index);
    setEditedProfile({
      ...editedProfile,
      cropHistory: updatedHistory
    });
  };

  const addEquipment = () => {
    if (!editedProfile) return;
    
    const newEquipment = {
      name: '',
      type: '',
      condition: 'good' as const
    };
    
    setEditedProfile({
      ...editedProfile,
      equipment: [...editedProfile.equipment, newEquipment]
    });
  };

  const removeEquipment = (index: number) => {
    if (!editedProfile) return;
    
    const updatedEquipment = editedProfile.equipment.filter((_, i) => i !== index);
    setEditedProfile({
      ...editedProfile,
      equipment: updatedEquipment
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          </div>
          <div className="grid gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile || !editedProfile) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Profile not found</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Farmer Profile</h1>
            <p className="text-gray-600 mt-1">Manage your farming profile and credentials</p>
          </div>
          <div className="flex space-x-2">
            {editing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Farming Experience (years)</label>
              <input
                type="number"
                value={editedProfile.farmingExperience}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  farmingExperience: parseInt(e.target.value) || 0
                })}
                disabled={!editing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credit Score</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={editedProfile.creditScore}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  editedProfile.creditScore >= 750 ? 'bg-green-100 text-green-800' :
                  editedProfile.creditScore >= 650 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {editedProfile.creditScore >= 750 ? 'Excellent' :
                   editedProfile.creditScore >= 650 ? 'Good' : 'Fair'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Land Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <MapPin className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Land Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Acreage</label>
              <input
                type="number"
                value={editedProfile.landDetails.totalAcreage}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  landDetails: {
                    ...editedProfile.landDetails,
                    totalAcreage: parseFloat(e.target.value) || 0
                  }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Land Type</label>
              <input
                type="text"
                value={editedProfile.landDetails.landType}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  landDetails: {
                    ...editedProfile.landDetails,
                    landType: e.target.value
                  }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={editedProfile.landDetails.location}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  landDetails: {
                    ...editedProfile.landDetails,
                    location: e.target.value
                  }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ownership Type</label>
              <select
                value={editedProfile.landDetails.ownershipType}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  landDetails: {
                    ...editedProfile.landDetails,
                    ownershipType: e.target.value as 'owned' | 'leased' | 'shared'
                  }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                }`}
              >
                <option value="owned">Owned</option>
                <option value="leased">Leased</option>
                <option value="shared">Shared</option>
              </select>
            </div>
          </div>
        </div>

        {/* Crop History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Crop History</h2>
            </div>
            {editing && (
              <button
                onClick={addCropHistory}
                className="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Crop</span>
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {editedProfile.cropHistory.map((crop, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                  <input
                    type="text"
                    value={crop.crop}
                    onChange={(e) => {
                      const updatedHistory = [...editedProfile.cropHistory];
                      updatedHistory[index].crop = e.target.value;
                      setEditedProfile({
                        ...editedProfile,
                        cropHistory: updatedHistory
                      });
                    }}
                    disabled={!editing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                  <input
                    type="text"
                    value={crop.season}
                    onChange={(e) => {
                      const updatedHistory = [...editedProfile.cropHistory];
                      updatedHistory[index].season = e.target.value;
                      setEditedProfile({
                        ...editedProfile,
                        cropHistory: updatedHistory
                      });
                    }}
                    disabled={!editing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yield (kg/acre)</label>
                  <input
                    type="number"
                    value={crop.yield}
                    onChange={(e) => {
                      const updatedHistory = [...editedProfile.cropHistory];
                      updatedHistory[index].yield = parseFloat(e.target.value) || 0;
                      setEditedProfile({
                        ...editedProfile,
                        cropHistory: updatedHistory
                      });
                    }}
                    disabled={!editing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={crop.year}
                    onChange={(e) => {
                      const updatedHistory = [...editedProfile.cropHistory];
                      updatedHistory[index].year = parseInt(e.target.value) || 0;
                      setEditedProfile({
                        ...editedProfile,
                        cropHistory: updatedHistory
                      });
                    }}
                    disabled={!editing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
                {editing && (
                  <div className="flex items-end">
                    <button
                      onClick={() => removeCropHistory(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Tractor className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Equipment Inventory</h2>
            </div>
            {editing && (
              <button
                onClick={addEquipment}
                className="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Equipment</span>
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {editedProfile.equipment.map((equipment, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={equipment.name}
                    onChange={(e) => {
                      const updatedEquipment = [...editedProfile.equipment];
                      updatedEquipment[index].name = e.target.value;
                      setEditedProfile({
                        ...editedProfile,
                        equipment: updatedEquipment
                      });
                    }}
                    disabled={!editing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input
                    type="text"
                    value={equipment.type}
                    onChange={(e) => {
                      const updatedEquipment = [...editedProfile.equipment];
                      updatedEquipment[index].type = e.target.value;
                      setEditedProfile({
                        ...editedProfile,
                        equipment: updatedEquipment
                      });
                    }}
                    disabled={!editing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select
                    value={equipment.condition}
                    onChange={(e) => {
                      const updatedEquipment = [...editedProfile.equipment];
                      updatedEquipment[index].condition = e.target.value as 'excellent' | 'good' | 'fair' | 'poor';
                      setEditedProfile({
                        ...editedProfile,
                        equipment: updatedEquipment
                      });
                    }}
                    disabled={!editing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                      editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                {editing && (
                  <div className="flex items-end">
                    <button
                      onClick={() => removeEquipment(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Building className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Bank Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                value={editedProfile.bankDetails.accountNumber}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  bankDetails: {
                    ...editedProfile.bankDetails,
                    accountNumber: e.target.value
                  }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
              <input
                type="text"
                value={editedProfile.bankDetails.bankName}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  bankDetails: {
                    ...editedProfile.bankDetails,
                    bankName: e.target.value
                  }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
              <input
                type="text"
                value={editedProfile.bankDetails.ifscCode}
                onChange={(e) => setEditedProfile({
                  ...editedProfile,
                  bankDetails: {
                    ...editedProfile.bankDetails,
                    ifscCode: e.target.value
                  }
                })}
                disabled={!editing}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  editing ? 'bg-white' : 'bg-gray-50 text-gray-600'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;