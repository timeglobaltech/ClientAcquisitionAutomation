
import LandingNav from "./LandingNav";
import HeroSection from "./HeroSection";
import BeforeAfterSection from "./BeforeAfterSection";
import HowItWorksSection from "./HowItWorksSection";
import FeaturesSection from "./FeaturesSection";
import PricingSection from "./PricingSection";
import TechStackSection from "./TechStackSection";
import LandingFooter from "./LandingFooter";

export default function LandingPage({ onEnterApp, onSignIn, onSignUp }) {
  return (
    <div className="min-h-screen bg-[#0A0E27]">
      <LandingNav onEnterApp={onEnterApp} onSignIn={onSignIn} onSignUp={onSignUp} />
      <HeroSection onEnterApp={onEnterApp} />
      <BeforeAfterSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <TechStackSection />
      <LandingFooter />
    </div>
  );
}
