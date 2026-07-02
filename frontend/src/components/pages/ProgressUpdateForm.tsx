import React, { useState } from 'react';
import { Camera, Upload, X, Plus, Minus } from 'lucide-react';

interface ProgressUpdateFormProps {
  loanId: string;
  onUpdateSuccess: () => void;
  onCancel: () => void;
}

interface ProgressUpdateData {
  title: string;
  description: string;
  stage: string;
  challenges: string[];
  nextSteps: string[];
  metrics: {
    plantHeight?: number;
    soilMoisture?: number;
    pestIncidence?: string;
    rainfall?: number;
    temperature?: number;
  };
  photos: File[];
}

const ProgressUpdateForm: React.FC<ProgressUpdateFormProps> = ({
  loanId,
  onUpdateSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<ProgressUpdateData>({
    title: '',
    description: '',
    stage: 'land_preparation',
    challenges: [''],
    nextSteps: [''],
    metrics: {},
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const cropStages = [
    { value: 'land_preparation', label: 'Land Preparation', progress: 10 },
    { value: 'sowing', label: 'Sowing', progress: 20 },
    { value: 'germination', label: 'Germination', progress: 30 },
    { value: 'vegetative', label: 'Vegetative Growth', progress: 50 },
    { value: 'flowering', label: 'Flowering', progress: 70 },
    { value: 'fruiting', label: 'Fruiting', progress: 85 },
    { value: 'harvesting', label: 'Harvesting', progress: 95 },
    { value: 'post_harvest', label: 'Post Harvest', progress: 100 }
  ];

  const pestLevels = [
    { value: 'none', label: 'No Pests' },
    { value: 'low', label: 'Low Incidence' },
    { value: 'medium', label: 'Medium Incidence' },
    { value: 'high', label: 'High Incidence' }
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.photos.length > 10) {
      alert('Maximum 10 photos allowed');
      return;
    }

    const newPhotos = [...formData.photos, ...files];
    setFormData(prev => ({ ...prev, photos: newPhotos }));

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    
    setFormData(prev => ({ ...prev, photos: newPhotos }));
    setPhotoPreviews(newPreviews);
  };

  const addChallenge = () => {
    setFormData(prev => ({
      ...prev,
      challenges: [...prev.challenges, '']
    }));
  };

  const removeChallenge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges.filter((_, i) => i !== index)
    }));
  };

  const updateChallenge = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges.map((challenge, i) => i === index ? value : challenge)
    }));
  };

  const addNextStep = () => {
    setFormData(prev => ({
      ...prev,
      nextSteps: [...prev.nextSteps, '']
    }));
  };

  const removeNextStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      nextSteps: prev.nextSteps.filter((_, i) => i !== index)
    }));
  };

  const updateNextStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      nextSteps: prev.nextSteps.map((step, i) => i === index ? value : step)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('stage', formData.stage);
      formDataToSend.append('challenges', JSON.stringify(formData.challenges.filter(c => c.trim())));
      formDataToSend.append('nextSteps', JSON.stringify(formData.nextSteps.filter(s => s.trim())));
      formDataToSend.append('metrics', JSON.stringify(formData.metrics));

      // Append photos
      formData.photos.forEach(photo => {
        formDataToSend.append('photos', photo);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/progress/${loanId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        onUpdateSuccess();
        // Clean up photo previews
        photoPreviews.forEach(preview => URL.revokeObjectURL(preview));
      } else {
        alert(result.message || 'Failed to add progress update');
      }
    } catch (error) {
      console.error('Error adding progress update:', error);
      alert('Failed to add progress update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Add Progress Update</h2>
          <p className="text-gray-600 mt-1">Share your farming progress with investors</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Seeds Planted Successfully"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Crop Stage *
              </label>
              <select
                required
                value={formData.stage}
                onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {cropStages.map(stage => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label} ({stage.progress}%)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Describe what you've accomplished, any observations, and the current condition of your crops..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Metrics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Crop Metrics (Optional)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Plant Height (cm)</label>
                <input
                  type="number"
                  value={formData.metrics.plantHeight || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    metrics: { ...prev.metrics, plantHeight: e.target.value ? Number(e.target.value) : undefined }
                  }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Height"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Soil Moisture (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.metrics.soilMoisture || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    metrics: { ...prev.metrics, soilMoisture: e.target.value ? Number(e.target.value) : undefined }
                  }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Pest Level</label>
                <select
                  value={formData.metrics.pestIncidence || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    metrics: { ...prev.metrics, pestIncidence: e.target.value }
                  }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select</option>
                  {pestLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Rainfall (mm)</label>
                <input
                  type="number"
                  value={formData.metrics.rainfall || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    metrics: { ...prev.metrics, rainfall: e.target.value ? Number(e.target.value) : undefined }
                  }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="mm"
                />
              </div>
            </div>
          </div>

          {/* Challenges */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Challenges Faced (Optional)
              </label>
              <button
                type="button"
                onClick={addChallenge}
                className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Challenge</span>
              </button>
            </div>
            {formData.challenges.map((challenge, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={challenge}
                  onChange={(e) => updateChallenge(index, e.target.value)}
                  placeholder="Describe a challenge you're facing..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                {formData.challenges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChallenge(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Next Steps */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Planned Next Steps (Optional)
              </label>
              <button
                type="button"
                onClick={addNextStep}
                className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Step</span>
              </button>
            </div>
            {formData.nextSteps.map((step, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => updateNextStep(index, e.target.value)}
                  placeholder="What's your next action plan?"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                {formData.nextSteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeNextStep(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress Photos ({formData.photos.length}/10)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Camera className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">Click to upload photos</span>
                <span className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB each</span>
              </label>
            </div>

            {/* Photo Previews */}
            {photoPreviews.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.description}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span>{loading ? 'Uploading...' : 'Add Progress Update'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgressUpdateForm;