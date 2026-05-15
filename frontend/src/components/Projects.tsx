import { ArrowRight, ExternalLink, Github } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Portfolio Website",
    description:
      "A high-performance personal infrastructure project designed with a systems-thinking approach. Built using React and TailwindCSS, this platform integrates a modern CI/CD pipeline via GitHub Actions and Cloudflare, showcasing a production-grade implementation of web architecture, responsive design, and automated deployment.",
    image: "/projects/portfolio-website-project-cover.png",
    tags: ["React", "TailwindCSS", "Cloudflare", "CI/CD"],
    demoUrl: "https://ruizeng.dev",
    githubUrl: "https://github.com/ruizengalways/portfolio-website",
  },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="min-h-screen py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl flex flex-col gap-10 2xl:gap-20">
        <div className="text-center space-y-4">
          <h2 className="container text-3xl md:text-5xl font-bold mb-12">
            {" "}
            Featured <span className="text-primary"> Projects </span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Showcasing robust architectures built with a 'zero-to-one' mindset.
            From high-volume streaming pipelines to LLM-powered applications,
            each project leverages modern DataOps and MLOps principles to ensure
            enterprise-grade security, high availability, and rigorous
            performance standards.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-1"> {project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            href="https://github.com/ruizengalways"
          >
            Check My Github <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
