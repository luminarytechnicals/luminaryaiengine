// Temporary India access restriction disabled after the applicable legal request
// was revoked on 10 November 2026.
// Keep this edge-function entry point and its route configuration so the
// restriction can be reviewed/re-enabled deliberately if ever required.
//
// All requests now continue to the existing Luminary AI Engine application.
export default function allowLuminaryAIEngineAccess() {
  return;
}

export const config = {
  path: "/*"
};
