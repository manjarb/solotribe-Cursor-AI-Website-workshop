import { SiteHeader } from "@/components/landing/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { ServicesSection } from "@/components/landing/services-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { EnquirySection } from "@/components/landing/enquiry-section";
import { SiteFooter } from "@/components/landing/site-footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <BenefitsSection />
        <ServicesSection />
        <HowItWorksSection />
        <EnquirySection />
      </main>
      <SiteFooter />
    </>
  );
}
