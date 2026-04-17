import { Navbar } from '@/components/navigation/Navbar';
import {
  HeroSection,
  GlobeSection,
  TrustBar,
  ValuePropsSection,
  StatsSection,
  HowItWorksSection,
  SectorsSection,
  TestimonialsSection,
  CTASection,
  Footer,
} from '@/sections';

function App() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main>
        <HeroSection />
        <GlobeSection />
        <TrustBar />
        <ValuePropsSection />
        <StatsSection />
        <HowItWorksSection />
        <SectorsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
