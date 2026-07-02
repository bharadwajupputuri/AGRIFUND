require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loans');
const investorRoutes = require('./routes/investors');
const marketplaceRoutes = require('./routes/marketplace');
const progressRoutes = require('./routes/progress');

const app = express();
const server = http.createServer(app);

// Socket.io setup with error handling
try {
    const setupSocket = require('./socket/socketHandler');
    const io = setupSocket(server);
    app.set('io', io);
    console.log('✅ Socket.io setup complete');
} catch (error) {
    console.log('⚠️ Socket.io not available:', error.message);
}

// Middleware with enhanced CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ ALL ROUTES IN ONE PLACE
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/investors', investorRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/progress', progressRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'AgriFund API is running!',
        timestamp: new Date().toISOString(),
        database: 'Connected to formconnect',
        realtime: 'Socket.io enabled'
    });
});

// Test route (legacy)
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/formconnect';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB - formconnect database'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌱 AgriFund API: http://localhost:${PORT}/api`);
    console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔌 Real-time: Socket.io enabled`);
});