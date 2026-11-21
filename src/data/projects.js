export const projects = [
  {
    id: 'nexus',
    name: 'NEXUS - Document Intelligence',
    oneLiner:
      'A local-first document intelligence platform that answers from your own documents with numbered citations, refuses when the evidence is missing, and checks every claim against its source.',
    links: { github: 'https://github.com/pavithra2870/Consultancy-AI' },
    problem:
      'Analysts need answers and signals from documents, but cloud tools raise privacy concerns for sensitive files and generic chatbots answer with no evidence and no measured accuracy.',
    solution:
      'Four document-focused modules share one hybrid retrieval pipeline: knowledge RAG with numbered citations that refuses, without calling the model, when the best rerank score is too low; a knowledge graph of evidence-backed triples; due-diligence analysis of annual reports where every figure must carry a quote checked against the filing; and a GDPR Article 13 and CCPA compliance checker that quotes the passage proving each item. It began as a refactor of a twelve-module project: the modules that could not be measured were cut, and an evaluation harness and test suite were built around the rest.',
    architecture:
      'FastAPI backend (31 API paths, Pydantic v2 schemas, models warmed at startup) with a single retrieval path used everywhere: sentence-aware chunks, FAISS dense search and BM25 fused with reciprocal rank fusion, then a cross-encoder rerank. A MiniLM encoder, an MS MARCO cross-encoder, a DeBERTa-v3-small NLI model and spaCy run locally on CPU; generation uses Ollama (gemma3:4b) or an optional hosted model chosen per feature in configuration. The language model proposes and code decides: quotes are verified against the source, and summaries, verdicts and statuses are built by rules. The React + Vite front end has six pages, including an evaluation page that shows and runs the benchmarks.',
    contributions: [
      'Built one hybrid retrieval pipeline and ablated every stage on SQuAD v2 and GDPR questions: recall@5 0.98 and MRR 0.937 on SQuAD v2, with the reranker, not fusion, driving the gain.',
      'Added an abstention gate that refuses out-of-corpus questions without calling the model (AUROC 0.996).',
      'Rebuilt the compliance checker after a first NLI version found none of its flagged violations real on real policies: quoted, double-checked disclosures reach precision 0.99 and recall 0.91 on four policies it had not seen.',
      'Rebuilt due-diligence analysis around claim verification: 20 of 20 key figures correct on four real annual reports, up from 1 of 15.',
      'Built an evaluation harness with nine suites and 346 automated tests that run without model downloads, plus the six-page React front end.',
    ],
    tech: ['Python', 'FastAPI', 'Pydantic', 'React', 'Vite', 'Recharts', 'FAISS', 'BM25', 'Sentence-Transformers', 'Cross-encoder reranking', 'DeBERTa-v3 (NLI)', 'spaCy', 'NetworkX', 'PyTorch', 'Ollama (gemma3)', 'pytest'],
    tags: ['RAG', 'Hybrid Retrieval', 'Evaluation', 'Claim Verification', 'Knowledge Graph', 'Compliance', 'Local LLM', 'Explainable AI'],
    challenge:
      'Most of the work was finding where a good-looking number was wrong. A spaCy configuration silently broke every NLP step, a due-diligence pipeline read about 4% of each filing and invented the rest, and a compliance checker that scored well on short snippets found none of its flagged violations real on real policies. Each was found by testing on real documents instead of demo text, and the fix was the same idea each time: make the model quote its evidence and have code check the quote.',
  },
  {
    id: 'geo-bias-analyzer',
    name: 'GEO Bias Analyzer',
    oneLiner:
      'An audit of which brands AI models recommend: 14 models, 15,104 answers and 70,552 brand mentions across CRM software, ecommerce platforms and personal finance apps.',
    links: {
      github: 'https://github.com/pavithra2870/GEO-Bias-Analyzer',
      live: 'https://pavithra2870.github.io/GEO-Bias-Analyzer/',
    },
    problem:
      'People now ask chatbots what software to buy, but which brands the models name, whether they favour established companies, and whether they point to products that no longer exist had not been measured.',
    solution:
      'Asked 14 language models from 12 labs about 1,080 buying questions each, then matched 70,552 brand mentions into 3,188 brands and checked each against public records. A few brands take most mentions (in CRM the top 10 take 82%), the model you ask explains 18% to 27% of which brand comes first while rewording explains under 0.5%, 8.4% of mentions go to a retired product, and established companies get about 70% of mentions. Fame, age and size did not predict recommendations, and that negative result is reported.',
    architecture:
      'A resumable audit pipeline: the full to-do list is planned first, each call has a fixed hash ID, and every answer is saved with its raw text in one transaction, so parsing and matching can be redone without asking again. Three channels ran in parallel (a laptop, Kaggle GPUs and cloud APIs), each into its own database, merged by answer ID. Matching runs in four layers plus an evidence ladder (website check, Wikidata and App Store records, a blind web search, a human decision) that marks each brand real, renamed or retired. Statistics use bootstrap intervals, permutation tests and clustered regression; the ML uses cross-validation grouped by question. Results are published as tables, charts and a results site.',
    contributions: [
      'Designed the question grid (648 questions across market, buying stage, persona, country, framing and wording) and a restartable collection pipeline that ran 14 models across a laptop, free GPUs and cloud APIs.',
      'Matched 70,552 mentions into 3,188 brands and verified each brand’s status with an evidence ladder, scoring the matching on 170 hand-labelled pairs (88.6% of merges and 80.5% of kept-apart look-alikes correct).',
      'Measured concentration, what drives the first pick, agreement between models, stale knowledge and incumbent share, with bootstrap intervals, permutation tests and clustered regression.',
      'Trained a model-fingerprint classifier that names the writing model correctly 71% of the time out of 14 (7% by chance), and surrogate models that predict each model’s first pick from the question alone.',
      'Raised the usable share of one failed import from about two-thirds to 98.7% with a fallback JSON repair and no new compute, and corrected a first staleness figure that was wrong by a factor of ten.',
    ],
    tech: ['Python', 'SQL', 'DuckDB', 'pandas', 'NumPy', 'SciPy', 'statsmodels', 'scikit-learn', 'XGBoost', 'NetworkX', 'Ollama', 'Hugging Face Transformers', 'vLLM', 'Wikidata API', 'pytest', 'JavaScript', 'SVG'],
    tags: ['LLM Research', 'Brand Visibility', 'AI Bias', 'Entity Resolution', 'Statistics', 'Machine Learning', 'Data Engineering'],
    challenge:
      'Asking the models was easy; matching was the hard part. Models write one brand many ways, and a live website is weak proof that a product still exists: the first staleness figure was 0.9% because Mint still had a page, and a dated status check gave 8.4%. The work was building matching and verification that could be checked, and reporting what did not work, such as fame failing to predict recommendations.',
  },
  {
    id: 'oauth-guides',
    name: 'OAuth Guides',
    oneLiner:
      'An AI agent that researches any API provider and builds a shareable guide to getting an OAuth app approved: difficulty, time, and who does each step.',
    links: {
      github: 'https://github.com/pavithra2870/OAuth-Guides',
      live: 'https://oauth-guides-o66y.onrender.com/',
      demo: 'https://vimeo.com/1244693576',
    },
    problem:
      'Registering an OAuth app and passing the provider\'s review can take 30 minutes or a quarter, and nothing says which up front. Developers piece it together from scattered docs and stale forums.',
    solution:
      'Search any app: library guides load instantly, otherwise an agent researches the provider\'s docs live, streams its progress and builds the guide in about a minute. Each guide gives a difficulty verdict, a journey strip separating hands-on work, AI-draftable steps and provider wait, and a multi-app comparison that flags the slowest approval.',
    architecture:
      'FastAPI pipeline (search, extract, write, verify, compute timing, save) streaming progress over server-sent events, with shared jobs for duplicate requests. The model writes and code verifies: every claim carries a verbatim quote that code matches against the fetched page to set its evidence level. Gemini with a Groq fallback, key rotation and daily caps; Supabase Postgres (SQLite locally); React 19 + Vite with hand-written CSS.',
    contributions: [
      'Built the evidence layer: forced verbatim quotes and code-set evidence levels (Documented, Reported, Inferred, Tested), so the model never grades itself.',
      'Designed the journey strip separating active effort from provider waiting, so the review wait, not the work, sets the date.',
      'Targeted the bring-your-own long tail after analysing the Composio catalog (127 managed vs 275 bring-your-own apps).',
      'Built the live research stream, the multi-model fallback for free-tier limits, and a 9-app curated library; deployed publicly.',
    ],
    tech: ['Python', 'FastAPI', 'React 19', 'Vite', 'Supabase (Postgres)', 'SQLite', 'Google Gemini', 'Groq', 'Tavily', 'Server-sent events'],
    tags: ['Agentic AI', 'Grounded Generation', 'Product Design', 'Developer Experience', 'Full-Stack', 'Prompt Engineering'],
    challenge:
      'Not trusting the model. Free-tier LLMs were retired mid-build, so the pipeline needed a fallback chain and token-budgeted prompts. Guides are AI-generated from public docs and not yet hand-verified, so the product shows evidence levels instead of overclaiming.',
  },
  {
    id: 'agent-orchestra-rl',
    name: 'Agent-Orchestra-RL',
    oneLiner:
      'A reinforcement-learning customer-support agent that chooses which tool to call at each step, with hard safety rules and an independent evaluator, compared across five RL methods.',
    links: { live: 'https://pavithra2870.github.io/Agent-Orchestra-RL/' },
    problem:
      'At each step a support agent must decide which tool to call, or whether to stop, ask or hand over to a human, balancing success, cost, latency and safety.',
    solution:
      'A simulated shop with six goals (delivery, payment change, refund, cancel, return or damage claim, policy question). A language layer turns the message into goals, a learned policy picks every tool call, code makes illegal actions impossible, and an evaluator judges the final database state. DQN reaches 98.5% on 1,410 held-out scenarios with 0.0% rule violations; offline CQL reaches 97.6% from a fixed log with no live training. A hand-written playbook still scores 99.9%, and a small local LLM choosing tools gets 28.3%.',
    architecture:
      'A Gymnasium environment with an 85-number state and 16 actions, and an action mask applied both when acting and in the learning targets. MiniLM embeddings route messages to goals; an optional local LLM (phi4-mini) is cross-checked and every reply is fact-checked, with templates as fallback. Q-learning, SARSA, DQN, PPO and CQL in PyTorch. FastAPI backend streaming per-step events over SSE, SQLite run tracking and a React dashboard.',
    contributions: [
      'Designed the evaluation: an independent database-state evaluator, an oracle for regret, seven test sets (held-out goal combinations, tool failures, unseen wording) and ablations.',
      'The evaluation exposed PPO collapsing on unseen goal combinations (66.6% against 99.6% for DQN), a gap the overall score hid.',
      'Showed the guardrail matters: without it DQN falls from 98.5% to 21.1% success.',
      'Extended the task with returns, damage claims and policy lookup, retrained every agent once and froze the old results.',
      'Built the full stack with 216 automated tests.',
    ],
    tech: ['Python', 'PyTorch', 'Gymnasium', 'FastAPI', 'React', 'Vite', 'SQLite', 'Sentence-Transformers', 'Ollama (phi4-mini)', 'pytest', 'Playwright'],
    tags: ['Reinforcement Learning', 'Evaluation', 'Safety', 'Offline RL', 'Agents', 'Full-Stack'],
    challenge:
      'Getting a result I could trust. The oracle first failed the environment test, a smoke-test log contaminated an offline run, and a test set I had read stopped being a test. Each was found and fixed, and the write-up states the limits: everything is simulated, and the shop rules are simple enough for a playbook to be near perfect.',
  },
  {
    id: 'civicbot',
    name: 'CivicBot',
    oneLiner:
      'A fully serverless WhatsApp assistant that lets citizens report and track civic issues, with AI-driven triage for municipal staff.',
    links: { github: 'https://github.com/pavithra2870/CivicBot' },
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
  id: 'meridian',
  name: 'Meridian - AI Risk Intelligence',
  oneLiner:
    'An offline-first financial risk intelligence platform that transforms global news into explainable risk signals, constrained portfolio rebalancing recommendations, and multi-asset stress-test scenarios.',

  problem:
    'Financial risk signals are buried across global news, financial articles, market headlines, and social media. Sentiment-only tools overlook event severity, source consensus, volatility, and portfolio exposure, while black-box AI summaries lack the auditability required for institutional risk decisions. Generic stress tests also fail to show how the same event affects different portfolios.',

  solution:
    'Built Meridian, a live risk-intelligence desk that ingests GDELT events and themes, financial news, finance tweets, and Yahoo Finance data to generate structured risk signals with explainable impact scores from 1 to 10. Seven factors — event severity, sentiment strength, confidence, entity relevance, source consensus, volatility regime, and novelty — contribute to every score. Two downstream engines turn these signals into actionable decision support: a Tactical Rebalancer recommends constrained weight changes across a 15-stock index, while a Strategic Stress Lab quantifies the impact of live events across four synthetic institutional portfolios containing 155 positions. An optional local AI copilot explains backend-computed results in natural language. The application runs offline using committed datasets, without API keys or login, and refreshes live data when network access is available.',

  architecture:
    'Python 3.10 and FastAPI backend with Pydantic schemas, a modular risk-engine pipeline, SQLite storage, and precomputed analytical outputs. The ingestion pipeline cleans and deduplicates approximately 50,000 documents, links companies to tickers and sectors, classifies events, evaluates sentiment, aggregates source consensus, and generates structured risk signals. A seven-factor deterministic scoring engine feeds the rebalancing and stress-testing services. The rebalancer applies stock-weight bounds, sector caps, total-weight constraints, and turnover limits. The stress engine models equities, bonds, loans, options, swaps, and credit default swaps using configurable event-to-shock assumptions. A background refresh worker fetches GDELT and market data, rebuilds results when inputs change, swaps the database atomically, and invalidates stale caches. The React 18 + Vite frontend renders typed API responses using custom CSS and hand-built SVG charts, with no UI framework or charting library. An optional Ollama-powered LLM explains deterministic results, with template-based fallback when unavailable.',

  contributions: [
    'Designed the end-to-end risk-intelligence pipeline, transforming 50,153 documents into 5,345 structured risk signals across 12 event classes.',
    'Implemented a deterministic seven-factor risk-impact scoring model with factor-level explanations, source consensus, entity relevance, volatility, and novelty.',
    'Trained and evaluated a TF-IDF + logistic regression sentiment classifier, achieving 0.741 accuracy and 0.732 macro-F1 on held-out financial text, outperforming the evaluated zero-shot FinBERT baseline.',
    'Built company entity resolution using a company gazetteer, aliases, ticker patterns, cashtags, and GDELT organization tags.',
    'Developed a Tactical Rebalancer for a 15-stock index with constrained portfolio weights, sector exposure limits, turnover control, and plain-English explanations.',
    'Engineered a Strategic Stress Lab covering four synthetic portfolios and 155 positions across equities, fixed income, loans, options, swaps, and credit default swaps.',
    'Implemented quantitative risk calculations including volatility, beta, covariance, bond duration and convexity, Black-Scholes Greeks, DV01, CS01, stress-severity curves, and break-even analysis.',
    'Built a resilient background refresh system with atomic database swaps, cache invalidation, source-level failure handling, and offline snapshot fallbacks.',
    'Integrated an optional local Ollama copilot that explains backend-computed facts without performing financial calculations, with deterministic template fallback.',
    'Created reproducible data-processing workflows, project documentation, and automated pytest coverage for the engine, API, and calculations.'
  ],

  tech: [
    'Python 3.10',
    'FastAPI',
    'Uvicorn',
    'Pydantic',
    'React 18',
    'Vite',
    'JavaScript',
    'Custom CSS',
    'SQLite',
    'Pandas',
    'NumPy',
    'SciPy',
    'scikit-learn',
    'TF-IDF',
    'Logistic Regression',
    'FinBERT',
    'Hugging Face Transformers',
    'PyTorch',
    'Ollama',
    'GDELT',
    'Yahoo Finance',
    'yfinance',
    'pytest',
    'Git',
    'GitHub'
  ],

  tags: [
    'AI',
    'NLP',
    'Financial Risk',
    'FinTech',
    'Risk Intelligence',
    'Sentiment Analysis',
    'Explainable AI',
    'Portfolio Rebalancing',
    'Stress Testing',
    'Quantitative Finance',
    'Data Engineering',
    'Local LLM',
    'Offline-First',
    'React',
    'FastAPI'
  ],

  challenge:
    'Building a reliable end-to-end risk platform required balancing analytical depth, explainability, and resilience across multiple data sources and financial instruments. A key challenge was avoiding the assumption that negative sentiment automatically means high risk. The system combines seven factors into a deterministic impact score, keeps financial calculations independent of LLM outputs, and uses configurable assumptions for multi-asset stress testing. I also addressed stale caches and inconsistent live-versus-replayed data during refreshes, implemented atomic database replacement and offline fallbacks, and evaluated sentiment models empirically rather than assuming a larger pretrained model would perform better. On held-out data, the lightweight TF-IDF classifier outperformed the evaluated zero-shot FinBERT baseline, so it became the default model.',

  metrics: {
    documentsProcessed: '50,153',
    structuredRiskSignals: '5,345',
    highImpactSignals: 19,
    eventClasses: 12,
    riskScoringFactors: 7,
    sentimentModelAccuracy: '74.1%',
    sentimentModelMacroF1: '73.2%',
    zeroShotFinBERTAccuracy: '56.0%',
    syntheticPortfolios: 4,
    portfolioPositions: 155,
    liveRefreshInterval: '15 minutes',
    automatedTests: 11
  },

  highlights: [
    'Processed 50,153 documents into 5,345 structured risk signals.',
    'Achieved 0.741 held-out accuracy with the locally trained TF-IDF sentiment classifier versus 0.560 for the evaluated zero-shot FinBERT baseline.',
    'Demonstrated portfolio-specific risk: the same geopolitical event produced a modeled loss of 6.50% for the Global Growth Fund versus 0.23% for the Conservative Allocation.',
    'Implemented constrained rebalancing and multi-asset stress testing using explicit, configurable assumptions.',
    'Designed an offline-first application with no required API keys, login, or paid services.'
  ],

  challengeContext:
    'Built for the S&P Global and CRISIL Campus Hackathon 2026, addressing AI/NLP-driven risk intelligence from unstructured data for tactical rebalancing and strategic portfolio stress testing.',

  limitations:
    'The portfolios are synthetic, and stress-test results use simplified, configurable assumptions rather than a validated regulatory methodology. Some historical news and social datasets are replayed into the current analysis window; only designated live sources provide genuinely current data. The reported metrics reflect the project results measured on October 10, 2026, and should be presented with that context. The sentiment evaluation compares a locally trained classifier against a zero-shot FinBERT baseline, not a fine-tuned FinBERT model.',

  links: {
    github: 'https://github.com/pavithra2870/VIT-Pavithra-SP-Hackathon',
    demo: 'https://vimeo.com/1234679155?fl=ip&fe=ec'
  }
},
  {
    id: 'compliance-ai',
    name: 'ComplianceAI',
    oneLiner:
      'AI-powered call-center compliance monitoring for Tanglish/Hinglish conversations, with explainable SOP validation and semantic search.',
    links: { 
      github: 'https://github.com/pavithra2870/Call-Center-Compliance',
      live: 'https://huggingface.co/spaces/pavithra2870/call-analytics',
      demo: 'https://drive.google.com/file/d/1MXlfdsomUcq8Tgk87AFkKeQa-ugFOjAa/view?usp=sharing'
    },
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
    links: { 
      github: 'https://github.com/pavithra2870/NurtureAI',
      demo: 'https://www.loom.com/share/7e8c1efae431433b91e66ba7ad727644',
    },
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
  id: 'fact-knowledge-layer',
  name: 'Fact Knowledge Layer',
  oneLiner: 'Evidence-first document intelligence system that extracts verifiable facts and distinguishes contradictions from contextual differences across PDFs.',
  links: { 
    github: 'https://github.com/pavithra2870/Fact-Knowledge-Layer',
   demo: 'https://drive.google.com/file/d/16L4CESY34hxRvXIwT1Rzp769igvw5DJu/view?usp=drive_link' },

  problem: 'Comparing facts across reports, filings, and research documents is difficult because different values may reflect legitimate differences in time period, geography, units, or estimate status. Naive document AI systems often flag these as contradictions or provide answers without verifiable evidence.',

  solution: 'A document intelligence pipeline that extracts structured facts with source-level provenance, verifies every citation against the original document, retrieves related facts using hybrid semantic and keyword search, and combines deterministic contextual reasoning with LLM classification to identify corroboration, contradiction, contextual reconciliation, or unrelated facts.',

  architecture: 'React frontend with a FastAPI backend orchestrating PDF/OCR ingestion, schema-constrained LLM extraction, evidence verification, FAISS + BM25 hybrid retrieval, Reciprocal Rank Fusion, cross-encoder reranking, contextual reasoning, and relationship classification. SQLite stores structured facts and provenance, while NetworkX and D3.js provide an interactive knowledge graph over the fact relationships.',

  contributions: [
    'Built an evidence-first fact extraction pipeline using PyMuPDF, EasyOCR, schema-constrained LLM outputs, and strict citation verification against source documents.',
    'Designed hybrid fact retrieval combining FAISS semantic search, BM25 keyword matching, Reciprocal Rank Fusion, and cross-encoder reranking.',
    'Implemented deterministic contextual reasoning for fiscal periods, geographic scope, units, and estimate-versus-actual status before LLM relationship classification.',
    'Engineered multi-provider LLM routing across Gemini, Groq, and Ollama with per-key quota pools, rate-limit cooldowns, and page-level failover.',
    'Built incremental document processing with parallel page extraction, persisted extraction failures, automatic index updates, and recovery of interrupted jobs.',
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
      'An urban air-quality operating system: a multi-horizon AQI forecaster, source attribution, intervention planning and grounded citizen and commissioner copilots, with the evaluation shown inside the product.',
    links: {
      github: 'https://github.com/pavithra2870/AirMind-AI',
      demo: 'https://drive.google.com/file/d/15e0IqJD1AC2Cr126bHu_KaIrITI8jrEm/view?usp=drive_link',
    },
    problem:
      'Most air quality tools tell you pollution is bad after it\'s already bad. They lack predictive capabilities, actionable insights, and the ability to explain why air quality is deteriorating or what to do about it. City administrators operate without a unified system to forecast pollution, understand its sources, evaluate intervention strategies, or communicate effectively with citizens.',
    solution:
      'Seven modules over 9 REST endpoints: a live city dashboard, a forecast engine, pollution attribution, an intervention planner, a scenario simulator and two RAG copilots, plus a one-click PDF brief for commissioners. The forecaster is 16 direct XGBoost models (+3h to +72h) that predict the log-change from the current AQI, which made it robust to a roughly 4x seasonal level shift. It beats a persistence baseline by about 30% on MAE at +1h and +6h and has lower RMSE at every horizon through 72h, but only matches it on MAE beyond 24h; the limit is one year of history. Attribution, planner and simulator are rule-based on purpose, because there are no labelled source data to train on.',
    architecture:
      'FastAPI backend layered api → services → agents → ai/rag, with a React 18 + Vite frontend (Leaflet, Recharts). Live WAQI ingestion and an idempotent OpenWeather backfill feed Supabase (Postgres), and one shared feature module is used for training, serving and evaluation. Forecasts come from direct multi-horizon XGBoost with prediction intervals from held-out residual percentiles. The copilots run MiniLM + FAISS dense search and BM25 fused with reciprocal rank fusion, a cross-encoder rerank, a relevance gate that refuses weak matches, and Gemini restricted to the retrieved passages plus live readings. Every external dependency has a fallback path.',
    contributions: [
      'Built a rolling-origin evaluation harness (4 expanding-window folds, 14 methods, block-bootstrap confidence intervals) that showed the previous recursive forecaster was 25–111% worse than persistence, then replaced it with the direct model (MAE down 43–55%).',
      'Found and fixed four pipeline bugs: an AQI conversion that returned 500 for fractional PM2.5 (96 corrupted rows), a 1,000-row database cap that truncated training data, a train/serve feature mismatch, and a non-idempotent backfill.',
      'Built a hybrid RAG pipeline over 6 policy documents (1,048 chunks) that lifted hit@1 from 38% to 62% and refused 88% of out-of-scope questions, against 62% for the cosine gate, on a held-out split.',
      'Put the evidence inside the product: a model-performance panel on the Forecast screen charts the model against baselines with confidence intervals, generated by the evaluation scripts.',
      'Built the attribution, intervention planner (diminishing-returns aggregation) and scenario simulator modules, the React and Leaflet frontend, and the PDF export.',
      'Designed a fallback for every external dependency so the product runs with zero API keys.',
    ],
    tech: ['React 18', 'Vite', 'FastAPI', 'XGBoost', 'scikit-learn', 'Sentence-Transformers (MiniLM)', 'FAISS', 'BM25', 'Cross-encoder reranking', 'Google Gemini', 'Supabase (Postgres)', 'Leaflet', 'Recharts', 'WAQI API', 'OpenWeather API', 'ReportLab'],
    tags: ['Forecasting', 'RAG', 'Evaluation', 'Geospatial', 'Smart City', 'Full-Stack', 'Machine Learning'],
    challenge:
      'The first evaluation showed the original model losing to a one-line baseline. Tracing that led to four data and pipeline bugs, not to the architecture. Beyond 24 hours the rebuilt model still only matches persistence on MAE, because a single year of history gives one example of each season, and the product says so instead of hiding it.',
  },
   {
    id: 'consumer-intelligence',
    name: 'Consumer Intelligence Platform',
    oneLiner:
      'An end-to-end consumer analytics platform: segmentation, churn, conversion and lifetime-value models, SHAP explanations and a fairness audit, benchmarked on four datasets.',
    links: { github: 'https://github.com/pavithra2870/Consumer-Segmentation' },
    problem:
      'Understanding customer segments, predicting churn, and estimating lifetime value usually requires a dedicated data science team — putting real analytics out of reach for smaller product and marketing teams.',
    solution:
      'One dashboard that switches between a synthetic dataset and three public ones (Telco churn, Bank Marketing, Online Retail II) from a dropdown. It segments customers with KMeans, trains churn, conversion and value models, explains them with SHAP, audits them for fairness, simulates what-ifs, and uses a local LLM to write a persona for each segment. Every model is benchmarked against majority-class, logistic regression, random forest and LightGBM on a shared split and lands within about 0.01 AUC of the best baseline: Telco churn 0.838, Bank Marketing conversion 0.802, retail churn 0.802. They tie the baselines; they do not beat them.',
    architecture:
      'FastAPI backend where each request carries a dataset value that middleware stores in a context variable, so existing services needed no dataset-specific code, with a registry describing each dataset’s tasks and columns. Gradient Boosting for churn and conversion, Random Forest on log value for LTV, KMeans or Gaussian Mixture with PCA for segments, SHAP TreeExplainer, and an adverse-impact-ratio fairness audit. A local Ollama model (phi4-mini) writes personas, with a template fallback. The React 18 + Vite frontend builds each page from what the chosen dataset supports.',
    contributions: [
      'Built the full ML pipeline: feature engineering, segmentation, and the churn, conversion and value models.',
      'Found and removed data leakage: the Bank Marketing call-duration column lifts AUC from 0.805 to 0.935, and an early synthetic generator had an LTV that was a formula of its inputs (R² 0.95, 0.61 once fixed).',
      'Built a 90-day time-split churn and spend target from 824,364 retail transactions (5,281 customers), keeping features strictly before the cutoff.',
      'Benchmarked every model against three standard baselines with bootstrap confidence ranges, and switched the conversion model from logistic regression to gradient boosting when Bank Marketing scored 0.772 against 0.802.',
      'Implemented the fairness audit (80% adverse-impact rule and parity gap) and the what-if simulator, and built the React dashboard.',
      'Tested every page across all four datasets (36 combinations) in a headless DOM test.',
    ],
    tech: ['Python', 'FastAPI', 'Pydantic', 'React 18', 'Vite', 'scikit-learn', 'LightGBM', 'SHAP', 'Pandas', 'Ollama (phi4-mini)', 'Recharts'],
    tags: ['Machine Learning', 'Benchmarking', 'Data Leakage', 'Explainability', 'Fairness', 'FastAPI', 'React'],
    challenge:
      'The hardest part was the data, not the models. The first synthetic dataset had a 55% churn rate and an LTV score of 0.95 R² that was really a formula of its inputs, so good-looking scores meant nothing. Checking against the best possible score from the hidden true probabilities, then validating on real public data, showed what the pipeline could actually do, and the write-up says plainly that the models tie standard baselines.',
  },
  {
  id: 'archestra-mcp-hackathon',
  name: 'Archestra Agentic Hackathon',
  oneLiner: 'Built four AI agents for career planning, project discovery, research, and side-project collaboration as open-source hackathon contributions.',
  links: { github: 'https://github.com/archestra-ai/apps-gallery' },

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
  id: 'adv-audit',
  name: 'Adv-Audit',
  oneLiner: 'Neuro-symbolic AI system for auditing RTB decisions with explainability, bias detection, and human-in-the-loop control.',
  links: { 
    github: 'https://github.com/pavithra2870/Adv-Audit' },

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
    id: 'onestop25',
    name: 'OneStop 25',
    oneLiner:
      'A Gen Z year-end reflection app — aura points, IN/OUT lists, and AI-personalized affirmations, built around a specific cultural moment.',
    links: { 
      live: 'https://onestop-25.onrender.com/',
      github: 'https://github.com/pavithra2870/One-Stop-25' },
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
  links: { github: 'https://github.com/pavithra2870/HELM-Rank' },

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
    id: 'network-qoe',
    name: 'Network QoE Prediction System',
    oneLiner:
      'A telecom intelligence platform predicting silent churn and QoE degradation before users complain, with SHAP-based root-cause analysis.',
    links: { github: 'https://github.com/pavithra2870/QoE' },
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
    links: { github: 'https://github.com/pavithra2870/SafeSpace---Journal' },
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
    links: { 
      live: 'https://focuswin-frontend.onrender.com',
      github: 'https://github.com/pavithra2870/FocusWin-Firebase' },
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
    links: { github: 'https://github.com/pavithra2870/PulseOps' },

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
