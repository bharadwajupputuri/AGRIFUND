const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Basic Details
  amount: { type: Number, required: true },
  purpose: { type: String, required: true },
  duration: { type: Number, required: true },
  // Farm Details
  cropType: { type: String, required: true },
  acreage: { type: Number, required: true },
  season: { type: String, required: true },
  expectedYield: { type: Number, required: true },
  // Financial Projections
  expectedMarketPrice: { type: Number, required: true },
  productionCost: { type: Number, required: true },
  expectedProfit: { type: Number, default: 0 },
  // Additional fields
  customPurpose: String,
  customCropType: String,
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'disbursed'],
    default: 'pending'
  },
  // Timestamps
  appliedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: Date,
  disbursedAt: Date,
  // Additional fields for loan details
  interestRate: { type: Number, default: 12 },
  documents: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // ENHANCED: Progress Updates with Crop Stages
  progressUpdates: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    stage: {
      type: String,
      enum: ['land_preparation', 'sowing', 'germination', 'vegetative', 'flowering', 'fruiting', 'harvesting', 'post_harvest'],
      required: true
    },
    photos: [{ 
      url: { type: String, required: true },
      caption: { type: String, default: '' },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    date: {
      type: Date,
      default: Date.now
    },
    metrics: {
      plantHeight: { type: Number }, // in cm
      soilMoisture: { type: Number }, // percentage
      pestIncidence: { type: String, enum: ['none', 'low', 'medium', 'high'] },
      rainfall: { type: Number }, // in mm
      temperature: { type: Number } // in celsius
    },
    challenges: [String], // Array of challenges faced
    nextSteps: [String] // Array of planned next steps
  }],
  // NEW: Current crop stage tracking
  currentStage: {
    type: String,
    enum: ['land_preparation', 'sowing', 'germination', 'vegetative', 'flowering', 'fruiting', 'harvesting', 'post_harvest', 'completed'],
    default: 'land_preparation'
  },
  // NEW: Progress percentage
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  repaymentSchedule: [{
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    },
    paidAt: Date
  }]
}, {
  timestamps: true
});

// Calculate derived fields before saving
loanApplicationSchema.pre('save', function(next) {
  // Calculate expected profit if not provided
  if (!this.expectedProfit && this.expectedYield && this.expectedMarketPrice && this.productionCost) {
    const totalRevenue = this.acreage * this.expectedYield * this.expectedMarketPrice;
    this.expectedProfit = totalRevenue - this.productionCost;
  }
  
  // Ensure documents array is properly formatted
  if (this.documents && Array.isArray(this.documents)) {
    this.documents = this.documents.filter(doc => 
      doc && typeof doc === 'object' && doc.name && doc.url
    );
  }

  // NEW: Calculate progress percentage based on crop stage
  const stageProgress = {
    'land_preparation': 10,
    'sowing': 20,
    'germination': 30,
    'vegetative': 50,
    'flowering': 70,
    'fruiting': 85,
    'harvesting': 95,
    'post_harvest': 100,
    'completed': 100
  };
  
  this.progressPercentage = stageProgress[this.currentStage] || 0;
  
  next();
});

// NEW: Method to add progress update
loanApplicationSchema.methods.addProgressUpdate = function(updateData) {
  this.progressUpdates.push(updateData);
  this.currentStage = updateData.stage; // Update current stage
  return this.save();
};

// NEW: Method to get progress timeline
loanApplicationSchema.methods.getProgressTimeline = function() {
  return this.progressUpdates.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Add index for better query performance
loanApplicationSchema.index({ user: 1, status: 1 });
loanApplicationSchema.index({ appliedAt: -1 });
// NEW: Index for progress tracking
loanApplicationSchema.index({ currentStage: 1 });
loanApplicationSchema.index({ 'progressUpdates.date': -1 });

module.exports = mongoose.model('Loan', loanApplicationSchema);