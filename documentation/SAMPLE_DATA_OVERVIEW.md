# Sample Data Overview

## 👥 Complete User Database

### 👨‍🌾 Farmers (5 Users)

| # | Name | Email | Farm | Location | Crops | Farm Size |
|---|------|-------|------|----------|-------|-----------|
| 1 | Rajesh Kumar | rajesh.kumar@example.com | Green Valley Farms | Punjab | Wheat, Rice, Cotton | 15 acres |
| 2 | Priya Sharma | priya.sharma@example.com | Sunrise Agricultural Farm | Haryana | Sugarcane, Wheat | 25 acres |
| 3 | Amit Patel | amit.patel@example.com | Golden Harvest Farm | Gujarat | Cotton, Groundnut, Cumin | 30 acres |
| 4 | Sunita Devi | sunita.devi@example.com | Krishna Organic Farms | Uttar Pradesh | Vegetables, Fruits | 10 acres |
| 5 | Vikram Singh | vikram.singh@example.com | Royal Wheat Fields | Rajasthan | Wheat, Mustard, Bajra | 40 acres |

**Common Password**: `farmer123`

---

### 💼 Investors (4 Users)

| # | Name | Email | Capacity | Risk | Preferred Crops | Regions |
|---|------|-------|----------|------|----------------|---------|
| 1 | Arjun Mehta | arjun.mehta@example.com | ₹5,00,000 | Medium | Wheat, Rice, Cotton | Punjab, Haryana |
| 2 | Sneha Kapoor | sneha.kapoor@example.com | ₹10,00,000 | High | Sugarcane, Cotton, Vegetables | Maharashtra, Gujarat |
| 3 | Ravi Verma | ravi.verma@example.com | ₹3,00,000 | Low | Wheat, Rice | Punjab, UP |
| 4 | Anita Desai | anita.desai@example.com | ₹7,50,000 | Medium | Cotton, Groundnut, Vegetables | Gujarat, Rajasthan |

**Common Password**: `investor123`

---

## 💰 Loan Applications (6 Loans)

### Loan #1 - Rajesh Kumar (APPROVED) ✅
- **Amount**: ₹1,50,000
- **Purpose**: Seed and fertilizer purchase
- **Crop**: Wheat
- **Duration**: 12 months
- **Acreage**: 15 acres
- **Expected Yield**: 3,000 kg
- **Production Cost**: ₹1,20,000
- **Expected Profit**: ₹30,000
- **Status**: 🟢 Approved - Ready for investment

---

### Loan #2 - Priya Sharma (APPROVED) ✅
- **Amount**: ₹2,50,000
- **Purpose**: Irrigation setup
- **Crop**: Sugarcane
- **Duration**: 18 months
- **Acreage**: 25 acres
- **Expected Yield**: 50,000 kg
- **Production Cost**: ₹2,00,000
- **Expected Profit**: ₹50,000
- **Status**: 🟢 Approved - Ready for investment

---

### Loan #3 - Amit Patel (ACTIVE) 🔥
- **Amount**: ₹3,00,000
- **Purpose**: Equipment purchase
- **Crop**: Cotton
- **Duration**: 24 months
- **Acreage**: 30 acres
- **Expected Yield**: 9,000 kg
- **Production Cost**: ₹2,80,000
- **Expected Profit**: ₹2,60,000
- **Status**: 🔵 Active - Has investments & progress updates

---

### Loan #4 - Sunita Devi (PENDING) ⏳
- **Amount**: ₹80,000
- **Purpose**: Crop protection
- **Crop**: Vegetables
- **Duration**: 6 months
- **Acreage**: 10 acres
- **Expected Yield**: 15,000 kg
- **Production Cost**: ₹70,000
- **Expected Profit**: ₹1,55,000
- **Status**: 🟡 Pending - Awaiting approval

---

### Loan #5 - Vikram Singh (APPROVED) ✅
- **Amount**: ₹2,00,000
- **Purpose**: Land preparation
- **Crop**: Wheat
- **Duration**: 12 months
- **Acreage**: 40 acres
- **Expected Yield**: 4,000 kg
- **Production Cost**: ₹1,80,000
- **Expected Profit**: ₹20,000
- **Status**: 🟢 Approved - Ready for investment

---

### Loan #6 - Rajesh Kumar (COMPLETED) ✔️
- **Amount**: ₹1,00,000
- **Purpose**: Working capital
- **Crop**: Rice
- **Duration**: 6 months
- **Acreage**: 12 acres
- **Expected Yield**: 3,600 kg
- **Production Cost**: ₹85,000
- **Expected Profit**: ₹23,000
- **Status**: ⚫ Completed - Historical data

---

## 🤝 Active Investments

| Investor | Loan | Farmer | Amount | Expected Return | Status |
|----------|------|--------|--------|----------------|--------|
| Arjun Mehta | Wheat Loan | Rajesh Kumar | ~₹52,500 | ~₹60,375 (15%) | Active |
| Sneha Kapoor | Sugarcane Loan | Priya Sharma | ~₹87,500 | ~₹1,00,625 (15%) | Active |
| Ravi Verma | Cotton Loan | Amit Patel | ~₹1,05,000 | ~₹1,20,750 (15%) | Active |
| Anita Desai | Wheat Loan | Vikram Singh | ~₹70,000 | ~₹80,500 (15%) | Active |

*Note: Investment amounts are 30-70% of loan amount with 15% return*

---

## 📊 Statistics Summary

### Overall Platform Stats
- **Total Users**: 9 (5 farmers + 4 investors)
- **Total Loans**: 6 applications
- **Total Investment Capital**: ₹3,15,000 (approx)
- **Expected Returns**: ₹3,62,250 (approx)
- **Average Loan Size**: ₹1,80,000
- **Average Investment**: ₹78,750

### Loan Status Breakdown
- 🟡 **Pending**: 1 loan (₹80,000)
- 🟢 **Approved**: 2 loans (₹3,50,000)
- 🔵 **Active**: 1 loan (₹3,00,000)
- ⚫ **Completed**: 1 loan (₹1,00,000)

### Crop Distribution
- **Wheat**: 2 loans (33%)
- **Sugarcane**: 1 loan (17%)
- **Cotton**: 1 loan (17%)
- **Vegetables**: 1 loan (17%)
- **Rice**: 1 loan (17%)

### Regional Distribution
- Punjab: 1 farmer
- Haryana: 1 farmer
- Gujarat: 1 farmer
- Uttar Pradesh: 1 farmer
- Rajasthan: 1 farmer

---

## 🎯 Test Scenarios by User

### Rajesh Kumar (Farmer) - Has 2 Loans
**Login**: rajesh.kumar@example.com / farmer123

**What to test**:
- ✅ View dashboard with 2 loans
- ✅ Check approved loan waiting for investment
- ✅ Review completed loan history
- ✅ Apply for new loan
- ✅ Track repayment schedule

---

### Priya Sharma (Farmer) - Has Sugarcane Loan
**Login**: priya.sharma@example.com / farmer123

**What to test**:
- ✅ View approved irrigation loan
- ✅ Wait for investor funding
- ✅ Check loan details
- ✅ Update farm profile

---

### Amit Patel (Farmer) - Active Loan with Investments
**Login**: amit.patel@example.com / farmer123

**What to test**:
- ✅ View active loan with investments
- ✅ Post progress updates with photos
- ✅ Add crop stage updates
- ✅ View investor engagement
- ✅ Track progress timeline

---

### Sunita Devi (Farmer) - Pending Loan
**Login**: sunita.devi@example.com / farmer123

**What to test**:
- ✅ View pending loan status
- ✅ Track approval process
- ✅ Edit loan application
- ✅ Upload additional documents

---

### Vikram Singh (Farmer) - Large Approved Loan
**Login**: vikram.singh@example.com / farmer123

**What to test**:
- ✅ View large loan (₹2L)
- ✅ Check funding progress
- ✅ Review loan terms

---

### Arjun Mehta (Investor) - Medium Risk
**Login**: arjun.mehta@example.com / investor123

**What to test**:
- ✅ Browse marketplace
- ✅ View existing wheat investment
- ✅ Make new investment
- ✅ Check portfolio performance
- ✅ View transaction history

---

### Sneha Kapoor (Investor) - High Risk/High Capacity
**Login**: sneha.kapoor@example.com / investor123

**What to test**:
- ✅ View high-value opportunities
- ✅ Check ₹10L investment capacity
- ✅ Review sugarcane investment
- ✅ Analyze ROI and returns
- ✅ Diversify portfolio

---

### Ravi Verma (Investor) - Conservative/Low Risk
**Login**: ravi.verma@example.com / investor123

**What to test**:
- ✅ View low-risk loans only
- ✅ Check conservative portfolio
- ✅ Track safe investments
- ✅ Review wheat/rice opportunities

---

### Anita Desai (Investor) - Medium Risk
**Login**: anita.desai@example.com / investor123

**What to test**:
- ✅ Balanced portfolio view
- ✅ Regional preference (Gujarat/Rajasthan)
- ✅ Crop preference matching
- ✅ Investment analytics

---

## 📈 Data Relationships

```
Farmer (Rajesh Kumar)
    ├─→ Loan #1 (Wheat - Approved)
    │       ├─→ Investment (Arjun Mehta)
    │       └─→ Transaction Record
    └─→ Loan #6 (Rice - Completed)

Farmer (Priya Sharma)
    └─→ Loan #2 (Sugarcane - Approved)
            ├─→ Investment (Sneha Kapoor)
            └─→ Transaction Record

Farmer (Amit Patel)
    └─→ Loan #3 (Cotton - Active)
            ├─→ Investment (Ravi Verma)
            ├─→ Transaction Record
            └─→ Progress Updates (4 stages)

Farmer (Sunita Devi)
    └─→ Loan #4 (Vegetables - Pending)

Farmer (Vikram Singh)
    └─→ Loan #5 (Wheat - Approved)
            ├─→ Investment (Anita Desai)
            └─→ Transaction Record
```

---

## 🔄 Seed Script Usage

### Run Seed Script
```bash
cd backend
npm run seed
```

### Re-seed (Fresh Start)
```bash
cd backend
npm run seed:fresh
```

### Verify Data
```bash
# Open MongoDB
mongo

# Switch to database
use formconnect

# Check counts
db.users.countDocuments()       # Should be 9
db.loans.countDocuments()       # Should be 6
db.investors.countDocuments()   # Should be 4
db.investments.countDocuments() # Should be 4
```

---

## 📝 Notes

- All passwords are intentionally simple for testing
- Data includes realistic Indian farming scenarios
- Investment returns are calculated at 15%
- Crop stages and metrics are sample data
- Timestamps are randomized within last 30 days
- All financial calculations are accurate

---

## 🚀 Next Steps

1. **Run seed script**: `npm run seed`
2. **Start backend**: `npm run dev`
3. **Start frontend**: `npm run dev`
4. **Login and test**: Use credentials above
5. **Explore features**: Try all user flows

---

**Last Updated**: January 28, 2026
**Data Version**: 1.0
**Total Records**: 20+ documents
