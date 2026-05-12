// import { Database, ShieldCheck, BrainCircuit } from "lucide-react";

import { Database, BrainCircuit, Cloud, Rocket } from "lucide-react";

const EXPERTISE_DATA = [
  {
    title: "Data Engineering & Platforms",
    icon: Database,
    description:
      "Designing and operating scalable data platforms that enable reliable, high-performance data processing and analytics at scale.",
    skills: [
      "Medallion architecture, data mesh & lakehouse design",
      "Data lakes & warehouses (Snowflake, BigQuery, Databricks, Microsoft Fabric)",
      "Batch & real-time data processing (Spark, Kafka, streaming architectures)",
      "ETL/ELT orchestration (Airflow, Prefect, DBT)",
      "Data modelling & transformation (SCD2, Data Vault, dimensional modelling)",
      "Performance & cost optimisation (latency reduction, resource efficiency)",
      "Data reliability & observability (testing, monitoring, data quality)",
      "Data platform design (scalability, fault tolerance, maintainability)",
      "Access control (RBAC, IAM, fine-grained permissions)",
      "Data governance frameworks (lineage, catalog, auditability)",
      "Privacy-aware data processing & compliance",
      "Secure data access patterns (APIs, VPC, private endpoints)",
      "Data lifecycle management & retention strategies",
    ],
  },
  {
    title: "Cloud Architecture & Infrastructure",
    icon: Cloud,
    description:
      "Architecting cloud-native, distributed systems with strong emphasis on scalability, reliability, and cost efficiency across multi-cloud environments.",
    skills: [
      "Multi-cloud architecture (AWS, Azure, GCP)",
      "AWS ecosystem (S3, Lambda, EKS, Athena, EventBridge, Glue)",
      "Azure & Fabric (Data Factory, Synapse, Databricks, Microsoft Fabric)",
      "GCP (BigQuery, Dataflow, Pub/Sub, Cloud Functions)",
      "Infrastructure as Code (Terraform, CloudFormation, CDK)",
      "Containerisation & orchestration (Docker, Kubernetes)",
      "Networking & security (VPC, IAM, private networking)",
      "High availability & distributed system design",
    ],
  },
  {
    title: "Machine Learning & AI Systems",
    icon: BrainCircuit,
    description:
      "Building production-grade AI systems that bridge research and real-world applications, with strong focus on reliability, safety, and measurable business impact.",
    skills: [
      "LLMs, NLP, and computer vision applications",
      "End-to-end ML lifecycle (data → training → deployment → monitoring)",
      "Model training, evaluation & optimisation",
      "Feature engineering & data-centric AI",
      "MLOps (CI/CD, automated testing, monitoring, reproducibility)",
      "SageMaker & cloud-based ML platforms",
      "AI system integration into data platforms & products",
      "Applied AI for real-time and large-scale systems",
      "LLM guardrails (prompt safety, hallucination mitigation, output validation)",
      "Responsible AI (ethics, bias mitigation, fairness, explainability)",
    ],
  },
  {
    title: "Platform Engineering & DevOps",
    icon: Rocket,
    description:
      "Enabling reliable and scalable production systems through automation, CI/CD, and robust platform engineering practices.",
    skills: [
      "CI/CD pipelines (GitHub Actions, Jenkins)",
      "Infrastructure automation & deployment pipelines",
      "Docker & Kubernetes for scalable workloads",
      "Linux systems & Bash scripting",
      "Monitoring & observability (logs, metrics, alerting)",
      "System reliability & incident response",
      "Performance tuning & optimisation",
    ],
  },
];

export const ExpertiseSection = () => {
  return (
    <section id="expertise" className="min-h-screen py-24 px-4 relative">
      <div className="container mx-auto max-w-7xl flex flex-col gap-20 2xl:gap-40">
        <h2 className="text-3xl md:text-5xl font-bold text-center">
          What I <span className="text-primary">Do</span>
        </h2>

        <div className="columns-1 md:columns-2 gap-8 space-y-8 [column-fill:balance]">
          {EXPERTISE_DATA.map((item, index) => (
            <div
              key={index}
              className="gradient-border p-6 card-hover flex flex-col break-inside-avoid"
            >
              {/* Header: Icon + Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-[0.4em] rounded-full bg-primary/10 shrink-0">
                  <item.icon className="h-[1.1em] w-[1.1em] text-primary" />
                </div>
                <h3 className="text-xl font-semibold leading-none text-foreground">
                  {item.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {item.description}
              </p>

              {/* Skills List */}
              <ul className="text-sm text-muted-foreground space-y-1 items-start text-left">
                {item.skills.map((skill, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-3">
                    <span className="text-primary font-bold shrink-0">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <a href="#projects" className="cosmic-button">
            View my works
          </a>
        </div>
      </div>
    </section>
  );
};
