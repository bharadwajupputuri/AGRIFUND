import { io, Socket } from 'socket.io-client';

// Define proper types for socket events
export interface InvestmentUpdateData {
  loanStatus: string;
  loanId: string;
  newFunding: number;
  newStatus: string;
  investorId: string;
  amount: number;
  message?: string;
}

export interface PortfolioUpdateData {
  message: string;
  loanId: string;
  amount: number;
}

export interface ProgressUpdateData {
  loanId: string;
  farmerName: string;
  stage: string;
  description: string;
  timestamp: Date;
}

class SocketService {
  public socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;
  private connectionTimeout: number | null = null;

  connect(): Socket | null {
    // ✅ PREVENT MULTIPLE CONNECTIONS
    if (this.socket?.connected) {
      console.log('🔌 Socket already connected');
      return this.socket;
    }

    if (this.isConnecting) {
      console.log('🔌 Connection already in progress');
      return null;
    }

    try {
      this.isConnecting = true;
      console.log('🔌 Attempting to connect to server...');
      
      this.socket = io('http://localhost:5000', {
        // ✅ ADD RECONNECTION CONFIGURATION
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        transports: ['websocket', 'polling'],
        autoConnect: true
      });
      
      this.socket.on('connect', () => {
        console.log('✅ Connected to server - Socket ID:', this.socket?.id);
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.clearConnectionTimeout();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from server. Reason:', reason);
        this.isConnecting = false;
        this.clearConnectionTimeout();
        
        // ✅ AUTO-RECONNECT ONLY FOR CERTAIN REASONS
        if (reason === 'io server disconnect') {
          console.log('🔄 Server initiated disconnect - will reconnect');
          this.socket?.connect();
        }
      });

      this.socket.on('reconnect_attempt', (attempt) => {
        this.reconnectAttempts = attempt;
        console.log(`🔄 Reconnection attempt ${attempt}/${this.maxReconnectAttempts}`);
      });

      this.socket.on('reconnect_failed', () => {
        console.error('❌ Failed to reconnect after maximum attempts');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.clearConnectionTimeout();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error.message);
        this.isConnecting = false;
        this.clearConnectionTimeout();
        
        // ✅ STOP TRYING AFTER MAX ATTEMPTS
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.log('🛑 Stopping reconnection attempts - server may be down');
          this.disconnect();
        }
      });

      // ✅ ADD CONNECTION TIMEOUT
      this.connectionTimeout = window.setTimeout(() => {
        if (!this.socket?.connected) {
          console.log('⏰ Connection timeout - server not responding');
          this.disconnect();
        }
      }, 15000);

      return this.socket;
    } catch (error) {
      console.error('❌ Failed to connect to socket:', error);
      this.isConnecting = false;
      this.clearConnectionTimeout();
      return null;
    }
  }

  private clearConnectionTimeout() {
    if (this.connectionTimeout) {
      window.clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  // ✅ IMPROVED: Listen for investment updates with debugging
  onInvestmentUpdate(callback: (data: InvestmentUpdateData) => void): void {
    if (this.socket) {
      console.log('🎯 Setting up investmentUpdate listener');
      this.socket.on('investmentUpdate', (data) => {
        console.log('🎯 investmentUpdate event received:', data);
        callback(data);
      });
    } else {
      console.warn('⚠️ Cannot listen for investment updates - socket not connected');
    }
  }

  // ✅ IMPROVED: Listen for portfolio updates with debugging
  onPortfolioUpdate(callback: (data: PortfolioUpdateData) => void): void {
    if (this.socket) {
      console.log('🎯 Setting up portfolioUpdate listener');
      this.socket.on('portfolioUpdate', (data) => {
        console.log('🎯 portfolioUpdate event received:', data);
        callback(data);
      });
    } else {
      console.warn('⚠️ Cannot listen for portfolio updates - socket not connected');
    }
  }

  // Listen for progress updates
  onProgressUpdate(callback: (data: ProgressUpdateData) => void): void {
    if (this.socket) {
      console.log('🎯 Setting up progressUpdate listener');
      this.socket.on('progressUpdate', (data) => {
        console.log('🎯 progressUpdate event received:', data);
        callback(data);
      });
    } else {
      console.warn('⚠️ Cannot listen for progress updates - socket not connected');
    }
  }

  // Join investor room
  joinInvestorRoom(investorId: string): void {
    if (this.socket && investorId) {
      this.socket.emit('joinInvestor', investorId);
      console.log(`👤 Investor ${investorId} joining room`);
    } else {
      console.warn('⚠️ Cannot join investor room - socket not connected or missing ID');
    }
  }

  // Join farmer room
  joinFarmerRoom(farmerId: string): void {
    if (this.socket && farmerId) {
      this.socket.emit('joinFarmer', farmerId);
      console.log(`👨‍🌾 Farmer ${farmerId} joining room`);
    } else {
      console.warn('⚠️ Cannot join farmer room - socket not connected or missing ID');
    }
  }

  // Emit custom events
  emitEvent(event: string, data: unknown): void {
    if (this.socket) {
      console.log(`📤 Emitting event: ${event}`, data);
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️ Cannot emit event ${event} - socket not connected`);
    }
  }

  // Remove specific event listener
  removeListener(event: string, callback: (...args: unknown[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
      console.log(`📡 Removed listener for event: ${event}`);
    }
  }

  // Remove all listeners for an event
  removeAllListeners(event: string): void {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      console.log(`📡 Removed all listeners for event: ${event}`);
    }
  }

  // Get socket connection status
  get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get socket ID
  get socketId(): string | undefined {
    return this.socket?.id;
  }

  // Get reconnection status
  get reconnectionStatus(): string {
    if (this.isConnected) return 'connected';
    if (this.isConnecting) return 'connecting';
    if (this.reconnectAttempts > 0) return 'reconnecting';
    return 'disconnected';
  }

  // ✅ IMPROVED DISCONNECT
  disconnect(): void {
    console.log('🔌 Disconnecting socket...');
    
    if (this.socket) {
      // Remove all listeners first
      this.socket.removeAllListeners();
      
      // Disconnect
      this.socket.disconnect();
      this.socket = null;
    }
    
    // Reset all states
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    this.clearConnectionTimeout();
    
    console.log('🔌 Socket disconnected properly');
  }

  // ✅ MANUAL RECONNECT
  reconnect(): void {
    console.log('🔄 Manual reconnection requested');
    this.disconnect();
    
    // Small delay before reconnecting
    setTimeout(() => {
      this.connect();
    }, 1000);
  }
}

// Add this at the VERY END of the file (after the class definition)
declare global {
  interface Window {
    socketService: SocketService;
  }
}

// Make it available globally for testing
export const socketService = new SocketService();

if (typeof window !== 'undefined') {
  window.socketService = socketService;
  console.log('✅ Socket service added to window');
}