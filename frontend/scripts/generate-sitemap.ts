import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// Import your central metadata
import { portfolioMetadata } from "../src/constants/llm-portfolio-metadata";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Normalize the website URL (remove trailing slash if exists)
const WEBSITE_URL = portfolioMetadata.social_and_web.website.replace(/\/$/, "");
const OUTPUT_PATH = path.join(__dirname, "../public/sitemap.xml");

/**
 * Generate XML sitemap from sections defined in portfolioMetadata
 */
function generateSitemap(): string {
  const lastmod = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const urlElements = portfolioMetadata.portfolio_sections
    .map((section) => {
      // Logic: The 'hero' section is usually the root home page
      const isRoot = section.id === "hero";
      const path = isRoot ? "/" : `/#${section.id}`;

      // Assigning priorities based on section importance
      let priority = "0.8";
      if (isRoot) priority = "1.0";
      if (section.id === "projects" || section.id === "expertise")
        priority = "0.9";

      return `
  <url>
    <loc>${WEBSITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${isRoot ? "weekly" : "monthly"}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>\n`;
}

/**
 * Write sitemap to the public directory
 */
function writeSitemap(): void {
  try {
    console.log("🚀 Starting sitemap generation...");

    const sitemap = generateSitemap();
    const dir = path.dirname(OUTPUT_PATH);

    // Ensure public directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, sitemap, "utf-8");

    console.log(`✅ Sitemap generated successfully at: ${OUTPUT_PATH}`);
    console.log(
      `📊 Total URLs: ${portfolioMetadata.portfolio_sections.length}`,
    );
    console.log(`🔗 Primary Domain: ${WEBSITE_URL}`);
  } catch (error) {
    console.error("❌ Failed to generate sitemap:", error);
    // Exit with error code so the build process stops if this fails
    process.exit(1);
  }
}

// Execute the writer
writeSitemap();

export { generateSitemap };
