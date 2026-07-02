// components/Layout/Layout.tsx
import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import InvestorNavbar from './InvestorNavbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  
  // Show investor navbar for investors, farmer navbar for farmers
  const isInvestor = user?.userType === 'investor';

  return (
    <div className="min-h-screen bg-gray-50">
      {isInvestor ? <InvestorNavbar /> : <Navbar />}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;