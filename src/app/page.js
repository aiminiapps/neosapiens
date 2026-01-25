import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/About";
import ThesisSection from "@/components/landing/ThesisSection";
import AIAgentsSection from "@/components/landing/AIAgentsSection";
import TransparencySection from "@/components/landing/TransparencySection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <ThesisSection />
      <AIAgentsSection />
      <TransparencySection />
      <CTASection />
    </main>
  );
}
