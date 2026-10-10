# The Algorithmic Moat — Project Guide

## What this project is

**The Algorithmic Moat** is an end-to-end research project about a new form of commercial visibility: whether generative-AI systems disproportionately surface established brands, and what that does to consumer trust and willingness to pay. It contains two related but independent research tracks:

1. **Algorithmic audit / GEO track.** A reproducible Python pipeline queries several LLMs with a controlled prompt matrix, measures each brand's *Share of Model* (SoM), enriches brands with public web-presence metadata, and trains an interpretable surrogate model to identify which signals are associated with recommendation.
2. **Consumer survey track.** A primary survey of 68 respondents compares a Google-search scenario with an AI-recommendation scenario, then analyses trust, willingness to pay (WTP), perceived bias, behavioural segments, and adoption.

The portfolio narrative is **not** “LLMs have been proven to use these features internally.” The pipeline is a black-box behavioural audit: it observes LLM outputs, models associations with independently measured public-web signals, and uses SHAP to explain the *surrogate model*. The survey is complementary evidence about consumer response, not a direct measurement of LLM behavior.

## Problem and research thesis

Product discovery is shifting from ranked links to conversational recommendations. This can create an **algorithmic moat**: brands with a long, well-documented public-web footprint may be preferentially surfaced, compounding incumbent advantage and making emerging brands harder to discover.

The project introduces **Share of Model (SoM)**, analogous to share of voice: the proportion of audited LLM queries in which a brand is mentioned/recommended. It tests whether recommendation visibility is concentrated and associated with legacy authority proxies, especially domain age and Wikipedia presence. The practical lens is **Generative Engine Optimization (GEO)**: how a startup can make its public information more discoverable and legible to generative systems without treating opaque model outputs as a black box.

### Research questions and hypotheses

- **H1 — Algorithmic moat:** recommendations are concentrated among brands with high legacy web-authority signals.
- **H2 — Wikipedia gate:** Wikipedia presence may act as a threshold signal for recommendation inclusion.
- **H3 — Domain-age compounding:** domain age has a nonlinear relationship with recommendation likelihood.
- **H4 — GEO actionability:** counterfactual feature changes can provide bounded, practical visibility hypotheses for currently unseen brands.
- **Survey H1/H2:** AI-recommended products receive higher WTP and trust than the Google-search scenario.
- **Survey H3/H4:** AI omission can reduce startup legitimacy; consumers value explanation and fairness safeguards.

## End-to-end system

```
Prompt matrix → multi-provider LLM audit → brand/metadata collection
      → merge + feature engineering → surrogate model + SHAP
      → Reflexion critique / counterfactual recipes / optional drift tracking

Primary survey workbook → cleaning + ordinal encodings → A/B descriptive analysis
      → K-means personas + Spearman correlations + demand-curve simulation
```

### Audit pipeline

| Stage | Implementation | Input → output |
|---|---|---|
| 1. Prompt matrix | `src/pipeline/prompt_matrix.py` | Builds reproducible prompts across funnel stage, persona, locality, category, and neutral vs quality-focused framing. |
| 2. LLM swarm audit | `src/pipeline/llm_auditor.py` | Calls cloud/local models, requires structured top-five recommendations, records reasoning, confidence, incumbent signals, long-tail brands, raw response, and provider attempts. |
| 3. Metadata scraping | `src/pipeline/metadata_scraper.py` | Collects brand/domain signals from WHOIS, Wikipedia, Google Trends, DuckDuckGo, and heuristic SEO. Retries, rotates user agents, and degrades gracefully per source. |
| 4a. Data engineering | `src/xai/data_merger.py` | Aggregates brand-model recommendations, computes SoM/framing lift, joins metadata, derives log and notability features, and imputes missing values. |
| 4b. XAI | `src/xai/shap_analyzer.py` | Fits a configured Random Forest/XGBoost surrogate, evaluates it, calculates SHAP values, and saves global/local explanations. |
| 5. Agentic extensions | `src/agentic/` | Reflexion critique, DiCE counterfactual GEO recipes, and longitudinal SoM drift monitoring. |

The CLI is `main.py`. It runs `audit`, `scrape`, `merge`, `xai`, `reflexion`, `counterfactual`, `drift`, or `all`; failures in `all` are logged and do not stop later stages.

### Configured audit design

`configs/settings.yaml` is the current baseline. It configures a budget-protected matrix of four funnel stages (discovery, comparison, purchase intent, alternatives), five personas (enterprise CTO, early-stage startup, student, government procurement, mid-market operations), five localities (global, India, USA, Europe, Southeast Asia), and two categories (personal finance/budgeting and e-commerce platforms), with neutral and quality-focused framings produced by the prompt generator.

Provider configuration waterfalls from Groq to local Ollama models. The codebase also supports Gemini; the historical audit data additionally contains Gemini and Qwen records. Shared inference settings are temperature 0.2, 512 tokens, and a 60-second timeout. Provider delays, retry/backoff, and a 50-call/45-second thermal cooldown protect free-tier APIs and local hardware.

## Data contract and project artifacts

### Audit data

- `data/raw/llm_audit_raw.csv`: **2,376 × 35** audit records. Key fields include provider/model, prompt context, top-five positions, primary/secondary brands, reasoning, incumbent signals, emerging brands, confidence, and raw response.
- `data/raw/brand_metadata_raw.csv`: **654 × 37** brand-domain records. Fields span WHOIS/domain hygiene; Wikipedia presence, words, references, sections, languages and infobox; Trends interest; DuckDuckGo results/news/reviews; and heuristic brand/category features.
- `data/processed/merged_dataset.csv`: **899 × 59** brand-model observations. Contains recommendation counts, SoM, neutral/quality counts, framing lift, raw metadata, target `is_recommended`, and engineered features such as `log_domain_age`, `has_wikipedia`, `log_wiki_words`, `log_wiki_refs`, and `wiki_notability_score`.
- `outputs/processed/shap_values.csv`: **225 × 11** saved SHAP values for the held-out analysis rows.

The audit currently contains seven observed model identifiers: Gemini Flash Lite, Llama 4 Maverick, Llama 3.3, Qwen3, and local Llama 3, Mistral, Phi-3. It includes 654 scraped brand records. Reported Phase 1 figures use 899 merged records and 643 unique brand entities; minor record/brand counts should always be regenerated from the current CSV before publication.

### Survey data

- Source: `Reports/Generative AI Impact on Product Discovery & Trust Survey (Responses).xlsx`.
- Analysis: `survey-results/ai_survey_analysis.py`.
- Population: **N = 68 usable responses**, a non-probability convenience/purposive sample skewed digital-first (72.1% age 16–24; 77.9% students or Engineering/IT).
- Instrument: `Reports/Survey Questions.pdf`; formal write-up: `Reports/Survey Report.docx`.
- Generated figures: `survey-results/1a_wtp_diverging_bar.png`, `1b_trust_boxplot.png`, `2a_kmeans_personas.png`, `2b_correlation_heatmap.png`, and `2c_demand_curve_shift.png`.

The within-respondent comparison is Scenario A (Google / unfamiliar TuneStream) versus Scenario B (AI / Spotify). WTP brackets are converted to midpoints: ₹0, ₹50, ₹150, ₹250, ₹400. This is an interpretable descriptive convention, not a continuous price measurement.

## What the analysis found

### Algorithmic audit: measured pattern

The Phase 1 report describes a highly concentrated recommendation corpus: Shopify (333 mentions), Mint (291), and Salesforce (251) account for **37.0%** of 2,366 recommendation events; the top 10 account for **63.9%**. The report finds fewer than 15 brands account for roughly 80% of recommendation space.

The merged classifier target is heavily imbalanced: **888 recommended / 11 non-recommended** (98.8% / 1.2%). The saved model report shows 5-fold CV AUC **0.9992 ± 0.0015** and held-out AUC **1.000** (225 test observations: 222 positive and 3 negative). These figures show strong separation in this dataset but must not be presented as proof of generalizable causal performance because of the tiny negative class, likely entity/feature leakage risks, and repeated brand/model observations.

The report's interpretation is that Wikipedia presence/notability and transformed domain-age signals are the strongest explanatory features. It reports 82.4% of recommended cases have Wikipedia presence versus 0% of non-recommended cases. Domain age alone has nearly the same reported mean for the two groups (~21 years), so the claimed mechanism is an interaction/nonlinear association, not a simple age difference.

Saved visuals in `outputs/figures/` include ROC/model performance, global SHAP beeswarm and bar charts, SHAP dependence plots (domain age, Wikipedia metrics), local waterfall plots, and a counterfactual strategy figure.

### Agentic extension status

- **Reflexion:** `data/processed/reflexion_results.csv` contains 2,376 critiques. The run log reports 100% `bias_detected` and mean score 0.798. This should be described as a critic-model output, not an independently validated incidence rate; the 100% rate strongly suggests the critic prompt/threshold needs calibration and human validation.
- **Counterfactuals:** `data/processed/counterfactual_results.csv` contains 10 examples, currently named `unknown`, with low current probability (0.009) and 3–4 feature changes. The recipes include impossible/inert changes (e.g., domain age or brand-name length) and should be framed as exploratory feature-space explanations rather than operational advice.
- **Drift:** the tracker implements wave logging plus EWMA/CUSUM detection, but `temporal_tracking.enabled` is false and the repository contains no multi-wave result. It is an implemented capability, not a completed longitudinal finding.

### Consumer-survey results

| Outcome | Google / TuneStream | AI / Spotify | Difference |
|---|---:|---:|---:|
| Mean trust (1–5) | 2.88 | 3.79 | +0.91 points / +31.6% |
| Mean monthly WTP (midpoint) | ₹44.9 | ₹83.8 | +₹38.9 / +86.6% |
| “Would not buy” | 60.3% | 39.7% | −20.6 percentage points |

Other reported findings: 69.2% use AI daily or weekly for product research; 36.8% name generative AI as their primary discovery channel versus 47.1% traditional search. 83.8% at least sometimes suspect incumbent bias, while the Spearman correlation between bias suspicion and AI trust is near zero (ρ = −0.07, not significant). XAI importance averages 4.01/5; 76.5% support some form of fair-visibility oversight. The survey clustering selects **K = 3**: AI Evangelists (n=30, 44%), Skeptical Pragmatists (n=17, 25%), and Google Traditionalists (n=21, 31%). The strongest reported AI-WTP association is belief that an AI recommendation means a better product (ρ = +0.315, p < .01).

### Required interpretation safeguards

The survey's channel comparison is confounded by **brand familiarity**: Spotify is a known incumbent and TuneStream is unfamiliar. It supports a realistic “AI-endorsed incumbent package” finding, but it does not isolate an AI-channel effect. A future 2×2 design—known/unknown brand × Google/AI channel—with random assignment would separate brand equity from channel influence. The sample is young/digital-first and non-probability, so report it as exploratory primary research rather than population estimates.

## Portfolio story

Use this chain of reasoning:

1. Product discovery is becoming an AI-mediated recommendation problem.
2. The audit makes that opaque system measurable with a controlled prompt matrix and SoM.
3. Public-web authority signals are associated with which brands become visible in the observed recommendation corpus.
4. SHAP and counterfactual prototypes turn an opaque outcome into inspectable hypotheses, while Reflexion and drift monitoring show how the system could be audited continuously.
5. The survey provides the market consequence: an AI-endorsed, familiar product received higher trust and stated WTP in this digital-first sample.
6. The implication is a potential feedback loop: visibility → trust/value → revenue/attention → stronger web footprint → visibility. It is a strategic hypothesis to test, not a causal proof.

## Site/content requirements for future agents

The portfolio website should be a self-contained, responsive, business-led case study—not a generic dashboard. Lead with the thesis and the two evidence streams, distinguish measured data from proposed capabilities, and place limitations near results rather than hiding them in a footnote. Use the existing survey PNGs directly and recreate simple summary charts from the reported numbers in accessible HTML/SVG where helpful. Do not expose `.env`, credentials, raw LLM responses, or personally identifiable survey data.

Recommended navigation: Overview → Research design → Audit pipeline → Evidence → Consumer impact → Responsible interpretation → Repository/map. Use calm navy/teal business styling, readable typographic hierarchy, mobile layouts, visible source/asset references, and no external runtime dependency unless hosting requires it.

## Reproduction and maintenance

```powershell
pip install -r requirements.txt
ollama pull llama3
ollama pull mistral
python main.py --config configs/settings.yaml --stage all
```

Before a new run, provide valid provider keys in `.env`; do not commit that file. Run individual stages while iterating. Validate raw/merged schemas after changing any scraper or prompt field, split train/test by brand and audit wave for a more defensible future model, use imbalance-aware metrics (PR-AUC, balanced accuracy, precision/recall with confidence intervals), and calibrate the Reflexion critic against human labels. Repair the survey script's hard-coded `/home/claude/charts` and `/mnt/user-data/uploads/...` paths before re-running it locally; its checked-in PNGs are the current artifacts.

## Repository map

| Location | Role |
|---|---|
| `main.py` | Pipeline CLI/orchestration. |
| `configs/` | Provider, matrix, scraper, XAI, and agent settings; test/Gemini variants. |
| `src/pipeline/` | Prompt generation, LLM auditing, metadata scraping. |
| `src/xai/` | SoM aggregation, feature engineering, model training, SHAP. |
| `src/agentic/` | Reflexion, DiCE counterfactuals, drift tracker. |
| `data/raw/`, `data/processed/` | Audit inputs and derived analysis datasets. |
| `outputs/` | Model metrics, run logs, SHAP/counterfactual figures. |
| `survey-results/` | Survey analysis script and rendered figures. |
| `Reports/` | Research reports, objectives, survey instrument, source workbook. |
| `README.md`, `GEO_Research_Algorithmic_Moat.md` | Original repository/project narratives. |
