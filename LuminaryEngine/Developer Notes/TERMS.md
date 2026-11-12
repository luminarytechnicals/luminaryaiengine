# Luminary AI Engine — Terms of Service

**Last updated:** 2026-11-08

---

## 1. Acceptance

By using Luminary AI Engine — whether through the hosted website, optional API server, or a self-hosted deployment — you agree to these terms. If you do not agree, do not use the software.

---

## 2. What Luminary AI Engine Is

Luminary AI Engine is an open-source multi-model prompt engineering workspace. It uses language models to help draft, analyse, compare, critique and refine prompts. It is an interface and orchestration layer, not a foundation model. The project is created by AR. Abhinav Ranjan and published and maintained by Luminary Technicals.

---

## 3. Data Collection

Luminary AI Engine has separate browser and optional API-server data paths. The standalone browser app does not upload chat history by default, but an optional API deployment can record operational metadata, and the API dataset feature can store message content when explicitly requested.

### Overview

| Data path | Where it runs | Default | Content stored? |
|---|---|---|---|
| API operational metadata | Optional Express API server | On for API requests | No prompt or response text |
| Browser telemetry | Standalone app and telemetry proxy | Off by default while No-Log Mode is enabled | No prompt or response text |
| Research dataset | Optional Express API server | Off; requires contribute_to_dataset: true | Yes, messages and response |

### Tier 1: API operational metadata

When a request is made to the optional Express API, the API records operational metadata such as timestamps, endpoint, mode, model identifiers, model scores, durations, response lengths, success/failure categories and enabled pipeline flags. The metadata module does not intentionally store prompts, system prompts or response text.

The metadata is held in server memory and may be published as JSONL to the Hugging Face repository configured by the deployment's HF_DATASET_REPO and HF_TOKEN environment variables. Publishing is not enabled unless those environment variables are configured. The API metadata tracker is separate from the standalone browser app's No-Log Mode.

### Tier 2: browser performance telemetry

The standalone browser app has a No-Log Mode that is enabled by default. When it is enabled, the browser does not buffer or send client performance telemetry. It also asks OpenRouter to route inference only to endpoints marked Zero Data Retention and to deny providers that non-transiently collect request data.

When a user turns No-Log Mode off, the browser may send allowlisted operational events to the /api/telemetry endpoint. Events can include an ephemeral session identifier, timestamp, selected mode/model, duration, response length, success/failure, model-race metrics and non-content pipeline settings. The telemetry proxy applies an additional allowlist to nested fields before publishing a JSONL batch, if the Hugging Face environment is configured.

Client telemetry does not intentionally include prompts, conversation messages, response text or API key values. The Cloudflare/hosting provider may independently process network and request metadata under its own terms. No-Log Mode is a client-side control; it does not change the optional API server's own metadata policy.

OpenRouter's provider.zdr and provider.data_collection routing preferences only apply to eligible inference endpoints. A request can fail when no eligible endpoint is available. ZDR does not prevent the model provider from processing the request to generate an answer, and it does not erase operational metadata held by OpenRouter, the hosting provider or other infrastructure.

### Tier 3: opt-in research dataset

The optional API accepts contribute_to_dataset: true for requests that should be added to the research dataset. This option is false by default. When explicitly enabled, the API stores the submitted non-system messages and final response, along with associated model and pipeline metadata.

Important: the current dataset storage code does not implement an automatic PII scrubber. Do not submit names, addresses, credentials, health information, financial details or other sensitive content when dataset contribution is enabled. If Hugging Face publishing is configured, the contributed content may be published to a public dataset and copied or redistributed by others.

The dataset is held in server memory first, with a configured capacity limit. When publishing is configured, batches may be uploaded to the configured Hugging Face dataset. Deletion through the API only applies while an entry is still available in the in-memory buffer; it cannot guarantee removal of already published copies.

### What is not intentionally collected by the application

The application code does not intentionally add users' OpenRouter API key values, authentication tokens or IP addresses to telemetry or operational-metadata records. This does not prevent a user from pasting sensitive information into a prompt that is later sent to a third-party model or, when opted in, included in the research dataset. Hosting and network providers may process connection metadata under their own policies.

## 4. Data Storage and Publishing

### Standalone browser application

The standalone app stores conversations and the user's API key in browser storage. Conversation history is not synchronized to a Luminary AI Engine account. Clearing browser storage can permanently delete local history. The API key is protected using browser Web Crypto before it is stored when that capability is available, but browser-side encryption does not protect against malicious same-origin JavaScript, browser extensions with access, or a compromised device.

### Optional API server

The Express API keeps operational metadata and opt-in dataset entries in memory. Metadata buffers have a finite capacity and may be evicted if publishing is unavailable. Dataset entries are also bounded in memory. An application restart can discard entries that have not been published.

### Hugging Face publishing

Publishing requires the deployment operator to configure HF_TOKEN and HF_DATASET_REPO. When configured, metadata and opt-in dataset batches may be committed to that destination. Published files can be public depending on the repository's visibility and Hugging Face settings. The destination, visibility and access controls are controlled by the deployment operator.

Self-hosted deployments can disable automatic Hugging Face publishing by leaving the publishing environment variables unset. In that case, in-memory buffers remain subject to capacity limits and server restarts.

### Deletion

Dataset entries can be deleted by identifier while they remain in the API server's in-memory dataset buffer. After publication, deletion from the live buffer does not remove copies already downloaded, forked, cached or redistributed. Operational metadata does not currently provide an individual end-user deletion endpoint.

## 5. API Keys, Credentials, and Chat History

### Standalone browser application

In the standalone browser app, the OpenRouter key is entered by the user and stored in that browser's local storage in an encrypted representation when Web Crypto is available. The key is sent to OpenRouter as part of model requests. The standalone app does not intentionally send that key to the Luminary AI Engine telemetry endpoint.

No account or cross-device chat synchronization is provided. Conversations stay in the browser's local storage and may be lost when browser data is cleared.

### Optional API integration

The optional API supports a deployment-side OpenRouter key or a caller-supplied key in the API request. A caller-supplied key must therefore be transmitted to the API server for that request. The application code does not intentionally persist or include API key values in its metadata records; deployment operators should separately review reverse-proxy, hosting and request logs.

Do not share API keys publicly or paste credentials into conversation content. No browser-side storage mechanism can protect a key from malicious scripts executing with access to the page.

## 6. Enterprise Use

### Who This Applies To

This section applies to **Enterprise Users** -- defined as any for-profit entity (or its subsidiaries, affiliates, or contractors acting on its behalf) that meets **any** of the following criteria:

- Annual gross revenue exceeding **$10 million USD**
- More than **100 employees** (full-time, part-time, or contracted)
- Is publicly traded on any stock exchange
- Is a subsidiary, division, or affiliate of an entity that meets any of the above criteria

If you're an individual, a researcher, a student, a hobbyist, a small team, a nonprofit, an educational institution, a government research lab, or a company that doesn't meet the thresholds above -- **this section does not apply to you. LUMINARY AI ENGINE is free for you. Full stop.**

### What Enterprise Users Must Do

Enterprise Users that use the Luminary AI Engine hosted service (the API server, the web frontend hosted by the project, or any project-operated infrastructure) in any capacity -- including internal tools, employee-facing products, customer-facing products, evaluation, benchmarking, or integration -- must obtain a **Commercial Use License** from the LUMINARY AI ENGINE maintainers.

This applies to:

- **Direct use** of the hosted service or API
- **Embedding** the hosted service into enterprise products, platforms, or workflows
- **Using data collected via the hosted service** (Tier 1, 2, or 3) for commercial purposes such as model training, product development, competitive analysis, or internal research that feeds into commercial products

### What Enterprise Users Get

A Commercial Use License includes:

- Authorized use of the hosted LUMINARY AI ENGINE service for enterprise purposes
- Priority support channel
- SLA guarantees (negotiated per agreement)
- Custom data handling and retention terms (if needed)
- Exemption from the default data publishing pipeline (Tiers 1 and 2) if contractually agreed

### What This Does NOT Apply To

To be absolutely clear, the following uses are **always free, for everyone, including enterprises**:

- **Self-hosting LUMINARY AI ENGINE from source code** under the AGPL-3.0 license. The source code license is separate from these service terms. If you clone the repo, run it on your own servers, and comply with the AGPL-3.0 (keep your derivative works open source), you owe nothing.
- **Contributing to the project** via pull requests, issues, documentation, or community support.
- **Academic or nonprofit research** using the hosted service, regardless of institutional size.
- **Personal use** by employees of enterprise entities acting in their individual capacity, on their own time, with their own API keys.

### Pricing

Pricing for Commercial Use Licenses is negotiated on a case-by-case basis. Enterprise Users should contact the maintainers to discuss terms.

### Enforcement

Enterprise Users accessing the hosted service without a Commercial Use License are in violation of these terms. The maintainers reserve the right to:

- Revoke access to the hosted service
- Pursue reasonable compensation for unauthorized commercial use
- Publicly disclose violations (after a 30-day private notice and cure period)

We're not looking to sue anybody. We'd rather have a conversation. But if a billion-dollar company is extracting value from this project and contributing nothing back -- neither code, nor funding, nor even acknowledgment -- that's not the spirit of open source. This clause exists to keep things fair.

### Data Licensing for Enterprise

Enterprise Users that access the publicly published research dataset (on HuggingFace) for commercial purposes -- including model training, fine-tuning, product development, or competitive intelligence -- must obtain a **Data Use License** from the LUMINARY AI ENGINE maintainers.

Non-commercial research use of the published dataset is always free.

---

## 7. Your Responsibilities

By using Luminary AI Engine, you agree that:

- **You are responsible for the outputs generated through this tool.** LUMINARY AI ENGINE is a research interface -- it does not generate content itself, it routes requests to AI models via third-party APIs.
- **You will comply with all applicable laws and regulations** in your jurisdiction when using this tool.
- **You will comply with the terms of service of the underlying AI providers** (e.g., OpenRouter, and the model providers accessible through it).
- **You will not use LUMINARY AI ENGINE to generate content that is illegal** in your jurisdiction.
- **If you opt in to dataset contribution (Tier 3), you accept that your conversation data will be published publicly** as part of an open research dataset.

---

## 8. No Warranty / Disclaimer

LUMINARY AI ENGINE IS PROVIDED "AS-IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

The maintainers and contributors of LUMINARY AI ENGINE:

- Make no guarantees about uptime, availability, or correctness.
- Are not liable for any damages arising from the use of this software.
- Are not responsible for the content generated by third-party AI models accessed through this tool.
- Are not responsible for any costs incurred through third-party API usage (e.g., OpenRouter charges).

Use this tool at your own risk.

---

## 9. Third-Party Services

Luminary AI Engine interacts with third-party services. Your use of these services is governed by their respective terms:

| Service | Role | Their Terms |
|---|---|---|
| **OpenRouter** | Routes requests to AI models | [openrouter.ai/terms](https://openrouter.ai/terms) |
| **HuggingFace** | Hosts published metadata and dataset files | [huggingface.co/terms-of-service](https://huggingface.co/terms-of-service) |
| **Cloudflare Pages** | Hosts the web frontend and telemetry proxy | [cloudflare.com/terms](https://www.cloudflare.com/terms/) |

Luminary AI Engine is not affiliated with, endorsed by, or sponsored by any of these services.

---

## 10. Open Source

LUMINARY AI ENGINE is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

The entire Luminary AI Engine source code is available for inspection. Every claim made in this document can be verified by reading the code:

- Tier 1 metadata: `api/lib/metadata.ts`
- Tier 2 telemetry: `src/lib/telemetry.ts`
- Tier 3 dataset: `api/lib/dataset.ts`
- HuggingFace publishing: `api/lib/hf-publisher.ts`

You do not need to trust this document. Read the code.

---

## 11. Changes to These Terms

These terms may be updated as the project evolves. Changes will be committed to the repository and visible in the git history. There is no email notification system -- if you use LUMINARY AI ENGINE, check this file periodically.

The "Last updated" date at the top of this document reflects the most recent revision.

Public policy pages: [Terms & Conditions](https://luminaryaiengine.dpdns.org/terms.html) · [Privacy Policy](https://luminaryaiengine.dpdns.org/privacy.html) · [Cookie Policy](https://luminaryaiengine.dpdns.org/cookies.html) · [Domain Policy](https://luminaryaiengine.dpdns.org/domain-licence.html).

---

## 12. Contact

Luminary AI Engine is an open-source project. The best way to reach the maintainers is through the project's GitHub repository:

- **Questions or concerns:** Open a GitHub issue.
- **Data deletion requests:** Open a GitHub issue or use the `DELETE /v1/dataset/:id` API endpoint for Tier 3 data.
- **Enterprise licensing inquiries:** Open a GitHub issue tagged `enterprise` or contact Abhinav Ranjan via Luminary Technicals.
- **Security issues:** See [SECURITY.md](SECURITY.md) for responsible disclosure. Do NOT open public issues for vulnerabilities.

---

*These terms distinguish local browser storage, content-free operational metadata and explicitly opted-in research-dataset content. No-Log Mode is enabled by default in the standalone app. Optional API deployments have separate data-handling behavior; review the deployment configuration and source before sending sensitive information.*
