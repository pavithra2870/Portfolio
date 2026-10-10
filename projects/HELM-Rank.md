# HELM-Rank

An AI-powered exam evaluation platform that automates student answer grading through OCR, knowledge grounding, Elo ranking, and teacher-aligned reward learning.

---

# Elevator Pitch

HELM-Rank is a production-grade exam grading pipeline that transforms raw student answer sheets — images, PDFs, or text — into ranked, explained, and auditable evaluation results. It was built to address a real gap in academic assessment: the inconsistency, slowness, and opacity of manual grading at scale.

The system processes submissions through a multi-stage AI pipeline that combines OCR confidence gating, hierarchical tier assignment, knowledge grounding via retrieval-augmented generation, and competitive Elo-style ranking. Each grading decision is traceable, explainable, and anchored to course material rather than floating on model heuristics alone.

What makes HELM-Rank distinct is its alignment layer. Teachers don't just receive results — they actively shape how the system grades by submitting pairwise preferences through a structured RLHF interface. The reward model updates only when the feedback is safe, using a KL-divergence gate to block poisoned or inconsistent signals before they propagate.

The result is a grading system that gets better with use, explains itself to students, and puts teachers in control of the model's behavior without requiring any ML expertise.

---

# Product Overview

HELM-Rank is built for educators, academic institutions, and assessment teams who need to evaluate student responses at volume without sacrificing consistency or transparency.

The primary workflow is five steps. A teacher uploads answer sheets (images or PDFs of handwritten or typed responses) and course material (notes or textbooks) through an Upload Centre. They then define structured answer keys per question, specifying correct answers, required keywords, tolerances for numerical questions, and semantic thresholds. On the Evaluation Dashboard, they configure the pipeline, select scripts and answer keys, and trigger a grading run. Results appear as a ranked leaderboard per question, with per-student score cards showing OCR transcription quality, grade tier, Elo rating, and uncertainty-adjusted scores. Finally, the RLHF Review page surfaces the top-ranked answer pairs for each question and invites the teacher to select the better answer, optionally with LLM-assisted comparison analysis.

At any point, the Explainability View lets a teacher or student query why a particular answer received its grade. The system retrieves the most relevant passages from the uploaded knowledge base, sends them alongside the student's answer to LLaMA3 running locally via Ollama, and returns a structured narrative explanation plus a step-by-step reasoning trace.

The practical use case is a university or high school exam period. A department uploads fifty answer scripts for a mid-term, indexes the course notes, defines keys for five questions, and runs the pipeline. Within seconds they have a ranked class leaderboard, individual feedback text for every student, and a dashboard to review and refine how the model weighs competing answers.

---

# Problem Statement

Manual grading is slow, expensive, and inconsistent. Two teachers grading the same answer often disagree, especially for conceptual or partially-correct responses. At scale — hundreds of scripts, multiple questions — this inconsistency compounds into unfair outcomes.

Existing solutions fall into two camps: simple keyword-matching tools that miss nuance, or opaque LLM-based graders that produce scores with no explanation and no mechanism for teacher correction. Neither builds institutional trust, and neither improves over time.

HELM-Rank addresses all three shortcomings. It applies structured, multi-signal grading (OCR quality, semantic similarity, keyword presence, knowledge grounding) rather than relying on a single heuristic. It generates human-readable explanations grounded in the actual course material. And it provides a principled feedback loop where teachers can correct the system and those corrections are safely integrated into the reward model — with safeguards against inconsistent or adversarial inputs.

---

# Key Features

## Confidence-Gated OCR Ingestion
When answer sheets are submitted as images or PDFs, the pipeline runs OCR with confidence scoring per token. Sheets that fall below a configurable confidence threshold are flagged or quarantined before grading begins. This prevents the downstream pipeline from grading text it cannot reliably read, which would otherwise produce misleading results. The confidence score is also propagated through to the final composite score as an uncertainty discount.

## Hierarchical Answer Grading
Each answer is evaluated against a structured answer key that supports numerical comparison with tolerance, factual matching, keyword presence, and semantic similarity thresholds. The grader assigns one of three tiers — Correct, Partial, or Incorrect — with a machine-readable reason attached to every decision. This makes the grading logic auditable and debuggable, not a black box.

## Elo-Based Student Ranking
Rather than simply sorting students by raw score, the system runs competitive Elo ranking across student answers per question. Students are paired and matched, and ratings update based on relative answer quality. This produces a nuanced ranking that captures the distribution of answer quality more faithfully than a flat percentage score, and mirrors the kind of comparative judgment a teacher makes when they read multiple answers side by side.

## Page-Indexed Knowledge Grounding
Course material uploaded to the knowledge base is embedded and stored in a FAISS vector index. At grading time, each student answer is used as a query to retrieve the most relevant passages from the knowledge base. A grounding score is computed based on semantic alignment between the answer and the retrieved content. This score is blended into the final composite score, rewarding answers that engage with course material rather than generic correct-sounding text.

## Diagram Parsing
A dedicated module handles answers that include diagrams or visual elements. It parses topological structures from images using graph primitives, enabling the pipeline to assess structural correctness in diagram-based questions — not just textual content.

## Uncertainty-Adjusted Scoring
The final score for each student is not the raw Elo rating. It is a composite that combines the normalized Elo score, the knowledge grounding score, and the OCR confidence — using a configurable lambda weight. Students whose answer sheets were difficult to read receive a score that reflects that uncertainty, rather than being silently penalized or rewarded by OCR noise.

## RLHF Teacher Alignment
The RLHF page presents pairs of top-ranked student answers side by side. Teachers review them, select the preferred answer, and optionally explain their reasoning. Each preference is passed through a KL-divergence gate: if the new feedback is too inconsistent with the reward model's existing understanding, the update is blocked and flagged rather than applied. This prevents model poisoning while still learning from expert feedback over time.

## LLM-Powered Explainability
For any student-question pair, the system can generate a narrative explanation, a step-by-step reasoning trace, and a list of the retrieved knowledge base chunks that informed the judgment. Everything is grounded in the actual course material and runs locally using LLaMA3 via Ollama, keeping sensitive student data on-premise.

## Configurable Pipeline
Every significant parameter is tunable at runtime from the UI: OCR confidence threshold, Elo K-factor and round count, grounding weight, KL divergence threshold, and whether each major module runs at all. This lets educators adapt the system to different exam formats without touching code.

---

# Engineering Highlights

The backend is a FastAPI application structured around four REST routers — upload, evaluate, rlhf, explain — each backed by a dedicated service layer. The evaluation pipeline is CPU-intensive and runs in a thread pool executor to keep the HTTP layer non-blocking. The frontend polls for completion at 2.5-second intervals.

The RAG system is implemented from scratch without LangChain. It supports two modes: sentence-transformers with FAISS for vector similarity when available, and a TF-IDF with numpy dot product as a zero-dependency fallback for CPU-only environments. The FAISS index and chunk metadata are persisted to disk and loaded on server startup.

The database layer uses SQLite with WAL mode enabled for concurrent read performance. All database calls are synchronous and wrapped with `run_in_threadpool` at the API layer. Five tables cover uploads, answer keys, evaluations, RLHF feedback, and explanations, with full JSON serialization of complex result payloads.

LLM integration runs through Ollama's local API using `httpx` with graceful fallback messaging when the server is not running. Three distinct prompt templates handle explanation generation, reasoning trace generation, and pairwise answer comparison.

The frontend is a React 18 single-page application built with Vite. It uses React Router for five pages, Recharts for bar and radar chart visualizations of ranking data, Axios for API communication, and react-dropzone for file upload UX. All pipeline parameters are managed as controlled form state with real-time slider components.

The six core ML modules (confidence gating, diagram parsing, page grounding, Elo ranking, hierarchical anchoring, and RLHF alignment) are decoupled from the web application and wrapped by thin adapter modules that add the parent directory to sys.path. This design allows the original module files to be imported unmodified, making the web layer purely a service wrapper around existing research code.

---

# AI / ML Components

The system integrates multiple AI and ML systems across the pipeline.

OCR with confidence scoring processes handwritten and printed answer sheets, with per-token confidence statistics used to gate ingestion quality. The confidence mean and flag rate per script are persisted and surfaced in the UI.

Semantic similarity using sentence-transformers (all-MiniLM-L6-v2 by default) powers both knowledge grounding and the RAG retrieval layer. Embeddings are computed for knowledge base chunks at index time and for student answers and queries at retrieval time.

FAISS vector search provides sub-millisecond approximate nearest-neighbor retrieval over the indexed knowledge base. The index is built as an inner-product flat index on L2-normalized embeddings, equivalent to cosine similarity search.

Elo ranking is applied as a competitive scoring algorithm adapted from chess rating systems. Students are treated as competitors, their answers as match results, and the K-factor and number of rounds are configurable per evaluation.

RLHF with KL-divergence gating implements a preference-based reward model update loop. Teacher preferences are fed into Module F (which supports LoRA fine-tuning in full GPU mode), and the KL divergence between the new preference and the existing model distribution is checked before any update is applied.

LLM inference via LLaMA3 through Ollama handles explanation generation, reasoning trace construction, and pairwise answer comparison. Prompt engineering is structured around role, context (retrieved KB chunks), task decomposition, and constrained output format. Temperature is set low (0.05–0.15) across all prompts to keep outputs deterministic and audit-friendly.

The diagram parsing module represents student answers as graphs using NetworkX, with nodes and edges extracted from visual primitives in answer sheet images using OpenCV.

---

# Data Engineering / Data Science Components

The evaluation pipeline produces structured result payloads stored as JSON in SQLite. Each payload contains per-student ingestion details (transcription, confidence, quarantine status), hierarchical grade results (tier, confidence, reason, similarity scores), Elo leaderboard entries per question, and knowledge grounding results.

An uncertainty propagation module computes final composite scores using a formula that combines normalized Elo rating, page grounding score, and OCR confidence with configurable lambda weighting. A Gaussian confidence interval function is also included for scoring distributions.

Pipeline configuration parameters — confidence threshold, Elo K-factor, grounding weight, KL threshold — are all tunable and stored alongside evaluation records, enabling controlled experimentation and reproducibility across runs.

The knowledge base ingestion pipeline chunks documents at configurable token window sizes with overlap, embeds each chunk, and builds the FAISS index incrementally across multiple uploads. Chunk metadata (source file, path) is preserved for auditability.

---

# Product Thinking

HELM-Rank is designed around the assumption that AI grading only has value if teachers trust it. Every product decision reflects that premise.

The pipeline is transparent by default. Every grade comes with a tier, a reason, a confidence score, and optionally an LLM-generated explanation grounded in course material. Teachers can audit every decision without needing to understand the underlying model.

The RLHF interface is teacher-first, not ML-first. It does not ask teachers to understand reward models or KL divergence. It asks them a question they already know how to answer: which of these two answers is better? The ML complexity is invisible.

The KL divergence gate is a trust mechanism. Without it, a single inconsistent teacher action — or a mistake, or a test click — could meaningfully shift model behavior. The gate ensures the system only learns from feedback it can safely absorb, protecting model integrity while still enabling incremental improvement.

The dual pipeline mode (mock for CPU, full for GPU) reflects a practical onboarding decision. Institutions can deploy and evaluate the system on standard hardware before committing to GPU infrastructure. The product doesn't gate its core value on hardware requirements.

Graceful degradation is built into every AI component. The RAG system falls back to TF-IDF if sentence-transformers are unavailable. LLM explanations fail with a clear message pointing to the fix rather than a silent error. The FAISS index falls back to numpy cosine similarity. This makes the system deployable in constrained environments without refactoring.

The five-page linear workflow — Upload, Evaluate, Results, RLHF, Explain — mirrors the natural teacher workflow, reducing the onboarding surface. Each page has a single primary action with supporting configuration exposed progressively rather than upfront.

---

# Technologies Used

## Languages
- Python 3.10+
- JavaScript (ES2022)

## Frontend
- React 18
- React Router v6
- Recharts
- Axios
- react-dropzone
- Vite

## Backend
- FastAPI
- Uvicorn
- Pydantic v2
- httpx

## Databases
- SQLite (WAL mode)
- FAISS (vector index)

## AI/ML
- LLaMA3 via Ollama (local LLM inference)
- sentence-transformers (all-MiniLM-L6-v2)
- scikit-learn (TF-IDF fallback)
- FAISS CPU
- OpenCV (image processing)
- PyMuPDF (PDF parsing)
- NetworkX (graph representation)
- NumPy, SciPy, pandas

## Frameworks
- FastAPI (REST API framework)
- Pydantic (data validation and serialization)

## Tools
- Vite (frontend build)
- Uvicorn (ASGI server)
- Pillow (image processing)

---

# Skills Demonstrated

- Full Stack Development
- Backend Engineering
- REST API Design
- Async Python (FastAPI, thread pool executors)
- AI Engineering
- Retrieval-Augmented Generation
- Prompt Engineering
- Vector Search and Embeddings
- Local LLM Integration
- RLHF and Reward Model Alignment
- OCR Pipeline Engineering
- Graph-Based Representation
- Machine Learning (Elo ranking, uncertainty propagation, TF-IDF)
- Database Design (SQLite schema, WAL mode, JSON serialization)
- Frontend Engineering (React, routing, data visualization)
- UX Thinking (progressive disclosure, graceful degradation, linear workflow)
- System Integration (modular pipeline adapter pattern)
- Performance Optimization (background task execution, polling, fallback modes)
- Product Strategy (trust-by-design, teacher-first feedback loop)

---

# Resume Impact

- Architected a multi-stage AI exam grading pipeline integrating OCR confidence gating, semantic knowledge grounding, Elo-based ranking, and LLM explainability into a single full-stack application
- Built a custom FAISS-backed RAG system from scratch using sentence-transformers for sub-millisecond knowledge retrieval, with a TF-IDF fallback for zero-dependency deployment
- Implemented a teacher-facing RLHF feedback loop with KL-divergence safety gating to align the grading reward model with expert preferences while preventing model poisoning
- Engineered an uncertainty propagation formula that discounts student scores by OCR confidence and knowledge grounding alignment, producing more calibrated final rankings
- Designed and shipped a five-page React frontend with real-time evaluation polling, interactive pipeline configuration sliders, and Recharts visualizations for leaderboard and radar views
- Integrated local LLM inference via Ollama/LLaMA3 with structured prompt templates for explanation generation, reasoning traces, and pairwise answer comparison, with graceful fallback on connection failure
- Built a modular FastAPI backend with async-safe thread pool execution for CPU-bound pipeline tasks, persisting full structured results to SQLite with WAL concurrency mode
- Designed a configurable pipeline abstraction supporting mock (CPU) and full (GPU) execution modes, enabling deployment in resource-constrained academic environments without code changes

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

FastAPI  
React  
RAG  
FAISS  
LLaMA3  
Ollama  
RLHF  
Embeddings  
OCR  
Elo Ranking  
Prompt Engineering  
Vector Search  
LLMs  
Python  
SQLite  
Full Stack  
NLP  
Explainability  
Education AI  

---

# Project Complexity

**Advanced**

HELM-Rank combines six distinct ML modules (OCR, diagram parsing, knowledge grounding, Elo ranking, hierarchical grading, RLHF alignment) into a coherent product with a full React frontend, async FastAPI backend, persistent vector and relational storage, local LLM inference, and a custom RAG implementation. The RLHF safety gating, uncertainty propagation formula, and modular pipeline adapter pattern each reflect non-trivial engineering judgment. The system is structured for production deployment — configurable via environment variables, gracefully degradable, and architecturally decoupled.

---

# One-line Portfolio Summary

A full-stack AI grading platform that evaluates student answer sheets through OCR, knowledge-grounded ranking, and teacher-aligned RLHF — with LLM-generated explanations for every decision.

---

# Repository Evidence

- `backend/app/main.py` — FastAPI app title, description, and router structure
- `backend/requirements.txt` — complete dependency list (faiss-cpu, sentence-transformers, pymupdf, opencv, networkx, scikit-learn, httpx, pydantic, fastapi)
- `backend/app/core/module_*.py` — six ML module wrappers revealing pipeline stage names and public APIs
- `backend/app/core/pipeline.py` — top-level pipeline orchestrator (`run`, `PipelineConfig`, `ExamScript`, `PipelineReport`)
- `backend/app/rag/retriever.py` — custom FAISS RAG implementation with sentence-transformers and TF-IDF fallback
- `backend/app/services/evaluator.py` — full pipeline orchestration including uncertainty augmentation and result serialization
- `backend/app/services/explainer.py` — Ollama/LLaMA3 integration and three prompt templates
- `backend/app/services/rlhf_service.py` — RLHF preference submission with KL gating
- `backend/app/services/uncertainty.py` — composite scoring formula and confidence interval computation
- `backend/app/db/models.py` — Pydantic schema revealing all data shapes (evaluation, grading, RLHF, explanation)
- `backend/app/db/sqlite.py` — five-table schema with WAL mode and full CRUD operations
- `backend/app/api/*.py` — four REST routers with async patterns and background task execution
- `frontend/package.json` — React 18, Vite, Recharts, Axios, react-dropzone, react-router-dom
- `frontend/src/App.jsx` — five-page routing structure
- `frontend/src/pages/*.jsx` — full page implementations for Upload, Evaluate, Results, RLHF, Explain
- `backend/app/utils/config.py` — all configurable parameters with environment variable overrides
- `SETUP.md` — workflow documentation, module integration table, and troubleshooting guide
