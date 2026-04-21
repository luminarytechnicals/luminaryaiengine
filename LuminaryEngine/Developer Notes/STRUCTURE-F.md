# 🗂 Luminary AI LLM Engine — Project Structure

> Complete file map and role of every file in the project.

```
Luminary-AI-LLM-ENGINE/
│
├── index.html                        ← 🌐 LANDING PAGE (start here)
│
├── LuminaryData/                     ← 🎨 CSS assets for landing page
│   └── landing.css                   ← All styles for index.html
│
└── LuminaryEngine/                   ← 🧠 THE AI ENGINE
    │
    ├── index.html                    ← ⚡ Main AI chat application (single-file)
    │
    ├── Developer Notes/              ← 📚 All documentation
    │   ├── README.md                 ← Project overview & quick-start guide
    │   ├── API.md                    ← Full API reference (endpoints, tiers)
    │   ├── CONTRIBUTING.md           ← How to contribute (PRs, branching)
    │   ├── SECURITY.md               ← Vulnerability reporting policy
    │   ├── TERMS.md                  ← Terms of service & data transparency
    │   └── LICENSE                   ← AGPL-3.0 full license text
    │
    ├── src/                          ← 📦 Next.js modular frontend (optional)
    │   ├── app/
    │   │   ├── globals.css           ← Global Tailwind CSS styles
    │   │   ├── layout.tsx            ← Root HTML layout, metadata, providers
    │   │   └── page.tsx              ← Next.js route entry point
    │   ├── components/
    │   │   ├── ChatArea.tsx          ← Main chat message display area
    │   │   ├── ChatInput.tsx         ← Message input, send, image upload
    │   │   ├── ChatMessage.tsx       ← Individual message renderer + markdown
    │   │   ├── ModelSelector.tsx     ← Model dropdown & mode switcher
    │   │   ├── PersonaSelector.tsx   ← Persona/theme toggle UI
    │   │   ├── Providers.tsx         ← React context/Zustand provider wrapper
    │   │   ├── SettingsModal.tsx     ← Full settings panel (API keys, modes)
    │   │   ├── Sidebar.tsx           ← Conversation list sidebar
    │   │   └── WelcomeScreen.tsx     ← Empty-state welcome with suggestions
    │   ├── hooks/
    │   │   ├── useApiAutoDetect.ts   ← Auto-detects available API keys
    │   │   └── useEasterEggs.ts      ← Konami code + hidden easter eggs
    │   ├── lib/
    │   │   ├── autotune.ts           ← AutoTune: context-adaptive sampling params
    │   │   ├── autotune-feedback.ts  ← EMA learning loop from thumbs up/down
    │   │   ├── classify.ts           ← Query classification engine (5 types)
    │   │   ├── classify-llm.ts       ← LLM-based query classifier
    │   │   ├── godmode-prompt.ts     ← Core L1B3RT4S prompt templates
    │   │   ├── libertas.ts           ← LUMINARY CLASSIC combo racing logic
    │   │   ├── openrouter.ts         ← OpenRouter API client & streaming
    │   │   ├── parseltongue.ts       ← 33 input obfuscation techniques
    │   │   └── telemetry.ts          ← Anonymous structural telemetry (opt-out)
    │   ├── stm/
    │   │   └── modules.ts            ← STM: Hedge Reducer, Direct Mode, Curiosity
    │   └── store/
    │       └── index.ts              ← Zustand global state store
    │
    ├── api/                          ← 🖥 Optional Express API proxy server
    │   ├── server.ts                 ← Main Express server (OpenRouter proxy)
    │   ├── tsconfig.json             ← TypeScript config for API
    │   ├── lib/                      ← API utility functions
    │   ├── middleware/               ← Auth, rate-limit, CORS middleware
    │   ├── routes/                   ← Express route handlers (/chat, /models)
    │   └── types/                    ← TypeScript type definitions for API
    │
    ├── HF/                           ← 🤗 HuggingFace Space standalone build
    │   ├── Dockerfile                ← Docker image for HF Space deployment
    │   ├── package.json              ← HF-specific dependencies
    │   ├── package-lock.json         ← Lockfile for HF build
    │   ├── src/                      ← HF Space frontend source
    │   └── api/                      ← HF Space API proxy
    │
    ├── research/                     ← 🔬 Evaluation & research scripts
    │   ├── eval_autotune_classification.ts   ← AutoTune classifier evaluation
    │   ├── eval_baselines.ts                 ← Baseline model comparisons
    │   ├── eval_feedback_convergence.ts      ← EMA feedback loop testing
    │   ├── eval_parseltongue_analysis.ts     ← Parseltongue effectiveness
    │   ├── eval_scoring_calibration.ts       ← Score metric calibration
    │   └── eval_stm_precision.ts             ← STM module precision testing
    │
    ├── paper/                        ← 📄 LaTeX research paper source
    │   ├── paper.tex                 ← Full academic paper (LaTeX source)
    │   └── references.bib            ← Academic bibliography
    │
    ├── public/                       ← 🖼 Static public assets
    │   └── favicon.svg               ← Luminary AI favicon (SVG)
    │
    ├── functions/                    ← ☁️ Cloudflare Pages / serverless functions
    │   └── api/                      ← API handler functions for edge deployment
    │
    ├── Dockerfile                    ← 🐳 Docker image (main app + API server)
    ├── Dockerfile.web                ← Docker image (web-only, no API)
    ├── docker-compose.yml            ← Docker Compose: web + API services
    ├── nginx.conf                    ← Nginx reverse-proxy configuration
    ├── _headers                      ← Cloudflare Pages HTTP response headers
    ├── _redirects                    ← Cloudflare Pages URL redirect rules
    │
    ├── next.config.js                ← Next.js configuration (modular frontend)
    ├── tailwind.config.ts            ← Tailwind CSS configuration
    ├── postcss.config.js             ← PostCSS configuration
    ├── tsconfig.json                 ← TypeScript configuration (root)
    ├── package.json                  ← Node.js dependencies & npm scripts
    ├── package-lock.json             ← Exact dependency lockfile
    │
    ├── ChatInput.tsx                 ← (root-level copy) Chat input component
    ├── SettingsModal.tsx             ← (root-level copy) Settings modal component
    └── dataset.ts                    ← Open research dataset collection logic
```

---

## How the Project Works

### Entry Points

| File | Purpose |
|------|---------|
| `index.html` (root) | **Landing page** — intro, features, credits, "Launch AI Engine" button |
| `LuminaryEngine/index.html` | **AI Engine** — the full single-file chat application |
| `api/server.ts` | **API proxy** — optional Express server for self-hosted OpenRouter proxy |

### Two Ways to Run the AI Engine

1. **Direct (zero install):** Open `LuminaryEngine/index.html` in any browser. Enter your OpenRouter API key in Settings.
2. **With API proxy:** Run `npm run api` to start the Express proxy, then `npm run dev` for the Next.js frontend.

### Key Design Decisions

- **Single-file architecture** — `LuminaryEngine/index.html` contains all UI, logic, and styles for maximum portability.
- **No server dependency** — The app works 100% in-browser with direct OpenRouter API calls.
- **LocalStorage state** — Conversations, settings, and API keys are stored locally. No cloud sync, no account.
- **Privacy by design** — No cookies, no PII. Telemetry is anonymous and opt-out.

### Documentation (Developer Notes/)

| File | Contents |
|------|---------|
| `README.md` | Quick-start, features, tech stack, deployment |
| `API.md` | REST API reference, authentication, endpoints, tiers |
| `PAPER.md` | Academic research paper on the evaluation framework |
| `CONTRIBUTING.md` | PR workflow, coding guidelines, branch naming |
| `SECURITY.md` | Responsible disclosure policy |
| `TERMS.md` | Three-tier data transparency policy, ToS |
| `LICENSE` | AGPL-3.0 full license text |

---

*Last updated: April 2026 · Maintained by Abhinav Ranjan & Luminary Technicals*
