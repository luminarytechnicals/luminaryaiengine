```
██      ██    ██ ███    ███ ██ ███    ██  █████  ██████  ██    ██
██      ██    ██ ████  ████ ██ ████   ██ ██   ██ ██   ██  ██  ██
██      ██    ██ ██ ████ ██ ██ ██ ██  ██ ███████ ██████    ████
██      ██    ██ ██  ██  ██ ██ ██  ██ ██ ██   ██ ██   ██    ██
███████  ██████  ██      ██ ██ ██   ████ ██   ██ ██   ██    ██
───────────────────────────────────────────────────────────────
        L U M I N A R Y   A I   E N G I N E
───────────────────────────────────────────────────────────────
```

# 🚀 LUMINARY AI ENGINE

**Developer:** Abhinav Ranjan
**Organization:** Luminary Technicals

---

## 🧠 Overview

Luminary AI Engine is published and maintained by Luminary Technicals. Its primary purpose is multi-model prompt engineering: using model collaboration to help users create and refine better prompts.

**Luminary AI Engine** is a multi-model prompt engineering workspace built for:

* Advanced AI interaction
* Research & red-teaming
* Adaptive inference control
* Real-time output optimization

It is a multi-model prompt engineering workspace that uses language models to draft, analyse, compare, critique and refine prompts. It is an orchestration interface, not a foundation model.

---

## ✨ Core Capabilities

* 🧠 **Multi-Model Orchestration**
  Seamlessly interact with 50+ models across providers using a unified interface.

* ⚡ **Parallel Intelligence Engine**
  Run multiple models simultaneously and select the highest-quality response.

* 🎛 **Adaptive Parameter Engine (AutoTune)**
  Automatically adjusts temperature, top_p, penalties, and other parameters based on context.

* 🐍 **Input Transformation Engine**
  Applies structured perturbations to test robustness and explore model behavior.

* ⚡ **Semantic Output Processing (STM)**
  Cleans, refines, and optimizes responses in real-time.

* 📊 **Scoring & Evaluation System**
  Ranks outputs using a multi-factor scoring model (quality, structure, relevance).

---

## ⚡ Engine Architecture

The system is composed of five primary modules:

1. **Context Detection & Parameter Selection**
2. **Input Transformation Layer**
3. **Model Inference Layer (Multi-Model)**
4. **Response Transformation (STM Modules)**
5. **Evaluation & Scoring Engine**

Each module operates independently and can be combined or disabled based on requirements.

---

## 🌐 API Overview

| Endpoint                 | Method | Description                             |
| ------------------------ | ------ | --------------------------------------- |
| `/v1/autotune/analyze`   | POST   | Context detection + parameter selection |
| `/v1/transform`          | POST   | Output transformation                   |
| `/v1/chat/completions`   | POST   | Standard inference pipeline             |
| `/v1/engine/completions` | POST   | Full multi-model pipeline               |
| `/v1/feedback`           | POST   | Submit feedback for learning            |
| `/v1/dataset/export`     | GET    | Export collected dataset                |
| `/v1/metadata/stats`     | GET    | System statistics                       |
| `/v1/health`             | GET    | Health check                            |

---

## 🔐 Privacy & Data Philosophy

* No login system
* No cookies or tracking
* API keys remain client-side
* Metadata-only telemetry (no message content)
* Optional dataset contribution (explicit opt-in)

User data is fully controlled by the user and never stored without consent.

---

## 🛠 Tech Stack

* Frontend: Vanilla HTML, CSS, JavaScript
* Backend (optional): Node.js + Express
* API Routing: Multi-provider gateway
* Storage: In-browser localStorage

---

## 📦 Deployment

### Local

```
python3 -m http.server 8000
```

Open in browser.

### Static Hosting

Deploy `index.html` on:

* Netlify
* Vercel
* Cloudflare Pages
* GitHub Pages

---

## 🎯 Use Cases

* AI Research & Testing
* Multi-model benchmarking
* Prompt engineering
* Output optimization
* Educational experimentation

---

## 📜 License

Open-source under AGPL-3.0.

---

## 🜏 Philosophy

> Intelligence should be explored, not restricted.
> Systems should be transparent, not opaque.
> Users should control AI — not the other way around.

---

**LUMINARY AI ENGINE is not just a tool — it is an intelligence framework.**
