export const research = [
  {
    id: 'geo-algorithmic-moat',
    name: 'Algorithmic Moat in Generative AI Discovery',
    oneLiner:
      'Quantifying whether LLMs systematically favor incumbent brands over startups — and what to do about it.',
    question:
      'Do Large Language Models exhibit an "Algorithmic Moat" — a systematic bias toward recommending legacy, incumbent brands over emerging startups when asked for product recommendations?',
    methodology:
      'Introduced a novel "Share of Model" (SoM) metric to quantify a brand\'s visibility across LLM recommendations, then tested multiple LLMs (Groq, Gemini, Ollama) across a matrix of user personas, funnel stages, localities, and product categories. Scraped 33+ metadata features per brand across five sources (WHOIS, Wikipedia, Google Trends, DuckDuckGo, heuristic SEO), then trained a Random Forest/XGBoost surrogate model on brand metadata to predict recommendation outcomes, applying SHAP to identify which proxy signals — domain age, Wikipedia presence, search volume — actually drive the bias.',
    depth:
      'Beyond quantification, the pipeline includes three original agentic components: a Reflexion-based self-critique agent where a Critic LLM evaluates whether an Actor LLM\'s reasoning reflects quality or incumbency bias; a counterfactual XAI generator (DiCE) that produces concrete "GEO strategy recipes" — the minimum metadata changes needed to flip a brand from unrecommended to recommended; and a longitudinal drift tracker monitoring how bias shifts as models are updated over time. A supplementary consumer survey (N=68) adds human-centric validation via K-means persona clustering and trust/willingness-to-pay analysis.',
    tech: ['Python', 'LangChain', 'Groq', 'Gemini', 'Ollama', 'scikit-learn', 'SHAP', 'DiCE-ML', 'pytrends'],
    tags: ['Explainable AI', 'LLM Bias', 'SHAP', 'Counterfactual Explanations', 'Multi-Agent'],
  },
  {
    id: 'adv-audit',
    name: 'Adv-Audit',
    oneLiner:
      'A neuro-symbolic explainability system for real-time ad bidding — bias detection and human-in-the-loop control over a black-box model.',
    question:
      'Can a real-time bidding system be made simultaneously accurate, explainable, and directly correctable by a non-technical advertiser — without sacrificing the automation that makes RTB useful in the first place?',
    methodology:
      'Built a dual pCTR-prediction architecture — HistGradientBoosting for fast, interpretable tree-based inference and a from-scratch DeepFM neural network (manual backpropagation, no framework) for feature-interaction modeling — behind a unified ModelWrapper API. Explainability runs through TreeSHAP and gradient×input attribution, with a shadow audit architecture that computes explanations asynchronously so they never add latency to the live 50ms bidding window. A synthetic 8,000-row RTB dataset with deliberately injected demographic bias (a 40% bid uplift for one group) validates that the bias-detection pipeline (Cohen\'s d effect sizes) can recover a known bias signal purely from observational data.',
    depth:
      'A symbolic rule engine lets an advertiser write plain-language constraints ("cap bids on tier-3 publishers") that take immediate effect as hard constraints the neural model cannot override, while human corrections are fed back into DeepFM fine-tuning and a Thompson Sampling bandit learns which rules are most effective over time. The system also implements active learning (entropy/margin/variance uncertainty sampling), causal inference (IPW/AIPW estimators) to separate causal effects from correlation, and a LinUCB contextual bandit for bid-strategy optimization — five quantitative experiments validate each of these claims independently.',
    tech: ['Python', 'PyTorch', 'LightGBM', 'SHAP', 'DiCE-ML', 'Streamlit', 'Ollama'],
    tags: ['Neuro-Symbolic AI', 'Explainable AI', 'Human-in-the-Loop', 'Bias Detection', 'Causal Inference', 'Reinforcement Learning'],
  },
  {
    id: 'helm-rank',
    name: 'HELM-Rank',
    oneLiner:
      'An exam-grading pipeline where teachers directly shape the model\'s behavior through preference feedback — safely.',
    question:
      "Can an automated exam-grading system be made trustworthy enough for teachers to rely on — not by hiding its reasoning, but by making every decision auditable and by letting teachers correct the model's behavior directly?",
    methodology:
      'Built a five-stage pipeline: confidence-gated OCR ingestion (flagging low-confidence transcriptions before they can corrupt downstream grading), hierarchical answer grading against structured keys (numerical tolerance, keyword presence, semantic similarity), a FAISS-backed RAG layer that grounds each answer against the actual uploaded course material, and competitive Elo-style ranking across student answers per question rather than a flat percentage score. A final composite score blends normalized Elo, knowledge-grounding, and OCR confidence so uncertain transcriptions are discounted rather than silently mis-scored.',
    depth:
      'The alignment layer is the core contribution: teachers review pairs of top-ranked answers and select the better one through a structured RLHF interface, but every preference update passes a KL-divergence gate first — if the new feedback is too inconsistent with the reward model\'s current state, the update is blocked and flagged rather than applied. This protects against a single mistaken click meaningfully corrupting the grading model, while still letting it improve from real teacher judgment over time. A separate diagram-parsing module represents visual answer elements as graphs for structural (not just textual) assessment.',
    tech: ['Python', 'FastAPI', 'React', 'FAISS', 'sentence-transformers', 'LLaMA 3 (Ollama)', 'OpenCV', 'NetworkX', 'SQLite'],
    tags: ['RAG', 'RLHF', 'OCR', 'Explainability', 'Education AI', 'Full Stack'],
  },
  {
    id: 'fibformer',
    name: 'FibFormer',
    oneLiner:
      'Making a proprietary Fibonacci trading heuristic differentiable, then fusing it into a Temporal Fusion Transformer for index derivatives forecasting.',
    question:
      'Can the tacit, hand-crafted knowledge in a proprietary Fibonacci price-action trading heuristic be encoded into a differentiable neural architecture — one that learns when to trust the heuristic and when to override it — rather than treated as either a fixed rule set or discarded as noise?',
    methodology:
      "Ported two hand-crafted trading scripts (impulse-trigger logic and anchor-cluster logic) into a Differentiable Heuristic Layer: the [130,160] impulse range gate becomes a learned sigmoid, the ±10 tick proximity threshold becomes a learnable scale factor, and the historical anchor weight becomes a learned exponential decay. This feeds a Gated Cross-Modal Attention mechanism that biases a Temporal Fusion Transformer backbone (LSTM + Gated Residual Network + multi-head self-attention) toward Fibonacci-aligned price regions, trained end to end on labeled BankNifty data with Triple Barrier labeling to avoid lookahead bias.",
    depth:
      "Statistical rigor is applied throughout: backtests are validated with the Deflated Sharpe Ratio (Bailey & López de Prado, 2014), which penalizes non-normality, short history, and multiple testing rather than reporting a raw Sharpe ratio. FGSM adversarial training is applied specifically to the Fibonacci-proximity features during training to verify the model's reliance on them is structurally genuine, not a fragile correlation. A KL-divergence drift detector monitors live feature distributions against the training distribution in real time, and a SHAP-based surrogate attribution method explains every signal — fed directly into a local LLM (Ollama) that generates grounded, hallucination-constrained narrative commentary via streamed Server-Sent Events. The work is documented toward a paper currently under IEEE review.",
    tech: ['Python', 'PyTorch', 'Transformers (FinBERT)', 'SHAP', 'pyts (SSA)', 'FastAPI', 'React', 'Ollama', 'Docker Compose'],
    tags: ['Temporal Fusion Transformer', 'Financial ML', 'Adversarial Training', 'Explainable AI', 'Drift Detection', 'Quantitative Finance'],
  },
]
