
import { 
  Leaf, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  Users, 
  Heart, 
  CheckCircle, 
  Globe 
} from 'lucide-react';

const About = () => {
  const farmerBenefits = [
    {
      icon: DollarSign,
      title: 'Affordable Credit',
      description: 'Access low-interest loans with flexible repayment terms tailored to agricultural cycles.'
    },
    {
      icon: CheckCircle,
      title: 'Simplified Application',
      description: 'Quick and easy application process with minimal documentation requirements.'
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Get support from agricultural experts throughout your farming journey.'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with bank-level security measures.'
    }
  ];

  const investorBenefits = [
    {
      icon: TrendingUp,
      title: 'Steady Returns',
      description: 'Earn competitive returns while supporting sustainable agriculture.'
    },
    {
      icon: Heart,
      title: 'Social Impact',
      description: 'Make a meaningful difference in rural communities and food security.'
    },
    {
      icon: Globe,
      title: 'Portfolio Diversification',
      description: 'Add agricultural investments to diversify your investment portfolio.'
    },
    {
      icon: Leaf,
      title: 'Sustainable Growth',
      description: 'Invest in environmentally conscious farming practices and technologies.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About AgriFund
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Connecting small and medium-scale farmers with socially responsible investors, 
              offering affordable credit for farmers and steady returns for investors.
            </p>
            <p className="text-lg text-gray-500">
              We're revolutionizing agricultural financing by creating a transparent, 
              efficient marketplace that benefits both farmers seeking capital and investors 
              looking for meaningful impact opportunities.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Farmer Benefits */}
          <div>
            <div className="text-center lg:text-left mb-12">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <Leaf className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-3xl font-bold text-gray-900">For Farmers</h3>
              </div>
              <p className="text-gray-600 text-lg">
                Empowering agricultural communities with accessible financing solutions
              </p>
            </div>
            
            <div className="space-y-8">
              {farmerBenefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="group flex items-start space-x-4 p-6 rounded-2xl hover:bg-green-50 transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                      <benefit.icon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investor Benefits */}
          <div>
            <div className="text-center lg:text-left mb-12">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-3xl font-bold text-gray-900">For Investors</h3>
              </div>
              <p className="text-gray-600 text-lg">
                Creating sustainable returns while making a positive impact
              </p>
            </div>
            
            <div className="space-y-8">
              {investorBenefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="group flex items-start space-x-4 p-6 rounded-2xl hover:bg-blue-50 transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                      <benefit.icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Our Mission
          </h3>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto opacity-95">
            To democratize agricultural financing by building bridges between farmers who need capital 
            to grow their operations and investors who want to create positive change while earning 
            competitive returns. Together, we're cultivating a more sustainable and prosperous future 
            for agriculture.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;