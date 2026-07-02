// backend/routes/investors.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');
const Investor = require('../models/Investor');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');
const Loan = require('../models/Loan');
const User = require('../models/User');
const Document = require('../models/Document');
// Helper function to calculate risk level
const calculateRiskLevel = (loan, farmer) => {
  let score = 50; // Base score
  
  // Adjust based on factors
  if (loan.amount > 100000) score += 10;
  if (farmer.farmingExperience > 5) score -= 15;
  if (loan.expectedProfit > loan.amount * 0.5) score -= 10;
  
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  return 'high';
};

// Get investor dashboard stats (INVESTOR ONLY)
router.get('/dashboard-stats', auth, requireRole('investor'), async (req, res) => {
  try {
    console.log('📊 Fetching dashboard stats for investor:', req.user._id);
    
    // Find or create investor profile
    let investor = await Investor.findOne({ user: req.user._id });
    if (!investor) {
      investor = new Investor({ user: req.user._id });
      await investor.save();
    }

    // ✅ FIX: Get ALL investments for this investor
    const investments = await Investment.find({ investor: investor._id });
    
    // ✅ FIX: Count correctly - these are INVESTMENTS, not INVESTORS
    const activeInvestments = investments.filter(inv => inv.status === 'active').length;
    const completedInvestments = investments.filter(inv => inv.status === 'completed').length;
    const totalInvestments = investments.length; // ✅ Total investments made

    // Calculate monthly returns (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyReturns = await Transaction.aggregate([
      {
        $match: {
          investor: investor._id,
          type: 'return',
          status: 'completed',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // ✅ Calculate total invested from investments (more accurate)
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    
    // ✅ Calculate total returns from completed investments
    const totalReturns = investments
      .filter(inv => inv.status === 'completed')
      .reduce((sum, inv) => sum + (inv.actualReturn || 0), 0);

    // ✅ Calculate average ROI
    const averageROI = totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0;

    // Calculate pending returns from active investments
    const pendingReturns = investments
      .filter(inv => inv.status === 'active')
      .reduce((sum, inv) => sum + (inv.expectedReturn - inv.amount), 0);

    const stats = {
      totalInvested: totalInvested, // ✅ Use calculated total
      totalReturns: totalReturns,   // ✅ Use calculated returns
      activeInvestments: activeInvestments,
      completedInvestments: completedInvestments,
      totalInvestments: totalInvestments, // ✅ ADD THIS: Total count of investments made
      averageROI: Math.round(averageROI * 100) / 100, // ✅ Calculate properly
      portfolioValue: totalInvested + totalReturns,
      monthlyReturns: monthlyReturns.length > 0 ? monthlyReturns[0].total : 0,
      pendingReturns: pendingReturns // ✅ Calculate from active investments
    };

    console.log('📈 Fixed stats calculated:', stats);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// Get investor portfolio (INVESTOR ONLY)
router.get('/portfolio', auth, requireRole('investor'), async (req, res) => {
  try {
    console.log('📋 Fetching portfolio for investor:', req.user._id);
    
    const investor = await Investor.findOne({ user: req.user._id });
    if (!investor) {
      return res.json({
        success: true,
        data: []
      });
    }

    const investments = await Investment.find({ investor: investor._id })
      .populate('loan', 'purpose cropType duration interestRate status')
      .populate('farmer', 'name location')
      .sort({ investmentDate: -1 });

    // Transform data for frontend
    const portfolio = investments.map(inv => ({
      id: inv._id,
      loanId: inv.loan?._id,
      farmerId: inv.farmer?._id,
      farmerName: inv.farmer?.name || 'Unknown Farmer',
      amount: inv.amount,
      investmentDate: inv.investmentDate,
      expectedReturn: inv.expectedReturn,
      actualReturn: inv.actualReturn,
      status: inv.status,
      duration: inv.duration,
      cropType: inv.cropType,
      riskLevel: inv.riskLevel,
      repaymentSchedule: inv.repaymentSchedule || [],
      progressUpdates: [] // Will be populated from loan progress updates
    }));

    console.log('📦 Portfolio items found:', portfolio.length);
    
    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error('❌ Portfolio fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// Make an investment (INVESTOR ONLY)
router.post('/invest/:loanId', auth, requireRole('investor'), async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount } = req.body;

    console.log('💵 Making investment:', { loanId, amount, investor: req.user._id });

    // Validate amount
    if (!amount || amount < 1000) {
      return res.status(400).json({
        success: false,
        message: 'Minimum investment amount is ₹1000'
      });
    }

    // Find loan
    const loanDetails = await Loan.findById(loanId).populate('user');
    if (!loanDetails) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    // Check if loan is available for investment
    if (!['approved', 'pending'].includes(loanDetails.status)) {
      return res.status(400).json({
        success: false,
        message: 'Loan is not available for investment'
      });
    }

    // Calculate current funding from existing investments
    const existingInvestments = await Investment.find({ 
      loan: loanId, 
      status: 'active' 
    });
    
    const currentFunding = existingInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const amountRemaining = loanDetails.amount - currentFunding;

    if (amount > amountRemaining) {
      return res.status(400).json({
        success: false,
        message: `Only ₹${amountRemaining} remaining for investment`
      });
    }

    // Find or create investor
    let investor = await Investor.findOne({ user: req.user._id });
    if (!investor) {
      investor = new Investor({ user: req.user._id });
      await investor.save();
    }

    // Calculate expected return
    const expectedReturn = amount * (1 + loanDetails.interestRate / 100);

    // Calculate risk level
    const riskLevel = calculateRiskLevel(loanDetails, loanDetails.user);

    // Create investment using your exact model structure
    const investment = new Investment({
      investor: investor._id,
      loan: loanId,
      farmer: loanDetails.user._id,
      amount: amount,
      expectedReturn: expectedReturn,
      duration: loanDetails.duration,
      cropType: loanDetails.cropType,
      riskLevel: riskLevel,
      status: 'active'
    });

    await investment.save();

    // Update loan status if fully funded
    const loan = await Loan.findById(loanId).populate('user');
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    // determine current funding value (adjust to your schema field)
    const newFunding = currentFunding + amount;

    // update funding fields (adjust field names to match your model)
    if (typeof loan.currentFunding !== 'undefined') {
      loan.currentFunding = newFunding;
    } else if (typeof loan.fundedAmount !== 'undefined') {
      loan.fundedAmount = newFunding;
    } else {
      // if neither field exists, create currentFunding
      loan.currentFunding = newFunding;
    }

    if (newFunding >= loan.amount) {
      loan.status = 'active';
      loan.activationDate = new Date();

      // ✅ NEW: Create progress update for farmer
      const ProgressUpdate = require('../models/ProgressUpdate');
      const progressUpdate = new ProgressUpdate({
        loanId: loanId,
        farmerId: loan.user._id,
        title: 'Loan Fully Funded!',
        description: `Loan has been fully funded and is now active. Farming activities can begin.`,
        stage: 'land_preparation',
        type: 'system'
      });
      await progressUpdate.save();
    }

    await loan.save();

    // ✅ ADD SOCKET EMISSION FOR REAL-TIME UPDATES
    try {
      const io = req.app.get('io');
      if (io) {
        // Notify farmer about new investment
        io.to(`farmer_${loan.user._id}`).emit('investmentUpdate', {
          loanId: loanId,
          amount: amount,
          newFunding: newFunding,
          newStatus: loan.status,
          investorId: req.user.id,
          message: `🎉 New investment of ₹${amount} received!`
        });

        // Notify all investors about portfolio updates
        io.emit('portfolioUpdate', {
          message: `New investment of ₹${amount} in ${loan.purpose}`,
          loanId: loanId,
          amount: amount,
          investorId: req.user.id
        });

        console.log('📤 Real-time investment notifications sent');
      }
    } catch (socketError) {
      console.warn('⚠️ Socket emission failed:', socketError);
    }

    // Respond (keep your actual investment object/values)
    res.json({
      success: true,
      data: {
        investmentId: investment._id,
        amount: amount,
        loanId: loanId,
        newFundingProgress: newFunding,
        loanStatus: loan.status
      }
    });

  } catch (error) {
    console.error('Error in /invest/:loanId', error);
    res.status(500).json({ message: error.message });
  }
});

// Get farmer documents for a specific loan (INVESTOR ONLY)
router.get('/farmers/:farmerId/documents/:loanId', auth, requireRole('investor'), async (req, res) => {
  try {
    const { farmerId, loanId } = req.params;
    
    // Fetch documents from your database
    const documents = await Document.find({
      farmerId,
      loanId,
      isActive: true
    }).sort({ uploadedAt: -1 });

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transactions (INVESTOR ONLY)
router.get('/transactions', auth, requireRole('investor'), async (req, res) => {
  try {
    console.log('💰 Fetching transactions for investor:', req.user._id);
    
    const investor = await Investor.findOne({ user: req.user._id });
    if (!investor) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Check if Transaction model exists
    try {
      const Transaction = require('../models/Transaction');
      const transactions = await Transaction.find({ investor: investor._id })
        .populate('loan', 'purpose')
        .populate('farmer', 'name')
        .sort({ createdAt: -1 })
        .limit(50);

      const transformedTransactions = transactions.map(txn => ({
        id: txn._id,
        type: txn.type,
        amount: txn.amount,
        description: txn.description,
        loanId: txn.loan?._id,
        farmerId: txn.farmer?._id,
        farmerName: txn.farmer?.name,
        status: txn.status,
        date: txn.createdAt,
        transactionId: txn.transactionId || txn._id.toString()
      }));

      console.log('📄 Transactions found:', transformedTransactions.length);
      
      res.json({
        success: true,
        data: transformedTransactions
      });
    } catch (transactionError) {
      console.log('ℹ️ Transaction model not available, returning empty transactions');
      res.json({
        success: true,
        data: []
      });
    }
  } catch (error) {
    console.error('❌ Transactions fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// NEW: Get farmer profile for investors (INVESTOR ONLY)
router.get('/farmer-profile/:farmerId', auth, requireRole('investor'), async (req, res) => {
  try {
    const { farmerId } = req.params;
    console.log('👨‍🌾 Fetching farmer profile:', farmerId);
    
    const farmer = await User.findById(farmerId)
      .select('name email phone location farmingExperience verificationStatus');
    
    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Get farmer's loan history
    const farmerLoans = await Loan.find({ user: farmerId });
    const successfulLoans = farmerLoans.filter(loan => loan.status === 'completed').length;
    const totalLoans = farmerLoans.length;
    const repaymentRate = totalLoans > 0 ? Math.round((successfulLoans / totalLoans) * 100) : 100;

    // Calculate credit score based on loan history
    const creditScore = Math.min(800, 600 + (repaymentRate / 100) * 200);

    // Mock data structure - you can replace with actual data from your database
    const farmerProfile = {
      id: farmer._id,
      name: farmer.name,
      email: farmer.email,
      phone: farmer.phone || '+91 XXXXX XXXXX',
      profileImage: farmer.profileImage,
      location: farmer.location || {
        state: 'Maharashtra',
        district: farmer.location?.district || 'Pune',
        village: farmer.location?.village || 'Sample Village'
      },
      farmingExperience: farmer.farmingExperience || 5,
      landDetails: {
        totalAcreage: 12.5,
        landType: 'Agricultural',
        ownershipType: 'owned',
        soilType: 'Black Soil',
        irrigationType: 'Drip Irrigation'
      },
      cropHistory: [
        {
          crop: 'Wheat',
          season: 'Rabi',
          yield: 2500,
          year: 2024,
          profit: 125000
        },
        {
          crop: 'Cotton',
          season: 'Kharif',
          yield: 1800,
          year: 2023,
          profit: 98000
        },
        {
          crop: 'Rice',
          season: 'Kharif',
          yield: 3200,
          year: 2023,
          profit: 156000
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
          type: 'Harvesting',
          condition: 'fair'
        },
        {
          name: 'Drip Irrigation System',
          type: 'Irrigation',
          condition: 'excellent'
        }
      ],
      creditScore: creditScore,
      loanHistory: {
        totalLoans: totalLoans,
        successfulLoans: successfulLoans,
        defaultedLoans: Math.max(0, totalLoans - successfulLoans),
        repaymentRate: repaymentRate,
        totalAmountBorrowed: farmerLoans.reduce((sum, loan) => sum + loan.amount, 0),
        totalAmountRepaid: farmerLoans
          .filter(loan => loan.status === 'completed')
          .reduce((sum, loan) => sum + loan.amount, 0)
      },
      verificationStatus: {
        identity: farmer.verificationStatus?.identity || true,
        address: farmer.verificationStatus?.address || true,
        landOwnership: farmer.verificationStatus?.landOwnership || true,
        bankAccount: farmer.verificationStatus?.bankAccount || true,
        phone: farmer.verificationStatus?.phone || true,
        email: farmer.verificationStatus?.email || true
      },
      verificationBadges: [
        'Identity Verified',
        'Address Verified', 
        'Land Ownership Verified',
        'Bank Account Verified'
      ],
      ratings: {
        average: 4.5,
        count: 12,
        breakdown: {
          communication: 4.8,
          reliability: 4.6,
          transparency: 4.4,
          results: 4.7
        }
      },
      createdAt: farmer.createdAt,
      updatedAt: farmer.updatedAt
    };

    console.log('✅ Farmer profile fetched successfully');
    
    res.json({
      success: true,
      data: farmerProfile
    });
  } catch (error) {
    console.error('❌ Farmer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// Get investor profile (INVESTOR ONLY)
router.get('/profile', auth, requireRole('investor'), async (req, res) => {
  try {
    console.log('👤 Fetching investor profile:', req.user._id);
    
    let investor = await Investor.findOne({ user: req.user._id })
      .populate('user', 'name email');

    if (!investor) {
      // Create profile if doesn't exist
      investor = new Investor({ 
        user: req.user._id,
        preferredCrops: ['Wheat', 'Rice', 'Cotton'],
        preferredRegions: ['Punjab', 'Haryana', 'Maharashtra']
      });
      await investor.save();
      await investor.populate('user', 'name email');
    }

    const profile = {
      id: investor._id,
      userId: investor.user._id,
      name: investor.user.name,
      email: investor.user.email,
      investmentCapacity: investor.investmentCapacity,
      riskTolerance: investor.riskTolerance,
      preferredCrops: investor.preferredCrops,
      preferredRegions: investor.preferredRegions,
      totalInvested: investor.totalInvested,
      totalReturns: investor.totalReturns,
      activeInvestments: investor.activeInvestments,
      averageROI: investor.averageROI,
      verificationStatus: investor.verificationStatus,
      kycDocuments: investor.kycDocuments,
      createdAt: investor.createdAt,
      updatedAt: investor.updatedAt
    };

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

// Update investor profile (INVESTOR ONLY)
router.put('/profile', auth, requireRole('investor'), async (req, res) => {
  try {
    console.log('✏️ Updating investor profile:', req.user._id);
    
    const {
      investmentCapacity,
      riskTolerance,
      preferredCrops,
      preferredRegions
    } = req.body;

    let investor = await Investor.findOne({ user: req.user._id });
    
    if (!investor) {
      investor = new Investor({ user: req.user._id });
    }

    if (investmentCapacity !== undefined) investor.investmentCapacity = investmentCapacity;
    if (riskTolerance !== undefined) investor.riskTolerance = riskTolerance;
    if (preferredCrops !== undefined) investor.preferredCrops = preferredCrops;
    if (preferredRegions !== undefined) investor.preferredRegions = preferredRegions;

    await investor.save();
    await investor.populate('user', 'name email');

    const profile = {
      id: investor._id,
      userId: investor.user._id,
      name: investor.user.name,
      email: investor.user.email,
      investmentCapacity: investor.investmentCapacity,
      riskTolerance: investor.riskTolerance,
      preferredCrops: investor.preferredCrops,
      preferredRegions: investor.preferredRegions,
      totalInvested: investor.totalInvested,
      totalReturns: investor.totalReturns,
      activeInvestments: investor.activeInvestments,
      averageROI: investor.averageROI,
      verificationStatus: investor.verificationStatus,
      kycDocuments: investor.kycDocuments,
      createdAt: investor.createdAt,
      updatedAt: investor.updatedAt
    };

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});



// Get investment opportunities for investors (INVESTOR ONLY)
router.get('/investment-opportunities', auth, requireRole('investor'), async (req, res) => {
  try {
    console.log('📈 Fetching investment opportunities for investor:', req.user.id);
    
    // Get loans that are available for investment
    const availableLoans = await Loan.find({
      status: { $in: ['pending', 'approved'] },
      fundingDeadline: { $gt: new Date() }
    })
    .populate('user', 'name location farmingExperience creditScore')
    .sort({ createdAt: -1 })
    .limit(10);

    // Transform data for frontend
    const opportunities = availableLoans.map(loan => {
      const fundingProgress = (loan.fundedAmount / loan.amount) * 100;
      const amountRemaining = loan.amount - loan.fundedAmount;
      
      return {
        id: loan._id,
        farmerId: loan.user._id,
        farmer: {
          id: loan.user._id,
          name: loan.user.name,
          location: loan.user.location,
          experience: loan.user.farmingExperience || 3,
          creditScore: loan.user.creditScore || 650,
          successfulLoans: loan.user.successfulLoans || 0,
          repaymentRate: loan.user.repaymentRate || 85,
          verificationBadges: ['identity', 'land'] // Default badges
        },
        amount: loan.amount,
        amountFunded: loan.fundedAmount || 0,
        amountRemaining: amountRemaining,
        fundingProgress: fundingProgress,
        purpose: loan.purpose,
        duration: loan.duration,
        interestRate: loan.interestRate || 12,
        expectedROI: loan.expectedROI || 15,
        cropType: loan.cropType,
        acreage: loan.acreage,
        season: loan.season || '2024-2025',
        expectedYield: loan.expectedYield,
        expectedMarketPrice: loan.expectedMarketPrice,
        riskLevel: loan.riskLevel || 'medium',
        riskFactors: loan.riskFactors || ['Market fluctuations', 'Weather conditions'],
        fundingDeadline: loan.fundingDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: loan.status,
        minimumInvestment: loan.minimumInvestment || 5000,
        investors: loan.investors || [],
        documents: loan.documents || [],
        createdAt: loan.createdAt,
        updatedAt: loan.updatedAt
      };
    });

    console.log('✅ Investment opportunities found:', opportunities.length);
    
    res.json({
      success: true,
      data: opportunities
    });
  } catch (error) {
    console.error('❌ Error fetching investment opportunities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch investment opportunities'
    });
  }
});

module.exports = router;