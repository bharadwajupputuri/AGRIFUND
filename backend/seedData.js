// Backend Seed Script - Sample Data Generator
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Investor = require('./models/Investor');
const Loan = require('./models/Loan');
const Investment = require('./models/Investment');
const Transaction = require('./models/Transaction');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/formconnect';

// Sample Farmers Data
const farmersData = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    password: 'farmer123',
    userType: 'farmer',
    phone: '9876543210',
    farmName: 'Green Valley Farms',
    farmLocation: 'Punjab, India',
    farmSize: '15 acres',
    cropTypes: 'Wheat, Rice, Cotton'
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'farmer123',
    userType: 'farmer',
    phone: '9876543211',
    farmName: 'Sunrise Agricultural Farm',
    farmLocation: 'Haryana, India',
    farmSize: '25 acres',
    cropTypes: 'Sugarcane, Wheat'
  },
  {
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    password: 'farmer123',
    userType: 'farmer',
    phone: '9876543212',
    farmName: 'Golden Harvest Farm',
    farmLocation: 'Gujarat, India',
    farmSize: '30 acres',
    cropTypes: 'Cotton, Groundnut, Cumin'
  },
  {
    name: 'Sunita Devi',
    email: 'sunita.devi@example.com',
    password: 'farmer123',
    userType: 'farmer',
    phone: '9876543213',
    farmName: 'Krishna Organic Farms',
    farmLocation: 'Uttar Pradesh, India',
    farmSize: '10 acres',
    cropTypes: 'Vegetables, Fruits'
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    password: 'farmer123',
    userType: 'farmer',
    phone: '9876543214',
    farmName: 'Royal Wheat Fields',
    farmLocation: 'Rajasthan, India',
    farmSize: '40 acres',
    cropTypes: 'Wheat, Mustard, Bajra'
  }
];

// Sample Investors Data
const investorsData = [
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@example.com',
    password: 'investor123',
    userType: 'investor',
    phone: '9123456789',
    investmentCapacity: 500000,
    riskTolerance: 'medium',
    preferredCrops: ['Wheat', 'Rice', 'Cotton'],
    preferredRegions: ['Punjab', 'Haryana']
  },
  {
    name: 'Sneha Kapoor',
    email: 'sneha.kapoor@example.com',
    password: 'investor123',
    userType: 'investor',
    phone: '9123456790',
    investmentCapacity: 1000000,
    riskTolerance: 'high',
    preferredCrops: ['Sugarcane', 'Cotton', 'Vegetables'],
    preferredRegions: ['Maharashtra', 'Gujarat']
  },
  {
    name: 'Ravi Verma',
    email: 'ravi.verma@example.com',
    password: 'investor123',
    userType: 'investor',
    phone: '9123456791',
    investmentCapacity: 300000,
    riskTolerance: 'low',
    preferredCrops: ['Wheat', 'Rice'],
    preferredRegions: ['Punjab', 'Uttar Pradesh']
  },
  {
    name: 'Anita Desai',
    email: 'anita.desai@example.com',
    password: 'investor123',
    userType: 'investor',
    phone: '9123456792',
    investmentCapacity: 750000,
    riskTolerance: 'medium',
    preferredCrops: ['Cotton', 'Groundnut', 'Vegetables'],
    preferredRegions: ['Gujarat', 'Rajasthan']
  }
];

// Sample Loans Data (will be created after farmers)
const loansTemplate = [
  {
    // For Rajesh Kumar
    amount: 150000,
    purpose: 'Seed and fertilizer purchase',
    duration: 12,
    cropType: 'Wheat',
    acreage: 15,
    season: 'Rabi (Winter)',
    expectedYield: 3000,
    expectedMarketPrice: 25,
    productionCost: 120000,
    expectedProfit: 30000,
    status: 'approved',
    interestRate: 12
  },
  {
    // For Priya Sharma
    amount: 250000,
    purpose: 'Irrigation setup',
    duration: 18,
    cropType: 'Sugarcane',
    acreage: 25,
    season: 'Year-round',
    expectedYield: 50000,
    expectedMarketPrice: 3.5,
    productionCost: 200000,
    expectedProfit: 50000,
    status: 'approved',
    interestRate: 12
  },
  {
    // For Amit Patel
    amount: 300000,
    purpose: 'Equipment purchase',
    duration: 24,
    cropType: 'Cotton',
    acreage: 30,
    season: 'Kharif (Monsoon)',
    expectedYield: 9000,
    expectedMarketPrice: 60,
    productionCost: 280000,
    expectedProfit: 260000,
    status: 'active',
    interestRate: 12
  },
  {
    // For Sunita Devi
    amount: 80000,
    purpose: 'Crop protection',
    duration: 6,
    cropType: 'Vegetables',
    acreage: 10,
    season: 'Zaid (Summer)',
    expectedYield: 15000,
    expectedMarketPrice: 15,
    productionCost: 70000,
    expectedProfit: 155000,
    status: 'pending',
    interestRate: 12
  },
  {
    // For Vikram Singh
    amount: 200000,
    purpose: 'Land preparation',
    duration: 12,
    cropType: 'Wheat',
    acreage: 40,
    season: 'Rabi (Winter)',
    expectedYield: 4000,
    expectedMarketPrice: 26,
    productionCost: 180000,
    expectedProfit: 20000,
    status: 'approved',
    interestRate: 12
  },
  {
    // For Rajesh Kumar - Second loan
    amount: 100000,
    purpose: 'Working capital',
    duration: 6,
    cropType: 'Rice',
    acreage: 12,
    season: 'Kharif (Monsoon)',
    expectedYield: 3600,
    expectedMarketPrice: 30,
    productionCost: 85000,
    expectedProfit: 23000,
    status: 'completed',
    interestRate: 12
  }
];

async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Investor.deleteMany({});
    await Loan.deleteMany({});
    await Investment.deleteMany({});
    await Transaction.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create Farmers
    console.log('\n👨‍🌾 Creating farmers...');
    const farmers = [];
    for (const farmerData of farmersData) {
      const hashedPassword = await bcrypt.hash(farmerData.password, 10);
      const farmer = await User.create({
        ...farmerData,
        password: hashedPassword
      });
      farmers.push(farmer);
      console.log(`  ✅ Created farmer: ${farmer.name} (${farmer.email})`);
    }

    // Create Investors
    console.log('\n💼 Creating investors...');
    const investors = [];
    const investorProfiles = [];
    for (const investorData of investorsData) {
      const hashedPassword = await bcrypt.hash(investorData.password, 10);
      const { investmentCapacity, riskTolerance, preferredCrops, preferredRegions, ...userData } = investorData;
      
      const investor = await User.create({
        ...userData,
        password: hashedPassword
      });
      investors.push(investor);

      // Create investor profile
      const investorProfile = await Investor.create({
        user: investor._id,
        investmentCapacity,
        riskTolerance,
        preferredCrops,
        preferredRegions
      });
      investorProfiles.push(investorProfile);
      
      console.log(`  ✅ Created investor: ${investor.name} (${investor.email})`);
    }

    // Create Loans
    console.log('\n💰 Creating loans...');
    const loans = [];
    for (let i = 0; i < loansTemplate.length; i++) {
      const loanData = loansTemplate[i];
      const farmerIndex = i % farmers.length;
      
      const loan = await Loan.create({
        ...loanData,
        user: farmers[farmerIndex]._id,
        appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
        ...(loanData.status !== 'pending' && {
          approvedAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000)
        }),
        ...(loanData.status === 'active' && {
          disbursedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)
        })
      });
      loans.push(loan);
      console.log(`  ✅ Created loan: ${loan.amount} for ${farmers[farmerIndex].name} - Status: ${loan.status}`);
    }

    // Create Sample Investments
    console.log('\n🤝 Creating investments...');
    const approvedLoans = loans.filter(l => l.status === 'approved' || l.status === 'active');
    
    for (let i = 0; i < Math.min(approvedLoans.length, investorProfiles.length); i++) {
      const loan = approvedLoans[i];
      const investorProfile = investorProfiles[i % investorProfiles.length];
      const investor = investors[i % investors.length];
      
      const investmentAmount = Math.floor(loan.amount * (0.3 + Math.random() * 0.4)); // 30-70% of loan
      const expectedReturn = Math.floor(investmentAmount * 1.15); // 15% return
      
      const investment = await Investment.create({
        investor: investorProfile._id,
        loan: loan._id,
        farmer: loan.user,
        amount: investmentAmount,
        expectedReturn,
        status: loan.status === 'completed' ? 'completed' : 'active',
        investmentDate: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
        duration: loan.duration,
        cropType: loan.cropType,
        riskLevel: loan.amount > 200000 ? 'high' : loan.amount > 100000 ? 'medium' : 'low'
      });

      console.log(`  ✅ Created investment: ${investor.name} → ${investmentAmount} in ${loan.cropType} loan`);

      // Create transaction record
      await Transaction.create({
        investor: investorProfile._id,
        loan: loan._id,
        investment: investment._id,
        amount: investmentAmount,
        type: 'investment',
        status: 'completed',
        date: investment.investmentDate
      });

      // Update investor stats
      await investorProfile.updateStats();
    }

    // Add Progress Updates to some loans
    console.log('\n📸 Adding progress updates...');
    const activeLoans = loans.filter(l => l.status === 'active');
    
    for (const loan of activeLoans) {
      const stages = ['land_preparation', 'sowing', 'germination', 'vegetative'];
      for (const stage of stages) {
        loan.progressUpdates.push({
          title: `${stage.replace('_', ' ').toUpperCase()} Stage`,
          description: `Crop is progressing well in the ${stage} stage. All activities completed as planned.`,
          stage,
          date: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
          metrics: {
            plantHeight: Math.floor(Math.random() * 50) + 10,
            soilMoisture: Math.floor(Math.random() * 40) + 40,
            pestIncidence: ['none', 'low'][Math.floor(Math.random() * 2)],
            rainfall: Math.floor(Math.random() * 50),
            temperature: Math.floor(Math.random() * 15) + 20
          }
        });
      }
      await loan.save();
      console.log(`  ✅ Added progress updates to loan for ${loan.cropType}`);
    }

    // Print Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SEED DATA SUMMARY');
    console.log('='.repeat(60));
    console.log(`👨‍🌾 Farmers created: ${farmers.length}`);
    console.log(`💼 Investors created: ${investors.length}`);
    console.log(`💰 Loans created: ${loans.length}`);
    console.log(`   - Pending: ${loans.filter(l => l.status === 'pending').length}`);
    console.log(`   - Approved: ${loans.filter(l => l.status === 'approved').length}`);
    console.log(`   - Active: ${loans.filter(l => l.status === 'active').length}`);
    console.log(`   - Completed: ${loans.filter(l => l.status === 'completed').length}`);
    console.log(`🤝 Investments created: ${await Investment.countDocuments()}`);
    console.log(`📝 Transactions created: ${await Transaction.countDocuments()}`);
    console.log('='.repeat(60));

    console.log('\n📋 LOGIN CREDENTIALS');
    console.log('='.repeat(60));
    console.log('FARMERS:');
    farmersData.forEach((f, i) => {
      console.log(`  ${i + 1}. Email: ${f.email} | Password: ${f.password}`);
    });
    console.log('\nINVESTORS:');
    investorsData.forEach((inv, i) => {
      console.log(`  ${i + 1}. Email: ${inv.email} | Password: ${inv.password}`);
    });
    console.log('='.repeat(60));

    console.log('\n✅ Database seeded successfully!');
    console.log('🚀 You can now start the application and login with above credentials\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

// Run the seed script
seedDatabase();
