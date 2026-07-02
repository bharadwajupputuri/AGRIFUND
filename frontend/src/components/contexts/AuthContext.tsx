import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'farmer' | 'investor';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED AUTH CHECK - Don't verify token on every refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('🔐 Auth check - Token exists:', !!token);
        console.log('🔐 Auth check - User data exists:', !!userData);
        
        if (token && userData) {
          // ✅ SIMPLE CHECK - Just parse the user data without backend verification
          // This prevents redirects on page refresh
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            console.log('✅ User restored from localStorage:', parsedUser.name);
          } catch (parseError) {
            console.error('❌ Error parsing user data:', parseError);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            setUser(null);
          }
        } else {
          console.log('ℹ️ No auth data found in localStorage');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      console.log('🔑 Attempting login for:', email);
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        console.log('✅ Login successful:', data.user.name);
        console.log('📦 Token received:', data.token ? 'Yes' : 'No');
        
        // Set user state
        setUser(data.user);
        
        // Store in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id); // ✅ Store userId separately for easy access
        
        console.log('✅ Auth data saved to localStorage');
        
        return true;
      } else {
        const errorData = await response.json();
        console.error('❌ Login failed:', errorData.message || 'Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user:', user?.name);
    
    // Clear state
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    
    console.log('✅ Logout complete, storage cleared');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;