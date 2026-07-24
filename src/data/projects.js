export const projects = [
  {
    id: 'pulseops',
    name: 'PulseOps',
    oneLiner:
      'AI-assisted cluster observability and root-cause analysis platform for Linux node fleets with complete detect → alert → incident → diagnose loop.',
    link: 'https://github.com/pavithra2870/PulseOps',
    complexity: 'Advanced',
    problem:
      'Infrastructure teams need to monitor node fleets, detect issues before they become outages, and diagnose incidents quickly. Existing tools (Prometheus, Grafana, Datadog) are powerful but complex — PulseOps demonstrates understanding of the fundamentals they implement.',
    solution:
      'A full-stack observability platform with 32 REST endpoints, WebSocket real-time updates, and Prometheus metrics exposition. The alert engine performs rule-based threshold evaluation with deduplication and warning→critical escalation. Incident management includes full timelines with status transitions. Nine realistic fault injection modes (CPU spike, memory leak, disk full, network outage, etc.) flow through the actual pipeline for chaos engineering. AI diagnosis uses Gemini with structured JSON output and RAG grounding in FAISS-indexed runbooks.',
    architecture:
      'FastAPI backend with SQLAlchemy 2.0 async, Alembic migrations, and WebSocket hub for real-time updates. Node agents use psutil for Prometheus-style metrics exposition. PostgreSQL with proper indexing for time-series queries, Redis caching with TTL-based invalidation. Every external dependency (Supabase PostgreSQL, Upstash Redis, Gemini AI, Grafana Cloud) has a zero-credential fallback (SQLite, in-memory cache, deterministic mock, local metrics) for immediate demo capability.',
    contributions: [
      'Built the complete backend (FastAPI, SQLAlchemy 2.0 async, Alembic migrations) and frontend (React, Vite, Recharts) with clean layering.',
      'Implemented the alert engine with rule-based threshold evaluation, deduplication, and escalation logic.',
      'Built the incident management system with full timelines and status transitions (open → investigating → mitigated → resolved).',
      'Implemented 9 realistic fault injection modes that flow through the actual pipeline for reproducible diagnosis.',
      'Integrated AI-assisted root-cause analysis using Gemini with structured JSON output and RAG grounding in FAISS-indexed runbooks.',
    ],
    tech: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Redis', 'Prometheus', 'Grafana', 'WebSockets', 'FAISS', 'Google Gemini', 'Docker', 'SQLAlchemy'],
    tags: ['SRE', 'Observability', 'Incident Management', 'Fault Injection', 'FastAPI', 'React', 'AI'],
    challenge:
      'The core design problem was ensuring the AI assists rather than replaces human judgment — every AI output uses structured JSON with schema validation, and the platform works fully without AI via deterministic fallbacks.',
  },
  {
    id: 'nexus',
    name: 'Consultancy AI - Market Intelligence Platform',
    oneLiner:
      'A local-first AI consultancy platform — 8 research agents and 4 enterprise modules combining classical NLP, deep learning, and a local LLM.',
    link: 'https://github.com/pavithra2870/Consultancy-AI',
    complexity: 'Advanced',
    problem:
      'Manual market research and document analysis are slow and inconsistent, and most AI alternatives either lack analytical depth or require sending sensitive documents to the cloud.',
    solution:
      'Consultancy AI runs entirely locally: a multi-model NLP ensemble (spaCy + FLAIR NER, DeBERTa sentiment, sentence-transformer embeddings) handles precise extraction, and a local Ollama LLM (Llama 3) synthesizes the results into consultancy-style reports. Eight specialized agents — market research, document comparison, knowledge graphs, review analysis, trend spotting, brand association, persona generation, and compliance checking — sit alongside four enterprise modules for RAG-based knowledge Q&A, M&A due diligence, report generation, and live risk monitoring.',
    architecture:
      'FastAPI backend with model singletons pre-loaded at startup to avoid cold-start latency; a shared NLP engine layer combining classical techniques (TF-IDF, LDA, dependency parsing) with deep learning inference; hybrid FAISS + BM25 retrieval with reciprocal rank fusion for the RAG engine; and a React + Vite frontend with force-directed graph visualization and client-side PDF export.',
    contributions: [
      'Designed and built all 12 agent/module pipelines and the shared NLP computation layer.',
      'Implemented the hybrid dense + sparse retrieval system for the knowledge RAG engine.',
      'Built the PDF ingestion cascade (PyMuPDF → pdfplumber → OCR) for the due diligence agent.',
      'Built the full React frontend, including the knowledge-graph and positioning-map visualizations.',
    ],
    tech: ['Python', 'FastAPI', 'React', 'Ollama (Llama 3)', 'spaCy', 'FLAIR', 'DeBERTa-v3', 'sentence-transformers', 'FAISS', 'BM25', 'Gensim LDA', 'NetworkX', 'Playwright'],
    tags: ['NLP', 'RAG', 'Local LLM', 'Multi-Agent', 'React', 'FastAPI', 'Privacy-First'],
    challenge:
      'Keeping 12 distinct analytical workflows fast and reliable on local hardware meant pre-loading every model at startup and hand-tuning batch sizes to avoid out-of-memory failures during deep-learning inference.',
  },
  {
    id: 'compliance-ai',
    name: 'ComplianceAI',
    oneLiner:
      'AI-powered call-center compliance monitoring for Tanglish/Hinglish conversations, with explainable SOP validation and semantic search.',
    link: 'https://github.com/pavithra2870/Call-Center-Compliance',
    complexity: 'Advanced',
    problem:
      'Call centers in multilingual regions must manually review thousands of recordings for SOP compliance, and standard English-only NLP models fail on the mixed-language (Tanglish/Hinglish) conversations common in Indian customer service.',
    solution:
      'An internal translation layer converts Tanglish/Hinglish to English before analysis, while the original transcript is preserved for the user — letting downstream models work on clean text without losing authenticity. The system validates a 5-step SOP script, extracts payment analytics and rejection reasons, and justifies every compliance decision with a direct transcript quote.',
    architecture:
      'FastAPI backend with AssemblyAI transcription, Gemini 2.0 Flash Lite for translation and structured analysis, and a 3-pass agentic JSON-healing loop for malformed LLM output. FAISS with sentence-transformer embeddings powers semantic search across the call archive, with queries translated to English first to keep the vector space aligned.',
    contributions: [
      'Designed the internal translation-then-analysis pipeline for code-switched transcripts.',
      'Built the explainable-AI layer that grounds every SOP decision in a transcript quote.',
      'Implemented the agentic JSON-healing loop and multi-layer validation for LLM output reliability.',
      'Built the React dashboard and deployed the service to Hugging Face Spaces with multi-environment config.',
    ],
    tech: ['Python', 'FastAPI', 'React', 'AssemblyAI', 'Google Gemini', 'FAISS', 'sentence-transformers', 'Pydantic v2', 'Docker'],
    tags: ['NLP', 'Explainable AI', 'RAG', 'FastAPI', 'React', 'Compliance', 'Multi-Lingual'],
    challenge:
      'Standard English NLP models produce inaccurate results on code-switched speech — the translation layer had to preserve names, numbers, and intent exactly, since a mistranslation would silently corrupt every downstream compliance score.',
  },
  {
    id: 'nurture-ai',
    name: 'NurtureAI',
    oneLiner:
      'A bilingual AI parenting assistant with a deterministic safety layer that guarantees emergency escalation regardless of what the LLM says.',
    link: 'https://github.com/pavithra2870/NurtureAI',
    complexity: 'Advanced / Production-grade',
    problem:
      'Generic AI chatbots are unsuitable for medical-adjacent parenting questions because they can understate risk or fail to escalate — and a confident-but-wrong answer at 2 a.m. is worse than no answer at all.',
    solution:
      'A layered safety architecture keeps escalation logic outside the LLM entirely: a pre-LLM rule engine matches 30+ critical and 15+ medium-risk patterns before any model runs, a hardcoded emergency bypass skips the LLM completely for critical cases, and a post-LLM safety layer can override the model\'s own risk assessment. Everything else — advice, product suggestions, RAG retrieval — runs through a grounded, bilingual (English/Arabic) pipeline.',
    architecture:
      'FastAPI with async pipeline stages run in parallel via asyncio.gather; hybrid intent and risk classification (regex rules authoritative, TF-IDF + Logistic Regression as fallback only); FAISS-backed RAG over separate knowledge and product indexes; AssemblyAI voice input with automatic language detection; local Ollama (llama3.2) for generation and translation, temperature-capped for factual consistency.',
    contributions: [
      'Designed and implemented the full pre-LLM / bypass / post-LLM safety architecture.',
      'Built the hybrid rule-first, ML-fallback intent and risk classifiers.',
      'Built the bilingual pipeline — Arabic detection, translation, and RTL-aware response delivery.',
      'Built the RAG retrieval and query-enrichment layer, and the React chat UI with voice input review-before-send.',
    ],
    tech: ['Python', 'FastAPI', 'React', 'Ollama (llama3.2)', 'FAISS', 'sentence-transformers', 'scikit-learn', 'AssemblyAI', 'Tailwind CSS'],
    tags: ['Safety-Critical AI', 'RAG', 'Bilingual', 'Voice AI', 'FastAPI', 'React', 'Machine Learning'],
    challenge:
      'The core design problem was asymmetric failure cost: a false negative on an emergency query is catastrophic, so every safety decision had to be made deterministically, with the LLM unable to override or soften it.',
  },
  {
    id: 'network-qoe',
    name: 'Network QoE Prediction System',
    oneLiner:
      'A telecom intelligence platform predicting silent churn and QoE degradation before users complain, with SHAP-based root-cause analysis.',
    link: 'https://github.com/pavithra2870/QoE',
    complexity: 'Advanced',
    problem:
      'Telecom operators lose revenue to silent churn — users who quietly reduce usage due to poor network experience without ever filing a complaint. Traditional monitoring only reacts to explicit faults, missing this pattern entirely.',
    solution:
      'A dual-model architecture combines LSTM networks with attention (for temporal degradation patterns across session sequences) with XGBoost (for fast, explainable tabular predictions), covering both QoE scoring and churn probability. SHAP values attribute every prediction back to specific network KPIs, so operators get root causes, not just scores.',
    architecture:
      'PyTorch LSTM with a dual-head design for simultaneous regression and classification, trained with early stopping, gradient clipping, and OneCycleLR scheduling. A stateless feature-engineering pipeline computes rolling statistics, trend slopes, and decay signals without leaking future data. SHAP TreeExplainer runs against the XGBoost models for both global and per-user explanations, persisted as Parquet for fast dashboard loading.',
    contributions: [
      'Designed the dual-model architecture pairing LSTM sequence modeling with XGBoost interpretability.',
      'Built the leak-safe feature-engineering pipeline (rolling windows, trend slopes, abandonment streaks).',
      'Implemented the SHAP explainability layer and root-cause ranking system.',
      'Built the 7-section Streamlit dashboard, including forecast and intervention-recommendation views.',
    ],
    tech: ['Python', 'PyTorch', 'XGBoost', 'SHAP', 'Streamlit', 'Plotly', 'scikit-learn', 'Ollama'],
    tags: ['Deep Learning', 'XGBoost', 'Explainable AI', 'Time Series', 'Streamlit', 'Telecom'],
    challenge:
      'Balancing sequence-model accuracy against the need for fast, explainable predictions is what motivated the dual-model design — pure LSTM would have sacrificed interpretability operators need to act on a result.',
  },
  {
    id: 'mercado',
    name: 'Product Intelligence Engine (Mercado)',
    oneLiner:
      'A microservices product-research platform that turns scattered user feedback into a financial risk report — built on entirely free-tier infrastructure.',
    link: 'https://github.com/pavithra2870/Product-Research',
    complexity: 'Production-grade',
    problem:
      'Product teams rarely have time to manually aggregate Reddit threads, app-store reviews, and forum posts into a coherent competitive picture, so decisions get made on anecdote instead of signal.',
    solution:
      'Mercado aggregates feedback from five sources (Reddit, HackerNews, Exa neural search, web scraping, app stores), filters it through a four-stage classification pipeline (regex spam filter → DistilBART summarization → Groq/Llama relevance check → RoBERTa sentiment), and routes the cleaned data through four parallel Gemini agents — sentiment, priority, competitor, and financial risk — before compiling a presentation-ready PDF dossier with citations back to every source.',
    architecture:
      'Four independent FastAPI services (gateway, scraper, classifier, analysis) communicating over HTTP, orchestrated with Docker Compose and a Redis-backed job queue so the API returns a job ID instantly and workers process in the background. Async I/O and asyncio.gather run scraping and the four analysis agents concurrently.',
    contributions: [
      'Designed the microservices decomposition and the hybrid local/cloud ML stack for cost control.',
      'Built the four-stage spam/relevance classification pipeline.',
      'Implemented the financial risk model that converts churn signals into estimated revenue at risk.',
      'Built the React terminal-style UI with job resumption via localStorage and mid-run cancellation.',
    ],
    tech: ['Python', 'FastAPI', 'React', 'Redis', 'SQLite', 'Google Gemini', 'Groq (Llama 3.1)', 'RoBERTa', 'DistilBART', 'Docker Compose'],
    tags: ['Microservices', 'Multi-Agent', 'NLP', 'Financial Modeling', 'React', 'Docker', 'Product'],
    challenge:
      'Keeping the entire pipeline on free-tier APIs and open-source models required distributing compute deliberately — cheap local transformers for high-volume filtering, paid APIs reserved only for reasoning-intensive steps.',
  },
  {
    id: 'safespace',
    name: 'SafeSpace',
    oneLiner:
      'A full-stack AI journaling platform where every entry gets real-time sentiment analysis, mood detection, and an AI companion\'s feedback.',
    link: 'https://github.com/pavithra2870/SafeSpace---Journal',
    complexity: 'Intermediate → Production-grade',
    problem:
      "Most journaling apps offer no feedback loop, and the ones that do are either a bare mood emoji or built for therapists rather than the person actually writing.",
    solution:
      'Every journal entry is sent synchronously to the Groq LLM (Llama 3, via an AI persona named Dr. Luna) for sentiment scoring, mood detection, keyword extraction, and encouragement — returned instantly alongside the entry. A dashboard turns weeks of entries into mood trends, a GitHub-style activity heatmap, and streak-based gamification, alongside an affirmations board, a goal tracker, and a community feed.',
    architecture:
      'Express/MongoDB backend with JWT auth, Helmet security headers, and rate limiting. A resilient ChatbotService rotates across up to three Groq API keys with automatic retry on rate-limit or auth failure, and Mongoose virtual properties compute level and streak state on read rather than storing derived data.',
    contributions: [
      'Designed and built the full ChatbotService LLM integration layer, including prompt templates and key-rotation reliability logic.',
      'Built the custom 365-day activity heatmap component from scratch, matching GitHub\'s contribution-graph alignment logic.',
      'Implemented the streak algorithm and points/leveling gamification system.',
      'Built the full REST API across five data domains (journals, affirmations, manifestations, community, insights).',
    ],
    tech: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'React', 'Groq API (Llama 3)', 'Recharts', 'JWT'],
    tags: ['MERN', 'LLM', 'Prompt Engineering', 'Gamification', 'Wellness Tech', 'Full Stack'],
    challenge:
      "Groq's free tier rate limits would otherwise break the always-on AI feedback loop, so reliability had to be engineered directly into the service layer via key rotation rather than assumed away.",
  },
  {
    id: 'focuswin',
    name: 'FocusWin',
    oneLiner:
      'A task manager with a 10-level priority scale, honest analytics, and real-time collaborative team Spaces on Firebase.',
    link: 'https://github.com/pavithra2870/FocusWin-Firebase',
    complexity: 'Intermediate to Advanced',
    problem:
      'Most task managers are either too simple to show meaningful patterns or too heavyweight for everyday personal and small-team use, and personal and team task tools rarely share a data model.',
    solution:
      'A 10-level importance scale plus an independent difficulty tag lets a task be flagged both urgent-and-easy or urgent-and-hard, which a 3-tier priority label can\'t express. Analytics compute honestly from completion timestamps — the calendar heatmap distinguishes on-time from late completions rather than just counting activity. Team Spaces extend the same data model into shared, real-time Kanban boards.',
    architecture:
      'React SPA with Firestore as the primary datastore, real-time sync via onSnapshot listeners for collaborative Spaces. A service-layer abstraction mirrors what would be a REST API contract, and the codebase also retains a full parallel Express/MongoDB reference backend. A custom streak algorithm walks backward through unique completion days handling edge cases like yesterday-only streaks.',
    contributions: [
      'Designed the 10-level priority + difficulty tagging system and the nested group hierarchy.',
      'Built the analytics dashboard, including the custom streak algorithm and calendar heatmap.',
      'Designed and built the Team Spaces collaboration feature with real-time Firestore sync and Kanban view.',
      'Wrote a 20+ test Selenium/pytest suite covering authentication and CRUD flows with failure-screenshot capture.',
    ],
    tech: ['React', 'Firebase Firestore', 'Firebase Auth', 'Firebase Cloud Functions', 'Node.js', 'Express', 'Recharts', 'Selenium', 'pytest'],
    tags: ['Real-time', 'Firebase', 'Collaboration', 'Analytics', 'Testing', 'Full Stack'],
    challenge:
      "Keeping personal and team task data cleanly separated — both in the data model (a spaceId field) and in the UI — was a correctness concern as much as an engineering one, since cross-contamination would silently leak one user's tasks into another's workspace.",
  },
  {
    id: 'onestop25',
    name: 'OneStop 25',
    oneLiner:
      'A Gen Z year-end reflection app — aura points, IN/OUT lists, and AI-personalized affirmations, built around a specific cultural moment.',
    link: 'https://github.com/pavithra2870/One-Stop-25',
    complexity: 'Intermediate — trending toward Production-grade',
    problem:
      'Existing goal-setting and journaling tools are either too clinical (productivity software) or too generic (template journals) for how Gen Z actually processes a year — through humor, cultural shorthand, and peer validation.',
    solution:
      'A 7-step onboarding profile becomes the seed data for four Gemini-powered AI flows: personalized manifestations, IN/OUT trend suggestions, bucket-list predictions, and an "aura calculator" that generates Gen Z-vernacular gain/loss moments. A "Growth Circles" feature turns the app from a solo tool into a shared one, with real-time collaborative bucket lists.',
    architecture:
      'Firebase Cloud Functions running Google Genkit, with each AI flow defining explicit Zod input/output schemas, server-side auth, a Firestore-transaction rate limit (10 calls/day/feature), and a hardcoded fallback guaranteeing a valid response even on model failure. Firestore onSnapshot listeners drive real-time sync across bucket lists and circles.',
    contributions: [
      'Designed the four Genkit AI flows, including prompt constraints for exact word counts, language register, and deduplication against prior outputs.',
      'Built the atomic Firestore-transaction rate limiter to control per-user AI cost.',
      'Designed and built the Growth Circles collaborative feature with email-based invites.',
      'Built the landing page — meme carousel, physics-based marquee, and Gen Z lore quiz — as a deliberate audience filter.',
    ],
    tech: ['React 19', 'Firebase Cloud Functions', 'Google Genkit', 'Google Gemini 2.0 Flash', 'Firestore', 'Zod', 'Framer Motion'],
    tags: ['Gen Z', 'Prompt Engineering', 'Firebase', 'Real-Time Sync', 'Consumer App', 'Personalization'],
    challenge:
      'Every AI flow needed a hardcoded fallback array, since a consumer-facing feature can\'t surface a raw model failure — reliability had to be designed in from the first prompt, not patched on afterward.',
  },
  {
    id: 'consumer-intelligence',
    name: 'Consumer Intelligence Platform',
    oneLiner:
      'An end-to-end consumer analytics platform combining ML segmentation, predictive modeling, LLM personas, and fairness auditing.',
    link: 'https://github.com/pavithra2870/Consumer-Segmentation',
    complexity: 'Advanced',
    problem:
      'Understanding customer segments, predicting churn, and estimating lifetime value usually requires a dedicated data science team — putting real analytics out of reach for smaller product and marketing teams.',
    solution:
      'A guided pipeline takes users from synthetic or uploaded consumer data through clustering-based segmentation, three predictive models (churn, LTV, conversion), SHAP-based explainability, and a fairness audit — then uses a local Ollama LLM to turn each statistical segment into a named persona with motivations, pain points, and recommended actions.',
    architecture:
      'FastAPI with async LLM calls and background-threaded model training to keep the API responsive. KMeans/GMM clustering with PCA for 2D visualization; Gradient Boosting, Random Forest, and Logistic Regression for the three prediction tasks; SHAP TreeExplainer/LinearExplainer for interpretability, with permutation importance as a fallback.',
    contributions: [
      'Built the full ML pipeline — feature engineering, segmentation, and all three predictive models.',
      'Implemented the fairness-auditing engine (adverse impact ratio, demographic parity) with generated mitigation recommendations.',
      'Built the LLM persona-generation flow with structured-JSON prompting and template fallback.',
      'Built the React dashboard, including the what-if simulation tool for scenario planning.',
    ],
    tech: ['Python', 'FastAPI', 'React', 'scikit-learn', 'SHAP', 'Ollama (Llama 3)', 'Pandas', 'Recharts'],
    tags: ['Machine Learning', 'Explainability', 'Fairness', 'LLM Integration', 'FastAPI', 'React'],
    challenge:
      'Bias auditing is rarely included in analytics tooling at all — building it in by default (rather than as an opt-in extra) meant the fairness engine had to run against both churn and conversion models automatically, not on request.',
  },
  {
    id: 'network-qoe',
    name: 'Network QoE Prediction System',
    oneLiner:
      'A telecom intelligence platform predicting silent churn and QoE degradation before users complain, with SHAP-based root-cause analysis.',
    link: 'https://github.com/pavithra2870/QoE',
    complexity: 'Advanced',
    problem:
      'Telecom operators lose revenue to silent churn — users who quietly reduce usage due to poor network experience without ever filing a complaint. Traditional monitoring only reacts to explicit faults, missing this pattern entirely.',
    solution:
      'A dual-model architecture combines LSTM networks with attention (for temporal degradation patterns across session sequences) with XGBoost (for fast, explainable tabular predictions), covering both QoE scoring and churn probability. SHAP values attribute every prediction back to specific network KPIs, so operators get root causes, not just scores.',
    architecture:
      'PyTorch LSTM with a dual-head design for simultaneous regression and classification, trained with early stopping, gradient clipping, and OneCycleLR scheduling. A stateless feature-engineering pipeline computes rolling statistics, trend slopes, and decay signals without leaking future data. SHAP TreeExplainer runs against the XGBoost models for both global and per-user explanations, persisted as Parquet for fast dashboard loading.',
    contributions: [
      'Designed the dual-model architecture pairing LSTM sequence modeling with XGBoost interpretability.',
      'Built the leak-safe feature-engineering pipeline (rolling windows, trend slopes, abandonment streaks).',
      'Implemented the SHAP explainability layer and root-cause ranking system.',
      'Built the 7-section Streamlit dashboard, including forecast and intervention-recommendation views.',
    ],
    tech: ['Python', 'PyTorch', 'XGBoost', 'SHAP', 'Streamlit', 'Plotly', 'scikit-learn', 'Ollama'],
    tags: ['Deep Learning', 'XGBoost', 'Explainable AI', 'Time Series', 'Streamlit', 'Telecom'],
    challenge:
      'Balancing sequence-model accuracy against the need for fast, explainable predictions is what motivated the dual-model design — pure LSTM would have sacrificed interpretability operators need to act on a result.',
  },
  {
    id: 'civicbot',
    name: 'CivicBot',
    oneLiner:
      'A fully serverless WhatsApp assistant that lets citizens report and track civic issues, with AI-driven triage for municipal staff.',
    link: 'https://github.com/pavithra2870/CivicBot',
    complexity: 'Intermediate-Advanced',
    problem:
      'Reporting civic issues is high-friction — citizens have to navigate outdated portals or dedicated apps, so many issues go unreported, and the reports that do arrive are unstructured and manually triaged, leaving critical problems queued behind trivial ones.',
    solution:
      'CivicBot meets citizens on WhatsApp: a message with a description, location, and photo becomes a tracked issue automatically, acknowledged with a tracking ID. Amazon Lex parses intent from the conversation, and Amazon Bedrock (Titan Text Express) classifies severity and writes an executive summary, so a broken water main is flagged HIGH-priority the moment it\'s reported rather than sitting in a manual queue.',
    architecture:
      'A 100% serverless AWS stack — Lambda and API Gateway for compute, DynamoDB for storage — with DynamoDB Streams triggering Lambda functions to push real-time WhatsApp status updates via Twilio whenever a record changes. Amazon Cognito secures the admin REST API, with least-privilege IAM roles and Secrets Manager for API keys, and CloudWatch handles structured logging and alarming.',
    contributions: [
      'Designed the serverless architecture end to end — Lambda, API Gateway, DynamoDB, and the event-driven notification pipeline.',
      'Integrated Amazon Lex and Bedrock for conversational intent parsing and zero-shot severity classification.',
      'Built the secured REST API layer for the admin portal, including Cognito auth and IAM role design.',
      'Built the event-driven DynamoDB Streams pipeline that triggers real-time WhatsApp status notifications.',
    ],
    tech: ['Python', 'AWS Lambda', 'API Gateway', 'DynamoDB', 'Amazon Lex V2', 'Amazon Bedrock', 'Amazon Cognito', 'Twilio WhatsApp API'],
    tags: ['Serverless', 'Conversational AI', 'AWS', 'LLMs', 'Event-Driven', 'GenAI'],
    challenge:
      'Trust had to run both directions — citizens needed confidence a text actually gets acted on, and city staff needed confidence AI triage wouldn\'t bury a genuine emergency, so severity classification had to run automatically on every report rather than waiting for a human to notice it first.',
  },
]
