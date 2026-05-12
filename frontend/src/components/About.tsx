export const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center"
    >
      <div className="container mx-auto max-w-4xl text-center">
        {/* Title */}
        <h2 className="container text-3xl md:text-5xl font-bold mb-12">
          About <span className="text-primary">Me</span>
        </h2>
        {/* Framework including content, keywords, and button */}
        <div className="space-y-8 flex-1 flex flex-col justify-evenly">
          <h3 className="text-3xl md:text-4xl font-semibold animate-fade-in-delay-1">
            Designing Scalable Data & AI Systems That Deliver Real Impact
          </h3>
          {/* Content including bio and summary */}
          <div className="space-y-6 animate-fade-in-delay-1">
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              I am a{" "}
              <span className="text-primary font-bold">
                Principal Data Engineer
              </span>
              {" and "}
              <span className="text-primary font-bold">AI Specialist</span> with
              a <span className="text-primary font-bold">PhD</span> in
              Artificial Intelligence, dedicated to architecting
              production-grade platforms that turn complex data into measurable
              business impact. I specialize in navigating high-ambiguity
              technical environments—deconstructing vague business requirements
              into scalable, automated engineering roadmaps.
            </p>

            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              My expertise spans the entire product lifecycle, bridging the gap
              between deep-tier research and high-performance engineering. I
              lead the design of cloud-native ecosystems on AWS and Snowflake,
              with a heavy emphasis on DataOps, MLOps, and Database CI/CD. By
              implementing self-mutating pipelines and metadata-driven
              orchestration, I have delivered architectural transformations that
              reduced processing latency by over 90% while ensuring rigorous
              enterprise-grade governance and security.
            </p>

            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              I thrive at the intersection of Full-Stack Development, Data
              Engineering, and Data Science. Whether I am architecting
              LLM-powered applications, building secure identity management with
              AWS Cognito, or deploying high-volume streaming architectures, my
              focus remains on creating resilient "zero-to-one" systems. I don't
              just build models; I deliver end-to-end intelligent products that
              are stable, secure, and production-ready.
            </p>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {[
              "Data Engineering",
              "Data Science",
              "Machine Learning",
              "Data Analysis",
              "Data Governance",
              "MLOps",
              "DataOps",
              "Cloud Architecture",
              "System Design",
              "LLM Applications",
              "AI Applications",
            ].map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full border border-primary/50 bg-primary/5
                hover:shadow-[0_0_15px_rgba(117,0,20,0.5)]
                hover:bg-primary/10 hover:border-primary
                text-sm text-primary font-medium
                transition-all duration-300 animate-float cursor-default"
              >
                {item}
              </span>
            ))}
          </div>
          {/* CTA */}
          <div className="flex justify-center">
            <a href="#contact" className="cosmic-button">
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
