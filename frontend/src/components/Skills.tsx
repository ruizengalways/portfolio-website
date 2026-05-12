import { Database, Cpu, BrainCircuit, Rocket } from "lucide-react";

const sections = [
  {
    title: "Core Languages",
    icon: Database,
    skills: [
      "Python",
      "TypeScript",
      "JavaScript",
      "Go",
      "Rust",
      "C#",
      "C++",
      "SQL",
      "R",
      "MATLAB",
      "Bash / Shell",
    ],
  },
  {
    title: "Data Platforms",
    icon: Database,
    skills: [
      "Kafka",
      "Spark",
      "Databricks",
      "Airflow",
      "DBT",
      "Prefect",
      "ETL / ELT",
      "Data Modelling (SCD2, Data Vault)",
      "Data Lakes & Lakehouse",
      "Parquet",
      "PyArrow",
      "Pandas",
      "SQLAlchemy",
      "CDC",
      "Hive",
    ],
  },
  {
    title: "Databases & Warehouses",
    icon: Database,
    skills: [
      "PostgreSQL",
      "MySQL",
      "Snowflake",
      "Google BigQuery",
      "AWS Redshift",
      "Microsoft Fabric",
      "Greenplum",
      "Snowpark",
      "NoSQL",
      "MongoDB",
      "DynamoDB",
      "Redis",
      "Cassandra",
      "TimescaleDB",
    ],
  },
  {
    title: "Cloud & Infrastructure",
    icon: Cpu,
    skills: [
      "AWS",
      "Azure",
      "GCP",
      "Terraform",
      "CloudFormation",
      "VPC & Networking",
      "Cloud Monitoring",
    ],
  },
  {
    title: "System & AI",
    icon: BrainCircuit,
    skills: [
      "Microservices & APIs (REST, gRPC)",
      "LLMs & AI Applications",
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "Computer Vision",
      "Natural Language Processing",
      "Deep Learning",
      "Feature Engineering",
      "SageMaker",
    ],
  },
  {
    title: "Platform Engineering & DevOps",
    icon: Rocket,
    skills: [
      "Docker",
      "Kubernetes",
      "CI/CD (GitHub Actions, Jenkins)",
      "Linux",
      "Monitoring & Observability",
      "Infrastructure as Code",
      "Testing (Unit, Integration, Smoke, E2E)",
    ],
  },
];

export const SkillsSection = () => {
  return (
    <section
      id="skills"
      className="py-24 px-4 relative min-h-screen snap-start"
    >
      <div className="container mx-auto max-w-6xl text-center flex flex-col gap-10 2xl:gap-20">
        {/* Title */}
        <div className="text-center space-y-4">
          <h2 className="container text-3xl md:text-5xl font-bold mb-12">
            {" "}
            How I Build <span className="text-primary">Systems</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            The core technologies and frameworks I use to solve complex problems
            and build modern infrastructure.
          </p>
        </div>

        {/* Skills */}
        <div className="columns-1 md:columns-2 gap-10 [column-fill:balance] text-left space-y-10">
          {sections.map((section, index) => {
            const Icon = section.icon;

            return (
              <div key={index} className="break-inside-avoid">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  {section.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:bg-primary/10 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
