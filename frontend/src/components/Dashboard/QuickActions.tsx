// frontend/src/components/Dashboard/QuickActions.tsx
import React from 'react';
import { 
  FileText, 
  TrendingUp, 
  Eye, 
  MessageCircle, 
  Upload,
  Calendar,
  Settings
 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionsProps {
  userType: 'farmer' | 'investor';
}

const QuickActions: React.FC<QuickActionsProps> = ({ userType }) => {
  const farmerActions = [
    {
      title: 'Apply for Loan',
      description: 'Submit new loan application',
      icon: FileText,
      path: '/apply-loan',
      color: 'bg-blue-50 text-blue-600',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      title: 'View My Loans', 
      description: 'Check loan status and details',
      icon: Eye,
      path: '/my-loans',
      color: 'bg-green-50 text-green-600',
      hoverColor: 'hover:bg-green-100'
    },
    {
      title: 'Progress Updates',
      description: 'Share farming progress',
      icon: Upload,
      path: '/progress-updates',
      color: 'bg-purple-50 text-purple-600',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      title: 'Contact Support',
      description: 'Get help and assistance',
      icon: MessageCircle,
      path: '/support',
      color: 'bg-orange-50 text-orange-600',
      hoverColor: 'hover:bg-orange-100'
    }
  ];

  const investorActions = [
    {
      title: 'Browse Opportunities',
      description: 'Discover investment options',
      icon: TrendingUp,
      path: '/investor/marketplace',
      color: 'bg-blue-50 text-blue-600',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      title: 'My Portfolio',
      description: 'View investments and returns',
      icon: Eye,
      path: '/investor/portfolio',
      color: 'bg-green-50 text-green-600',
      hoverColor: 'hover:bg-green-100'
    },
    {
      title: 'Track Progress',
      description: 'Monitor farmer updates',
      icon: Calendar,
      path: '/investor/progress-updates',
      color: 'bg-purple-50 text-purple-600',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      title: 'Profile Settings',
      description: 'Update preferences',
      icon: Settings,
      path: '/investor/profile',
      color: 'bg-orange-50 text-orange-600',
      hoverColor: 'hover:bg-orange-100'
    }
  ];

  const actions = userType === 'farmer' ? farmerActions : investorActions;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              to={action.path}
              className={`flex items-center p-4 border border-gray-200 rounded-lg ${action.hoverColor} hover:shadow-sm transition-all duration-200 group`}
            >
              <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;