export const research = [
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
