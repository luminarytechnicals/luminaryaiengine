# Luminary AI Engine

**Multi-model prompt engineering. Better prompts through model collaboration.**

Luminary AI Engine is an open-source prompt engineering workspace published and maintained by **Luminary Technicals**. It uses language models through OpenRouter to help users draft, analyse, compare, critique and refine prompts before using them with an AI system.

The Engine is an interface and orchestration layer. It is not a foundation model and does not own or train the third-party models it connects to.

## Core purpose

1. Start with a task description or an initial prompt.
2. Use supported model workflows to produce and examine prompt candidates.
3. Compare clarity, completeness, relevance and instruction coverage.
4. Refine the selected candidate and let the user review the final prompt.
5. Copy or reuse the prompt with the AI system of the user's choice.

## Main capabilities

- **Multi-model prompt engineering:** Use models available through OpenRouter to draft, critique and improve prompt candidates.
- **ULTRAPLINIAN:** Multi-model orchestration, candidate comparison and evaluation workflows.
- **AutoTune:** Context-adaptive sampling and request parameters.
- **Liquid Response / STM:** Response refinement and semantic transformation workflows.
- **Parseltongue:** Controlled input perturbation and robustness research.
- **Optional API:** A self-hostable Express API with OpenAI-compatible endpoints and gated research capabilities.

Model access, availability, prices and provider-specific features depend on third-party services and the user's account.

## Project architecture

The repository contains multiple surfaces:

- `index.html`: project landing page and product overview.
- `LuminaryEngine/index.html`: standalone browser application.
- `LuminaryData/`: landing-page assets and shared project configuration.
- `LuminaryEngine/src/`: modular TypeScript frontend components and libraries.
- `LuminaryEngine/api/`: optional Express API server.
- `LuminaryEngine/Developer Notes/`: technical documentation, privacy notes, terms and security policy.
- `features/` and `docs/`: crawlable product and API documentation.
- `netlify/edge-functions/`: deployment edge controls and generally applicable request handling.

The standalone production interface is a browser-based HTML/CSS/JavaScript application. The modular TypeScript/Next.js implementation and optional API are separate development/deployment surfaces; the static website should not be assumed to expose the API unless it is separately deployed.

## Getting started

1. Clone the repository:

   ```bash
   git clone https://github.com/luminarytechnicals/luminaryaiengine.git
   ```

2. Serve the repository using a local static server. For example:

   ```bash
   python -m http.server 8000
   ```

3. Open `http://localhost:8000/` and launch the Engine.
4. Add your own OpenRouter API key in Settings.

Directly opening local files may restrict browser features such as service workers and some Web Crypto functionality. A local HTTP server is recommended.

## Privacy and data handling

- Standalone conversations and settings are stored in browser storage.
- The OpenRouter API key is stored in an encrypted representation when Web Crypto is available.
- No-Log Mode is enabled by default. It requests eligible OpenRouter Zero Data Retention routing and disables optional browser performance telemetry.
- Optional API deployments have separate content-free operational metadata handling.
- Research dataset contribution is opt-in. The current dataset implementation does not include automatic PII scrubbing; do not submit sensitive information when contribution is enabled.
- Read the [Privacy Policy](https://luminaryaiengine.dpdns.org/privacy.html), [Cookie Policy](https://luminaryaiengine.dpdns.org/cookies.html) and [Terms & Conditions](https://luminaryaiengine.dpdns.org/terms.html).

## Domain and organization

Luminary AI Engine is a Luminary Technicals project. The public hostname uses the `dpdns.org` namespace; this does not imply affiliation with DigitalPlat Domains, DPDNS or related provider entities. Read the [Domain Policy](https://luminaryaiengine.dpdns.org/domain-licence.html).

The temporary India-specific hosted-access restriction was removed after the applicable legal request was revoked on 10 November 2026. Hosted availability remains subject to applicable law, provider availability and generally applicable security controls.

## Contact and support

For product help, technical questions or feedback, contact [luminaryaiengine@luminarytechnicals.dpdns.org](mailto:luminaryaiengine@luminarytechnicals.dpdns.org). For privacy and legal matters, use [legal@luminarytechnicals.dpdns.org](mailto:legal@luminarytechnicals.dpdns.org). Security reports should follow the [Security Policy](https://luminaryaiengine.dpdns.org/security.html) and must not be posted publicly before coordinated disclosure.

- [Contact & Support](https://luminaryaiengine.dpdns.org/contact.html)
- [Security Policy](https://luminaryaiengine.dpdns.org/security.html)

## Credits and licence

Created by **AR. Abhinav Ranjan**. Published and maintained by **Luminary Technicals**. The repository credits **Luminary Trust** as sponsor.

The source is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. Third-party services, model names, trademarks and separately licensed assets remain subject to their respective rights and terms.

- [Credits](https://luminaryaiengine.dpdns.org/credits.html)
- [Source repository](https://github.com/luminarytechnicals/luminaryaiengine)
- [AGPL-3.0 licence](https://www.gnu.org/licenses/agpl-3.0.html)
