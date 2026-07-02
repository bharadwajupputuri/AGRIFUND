import React, { useState, useEffect } from 'react';
import Layout from '../../Layout/Layout';
import InvestmentOpportunities from '../../investor/InvestmentOpportunities';
import { InvestmentOpportunity } from '../../types/investor';
import { investorAPI } from '../../services/investorAPI';

const InvestmentOpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await investorAPI.getInvestmentOpportunities();
        if (response.success) {
          setOpportunities(response.data);
        }
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Opportunities</h1>
          <p className="text-gray-600 mt-1">Browse and invest in agricultural projects</p>
        </div>
        <InvestmentOpportunities opportunities={opportunities} loading={loading} />
      </div>
    </Layout>
  );
};

export default InvestmentOpportunitiesPage;