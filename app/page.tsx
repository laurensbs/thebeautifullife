import Hero from "@/components/sections/Hero";
import RecognitionSection from "@/components/sections/RecognitionSection";
import AboutSection from "@/components/sections/AboutSection";
import FooterQuote from "@/components/sections/FooterQuote";
import FloatingLeaves from "@/components/ui/FloatingLeaves";
import AmbientParticles from "@/components/ui/AmbientParticles";

export default function Home() {
  return (
    <main className="relative">
      <FloatingLeaves />
      <AmbientParticles />
      <Hero />
      <RecognitionSection />
      <AboutSection />
      <FooterQuote />
    </main>
  );
}
