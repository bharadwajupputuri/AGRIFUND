const mongoose = require('mongoose');

const progressUpdateSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',
    required: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stage: {
    type: String,
    enum: ['land_preparation', 'sowing', 'germination', 'vegetative', 'flowering', 'fruiting', 'harvesting', 'post_harvest'],
    required: true
  },
  type: {
    type: String,
    enum: ['system', 'farmer'],
    default: 'farmer'
  },
  photos: [{
    type: String // URLs to uploaded photos
  }],
  metrics: {
    plantHeight: Number,
    soilMoisture: Number,
    pestIncidence: String,
    rainfall: Number,
    temperature: Number
  },
  challenges: [String],
  nextSteps: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('ProgressUpdate', progressUpdateSchema);