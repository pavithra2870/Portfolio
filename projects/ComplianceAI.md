# ComplianceAI

AI-powered call center compliance monitoring platform that analyzes multilingual recordings to validate Standard Operating Procedure (SOP) adherence, extract payment analytics, and provide explainable AI insights.

---

# Elevator Pitch

ComplianceAI is an intelligent compliance monitoring system designed for call centers operating in multilingual environments, specifically addressing the challenge of analyzing mixed-language conversations (Tanglish and Hinglish) that are common in Indian customer service operations. The platform automatically transcribes audio recordings, validates compliance against standardized operating procedures, extracts actionable analytics, and provides semantic search capabilities across all analyzed calls.

What makes this solution interesting is its sophisticated approach to handling linguistic complexity: instead of forcing analysis on raw mixed-language transcripts, the system employs an internal translation layer that converts Tanglish/Hinglish to English before analysis, ensuring that downstream NLP models operate on clean, standardized text while still returning the original transcript to users. This design enables accurate SOP validation and sentiment analysis on conversations that would otherwise be difficult to process with standard English-only models.

The platform differentiates itself through explainable AI (XAI) capabilities—every SOP decision is justified with direct quotes from the transcript, making compliance audits transparent and defensible. Combined with agentic JSON healing for robust LLM output handling and FAISS-powered semantic search for discovering similar compliance patterns across thousands of calls, ComplianceAI transforms reactive quality assurance into proactive compliance intelligence.

---

# Product Overview

**Users**: Compliance managers, quality assurance teams, and operations supervisors in call centers that handle multilingual customer interactions, particularly in regions where code-switching between regional languages and English is common.

**Primary Workflow**: Users upload MP3 call recordings through a corporate dashboard or API. The system processes each recording through a multi-stage pipeline—transcription, cleaning, internal translation, AI analysis, and vector storage—returning comprehensive compliance metrics, analytics, and explainable justifications within a single API response.

**Core Functionality**: The platform validates 5-step SOP compliance (greeting, identification, problem statement, solution offering, closing), extracts payment preferences and rejection reasons, analyzes customer sentiment, generates grounded keywords, and enables semantic search across the entire call history.

**Inputs**: Base64-encoded MP3 audio files with language specification (Tamil or Hindi), submitted via REST API or drag-and-drop dashboard interface.

**Outputs**: Structured JSON responses including cleaned transcripts, conversation summaries, SOP validation scores with boolean step results, payment analytics (strict enums), sentiment classification, keyword lists, and explainable justifications with transcript quotes.

**User Experience**: The React dashboard provides a clean, corporate interface with tabbed navigation for call analysis and semantic search. Results display compliance scores as visual indicators, analytics as status badges, and raw JSON for technical users. Health monitoring shows real-time service status.

**Real-World Use Case**: A regional call center processing loan collection calls in Tamil can upload daily recordings to automatically verify that agents followed required scripts, identify which customers refused EMI offers due to high interest rates, and search across all calls to find similar compliance issues for targeted training.

---

# Problem Statement

Call centers in multilingual regions face a significant compliance monitoring challenge: quality assurance teams must manually review thousands of call recordings to ensure agents follow Standard Operating Procedures, identify customer objections, and extract actionable business intelligence. This manual process is time-consuming, inconsistent, and scales poorly.

Existing solutions fail to handle code-switching conversations (Tanglish, Hinglish) where speakers fluidly mix regional languages with English. Standard English-only transcription and analysis models produce poor results on these mixed-language inputs, leading to inaccurate compliance scores and missed insights. Furthermore, most compliance tools provide binary pass/fail judgments without explainable justifications, making it difficult to audit decisions or provide targeted agent feedback.

The problem is particularly acute in financial services, healthcare, and debt collection where regulatory compliance requires demonstrable adherence to scripts and procedures. Without automated, accurate analysis that can handle linguistic complexity, organizations risk regulatory penalties, customer dissatisfaction, and operational inefficiency.

---

# Key Features

## SOP Validation

Validates adherence to 5-step call scripts: greeting, identification, problem statement, solution offering, and closing. Returns boolean results per step, an overall compliance score (0-1), and adherence status (FOLLOWED/NOT_FOLLOWED). This feature exists because regulatory compliance and quality assurance require demonstrable proof that agents followed required procedures. It benefits users by automating what was previously a manual review process, enabling consistent evaluation at scale.

## Explainable AI (XAI)

Provides detailed justifications for every SOP decision with direct quotes from the transcript. For example, if the greeting step fails, the system quotes the actual opening lines to show why. This feature exists because compliance audits require evidence, not just scores. It benefits users by making AI decisions transparent, defensible, and useful for agent coaching.

## Internal Translation Layer

Translates Tanglish/Hinglish transcripts to English internally before analysis while returning the original transcript to users. This feature exists because mixed-language inputs break standard English NLP models, but users need to see the original conversation. It benefits users by enabling accurate analysis on linguistically complex calls without losing authenticity.

## Payment Analytics

Extracts payment preference (EMI, full payment, partial payment, down payment) and rejection reason (high interest, budget constraints, already paid, not interested, none) using strict enum enforcement. This feature exists because understanding customer payment behavior is critical for business intelligence and collections strategy. It benefits users by providing structured, queryable data from unstructured conversations.

## Sentiment Analysis

Classifies customer sentiment as Positive, Neutral, or Negative. This feature exists because sentiment correlates with compliance outcomes and customer satisfaction. It benefits users by identifying calls that may require follow-up or agent coaching.

## Keyword Extraction

Extracts 5-10 grounded keywords that appear in the transcript. This feature exists to enable semantic search and quick content scanning. It benefits users by making large call archives searchable and discoverable.

## Semantic Search

Enables natural language search across all analyzed calls using FAISS vector embeddings. Queries are automatically translated to English before embedding to align with the vector space. This feature exists because finding similar compliance patterns or specific conversation types is valuable for training and trend analysis. It benefits users by converting unstructured call archives into queryable knowledge bases.

## Agentic JSON Healing

Implements a 3-pass self-healing loop when the LLM returns malformed JSON, automatically attempting to fix format errors before failing. This feature exists because LLMs occasionally produce invalid JSON that would break downstream systems. It benefits users by increasing system reliability and reducing failed requests.

## Request Logging

Persists every request to disk with full context (transcript, analysis, metadata). This feature exists for debugging, audit trails, and potential reprocessing. It benefits users by providing a complete history of all analyses.

## Health Monitoring

Provides a `/health` endpoint with per-service status (API, Gemini, FAISS). This feature exists for deployment monitoring and uptime tracking. It benefits operations teams by enabling automated health checks.

---

# Engineering Highlights

**Backend Architecture**: FastAPI-based REST API with modular router structure separating concerns (analyze, search, health). Implements strict Pydantic v2 schema validation for all requests and responses, ensuring type safety and automatic API documentation via Swagger UI.

**Authentication**: API key enforcement via `x-api-key` header on all protected endpoints, with 401 responses for unauthorized access. Simple but effective security model for internal enterprise use.

**Speech Processing**: Integration with AssemblyAI cloud service for transcription, supporting speaker labels, automatic language detection, and punctuation. Async polling pattern handles long-running transcription jobs without blocking the API.

**NLP Pipeline**: Multi-stage processing pipeline with strict ordering: transcription → cleaning → translation → analysis → validation → storage. Each stage is isolated into separate service modules for maintainability.

**Translation Strategy**: Google Gemini 2.0 Flash Lite handles Tanglish/Hinglish to English translation with 3-attempt retry logic and fallback to original transcript on failure. Translation is internal-only—users receive original cleaned transcripts.

**LLM Integration**: Gemini performs structured analysis with carefully engineered prompts that enforce JSON output format, enum constraints, and quote-based justifications. Includes agentic healing loop for malformed JSON responses.

**Vector Search**: FAISS IndexFlatIP with sentence-transformers MiniLM embeddings (384-dim, normalized for cosine similarity). Stores both original and English transcripts, embeds from English for consistent vector space. Thread-safe storage with Lock. Query translation aligns search with indexed vectors.

**Error Handling**: Global exception handler with 500 responses. Service-specific error handling with appropriate HTTP status codes (401, 422, 503). Non-critical operations (logging, FAISS storage) fail gracefully without breaking main pipeline.

**Data Validation**: Multi-layer validation including Base64 decoding verification, Pydantic schema enforcement, enum normalization, and post-processing validation for LLM outputs. Ensures strict compliance with response contracts.

**Frontend Architecture**: React 18 with component-based structure (AnalyzeForm, ResultDisplay, SearchPanel, HealthStatus). Axios for HTTP communication with automatic API key injection. Tab-based navigation for different workflows.

**Deployment**: Dockerfile configured for Hugging Face Spaces with CPU-only PyTorch, pre-cached embedding model, non-root user, and `/tmp` directory usage for writable storage. Environment variable configuration for local, HF Spaces, and Render deployments.

**Logging**: Structured logging with per-request UUID tracking, service health logging, and JSON file persistence for request history. Enables debugging and audit trails.

---

# AI / ML Components

**Speech-to-Text**: AssemblyAI cloud API with universal model, speaker labels, automatic language detection, and punctuation. Handles mixed-language input (Tanglish/Hinglish) without requiring language specification.

**Translation**: Google Gemini 2.0 Flash Lite performs Tanglish/Hinglish to English translation with strict rules to preserve meaning, names, numbers, and intent without summarization. 3-attempt retry with fallback.

**NLP Analysis**: Gemini analyzes English-translated transcripts to extract structured outputs including summaries, SOP validation, payment analytics, sentiment, and keywords. Prompt engineering enforces JSON format, enum constraints, and quote-based justifications.

**Agentic JSON Healing**: Self-healing loop where Gemini attempts to fix its own malformed JSON outputs over 3 passes, catching JSONDecodeError and requesting corrections with error context.

**Embeddings**: sentence-transformers all-MiniLM-L6-v2 model generates 384-dimensional embeddings with normalization for cosine similarity. Pre-cached in Docker image to reduce cold-start latency.

**Vector Search**: FAISS IndexFlatIP enables semantic similarity search across all analyzed calls. Implements similarity threshold filtering (0.3) to exclude low-quality matches. Query translation ensures vector space alignment.

**Prompt Engineering**: Carefully structured prompts enforce output format, enum constraints, quote requirements, and analysis rules. Includes specific guidance for greeting/closing detection and uncertainty handling.

**Output Validation**: Post-processing normalizes compliance scores, enforces enum values, pads keyword lists to minimum length, and ensures schema compliance before returning responses.

---

# Product Thinking

**Linguistic Inclusivity**: The internal translation layer demonstrates deep understanding of the target market—Indian call centers where code-switching is the norm. Rather than forcing users to speak "pure" English or building separate models for each language, the system embraces linguistic complexity while maintaining analysis accuracy.

**Explainability Over Opacity**: Every compliance decision includes transcript quotes, recognizing that in regulated industries, AI judgments must be auditable and defensible. This transforms the system from a black-box scorer into a coaching tool.

**User-Centric Output Design**: Returning original transcripts instead of English translations respects user needs—they need to see what was actually said, not a sanitized version. The translation layer is an implementation detail, not a user-facing feature.

**Graceful Degradation**: Non-critical operations (FAISS storage, request logging) fail without breaking the main pipeline. This prioritizes core functionality (analysis response) over nice-to-haves, ensuring reliability.

**Semantic Search as Discovery**: The vector search feature transforms compliance monitoring from reactive evaluation to proactive pattern discovery. Users can find similar issues across thousands of calls, enabling systemic improvements rather than individual agent corrections.

**Strict Schema Enforcement**: The emphasis on Pydantic validation and enum constraints reflects understanding that in enterprise environments, predictable, structured data is more valuable than flexible but inconsistent outputs.

**Health Monitoring**: The dedicated health endpoint with per-service status shows operational awareness—this is designed for production deployment with uptime monitoring, not just development.

**Multi-Environment Deployment**: Environment variable configuration and Docker support demonstrate intent for real-world deployment across local development, Hugging Face Spaces, and cloud platforms.

---

# Technologies Used

## Languages

Python 3.10+, JavaScript (React)

## Frontend

React 18, React DOM, Axios, Vanilla CSS, Inter font

## Backend

FastAPI, Uvicorn, Pydantic v2, httpx, requests, python-dotenv

## Databases

FAISS (vector database), JSON file storage (metadata, logs)

## Cloud

AssemblyAI (speech-to-text API), Google Gemini (LLM API), Hugging Face Spaces (deployment target)

## AI/ML

Google Gemini 2.0 Flash Lite, sentence-transformers (all-MiniLM-L6-v2), FAISS-cpu, PyTorch (CPU), NumPy, scikit-learn

## DevOps

Docker, environment variable configuration, structured logging

## APIs

REST API with JSON requests/responses, AssemblyAI API, Google Generative AI API

## Frameworks

FastAPI (web framework), React (UI framework)

## Tools

Base64 encoding/decoding, tempfile handling, threading (Lock for FAISS), regex (text cleaning)

---

# Skills Demonstrated

Full Stack Development
Backend Engineering
API Design
AI Engineering
Retrieval-Augmented Generation
Prompt Engineering
Machine Learning
Vector Search and Embeddings
NLP and Text Analysis
Product Strategy
Product Discovery
UX Thinking
Workflow Automation
Cloud Deployment
DevOps
System Integration
Database Design
API Authentication
Error Handling and Reliability
Schema Validation
Docker Containerization
Multi-Environment Configuration
Structured Logging
Agentic AI Systems
Explainable AI (XAI)
Cross-Lingual NLP

---

# Resume Impact

- Designed and implemented an AI-powered call center compliance platform that automates SOP validation on multilingual recordings, reducing manual review time by enabling scalable analysis of Tanglish and Hinglish conversations
- Built a multi-stage NLP pipeline integrating AssemblyAI transcription, Google Gemini translation/analysis, and FAISS vector search with strict Pydantic schema validation ensuring 100% response contract compliance
- Developed an internal translation layer that converts mixed-language transcripts to English for accurate LLM analysis while returning original transcripts to users, solving a critical challenge for Indian call center operations
- Implemented explainable AI (XAI) capabilities that justify every SOP decision with direct transcript quotes, enabling defensible compliance audits and actionable agent coaching
- Created agentic JSON healing system with 3-pass self-correction loop that increases LLM reliability by automatically fixing malformed responses before failing
- Engineered semantic search across call archives using FAISS vector embeddings with query translation, enabling discovery of similar compliance patterns for systemic quality improvements
- Deployed containerized application with multi-environment support (local, Hugging Face Spaces, Render) using Docker and environment variable configuration
- Built React dashboard with corporate design system providing real-time health monitoring, drag-and-drop audio upload, and tabbed interface for analysis and search workflows

---

# Ideal Roles

AI Engineer
Machine Learning Engineer
Full Stack Engineer
Backend Engineer
Product Engineer
Applied Scientist
NLP Engineer
Technical Product Manager
Software Engineer

---

# Portfolio Tags

React
FastAPI
Python
JavaScript
AssemblyAI
Google Gemini
FAISS
Vector Search
Embeddings
RAG
NLP
Prompt Engineering
Agentic AI
Explainable AI
Docker
API Design
Pydantic
Multi-Lingual NLP
Semantic Search
Compliance
Product

---

# Project Complexity

Advanced

This project demonstrates advanced engineering through integration of multiple AI services (AssemblyAI, Gemini), sophisticated NLP pipeline with translation and analysis layers, vector database implementation with FAISS, agentic error handling, strict schema validation, and multi-environment deployment. The internal translation strategy for handling code-switching conversations shows nuanced understanding of linguistic challenges in real-world applications. The combination of frontend, backend, AI/ML, and DevOps components across the full stack places this beyond intermediate complexity.

---

# One-line Portfolio Summary

AI-powered call center compliance platform with multilingual transcription, SOP validation, explainable AI, and semantic search built with React, FastAPI, Gemini, and FAISS.

---

# Repository Evidence

- README.md: Project overview, architecture diagram, API reference, tech stack
- backend/space_a/requirements.txt: Python dependencies (FastAPI, Gemini, FAISS, sentence-transformers)
- backend/space_a/main.py: FastAPI application setup with CORS, routing, exception handling
- backend/space_a/models/schemas.py: Pydantic v2 schemas with strict validation and enums
- backend/space_a/routers/analyze.py: Analysis pipeline implementation with authentication
- backend/space_a/services/gemini_service.py: Translation, analysis, and JSON healing logic
- backend/space_a/services/faiss_service.py: Vector embeddings and FAISS search implementation
- backend/space_a/services/audio_service.py: AssemblyAI integration with async transcription
- backend/space_a/Dockerfile: Container configuration for Hugging Face Spaces deployment
- frontend/package.json: React dependencies and scripts
- frontend/src/App.js: React application structure with tabbed navigation
- frontend/src/components/: Modular React components (AnalyzeForm, ResultDisplay, SearchPanel, HealthStatus)
- CLAUDE.md: Detailed system instructions and evaluation criteria
- link: https://github.com/pavithra2870/Call-Center-Compliance