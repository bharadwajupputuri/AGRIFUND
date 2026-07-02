import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType: 'farmer' | 'investor';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType 
}) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuthorization = () => {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      console.log('🔐 ProtectedRoute Check:', {
        path: location.pathname,
        requiredType: requiredUserType,
        hasToken: !!token,
        hasUserData: !!userData
      });

      // Check if user is logged in
      if (!userData || !token) {
        console.log('❌ No authentication - redirecting to signin');
        setRedirectTo('/signin');
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      try {
        const user = JSON.parse(userData);
        
        console.log('👤 User Info:', {
          name: user.name,
          userType: user.userType,
          requiredType: requiredUserType
        });

        // Critical Security Check: Verify user type matches required type
        if (user.userType !== requiredUserType) {
          console.log('⚠️ SECURITY ALERT: User type mismatch!', {
            userType: user.userType,
            requiredType: requiredUserType,
            attemptedPath: location.pathname
          });
          
          // Redirect to appropriate dashboard
          const correctDashboard = user.userType === 'farmer' 
            ? '/farmer-dashboard' 
            : '/investor-dashboard';
          
          console.log('↩️ Redirecting to correct dashboard:', correctDashboard);
          setRedirectTo(correctDashboard);
          setIsAuthorized(false);
          setIsChecking(false);
          return;
        }

        // All checks passed
        console.log('✅ Authorization successful');
        setIsAuthorized(true);
        setIsChecking(false);
      } catch (error) {
        console.error('❌ Error parsing user data:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        setRedirectTo('/signin');
        setIsAuthorized(false);
        setIsChecking(false);
      }
    };

    checkAuthorization();
  }, [location.pathname, requiredUserType]);

  // Show nothing while checking (or you can show a loader)
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authorized
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render children if authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Fallback redirect
  return <Navigate to="/signin" replace />;
};

export default ProtectedRoute;