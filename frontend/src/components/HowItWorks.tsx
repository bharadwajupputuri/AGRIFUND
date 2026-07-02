
import { UserPlus, FileText, HandHeart, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Sign Up',
      description: 'Create your account as either a farmer seeking funding or an investor looking for opportunities.',
      icon: UserPlus,
      color: 'green',
      details: [
        'Quick registration process',
        'Verify your identity',
        'Complete your profile'
      ]
    },
    {
      id: 2,
      title: 'Create Profile',
      description: 'Farmers submit loan requests with crop details. Investors browse verified opportunities.',
      icon: FileText,
      color: 'blue',
      details: [
        'Submit detailed information',
        'Upload required documents',
        'Get verified by our team'
      ]
    },
    {
      id: 3,
      title: 'Connect & Fund',
      description: 'Investors choose projects to fund. Secure payments are processed through our platform.',
      icon: HandHeart,
      color: 'purple',
      details: [
        'Browse investment opportunities',
        'Make secure investments',
        'Track funding progress'
      ]
    },
    {
      id: 4,
      title: 'Track & Earn',
      description: 'Monitor progress through updates. Farmers repay loans with interest as crops are harvested.',
      icon: TrendingUp,
      color: 'orange',
      details: [
        'Real-time progress updates',
        'Transparent communication',
        'Secure loan repayments'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        border: 'border-green-200',
        hover: 'hover:bg-green-200'
      },
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-200',
        hover: 'hover:bg-blue-200'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-200',
        hover: 'hover:bg-purple-200'
      },
      orange: {
        bg: 'bg-orange-100',
        text: 'text-orange-600',
        border: 'border-orange-200',
        hover: 'hover:bg-orange-200'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.green;
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How AgriFund Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our platform makes agricultural investing simple, transparent, and rewarding for everyone involved.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const colors = getColorClasses(step.color);
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-gray-300 transform translate-x-4">
                    <ArrowRight className="absolute -top-2 -right-1 h-5 w-5 text-gray-400" />
                  </div>
                )}
                
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center">
                  {/* Step Number & Icon */}
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 ${colors.bg} ${colors.border} border-2 rounded-full flex items-center justify-center mx-auto ${colors.hover} transition-colors duration-300`}>
                      <Icon className={`h-10 w-10 ${colors.text}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.id}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Details */}
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-gray-500 flex items-center justify-center">
                        <div className={`w-1.5 h-1.5 ${colors.bg} rounded-full mr-2`}></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Journey Today
          </h3>
          <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto">
            Join thousands of farmers and investors who are already transforming agriculture through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup/farmer"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Get Started as Farmer
            </Link>
            <Link 
              to="/signup/investor"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Start Investing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;