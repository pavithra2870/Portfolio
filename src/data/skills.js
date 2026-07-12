export const skillCategories = [
  {
    title: 'Agentic & LLM Systems',
    description:
      'Designing multi-agent architectures that decompose complex tasks into reliable, testable skills — and building the safety, reliability, and evaluation layers that keep them trustworthy in production.',
    capabilities: [
      'Structured-output prompt engineering for deterministic downstream automation',
      'Deterministic safety layers that constrain what an LLM is allowed to decide',
      'RAG pipeline design — chunking, hybrid retrieval, grounding, citation',
      'Agentic self-correction (JSON healing, Reflexion-style critique loops)',
      'LLM-as-judge evaluation and automated quality gating',
    ],
  },
  {
    title: 'Full-Stack Product Engineering',
    description:
      "Shipping complete products end to end — from database schema to deployed UI — not just the parts that are interesting to build.",
    capabilities: [
      'React front-end architecture with real-time data sync',
      'REST API design (FastAPI, Express) with schema validation',
      'Authentication, rate limiting, and production security hygiene',
      'Serverless architecture on AWS (Lambda, API Gateway, event-driven pipelines)',
      'Deployment: Docker, GitHub Pages, Firebase, DNS configuration',
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
      'Model explainability with SHAP, and fairness/bias auditing',
      'Statistical validation (Deflated Sharpe Ratio, causal inference, drift detection)',
    ],
  },
  {
    title: 'Product & Go-to-Market',
    description:
      'Working the parts of a product that happen outside the codebase — positioning, discovery, and the operational details that get something in front of real users.',
    capabilities: [
      'Product discovery and requirements definition for new AI agents',
      'Go-to-market execution: SEO, structured data, Google Business Profile',
      'Information architecture and conversion-focused UX decisions',
      'Cross-functional collaboration across engineering, design, and growth',
    ],
  },
]
