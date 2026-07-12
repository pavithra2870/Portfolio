# Product Intelligence Engine (Mercado)

An AI-powered product research platform that automates competitive intelligence, user sentiment analysis, and financial risk modeling from distributed public data sources.

---

# Elevator Pitch

Most product teams operate on incomplete information. Checking Reddit threads, scrolling through app store reviews, digging up HackerNews threads, and manually synthesizing that into something actionable takes hours — and most teams simply do not do it. The result is product decisions made on anecdote rather than signal.

Mercado solves this by automating the entire intelligence pipeline. A user submits a product name and within minutes receives a professionally formatted PDF dossier covering user sentiment, prioritized friction points, competitive positioning, and a financial risk model estimating revenue impact from churn events.

The system is designed for product managers, startup founders, and competitive analysts who need data-driven insight without the overhead of a dedicated research function. It aggregates signals from Reddit, HackerNews, neural web search, and app stores, filters out noise through a multi-stage ML classification pipeline, and routes clean data through four parallel AI agents — each specializing in a different dimension of the product landscape.

What makes it different is the depth of the output and the engineering rigor behind it. This is not a wrapper around an LLM that summarizes a few reviews. It is a microservices system with containerized ML models, async orchestration, financial modeling, and production-quality report generation — built entirely on free-tier APIs and open-source models.

---

# Product Overview

**Users:** Product managers evaluating their own product's market perception, startup founders performing competitive due diligence, engineering leads tracking user-reported technical debt, and analysts building market intelligence briefs.

**Primary Workflow:** The user navigates to the Mercado web interface, enters a product name, and optionally provides Monthly Active Users and Average Revenue Per User to enable financial modeling. They submit the form and are taken to a live terminal view that streams progress updates in real time. When analysis completes, they download a PDF report.

**Core Functionality:** The system collects user-generated content from five distinct data sources, deduplicates and classifies it for quality and relevance, routes it through four AI agents running in parallel, generates financial risk projections, and compiles everything into a structured PDF dossier with embedded charts.

**Inputs:** Product name (required), MAU and ARPU metrics (optional for financial modeling), source preferences.

**Outputs:** A professional PDF report containing an executive overview, sentiment analysis with weighted scoring, a prioritized friction matrix, competitive radar chart, financial risk bar chart, incident timeline, and a cited appendix of raw data nodes. A JSON result is also accessible via API.

**User Experience:** The frontend is a minimal, dark-themed React application branded as "Mercado." The landing page offers two entry points — product research and market research. The product research flow uses a terminal-style UI that animates log entries as the pipeline progresses, giving users a sense of live execution. Jobs persist across browser reloads via localStorage, and users can cancel a running job at any time.

**Real-World Use Case:** A product manager at a B2B SaaS company wants to understand why users are churning to a competitor. They enter the competitor's product name, and in under five minutes receive a dossier with verbatim user complaints mapped to specific technical failures, revenue-at-risk estimates by issue category, and a radar chart showing how the competitor scores against a set of benchmarked dimensions.

---

# Problem Statement

Product intelligence is time-consuming, fragmented, and often skipped entirely. The raw data exists — users are posting complaints, comparisons, and feature requests across Reddit, HackerNews, app stores, and review sites constantly — but aggregating, filtering, and analyzing it requires manual effort that most teams cannot sustain.

Existing tools either focus on a single data source (social listening tools, app store monitoring), require manual query design (standard search engines), or produce shallow summaries without financial grounding. None of them connect qualitative user sentiment to quantitative revenue risk estimates, and none generate presentation-ready reports that can go directly to a leadership team.

The result is that competitive analysis is either outsourced to expensive consultants or reduced to gut feeling. Mercado addresses this by making deep product intelligence accessible, automated, and fast.

---

# Key Features

## Data Collection and Aggregation

**Multi-Source Scraping** collects user feedback from Reddit (via stealth JSON API with randomized user agents and jittered request timing), HackerNews (via Algolia search), Exa neural search (semantic web search targeting community discussions, technical feedback, and comparative content), BeautifulSoup4 web scraping, and Apple and Google app store APIs. These run concurrently using async I/O, reducing total collection time significantly compared to sequential execution.

**Intelligent Deduplication** removes duplicate content using URL-based exact matching before passing data downstream. This prevents the same review from inflating sentiment scores or appearing multiple times in the cited appendix.

## Classification Pipeline

**Hybrid Spam and Relevance Filtering** is the system's most technically interesting component. Raw reviews pass through four sequential stages: regex-based hard filters remove obvious spam and promotional content; DistilBART summarizes long reviews to reduce downstream token costs; Groq-hosted Llama-3.1 performs product-specific relevance verification to remove off-topic content; and RoBERTa (trained on Twitter data) performs sentiment classification. This layered approach achieves high-accuracy filtering without relying on a single expensive LLM call for everything.

**Quality Scoring** assigns each review a normalized 0–1 score based on text length, upvote count, and source credibility. This score is used downstream to weight sentiment aggregation, ensuring high-signal content influences the analysis more than low-engagement posts.

## AI Analysis Agents

**Four Parallel AI Agents** each run against the classified review set using Gemini 2.5 Flash:

- The Sentiment Agent computes weighted aggregate sentiment and performs aspect-level analysis across dimensions like pricing, UX, and performance.
- The Priority Agent extracts reported technical issues, scores them by impact and frequency, and outputs a prioritized remediation matrix.
- The Competitor Agent identifies competitors mentioned in reviews and generates comparative positioning analysis.
- The Risk Agent identifies churn-driving events, categorizes them, and estimates revenue impact using financial inputs provided by the user.

These agents run in parallel using asyncio, reducing total analysis time compared to sequential execution.

## Financial Modeling

**Revenue Risk Estimation** converts qualitative churn signals into dollar-denominated risk estimates. The calculation weights churn event severity scores against the estimated monthly price per user, grouped by issue category. This gives product and finance teams a quantified view of the business impact of specific product failures.

**Visual Analytics** includes three embedded charts in every report: a horizontal bar chart of estimated revenue at risk by issue category, a time-series incident frequency chart, and a polar radar chart comparing the target product against its primary competitor across five scored dimensions.

## Reporting

**PDF Report Generation** produces a professionally formatted dossier using a Markdown-to-HTML-to-PDF pipeline. Reports include a cover page, table of contents, executive summary, priority matrix, competitive analysis, financial projections, visual analytics section, and a full cited appendix mapping every data node to its source URL. The output is presentation-ready without any post-processing.

## User Interface

**Live Terminal Progress View** streams pipeline stage updates to the frontend in real time via polling. Log entries animate in with status indicators, giving users visibility into scraping, classification, analysis, and report generation stages. Jobs survive page reloads and can be cancelled mid-execution.

---

# Engineering Highlights

**Microservices Architecture** separates concerns across four services: a gateway handling API routing and job state, a scraper service for data collection, a classifier service for ML-based filtering, and an analysis service for AI agents and report generation. Services communicate via HTTP with explicit timeouts. This design isolates ML model memory usage, allows independent scaling of compute-heavy components, and provides fault tolerance — if one service degrades, others continue processing.

**Async Orchestration** is used throughout. The gateway returns a job ID immediately on request submission. Background workers execute the pipeline stages. Within the analysis service, all four AI agents run concurrently using asyncio.gather. Scraping tasks also execute in parallel, with synchronous scrapers offloaded to thread pool executors to avoid blocking the event loop.

**Hybrid ML Stack** combines local inference with cloud APIs. DistilBART and RoBERTa run locally via HuggingFace Transformers on CPU, handling tasks where latency is not critical. Groq-hosted Llama-3 is used for fast, cheap relevance classification. Gemini 2.5 Flash handles the reasoning-intensive analysis agents. The result is a pipeline that is both cost-effective and high-quality, with the compute cost distributed appropriately across task types.

**Job State Persistence** uses SQLite with SQLAlchemy for tracking job lifecycle, stage, progress percentage, and error state. The database schema supports upgrade to PostgreSQL without changes to application logic.

**Queue-Based Background Processing** uses Redis Queue to decouple API responsiveness from job execution. The gateway enqueues work and returns within milliseconds; workers pick up jobs asynchronously.

**Docker Compose Deployment** orchestrates all services with health checks, shared volumes for PDF reports and SQLite databases, and memory limits on the classifier service to prevent OOM conditions from HuggingFace model loading.

**Frontend** is built in React 19 with Vite, using Framer Motion for animations, react-router-dom for navigation, and Axios for API communication. State is managed with React hooks and persisted in localStorage to support job resumption across reloads.

---

# AI / ML Components

**Large Language Models:** Google Gemini 2.5 Flash serves as the primary reasoning engine, powering all four analysis agents via structured JSON prompting. Groq-hosted Llama-3.1-8b-instant is used in the classification pipeline for fast, inexpensive relevance verification. An optional Ollama integration (Gemma2:2b) supports local, private inference for market research enrichment.

**Transformer-Based NLP:** RoBERTa (twitter-roberta-base-sentiment) provides sentiment classification on informal text, outperforming rule-based approaches on social media content. DistilBART performs abstractive summarization to compress long reviews before they reach the LLM relevance filter, reducing token consumption by compressing input length.

**Semantic Similarity:** MiniLM (all-MiniLM-L6-v2) via sentence-transformers is used in the classifier to compare review embeddings against anchor embeddings for promotional content detection. Cosine similarity scores determine whether a piece of content is more semantically similar to genuine reviews or advertising copy.

**Neural Search:** Exa's neural search API performs semantic retrieval across the web using vector embeddings, targeting community discussions, technical feedback, professional comparisons, and review aggregators — going beyond keyword search to find contextually relevant content.

**Prompt Engineering:** Every LLM interaction uses structured prompts that enforce JSON output schemas, provide product-specific context, and specify analytical frameworks (e.g., ICE scoring for the priority agent, severity-weighted risk for the risk agent). This ensures consistent, parseable outputs across all agents.

**Financial Risk Modeling:** The finance engine uses an LLM to extract churn event categories and severity scores from review text, then applies a deterministic calculation to estimate revenue at risk. Visualization of this data is handled with Matplotlib and Seaborn.

---

# Data Engineering / Data Science Components

**Multi-Source Data Collection Pipeline** aggregates heterogeneous data from Reddit JSON API, HackerNews Algolia API, Exa neural search, BeautifulSoup4 HTML scraping, and app store feeds into a unified ReviewItem schema with normalized fields for source, text, URL, date, upvotes, and platform.

**Feature Engineering** derives quality signals from raw review metadata: text length, upvote count, and source credibility are combined into a normalized quality score that weights downstream sentiment aggregation.

**Weighted Sentiment Aggregation** computes a 0–10 sentiment score across all classified reviews using quality scores as weights, ensuring that high-engagement, high-credibility reviews exert proportionally more influence on the aggregate score than low-quality noise.

**Financial Data Extraction** uses LLM-based structured extraction to convert unstructured review text into categorized churn events with severity scores. Pandas is used for grouping and aggregation before visualization.

**Data Visualization** generates three chart types per report: revenue-at-risk bar charts (Seaborn), incident frequency time-series (Matplotlib), and competitive radar charts (Matplotlib polar). All charts are embedded directly in the PDF at 300 DPI.

---

# Product Thinking

**Zero-Friction Input** is a deliberate design choice. The only required input is a product name. Financial parameters are hidden behind an "Add Internal Data" disclosure to avoid overwhelming users on first interaction, while still enabling more sophisticated analysis for users who want it.

**Job Resumption** via localStorage reflects an understanding of real user behavior. Analysis jobs take 2–5 minutes, and users should not lose their progress if they accidentally close a tab or refresh the page. The frontend reconnects to an in-progress job automatically.

**Terminal-Style Progress UI** is a UX decision that suits the target audience — technical users and product managers who appreciate transparency about what a system is doing. Rather than a generic spinner, the live log gives users confidence that work is actually happening and tells them which stage they are in.

**Cancellation Support** acknowledges that users may realize mid-run that they typed the wrong product name, or that the job is taking too long. Providing a stop mechanism and clean error state reduces frustration and encourages re-engagement.

**Audit-Grade Output** — the cited appendix in every report maps every insight back to a specific data node with a source URL. This is not just a feature; it is a product positioning decision. Intelligence reports that cannot be verified are not trusted by product and finance stakeholders. The appendix turns the PDF into a defensible document.

**Cost-Zero Architecture** is itself a product decision. Designing the entire stack to run on free API tiers (Gemini, Groq) and open-source models means the system can be demonstrated, iterated on, and pitched without ongoing operational cost. This is relevant for a bootstrapped product or a portfolio project that needs to remain live.

**Microservices as a Product Decision:** The service decomposition is not just an engineering choice — it is a product scalability decision. Separating the scraper from the classifier from the analysis service means that adding a new data source (e.g., LinkedIn, G2 reviews) does not require touching classification or analysis logic. New analysis agents can be added without modifying the data collection layer. The architecture supports product evolution without accumulating technical debt.

---

# Technologies Used

## Languages
- Python 3.11
- JavaScript (ES2022)

## Frontend
- React 19
- Vite
- Framer Motion
- React Router DOM
- Axios
- Lucide React

## Backend
- FastAPI
- Uvicorn (ASGI)
- httpx
- Pydantic v2
- python-dotenv

## Databases
- SQLite
- SQLAlchemy 2.0

## Queue / Async
- Redis
- Redis Queue (RQ)
- asyncio

## AI / ML
- Google Gemini 2.5 Flash
- Groq (Llama-3.1-8b-instant)
- HuggingFace Transformers (RoBERTa, DistilBART)
- Sentence Transformers (MiniLM)
- PyTorch
- spaCy
- VADER
- BERTopic

## Data Science
- NumPy
- Pandas
- scikit-learn
- Matplotlib
- Seaborn

## Scraping / Search
- BeautifulSoup4
- Exa API (neural search)
- httpx (async HTTP)
- fake-useragent

## Report Generation
- xhtml2pdf
- ReportLab
- Python Markdown

## DevOps
- Docker
- Docker Compose

## APIs
- Google Gemini API
- Groq API
- Exa API
- Reddit JSON API
- HackerNews Algolia API
- Apple App Store RSS
- Google Play API

---

# Skills Demonstrated

- Full Stack Development
- Backend Engineering
- Microservices Architecture
- API Design
- AI Engineering
- Multi-Agent Systems
- Prompt Engineering
- Retrieval-Augmented Signal Collection
- NLP Pipeline Design
- Transformer Model Deployment
- Semantic Similarity and Embedding Search
- Hybrid ML Architecture (local + cloud)
- Financial Modeling and Risk Quantification
- Data Visualization
- Async and Concurrent Programming
- Queue-Based Job Orchestration
- Web Scraping and Data Collection
- Feature Engineering
- PDF Report Generation
- React Frontend Development
- UX Thinking
- Product Strategy
- Containerization and Deployment
- System Integration

---

# Resume Impact

- Designed and built a production-grade product intelligence platform using a microservices architecture with four independently deployed FastAPI services, Docker Compose orchestration, and Redis queue-based job processing
- Engineered a multi-stage NLP classification pipeline combining DistilBART summarization, RoBERTa sentiment analysis, and Groq Llama-3 LLM-based relevance filtering to process user-generated content at scale with high-accuracy spam rejection
- Built a multi-agent AI analysis system using four parallel Gemini 2.5 Flash agents to perform sentiment scoring, priority matrix generation, competitor benchmarking, and financial risk modeling from unstructured review data
- Implemented a financial risk quantification model that converts qualitative churn signals into estimated monthly revenue-at-risk figures by category, producing board-ready PDF reports with embedded data visualizations
- Automated multi-source data collection from Reddit, HackerNews, Exa neural search, web scraping, and app stores using async I/O and concurrent task execution, normalizing heterogeneous content into a unified review schema
- Designed a hybrid LLM architecture combining local CPU inference (RoBERTa, DistilBART) with cloud APIs (Gemini, Groq) to optimize cost and latency across pipeline stages, enabling production-grade analysis on zero-cost API tiers
- Built a React 19 frontend with real-time job progress streaming, Framer Motion animations, localStorage-based job resumption, and mid-execution cancellation support
- Applied prompt engineering techniques including structured JSON output schemas, role-based prompting, and product-context injection to produce consistent, parseable LLM outputs across all analysis agents

---

# Ideal Roles

- AI Engineer
- Full Stack Engineer
- Backend Engineer
- Machine Learning Engineer
- Applied Scientist
- Product Engineer
- Technical Product Manager
- Data Scientist

---

# Portfolio Tags

FastAPI · React · Python · LLM · Multi-Agent · Prompt Engineering · NLP · Transformers · RAG · Microservices · Docker · Redis · Sentiment Analysis · Financial Modeling · Web Scraping · Data Visualization · Gemini · Groq · Async · PDF Generation

---

# Project Complexity

**Production-grade**

This project goes well beyond a hobby app or API wrapper. It implements a full microservices architecture with independent services, containerized ML model deployment, queue-based async job processing, a multi-agent AI system with financial modeling, and a polished React frontend with stateful UX. The engineering decisions — hybrid ML cost optimization, fault isolation between services, graceful degradation when services fail, audit-grade output traceability — reflect production engineering thinking. The system was designed to handle real workloads, run entirely on free-tier infrastructure, and produce output that could realistically be handed to a product leadership team.

---

# One-line Portfolio Summary

An end-to-end product intelligence platform that aggregates user feedback from five data sources, filters it through a multi-stage NLP pipeline, and generates financial risk reports and competitive analysis using four parallel AI agents.

---

# Repository Evidence

- `README.md` — architecture overview, tech stack rationale, service breakdown, scalability notes
- `featurelist.md` — detailed feature specifications and ML technique inventory
- `frontend/package.json` — React 19, Vite, Framer Motion, Axios, react-router-dom
- `frontend/src/LandingPage.jsx` — product branding ("Mercado"), capability cards, navigation
- `frontend/src/ProductResearch.jsx` — terminal UI, job lifecycle management, localStorage persistence, cancellation
- `frontend/src/services/api.js` — API contract with gateway (analyze, status, cancel, download endpoints)
- `main.py` — original monolith pipeline showing product research flow
- `services/llm_engine.py` — Gemini 2.5 Flash integration, structured prompt engineering
- `services/classifier_engine.py` — MiniLM embedding-based spam classifier with anchor comparison
- `services/finance_engine.py` — LLM-based financial extraction, three-chart visualization pipeline
- `services/report_generator.py` — Markdown→HTML→PDF pipeline, corporate CSS, appendix generation
- `services/scraper_engine.py` — async parallel scraping orchestration, deduplication
- `scrapers/reddit_scraper.py` — stealth headers, randomized user agents, fallback routing
- `scrapers/exa_scraper.py` — Exa neural search integration, multi-source label detection
- link: https://github.com/pavithra2870/Product-Research