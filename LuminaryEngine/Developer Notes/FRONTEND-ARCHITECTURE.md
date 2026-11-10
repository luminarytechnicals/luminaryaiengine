# Frontend architecture and migration boundary

The repository currently contains two frontend surfaces:

1. **Static production engine** — `LuminaryEngine/index.html`. Its primary stylesheet and runtime have been extracted into `LuminaryEngine/assets/engine.css` and `LuminaryEngine/assets/engine.js`, leaving the HTML as a document shell and preserving existing DOM IDs and inline event handlers.
2. **Component-based Next.js frontend** — `LuminaryEngine/src/app` and `LuminaryEngine/src/components`. The page is composed from Sidebar, ChatArea, SettingsModal and WelcomeScreen, with shared state in the Zustand store and model access in `src/lib/openrouter.ts`.

The static app remains the production-compatible entry point while the modular Next.js frontend is built and checked by CI. Do not redirect the live launch route to the Next.js app until deployment routing, parity of privacy settings, conversation migration and mobile behavior have been verified.

## Follow-on modularization boundary

Move feature groups from `assets/engine.js` into isolated modules only when each module has an explicit interface and regression tests. Keep storage migration, streaming cancellation, image attachments, No-Log behavior, dataset consent and model-race behavior covered before switching the production entry point. Avoid a one-shot rewrite that changes the live route and runtime simultaneously.
