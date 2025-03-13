import EnhancedLayout from "@/components/features/landingPage/enhanced-layout"
import HeroSection from "@/components/features/landingPage/hero-section"
import EnhancedAboutSection from "@/components/features/landingPage/enhanced-about-section"
import EnhancedPackagesSection from "@/components/features/landingPage/enhanced-packages-section"
import EnhancedGallerySection from "@/components/features/landingPage/enhanced-gallery-section"
import TestimonialsSection from "@/components/features/landingPage/testimonials-section"
import ContactSection from "@/components/features/landingPage/contact-section"

export default function LandingPage() {
  return (
    <EnhancedLayout>
      <HeroSection />
      <EnhancedAboutSection />
      <EnhancedPackagesSection />
      <EnhancedGallerySection />
      <TestimonialsSection />
      <ContactSection />
    </EnhancedLayout>
  )
}