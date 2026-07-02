import React, { useState } from 'react';
import { Calendar, Camera, ChevronDown, ChevronUp, Sprout, Droplets, Bug, Thermometer } from 'lucide-react';

interface ProgressUpdate {
  _id: string;
  title: string;
  description: string;
  stage: string;
  photos: Array<{
    url: string;
    caption: string;
    uploadedAt: string;
  }>;
  date: string;
  metrics?: {
    plantHeight?: number;
    soilMoisture?: number;
    pestIncidence?: string;
    rainfall?: number;
    temperature?: number;
  };
  challenges?: string[];
  nextSteps?: string[];
}

interface ProgressTimelineProps {
  updates: ProgressUpdate[];
  loanId: string;
  showAddButton?: boolean;
  onAddUpdate?: () => void;
}

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  updates,
  showAddButton = false,
  onAddUpdate
}) => {
  const [expandedUpdate, setExpandedUpdate] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getStageInfo = (stage: string) => {
    const stages = {
      'land_preparation': { label: 'Land Preparation', color: 'bg-yellow-100 text-yellow-800', icon: '🛠️' },
      'sowing': { label: 'Sowing', color: 'bg-blue-100 text-blue-800', icon: '🌱' },
      'germination': { label: 'Germination', color: 'bg-green-100 text-green-800', icon: '🌿' },
      'vegetative': { label: 'Vegetative Growth', color: 'bg-emerald-100 text-emerald-800', icon: '🌳' },
      'flowering': { label: 'Flowering', color: 'bg-pink-100 text-pink-800', icon: '🌸' },
      'fruiting': { label: 'Fruiting', color: 'bg-orange-100 text-orange-800', icon: '🍅' },
      'harvesting': { label: 'Harvesting', color: 'bg-red-100 text-red-800', icon: '✂️' },
      'post_harvest': { label: 'Post Harvest', color: 'bg-purple-100 text-purple-800', icon: '📦' }
    };
    return stages[stage as keyof typeof stages] || { label: stage, color: 'bg-gray-100 text-gray-800', icon: '📝' };
  };

  const getPestLevelColor = (level: string) => {
    const colors = {
      'none': 'text-green-600 bg-green-50',
      'low': 'text-yellow-600 bg-yellow-50',
      'medium': 'text-orange-600 bg-orange-50',
      'high': 'text-red-600 bg-red-50'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpand = (updateId: string) => {
    setExpandedUpdate(expandedUpdate === updateId ? null : updateId);
  };

  if (updates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sprout className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Updates Yet</h3>
        <p className="text-gray-600 mb-6">Progress updates will appear here once added.</p>
        {showAddButton && onAddUpdate && (
          <button
            onClick={onAddUpdate}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Add First Update
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="space-y-8">
        {updates.map((update, index) => {
          const stageInfo = getStageInfo(update.stage);
          const isExpanded = expandedUpdate === update._id;
          const hasMetrics = update.metrics && Object.keys(update.metrics).length > 0;
          const hasChallenges = update.challenges && update.challenges.length > 0;
          const hasNextSteps = update.nextSteps && update.nextSteps.length > 0;

          return (
            <div key={update._id} className="relative">
              {/* Timeline connector */}
              {index !== updates.length - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-full bg-gray-200"></div>
              )}

              <div className="flex space-x-4">
                {/* Timeline dot */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg">{stageInfo.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  {/* Header */}
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleExpand(update._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{update.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageInfo.color}`}>
                            {stageInfo.label}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {update.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(update.date)}</span>
                          </div>
                          
                          {update.photos.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Camera className="h-4 w-4" />
                              <span>{update.photos.length} photo{update.photos.length !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      {/* Full Description */}
                      <div className="py-4">
                        <p className="text-gray-700 leading-relaxed">{update.description}</p>
                      </div>

                      {/* Metrics */}
                      {hasMetrics && (
                        <div className="py-4 border-t border-gray-100">
                          <h5 className="font-medium text-gray-900 mb-3">Crop Metrics</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {update.metrics!.plantHeight && (
                              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                                <Sprout className="h-4 w-4 text-blue-600" />
                                <div>
                                  <p className="text-xs text-gray-600">Plant Height</p>
                                  <p className="font-semibold text-sm">{update.metrics!.plantHeight} cm</p>
                                </div>
                              </div>
                            )}
                            
                            {update.metrics!.soilMoisture && (
                              <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                                <Droplets className="h-4 w-4 text-green-600" />
                                <div>
                                  <p className="text-xs text-gray-600">Soil Moisture</p>
                                  <p className="font-semibold text-sm">{update.metrics!.soilMoisture}%</p>
                                </div>
                              </div>
                            )}
                            
                            {update.metrics!.pestIncidence && (
                              <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                                <Bug className="h-4 w-4 text-orange-600" />
                                <div>
                                  <p className="text-xs text-gray-600">Pest Level</p>
                                  <p className={`text-xs font-semibold px-2 py-1 rounded-full ${getPestLevelColor(update.metrics!.pestIncidence!)}`}>
                                    {update.metrics!.pestIncidence?.replace('_', ' ')}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {update.metrics!.temperature && (
                              <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                                <Thermometer className="h-4 w-4 text-red-600" />
                                <div>
                                  <p className="text-xs text-gray-600">Temperature</p>
                                  <p className="font-semibold text-sm">{update.metrics!.temperature}°C</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Challenges */}
                      {hasChallenges && (
                        <div className="py-4 border-t border-gray-100">
                          <h5 className="font-medium text-gray-900 mb-2">Challenges Faced</h5>
                          <ul className="space-y-1">
                            {update.challenges!.map((challenge, idx) => (
                              <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                <span>{challenge}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Next Steps */}
                      {hasNextSteps && (
                        <div className="py-4 border-t border-gray-100">
                          <h5 className="font-medium text-gray-900 mb-2">Next Steps</h5>
                          <ul className="space-y-1">
                            {update.nextSteps!.map((step, idx) => (
                              <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Photos */}
                      {update.photos.length > 0 && (
                        <div className="py-4 border-t border-gray-100">
                          <h5 className="font-medium text-gray-900 mb-3">
                            Progress Photos ({update.photos.length})
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {update.photos.map((photo, photoIndex) => (
                              <div
                                key={photoIndex}
                                className="relative group cursor-pointer"
                                onClick={() => setSelectedImage(photo.url)}
                              >
                                <img
                                  src={`http://localhost:5000${photo.url}`}
                                  alt={photo.caption || `Progress photo ${photoIndex + 1}`}
                                  className="w-full h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                                />
                                {photo.caption && (
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all rounded-lg flex items-end p-2">
                                    <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                      {photo.caption}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full">
            <img
              src={`http://localhost:5000${selectedImage}`}
              alt="Progress photo"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTimeline;