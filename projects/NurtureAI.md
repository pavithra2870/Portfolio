# NurtureAI

A bilingual, multi-layered AI parenting assistant that triages health concerns, delivers structured advice, and recommends products — with hard safety guarantees that cannot be bypassed by the LLM.

---

# Elevator Pitch

Parenting is full of uncertainty, especially in the first few years. A baby cries inconsolably at 2 AM, a rash appears overnight, or a toddler swallows something they shouldn't. Most parents reach for their phone and search online, wading through contradictory forum posts and generic health articles that don't account for their child's age or specific symptoms.

NurtureAI is a conversational decision copilot built for parents. It accepts natural-language queries — by text or voice — and responds with structured, age-aware guidance: a plain-language summary of what is likely happening, concrete actionable advice, and contextually relevant product recommendations. When a situation is medically serious, it escalates clearly and immediately, without relying on an LLM to decide whether to do so.

What makes NurtureAI different from a general-purpose chatbot is its layered safety architecture. Risk classification runs through a deterministic rule engine before the LLM ever sees the query. For critical emergencies — a child not breathing, a newborn with fever, battery ingestion — the LLM is bypassed entirely and an instant hardcoded response is returned. Safety rules also run after the LLM, as a post-generation validator, so the system cannot hallucinate its way around a medical escalation.

The system supports English and Arabic, with voice input powered by AssemblyAI and automatic language detection. The result is a product that feels warm and empathetic in normal situations, and unambiguously urgent in dangerous ones.

---

# Product Overview

**Users:** Parents and caregivers of infants and toddlers, primarily in the 0–3 year age range. The bilingual design also targets Arabic-speaking families.

**Primary Workflow:** A parent types or speaks a question about their child. The system determines the child's age and symptoms from the query, classifies the risk level, retrieves relevant knowledge and product information, and returns a structured response card in the UI. If the language is Arabic or the user selects Arabic mode, a translated summary is appended.

**Core Functionality:**
- Conversational health and development guidance grounded in a curated knowledge base
- Contextual product recommendations tied to the specific situation and child age
- Risk triage with three levels: low, medium (doctor recommended), and critical (emergency)
- Voice input with English and Arabic language auto-detection
- Bilingual responses with RTL layout support for Arabic text

**Inputs:** Free-form text or voice audio describing a parenting concern, child age, and symptoms. Optional session ID for conversation continuity.

**Outputs:** A structured JSON response rendered as a rich card in the UI — situation summary, developmental stage label, numbered advice list, product cards, confidence score, safety alert, and optional Arabic summary.

**User Experience:** The interface uses a warm pastel design system with a chat layout. A welcome screen offers suggested prompts. A typing indicator signals processing. Safety alerts are visually distinct from normal advice. Low-confidence responses display a disclaimer. The voice input button sits inline with the text field and populates it after transcription so the parent can review before sending.

**Real-World Use Case:** A parent asks "My 6 week old has a fever of 100.4°F and seems lethargic." NurtureAI immediately classifies this as a critical emergency based on deterministic rules (newborn + fever), forces `doctor_flag=true` and `risk=critical`, and either returns an emergency template or augments the LLM response with an ER advisory — regardless of what the LLM would have said on its own.

---

# Problem Statement

Parents frequently face situations where they need fast, trustworthy guidance but lack access to a pediatrician at that moment. General web searches surface inconsistent results. Generic AI chatbots are helpful for everyday questions but dangerous for medical triage — they may understate risk, over-reassure, or simply not know when to escalate.

The deeper problem is that LLMs are probabilistic. They can produce confident-sounding responses for situations that warrant immediate emergency care. For a parent holding a sick child at midnight, a confident but wrong answer from an AI is worse than no answer.

Existing parenting apps are either content libraries (not conversational) or chatbots with no safety architecture. NurtureAI addresses the gap between "search engine" and "pediatrician on call" by combining conversational AI with hard deterministic safety constraints.

---

# Key Features

## Layered Safety Architecture

The most important engineering decision in the project: safety logic runs in two places, both outside the LLM's control.

**Pre-LLM rule engine** (`risk_engine.py`) evaluates the raw query against 30+ critical patterns and 15+ medium-risk patterns using compiled regex. It runs before any ML model or LLM. If it returns critical or medium, that result is authoritative — the ML classifier is only consulted when no rule fires. This means the LLM cannot produce a low-risk response for a query that contains "not breathing," "seizure," or "newborn fever."

**Emergency bypass** skips the LLM entirely for critical cases. The decision engine returns a hardcoded emergency template with pre-written 911 advice and Poison Control numbers. Response time drops to ~2 seconds instead of ~20 seconds, and there is no hallucination risk at all.

**Post-LLM safety layer** (`safety_layer.py`) re-evaluates the LLM's output. It checks for emergency patterns, high fever thresholds, newborn fever context, and dangerous ingestion keywords. It can override the LLM's `doctor_flag`, `risk_level`, and confidence score. For any medium-risk result, it forces `doctor_flag=true` regardless of what the LLM decided.

This architecture means safety guarantees are maintained even if the LLM produces an optimistic response.

## Hybrid Intent and Risk Classification

Intent classification uses a rules-first, ML-fallback approach. Explicit emergency signals (not breathing, seizure, battery) are matched by regex with 0.95 confidence before the ML classifier runs. A guard function prevents the ML model from upgrading a non-emergency query to emergency intent — it can only do so if an explicit signal is present.

Risk classification follows the same pattern: the rule engine is authoritative for critical and medium cases; TF-IDF + Logistic Regression is only used when no rule matches. This hybrid approach avoids the failure modes of pure ML (false positives on emotional queries, false negatives on unusual phrasing) while still handling cases not covered by explicit rules.

## Retrieval-Augmented Generation

The knowledge and product recommendation pipeline uses sentence-transformer embeddings stored in FAISS indexes. When a parent submits a query, the NLP extractor enriches it with the child's age and extracted symptoms before the vector search runs, improving semantic match quality. Separate indexes exist for parenting knowledge and product catalog, and product results are filtered post-retrieval by comparing against the top knowledge item's scenario keywords. This ensures recommended products actually relate to the specific situation, not just the query keywords.

The LLM prompt is strictly grounded: it is instructed to use only the retrieved context and explicitly told not to introduce facts outside it. This constrains hallucination to the space of retrieved content rather than the model's general knowledge.

## LLM Integration with Deterministic Guardrails

The decision engine communicates with a locally-hosted Ollama instance (default: llama3.2). Temperature is set low (0.25) to favor factual, consistent outputs over creative variation. The response format is enforced as strict JSON — the LLM is instructed to return no markdown, no explanation, only valid JSON. If the LLM response cannot be parsed, a deterministic fallback response is returned immediately.

Confidence scoring is handled at multiple levels: the LLM emits a confidence value, which is then capped by the system — vague queries (three words or fewer) are hard-capped at 0.60, and emergency responses that bypass the LLM emit a deterministic 0.97. This prevents overconfident responses on ambiguous inputs.

## Bilingual Support with Arabic

Arabic input is detected character-by-character using Unicode range matching. When Arabic is detected, the query is translated to English before any NLP extraction, ML classification, or RAG retrieval runs — ensuring the entire pipeline operates on English text. After the LLM generates an English response, the system translates the situation summary and top advice back to Arabic, appending it as a summary field. Emergency responses include a pre-written Arabic phrase so translation does not introduce latency in the critical path.

The frontend respects the `language` toggle and renders Arabic content with appropriate right-to-left context.

## Autonomous Data Generation

An admin endpoint accepts parameters and uses Ollama to generate new knowledge entries, product catalog items, and realistic parent query examples — with structured prompts for each. Generated data is deduplicated against existing seed data by scenario or product name before being merged and re-indexed. This means the knowledge base can be grown without manual curation, using the same LLM that powers the chat interface.

---

# Engineering Highlights

The backend is a FastAPI application using lifespan management to initialize all components (embedding model, FAISS indexes, ML classifiers, NLP extractor, voice handler) at startup, with graceful handling when components are unavailable. All I/O-bound operations — LLM calls, transcription, NLP extraction, ML inference — are run with `asyncio.to_thread` or async HTTP clients to keep the API non-blocking.

The pipeline executes NLP extraction, intent classification, and risk classification in parallel using `asyncio.gather`, reducing per-request latency. FAISS inner-product search operates on normalized embeddings, effectively computing cosine similarity without a normalization step at query time.

A health check endpoint exposes component status — Ollama availability, index build status, model load state, item counts, and API key configuration — enabling easy diagnostics without inspecting logs.

The frontend is a React 18 SPA built with Vite and styled with Tailwind CSS using a custom design token system (warm pastel palette, custom font pairings, named shadow scale). The chat interface uses `useCallback` and proper dependency arrays to avoid unnecessary re-renders. The textarea auto-resizes with the content. Voice input populates the text field for review before sending rather than submitting automatically, which prevents unintended emergency submissions from speech recognition errors.

Structured logging uses Loguru with file rotation (10 MB cap, 7-day retention) and colorized stderr output — production-ready observability without a logging service.

---

# AI / ML Components

**LLM (Ollama / llama3.2):** Runs locally. Used for parenting advice generation, Arabic-to-English translation, English-to-Arabic translation, and synthetic training data generation. Prompt engineering enforces strict JSON output, grounding instructions, and risk-level-specific behavior rules.

**RAG Pipeline:** Sentence-transformer embeddings (via `sentence-transformers`) indexed in FAISS using inner-product similarity. Two separate indexes: parenting knowledge (scenario, symptoms, guidance, red flags) and product catalog (name, category, use case, description, age range). Query enrichment with extracted age and symptom context before retrieval.

**Intent Classification:** TF-IDF + Logistic Regression with bigram features. Three classes: advice, product, emergency. Rule-based overrides take priority; ML is a fallback. A guard function prevents the model from declaring emergency intent unless explicit emergency signals are present in the text.

**Risk Classification:** TF-IDF + Logistic Regression, three levels: low, medium, critical. Subordinate to the rule-based engine — ML is only consulted when no critical or medium rule fires.

**NLP Extraction:** Custom regex-based extractor for child age (months, weeks, years, days, named stages) and symptom detection across 13 categories. Age and symptom context is passed to both the rule engine and the RAG query enrichment step.

**Voice Transcription:** AssemblyAI API with `language_detection=True` and the Universal-3 Pro speech model. Handles English and Arabic. Runs asynchronously to avoid blocking the event loop.

**Safety Layer:** Compiled regex patterns for 20+ emergency signals, high-fever thresholds, newborn fever context, and dangerous ingestion events. Runs post-LLM as a final validation pass. Can override `doctor_flag`, `risk_level`, and confidence.

**Synthetic Data Generation:** Ollama is prompted with structured templates to generate parenting knowledge entries and product catalog items at configurable volumes. Output is deduplicated against existing seed data and live-indexed into FAISS on generation.

---

# Data Engineering / Data Science Components

**Seed Knowledge Base:** Curated JSON entries covering 25+ parenting scenarios across age groups (0–3m, 3–6m, 6–12m, 12–24m, 2–3y). Each entry contains scenario name, symptom list, practical guidance, and red flag conditions. Designed to ground LLM outputs and prevent hallucination.

**Product Catalog:** Seed JSON of baby and toddler products with structured metadata (name, category, use case, age range, description). Indexed and searched semantically.

**Evaluation Suite:** A test suite in `tests/` with structured test cases (`test_cases.json`) and an evaluation script (`evaluate.py`) that exercises the API against predefined queries and expected outputs. Results are persisted to `results.json` for review.

**Training Data:** Both ML classifiers are trained on hand-labeled datasets embedded in the source (86 samples for intent, 75 for risk). Models are persisted as pickled sklearn pipelines and auto-retrained on startup if no saved model is found.

---

# Product Thinking

**Safety as a product requirement, not an engineering afterthought.** The design decision to make emergency detection fully deterministic — bypassing the LLM entirely for critical cases — reflects an understanding that the cost of a false negative (missing a real emergency) is catastrophically higher than a false positive. This is product thinking about asymmetric failure modes.

**Reducing friction for worried parents.** Voice input is included not as a novelty feature but because a parent managing a distressed child often cannot type easily. The transcribed text populates the input field for review rather than auto-submitting, because a voice recognition error on an emergency query could be dangerous.

**Bilingual by design, not as an add-on.** Arabic support affects every stage of the pipeline — input detection, translation, RAG retrieval, LLM generation, and response delivery. The choice to translate Arabic to English before processing (rather than running a separate Arabic pipeline) is a practical architecture decision that reuses all existing components.

**Confidence transparency.** The API returns a confidence score that the UI can surface to users. Low-confidence responses include a disclaimer. This is honest product behavior — the system communicates its own uncertainty rather than projecting false confidence.

**Onboarding through suggested prompts.** The welcome screen presents six concrete, realistic example queries rather than generic instructions. Each prompt is calibrated to a real parenting concern and is clickable, reducing the blank-cursor problem for first-time users.

**Health status surface area.** The UI displays a backend health status banner and an Ollama availability banner when the AI is unavailable, with a specific command to fix it. This is a product decision: rather than silently degrading, the app communicates the degraded state and what the user can do about it.

**Structured output over free text.** Every response is a typed schema — situation, child stage, advice list, product cards, confidence, doctor flag, risk level. This allows the frontend to render distinct UI components for each element, rather than asking the user to parse a wall of text from a chatbot.

---

# Technologies Used

## Languages
- Python 3.11+
- JavaScript (ES2022+)

## Frontend
- React 18
- Vite
- Tailwind CSS (custom design token system)
- Axios

## Backend
- FastAPI
- Uvicorn
- Pydantic v2
- Loguru
- Python-dotenv

## AI / ML
- Ollama (local LLM inference — llama3.2)
- Sentence Transformers (`all-MiniLM` family)
- FAISS (vector search)
- scikit-learn (TF-IDF, Logistic Regression)
- AssemblyAI (speech-to-text, language detection)
- httpx (async LLM API client)

## Databases / Storage
- FAISS flat indexes (persistent on disk)
- JSON-based metadata store
- Pickle (ML model persistence)

## APIs
- Ollama REST API
- AssemblyAI Transcription API

## Frameworks / Tools
- NumPy
- python-multipart (file upload)
- PostCSS / Autoprefixer

---

# Skills Demonstrated

- Full Stack Development
- Backend Engineering (async FastAPI, lifespan management, concurrent request handling)
- API Design (typed request/response schemas, error handling, health endpoints)
- AI Engineering (LLM prompt engineering, RAG pipeline design, safety architecture)
- Retrieval-Augmented Generation
- Prompt Engineering (structured JSON output enforcement, risk-level-conditional instructions, translation prompts)
- Machine Learning (TF-IDF feature extraction, Logistic Regression, model serialization)
- NLP (custom regex extraction, symptom classification, multilingual input handling)
- Vector Search (FAISS indexing, semantic similarity, query enrichment)
- Speech / Voice Integration
- Bilingual / Multilingual System Design
- Safety-Critical System Design
- Product Thinking (asymmetric failure modes, transparent confidence, progressive disclosure)
- UX Thinking (voice input UX, welcome screen design, status communication)
- Performance Optimization (async parallelism, emergency bypass, confidence capping)
- Testing and Evaluation (structured test cases, evaluation harness, results persistence)
- Data Generation and Curation (LLM-assisted synthetic data, deduplication, live re-indexing)

---

# Resume Impact

- Designed and implemented a multi-layer AI safety architecture for a medical-adjacent application, using deterministic rule engines to guarantee critical emergency escalation regardless of LLM output
- Built a full-stack RAG system with FAISS vector search, sentence-transformer embeddings, and query enrichment that grounds LLM responses in a curated parenting knowledge base
- Developed a bilingual NLP pipeline supporting English and Arabic with automatic language detection, LLM-based translation at both input and output stages, and RTL-aware frontend rendering
- Engineered a hybrid intent and risk classification system combining compiled regex rules (authoritative) with TF-IDF + Logistic Regression (fallback), reducing false-negative rate for emergency medical queries
- Integrated AssemblyAI speech transcription with asynchronous processing, supporting voice input in two languages with confidence scoring and pre-submission review UX
- Implemented an LLM-assisted synthetic data generation pipeline capable of producing and live-indexing new parenting knowledge entries and product catalog items without manual curation
- Designed a structured response schema with per-field confidence, risk level, and doctor flag metadata, enabling the frontend to render contextually distinct UI components rather than raw chat text
- Built a concurrent async request pipeline using `asyncio.gather` for parallel NLP extraction, intent classification, and risk scoring, minimizing per-request latency on the critical path
- Created a custom React design system with Tailwind CSS design tokens (color palette, typography, shadow scale) aligned to a specific product brand identity

---

# Ideal Roles

- AI Engineer
- Full Stack Engineer
- Backend Engineer
- Machine Learning Engineer
- Applied Scientist
- Product Engineer
- Technical Product Manager

---

# Portfolio Tags

React · FastAPI · RAG · FAISS · LLM · Ollama · Prompt Engineering · NLP · Voice AI · AssemblyAI · Sentence Transformers · Scikit-learn · Safety-Critical AI · Bilingual · Arabic · Full Stack · Vector Search · Machine Learning · Python · Tailwind CSS

---

# Project Complexity

**Advanced / Production-grade**

The project demonstrates depth across multiple engineering disciplines simultaneously: async backend architecture, a multi-stage ML pipeline, a vector search system, a safety-critical decision layer that operates independently of the LLM, speech transcription integration, bilingual support with runtime translation, and a polished frontend with a custom design system. The safety architecture in particular reflects production-grade thinking — it is designed to fail safely, degrade gracefully, and communicate system state transparently to the user.

---

# One-line Portfolio Summary

A bilingual AI parenting assistant with a multi-layer safety architecture that guarantees medical escalation for critical queries, combining RAG, custom ML classifiers, voice input, and an Ollama-powered LLM into a full-stack product.

---

# Repository Evidence

- `backend/app/api.py` — FastAPI routes, lifespan startup, async pipeline orchestration
- `backend/app/decision_engine.py` — Ollama integration, prompt templates, Arabic translation, emergency bypass
- `backend/app/safety_layer.py` — Post-LLM safety validation, regex pattern library
- `backend/ml/risk_engine.py` — Pre-LLM rule-based risk engine (30+ critical, 15+ medium patterns)
- `backend/ml/intent_classifier.py` — TF-IDF + Logistic Regression intent model with rule guards
- `backend/ml/risk_classifier.py` — TF-IDF + Logistic Regression risk model
- `backend/ml/nlp_extractor.py` — Custom age and symptom extraction
- `backend/app/rag_pipeline.py` — RAG retrieval, query enrichment, product filtering
- `backend/app/embedding.py` — Sentence-transformer embedding, FAISS index management
- `backend/app/voice_handler.py` — AssemblyAI transcription, async wrapper
- `backend/app/data_generation.py` — LLM-driven synthetic data generation
- `backend/app/models.py` — Pydantic request/response schemas
- `backend/requirements.txt` — Python dependency manifest
- `frontend/package.json` — React 18, Vite, Tailwind, Axios
- `frontend/tailwind.config.js` — Custom design token system
- `frontend/src/components/` — ChatInterface, WelcomeScreen, VoiceInput, SafetyAlert, MessageBubble, ProductCard, ResponseCard
- `backend/data/seed_knowledge.json`, `seed_products.json` — Curated knowledge and product datasets
- `backend/indexes/` — Persisted FAISS indexes
- `tests/evaluate.py`, `test_cases.json`, `results.json` — Evaluation harness and results
- `backend/ml_models/` — Persisted sklearn classifier pickles
- link: https://github.com/pavithra2870/NurtureAI