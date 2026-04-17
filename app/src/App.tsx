import { AnnouncementBanner } from '@/components/navigation/AnnouncementBanner';
import { Navbar } from '@/components/navigation/Navbar';
import {
  HeroSection,
  PartnerLogos,
  AnnouncementsSection,
  StatsSection,
  TechnologySection,
  GlobalMarketsSection,
  PerspectivesSection,
  SIAChainSection,
  InstitutionalSection,
  EcosystemSection,
  ResourcesSection,
  NewsletterSection,
  Footer,
} from '@/sections';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBanner />
      <Navbar />
      <main>
        {/* Hero with Partner Logos overlay */}
        <div className="relative">
          <HeroSection />
          <div className="absolute bottom-0 left-0 right-0">
            <PartnerLogos />
          </div>
        </div>
        
        <AnnouncementsSection />
        <StatsSection />
        <TechnologySection />
        <GlobalMarketsSection />
        <PerspectivesSection />
        <SIAChainSection />
        <InstitutionalSection />
        <EcosystemSection />
        <ResourcesSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
