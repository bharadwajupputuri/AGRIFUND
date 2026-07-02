
import { Star, Quote, User, MapPin } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Organic Farmer',
      location: 'Iowa, USA',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
      rating: 5,
      content: "AgriFund transformed my farming operation. The affordable credit helped me expand my organic vegetable farm from 10 to 50 acres. The application process was incredibly simple, and the support team guided me every step of the way.",
      impact: "₹75,000 loan • 400% farm expansion"
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Impact Investor',
      location: 'California, USA',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
      rating: 5,
      content: "I've been investing through AgriFund for two years now. Not only have I earned consistent 12% returns, but I'm also making a real difference in rural communities. The platform's transparency gives me complete visibility into where my money is going.",
      impact: "12% annual returns • 15 farmers supported"
    },
    {
      id: 3,
      name: 'James Rodriguez',
      role: 'Dairy Farmer',
      location: 'Texas, USA',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
      rating: 5,
      content: "When I needed urgent funding for new milking equipment, traditional banks wanted too much paperwork and time. AgriFund approved my loan in just 3 days. My dairy production increased by 60% thanks to the new equipment.",
      impact: "₹120,000 loan • 60% production increase"
    },
    {
      id: 4,
      name: 'Emma Thompson',
      role: 'Sustainable Investor',
      location: 'New York, USA',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
      rating: 5,
      content: "AgriFund aligns perfectly with my values. I can support sustainable farming practices while earning great returns. The platform's impact reports show exactly how my investments are helping farmers adopt eco-friendly technologies.",
      impact: "₹500,000 invested • 50 sustainable projects funded"
    },
    {
      id: 5,
      name: 'David Park',
      role: 'Fruit Farmer',
      location: 'Washington, USA',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
      rating: 5,
      content: "The seasonal loan feature is perfect for fruit farming. I get funding when I need it most - during planting and harvesting seasons. The flexible repayment schedule matches my cash flow perfectly.",
      impact: "₹90,000 seasonal loan • Perfect cash flow match"
    },
    {
      id: 6,
      name: 'Lisa Wong',
      role: 'Tech Investor',
      location: 'Seattle, USA',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
      rating: 5,
      content: "As someone from the tech industry, I appreciate AgriFund's modern approach to agricultural financing. The platform is user-friendly, transparent, and provides excellent analytics on my investment performance.",
      impact: "₹250,000 invested • 8 months average payback"
    }
  ];

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from farmers and investors who are transforming agriculture together
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="h-12 w-12 text-green-600" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Impact Metrics */}
              <div className="bg-green-50 rounded-lg p-3 mb-6">
                <p className="text-green-800 font-semibold text-sm">
                  {testimonial.impact}
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <User className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {testimonial.role}
                  </p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                    <p className="text-gray-500 text-xs">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Join Our Community?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Whether you're a farmer seeking funding or an investor looking for impact, 
              we're here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300">
                Share Your Story
              </button>
              <button className="border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-colors duration-300">
                View All Testimonials
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;