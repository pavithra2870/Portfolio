# GEO Research: Algorithmic Moat in Generative AI Discovery

A reproducible research pipeline that quantifies and explains commercial bias in Large Language Model brand recommendations using explainable AI and multi-agent systems.

---

# Elevator Pitch

This project investigates whether Large Language Models suffer from an "Algorithmic Moat" — a systematic tendency to disproportionately recommend legacy, incumbent brands over emerging startups. The research introduces a novel "Share of Model" (SoM) metric to quantify this bias and uses SHAP (SHapley Additive exPlanations) analysis on a surrogate Random Forest model to explain why it occurs. The pipeline tests multiple LLMs across diverse user personas, geographic regions, and product categories, then scrapes 33+ metadata features per brand from five data sources (WHOIS, Wikipedia, Google Trends, DuckDuckGo, and heuristic SEO) to identify which proxy signals correlate with recommendation bias. Beyond quantification, the project includes three novel agentic components: a Reflexion-based self-critique agent for bias detection, counterfactual XAI to generate actionable "GEO strategy recipes" for startups, and longitudinal drift tracking to monitor how bias evolves over time. This work bridges academic research in AI fairness with practical implications for startups, policymakers, and the emerging field of Generative Engine Optimization.

---

# Product Overview

**Users:** Academic researchers studying AI bias, startup founders seeking GEO strategies, policymakers investigating algorithmic fairness, and product managers at AI companies.

**Primary Workflow:** The pipeline orchestrates a multi-stage process: (1) generates a matrix of prompts across user personas, funnel stages, localities, and categories; (2) queries multiple LLMs in a swarm pattern to extract brand recommendations; (3) scrapes comprehensive brand metadata from five external sources; (4) merges datasets and engineers features; (5) trains a surrogate model and runs SHAP analysis; (6) optionally runs novel agentic components for deeper bias analysis.

**Core Functionality:** The system quantifies LLM recommendation bias using the Share of Model metric, identifies which metadata features (domain age, Wikipedia presence, search volume) drive recommendations, and generates actionable insights for improving discoverability.

**Inputs:** Configuration YAML files, brand seed lists, API keys for LLM providers, and optional manual brand metadata.

**Outputs:** Structured CSV datasets with audit results and metadata, SHAP visualization plots (summary beeswarm, bar charts, waterfalls, dependence plots), counterfactual strategy reports, reflexion bias analysis results, and longitudinal drift tracking data.

**User Experience:** Researchers run the pipeline via a command-line interface with stage selection (audit, scrape, merge, xai, reflexion, counterfactual, drift, or all). The system handles rate limiting, thermal management, and graceful degradation when external APIs fail. Progress is logged with structured timestamps, and checkpointing enables resumption after interruptions.

**Real-world Use Case:** A startup founder in the fintech space uses the counterfactual XAI output to understand that increasing their Wikipedia presence to 1,200 words and achieving a domain age of 4+ years would increase their probability of LLM recommendation from 12% to 73%, providing a concrete roadmap for Generative Engine Optimization efforts.

---

# Problem Statement

Large Language Models are becoming the primary interface for product discovery, replacing traditional search engines. However, there is concern that LLMs may inherit and amplify existing market incumbency advantages, creating an "Algorithmic Moat" that makes it disproportionately difficult for emerging startups to be discovered. This problem is important because it could entrench market dominance, reduce innovation, and create unfair barriers to entry in the AI era. Existing solutions focus on traditional SEO and paid advertising, which do not address the unique recommendation dynamics of LLMs. Furthermore, while bias in AI systems is a known concern, most research focuses on demographic bias rather than commercial incumbency bias. This project addresses this gap by providing the first systematic quantification and explanation of commercial bias in generative AI product discovery.

---

# Key Features

## LLM Swarm Auditor
Tests multiple LLM providers (Groq, Gemini, Ollama) in a waterfall pattern where each prompt is attempted on every available model. This cross-model approach enables comparative bias analysis across different architectures and training data. The system uses provider-specific rate limiting (3s for Groq, 8s for Gemini, 0.5s for Ollama) and thermal management with cooldown periods to prevent CPU overload. Structured output via Pydantic schemas ensures consistent data extraction across providers, and resumable execution skips already-completed prompt-provider pairs.

## Multi-Dimensional Metadata Scraper
Extracts 33+ features across five dimensions: domain/SEO authority (WHOIS), Wikipedia notability, consumer awareness (Google Trends), web/media presence (DuckDuckGo), and brand heuristics. Each source operates independently with exponential backoff and user-agent rotation to avoid rate limits. The scraper gracefully degrades when sources fail, ensuring partial data collection rather than complete failure. This comprehensive feature set enables SHAP to distinguish between genuine quality signals and incumbency proxies.

## Share of Model (SoM) Metric
A novel metric that quantifies a brand's visibility in LLM recommendations as a percentage, analogous to Share of Voice in traditional marketing. The system computes SoM scores under different prompt framings (neutral vs. quality-focused) and calculates "framing lift" to measure how much emphasis on quality changes recommendation patterns. This metric provides a standardized way to track and compare brand discoverability across different LLMs and over time.

## SHAP-Based Explainable AI
Trains a Random Forest or XGBoost surrogate model to predict brand recommendations based on metadata features, then applies SHAP values to explain which features drive the model's decisions. This provides mathematical evidence for the Algorithmic Moat hypothesis by showing that features like domain age and Wikipedia presence (proxies for incumbency) have higher SHAP values than features that might indicate product quality. The system generates multiple visualization types: summary beeswarm plots for global importance, bar charts for mean absolute SHAP values, waterfall plots for per-brand explanations, and dependence plots for feature interactions.

## Reflexion Bias Agent
A novel agentic component that implements a multi-turn self-critique loop adapted from Reflexion research. The agent queries an LLM for a recommendation, then uses a Critic LLM to evaluate whether the reasoning reflects product quality or incumbency bias. If bias is detected, the original LLM gets one chance to revise its recommendation. This produces bias flags, bias scores, and revised recommendations, enabling longitudinal analysis of how often LLMs correct their own bias when prompted.

## Counterfactual XAI Generator
Uses DiCE (Diverse Counterfactual Explanations) to generate minimum-change scenarios that would flip a brand from "not recommended" to "recommended." For each unrecommended brand, the system produces multiple counterfactual instances representing different "GEO optimization paths" (e.g., "increase Wikipedia word count to 1,200 and domain age to 4.2 years"). This translates abstract SHAP feature weights into concrete, quantified action items for startups, bridging XAI research with practical GEO strategy.

## Longitudinal Drift Tracker
Monitors how SoM scores and bias patterns change over time as LLM training data is updated. The system runs the full pipeline on a scheduled basis, tracks statistical process control charts, and detects significant shifts in brand favoritism. This enables researchers to study the temporal dynamics of algorithmic bias and understand how model updates affect commercial fairness.

## Consumer Survey Analysis
A complementary analysis of primary survey data (N=68) examining consumer trust in AI vs. traditional search, willingness-to-pay differences, and behavioral patterns. The analysis includes diverging stacked bar charts for WTP distribution, box plots for trust score comparison, K-means clustering for consumer personas, correlation heatmaps for bias awareness vs. trust trade-offs, and demand curve shift simulations. This provides human-centric context to the technical bias analysis.

---

# Engineering Highlights

**Backend Orchestration:** A modular pipeline architecture with seven distinct stages (prompt matrix generation, LLM auditing, metadata scraping, data merging, SHAP analysis, and three novel agentic components). The main.py orchestrator supports running individual stages or the full pipeline with configurable YAML settings. Each stage is independently testable and resumable with checkpointing.

**Multi-Provider LLM Integration:** LangChain-based integration with four LLM providers (Groq, Gemini, OpenAI, Ollama) using a priority-based waterfall pattern. The system handles provider-specific rate limits, API key management via environment variables, and graceful degradation when providers are unavailable. Structured output via Pydantic ensures consistent data extraction across different model architectures.

**Resilient Web Scraping:** Five-source metadata scraping with anti-rate-limit mechanisms including exponential backoff with jitter, user-agent rotation, and source isolation (failure in one source never blocks others). The scraper uses python-whois for domain data, wikipedia-api for notability metrics, pytrends for Google Trends (free, no API key), and duckduckgo-search for web presence (also free). Thermal management prevents CPU overload during intensive scraping operations.

**Feature Engineering Pipeline:** A dynamic feature dimension registry (FEATURE_DIMS dict) that automatically propagates feature definitions across the data merger and SHAP analyzer modules. The system engineers 33+ features across five dimensions, including log transformations, categorical encodings, and composite scores like "wiki_notability_score" and "tld_prestige_score." This design makes adding new features trivial—update the registry and both modules adapt automatically.

**Machine Learning Pipeline:** Scikit-learn-based surrogate model training with support for Random Forest and XGBoost. The pipeline includes stratified train-test splitting, cross-validation with configurable folds, and comprehensive performance metrics (ROC AUC, confusion matrix, classification reports). Hyperparameters are configurable via YAML, enabling experimentation without code changes.

**Explainable AI Integration:** SHAP integration for model interpretation with multiple visualization types. The system handles both TreeExplainer for tree-based models and generates publication-ready PDF plots. The analysis distinguishes between "pure" features (metadata only) and including recommendation count as a sanity check feature.

**Data Management:** Safe CSV I/O with file locking to prevent corruption during concurrent writes. The system uses deduplication on specified columns during appends and handles missing data gracefully. All data paths are configurable via YAML, supporting different deployment environments.

**Configuration Management:** YAML-based configuration for all hyperparameters, model names, prompt templates, scraper settings, and feature flags. Multiple config files support different scenarios (settings.yaml, settings_gemini.yaml, settings_test.yaml). The config system enables experimentation without code changes and supports reduced matrix dimensions for API budget constraints.

**Logging and Monitoring:** Structured logging with timestamps at each pipeline stage, enabling audit trails and debugging. The system logs provider-specific success/failure rates, thermal cooldown events, and checkpoint completion. Progress indicators show completion percentage during long-running stages.

**Error Handling:** Comprehensive exception handling with graceful degradation. Missing optional dependencies (dice-ml, pytrends, duckduckgo-search) are detected at import time with warnings rather than failures. API errors are logged and the pipeline continues to remaining providers or stages.

---

# AI / ML Components

**LLM Usage:** Multi-provider LLM integration using LangChain with structured output enforcement via Pydantic schemas. The system tests four different model architectures (Llama variants via Groq and Ollama, Gemini via Google, Mistral and Phi via Ollama) to compare bias across different training data and model sizes. Prompts are engineered with specific framings (neutral vs. quality-focused) to test framing effects on recommendations.

**Retrieval:** No traditional RAG, but the system retrieves brand metadata from five external sources (WHOIS databases, Wikipedia API, Google Trends via pytrends, DuckDuckGo search results) to construct a comprehensive feature set for bias analysis.

**Machine Learning Models:** Random Forest and XGBoost surrogate models trained to predict brand recommendations based on metadata features. These models serve as interpretable proxies for the opaque LLM decision process, enabling SHAP analysis to identify which features drive recommendations.

**Explainable AI (XAI):** SHAP (SHapley Additive exPlanations) for model interpretation, providing both global feature importance (which features matter overall) and local explanations (why a specific brand was or wasn't recommended). The system generates beeswarm plots, bar charts, waterfall plots, and dependence plots for comprehensive analysis.

**Counterfactual Explanations:** DiCE (Diverse Counterfactual Explanations) for generating minimum-change scenarios that would flip model predictions. This provides actionable "what-if" analysis for startups seeking to improve their LLM discoverability.

**Agent Systems:** Reflexion-based self-critique agent implementing multi-turn LLM interactions where a Critic model evaluates the Actor model's recommendations for bias. This agentic approach goes beyond single-pass LLM queries to enable bias detection and correction.

**Prompt Engineering:** Carefully crafted prompt templates for different funnel stages (discovery, comparison, purchase intent, alternatives) and user personas (enterprise CTO, early-stage startup, student, government procurement, mid-market ops manager). The system also engineers specific prompts for the Reflexion critic to evaluate bias vs. quality reasoning.

**Evaluation:** The system evaluates bias through multiple lenses: Share of Model scores, framing lift analysis, SHAP feature importance ranking, reflexion bias detection rates, counterfactual difficulty (how much change is needed), and longitudinal drift tracking. Consumer survey analysis provides human-centric validation of technical findings.

---

# Data Engineering / Data Science Components

**Datasets:** Primary datasets include LLM audit results (structured CSV with recommendations, reasoning, confidence scores across multiple models and prompt variants) and brand metadata (33+ features across five dimensions scraped from external sources). Secondary dataset includes consumer survey responses (N=68) on trust, willingness-to-pay, and AI usage patterns.

**Preprocessing:** Data cleaning includes parsing list-type columns (secondary brands), handling missing values with graceful degradation, log-transforming skewed features (domain age, Wikipedia metrics), and encoding categorical variables (brand age buckets, trend direction). The merger handles deduplication and joins on brand names with fuzzy matching considerations.

**Feature Engineering:** 33+ engineered features across five dimensions: domain/SEO authority (7 features), Wikipedia notability (10 features), consumer awareness (3 features), web/media presence (6 features), and brand heuristics (7 features). Composite scores include wiki_notability_score and tld_prestige_score. Log transformations normalize skewed distributions.

**Model Training:** Scikit-learn pipeline with stratified train-test splitting (75/25), Random Forest with 300 estimators and balanced class weights, optional XGBoost with 200 estimators and subsampling. Cross-validation with 5 folds for robustness. Hyperparameters are configurable via YAML.

**Evaluation:** Model performance evaluated via ROC AUC, confusion matrices, and classification reports. SHAP values evaluated for feature importance ranking and consistency. Bias evaluated via Share of Model metrics, framing lift analysis, and reflexion bias detection rates.

**Visualization:** Matplotlib and seaborn for publication-ready figures including SHAP beeswarm plots, bar charts, waterfall plots, dependence plots, model performance ROC curves, consumer survey diverging bar charts, box plots, correlation heatmaps, K-means clustering with PCA visualization, and demand curve shift simulations.

**Analytics:** Consumer survey analysis includes statistical comparisons (t-tests for trust score differences), K-means clustering for persona identification, correlation analysis for bias awareness vs. trust trade-offs, and demand curve modeling to simulate price sensitivity differences between AI and traditional search discovery.

**Experimentation:** The system supports A/B testing via prompt framing comparisons (neutral vs. quality-focused), cross-model comparisons (different LLM providers), and longitudinal experiments (tracking bias over time). Configuration-driven design enables rapid experimentation with different feature sets, model hyperparameters, and prompt templates.

---

# Product Thinking

**User-Centric Design:** The pipeline is designed for researchers with varying resource constraints—configurable matrix dimensions allow running reduced experiments on free-tier APIs or laptops, while the full matrix can be used with cloud resources. Resumable execution and checkpointing accommodate long-running jobs that may be interrupted.

**Reducing Friction:** The system abstracts away complexity of multi-provider LLM integration, web scraping with rate limits, and SHAP analysis configuration. Researchers can run the entire pipeline with a single command while still having granular control over individual stages.

**Workflow Optimization:** The waterfall pattern for LLM providers ensures maximum data collection—if one provider fails, others continue. Thermal management prevents CPU throttling during intensive operations. Isolated data sources mean partial failure doesn't require restarting the entire pipeline.

**Accessibility:** The system uses free APIs where possible (Google Trends via pytrends, DuckDuckGo via duckduckgo-search) and supports local models via Ollama for users without API keys. Graceful degradation means the pipeline produces useful output even when some components are unavailable.

**Decision Support:** Counterfactual XAI translates abstract bias analysis into actionable recommendations for startups. Reflexion analysis provides bias flags that could inform user-facing features (e.g., "this recommendation may be influenced by popularity rather than quality").

**Prioritization:** The config system allows prioritizing faster/cheaper providers (Groq) while maintaining fallbacks to more expensive or slower options. Reduced matrix dimensions protect API budgets during development.

**Scalability:** The modular architecture supports scaling from laptop experiments to cloud deployments. Checkpointing and resumable execution enable processing arbitrarily large prompt matrices by running in batches.

**Adoption Strategy:** The project includes comprehensive documentation, example configurations, and publication-ready visualizations to support academic publication. The novel agentic components (Reflexion, counterfactual, temporal tracking) provide research contributions beyond the core bias quantification.

---

# Technologies Used

## Languages
- Python

## Frontend
- None (CLI-based research pipeline)

## Backend
- LangChain (LLM orchestration)
- LangChain-Groq, LangChain-Google-GenAI, LangChain-OpenAI, LangChain-Ollama (provider integrations)

## Databases
- CSV-based data storage (no traditional databases)

## Cloud
- Groq (cloud LLM API)
- Google Cloud (Gemini API)
- OpenAI (optional provider)

## AI/ML
- Scikit-learn (Random Forest, XGBoost, model evaluation)
- SHAP (explainable AI)
- DiCE-ML (counterfactual explanations)
- XGBoost (optional model backend)

## DevOps
- Python virtual environments (venv)
- YAML configuration management
- Environment variable management (python-dotenv)

## APIs
- Groq API
- Google Gemini API
- OpenAI API (optional)
- Wikipedia API
- Google Trends (via pytrends, no API key required)
- DuckDuckGo Search API (via duckduckgo-search, no API key required)
- WHOIS (via python-whois, no API key required)

## Frameworks
- Pydantic (data validation and structured output)
- PyYAML (configuration management)

## Tools
- Pandas (data manipulation)
- NumPy (numerical computing)
- Matplotlib (visualization)
- Seaborn (statistical visualization)
- Jupyter (notebook support)
- IPython Kernel (notebook support)

---

# Skills Demonstrated

- Full Stack Research Engineering
- LLM Integration and Orchestration
- Multi-Provider API Management
- Explainable AI (XAI)
- SHAP Analysis
- Counterfactual Explanations
- Machine Learning Model Training
- Feature Engineering
- Web Scraping and Data Extraction
- Rate Limiting and API Resilience
- Pipeline Orchestration
- Modular Software Architecture
- Configuration-Driven Design
- Data Visualization
- Statistical Analysis
- Agent Systems Design
- Prompt Engineering
- Bias Detection and Analysis
- Academic Research Methods
- Reproducible Research Practices
- Error Handling and Graceful Degradation
- Thermal Management for Resource-Constrained Environments

---

# Resume Impact

- Developed a reproducible research pipeline quantifying commercial bias in Large Language Model brand recommendations using a novel Share of Model (SoM) metric
- Implemented multi-provider LLM integration across Groq, Gemini, and Ollama with structured output enforcement and provider-specific rate limiting
- Engineered a 33-feature metadata extraction system across five data sources (WHOIS, Wikipedia, Google Trends, DuckDuckGo, heuristic SEO) with anti-rate-limit mechanisms
- Applied SHAP-based explainable AI to identify domain age and Wikipedia presence as primary drivers of LLM recommendation bias, providing mathematical evidence for Algorithmic Moat hypothesis
- Designed and implemented three novel agentic components: Reflexion-based self-critique agent, counterfactual XAI generator for actionable GEO strategies, and longitudinal bias drift tracker
- Built a modular, configuration-driven pipeline architecture supporting resumable execution, checkpointing, and graceful degradation for production-grade research workflows
- Conducted consumer survey analysis (N=68) with statistical testing, K-means clustering, and demand curve modeling to provide human-centric validation of technical bias findings
- Generated publication-ready visualizations including SHAP beeswarm plots, counterfactual strategy recipes, and consumer behavior charts for academic dissemination

---

# Ideal Roles

- AI Research Engineer
- Machine Learning Engineer
- Applied Scientist
- Data Scientist
- Research Software Engineer
- AI Ethics Researcher
- Product Scientist
- Technical Product Manager
- Backend Engineer (AI/ML focus)
- Full Stack Engineer (Research Tools)

---

# Portfolio Tags

GEO

Algorithmic Bias

LLM Research

Explainable AI

SHAP

Counterfactual Explanations

LangChain

Multi-Agent Systems

Web Scraping

Feature Engineering

Machine Learning

Data Visualization

Academic Research

Python

Scikit-learn

XAI

Bias Detection

---

# Project Complexity

Advanced

This project demonstrates advanced engineering through its integration of multiple complex systems: multi-provider LLM orchestration with rate limiting and thermal management, 33-feature web scraping across five external sources with anti-rate-limit mechanisms, SHAP-based explainable AI with multiple visualization types, and three novel agentic components (Reflexion, counterfactual XAI, temporal tracking). The modular architecture with configuration-driven design, resumable execution, and graceful degradation shows production-grade software engineering practices applied to academic research. The project bridges multiple domains (AI bias, XAI, web scraping, machine learning, data visualization) and contributes novel research methodologies beyond standard implementations.

---

# One-line Portfolio Summary

A reproducible research pipeline quantifying LLM commercial bias using Share of Model metrics, SHAP explainable AI, and novel agentic components for bias detection and counterfactual analysis.

---

# Repository Evidence

- main.py (pipeline orchestrator with stage selection)
- src/pipeline/llm_auditor.py (multi-provider LLM swarm with structured output)
- src/pipeline/metadata_scraper.py (5-source metadata extraction with rate limiting)
- src/pipeline/prompt_matrix.py (prompt generation across personas and stages)
- src/xai/shap_analyzer.py (Random Forest training + SHAP visualization)
- src/xai/data_merger.py (feature engineering and dataset merging)
- src/agentic/reflexion_agent.py (self-critique bias detection agent)
- src/agentic/counterfactual_xai.py (DiCE-based counterfactual generator)
- src/agentic/temporal_tracker.py (longitudinal drift analysis)
- configs/settings.yaml (comprehensive configuration management)
- requirements.txt (dependency specifications)
- phase-2/ai_survey_analysis.py (consumer survey analysis with ML)
- outputs/figures/ (SHAP visualization outputs)
- data/raw/ (audit and metadata CSV datasets)
- README.md (comprehensive documentation)
