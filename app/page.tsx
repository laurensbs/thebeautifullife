import Hero from "@/components/sections/Hero";
import RecognitionSection from "@/components/sections/RecognitionSection";
import AboutSection from "@/components/sections/AboutSection";
import FooterQuote from "@/components/sections/FooterQuote";
import FloatingLeaves from "@/components/ui/FloatingLeaves";

export default function Home() {
  return (
    <main className="relative">
      <FloatingLeaves />
      <Hero />
      <RecognitionSection />
      <AboutSection />
      <FooterQuote />
    </main>
  );
}
