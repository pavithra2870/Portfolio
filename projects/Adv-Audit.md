# Adv-Audit

A neuro-symbolic explainable AI system for Real-Time Bidding transparency, bias detection, and human-in-the-loop advertiser control.

---

# Elevator Pitch

Adv-Audit is an AI audit system for digital advertising that reveals why automated bidding systems make the decisions they do. In programmatic advertising, advertisers spend millions on real-time bidding (RTB) systems that decide in milliseconds which ad impressions to buy, but these systems operate as black boxes—advertisers can see what they spent but not why specific bids were made or whether the system is exhibiting demographic bias.

Adv-Audit solves this by combining machine learning predictions with multiple layers of explainability: SHAP-based feature attribution shows exactly which user characteristics drove each bid decision, bias detection algorithms identify unfair targeting patterns, and a human-in-the-loop interface lets advertisers correct the system using plain-English rules that the model learns from over time. The system uses a neuro-symbolic architecture that pairs neural network predictions (DeepFM) with symbolic rule constraints, enabling both accurate click-through rate prediction and interpretable, controllable behavior.

What makes this approach different is that it treats explainability as a first-class concern rather than an afterthought. The system is designed from the advertiser's perspective rather than the ad exchange's, prioritizing transparency, brand safety, and control over pure optimization. It demonstrates that AI systems can be both high-performing and accountable, with research-grade contributions including shadow audit architecture (explanations generated asynchronously without affecting live bidding latency), controlled bias recovery (detecting injected bias signals from observational data), and Thompson Sampling for rule optimization.

---

# Product Overview

**Users**: Digital advertisers, campaign managers, compliance officers, and ML engineers working in programmatic advertising who need transparency into automated bidding systems.

**Primary Workflow**: An advertiser runs the Adv-Audit dashboard after their RTB system has processed bid requests. They select individual impressions to see SHAP waterfall charts explaining why the system bid a specific amount, view global feature importance across their entire campaign, and scan bias reports that flag demographic groups receiving systematically different treatment. When they identify problematic patterns (e.g., over-bidding on low-quality gaming sites or under-bidding on certain demographics), they create symbolic rules through templates or a custom builder. These rules immediately block or modify matching bids, and the system buffers rejected impressions for model fine-tuning. Over time, the neural network internalizes human preferences, reducing the need for manual intervention.

**Core Functionality**: The system predicts click-through rate (pCTR) for ad impressions using dual models (gradient boosting and DeepFM neural network), generates local explanations for individual bids via SHAP values, produces global feature importance summaries across campaigns, detects demographic bias using Cohen's d effect sizes, enables counterfactual analysis (what-if scenarios), provides natural language explanations via LLM integration, and maintains a symbolic rule layer for immediate human control.

**Inputs**: Synthetic RTB dataset with 43 features including user demographics (age, gender, income tier), device characteristics, publisher quality metrics, temporal features, audience segments, and auction dynamics. The system can also ingest real RTB logs with the same schema.

**Outputs**: Interactive Streamlit dashboard with six tabs (recent bids, local explanations, global XAI and bias, counterfactual lab, model correction interface, advanced analytics), SHAP visualization charts (waterfall, beeswarm, heatmaps), bias detection reports with statistical significance metrics, natural language explanations of individual decisions, policy rule files, and retrained model artifacts.

**User Experience**: The dashboard presents technical ML concepts in accessible formats—advertisers can toggle between technical SHAP visualizations and plain-English explanations, view confidence intervals around predictions, and interact with what-if scenarios without understanding the underlying algorithms. Color-coded rows highlight brand-unsafe or rejected impressions, and tooltips explain metrics like Cohen's d and pCTR in business terms.

**Real-World Use Case**: An advertiser running a $10,000/day campaign notices spend is concentrated on low-quality domains. Using Adv-Audit, they discover the model is over-weighting publisher tier in its bid decisions. They create a rule capping bids on tier-3 publishers, immediately saving budget. The system learns from this correction, gradually reducing its propensity to bid on similar domains. Simultaneously, the bias detector alerts them that female users during primetime are receiving 40% higher bids, prompting investigation into potential fairness issues.

---

# Problem Statement

Real-Time Bidding systems in programmatic advertising operate as opaque black boxes. Advertisers invest substantial budgets in automated bidding but lack visibility into the decision-making process—why did the system bid $4.50 on one impression but only $1.20 on another? Why is spend concentrated on specific domains or demographic groups? Is the model exhibiting bias that could lead to brand safety issues or regulatory scrutiny?

This problem matters because advertisers are accountable for where their ads appear and how their budgets are spent. Brand safety incidents can cause reputational damage, demographic bias can lead to discrimination complaints, and inefficient bidding wastes budget. Without explainability, advertisers must trust that their bidding systems are behaving appropriately, but they have no way to verify this or correct issues when they arise.

Existing solutions are insufficient. Most RTB systems provide basic reporting (spend by domain, win rates) but no insight into the model's reasoning. Some offer feature importance scores globally, but these don't explain individual decisions. Bias detection tools exist but are often separate from the bidding system, requiring manual data export and analysis. Rule-based targeting is available but operates as hard constraints without learning from feedback. No existing system combines local and global explainability, bias detection, and human-in-the-loop control in a unified interface designed for advertisers rather than data scientists.

---

# Key Features

## Explainability Suite

**Local SHAP Explanations**: Generates waterfall charts showing exactly which features contributed to each bid decision, with positive contributions (red bars) indicating features that increased the predicted click-through rate and negative contributions (blue bars) showing factors that decreased it. This enables advertisers to understand the reasoning behind individual bidding decisions and audit the model for specific impressions.

**Global Feature Importance**: Provides beeswarm plots aggregating SHAP values across hundreds of impressions, revealing which features drive bidding decisions at the campaign level. This helps advertisers understand overall patterns (e.g., publisher quality matters more than device type) and optimize their targeting strategy accordingly.

**Natural Language Explanations**: Integrates with local LLM (Ollama/llama3) to generate plain-English summaries of why specific bids were made, translating technical SHAP values into business-friendly language like "This bid was high because the user is in a high-income tier and visiting a premium publisher during primetime." A template-based fallback ensures functionality even without the LLM.

**Counterfactual Analysis**: Enables what-if scenario exploration—advertisers can see how predicted pCTR would change if a user had a different income tier, if the bid price were adjusted, or if other features were modified. This supports audience targeting optimization and bid sensitivity analysis without requiring A/B testing.

## Bias Detection and Fairness

**Demographic Bias Scanner**: Automatically analyzes model predictions across demographic groups (gender, age, income, device, time of day) using Cohen's d effect size to quantify disparities. Groups with |d| > 0.8 are flagged as strong bias, enabling proactive compliance and fairness auditing.

**Controlled Bias Recovery**: The system demonstrates the ability to detect deliberately injected bias signals (Female × Primetime receiving 40% bid uplift) from observational data without ground truth labels, proving that the XAI pipeline can identify real bias patterns in production systems.

**Audience Cluster Heatmap**: Uses PCA to project high-dimensional feature space into 2D visualizations colored by predicted pCTR, revealing natural clusters of high-value and low-value audiences. This helps advertisers understand their audience composition and identify segments that may be over- or under-targeted.

## Human-in-the-Loop Control

**Symbolic Rule Engine**: Allows advertisers to create human-readable rules using templates (gaming sites, low-quality publishers, high IVT) or custom builders. Rules support operators (in, not_in, gt, lt, eq, contains) and actions (deny, cap_bid, boost), with first-match semantics enabling precise control.

**Immediate Enforcement**: Rules are evaluated in real-time before bids are placed, providing instant protection against brand safety issues and budget waste. This symbolic layer operates as hard constraints that the neural model cannot override.

**Active Learning Queue**: Identifies high-uncertainty impressions using entropy, margin, and variance sampling, presenting them to advertisers for review. This prioritizes human attention on cases where the model is least confident, improving labeling efficiency.

**Model Fine-Tuning**: Warm-starts the DeepFM neural network on human-rejected impressions, gradually internalizing advertiser preferences. AUC on approved impressions improves after fine-tuning cycles, demonstrating that the model learns from feedback rather than just applying temporary rule patches.

**Rule Bandit Optimization**: Treats each symbolic rule as a bandit arm with Thompson Sampling, learning which constraints are most effective over time based on human approval and override signals. The system recommends rules with confidence intervals, enabling data-driven policy refinement.

## Advanced Analytics

**Causal Inference**: Implements IPW (Inverse Propensity Weighting) and AIPW (Augmented IPW) estimators to separate causal feature effects from correlational bias, with bootstrap confidence intervals. This helps advertisers understand which features actually cause higher click-through rates versus those that are merely correlated.

**A/B Testing Framework**: Supports head-to-head model comparison using metrics including AUC, LogLoss, win rate, spend efficiency, and precision@top-k, with statistical significance testing via paired t-tests. This enables rigorous evaluation of model changes before production deployment.

**RL Bidding Agent**: Implements LinUCB contextual bandit for bid strategy optimization, with 6 arms representing different bid multipliers (0.5x to 2.0x). The agent learns optimal bidding strategies based on context features and reward signals (click value minus cost).

**Online Learning Simulation**: Demonstrates production-ready incremental learning with time-ordered mini-batches, CUSUM-based drift detection for AUC monitoring, and periodic fine-tuning. This shows how the system would adapt to concept drift in live deployment.

---

# Engineering Highlights

**Dual Model Architecture**: Implements both HistGradientBoosting (tree-based ensemble) and DeepFM (neural network with factorization machines) for pCTR prediction, enabling comparison of complementary approaches. GBM provides fast inference and tree-based feature importances, while DeepFM captures feature interactions and supports continuous fine-tuning for HITL.

**Unified Model API**: ModelWrapper provides a consistent interface (predict_proba, explain, fine_tune, predict_with_uncertainty) that abstracts differences between GBM and DeepFM, ensuring XAI and HITL components work seamlessly with either model type. Uncertainty quantification uses bootstrap variance for GBM and MC Dropout for DeepFM.

**Fast Explanation Backends**: Optimizes SHAP computation with TreeSHAP for GBM (10-100x faster than KernelSHAP) and gradient × input attribution for DeepFM (~30ms per batch), with automatic fallback to KernelSHAP if fast backends are unavailable. This targets <500ms explanation latency for 100-sample batches.

**Feature Engineering Pipeline**: RTBFeatureEngineer handles categorical encoding (LabelEncoder) and continuous scaling (StandardScaler) with stateful transformations that ensure consistency between training and inference. It implements temporal splitting to prevent data leakage and handles out-of-vocabulary categories gracefully.

**Shadow Audit Architecture**: XAI computations run asynchronously in a separate path from live bidding, ensuring explanation generation doesn't add latency to the 50ms RTB decision window. This decoupling enables comprehensive explainability without performance impact.

**Synthetic Data Generation**: DatasetGenerator creates realistic 8,000-row RTB datasets with hierarchical user correlations (income → age → device → OS → browser), publisher quality tiers, controlled bias injection, Gaussian noise, and MCAR missing values. The synthetic approach enables reproducible experimentation without requiring proprietary data.

**Modular Pipeline Orchestration**: run_all.py executes 10 phases sequentially (dataset generation, model training, XAI suite, HITL demo, novelty proof experiments, online learning, causal analysis, A/B testing, RL bandit simulation, rule bandit demo), with feature flags to enable/disable new v2 components.

**Interactive Dashboard**: Streamlit app with 6 tabs provides real-time model inference, cached SHAP computations, bias scanning, counterfactual exploration, rule management, and advanced analytics. Custom CSS creates a polished UI with metric cards, bias alerts, and uncertainty visualizations.

**Persistence and State Management**: Models are serialized with joblib, rules stored as JSON, and bandit states maintained across sessions. This enables the dashboard to load pre-computed artifacts and maintain human feedback history.

---

# AI / ML Components

**pCTR Prediction Models**: HistGradientBoostingClassifier (300 trees, max depth 6, learning rate 0.05) for fast tree-based inference, and DeepFM neural network (factorization machines + MLP) implemented in pure NumPy with manual backpropagation for capturing feature interactions.

**SHAP Explainability**: KernelSHAP for model-agnostic local explanations, TreeSHAP for exact tree-based explanations (GBM), and gradient × input attribution for DeepFM. These methods quantify each feature's contribution to individual predictions.

**Bias Detection**: Cohen's d effect size calculation across demographic groups to quantify disparities, with bias levels classified as Strong (|d| > 0.8), Medium (|d| > 0.5), Mild (|d| > 0.2), or None.

**Natural Language Explanations**: Integration with Ollama (llama3:latest) for generating plain-English summaries of SHAP values, with structured prompts including top positive/negative features and prediction context.

**Active Learning**: Uncertainty sampling using entropy (H(p) = -p*log(p) - (1-p)*log(1-p)), margin (1 - |p - 0.5| * 2), and variance from predict_with_uncertainty(), with a prioritized buffer that evicts least-uncertain samples when full.

**Reinforcement Learning**: LinUCB contextual bandit for bid strategy optimization, with 6 arms (bid multipliers), context features (8 RTB features + normalized pCTR), and UCB exploration (theta^T * x + alpha * sqrt(x^T * A^-1 * x)).

**Causal Inference**: IPW (Inverse Propensity Weighting) estimator using Horvitz-Thompson with clipped propensity scores, and AIPW (Augmented IPW) doubly-robust estimator combining IPW with outcome regression, both with bootstrap 95% confidence intervals.

**Uncertainty Quantification**: Bootstrap variance for GBM and MC Dropout for DeepFM, providing confidence intervals around predictions to support risk-aware decision-making.

**Thompson Sampling**: Beta distribution posterior for each symbolic rule (alpha increments on human approval, beta on override), enabling rule recommendation with confidence intervals.

---

# Data Engineering / Data Science Components

**Synthetic Dataset Generation**: RTB dataset with 8,000 rows and 43 columns, including hierarchical user demographics, publisher quality tiers (3 levels), IAB audience/content categories, temporal features, auction dynamics, and deliberately injected bias (Female × Primetime = +40% bid uplift).

**Feature Engineering**: Categorical encoding for 19 features using LabelEncoder, continuous scaling for 11 features using StandardScaler, temporal splitting (70% train, 10% validation, 20% test) to prevent data leakage, and handling of out-of-vocabulary categories.

**Label Generation**: Click labels generated via logistic model of viewability, audience quality, recency, and IVT; brand safety labels based on publisher tier, IVT probability, and IAB content category; human rejection labels pre-applied to 5% of impressions concentrated on gaming sites.

**Bias Injection**: Controlled bias signal in temporal multiplier (0.25 * primetime + 0.40 * primetime * female) to enable XAI system validation, with the bias detector designed to recover this signal from observational data.

**Noise and Missing Values**: Gaussian noise (sigma = 2% of std dev) on continuous features, MCAR missing values at 2-4% rate in non-critical columns to test robustness.

**Evaluation Metrics**: AUC, LogLoss, precision@top-k, win rate, spend efficiency, Cohen's d for bias detection, and AOPC (Area Over Perturbation Curve) for SHAP fidelity validation.

**Experimentation Framework**: 5 novelty proof experiments (shadow latency, bias signal recovery, brand safety recall, HITL internalization, SHAP fidelity) generating quantitative evidence for research claims.

---

# Product Thinking

**User-Centric Design**: The system is designed for advertisers rather than ML engineers, with plain-English explanations, non-technical toggles, and business-focused metrics (spend, win rate, brand safety) alongside technical ones. The "Explain Like I'm Not Technical" mode demonstrates accessibility thinking.

**Reducing Friction**: Symbolic rules provide immediate correction without requiring model retraining, addressing the pain point of long feedback loops in traditional ML systems. Template-based rule creation minimizes the learning curve for policy authoring.

**Workflow Optimization**: Active learning prioritizes high-uncertainty impressions for human review, making efficient use of limited human attention. The rule bandit learns which constraints are most effective, reducing the need for manual policy tuning over time.

**Transparency First**: Shadow audit architecture ensures explainability doesn't impact live performance, addressing the common trade-off between accuracy and interpretability. Multiple explanation modalities (SHAP, NL, counterfactuals) accommodate different user preferences and use cases.

**Brand Safety as Priority**: Immediate rule enforcement and pre-labeled brand safety data show understanding that advertisers prioritize protecting their brand over marginal optimization gains.

**Scalability Considerations**: Online learning simulation and incremental fine-tuning demonstrate thinking about production deployment where models must adapt to concept drift without full retraining.

**Adoption Strategy**: The dashboard provides immediate value (viewing bids, explanations) before requiring users to engage with advanced features (rule creation, fine-tuning), following a progressive disclosure pattern that lowers barriers to adoption.

**Decision Support**: Uncertainty quantification and confidence intervals help advertisers make risk-aware decisions rather than treating model outputs as deterministic truths.

**Compliance and Fairness**: Built-in bias detection with statistical significance testing addresses regulatory concerns and ethical AI practices, showing product thinking around responsible AI deployment.

---

# Technologies Used

## Languages

Python

## Frontend

Streamlit

Plotly

Matplotlib

Seaborn

## Backend

pandas

NumPy

scikit-learn

SciPy

## Databases

CSV (pandas)

Joblib (model serialization)

JSON (rule storage)

## Cloud

None (local deployment)

## AI/ML

LightGBM (HistGradientBoosting)

PyTorch (DeepFM via deepctr-torch)

SHAP (KernelSHAP, TreeSHAP)

DICE-ML (counterfactuals)

Ollama (llama3 for NL explanations)

## DevOps

None (local execution)

## APIs

Ollama API (local LLM)

## Frameworks

scikit-learn (ML pipeline)

deepctr-torch (DeepFM architecture)

## Tools

Joblib (model persistence)

tqdm (progress bars)

---

# Skills Demonstrated

Full Stack Development

Machine Learning Engineering

Explainable AI (XAI)

Neuro-Symbolic AI

Human-in-the-Loop Systems

Gradient Boosting

Deep Learning (DeepFM)

Feature Engineering

Model Interpretability (SHAP)

Bias Detection and Fairness

Causal Inference

Reinforcement Learning (Contextual Bandits)

Active Learning

Natural Language Processing (LLM Integration)

Data Engineering (Synthetic Data Generation)

Product Strategy for AI Systems

UX Design for Technical Tools

Dashboard Development

API Design

Model Deployment and Serialization

Experimentation and A/B Testing

Statistical Analysis (Cohen's d, Bootstrap CI)

Python Software Engineering

Research-to-Production Translation

---

# Resume Impact

- Designed and implemented a neuro-symbolic explainable AI system for Real-Time Bidding, combining neural network predictions with symbolic rule constraints to provide advertiser-centric transparency and control

- Built dual-model architecture (HistGradientBoosting and DeepFM) for click-through rate prediction, achieving comparable performance while enabling complementary explanation approaches

- Developed comprehensive XAI suite including local/global SHAP explanations, bias detection using Cohen's d, counterfactual analysis, and natural language summaries via LLM integration

- Implemented human-in-the-loop feedback loop with symbolic rule engine, active learning prioritization, and model fine-tuning, demonstrating measurable AUC improvement on advertiser-approved impressions

- Created synthetic RTB dataset generator with hierarchical correlations, controlled bias injection, and realistic noise patterns to enable reproducible experimentation without proprietary data

- Engineered shadow audit architecture that generates explanations asynchronously without impacting live bidding latency, addressing the accuracy-interpretability trade-off in production ML systems

- Integrated advanced analytics including causal inference (IPW/AIPW estimators), A/B testing framework, and LinUCB contextual bandit for bid strategy optimization

- Built interactive 6-tab Streamlit dashboard with real-time model inference, cached computations, and polished UI serving both technical and non-technical users

- Conducted 5 quantitative novelty proof experiments validating bias signal recovery, brand safety recall, HITL internalization, and SHAP fidelity, generating research-grade evidence for publication

---

# Ideal Roles

AI Engineer

Machine Learning Engineer

Applied Scientist

Data Scientist

Product Engineer (AI/ML)

Technical Product Manager (AI/ML)

Research Engineer

ML Infrastructure Engineer

Full Stack Engineer (ML-focused)

---

# Portfolio Tags

Explainable AI

XAI

SHAP

Neuro-Symbolic AI

Human-in-the-Loop

Active Learning

Bias Detection

Fairness ML

Causal Inference

Reinforcement Learning

Contextual Bandits

Deep Learning

Gradient Boosting

Streamlit

Python

Machine Learning

Product Strategy

Dashboard Development

Real-Time Bidding

AdTech

---

# Project Complexity

Advanced

This project demonstrates advanced engineering through its integration of multiple AI/ML paradigms (supervised learning, explainability, causal inference, reinforcement learning, active learning) in a cohesive system. The neuro-symbolic architecture combining neural predictions with symbolic constraints is a research-grade approach. Implementation of custom DeepFM from scratch (without frameworks), manual backpropagation, and multiple explanation backends shows deep technical understanding. The system addresses real production concerns (latency, incremental learning, bias detection) rather than being a purely academic exercise. The 10-phase pipeline orchestration, modular design, and polished dashboard demonstrate full-stack engineering capability. However, it remains a research prototype with synthetic data rather than a production system handling real traffic at scale.

---

# One-line Portfolio Summary

Neuro-symbolic explainable AI system for Real-Time Bidding transparency, combining SHAP-based explanations, bias detection, and human-in-the-loop control in an interactive dashboard.

---

# Repository Evidence

- app.py (1190 lines) - Streamlit dashboard with 6 interactive tabs
- readme.md (362 lines) - System overview and architecture documentation
- documentation.md (1382 lines) - Complete technical documentation
- requirements.txt - Python dependencies (pandas, numpy, scikit-learn, shap, streamlit, plotly, torch, deepctr-torch)
- run_all.py (195 lines) - Master pipeline orchestrator with 10 phases
- data/dataset_generator.py - Synthetic RTB dataset generation (8,000 rows, 43 columns)
- models/model_wrapper.py - Unified model API for GBM and DeepFM
- models/model_lightgbm.py - HistGradientBoosting implementation
- models/model_deepfm.py - DeepFM neural network with manual backprop
- xai/xai_engine.py - SHAP explanations, bias detection, counterfactuals
- xai/fast_explainer.py - TreeSHAP and gradient attribution optimization
- xai/nl_explainer.py - Natural language explanations via Ollama
- hitl/feedback_loop.py - Symbolic rules, HITL fine-tuning, policy wrapper
- hitl/active_learning.py - Uncertainty sampling and prioritization
- hitl/rule_bandit.py - Thompson Sampling for rule optimization
- causal/causal_engine.py - IPW and AIPW causal inference
- rl_bidding/agent.py - LinUCB contextual bandit
- online_learning/stream_trainer.py - Incremental learning simulation
- experiments/ab_testing.py - A/B testing framework
- experiments/novelty_proof.py - 5 quantitative research experiments
- models/gbm_model.pkl, models/deepfm_model.pkl - Trained model artifacts
- hitl/policy_rules.json - Symbolic rule storage
- xai/outputs/ - Generated explanation charts
