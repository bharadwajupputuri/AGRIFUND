import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { Search, Calendar, MapPin, Crop, TrendingUp } from 'lucide-react';

interface ProgressUpdate {
  loanId: string;
  loanPurpose: string;
  cropType: string;
  farmerName: string;
  farmerLocation: string;
  currentStage: string;
  progressPercentage: number;
  latestUpdate: {
    title: string;
    description: string;
    stage: string;
    date: string;
    photoCount: number;
  };
  totalUpdates: number;
}

const ProgressUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [cropFilter, setCropFilter] = useState('all');

  useEffect(() => {
    const fetchProgressUpdates = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/progress/investor/updates', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        const result = await response.json();
        
        if (result.success) {
          setUpdates(result.data);
          setFilteredUpdates(result.data);
        }
      } catch (error) {
        console.error('Error fetching progress updates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressUpdates();
  }, []);

  useEffect(() => {
    let filtered = updates;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(update =>
        update.loanPurpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.cropType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter(update => update.latestUpdate.stage === stageFilter);
    }

    // Apply crop filter
    if (cropFilter !== 'all') {
      filtered = filtered.filter(update => update.cropType === cropFilter);
    }

    setFilteredUpdates(filtered);
  }, [updates, searchTerm, stageFilter, cropFilter]);

  const getStageInfo = (stage: string) => {
    const stages = {
      'land_preparation': { label: 'Land Preparation', color: 'bg-yellow-100 text-yellow-800' },
      'sowing': { label: 'Sowing', color: 'bg-blue-100 text-blue-800' },
      'germination': { label: 'Germination', color: 'bg-green-100 text-green-800' },
      'vegetative': { label: 'Vegetative Growth', color: 'bg-emerald-100 text-emerald-800' },
      'flowering': { label: 'Flowering', color: 'bg-pink-100 text-pink-800' },
      'fruiting': { label: 'Fruiting', color: 'bg-orange-100 text-orange-800' },
      'harvesting': { label: 'Harvesting', color: 'bg-red-100 text-red-800' },
      'post_harvest': { label: 'Post Harvest', color: 'bg-purple-100 text-purple-800' }
    };
    return stages[stage as keyof typeof stages] || { label: stage, color: 'bg-gray-100 text-gray-800' };
  };

  const getUniqueCrops = () => {
    const crops = updates.map(update => update.cropType);
    return [...new Set(crops)];
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Updates</h1>
          <p className="text-gray-600 mt-1">
            Latest farming progress from your investments
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by loan purpose, farmer, or crop..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Stage Filter */}
            <div>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Stages</option>
                <option value="land_preparation">Land Preparation</option>
                <option value="sowing">Sowing</option>
                <option value="germination">Germination</option>
                <option value="vegetative">Vegetative Growth</option>
                <option value="flowering">Flowering</option>
                <option value="fruiting">Fruiting</option>
                <option value="harvesting">Harvesting</option>
                <option value="post_harvest">Post Harvest</option>
              </select>
            </div>
            
            {/* Crop Filter */}
            <div>
              <select
                value={cropFilter}
                onChange={(e) => setCropFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Crops</option>
                {getUniqueCrops().map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Updates Grid */}
        {filteredUpdates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Updates</h3>
            <p className="text-gray-600 mb-6">
              {updates.length === 0 
                ? "Progress updates will appear here once farmers start posting updates."
                : "No updates match your current filters."
              }
            </p>
            {(searchTerm || stageFilter !== 'all' || cropFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStageFilter('all');
                  setCropFilter('all');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUpdates.map((update, index) => {
              const stageInfo = getStageInfo(update.latestUpdate.stage);
              
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                          {update.loanPurpose}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Crop className="h-3 w-3" />
                          <span>{update.cropType}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageInfo.color}`}>
                        {stageInfo.label}
                      </span>
                    </div>

                    {/* Farmer Info */}
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">
                          {update.farmerName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{update.farmerName}</p>
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{update.farmerLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Latest Update */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {update.latestUpdate.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {update.latestUpdate.description}
                        </p>
                      </div>

                      {/* Progress Info */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(update.latestUpdate.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>{update.latestUpdate.photoCount} 📷</span>
                          <span>•</span>
                          <span>{update.totalUpdates} updates</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{update.progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${update.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProgressUpdates;