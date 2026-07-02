const socketIO = require('socket.io');

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e8,
    connectTimeout: 45000
  });

  io.engine.on("connection_error", (err) => {
    console.log('🔌 Socket connection error:', err);
  });

  io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Heartbeat
    socket.on('ping', (cb) => {
      if (typeof cb === 'function') {
        cb();
      }
    });

    // Join investor to specific room for updates
    socket.on('joinInvestor', (investorId) => {
      if (investorId) {
        socket.join(`investor_${investorId}`);
        console.log(`👤 Investor ${investorId} joined room`);
      }
    });

    // Join farmer to specific room for updates  
    socket.on('joinFarmer', (farmerId) => {
      if (farmerId) {
        socket.join(`farmer_${farmerId}`);
        console.log(`👨‍🌾 Farmer ${farmerId} joined room`);
      }
    });

    // ✅ IMPROVED makeInvestment EVENT HANDLER
    socket.on('makeInvestment', (data) => {
      try {
        console.log('💰 New investment received:', data);
        
        if (data.farmerId) {
          // Notify farmer with complete data
          socket.to(`farmer_${data.farmerId}`).emit('investmentUpdate', {
            type: 'new_investment',
            loanId: data.loanId,
            amount: data.amount,
            investorId: data.investorId,
            farmerId: data.farmerId,
            timestamp: new Date(),
            message: `🎉 New investment of ₹${data.amount} received!`,
            // Additional data for dashboard update
            totalFunding: data.totalFunding,
            loanStatus: data.loanStatus,
            progressPercentage: data.progressPercentage
          });
          console.log(`📤 Sent complete investment update to farmer ${data.farmerId}`);
        }

        // ✅ IMPROVED: Notify ALL investors to refresh their dashboards
        io.emit('portfolioUpdate', {
          type: 'investment_made',
          loanId: data.loanId,
          amount: data.amount,
          investorId: data.investorId,
          message: `New investment activity detected`,
          refreshNeeded: true, // ✅ Signal that data should be refreshed
          // Additional context data (optional)
          totalInvested: data.totalInvested,
          portfolioValue: data.portfolioValue,
          activeInvestments: data.activeInvestments
        });
        console.log('📤 Sent portfolio update to all investors with refresh signal');

      } catch (error) {
        console.error('❌ Investment event error:', error);
      }
    });

    // Progress update handler
    socket.on('postProgressUpdate', (data) => {
      try {
        console.log('🌱 Progress update received:', data);
        io.emit('progressUpdate', data);
        console.log('📤 Sent progress update to all investors');
      } catch (error) {
        console.error('❌ Progress update error:', error);
      }
    });

    // Test event for debugging
    socket.on('testEvent', (data) => {
      console.log('🧪 Test event received:', data);
      socket.emit('testResponse', { message: 'Test successful!', data });
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log('🔌 User disconnected:', socket.id, 'Reason:', reason);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  });

  return io;
};

module.exports = setupSocket;

