import Hero from './Hero';
import Analytics from './Analytics';
import About from './About';
import HowItWorks from './HowItWorks'; // <-- Add this import
import Testimonials from './Testimonials';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Analytics />
      <About />
      <HowItWorks /> {/* <-- Add this line to render HowItWorks */}
      <Testimonials />
      <Footer />
    </div>
  );
};

export default LandingPage;