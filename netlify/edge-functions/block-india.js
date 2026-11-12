// Temporary India-specific access restriction disabled after the applicable
// legal request was revoked on 10 November 2026.
// Keep this edge-function entry point and route configuration as a pass-through.
// No application files, algorithms, models, APIs, or unrelated security controls
// are changed by this temporary restoration.
export default function allowLuminaryAIEngineAccess() {
  return;
}

export const config = {
  path: "/*"
};
