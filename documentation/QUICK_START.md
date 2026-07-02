# Quick Start Guide - Sample Data Setup

## 🚀 Get Started in 3 Steps

### Step 1: Seed the Database
```bash
cd backend
npm run seed
```

### Step 2: Start the Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Step 3: Login and Test
Open http://localhost:5173 and login with:

**Farmers**: 
- Email: `rajesh.kumar@example.com` | Password: `farmer123`
- Email: `priya.sharma@example.com` | Password: `farmer123`

**Investors**:
- Email: `arjun.mehta@example.com` | Password: `investor123`
- Email: `sneha.kapoor@example.com` | Password: `investor123`

---

## 📊 What You Get

✅ **5 Farmers** with complete profiles
✅ **4 Investors** with portfolios
✅ **6 Loans** in different states
✅ **Active Investments** ready to explore
✅ **Progress Updates** with photos and metrics

---

## 🎯 Test These Features

### As a Farmer (Login: rajesh.kumar@example.com)
1. View your dashboard with loan statistics
2. Check approved and completed loans
3. Apply for a new loan
4. Post progress updates on active loans

### As an Investor (Login: arjun.mehta@example.com)
1. Browse investment opportunities
2. View farmer profiles and loan details
3. Make investments in approved loans
4. Track your portfolio and returns

---

## 💡 Pro Tips

- Use `npm run seed` to reset data anytime
- All passwords are simple for testing (`farmer123` / `investor123`)
- Check MongoDB Compass to see data structure
- Loan statuses: Pending → Approved → Active → Completed

---

## 📚 Full Documentation

- [Complete Sample Data Guide](./SAMPLE_DATA_GUIDE.md)
- [Mandatory Fields Reference](./MANDATORY_FIELDS_REFERENCE.md)
- [Main README](./README.md)

---

**Ready to code?** Start the servers and login! 🎉
