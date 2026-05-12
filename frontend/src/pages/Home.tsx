import { AboutSection } from "../components/About";
import { HeroSection } from "../components/Hero";
import { Navbar } from "../components/Navbar";
import { StarBackground } from "../components/StarBackground";
import { SkillsSection } from "../components/Skills";
import { ProjectsSection } from "../components/Projects";
import { ContactSection } from "../components/Contact";
import { ExpertiseSection } from "../components/Expertise";
import { Footer } from "../components/Footer";
import { ResearchSection } from "../components/Research";
import { StructuredData } from "../components/StructuredData";
import { Toaster } from "sonner";
import { useRecordVisit } from "../hooks/useRecordVisit";

export const Home = () => {
  // Record page visit on mount (non-blocking)
  useRecordVisit();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden overflow-y-auto">
      <StructuredData />
      <StarBackground />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ExpertiseSection />
        <ResearchSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
        <Toaster position="bottom-right" expand={false} richColors />
      </main>
      <Footer />
    </div>
  );
};
