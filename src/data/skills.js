export const skillCategories = [
  {
    title: 'Agentic & LLM Systems',
    description:
      'Designing multi-agent architectures that decompose complex tasks into reliable, testable skills — and building the safety, reliability, and evaluation layers that keep them trustworthy in production.',
    capabilities: [
      'Structured-output prompt engineering for deterministic downstream automation',
      'Deterministic safety layers that constrain what an LLM is allowed to decide',
      'Keeping calculations in code and using the LLM only to explain them (Meridian, FinLit Saarthi)',
      'RAG pipeline design — chunking, hybrid FAISS + BM25 retrieval, reranking, grounding, citation',
      'Evidence-first extraction that verifies every citation against the source document',
      'Agentic self-correction (JSON healing, Reflexion-style critique loops)',
      'MCP-connected agent workflows, and multi-provider LLM routing with failover',
      'LLM-as-judge evaluation and automated quality gating',
    ],
  },
  {
    title: 'Full-Stack Product Engineering',
    description:
      'Shipping complete products end to end — from database schema to deployed UI — not just the parts that are interesting to build.',
    capabilities: [
      'React front-end architecture with real-time data sync (Firestore listeners, WebSockets, SSE)',
      'REST API design (FastAPI, Express) with schema validation',
      'Microservices with Docker Compose and background job queues',
      'Graceful degradation: fallback paths so a product still works when a dependency fails',
      'Authentication, rate limiting, and production security hygiene',
      'Serverless architecture on AWS (Lambda, API Gateway, event-driven pipelines)',
      'Observability and incident tooling (alerting, fault injection, Prometheus metrics)',
      'Deployment: Docker, GitHub Pages, Firebase, Hugging Face Spaces, DNS configuration',
      'Test authoring: pytest, Selenium end-to-end suites',
    ],
  },
  {
    title: 'Applied Machine Learning',
    description:
      'Taking a modeling problem from raw data to a deployed, explainable prediction — with the feature engineering and validation rigor that keeps it trustworthy.',
    capabilities: [
      'Feature engineering with leakage-safe temporal pipelines',
      'Classical ML (gradient boosting, clustering) and deep learning (LSTM, attention, transformers)',
      'Forecasting and time-series modelling (AQI, network QoE, index derivatives)',
      'Model explainability with SHAP and counterfactuals, and fairness/bias auditing',
      'Statistical validation (Deflated Sharpe Ratio, causal inference, drift detection)',
      'Comparing models empirically, including a TF-IDF classifier that beat a zero-shot FinBERT baseline',
      'Human-in-the-loop learning (active learning, contextual bandits, RLHF with safety gating)',
    ],
  },
  {
    title: 'Product Management & Go-to-Market',
    description:
      'Working the parts of a product that happen outside the codebase — framing the problem, deciding what to build, defining how success is measured, and getting it in front of real users.',
    capabilities: [
      'Product teardowns and case studies: problem framing, target users, and key product decisions',
      'Defining a North Star metric, supporting metrics, and guardrails',
      'Pilot and experiment design with holdout and control groups',
      'Prioritisation with RICE and MoSCoW, and scoping an MVP',
      'Customer research: voice-of-customer interviews and synthesis',
      'Prototyping in Figma',
      'Product discovery and requirements definition for new AI agents',
      'Go-to-market execution: SEO, structured data, Google Business Profile',
      'Cross-functional collaboration across engineering, design, and growth',
    ],
  },
]
