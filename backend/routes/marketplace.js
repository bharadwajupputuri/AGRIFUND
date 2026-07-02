const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Investment = require('../models/Investment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');

// GET /api/marketplace/loans - Get all loans for marketplace with real funding data (INVESTOR ONLY)
router.get('/loans', auth, requireRole('investor'), async (req, res) => {
  try {
    const loans = await Loan.find({ 
      status: { $in: ['approved', 'pending'] } 
    })
    .populate('user', 'name email phone location farmingExperience')
    .sort({ createdAt: -1 });

    const marketplaceLoans = await Promise.all(
      loans.map(async (loan) => {
        const investments = await Investment.find({ 
          loan: loan._id,
          status: 'active'
        });
        
        const amountFunded = investments.reduce((total, inv) => total + inv.amount, 0);
        const amountRemaining = Math.max(0, loan.amount - amountFunded);
        const fundingProgress = (amountFunded / loan.amount) * 100;
        
        const investorDetails = await Promise.all(
          investments.slice(0, 5).map(async (inv) => {
            const investor = await User.findById(inv.investor).select('name');
            return {
              investorId: inv.investor.toString(),
              investorName: investor?.name || 'Anonymous Investor',
              amount: inv.amount,
              investmentDate: inv.investmentDate
            };
          })
        );

        const riskLevel = calculateRiskLevel(loan, loan.user);
        
        return {
          id: loan._id,
          farmerId: loan.user._id,
          farmer: {
            id: loan.user._id,
            name: loan.user.name,
            location: loan.user.location?.state || 'Not specified',
            experience: loan.user.farmingExperience || 0,
            creditScore: await calculateCreditScore(loan.user._id),
            successfulLoans: await getSuccessfulLoanCount(loan.user._id),
            repaymentRate: await calculateRepaymentRate(loan.user._id),
            verificationBadges: getVerificationBadges(loan.user)
          },
          amount: loan.amount,
          amountFunded: amountFunded,
          amountRemaining: amountRemaining,
          fundingProgress: fundingProgress,
          purpose: loan.purpose,
          duration: loan.duration,
          interestRate: loan.interestRate,
          expectedROI: calculateExpectedROI(loan.interestRate, riskLevel),
          cropType: loan.cropType,
          acreage: loan.acreage,
          season: loan.season,
          expectedYield: loan.expectedYield,
          expectedMarketPrice: loan.expectedMarketPrice,
          riskLevel: riskLevel,
          riskFactors: calculateRiskFactors(loan, riskLevel),
          fundingDeadline: new Date(loan.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000),

          // 🔧 FIX 1: USE DATABASE STATUS (NOT computed)
          status: loan.status,

          minimumInvestment: Math.min(5000, loan.amount * 0.1),
          investors: investorDetails,
          documents: loan.documents || [],
          createdAt: loan.createdAt,
          updatedAt: loan.updatedAt
        };
      })
    );

    res.json({ success: true, data: marketplaceLoans });
  } catch (error) {
    console.error('Marketplace error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/marketplace/loans/:id/invest - Real investment with database update (INVESTOR ONLY)
router.post('/loans/:id/invest', auth, requireRole('investor'), async (req, res) => {
  try {
    const { amount } = req.body;
    const loanId = req.params.id;
    const investorId = req.user.id;

    if (amount < 1000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Minimum investment is ₹1000' 
      });
    }

    const loan = await Loan.findById(loanId).populate('user');
    if (!loan) {
      return res.status(404).json({ 
        success: false, 
        message: 'Loan not found' 
      });
    }

    if (!['approved', 'pending'].includes(loan.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Loan is not available for investment' 
      });
    }

    const existingInvestments = await Investment.find({ 
      loan: loanId,
      status: 'active'
    });
    
    const currentFunding = existingInvestments.reduce((total, inv) => total + inv.amount, 0);
    const remainingAmount = loan.amount - currentFunding;
    
    if (amount > remainingAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Investment amount exceeds remaining funding need. Only ₹${remainingAmount} remaining.` 
      });
    }

    const riskLevel = calculateRiskLevel(loan, loan.user);
    
    const investment = new Investment({
      investor: investorId,
      loan: loanId,
      farmer: loan.user._id,
      amount: amount,
      expectedReturn: amount * (1 + loan.interestRate / 100),
      duration: loan.duration,
      cropType: loan.cropType,
      riskLevel: riskLevel,
      status: 'active'
    });

    await investment.save();

    const newFunding = currentFunding + amount;
    if (newFunding >= loan.amount) {
      loan.status = 'disbursed';
      loan.disbursedAt = new Date();
      await loan.save();
    }

    try {
      const io = req.app.get('io');
      if (io) {
        io.to(`farmer_${loan.user._id}`).emit('investmentUpdate', {
          loanId: loanId,
          amount: amount,
          newFunding: newFunding,
          newStatus: loan.status,
          investorId: investorId,
          message: `🎉 New investment of ₹${amount} received!`
        });

        io.emit('portfolioUpdate', {
          message: `New investment of ₹${amount} in ${loan.purpose}`,
          loanId: loanId,
          amount: amount,
          investorId: investorId
        });
      }
    } catch (socketError) {
      console.warn('Socket emission failed:', socketError);
    }

    res.json({ 
      success: true, 
      message: 'Investment successful!',
      data: {
        investmentId: investment._id,
        amount: amount,
        loanId: loanId,
        newFundingProgress: newFunding,
        loanStatus: loan.status
      }
    });

  } catch (error) {
    console.error('Investment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/marketplace/loans/:id - Get specific loan details (INVESTOR ONLY)
router.get('/loans/:id', auth, requireRole('investor'), async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('user', 'name email phone location farmingExperience');
    
    if (!loan) {
      return res.status(404).json({ 
        success: false, 
        message: 'Loan not found' 
      });
    }

    const investments = await Investment.find({ 
      loan: loan._id,
      status: 'active'
    }).populate('investor', 'name');
    
    const amountFunded = investments.reduce((total, inv) => total + inv.amount, 0);
    const fundingProgress = (amountFunded / loan.amount) * 100;

    const loanData = {
      id: loan._id,
      farmerId: loan.user._id,
      farmer: {
        id: loan.user._id,
        name: loan.user.name,
        location: loan.user.location?.state || 'Not specified',
        experience: loan.user.farmingExperience || 0,
        creditScore: await calculateCreditScore(loan.user._id),
        successfulLoans: await getSuccessfulLoanCount(loan.user._id),
        repaymentRate: await calculateRepaymentRate(loan.user._id),
        verificationBadges: getVerificationBadges(loan.user)
      },
      amount: loan.amount,
      amountFunded: amountFunded,
      amountRemaining: loan.amount - amountFunded,
      fundingProgress: fundingProgress,
      purpose: loan.purpose,
      duration: loan.duration,
      interestRate: loan.interestRate,
      expectedROI: calculateExpectedROI(
        loan.interestRate,
        calculateRiskLevel(loan, loan.user)
      ),
      cropType: loan.cropType,
      acreage: loan.acreage,
      season: loan.season,
      expectedYield: loan.expectedYield,
      expectedMarketPrice: loan.expectedMarketPrice,
      riskLevel: calculateRiskLevel(loan, loan.user),
      riskFactors: calculateRiskFactors(
        loan,
        calculateRiskLevel(loan, loan.user)
      ),
      fundingDeadline: new Date(loan.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000),

      // 🔧 FIX 2: USE DATABASE STATUS
      status: loan.status,

      minimumInvestment: Math.min(5000, loan.amount * 0.1),
      investors: investments.map(inv => ({
        investorId: inv.investor._id,
        investorName: inv.investor.name,
        amount: inv.amount,
        investmentDate: inv.investmentDate
      })),
      documents: loan.documents || [],
      progressUpdates: loan.progressUpdates || [],
      repaymentSchedule: loan.repaymentSchedule || [],
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt
    };

    res.json({ success: true, data: loanData });
  } catch (error) {
    console.error('Loan details error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper functions (UNCHANGED)
async function calculateCreditScore(userId) {
  const userLoans = await Loan.find({ user: userId });
  const successfulLoans = userLoans.filter(loan => loan.status === 'completed').length;
  const totalLoans = userLoans.length;
  return totalLoans > 0 ? Math.min(800, 600 + (successfulLoans / totalLoans) * 200) : 650;
}

async function getSuccessfulLoanCount(userId) {
  return await Loan.countDocuments({ user: userId, status: 'completed' });
}

async function calculateRepaymentRate(userId) {
  const userLoans = await Loan.find({ user: userId });
  if (userLoans.length === 0) return 95;
  const completedLoans = userLoans.filter(loan => loan.status === 'completed');
  return completedLoans.length > 0 ? 95 : 85;
}

function getVerificationBadges(user) {
  const badges = [];
  if (user.email) badges.push('Email Verified');
  if (user.phone) badges.push('Phone Verified');
  return badges;
}

function calculateRiskLevel(loan, farmer) {
  let score = 50;
  if (loan.amount > 100000) score += 10;
  if (farmer.farmingExperience > 5) score -= 15;
  if (loan.expectedProfit > loan.amount * 0.5) score -= 10;
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  return 'high';
}

function calculateExpectedROI(interestRate, riskLevel) {
  const riskPremium = { low: 2, medium: 5, high: 8 };
  return interestRate + riskPremium[riskLevel];
}

function calculateRiskFactors(loan, riskLevel) {
  const factors = [];
  if (riskLevel === 'high') factors.push('High loan amount');
  if (loan.duration > 12) factors.push('Long duration');
  if (!loan.documents || loan.documents.length === 0) factors.push('Limited documentation');
  return factors.length > 0 ? factors : ['Standard risk factors'];
}

module.exports = router;
