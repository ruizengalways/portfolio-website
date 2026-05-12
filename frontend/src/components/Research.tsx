import { BarChart3, FileText, TrendingUp } from "lucide-react";
import CountUp from "react-countup";

/* -------------------- Stats -------------------- */
const RESEARCH_STATS = [
  { label: "Citations", value: 1200, suffix: "+", icon: BarChart3 },
  { label: "Publications", value: 40, suffix: "+", icon: FileText },
  { label: "h-index", value: 15, icon: TrendingUp },
];

/* -------------------- Themes -------------------- */
const RESEARCH_THEMES = [
  "Large Language Models",
  "Natural Language Processing",
  "Computer Vision",
  "3D Vision",
  "Classification & Detection",
  "Multimodal Learning",
  "Generative AI",
  "AI for Healthcare",
  "AI for Industry",
  "Segmentation & Instance Segmentation",
];

export const ResearchSection = () => {
  return (
    <section id="research" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl flex flex-col gap-16">
        {/* -------------------- Title -------------------- */}
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold">
            Research & <span className="text-primary">Innovation</span>
          </h2>

          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            PhD-trained AI and machine learning professional with
            interdisciplinary expertise spanning computer vision, medical AI,
            LLMs, and industrial applications. Leveraging research experience to
            solve complex, ambiguous problems, fast-track cutting-edge
            technologies, and define strategies from vague directions. Proven
            track record in leading end-to-end AI projects, translating
            innovative ideas into practical solutions that improve productivity,
            reduce costs, and drive measurable impact across healthcare,
            industry, and sports domains.
          </p>
        </div>

        {/* -------------------- Stats -------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {RESEARCH_STATS.map((stat, index) => (
            <div
              key={index}
              className="gradient-border p-6 text-center card-hover"
            >
              <stat.icon className="mx-auto mb-3 text-primary" />

              <div className="text-3xl font-bold text-foreground">
                <CountUp
                  end={stat.value}
                  duration={2}
                  suffix={stat.suffix || ""}
                />
              </div>

              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* -------------------- Research Themes -------------------- */}
        <div className="flex flex-col items-center gap-6">
          <h3 className="text-xl md:text-2xl font-semibold">Research Areas</h3>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
            {RESEARCH_THEMES.map((theme, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-primary/5 border border-primary/50
                           text-sm text-primary font-medium
                           hover:bg-primary/10 hover:border-primary
                           hover:shadow-[0_0_15px_rgba(117,0,20,0.5)]
                           transition-all duration-300 animate-float cursor-default"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* -------------------- CTA -------------------- */}
        <div className="flex justify-center">
          <a
            href="https://scholar.google.com/citations?user=ddVT6cMAAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="cosmic-button"
          >
            View Google Scholar
          </a>
        </div>
      </div>
    </section>
  );
};
