import { ArrowDown } from "lucide-react";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-svh flex flex-col items-center px-4 py-20"
    >
      <div className="container max-w-4xl mx-auto flex flex-col gap-12 md:gap-20 2xl:gap-40 text-center z-10 my-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="opacity-0 animate-fade-in"> Hi, I'm Dr </span>
          <span className="text-primary opacity-0 animate-fade-in-delay-1">
            {" "}
            Rui
          </span>
          <span className="text-gradient ml-2 opacity-0 animate-fade-in-delay-2">
            {" "}
            Zeng
          </span>
        </h1>

        <div className="flex flex-col items-center space-y-6 opacity-0 animate-fade-in-delay-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            PhD in Artificial Intelligence
          </h2>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-lg md:text-xl text-muted-foreground font-medium">
            <span>Full Stack Developer</span>
            <span className=" md:inline text-primary/40">•</span>
            <span>Data Engineer</span>
            <span className=" md:inline text-primary/40">•</span>
            <span>Data Scientist</span>
            <span className=" md:inline text-primary/40">•</span>
            <span>AI Engineer</span>
            <span className=" md:inline text-primary/40">•</span>
            <span>System Designer</span>
          </div>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-delay-3">
          I design and deliver end-to-end intelligent systems — combining
          backend architecture, scalable data platform, and machine learning
          models into production-ready applications.
        </p>

        <div className="opacity-0 animate-fade-in-delay-4">
          <a href="#expertise" className="cosmic-button">
            View My Expertise
          </a>
        </div>
        <div className="flex flex-col items-center animate-bounce">
          <span className="text-sm text-muted-foreground mb-2"> Scroll </span>
          <ArrowDown className="h-[1em] w-[1em] text-primary" />
        </div>
      </div>
    </section>
  );
};
