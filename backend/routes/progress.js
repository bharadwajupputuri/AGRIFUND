const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/progress/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'progress-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// POST /api/progress/:loanId - Add progress update with photos
router.post('/:loanId', auth, upload.array('photos', 10), async (req, res) => {
  try {
    const { loanId } = req.params;
    const { title, description, stage, challenges, nextSteps, metrics } = req.body;

    console.log('🌱 Adding progress update for loan:', loanId);

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    // Check if user owns the loan
    if (loan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Process uploaded photos
    const photoData = req.files ? req.files.map(file => ({
      url: `/uploads/progress/${file.filename}`,
      caption: req.body[`caption_${file.originalname}`] || '',
      uploadedAt: new Date()
    })) : [];

    // Parse metrics if provided
    let parsedMetrics = {};
    if (metrics) {
      try {
        parsedMetrics = typeof metrics === 'string' ? JSON.parse(metrics) : metrics;
      } catch (error) {
        console.log('Invalid metrics format, using empty object');
      }
    }

    const progressUpdate = {
      title,
      description,
      stage,
      photos: photoData,
      metrics: parsedMetrics,
      challenges: Array.isArray(challenges) ? challenges : [challenges].filter(Boolean),
      nextSteps: Array.isArray(nextSteps) ? nextSteps : [nextSteps].filter(Boolean),
      date: new Date()
    };

    await loan.addProgressUpdate(progressUpdate);

    console.log('✅ Progress update added successfully');

    res.json({
      success: true,
      message: 'Progress update added successfully',
      data: {
        update: loan.progressUpdates[loan.progressUpdates.length - 1],
        currentStage: loan.currentStage,
        progressPercentage: loan.progressPercentage
      }
    });

  } catch (error) {
    console.error('❌ Progress update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// GET /api/progress/:loanId - Get all progress updates for a loan
router.get('/:loanId', auth, async (req, res) => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findById(loanId).select('progressUpdates currentStage progressPercentage');
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    // For investors, check if they have invested in this loan
    if (req.user.userType === 'investor') {
      const Investment = require('../models/Investment');
      const investment = await Investment.findOne({
        loan: loanId,
        investor: req.user._id
      });
      
      if (!investment) {
        return res.status(403).json({
          success: false,
          message: 'Access denied - not invested in this loan'
        });
      }
    }

    // For farmers, check ownership
    if (req.user.userType === 'farmer' && loan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const progressData = {
      updates: loan.getProgressTimeline(),
      currentStage: loan.currentStage,
      progressPercentage: loan.progressPercentage,
      totalUpdates: loan.progressUpdates.length
    };

    res.json({
      success: true,
      data: progressData
    });

  } catch (error) {
    console.error('❌ Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// GET /api/progress/investor/updates - Get progress updates for investor's portfolio
router.get('/investor/updates', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'investor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied - investors only'
      });
    }

    const Investment = require('../models/Investment');
    const investments = await Investment.find({ 
      investor: req.user._id,
      status: 'active'
    }).populate('loan');

    const progressUpdates = [];

    for (const investment of investments) {
      const loan = await Loan.findById(investment.loan._id)
        .select('progressUpdates currentStage progressPercentage cropType purpose')
        .populate('user', 'name location');
      
      if (loan && loan.progressUpdates.length > 0) {
        const latestUpdate = loan.progressUpdates[loan.progressUpdates.length - 1];
        progressUpdates.push({
          loanId: loan._id,
          loanPurpose: loan.purpose,
          cropType: loan.cropType,
          farmerName: loan.user.name,
          farmerLocation: loan.user.location,
          currentStage: loan.currentStage,
          progressPercentage: loan.progressPercentage,
          latestUpdate: {
            title: latestUpdate.title,
            description: latestUpdate.description,
            stage: latestUpdate.stage,
            date: latestUpdate.date,
            photoCount: latestUpdate.photos.length
          },
          totalUpdates: loan.progressUpdates.length
        });
      }
    }

    // Sort by most recent update
    progressUpdates.sort((a, b) => new Date(b.latestUpdate.date) - new Date(a.latestUpdate.date));

    res.json({
      success: true,
      data: progressUpdates
    });

  } catch (error) {
    console.error('❌ Investor progress updates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

module.exports = router;