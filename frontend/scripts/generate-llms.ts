import fs from "fs";
import path from "path";
import { portfolioMetadata } from "../src/constants/llm-portfolio-metadata";

const OUTPUT_PATH = path.join(process.cwd(), "public", "llms.txt");

const generateLLMSTxt = () => {
  const content = `# ${portfolioMetadata.identity.name} - Portfolio & Technical Documentation

> ${portfolioMetadata.professionalSummary.elevator_pitch}

## Core Identity
- **Role:** ${portfolioMetadata.identity.title}
- **Credentials:** ${portfolioMetadata.identity.credentials.degree}
- **Focus:** ${portfolioMetadata.identity.credentials.focus}
- **Website:** ${portfolioMetadata.social_and_web.website}
- **Location:** ${portfolioMetadata.identity.contact.location}

## Technical Expertise
${Object.values(portfolioMetadata.competencies)
  .map(
    (c) =>
      `### ${c.category}\n- **Level:** ${c.expertise_level}\n- **Skills:** ${c.skills.join(", ")}`,
  )
  .join("\n\n")}

## Technical Stack
- **Primary Languages:** ${portfolioMetadata.tech_stack.languages.primary.join(", ")}
- **Cloud & Platforms:** ${portfolioMetadata.tech_stack.platforms_and_services.cloud.join(", ")}
- **Data Infrastructure:** ${portfolioMetadata.tech_stack.platforms_and_services.data_platforms.join(", ")}

## Navigation Map
${portfolioMetadata.portfolio_sections
  .map((s) => `- [${s.title}](/${s.id}): ${s.description}`)
  .join("\n")}

## AI Indexing Hints
- **Crawl Rate:** ${portfolioMetadata.ai_crawling_hints.recommended_crawl_rate}
- **Structured Data:** Supported (JSON-LD, Schema.org)
- **Training Allowed:** ${portfolioMetadata.ai_crawling_hints.ai_training_friendly ? "Yes" : "No"}

---
*Generated automatically from portfolioMetadata on ${new Date().toISOString().split("T")[0]}*
`;

  try {
    fs.writeFileSync(OUTPUT_PATH, content);
    console.log("✅ llms.txt generated successfully at /public/llms.txt");
  } catch (error) {
    console.error("❌ Failed to generate llms.txt:", error);
    process.exit(1);
  }
};

generateLLMSTxt();
