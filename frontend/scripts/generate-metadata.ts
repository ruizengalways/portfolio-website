/**
 * Automatic AI Discovery Metadata Generator
 * Generates ai-discovery.json from portfolioMetadata
 *
 * Usage: npm run generate:metadata
 * Or: Runs automatically before vite build
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUTPUT_PATH = path.join(__dirname, "../public/ai-discovery.json");

// Define an interface for full type safety
interface AIDiscovery {
  site_name: string;
  author: string;
  url: string;
  description: string;
  last_updated: string;
  topics: string[];
  sections: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
  }>;
  crawlers_allowed: string[];
  [key: string]: unknown; // Allows for additional metadata fields
}

/**
 * Generate AI discovery metadata
 */
function generateAIDiscoveryMetadata(): AIDiscovery {
  const now = new Date().toISOString();

  return {
    site_name: "Dr. Rui Zeng Portfolio",
    author: "Rui Zeng",
    url: "https://ruizeng.dev/",
    description:
      "PhD in Artificial Intelligence showcasing expertise in full-stack development, data engineering, and scalable system design",
    type: "portfolio",
    language: "en",
    last_updated: now,
    topics: [
      "Artificial Intelligence",
      "Machine Learning",
      "Full Stack Development",
      "Data Engineering",
      "System Design",
      "LLM Applications",
      "Cloud Architecture",
      "TypeScript",
      "Python",
      "React",
    ],
    social_profiles: {
      linkedin: "https://www.linkedin.com/in/rui-zeng/",
      github: "https://github.com/ruizengalways",
      email: "r.zeng@outlook.com",
    },
    sections: [
      {
        id: "hero",
        title: "Hero Section",
        description: "Introduction and professional headline",
        url: "/#hero",
      },
      {
        id: "about",
        title: "About",
        description: "Background and professional summary",
        url: "/#about",
      },
      {
        id: "expertise",
        title: "Expertise Areas",
        description: "Core competencies and technical specialties",
        url: "/#expertise",
      },
      {
        id: "research",
        title: "Research & Publications",
        description: "Academic and professional research contributions",
        url: "/#research",
      },
      {
        id: "projects",
        title: "Projects",
        description: "Showcased projects and technical work",
        url: "/#projects",
      },
      {
        id: "skills",
        title: "Technical Skills",
        description: "Programming languages, frameworks, and tools",
        url: "/#skills",
      },
      {
        id: "contact",
        title: "Contact",
        description: "Get in touch and send messages",
        url: "/#contact",
      },
    ],
    metadata: {
      ai_friendly: true,
      llm_optimized: true,
      structured_data: "JSON-LD",
      schema_types: ["Person", "WebPage", "ItemList"],
      robots_txt: true,
      sitemap_xml: true,
      semantic_html: true,
    },
    crawlers_allowed: [
      "GPTBot",
      "PerplexityBot",
      "anthropic-ai",
      "claude-web",
      "CCBot",
      "Googlebot",
      "Bingbot",
    ],
  };
}

/**
 * Write metadata to file
 */
function writeMetadata(): void {
  try {
    const metadata = generateAIDiscoveryMetadata();
    const dir = path.dirname(OUTPUT_PATH);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(metadata, null, 2), "utf-8");
    console.log(`✅ AI Discovery metadata generated: ${OUTPUT_PATH}`);
    console.log(`   Sections: ${metadata.sections.length}`);
    console.log(`   Crawlers allowed: ${metadata.crawlers_allowed.length}`);
  } catch (error) {
    console.error("❌ Failed to generate AI discovery metadata:", error);
    process.exit(1);
  }
}

/**
 * Main execution
 */
writeMetadata();

export { generateAIDiscoveryMetadata };
