# Sample Data Seed Script Documentation

## 📋 Overview

This document explains how to use the seed script to populate your FarmConnect database with sample data for testing and development.

---

## 🎯 What Data is Created?

### 👨‍🌾 **5 Farmers** with complete profiles:
1. **Rajesh Kumar** - Green Valley Farms (Punjab) - Wheat, Rice, Cotton
2. **Priya Sharma** - Sunrise Agricultural Farm (Haryana) - Sugarcane, Wheat
3. **Amit Patel** - Golden Harvest Farm (Gujarat) - Cotton, Groundnut, Cumin
4. **Sunita Devi** - Krishna Organic Farms (UP) - Vegetables, Fruits
5. **Vikram Singh** - Royal Wheat Fields (Rajasthan) - Wheat, Mustard, Bajra

### 💼 **4 Investors** with profiles:
1. **Arjun Mehta** - ₹5L capacity, Medium risk
2. **Sneha Kapoor** - ₹10L capacity, High risk
3. **Ravi Verma** - ₹3L capacity, Low risk
4. **Anita Desai** - ₹7.5L capacity, Medium risk

### 💰 **6 Loan Applications** in various states:
- **2 Approved** loans ready for investment
- **1 Active** loan with ongoing investments
- **1 Pending** loan awaiting approval
- **1 Completed** loan with full history
- **1 Active** loan with progress updates

### 🤝 **Investments** linking investors to loans
- Realistic investment amounts (30-70% of loan)
- 15% expected returns
- Various risk levels

### 📸 **Progress Updates** on active loans
- Multiple crop stages tracked
- Metrics included (plant height, soil moisture, etc.)
- Realistic timelines

---

## 🚀 How to Run the Seed Script

### Method 1: Using Node directly

```bash
# Navigate to backend folder
cd backend

# Run the seed script
node seedData.js
```

### Method 2: Add npm script

Add to `backend/package.json`:
```json
{
  "scripts": {
    "seed": "node seedData.js",
    "seed:fresh": "node seedData.js"
  }
}
```

Then run:
```bash
npm run seed
```

---

## 📊 Expected Output

When you run the script, you'll see:

```
🔗 Connecting to MongoDB...
✅ Connected to MongoDB

🗑️  Clearing existing data...
✅ Existing data cleared

👨‍🌾 Creating farmers...
  ✅ Created farmer: Rajesh Kumar (rajesh.kumar@example.com)
  ✅ Created farmer: Priya Sharma (priya.sharma@example.com)
  ...

💼 Creating investors...
  ✅ Created investor: Arjun Mehta (arjun.mehta@example.com)
  ...

💰 Creating loans...
  ✅ Created loan: 150000 for Rajesh Kumar - Status: approved
  ...

🤝 Creating investments...
  ✅ Created investment: Arjun Mehta → 52500 in Wheat loan
  ...

📸 Adding progress updates...
  ✅ Added progress updates to loan for Cotton
  ...

============================================================
📊 SEED DATA SUMMARY
============================================================
👨‍🌾 Farmers created: 5
💼 Investors created: 4
💰 Loans created: 6
   - Pending: 1
   - Approved: 2
   - Active: 1
   - Completed: 1
🤝 Investments created: 4
📝 Transactions created: 4
============================================================

📋 LOGIN CREDENTIALS
============================================================
FARMERS:
  1. Email: rajesh.kumar@example.com | Password: farmer123
  2. Email: priya.sharma@example.com | Password: farmer123
  ...

INVESTORS:
  1. Email: arjun.mehta@example.com | Password: investor123
  2. Email: sneha.kapoor@example.com | Password: investor123
  ...
============================================================

✅ Database seeded successfully!
🚀 You can now start the application and login with above credentials
```

---

## 🔑 Login Credentials

### Farmers (All use password: `farmer123`)
| Name | Email | Farm | Location |
|------|-------|------|----------|
| Rajesh Kumar | rajesh.kumar@example.com | Green Valley Farms | Punjab |
| Priya Sharma | priya.sharma@example.com | Sunrise Agricultural Farm | Haryana |
| Amit Patel | amit.patel@example.com | Golden Harvest Farm | Gujarat |
| Sunita Devi | sunita.devi@example.com | Krishna Organic Farms | Uttar Pradesh |
| Vikram Singh | vikram.singh@example.com | Royal Wheat Fields | Rajasthan |

### Investors (All use password: `investor123`)
| Name | Email | Capacity | Risk Tolerance |
|------|-------|----------|----------------|
| Arjun Mehta | arjun.mehta@example.com | ₹5,00,000 | Medium |
| Sneha Kapoor | sneha.kapoor@example.com | ₹10,00,000 | High |
| Ravi Verma | ravi.verma@example.com | ₹3,00,000 | Low |
| Anita Desai | anita.desai@example.com | ₹7,50,000 | Medium |

---

## 📦 Sample Data Details

### Loan Distribution

**Loan 1 - Rajesh Kumar** (Approved)
- Amount: ₹1,50,000
- Purpose: Seed and fertilizer purchase
- Crop: Wheat
- Duration: 12 months
- Status: Ready for investment

**Loan 2 - Priya Sharma** (Approved)
- Amount: ₹2,50,000
- Purpose: Irrigation setup
- Crop: Sugarcane
- Duration: 18 months
- Status: Ready for investment

**Loan 3 - Amit Patel** (Active)
- Amount: ₹3,00,000
- Purpose: Equipment purchase
- Crop: Cotton
- Duration: 24 months
- Status: Active with investments

**Loan 4 - Sunita Devi** (Pending)
- Amount: ₹80,000
- Purpose: Crop protection
- Crop: Vegetables
- Duration: 6 months
- Status: Awaiting approval

**Loan 5 - Vikram Singh** (Approved)
- Amount: ₹2,00,000
- Purpose: Land preparation
- Crop: Wheat
- Duration: 12 months
- Status: Ready for investment

**Loan 6 - Rajesh Kumar** (Completed)
- Amount: ₹1,00,000
- Purpose: Working capital
- Crop: Rice
- Duration: 6 months
- Status: Completed (historical data)

---

## 🧪 Testing Scenarios

### Farmer Scenarios

1. **Login as Rajesh Kumar**
   - View 2 loans (1 approved, 1 completed)
   - See loan history
   - Check repayment status

2. **Login as Amit Patel**
   - View active loan with investments
   - Post progress updates
   - View investor details

3. **Login as Sunita Devi**
   - View pending loan
   - Track approval status
   - Update loan application

### Investor Scenarios

1. **Login as Arjun Mehta**
   - Browse available loans
   - Make new investment
   - View portfolio

2. **Login as Sneha Kapoor**
   - High-risk investor profile
   - View returns and ROI
   - Check transaction history

3. **Login as Ravi Verma**
   - Conservative investor
   - Low-risk investments only
   - Portfolio tracking

---

## ⚙️ Customization

### Change Default Passwords

Edit the `farmersData` and `investorsData` arrays in `seedData.js`:

```javascript
const farmersData = [
  {
    name: 'Your Name',
    email: 'your.email@example.com',
    password: 'your_password_here',  // Change this
    // ... rest of the data
  }
];
```

### Add More Users

Simply add more objects to the arrays:

```javascript
const farmersData = [
  // ... existing farmers
  {
    name: 'New Farmer',
    email: 'new.farmer@example.com',
    password: 'password123',
    userType: 'farmer',
    // ... other fields
  }
];
```

### Adjust Loan Amounts

Modify the `loansTemplate` array:

```javascript
{
  amount: 500000,  // Change loan amount
  purpose: 'New purpose',
  // ... other fields
}
```

---

## 🔄 Re-seeding Database

### ⚠️ **WARNING**: This will delete ALL existing data!

To re-seed with fresh data:

```bash
# Stop your backend server first
node seedData.js
```

The script automatically:
1. Clears all existing users, loans, investments
2. Creates fresh sample data
3. Establishes relationships
4. Generates progress updates

---

## 🛠️ Troubleshooting

### Issue: Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# Start MongoDB
mongod
# Or use MongoDB service
net start MongoDB
```

### Issue: Duplicate Key Error
```
E11000 duplicate key error
```
**Solution**: Database not cleared properly. Drop the database manually:
```bash
mongo
> use formconnect
> db.dropDatabase()
> exit
```
Then run seed script again.

### Issue: Module Not Found
```
Error: Cannot find module 'bcryptjs'
```
**Solution**: Install dependencies
```bash
cd backend
npm install
```

---

## 📊 Data Relationships

```
User (Farmer) ───┬─→ Loan 1
                 ├─→ Loan 2
                 └─→ Loan 3
                         ↓
                   Investment ←─── Investor
                         ↓
                   Transaction
                         ↓
                   Progress Updates
```

---

## 🔍 Verify Data

After seeding, verify in MongoDB:

```bash
mongo
> use formconnect
> db.users.countDocuments()
9  # Should show 9 (5 farmers + 4 investors)
> db.loans.countDocuments()
6  # Should show 6 loans
> db.investments.countDocuments()
4  # Should show investments
```

Or use MongoDB Compass for visual inspection.

---

## 📝 Next Steps

After seeding:

1. **Start Backend**: `npm run dev` in backend folder
2. **Start Frontend**: `npm run dev` in frontend folder
3. **Login**: Use credentials from output
4. **Test Features**:
   - Farmer dashboard
   - Loan application
   - Investor marketplace
   - Making investments
   - Progress updates

---

## 🗑️ Clean Up

To remove all sample data:

```bash
# Connect to MongoDB
mongo

# Switch to database
use formconnect

# Drop all collections
db.users.deleteMany({})
db.loans.deleteMany({})
db.investors.deleteMany({})
db.investments.deleteMany({})
db.transactions.deleteMany({})

# Or drop entire database
db.dropDatabase()
```

---

## 📦 What's Included

- ✅ Hashed passwords (bcrypt)
- ✅ Proper user types (farmer/investor)
- ✅ Complete profiles
- ✅ Realistic loan amounts
- ✅ Multiple loan statuses
- ✅ Investment relationships
- ✅ Transaction history
- ✅ Progress updates with metrics
- ✅ Timestamp tracking
- ✅ Proper MongoDB ObjectId references

---

## 🎓 Learning Points

This seed script demonstrates:
- MongoDB document creation
- Password hashing with bcrypt
- Establishing document relationships
- Creating timestamps
- Async/await patterns
- Error handling
- Database connection management

---

## 🤝 Contributing

To add more sample data:

1. Edit `seedData.js`
2. Add entries to data arrays
3. Run script to verify
4. Update this documentation
5. Commit changes

---

## 📞 Support

If you encounter issues:
1. Check MongoDB is running
2. Verify environment variables
3. Check console output for errors
4. Review MongoDB logs
5. Create issue on GitHub

---

**Last Updated**: January 28, 2026
**Script Location**: `backend/seedData.js`
**Database**: MongoDB (formconnect)
