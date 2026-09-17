export const projects = [
  {
    id: 'nexus',
    name: 'Consultancy AI - Market Intelligence Platform',
    oneLiner:
      'A local-first AI consultancy platform — 8 research agents and 4 enterprise modules combining classical NLP, deep learning, and a local LLM.',
    link: 'https://github.com/pavithra2870/Consultancy-AI',
 
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
    id: 'civicbot',
    name: 'CivicBot',
    oneLiner:
      'A fully serverless WhatsApp assistant that lets citizens report and track civic issues, with AI-driven triage for municipal staff.',
    link: 'https://github.com/pavithra2870/CivicBot',
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
  {
    id: 'compliance-ai',
    name: 'ComplianceAI',
    oneLiner:
      'AI-powered call-center compliance monitoring for Tanglish/Hinglish conversations, with explainable SOP validation and semantic search.',
    link: 'https://github.com/pavithra2870/Call-Center-Compliance',
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
  id: 'geo-bias-analyzer',

  name: 'GEO Bias Analyzer',

  oneLiner:
    'Research pipeline that audits LLM product recommendations for commercial bias using Share of Model, SHAP, and agentic analysis.',

  link: 'https://github.com/pavithra2870/GEO-Bias-Analyzer',
  demo: 'https://pavithra2870.github.io/GEO-Bias-Analyzer/',


  problem:
    'As product discovery shifts from search engines to AI recommendations, emerging brands may be harder to discover than established brands. Existing SEO metrics do not directly measure how brands appear inside LLM-generated recommendations.',

  solution:
    'Built a reproducible audit system that queries multiple LLMs across personas, funnel stages, regions, and categories, then combines recommendation data with public web signals to measure and explain brand visibility.',

  architecture:
    'Configuration-driven Python pipeline orchestrating prompt generation, multi-provider LLM auditing, metadata scraping, feature engineering, surrogate ML modeling, and SHAP analysis, with Reflexion-based bias critique and DiCE counterfactual analysis as agentic extensions.',

  contributions: [
    'Designed the Share of Model (SoM) metric to quantify and compare brand visibility across LLM recommendations.',
    'Built a multi-provider LLM audit pipeline with structured outputs, rate limiting, checkpointing, and graceful failure handling.',
    'Engineered a 33+ feature brand metadata pipeline using WHOIS, Wikipedia, Google Trends, DuckDuckGo, and SEO signals.',
    'Applied Random Forest/XGBoost with SHAP to explain which public-web signals are associated with recommendation visibility.',
    'Implemented agentic extensions for bias self-critique and counterfactual “what-if” analysis using Reflexion and DiCE.',
    'Built the research workflow to be configurable and reproducible, with CLI stage selection, experiment controls, and generated visual analyses.'
  ],

  tech: [
    'Python',
    'LangChain',
    'Gemini',
    'Groq',
    'Ollama',
    'Scikit-learn',
    'XGBoost',
    'SHAP',
    'DiCE',
    'Pandas',
    'Pydantic',
    'Web Scraping',
    'YAML'
  ],

  tags: [
    'LLM Research',
    'GEO',
    'Explainable AI',
    'AI Bias',
    'Machine Learning',
    'Agentic AI',
    'Data Science',
    'Research Engineering'
  ],

  challenge:
    'LLM recommendations are opaque and can vary across models, prompts, personas, and regions. The pipeline therefore had to make recommendation visibility measurable while separating observed LLM behaviour from hypotheses about why that behaviour occurs.'
},
{
  id: 'archestra-mcp-hackathon',
  name: 'Archestra Agentic Hackathon',
  oneLiner: 'Built four AI agents for career planning, project discovery, research, and side-project collaboration as open-source hackathon contributions.',
  link: 'https://github.com/archestra-ai/apps-gallery',

  problem: 'AI assistants become significantly more useful when they can reason over a user’s real-world tools and data, but many agent experiences remain generic and disconnected from personal context.',

  solution: 'Built and contributed four specialized agents to the Archestra Apps Hackathon, using MCP-connected tools to turn personal data and external knowledge into actionable workflows — matching projects to jobs, deciding what to do with abandoned projects, exploring research literature, and finding collaborators for side projects.',

  architecture: 'MCP-powered agent workflows built within Archestra, combining specialized prompts, tool calls, external data sources, and multi-step reasoning into interactive app experiences. Each agent is designed around a focused workflow rather than a generic chatbot.',

  contributions: [
    'Built a Project-to-Job Matcher that connects career context, projects, skills, and target roles to identify gaps and generate a prioritized roadmap for becoming job-ready.',
    'Built Project Graveyard, an agent that analyzes GitHub repositories, activity, technologies, issues, and history to decide whether abandoned projects should be revived, archived, merged, showcased, or turned into startup ideas.',
    'Built a Research Paper Digest agent that searches research literature, summarizes and compares papers, follows citations and references, and surfaces open problems, future work, datasets, and potential research directions.',
    'Built Side Project Tinder, a collaboration-matching agent that connects people based on project ideas, complementary skills, and missing roles to identify potential co-builders.',
    'Designed the agents around workflows, turning external tools and personal context into structured recommendations rather than simple conversational responses.',
    'Contributed the resulting agent experiences to Archestra’s open-source Apps Hackathon gallery as replayable interactive app sessions.'
  ],

  tech: [
    'Archestra',
    'AI Agents',
    'LLMs',
    'Tool Calling',
    'Multi-Step Workflows',
    'GitHub',
    'Web Research'
  ],

  tags: [
    'Open Source',
    'Hackathon',
    'AI Agents',
    'Agentic AI',
    'LLM',
    'Product Engineering',
    'Developer Tools',
    'Research'
  ],

  challenge: 'The challenge was designing agents that actually benefit from tool access rather than behaving like generic chatbots. Each workflow had to translate fragmented external information into a useful decision or action while keeping the interaction simple enough to work as a focused product experience.'
},
  {
    id: 'nurture-ai',
    name: 'NurtureAI',
    oneLiner:
      'A bilingual AI parenting assistant with a deterministic safety layer that guarantees emergency escalation regardless of what the LLM says.',
    link: 'https://github.com/pavithra2870/NurtureAI',
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
  id: 'adv-audit',
  name: 'Adv-Audit',
  oneLiner: 'Neuro-symbolic AI system for auditing RTB decisions with explainability, bias detection, and human-in-the-loop control.',
  link: 'https://github.com/pavithra2870/Adv-Audit',

  problem: 'Real-Time Bidding systems make ad-buying decisions in milliseconds, but advertisers often cannot see why individual bids were made, whether demographic disparities exist, or how to correct problematic model behavior.',

  solution: 'An advertiser-facing audit platform that combines pCTR prediction, SHAP explanations, demographic bias detection, counterfactual analysis, and symbolic policy rules. Human feedback is incorporated through active learning, model fine-tuning, and rule optimization to make automated bidding more transparent and controllable.',

  architecture: 'Python-based Streamlit system combining HistGradientBoosting and DeepFM models for pCTR prediction with a unified model API. A multi-layer XAI engine provides SHAP, counterfactual, bias, and natural-language explanations, while a symbolic rule layer enables immediate bid controls. Advanced modules add active learning, causal inference, contextual bandits, online learning, and A/B testing.',

  contributions: [
    'Designed a neuro-symbolic RTB architecture combining neural pCTR prediction with human-defined symbolic rules for immediate advertiser control.',
    'Built a unified XAI layer with local/global SHAP explanations, demographic bias detection using Cohen’s d, counterfactual analysis, and LLM-generated natural-language explanations.',
    'Implemented a human-in-the-loop feedback system with uncertainty-based active learning, model fine-tuning, and Thompson Sampling for rule optimization.',
    'Engineered a shadow audit architecture that runs explanation workloads asynchronously without affecting the live RTB decision path.',
    'Implemented advanced experimentation modules including IPW/AIPW causal inference, LinUCB contextual bandits, online learning with drift detection, and A/B testing.',
    'Built a reproducible synthetic RTB data generator with controlled bias injection, realistic feature correlations, noise, and missing-value patterns for research experiments.'
  ],

  tech: [
    'Python',
    'Streamlit',
    'scikit-learn',
    'DeepFM',
    'PyTorch',
    'SHAP',
    'DICE-ML',
    'Ollama',
    'Pandas',
    'NumPy',
    'SciPy',
    'Plotly',
    'Causal Inference',
    'Contextual Bandits'
  ],

  tags: [
    'Explainable AI',
    'XAI',
    'Neuro-Symbolic AI',
    'Machine Learning',
    'Bias Detection',
    'Human-in-the-Loop',
    'Causal AI',
    'Reinforcement Learning',
    'Contextual Bandits',
    'Deep Learning',
    'AdTech',
    'Real-Time Bidding'
  ],

  challenge: 'RTB decisions must be made within strict latency constraints while still supporting detailed auditing and human control. The system therefore separates the live bidding path from computationally expensive XAI workloads and combines probabilistic model outputs with deterministic symbolic rules for immediate enforcement.'
},
{
  id: 'fact-knowledge-layer',
  name: 'Fact Knowledge Layer',
  oneLiner: 'Evidence-first document intelligence system that extracts verifiable facts and distinguishes contradictions from contextual differences across PDFs.',
  link: 'https://github.com/pavithra2870/Fact-Knowledge-Layer',

  problem: 'Comparing facts across reports, filings, and research documents is difficult because different values may reflect legitimate differences in time period, geography, units, or estimate status. Naive document AI systems often flag these as contradictions or provide answers without verifiable evidence.',

  solution: 'A document intelligence pipeline that extracts structured facts with source-level provenance, verifies every citation against the original document, retrieves related facts using hybrid semantic and keyword search, and combines deterministic contextual reasoning with LLM classification to identify corroboration, contradiction, contextual reconciliation, or unrelated facts.',

  architecture: 'React frontend with a FastAPI backend orchestrating PDF/OCR ingestion, schema-constrained LLM extraction, evidence verification, FAISS + BM25 hybrid retrieval, Reciprocal Rank Fusion, cross-encoder reranking, contextual reasoning, and relationship classification. SQLite stores structured facts and provenance, while NetworkX and D3.js provide an interactive knowledge graph over the fact relationships.',

  contributions: [
    'Built an evidence-first fact extraction pipeline using PyMuPDF, EasyOCR, schema-constrained LLM outputs, and strict citation verification against source documents.',
    'Designed hybrid fact retrieval combining FAISS semantic search, BM25 keyword matching, Reciprocal Rank Fusion, and cross-encoder reranking.',
    'Implemented deterministic contextual reasoning for fiscal periods, geographic scope, units, and estimate-versus-actual status before LLM relationship classification.',
    'Engineered multi-provider LLM routing across Gemini, Groq, and Ollama with per-key quota pools, rate-limit cooldowns, and page-level failover.',
    'Built incremental document processing with parallel page extraction, persisted extraction failures, automatic index updates, and recovery of interrupted jobs.',
    'Developed the React/D3 interface with real-time SSE progress tracking, evidence-centric comparisons, interactive knowledge graphs, document previews, and human feedback.'
  ],

  tech: [
    'Python',
    'FastAPI',
    'React',
    'FAISS',
    'BM25',
    'Sentence Transformers',
    'Gemini',
    'Groq',
    'Ollama',
    'PyMuPDF',
    'EasyOCR',
    'NetworkX',
    'D3.js',
    'SQLite',
    'Pydantic'
  ],

  tags: [
    'AI/ML',
    'RAG',
    'Document Intelligence',
    'Hybrid Retrieval',
    'LLMs',
    'Knowledge Graph',
    'NLP',
    'OCR',
    'FAISS',
    'Explainable AI',
    'Backend Engineering',
    'Full Stack'
  ],

  challenge: 'Document comparisons require more than semantic similarity: two different values can both be correct when their fiscal periods, geographic scope, units, or estimate status differ. The system therefore combines deterministic contextual checks with LLM reasoning while enforcing evidence verification so unsupported or fabricated citations never become accepted facts.'
},
  {
    id: 'airmind-ai',
    name: 'AirMind AI',
    oneLiner:
      'A comprehensive urban air quality management system that transforms cities from reactive pollution monitoring to proactive intervention with forecasting, attribution, intervention planning, and AI-powered guidance.',
    link: 'https://github.com/pavithra2870/AirMind-AI',
    problem:
      'Most air quality tools tell you pollution is bad after it\'s already bad. They lack predictive capabilities, actionable insights, and the ability to explain why air quality is deteriorating or what to do about it. City administrators operate without a unified system to forecast pollution, understand its sources, evaluate intervention strategies, or communicate effectively with citizens.',
    solution:
      'An integrated operating system that combines real-time monitoring, machine learning forecasting, source attribution, intervention planning, and grounded AI assistance—all in one platform. Features include a live city intelligence dashboard, XGBoost-based AQI forecasting, pollution attribution agent, intervention planner with impact estimation, scenario simulator, and dual AI copilots for citizens and commissioners.',
    architecture:
      'Full-stack with React + Vite frontend and FastAPI backend with modular architecture (api → services → agents → ai/rag). Data pipeline ingests live data from WAQI API with historical backfill from OpenWeather, stored in Supabase (Postgres). XGBoost forecaster with feature engineering and bounded recursive prediction. RAG pipeline uses MiniLM embeddings, FAISS vector store, and Gemini LLM with similarity threshold gating. Every external dependency has a fallback path for graceful degradation.',
    contributions: [
      'Built the complete full-stack system with React + Vite frontend and FastAPI backend with clean modular architecture.',
      'Implemented the XGBoost forecast engine with feature engineering, bounded recursive prediction, and confidence bands.',
      'Built the pollution attribution agent that computes source contributions from live pollutant concentrations.',
      'Implemented the intervention planner with ranked measures, impact estimation, and diminishing-returns aggregation.',
      'Built the RAG-powered Citizen and Commissioner copilots with grounded answers, confidence scores, and refusal to hallucinate.',
      'Designed the graceful degradation strategy ensuring the system never breaks during demonstrations.',
    ],
    tech: ['React', 'Vite', 'FastAPI', 'XGBoost', 'MiniLM', 'FAISS', 'Google Gemini', 'Supabase', 'Leaflet.js', 'Recharts', 'WAQI API', 'OpenWeather API'],
    tags: ['Full-Stack', 'Machine Learning', 'RAG', 'Geospatial', 'Smart City', 'FastAPI', 'React', 'AI/ML'],
    challenge:
      'The core design problem was ensuring the system never fails during demonstrations — every external dependency (MiniLM, FAISS, trained model, backend APIs) has a fallback path, from hashed embeddings to numpy search to analytic projection to frontend mock layers, enabling immediate demo capability with zero API keys.',
  },
  {
    id: 'mercado',
    name: 'Product Intelligence Engine (Mercado)',
    oneLiner:
      'A microservices product-research platform that turns scattered user feedback into a financial risk report — built on entirely free-tier infrastructure.',
    link: 'https://github.com/pavithra2870/Product-Research',
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
    id: 'onestop25',
    name: 'OneStop 25',
    oneLiner:
      'A Gen Z year-end reflection app — aura points, IN/OUT lists, and AI-personalized affirmations, built around a specific cultural moment.',
    link: 'https://github.com/pavithra2870/One-Stop-25',
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
  id: 'helm-rank',
  name: 'HELM-Rank',
  oneLiner: 'AI-powered exam grading platform combining OCR, knowledge grounding, Elo ranking, and teacher-aligned RLHF.',
  link: 'https://github.com/pavithra2870/HELM-Rank',

  problem: 'Manual exam grading is slow, inconsistent, and difficult to audit, while existing automated graders either rely on shallow keyword matching or produce opaque LLM-based scores without teacher feedback loops.',

  solution: 'A full-stack grading pipeline that processes handwritten or typed answer sheets through confidence-gated OCR, hierarchical grading, knowledge-grounded retrieval, Elo-based ranking, and uncertainty-adjusted scoring, while allowing teachers to refine model behavior through a safeguarded RLHF feedback loop.',

  architecture: 'React 18 frontend with a FastAPI backend orchestrating modular ML services for OCR, diagram parsing, hierarchical grading, knowledge grounding, Elo ranking, uncertainty propagation, and RLHF alignment. Custom FAISS RAG with sentence-transformer embeddings and TF-IDF fallback provides course-material grounding, while Ollama/LLaMA3 generates explanations and reasoning traces.',

  contributions: [
    'Architected a multi-stage exam evaluation pipeline combining OCR confidence gating, hierarchical grading, knowledge grounding, Elo ranking, and uncertainty-adjusted scoring.',
    'Built a custom FAISS-based RAG system from scratch with sentence-transformer embeddings and a TF-IDF fallback for constrained environments.',
    'Implemented teacher-aligned RLHF with KL-divergence safety gating to prevent inconsistent feedback from corrupting reward-model updates.',
    'Built an explainability layer that retrieves relevant course material and generates grounded explanations and reasoning traces using local LLaMA3 inference.',
    'Developed the React evaluation dashboard with configurable pipeline parameters, real-time evaluation polling, ranked leaderboards, and visualization components.',
    'Engineered a modular FastAPI backend with async-safe execution, SQLite persistence, configurable CPU/GPU modes, and graceful degradation across AI components.'
  ],

  tech: [
    'Python',
    'FastAPI',
    'React',
    'LLaMA3',
    'Ollama',
    'FAISS',
    'sentence-transformers',
    'RLHF',
    'scikit-learn',
    'OpenCV',
    'NetworkX',
    'SQLite',
    'Pydantic'
  ],

  tags: [
    'AI/ML',
    'RAG',
    'RLHF',
    'Explainable AI',
    'OCR',
    'FAISS',
    'NLP',
    'Full Stack',
    'FastAPI',
    'React',
    'Machine Learning',
    'Education AI'
  ],

  challenge: 'Exam answers can contain handwriting, diagrams, partial solutions, and varying levels of correctness. The system had to combine multiple uncertain signals without turning grading into an opaque model decision, while keeping teacher feedback safe and making every result auditable.'
},
   {
    id: 'consumer-intelligence',
    name: 'Consumer Intelligence Platform',
    oneLiner:
      'An end-to-end consumer analytics platform combining ML segmentation, predictive modeling, LLM personas, and fairness auditing.',
    link: 'https://github.com/pavithra2870/Consumer-Segmentation',
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
    id: 'safespace',
    name: 'SafeSpace',
    oneLiner:
      'A full-stack AI journaling platform where every entry gets real-time sentiment analysis, mood detection, and an AI companion\'s feedback.',
    link: 'https://github.com/pavithra2870/SafeSpace---Journal',
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
    id: 'pulseops',
    name: 'PulseOps',
    oneLiner:
      'AI-assisted cluster observability and root-cause analysis platform for Linux node fleets with complete detect → alert → incident → diagnose loop.',
    link: 'https://github.com/pavithra2870/PulseOps',

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
  
 
 
  
]
