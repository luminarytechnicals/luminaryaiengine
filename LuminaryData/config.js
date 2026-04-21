/**
 * LUMINARY AI — PROJECT CONFIGURATION
 * LuminaryData/config.js
 */

const LUMINARY_CONFIG = {
  PROJECT_NAME: "Luminary AI LLM Engine",
  AUTHOR: "Abhinav Ranjan",
  GITHUB_USER: "DeveloperAbhinav",
  COMMUNITY: "Luminary Technicals",
  GITHUB_ORG: "luminarytechnicals",
  SPONSOR: "Luminary Trust",
  
  // Repository Details
  REPO_NAME: "luminaryaiengine",
  
  // External Links
  GITHUB_URL: "https://github.com/luminarytechnicals/luminaryaiengine",
  GITHUB_ORG_URL: "https://github.com/luminarytechnicals",
  GITHUB_AUTHOR_URL: "https://github.com/luminarytechnicals", // Using org as primary contact
  WEBSITE_URL: "https://luminaryaiengine.netlify.app",
  
  // Documentation Modals
  DOCS_URL: "LuminaryEngine/Developer Notes/README.md",
  TERMS_URL: "LuminaryEngine/Developer Notes/TERMS.md",
  API_URL: "LuminaryEngine/Developer Notes/API.md",
  SECURITY_URL: "LuminaryEngine/Developer Notes/SECURITY.md",
  CONTRIBUTING_URL: "LuminaryEngine/Developer Notes/CONTRIBUTING.md",
  
  // Data Destinations
  HUGGINGFACE_URL: "https://huggingface.co/luminarytechnicals",
  
  // Versions
  VERSION: "1.0.0-beta",
  BUILD_DATE: "2026-04-21"
};

// Export for use in HTML via script tag
if (typeof window !== 'undefined') {
  window.LUMINARY_CONFIG = LUMINARY_CONFIG;
}
