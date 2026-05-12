/**
 * StructuredData Component
 * Injects JSON-LD schemas for better LLM and AI search engine discoverability
 * Uses centralized portfolioMetadata for consistency and maintainability
 */

import { portfolioMetadata } from "../constants/llm-portfolio-metadata";

export const StructuredData = () => {
  // Transform portfolioMetadata into Person schema
  const portfolioSchema = {
    "@context": "https://schema.org/",
    "@type": "Person",
    "@id": portfolioMetadata.social_and_web.website,
    name: portfolioMetadata.identity.name,
    url: portfolioMetadata.social_and_web.website,
    description: portfolioMetadata.professionalSummary.elevator_pitch,
    jobTitle: portfolioMetadata.identity.title.split(", "),
    knowsAbout: [
      ...portfolioMetadata.competencies.artificial_intelligence.skills,
      ...portfolioMetadata.competencies.full_stack_development.skills,
      ...portfolioMetadata.competencies.data_engineering.skills,
      ...portfolioMetadata.competencies.system_design.skills,
    ],
    email: portfolioMetadata.social_and_web.email,
    sameAs: [
      portfolioMetadata.social_and_web.linkedin,
      portfolioMetadata.social_and_web.github,
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "PhD",
      educationalLevel: "Doctorate",
      name: portfolioMetadata.identity.credentials.degree,
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Queensland University of Technology",
    },
  };

  // WebPage schema for the portfolio site
  const resumeSchema = {
    "@context": "https://schema.org/",
    "@type": "WebPage",
    name: `${portfolioMetadata.identity.name} - Portfolio & Resume`,
    url: portfolioMetadata.social_and_web.website,
    description: `Interactive portfolio showcasing projects, expertise, and skills in ${portfolioMetadata.identity.title.toLowerCase()}.`,
    mainEntity: {
      "@type": "Person",
      name: portfolioMetadata.identity.name,
    },
  };

  // Transform competencies into ItemList schema
  const skillsSchema = {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    name: `${portfolioMetadata.identity.name}'s Technical Skills`,
    itemListElement: Object.values(portfolioMetadata.competencies).map(
      (competency, index) => ({
        "@type": "Thing",
        position: index + 1,
        name: competency.category,
        description: competency.skills.join(", "),
      }),
    ),
  };

  const consolidatedSchema = {
    "@context": "https://schema.org",
    "@graph": [portfolioSchema, resumeSchema, skillsSchema],
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(consolidatedSchema)}
    </script>
  );

  // return (
  //   <>
  //     <script type="application/ld+json">
  //       {JSON.stringify(portfolioSchema)}
  //     </script>
  //     <script type="application/ld+json">{JSON.stringify(resumeSchema)}</script>
  //     <script type="application/ld+json">{JSON.stringify(skillsSchema)}</script>
  //   </>
  // );
};
