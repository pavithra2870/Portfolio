# Fact Knowledge Layer

An evidence-first local application for extracting facts from PDFs and comparing them across documents to distinguish between genuine contradictions and contextual reconciliations.

---

# Elevator Pitch

The Fact Knowledge Layer is a sophisticated document intelligence system that transforms unstructured PDFs into a structured, queryable knowledge base while preserving complete evidence provenance. Unlike traditional RAG chatbots that answer questions from documents, this system extracts structured facts, stores them with verifiable citations, and intelligently classifies relationships between facts from different sources—distinguishing genuine contradictions from legitimate contextual differences caused by fiscal years, geographic scope, units, or estimate versus actual reporting.

Built for researchers, analysts, and professionals who need to compare information across multiple reports, filings, or research papers, the system solves the critical problem of false contradictions in document analysis. When two sources report different values for the same metric, naive systems flag them as conflicting, but the Fact Knowledge Layer first analyzes contextual factors before making a judgment. The solution is particularly interesting because it combines deterministic rule-based reasoning with LLM-powered classification, uses hybrid retrieval (semantic vector search + keyword search) with cross-encoder reranking, and maintains a strict evidence verification system that rejects any fact with unverifiable citations.

What makes this different is its evidence-first philosophy: every extracted fact must have a verbatim quote that exists in the source document, the system transparently handles extraction failures rather than silently dropping data, and it provides a polished React UI with real-time progress tracking, side-by-side evidence comparison, and interactive knowledge graph visualization. The system is designed to work with any PDF without hard-coded document-specific logic, making it a truly generic document intelligence platform.

---

# Product Overview

**Users**: Financial analysts, researchers, auditors, compliance officers, and professionals who need to cross-reference information across multiple documents such as annual reports, regulatory filings, research papers, and government publications.

**Primary Workflow**: Users upload one or more PDF documents through a web interface. The system processes each document page-by-page, extracting structured facts with verifiable evidence. As new documents are added, the system automatically finds related facts from previously processed documents, analyzes contextual differences, and classifies relationships. Users can then explore facts, view relationships, inspect evidence with page previews, and provide feedback on classification accuracy.

**Core Functionality**: The system ingests PDFs using PyMuPDF for text/table extraction and EasyOCR for scanned pages, extracts facts using LLMs with schema-constrained JSON output, verifies every citation against source text, stores facts in SQLite with semantic embeddings in FAISS, retrieves related facts using hybrid search (semantic + keyword), performs contextual reasoning on time periods, scope, units, and estimate status, classifies relationships using LLMs with rule-based fallbacks, and provides a React UI for exploration and feedback.

**Inputs**: PDF documents of any type (financial reports, research papers, government filings, scanned documents). The system accepts multiple simultaneous uploads and processes each incrementally without reprocessing existing documents.

**Outputs**: Structured facts with complete provenance (document, page, section, exact text, source type, confidence), classified relationships (corroboration, contradiction, contextual reconciliation, unrelated) with explanations, interactive knowledge graph visualization, and human feedback collection for continuous improvement.

**User Experience**: The UI features a clean, professional design with real-time progress tracking via Server-Sent Events, document management with status indicators and failure visibility, a facts view with searchable evidence and page previews, a relationships view with side-by-side evidence comparison and explanations, an interactive D3.js-powered knowledge graph, and a chat interface for natural language queries. The system handles errors transparently, showing extraction issues per document rather than failing silently.

**Real-World Use Case**: A financial analyst uploads annual reports from multiple years for a company. The system extracts revenue, EBITDA, and operational metrics from each report, identifies that FY29 revenue differs from FY30 not because of contradiction but because of the different fiscal year, flags a genuine contradiction where two reports for the same period report different EBITDA values, and explains that differences in scope (India vs. global operations) reconcile apparent conflicts in operational metrics.

---

# Problem Statement

Professionals who need to compare information across multiple documents face a significant challenge: documents often report the same metric with different values due to legitimate contextual differences such as fiscal years, geographic scope, units of measurement, estimate versus actual status, data vintages, or metric definitions. Naive comparison systems flag these as contradictions when they are actually reconcilable, leading to false alerts and wasted investigation time. Conversely, genuine contradictions—where the same metric in the same context has incompatible values—can be missed if the system doesn't properly normalize and compare across sources.

This problem is important because it directly impacts decision-making in financial analysis, due diligence, compliance auditing, and research synthesis. False contradictions erode trust in automated analysis systems, while missed contradictions can lead to incorrect conclusions. Existing solutions are insufficient because most document analysis tools focus on question-answering rather than structured fact comparison, lack rigorous evidence verification, don't perform contextual reasoning before declaring conflicts, and often fabricate citations or silently drop extraction failures.

The Fact Knowledge Layer addresses this by implementing a multi-stage pipeline that extracts facts with verifiable evidence, performs deterministic contextual analysis before LLM classification, uses hybrid retrieval to find semantically related facts, and provides complete transparency about extraction quality and classification confidence.

---

# Key Features

## Document Ingestion and Processing

**Multi-modal PDF Processing**: Extracts text and tables using PyMuPDF, with EasyOCR fallback for pages with sparse native text (typically scanned documents). Tracks source type (text, OCR, table, image) for confidence scoring and preserves page numbers throughout the pipeline for accurate citation.

**Parallel Page Processing**: Processes pages concurrently using ThreadPoolExecutor to speed up extraction while maintaining per-page provenance. Handles page truncation for long content and records truncation notes for transparency.

**Evidence Verification**: Strictly verifies that LLM-generated exact_text quotes actually exist in the source page before accepting a fact. Implements a fallback mechanism that searches for the value and uses surrounding sentences if the exact quote fails, reducing confidence to reflect the uncertainty. Rejects facts with unverifiable citations entirely rather than accepting them with low confidence.

## Structured Fact Extraction

**Schema-Constrained LLM Extraction**: Uses Pydantic models to enforce structured JSON output from LLMs, ensuring every fact includes subject, predicate, value, unit, time_period, scope, fact_type, is_estimate, confidence, and evidence. Processes pages independently to maintain granular provenance and enable retry granularity.

**Multi-Provider LLM Routing**: Implements sophisticated routing across multiple API providers (Gemini, Groq, Ollama) with per-account key pools to maximize throughput while handling rate limits. Failover happens at the page level rather than document level, so a single rate-limited page doesn't interrupt processing of other pages. Falls back to local Ollama when hosted APIs are exhausted, and to a conservative rule-based classifier when all LLMs are unavailable.

**Extraction Failure Persistence**: Records page-level extraction failures (invalid JSON, LLM unavailability, OCR errors) in a separate database table rather than failing the entire document. Allows partial results to remain usable while making limitations visible in the UI for user awareness.

## Hybrid Retrieval and Matching

**Semantic Vector Search**: Uses FAISS with all-MiniLM-L6-v2 embeddings (384-dimensional) for semantic similarity search, finding facts with similar meaning even when wording differs. Employs IndexFlatIP with normalized vectors for cosine similarity.

**BM25 Keyword Search**: Implements BM25 keyword search to catch exact terms, names, and values that embeddings might blur. Particularly effective for matching specific numbers, company names, and technical terms.

**Reciprocal Rank Fusion**: Combines results from FAISS and BM25 using Reciprocal Rank Fusion, a parameter-free method that merges ranked lists without assuming score scales are comparable. This hybrid approach leverages the strengths of both semantic and exact matching.

**Cross-Encoder Reranking**: Reranks the top ~40 hybrid retrieval candidates using a cross-encoder (ms-marco-MiniLM-L-6-v2) that jointly encodes query-candidate pairs for more accurate relevance scoring. Only the top 10 reranked candidates proceed to relationship reasoning, keeping LLM workload manageable.

## Contextual Reasoning

**Time Period Analysis**: Extracts and compares fiscal years from FY patterns (e.g., "FY24" → 2024) and calendar years from text. Flags different years as likely reconcilable before LLM classification.

**Scope and Geography Comparison**: Compares scope fields (e.g., "India" vs "Global", "Domestic" vs "International") to identify geographic or organizational scope differences that explain value variations.

**Unit Normalization**: Normalizes common unit aliases (e.g., "INR Cr" → "inr_crore", "%" → "percent") and compares normalized units. Flags different units as reconcilable differences.

**Estimate vs Actual Detection**: Identifies when one fact is marked as an estimate/forecast and the other as actual, flagging this as a legitimate contextual difference rather than a contradiction.

**Context Notes Generation**: Produces human-readable notes explaining which contextual dimensions differ, which are inserted into the LLM classification prompt to guide the model toward contextual reconciliation over contradiction when appropriate.

## Relationship Classification

**Four-Way Classification**: Classifies fact pairs as corroboration (facts agree and reinforce each other), contradiction (genuine conflict with same context but irreconcilable values), contextual reconciliation (apparent conflict explained by context), or unrelated (insufficient semantic overlap).

**LLM-Powered Classification**: Uses LLMs with prompts that include full fact provenance, rule-based contextual analysis, and explicit instructions to consider context before declaring contradiction. Outputs confidence scores and explanations referencing specific values and context.

**Conservative Rule-Based Fallback**: When LLMs are unavailable, uses a rule-based fallback that only classifies relationships with clear metric overlap (≥35% word overlap in subject+predicate). Explicitly labels outputs as "Rule-based fallback" with lower confidence (0.58–0.72) to make quality degradation transparent.

## Knowledge Graph and Visualization

**NetworkX Graph Layer**: Builds an in-memory NetworkX graph as a view on top of SQLite, not as the source of truth. Creates entity hub nodes for documents with edges to their facts grouped by type, and fact-to-fact relationship edges carrying relationship type, confidence, and explanation.

**Interactive D3.js Visualization**: Provides an interactive graph visualization using D3.js in the React frontend. Samples high-confidence relationship nodes when the graph is too large (>200 nodes) to maintain performance and readability.

**Graph Rebuilding**: Automatically rebuilds the graph from database records on startup and after document deletion to prevent stale results.

## User Interface and Experience

**Real-Time Progress Tracking**: Implements Server-Sent Events (SSE) endpoint that polls the database every 500ms and emits events when page numbers change. Frontend manages per-document EventSource streams and shows progress bars with stage labels, page counters, and percentages.

**Evidence-Centric Views**: Facts view displays complete provenance including document, page, section, exact text, source type, confidence, and on-demand rendered page preview. Relationships view shows side-by-side evidence comparison with explanations and context notes.

**Document Management**: Provides upload, list/status, failure list, page preview (base64 PNG), and delete functionality. Shows extraction issues per document rather than hiding failures.

**Human Feedback System**: Allows users to mark relationship classifications as correct or incorrect with optional comments. Stores feedback in database for evaluation and future improvement.

**Chat Interface**: Natural language query interface for exploring facts and relationships using the same hybrid retrieval and reasoning pipeline.

## Incremental Processing

**New Document Processing**: When a new PDF is uploaded, only that document is processed through the complete pipeline. Existing facts are used as the retrieval corpus but are never re-extracted, enabling the system to scale to many documents without reprocessing everything on each upload.

**Automatic Index Updates**: Updates SQLite, FAISS, BM25, and NetworkX automatically after processing new documents without requiring application restart or manual rebuild.

**Document Deletion Handling**: Cascades deletion of facts and relationships via foreign key constraints, rebuilds FAISS index (since IndexFlatIP doesn't support in-place deletion), and rebuilds BM25 and NetworkX graph to prevent stale search results.

---

# Engineering Highlights

**Backend Architecture**: Python FastAPI application with modular pipeline components (ingestor, extractor, embedder, retriever, reranker, reasoner, classifier, orchestrator). Implements SQLite with WAL mode for concurrent reads, essential for progress tracking writes from worker threads while SSE endpoint reads from async event loop. Uses context managers for database connections with automatic commit/rollback.

**Multi-Provider LLM Routing**: Sophisticated routing system that treats each API key as a separate quota pool, distributing calls round-robin across keys to maximize effective capacity. Implements per-call failover with key cooldown (65 seconds) after rate limits, tiered provider selection (fast/cheap for extraction, strong reasoning for classification), and local Ollama as final fallback. Handles extraction and reasoning pipelines with different model priorities.

**Document Processing Pipeline**: Page-by-page processing with PyMuPDF for text/table extraction and EasyOCR OCR fallback for sparse pages. Converts table content to readable text representation. Tracks source type per page. Implements parallel processing with ThreadPoolExecutor (default 4 workers). Handles page truncation for long content (>6000 characters) with truncation repair function.

**Evidence Verification System**: Strict verification that LLM-generated exact_text quotes exist in source page using whitespace normalization. Implements fallback that searches for value and uses surrounding sentence if exact quote fails, reducing confidence by 0.2. Rejects facts with unverifiable citations entirely. Prevents fabrication of plausible-looking but false citations.

**Hybrid Retrieval System**: Combines FAISS semantic search (all-MiniLM-L6-v2, 384-dim embeddings, IndexFlatIP with cosine similarity) and BM25 keyword search using Reciprocal Rank Fusion. Rebuilds BM25 index in-memory from current fact corpus (fast enough for project scale). Implements cross-encoder reranking (ms-marco-MiniLM-L-6-v2) on top ~40 candidates, passing top 10 to relationship reasoning.

**Contextual Reasoning Engine**: Rule-based pre-pass that analyzes time periods (FY patterns, calendar years), scope/geography, unit normalization (common aliases), and estimate vs actual status before LLM classification. Generates ContextAnalysis object with boolean flags and human-readable notes. Deterministic and auditable, unlike pure LLM reasoning.

**Database Schema**: SQLite with tables for documents, facts, relationships, extraction_failures, and feedback. Uses foreign key constraints with ON DELETE CASCADE for clean deletion. Stores complete provenance including document_id, page_number, section, exact_text, source_type, bbox, table_ref, image_ref. Implements WAL mode for concurrent access.

**Knowledge Graph**: NetworkX graph as in-memory view on SQLite, not source of truth. Creates document hub nodes with edges to facts grouped by type. Fact-to-fact relationship edges carry type, confidence, explanation. Rebuilt from database on startup and after deletion. Samples high-confidence nodes for visualization when graph is large.

**API Design**: RESTful API with routers for documents, facts, relationships, feedback, and chat. Endpoints for upload, list/status, failure list, page preview, delete, filter/list, hybrid search, detail, semantic related facts, relationship list/filter, summary, graph JSON, doc-overview, topic-clusters, feedback submission/list/stats. SSE endpoint for real-time progress tracking.

**Frontend Architecture**: React application with Vite build system, custom CSS (no frameworks), D3.js for graph visualization, React Router for navigation. Components for document upload, fact cards, relationship view, evidence panel, citation badges, confidence meters, feedback widgets, knowledge graph, chat panel. Pages for dashboard, documents, facts, relationships.

**Error Handling and Recovery**: Page-level extraction failures persisted in extraction_failures table. Invalid JSON triggers truncation repair function. Documents in processing status recovered and returned to pending on backend restart. Partial facts and failures deleted for clean retry. Background thread resumes pending documents on startup. All fallbacks explicitly labeled to make quality degradation transparent.

**Testing**: Deterministic test suite covering citation correctness, context reasoning, failure persistence, pipeline partial failure, corroboration, contradiction, reconciliation, and reasoning fallback. Tests run without code changes. Manual evaluation checklist for end-to-end verification.

**Logging and Monitoring**: Rotating file handler (5 MB max, 5 backup count) for application and request logs. Uvicorn logs redirected to project-local file for unified inspection. Logs include LLM routing configuration, key pool status, rate limit events, and processing progress.

---

# AI / ML Components

**LLM Usage**: Multi-provider LLM routing across Gemini 3.1/3.5 Flash-Lite, Groq GPT-OSS 20B/120B, and Ollama NuExtract3/Phi-4-mini. Separate model tiers for extraction (fast, high-volume) and reasoning (stronger models). Schema-constrained prompts with Pydantic validation for reliable structured output. Per-page LLM requests with parallel processing.

**RAG Implementation**: Hybrid retrieval combining FAISS semantic vector search and BM25 keyword search with Reciprocal Rank Fusion. Cross-encoder reranking for improved precision. Contextual reasoning pre-pass before LLM classification. Evidence verification prevents citation fabrication.

**Embeddings**: Sentence Transformers all-MiniLM-L6-v2 model for 384-dimensional embeddings. FAISS IndexFlatIP for exact cosine similarity search. On-disk index persistence with automatic rebuild when stale. Embeddings computed for fact text (subject + predicate + value + unit + scope).

**Vector Database**: FAISS CPU version with IndexFlatIP (inner product on normalized vectors). Exact search (no approximation) appropriate for project scale (hundreds to thousands of facts). Index rebuilt from remaining facts after deletion since IndexFlatIP doesn't support in-place deletion.

**OCR**: EasyOCR for pages with sparse native text (scanned documents). OCR text treated as lower-confidence source type. Configurable DPI setting (default 200). OCR bounding boxes tracked for potential future evidence highlighting.

**NLP**: BM25 keyword search using rank-bm25 library for exact term matching. Reciprocal Rank Fusion for combining ranked lists. Cross-encoder (ms-marco-MiniLM-L-6-v2) for joint query-candidate encoding. Rule-based contextual reasoning for time periods, scope, units, and estimate detection.

**Recommendation Systems**: Hybrid retrieval and reranking pipeline for finding semantically related facts. Context-aware relationship classification that considers temporal, geographic, and unit differences before recommending corroboration, contradiction, or reconciliation labels.

**Prompt Engineering**: Schema-constrained prompts for fact extraction with explicit instructions to return only verbatim quotes. Classification prompts that include rule-based contextual analysis and instructions to prefer reconciliation over contradiction when contextual differences exist. Fallback prompts for rule-based classification when LLMs unavailable.

**Agent Systems**: Multi-provider LLM router with per-account key pools, round-robin distribution, rate limit handling with cooldown, and tiered failover. Per-call failover granularity (page-level rather than document-level). Background thread for resuming pending documents on startup.

**Evaluation**: Human feedback system for collecting correct/incorrect labels on relationship classifications. Deterministic test suite covering four required cases (corroboration, contradiction, reconciliation, extraction failure). Test results persisted for manual verification.

---

# Data Engineering / Data Science Components

**Datasets**: Starter datasets for Delhivery (logistics company financial reports) and India Macroeconomy (government economic data). System designed to work with any PDF without hard-coded document-specific logic.

**Preprocessing**: PDF text extraction with PyMuPDF, table content conversion to readable text, OCR fallback for sparse pages, whitespace normalization for evidence verification, unit normalization for comparison, fiscal year pattern extraction for temporal reasoning.

**Feature Engineering**: Structured fact schema with subject, predicate, value, unit, time_period, scope, fact_type, is_estimate, confidence. Contextual features extracted: time periods, scope differences, unit differences, estimate vs actual status. Embedding features from concatenated fact text.

**Model Training**: Uses pre-trained models (all-MiniLM-L6-v2 for embeddings, ms-marco-MiniLM-L-6-v2 for cross-encoder, various LLMs for extraction and classification). No custom model training in current implementation, but architecture supports future fine-tuning.

**Evaluation**: Deterministic test suite with 8 test cases covering citation correctness, context reasoning, failure persistence, pipeline partial failure, corroboration, contradiction, reconciliation, and reasoning fallback. Human feedback collection for relationship classification accuracy. Confidence scoring for both extraction and classification.

**Visualization**: Interactive D3.js knowledge graph visualization with node sampling for large graphs. React UI with real-time progress bars, confidence meters, evidence panels with page previews, side-by-side relationship comparison.

**Analytics**: Relationship summary statistics, document-level fact counts, feedback statistics, topic clustering capabilities. API endpoints for summary data and document-overview relationships.

**Experimentation**: STUDY.md maintained as living engineering notebook documenting architectural decisions, technology choices, alternatives considered, RAG theory, implementation details, failure cases, debugging lessons, and interview preparation notes.

**Pipelines**: Modular pipeline components (ingestor, extractor, embedder, retriever, reranker, reasoner, classifier, orchestrator) that can be composed and tested independently. Orchestrator manages end-to-end flow with error handling and progress tracking.

---

# Product Thinking

**User-Centric Design**: UI designed as a polished business/corporate product with clean, minimal, professional styling. Excellent typography, restrained color palette, generous spacing, smooth interactions, and clear hierarchy. Avoids gradients, glassmorphism, neon colors, and flashy animations. Prefers subtle borders, neutral surfaces, and purposeful color for status/interaction.

**Evidence Traceability**: Provenance is a first-class feature. Every fact retains document, page, section, exact supporting text, source type, bounding boxes, and extraction confidence. UI makes citations beautiful and immediately inspectable with clickable source references, exact evidence snippets, page numbers, PDF page previews, and side-by-side evidence for comparisons.

**Handling Uncertainty Explicitly**: Confidence scores for both extraction (0-1) and relationship classification (0-1). UI surfaces uncertainty through confidence meters. Extraction failures are persisted and visible rather than silently dropped. Fallback classifiers are explicitly labeled as such with lower confidence. No fabrication of citations to compensate for missing evidence.

**Workflow Optimization**: Incremental processing means only new PDFs are processed, not entire corpus. Parallel page processing with ThreadPoolExecutor speeds up extraction. Real-time progress tracking via SSE keeps users informed without page refreshes. Background thread resumes interrupted processing on startup.

**Reducing Friction**: Generic document processing works with any PDF without hard-coded logic. Automatic index updates after new documents. No manual rebuild required. Simple upload interface with drag-and-drop support. One-click document deletion with cascading cleanup.

**Decision Support**: Contextual reasoning pre-pass prevents false contradictions by identifying legitimate differences in time, scope, units, and estimate status before LLM classification. Explanations reference specific values and context. Side-by-side evidence comparison enables informed judgment. Human feedback system allows users to correct classifications.

**Scalability Considerations**: Architecture designed for incremental addition of documents. SQLite + NetworkX separation simplifies local deployment while providing graph capabilities. FAISS flat index appropriate for current scale; deletable ANN index identified as future improvement. Modular pipeline components enable future optimization.

**Adoption Strategy**: Starter datasets provided for immediate testing. Comprehensive SETUP.md with reproducible installation steps. Deterministic test suite validates core functionality. Troubleshooting guide addresses common issues. Logging unified in single file for debugging.

**Accessibility**: Professional UI design with clear visual hierarchy. Status indicators for document processing states. Error messages surfaced in UI rather than hidden in logs. Page previews enable verification without opening original PDFs. Keyboard navigation support through standard web practices.

**Quality Transparency**: Extraction issues visible per document in UI. All fallbacks explicitly labeled. Confidence scores displayed for facts and relationships. Test results documented. Limitations clearly stated in README. No silent failures or hidden quality degradation.

---

# Technologies Used

## Languages

Python 3.10+
JavaScript (ES6+)
SQL (SQLite)

## Frontend

React 19.2.8
React DOM 19.2.8
React Router DOM 7.18.3
Vite 8.2.2
D3.js 7.9.0
Custom CSS

## Backend

FastAPI 0.111.1
Uvicorn 0.30.1
Python-Multipart 0.0.9

## Databases

SQLite (built-in sqlite3 module)
FAISS (faiss-cpu 1.8.0)

## Cloud

Local deployment (no cloud services required)
Multi-provider API routing (Gemini, Groq, Ollama)

## AI/ML

Ollama (local LLM runtime)
Google Generative AI (Gemini)
Groq (GPT-OSS models)
Sentence Transformers 3.0.1
PyMuPDF 1.24.5 (PDF processing)
EasyOCR 1.7.1 (OCR)
Pydantic 2.7.4 (data validation)

## DevOps

Python venv
Node.js npm
Rotating file logging
Environment variable configuration
SQLite WAL mode

## APIs

FastAPI REST API
Server-Sent Events (SSE)
Multi-provider LLM API routing
Groq API
Google Generative AI API
Ollama API

## Frameworks

FastAPI (web framework)
React (UI framework)
NetworkX 3.3 (knowledge graph)
rank-bm25 0.2.2 (keyword search)

## Tools

PyMuPDF (PDF extraction)
EasyOCR (OCR)
Sentence Transformers (embeddings)
FAISS (vector search)
D3.js (visualization)
Pydantic (validation)
Python-dotenv (configuration)
Aiofiles (async file operations)
HTTPx (HTTP client)
TQDM (progress bars)
Pillow (image processing)

---

# Skills Demonstrated

**Full Stack Development**: Built complete end-to-end application with React frontend and FastAPI backend, including real-time communication via SSE, RESTful API design, and modular architecture.

**Backend Engineering**: Designed and implemented modular pipeline architecture with separate components for ingestion, extraction, embedding, retrieval, reranking, reasoning, and classification. Implemented SQLite database with proper schema, foreign keys, and WAL mode for concurrent access.

**API Design**: Created comprehensive RESTful API with routers for documents, facts, relationships, feedback, and chat. Implemented SSE endpoint for real-time progress tracking. Designed clean request/response schemas using Pydantic.

**AI Engineering**: Implemented multi-provider LLM routing with per-account key pools, rate limit handling, and tiered failover. Designed schema-constrained prompts with Pydantic validation for reliable LLM output. Built hybrid retrieval system combining semantic and keyword search.

**Retrieval-Augmented Generation**: Implemented complete RAG pipeline with FAISS semantic search, BM25 keyword search, Reciprocal Rank Fusion, and cross-encoder reranking. Designed contextual reasoning pre-pass to improve classification accuracy.

**Prompt Engineering**: Crafted schema-constrained prompts for fact extraction that enforce verbatim quotes. Designed classification prompts that incorporate rule-based contextual analysis and guide LLMs toward reconciliation over contradiction when appropriate.

**Machine Learning**: Integrated pre-trained embedding models (all-MiniLM-L6-v2) and cross-encoders (ms-marco-MiniLM-L-6-v2). Implemented confidence scoring for both extraction and classification. Designed human feedback system for continuous improvement.

**Data Analysis**: Implemented structured fact extraction from unstructured text. Designed contextual analysis for time periods, scope, units, and estimate status. Built relationship classification system with four-way categorization.

**Feature Engineering**: Designed comprehensive fact schema with subject, predicate, value, unit, time_period, scope, fact_type, is_estimate, and confidence. Extracted contextual features for reasoning. Created embedding features from concatenated fact text.

**Product Strategy**: Made product decisions prioritizing evidence traceability, uncertainty transparency, and user experience. Designed generic document processing without hard-coded logic. Implemented incremental processing for scalability.

**Product Discovery**: Identified core problem of false contradictions in document comparison. Designed solution that distinguishes genuine contradictions from contextual reconciliations. Created polished professional UI for business users.

**UX Thinking**: Designed clean, minimal, professional UI with excellent typography and clear hierarchy. Implemented real-time progress tracking. Created evidence-centric views with page previews and side-by-side comparison.

**Workflow Automation**: Automated end-to-end pipeline from PDF upload to relationship classification. Implemented parallel processing for speed. Built background thread for resuming interrupted processing. Automatic index updates after new documents.

**System Integration**: Integrated multiple AI/ML components (LLMs, embeddings, OCR, vector search) into cohesive pipeline. Combined deterministic rule-based reasoning with LLM classification. Integrated frontend with backend via REST API and SSE.

**Database Design**: Designed SQLite schema with proper normalization, foreign keys, and cascading deletes. Implemented WAL mode for concurrent access. Stored complete provenance for auditability.

**Error Handling**: Implemented comprehensive error handling with page-level failure persistence, truncation repair, document recovery on restart, and explicit fallback labeling. No silent failures.

**Testing**: Created deterministic test suite covering core functionality including citation correctness, context reasoning, failure persistence, and relationship classification. Tests run without code changes.

**Performance Optimization**: Implemented parallel page processing with ThreadPoolExecutor. Used hybrid retrieval to balance accuracy and speed. Sampled graph nodes for visualization performance. Rebuilt indexes only when stale.

---

# Resume Impact

- Architected and built a full-stack document intelligence system that extracts structured facts from PDFs with verifiable evidence and classifies cross-document relationships using hybrid retrieval and contextual reasoning
- Implemented multi-provider LLM routing with per-account key pools and tiered failover, maximizing throughput while handling rate limits across Gemini, Groq, and Ollama APIs
- Designed hybrid retrieval system combining FAISS semantic search, BM25 keyword search, and cross-encoder reranking with Reciprocal Rank Fusion for accurate fact matching
- Built contextual reasoning engine that analyzes time periods, geographic scope, units, and estimate status before LLM classification to prevent false contradictions
- Created evidence-first architecture with strict citation verification, rejecting facts with unverifiable quotes and persisting extraction failures for transparency
- Developed real-time progress tracking using Server-Sent Events with parallel page processing and automatic recovery of interrupted documents
- Implemented knowledge graph visualization using NetworkX and D3.js with interactive exploration and relationship clustering
- Designed comprehensive test suite with deterministic cases covering corroboration, contradiction, contextual reconciliation, and extraction failure scenarios
- Built polished React UI with professional styling, evidence-centric views, side-by-side comparison, and human feedback collection
- Engineered incremental processing pipeline that scales to multiple documents without reprocessing existing data, with automatic index updates and cascading deletion

---

# Ideal Roles

- AI Engineer
- Machine Learning Engineer
- Full Stack Engineer
- Backend Engineer
- Applied Scientist
- Product Engineer
- Technical Product Manager
- Data Scientist
- Software Engineer
- NLP Engineer

---

# Portfolio Tags

React

FastAPI

Python

SQLite

FAISS

RAG

LLMs

Embeddings

Vector Search

OCR

Document Processing

Knowledge Graph

NetworkX

D3.js

Hybrid Retrieval

Cross-Encoder

Contextual Reasoning

Multi-Agent Systems

Prompt Engineering

Pydantic

API Design

Real-Time

SSE

---

# Project Complexity

**Advanced**

This project demonstrates advanced engineering through its sophisticated multi-stage pipeline combining deterministic rule-based systems with LLM-powered classification, hybrid retrieval architecture with semantic and keyword search fusion, multi-provider LLM routing with rate limit handling, evidence-first philosophy with strict citation verification, and complete full-stack implementation with real-time communication. The system addresses a complex real-world problem (distinguishing genuine contradictions from contextual reconciliations in document analysis) with a production-quality architecture including proper error handling, testing, logging, and user experience design. The integration of multiple AI/ML components (embeddings, vector search, OCR, LLMs) into a cohesive pipeline, combined with the contextual reasoning engine and human feedback system, shows depth beyond typical tutorial projects. The polished professional UI and comprehensive documentation further demonstrate attention to detail and product thinking.

---

# One-line Portfolio Summary

Evidence-first document intelligence system that extracts structured facts from PDFs with verifiable citations and classifies cross-document relationships using hybrid retrieval, contextual reasoning, and multi-provider LLM routing.

---

# Repository Evidence

- backend/requirements.txt (Python dependencies including FastAPI, PyMuPDF, EasyOCR, FAISS, Sentence Transformers, NetworkX, Groq, Gemini)
- frontend/package.json (React, Vite, D3.js, React Router dependencies)
- backend/main.py (FastAPI application entry point with startup sequence, CORS, router mounting)
- backend/database.py (SQLite schema with documents, facts, relationships, extraction_failures, feedback tables)
- backend/models.py (Pydantic models for LLM validation, API schemas, database records)
- backend/pipeline/ (modular pipeline components: ingestor.py, extractor.py, embedder.py, retriever.py, reranker.py, reasoner.py, classifier.py, orchestrator.py, llm_router.py)
- backend/pipeline/llm_router.py (multi-provider routing with key pools, rate limit handling, tiered failover)
- backend/pipeline/retriever.py (hybrid retrieval with FAISS, BM25, Reciprocal Rank Fusion)
- backend/pipeline/reasoner.py (contextual reasoning for time, scope, units, estimate analysis)
- backend/routers/ (API routers: documents.py, facts.py, relationships.py, feedback.py, chat.py)
- backend/graph.py (NetworkX graph building and management)
- frontend/src/ (React components and pages: DocumentUpload.jsx, FactCard.jsx, RelationshipView.jsx, KnowledgeGraph.jsx, ChatPanel.jsx)
- frontend/src/pages/ (Dashboard.jsx, Documents.jsx, Facts.jsx, Relationships.jsx)
- tests/ (deterministic test suite: test_pipeline.py, test_delhivery.py, test_chatbot.py, test_cases.py)
- README.md (project overview, architecture, features, limitations)
- SETUP.md (installation and setup guide)
- submission.md (detailed technical approach and implementation)
- CLAUDE.md (project instructions and requirements)
- STUDY.md (engineering notebook with architectural decisions)
- TEST_RESULTS.md (test results and manual evaluation checklist)

https://github.com/pavithra2870/Fact-Knowledge-Layer