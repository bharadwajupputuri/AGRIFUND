# FarmConnect - Agricultural Financing Platform

## 📖 Project Overview

FarmConnect (AgriFund) is a full-stack web application that connects farmers with investors for agricultural financing. The platform enables farmers to apply for loans for their agricultural projects while providing investors with opportunities to invest in agricultural ventures and earn returns.

### Key Features

- **Dual User System**: Separate portals for Farmers and Investors
- **Loan Application**: Multi-step wizard for farmers to apply for agricultural loans
- **Investment Marketplace**: Browse and invest in approved loan applications
- **Real-time Updates**: Socket.io integration for live notifications
- **Progress Tracking**: Farmers can post crop stage updates with photos
- **Portfolio Management**: Investors can track their investments and returns
- **Document Management**: Upload and manage farming documents
- **Analytics Dashboard**: Visual representation of stats and performance metrics

---

## 🏗️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Real-time**: Socket.io
- **File Upload**: Multer
- **API**: RESTful architecture

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Forms**: Formik + Yup
- **Icons**: Lucide React
- **Date Handling**: date-fns

---

## 📁 Project Structure

```
idp/
├── backend/                    # Node.js backend
│   ├── server.js              # Main server file
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User model (farmer/investor)
│   │   ├── Investor.js        # Investor profile model
│   │   ├── Loan.js            # Loan application model
│   │   ├── Investment.js      # Investment tracking model
│   │   ├── Transaction.js     # Transaction history model
│   │   ├── Document.js        # Document management model
│   │   └── ProgressUpdate.js  # Crop progress updates model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── loans.js           # Loan management routes
│   │   ├── investors.js       # Investor routes
│   │   ├── marketplace.js     # Marketplace routes
│   │   └── progress.js        # Progress update routes
│   ├── socket/
│   │   └── socketHandler.js   # Socket.io setup
│   └── uploads/               # File storage directory
│
└── frontend/                   # React frontend
    ├── src/
    │   ├── App.tsx            # Main app component with routing
    │   ├── main.tsx           # Entry point
    │   ├── components/
    │   │   ├── Auth/          # Authentication components
    │   │   │   ├── SignIn.tsx
    │   │   │   ├── FarmerSignup.tsx
    │   │   │   ├── InvestorSignup.tsx
    │   │   │   └── AuthLayout.tsx
    │   │   ├── Dashboard/     # Dashboard components
    │   │   │   ├── Dashboard.tsx
    │   │   │   ├── StatsCards.tsx
    │   │   │   ├── LoanStatusCards.tsx
    │   │   │   └── QuickActions.tsx
    │   │   ├── LoanApplication/  # Loan application wizard
    │   │   │   └── steps/
    │   │   │       ├── ApplicationWizard.tsx
    │   │   │       ├── BasicDetailsStep.tsx
    │   │   │       ├── FarmDetailsStep.tsx
    │   │   │       ├── FinancialProjectionsStep.tsx
    │   │   │       ├── DocumentUploadStep.tsx
    │   │   │       └── ReviewStep.tsx
    │   │   ├── investor/      # Investor-specific components
    │   │   │   ├── InvestorProfile.tsx
    │   │   │   ├── Portfolio.tsx
    │   │   │   ├── InvestmentOpportunities.tsx
    │   │   │   ├── TransactionHistory.tsx
    │   │   │   ├── PerformanceMetrics.tsx
    │   │   │   └── LoanCard.tsx
    │   │   ├── pages/         # Page components
    │   │   │   ├── FarmerDashboard.tsx
    │   │   │   ├── MyLoans.tsx
    │   │   │   ├── LoanDetails.tsx
    │   │   │   ├── Profile.tsx
    │   │   │   ├── ProgressUpdates.tsx
    │   │   │   └── investor/
    │   │   ├── contexts/      # React context
    │   │   │   └── AuthContext.tsx
    │   │   ├── services/      # API services
    │   │   │   ├── api.ts
    │   │   │   ├── investorAPI.ts
    │   │   │   └── socketService.ts
    │   │   ├── types/         # TypeScript definitions
    │   │   │   ├── index.ts
    │   │   │   └── investor.ts
    │   │   └── hooks/         # Custom hooks
    │   │       └── useAuth.ts
    │   └── Layout/            # Layout components
    │       ├── Navbar.tsx
    │       └── InvestorNavbar.tsx
    └── public/                # Static assets
```

---

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  userType: 'farmer' | 'investor',
  phone: String,
  farmName: String,        // For farmers
  farmLocation: String,    // For farmers
  farmSize: String,        // For farmers
  cropTypes: String,       // For farmers
  timestamps: true
}
```

### Investor Model
```javascript
{
  user: ObjectId (ref: User),
  investmentCapacity: Number,
  riskTolerance: 'low' | 'medium' | 'high',
  preferredCrops: [String],
  preferredRegions: [String],
  totalInvested: Number,
  totalReturns: Number,
  activeInvestments: Number,
  completedInvestments: Number,
  averageROI: Number,
  verificationStatus: 'pending' | 'verified' | 'rejected',
  kycDocuments: {
    panCard, aadhaar, bankStatement, incomeProof
  }
}
```

### Loan Model
```javascript
{
  user: ObjectId (ref: User),
  amount: Number,
  purpose: String,
  duration: Number,
  cropType: String,
  acreage: Number,
  season: String,
  expectedYield: Number,
  expectedMarketPrice: Number,
  productionCost: Number,
  expectedProfit: Number,
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'disbursed',
  interestRate: Number,
  documents: [{name, url, type, uploadedAt}],
  progressUpdates: [{
    title, description, stage, photos, date, metrics, challenges, nextSteps
  }],
  appliedAt: Date,
  approvedAt: Date,
  disbursedAt: Date
}
```

### Investment Model
```javascript
{
  investor: ObjectId (ref: Investor),
  loan: ObjectId (ref: Loan),
  farmer: ObjectId (ref: User),
  amount: Number,
  expectedReturn: Number,
  actualReturn: Number,
  status: 'active' | 'completed' | 'defaulted' | 'partial_return',
  investmentDate: Date,
  duration: Number,
  cropType: String,
  riskLevel: 'low' | 'medium' | 'high'
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user (farmer/investor)
- `POST /login` - Login user
- `GET /user` - Get authenticated user details (protected)
- `PUT /update-profile` - Update user profile (protected)

### Loan Routes (`/api/loans`)
- `POST /` - Create new loan application (farmer only)
- `GET /` - Get all loans for authenticated user
- `GET /:id` - Get specific loan details
- `PUT /:id` - Update loan application
- `DELETE /:id` - Delete loan application
- `POST /:id/progress` - Add progress update to loan

### Investor Routes (`/api/investors`)
- `POST /profile` - Create investor profile
- `GET /profile` - Get investor profile
- `PUT /profile` - Update investor profile
- `GET /stats` - Get investor statistics
- `GET /investments` - Get all investments
- `POST /investments` - Create new investment

### Marketplace Routes (`/api/marketplace`)
- `GET /loans` - Get all approved loans available for investment
- `GET /loans/:id` - Get specific loan for investment
- `POST /invest` - Invest in a loan

### Progress Routes (`/api/progress`)
- `POST /` - Create progress update
- `GET /loan/:loanId` - Get all progress updates for a loan
- `PUT /:id` - Update progress update
- `DELETE /:id` - Delete progress update

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/formconnect
JWT_SECRET=your_super_secret_jwt_key_here
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in frontend directory (if needed):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🎯 User Flows

### Farmer Flow
1. **Registration** → Sign up as farmer
2. **Dashboard** → View loan status and statistics
3. **Apply for Loan** → Fill multi-step application form
   - Basic Details (amount, purpose, duration)
   - Farm Details (crop type, acreage, season)
   - Financial Projections (costs, expected returns)
   - Document Upload (land documents, ID proof)
   - Review & Submit
4. **My Loans** → View all loan applications
5. **Loan Details** → View specific loan information
6. **Progress Updates** → Post crop stage updates with photos
7. **Profile** → Update personal and farm information

### Investor Flow
1. **Registration** → Sign up as investor
2. **Create Profile** → Set investment preferences and KYC
3. **Dashboard** → View portfolio overview
4. **Marketplace** → Browse available investment opportunities
5. **Investment Opportunities** → Filter and view loans
6. **Invest** → Select loan and invest amount
7. **Portfolio** → Track active investments
8. **Transaction History** → View all transactions
9. **Performance Metrics** → Analyze returns and ROI

---

## 🔒 Authentication & Security

- **JWT Tokens**: Used for stateless authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Protected Routes**: Middleware checks token validity
- **Role-based Access**: Separate routes for farmers and investors
- **Token Storage**: localStorage (with security considerations)
- **CORS**: Configured for frontend origin

---

## 📡 Real-time Features (Socket.io)

The application uses Socket.io for real-time updates:
- Loan status changes
- New investment notifications
- Progress update alerts
- Real-time messaging (future feature)

Socket.io is initialized in `backend/socket/socketHandler.js` and connected in the frontend via `src/services/socketService.ts`.

---

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Tailwind CSS**: Utility-first styling
- **Component Library**: Reusable React components
- **Form Validation**: Formik + Yup schemas
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Data Visualization**: Charts using Recharts library
- **Icons**: Lucide React icon set

---

## 📊 Key Features by Module

### Loan Application Wizard
- Step-by-step form with validation
- Progress indicator
- Auto-save drafts (can be implemented)
- Document upload with preview
- Financial calculations
- Review before submission

### Investment Marketplace
- Filter by crop type, amount, duration
- Search functionality
- Loan cards with key information
- Risk assessment indicators
- Investment calculator
- Farmer profile preview

### Portfolio Management
- Investment overview
- Active vs completed investments
- ROI tracking
- Performance charts
- Transaction history
- Export reports (can be implemented)

### Progress Tracking
- Crop stage milestones
- Photo uploads
- Metrics tracking (plant height, soil moisture, etc.)
- Challenges documentation
- Timeline view
- Investor visibility

---

## 🔧 Configuration Files

### Backend
- `package.json` - Dependencies and scripts
- `.env` - Environment variables
- `server.js` - Main entry point

### Frontend
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration (implied)
- `eslint.config.js` - ESLint rules

---

## 🐛 Known Issues & Limitations

Based on terminal output:
- `npm fix audit --force` failed in both frontend and backend
- Some npm packages may have security vulnerabilities
- Need to run `npm audit fix` to resolve dependency issues

---

## 🚀 Future Enhancements

1. **Payment Gateway Integration**
   - Razorpay/Stripe for transactions
   - Automated disbursements

2. **Advanced Analytics**
   - Predictive modeling for crop yields
   - Market price forecasting
   - Risk assessment algorithms

3. **Mobile Application**
   - React Native app
   - Push notifications

4. **KYC Verification**
   - Aadhaar/PAN verification APIs
   - Document verification service

5. **Chat System**
   - Real-time messaging between farmers and investors
   - Group discussions

6. **Insurance Integration**
   - Crop insurance options
   - Risk mitigation

7. **Multi-language Support**
   - Hindi, regional languages
   - i18n implementation

8. **Credit Scoring**
   - Farmer credit score system
   - Default prediction

9. **Automated Reminders**
   - Loan repayment reminders
   - Progress update notifications

10. **Export Features**
    - PDF reports
    - Excel exports
    - Tax documents

---

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Write clean, documented code
- Use meaningful variable names

### Git Workflow
- Feature branches for new features
- Descriptive commit messages
- Code review before merging

### Testing (To be implemented)
- Unit tests with Jest
- Integration tests
- E2E tests with Playwright/Cypress

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is for educational/portfolio purposes.

---

## 👥 Contact & Support

For issues, questions, or contributions, please create an issue in the repository.

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Last Updated**: January 2026
