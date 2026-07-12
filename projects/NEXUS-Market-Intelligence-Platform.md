# NEXUS Market Intelligence Platform

A production-grade AI-powered market intelligence platform that combines classical NLP, deep learning, and local LLMs to deliver consultancy-quality research outputs.

---

# Elevator Pitch

NEXUS is an AI-powered market intelligence and NLP consultancy platform designed for business analysts, consultants, and researchers who need rapid, data-driven insights from unstructured text sources. The platform automates time-consuming analytical workflows—market research, document comparison, compliance scanning, and risk monitoring—by combining classical NLP techniques, modern deep learning models, and local large language model inference.

What makes NEXUS unique is its hybrid approach: it uses a multi-model NLP ensemble (spaCy + FLAIR NER, DeBERTa sentiment, sentence-transformers embeddings) for precise analysis, then synthesizes results through a local Ollama LLM (Llama 3) for human-readable reports. All processing runs locally, ensuring data privacy and zero cloud inference costs. The platform features 8 specialized AI agents and 4 enterprise modules, each addressing specific analytical needs—from automated GDPR compliance scanning to M&A due diligence and live risk monitoring.

Unlike generic AI tools, NEXUS is purpose-built for consultancy workflows. It doesn't just extract information; it provides strategic insights, competitive positioning maps, persona profiles, and McKinsey-style reports. The system ingests data from multiple sources (Reddit, web scraping, document uploads), processes it through sophisticated NLP pipelines, and delivers actionable intelligence through an intuitive glassmorphic React interface.

---

# Product Overview

**Users**: Business consultants, market researchers, compliance officers, investment analysts, product managers, and strategic decision-makers who need to analyze large volumes of unstructured text quickly and accurately.

**Primary Workflow**: Users select an analytical agent (e.g., Market Research, Compliance Checker), input their query or upload documents, and receive structured insights within seconds. The system automatically fetches relevant data from Reddit and web sources, processes it through NLP pipelines, and presents results through interactive visualizations.

**Core Functionality**: The platform provides 8 specialized AI agents—Market Research (competitive intelligence), Doc Comparator (feature gap analysis), Knowledge Graph (entity relationship mapping), Review Analysis (sentiment and aspect extraction), Trend Spotting (temporal topic modeling), Brand Association (semantic mapping), Persona Generator (customer segmentation), and Compliance Checker (GDPR/HIPAA scanning). Four enterprise modules extend these capabilities: Knowledge RAG (document Q&A), Due Diligence (M&A analysis), Report Generator (structured reports), and Risk Monitor (live threat intelligence).

**Inputs**: Natural language queries, document uploads (PDF, TXT), URLs for web scraping, subreddit names for Reddit data, and regulatory text for compliance checks.

**Outputs**: Executive summaries, entity rankings, sentiment distributions, strategic insights, competitor positioning maps, theme clusters, trend analysis, compliance risk reports with article citations, persona profiles, knowledge graphs, and McKinsey-style narrative reports.

**User Experience**: The glassmorphic React interface provides a modern, intuitive dashboard with sidebar navigation, real-time processing indicators, interactive charts (Recharts), knowledge graph visualizations (react-force-graph-2d), and client-side PDF export. Each agent has a tailored UI displaying relevant visualizations—scatter plots for positioning maps, bar charts for sentiment, force-directed graphs for entity relationships.

**Real-world Use Case**: A consultant preparing a competitive analysis for a tech startup uses the Market Research agent to gather intelligence from Reddit discussions and tech news, the Brand Association agent to understand semantic positioning against competitors, and the Persona Generator to derive customer personas from product reviews. They then use the Report Generator to synthesize all findings into a polished client-ready report.

---

# Problem Statement

Manual market research and document analysis are slow, expensive, and prone to human bias. Consultants and analysts spend hours scraping data, reading documents, extracting insights, and synthesizing findings—work that could be automated with modern NLP. Existing solutions either lack analytical depth (generic AI chatbots), require cloud infrastructure with privacy concerns (SaaS tools), or focus on single tasks (specialized compliance tools).

The problem is particularly acute in regulated industries where data privacy is paramount. Cloud-based AI solutions cannot process sensitive documents without risking data exposure. At the same time, the volume of unstructured data—Reddit discussions, news articles, product reviews, regulatory documents—exceeds human analytical capacity.

NEXUS addresses these challenges by providing a comprehensive, local-first platform that combines the precision of classical NLP with the reasoning capabilities of LLMs. It eliminates cloud dependency for sensitive data, automates multi-step analytical workflows, and delivers consultancy-quality outputs that go beyond simple information extraction to provide strategic insights.

---

# Key Features

## Core AI Agents

**Market Research Agent**: Automates competitive intelligence synthesis by ingesting data from Reddit and web sources, extracting named entities, analyzing sentiment, clustering themes, and generating strategic insights with competitor positioning maps. Eliminates manual research cycles while providing data-backed strategic recommendations.

**Document Comparator**: Performs feature gap analysis between two documents using semantic matching (not just string diff), identifying paraphrase-equivalent features through dense similarity analysis. Critical for comparing product specs, privacy policies, or technical documentation where vocabulary differences mask semantic similarities.

**Knowledge Graph Generator**: Automatically constructs entity-relation graphs from unstructured text using dependency parsing and NER ensembles. Enables visual exploration of hidden connections between entities, organizations, and concepts in large document collections.

**Review Analysis Agent**: Deep analysis of product reviews at scale, extracting overall sentiment, aspect-level opinions (e.g., battery life, UI quality), thematic clusters, and contradictions (aspects with mixed sentiment). Identifies product strengths and weaknesses across thousands of reviews in seconds.

**Trend Spotting Agent**: Temporal topic modeling that identifies emerging trends by analyzing topic evolution across time periods, detecting semantic drift, and flagging anomalous term appearances. Enables proactive identification of emerging market trends before competitors.

**Brand Association Agent**: Maps semantic associations and competitive landscape for target brands using dense embedding ranking and thematic role extraction. Reveals how brands are perceived in discourse and identifies semantic positioning relative to competitors.

**Persona Generator**: Derives rich user personas from unstructured text using embedding clustering, psychographic inference, and archetype matching. Transforms scattered feedback into structured persona profiles with demographics, pain points, goals, and representative quotes.

**Compliance Checker**: Automated GDPR/HIPAA compliance scanning with article-level citations using NLI entailment scoring between document chunks and regulatory text. Reduces compliance review time from hours to minutes while providing specific evidence and suggestions.

## Enterprise Modules

**Knowledge RAG Engine**: Enterprise knowledge base that ingests documents and enables natural language queries with cited answers. Uses hybrid FAISS + BM25 retrieval for precise context extraction and supports multi-turn conversations with session memory.

**Due Diligence Agent**: Automated M&A document analysis that extracts financial metrics, identifies legal risks, and generates investment verdicts. Processes PDFs with OCR fallback, ranks risks by severity, and provides worst-case scenario narratives.

**Report Generator**: Transforms raw data, metrics, and bullet points into structured consulting reports with McKinsey-style narrative. Parses diverse input formats, recommends visualizations, and generates chart-ready data structures.

**Risk Monitor**: Live risk intelligence that monitors RSS feeds (BBC, CNN, Reuters, FT) for business-critical events, classifies risks by taxonomy, and maps supply chain impact using NetworkX graphs. Enables proactive risk management with real-time alerts.

## Supporting Features

**Local-First Architecture**: All NLP processing and LLM inference run locally via Ollama, ensuring zero data egress and complete privacy for sensitive documents. No cloud API costs or dependency on external services.

**Multi-Source Data Ingestion**: Combines Reddit JSON API, Playwright web scraping with UA rotation, and optional Exa.ai semantic search to build comprehensive corpora from diverse sources.

**Hybrid Retrieval System**: FAISS dense vector search combined with BM25 sparse retrieval via reciprocal rank fusion, providing both semantic understanding and exact keyword matching.

**Interactive Visualizations**: Recharts for sentiment analysis, trend lines, and positioning maps; react-force-graph-2D for knowledge graph exploration; all with responsive design and smooth animations.

**Client-Side PDF Export**: html2canvas + jsPDF enable users to export reports and visualizations directly from the browser without server-side processing.

---

# Engineering Highlights

**Backend Architecture**: FastAPI application with Uvicorn ASGI server, implementing 12 REST endpoints for agents and enterprise modules. Pydantic v2 schemas provide strict type validation on all request/response boundaries. Lifespan hooks pre-load NLP models (spaCy, sentence-transformers, DeBERTa) at startup to eliminate cold-start latency.

**NLP Engine**: Shared computation layer (nlp_engine.py) providing LRU-cached model singletons for spaCy pipeline, sentence-transformers encoder, DeBERTa sentiment pipeline, and FLAIR NER. Implements classical NLP techniques (tokenization, POS tagging, dependency parsing, morphological analysis), statistical methods (TF-IDF, Word2Vec, LDA topic modeling), and deep learning inference (batch sentiment classification, dense embeddings).

**Multi-Model Ensemble**: Combines FLAIR NER (4-class: PER, ORG, LOC, MISC) with spaCy NER for higher entity recall and precision. Uses reciprocal rank fusion to combine FAISS dense retrieval with BM25 sparse retrieval for optimal context extraction.

**Local LLM Integration**: Async Ollama HTTP client (llm_client.py) interfaces with local llama3 instance, implementing chat and generate endpoints with retry logic and temperature control (0.3 for factual synthesis). All LLM prompts are RAG-grounded with retrieved context to ensure evidence-based outputs.

**Scraping Pipeline**: Playwright browser automation with UA rotation for JS-rendered pages, Reddit JSON API for subreddit search and comment threads, and BeautifulSoup4 for HTML parsing and noise removal. Optional Exa.ai integration for neural semantic search.

**Data Processing**: Adaptive batch sizing for DL inference (32-64 samples) prevents OOM on varying corpus sizes. PDF ingestion cascades through PyMuPDF, pdfplumber, and pytesseract OCR for robust text extraction. FAISS indexes persist to disk with metadata JSON for RAG knowledge base.

**Frontend Architecture**: React 18 with Vite build tool, implementing component-based architecture with 12 agent pages and shared components (Sidebar, Header, Dashboard). Axios API client with 999s timeout handles long-running NLP operations. Framer Motion provides page transitions and card animations.

**Performance Optimizations**: Model pre-loading at startup (5-10 seconds), typical agent latency of 5-15 seconds, batch DL inference with FP16 on CUDA devices, and processing time headers (X-Processing-Time-Ms) on all API responses for monitoring.

**Type Safety**: Pydantic v2 schemas for all 12 request/response models ensure type safety and validation. TypeScript in frontend (via @types packages) provides compile-time type checking.

---

# AI / ML Components

**Large Language Models**: Local Ollama inference using Llama 3 (or Mistral for lighter systems) for synthesis, reasoning, and verdict generation. Prompts are engineered with McKinsey-style personas and RAG-grounded context for evidence-based outputs. Temperature set to 0.3 for factual responses.

**Retrieval-Augmented Generation (RAG)**: Hybrid FAISS dense + BM25 sparse retrieval with reciprocal rank fusion. Sentence-transformers all-MiniLM-L6-v2 (384-dim) encodes chunks and queries. FAISS IndexFlatIP enables fast inner-product search (cosine with normalized vectors). Retrieved chunks injected into LLM prompts with source citations.

**Named Entity Recognition (NER)**: Ensemble approach combining FLAIR (4-class: PER, ORG, LOC, MISC) with spaCy (extended entity types). Post-processing filters junk entities, deduplicates by string similarity, and ranks by frequency. Used across all agents for entity extraction.

**Sentiment Analysis**: DeBERTa-v3 zero-shot NLI model for batch sentiment classification (POSITIVE/NEGATIVE/NEUTRAL + confidence). Supports both document-level and sentence-level analysis. FP16 inference on CUDA for performance. Used in Market Research, Review Analysis, and Brand Association.

**Dense Embeddings**: sentence-transformers all-MiniLM-L6-v2 (22M parameters, 384 dimensions) as primary encoder for semantic similarity, clustering, and retrieval. Used for K-Means clustering, paraphrase detection, and FAISS indexing across all agents.

**Topic Modeling**: Gensim LDA (latent Dirichlet allocation) with 5-15 topics and coherence scoring. Identifies thematic clusters in corpora. Used in Trend Spotting for temporal topic evolution analysis.

**Zero-Shot Classification**: DeBERTa-v3 NLI for entailment scoring between document chunks and regulatory text (Compliance Checker), and pros/cons extraction (Doc Comparator). Scores entailment/neutral/contradiction relationships.

**Abstractive Summarization**: LED and DistilBART models via HuggingFace Transformers for document summarization. Used in Doc Comparator and Market Research for executive summaries.

**Aspect-Level Sentiment**: Combines DeBERTa sentiment with custom aspect lexicons and dependency parse opinion targets to extract sentiment per product attribute (Review Analysis).

**Clustering**: scikit-learn K-Means on sentence-transformer embeddings for persona generation (N personas), review clustering (3-5 clusters), and market research theme identification.

**Vector Search**: FAISS IndexFlatIP for dense vector retrieval. Normalized vectors enable inner-product search equivalent to cosine similarity. Used in RAG engine, Market Research, Compliance Checker, and Brand Association.

**Natural Language Inference (NLI)**: DeBERTa-v3 NLI model for zero-shot classification tasks—compliance entailment scoring, pros/cons extraction, and semantic relationship detection.

---

# Data Engineering / Data Science Components

**Data Ingestion**: Multi-source pipeline combining Reddit JSON API (subreddit search + comments), Playwright browser automation (JS-rendered pages), and optional Exa.ai neural search. BeautifulSoup4 parses HTML and removes noise.

**Text Preprocessing**: spaCy pipeline for sentence segmentation, tokenization, lemmatization, and morphological analysis. NLTK provides stopwords and additional tokenization utilities. Porter stemming available via nlp_engine.

**Feature Engineering**: TF-IDF vectorization (scikit-learn) for vocabulary richness analysis and document representation. N-gram extraction (unigrams to 5-grams) for phrase mining and trend analysis. Word2Vec embeddings (Gensim) for semantic word relationships.

**PDF Processing**: Cascading fallback pipeline—PyMuPDF (fitz) for primary text extraction, pdfplumber for secondary parsing, pytesseract OCR for image-based PDFs. Used in Due Diligence agent for M&A document analysis.

**Financial Entity Extraction**: Regex patterns for revenue, debt, liabilities, costs, and valuations in due diligence documents. Combined with legal NER for comprehensive entity extraction.

**Temporal Analysis**: Time-bucketing of corpora (monthly or equal thirds), centroid computation per period using sentence-transformer embeddings, and cosine distance calculation for drift scoring. Used in Trend Spotting.

**Anomaly Detection**: IQR-based statistical detection of terms with sudden appearance or disappearance between time periods. Flags emerging trends and dying topics.

**Graph Analytics**: NetworkX for knowledge graph construction, centrality measures (betweenness, degree), and supply chain impact mapping in Risk Monitor. Connected component analysis for community detection.

**Data Visualization**: Recharts for bar charts (sentiment distribution), line charts (trend evolution), scatter plots (positioning maps), and pie charts. react-force-graph-2D for interactive knowledge graph visualization.

**Batch Processing**: Adaptive batch sizing (32-64 samples) for DL inference prevents OOM while maximizing throughput. FP16 inference on CUDA reduces memory footprint.

**Persistence**: FAISS binary files + metadata JSON for RAG index persistence. Compliance data stored as CSV (GDPR articles, HIPAA regulations). In-memory session storage for RAG chat history.

---

# Product Thinking

**User-Centric Design**: Each agent addresses a specific consultancy workflow with tailored UI and output format. Market Research delivers strategic insights, Compliance Checker provides article-level citations, Persona Generator produces structured profiles—matching user mental models for each task.

**Reducing Friction**: Single-query interface eliminates complex configuration. Users input a query or upload a document; the system handles data fetching, processing, and synthesis automatically. Glassmorphic UI with smooth animations creates engaging experience.

**Workflow Optimization**: Agents can be chained—Market Research → Report Generator → PDF export—for end-to-end consultancy deliverable creation. Enterprise modules (Due Diligence, Risk Monitor) automate multi-step processes that previously required manual coordination.

**Data Privacy First**: Local-only architecture addresses enterprise concerns about data sovereignty. Sensitive documents never leave the user's machine. Zero cloud API costs also address budget constraints for small consultancies.

**Evidence-Based Outputs**: All LLM synthesis is RAG-grounded with retrieved context and source citations. Compliance Checker provides specific article references, Market Research includes evidence passages. This builds trust and enables verification.

**Scalability Design**: Hybrid FAISS + BM25 retrieval scales to large document collections. Adaptive batch sizing handles varying corpus sizes without code changes. Model pre-loading eliminates cold-start latency for production deployments.

**Decision Support**: Outputs go beyond information extraction to provide strategic recommendations. Market Research includes competitor positioning maps, Due Diligence generates investment verdicts, Risk Monitor suggests mitigation strategies.

**Accessibility**: Client-side PDF export enables offline report sharing. Interactive visualizations accommodate different learning styles (visual vs. textual). Natural language interfaces lower barrier to NLP expertise.

**Adoption Strategy**: Modular architecture allows users to adopt agents incrementally. Start with Market Research, add Compliance Checker as needed. Enterprise modules address advanced use cases without overwhelming new users.

**Prioritization**: Core agents address high-frequency workflows (market research, document comparison). Enterprise modules target high-value but lower-frequency tasks (M&A due diligence, live risk monitoring). This balances immediate value with long-term capability building.

---

# Technologies Used

## Languages

Python 3.10+, JavaScript (ES6+), TypeScript (via @types)

## Frontend

React 18.3.1, Vite 5.3.1, Axios 1.7.2, Recharts 3.8.1, react-force-graph-2D 1.29.1, Framer Motion 12.38.0, jsPDF 4.2.1, html2canvas 1.4.1, Lucide React, react-markdown 10.1.0

## Backend

FastAPI 0.110.0, Uvicorn 0.29.0, Pydantic 2.7.1, httpx 0.27.0, aiohttp 3.9.5, python-multipart, python-dotenv 1.0.1

## Databases

FAISS (vector index), in-memory session storage, file-based persistence (JSON, CSV)

## Cloud

Local-only architecture (no cloud dependencies), optional Exa.ai API for neural search

## AI/ML

spaCy 3.7.1, NLTK 3.8.1, Gensim 4.3.2, scikit-learn 1.4.2, PyTorch 2.3.0, HuggingFace Transformers 4.41.1, sentence-transformers 3.0.0, FLAIR NER, DeBERTa-v3, Ollama (Llama 3/Mistral), FAISS, rank-bm25, BERTopic, UMAP, HDBSCAN

## DevOps

Python venv, npm, Playwright 1.44.0, PyMuPDF, pdfplumber, pytesseract OCR

## APIs

Reddit JSON API, Ollama HTTP API, optional Exa.ai API

## Frameworks

FastAPI (REST), React (UI), Vite (build tool)

## Tools

BeautifulSoup4 4.12.3, lxml 5.2.1, NumPy 1.26.4, Pandas 2.2.2, NetworkX 3.3, SciPy 1.13.0

---

# Skills Demonstrated

Full Stack Development, Backend Engineering, API Design, AI Engineering, NLP Engineering, Retrieval-Augmented Generation, Prompt Engineering, Machine Learning, Deep Learning, Classical NLP, Multi-Agent Systems, Data Engineering, Feature Engineering, Product Strategy, Product Discovery, UX Thinking, Workflow Automation, System Integration, Database Design (Vector Databases), Type Safety (Pydantic, TypeScript), Performance Optimization, Local-First Architecture, Privacy-First Design, Statistical Analysis, Graph Analytics, Computer Vision (OCR), Web Scraping, API Integration, Cloud-Native Thinking, DevOps, Testing (Pydantic validation), Documentation

---

# Resume Impact

- Architected and built NEXUS, a production-grade AI-powered market intelligence platform combining classical NLP, deep learning, and local LLMs to automate consultancy workflows
- Implemented 8 specialized AI agents and 4 enterprise modules using FastAPI, React, and a multi-model NLP ensemble (spaCy, FLAIR, DeBERTa, sentence-transformers)
- Designed hybrid FAISS + BM25 retrieval system with reciprocal rank fusion for precise context extraction in RAG applications
- Built local-first architecture with Ollama LLM inference ensuring zero data egress and complete privacy for sensitive document analysis
- Developed automated GDPR/HIPAA compliance scanner using NLI entailment scoring with article-level citations, reducing review time from hours to minutes
- Created M&A due diligence agent with PDF OCR pipeline, financial entity extraction, and risk severity ranking for investment decision support
- Engineered knowledge graph construction using dependency parsing and NER ensembles with interactive force-directed visualization
- Implemented live risk monitoring system with RSS feed ingestion, taxonomy classification, and NetworkX-based supply chain impact mapping
- Delivered McKinsey-style report generator transforming raw data into structured consulting narratives with chart recommendations
- Achieved 5-15 second agent latency through model pre-loading, adaptive batch sizing, and FP16 inference optimization

---

# Ideal Roles

AI Engineer, Machine Learning Engineer, NLP Engineer, Full Stack Engineer, Backend Engineer, Software Engineer, Applied Scientist, Product Engineer, Technical Product Manager, Data Scientist, ML Platform Engineer, Research Engineer

---

# Portfolio Tags

React, FastAPI, Python, NLP, Machine Learning, Deep Learning, RAG, LLMs, Ollama, spaCy, Transformers, PyTorch, FAISS, Vector Search, Sentiment Analysis, Named Entity Recognition, Topic Modeling, Knowledge Graphs, Web Scraping, OCR, Privacy-First, Local-First, Product Strategy, UX Design, Data Engineering, MLOps

---

# Project Complexity

Advanced

This is a production-grade system demonstrating sophisticated engineering across multiple domains. The project combines classical NLP (spaCy, NLTK, Gensim), modern deep learning (PyTorch, Transformers, sentence-transformers), and LLM integration (Ollama) in a cohesive architecture. It implements 12 distinct analytical workflows, each with specialized NLP pipelines, and integrates them through a unified FastAPI backend and React frontend. The hybrid retrieval system (FAISS + BM25), multi-model NER ensemble, and local-first architecture for privacy demonstrate advanced technical decision-making. The codebase includes ~40,000 lines across backend agents, comprehensive error handling, type validation, and performance optimizations. This goes beyond tutorial-level work to show real-world system integration and product thinking.

---

# One-line Portfolio Summary

Built NEXUS, a production-grade AI-powered market intelligence platform combining classical NLP, deep learning, and local LLMs to automate consultancy workflows with 8 specialized agents and 4 enterprise modules.

---

# Repository Evidence

- README.md (project overview, architecture diagram, NLP technique mapping, setup instructions)
- SYSTEM_DOCUMENTATION.md (comprehensive system documentation, agent breakdown, pipeline flows, tech stack)
- backend/requirements.txt (Python dependencies: FastAPI, spaCy, PyTorch, Transformers, etc.)
- frontend/package.json (React dependencies: Recharts, react-force-graph-2D, Framer Motion, etc.)
- backend/main.py (FastAPI application with 12 API endpoints, CORS, lifespan hooks)
- backend/nlp_engine.py (41KB shared NLP computation layer with model singletons)
- backend/llm_client.py (Async Ollama HTTP client for local LLM inference)
- backend/scraper.py (Playwright + Reddit + Exa scraping pipeline)
- backend/agents/ (12 agent modules: market_research.py, doc_comparator.py, knowledge_graph.py, etc.)
- backend/models/ (Pydantic v2 schemas for request/response validation)
- frontend/src/App.jsx (React app with view routing for 12 agent pages)
- frontend/src/components/ (Sidebar, Header, Dashboard, and 12 agent components)
- frontend/src/api/client.js (Axios API client with 999s timeout)
- backend/rag_data/ (FAISS index persistence directory)
- backend/agents/compliance-data/ (GDPR/HIPAA regulatory corpus CSVs)
- link: https://github.com/pavithra2870/Consultancy-AI