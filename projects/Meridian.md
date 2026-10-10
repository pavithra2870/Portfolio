# Meridian

A live risk-intelligence desk that turns raw global news into explainable risk signals, then into rebalancing decisions and portfolio stress-test losses.

---

## Elevator Pitch

Meridian reads the news so a portfolio team does not have to. It ingests live global news events (GDELT, refreshed every 15 minutes), financial news, finance tweets and Yahoo Finance headlines, and converts all of that unstructured text into one common, structured **Risk Signal**: which companies and sectors are affected, what type of event it is, how the sentiment reads, how confident the system is, and an impact score from 1 to 10 with every contributing factor shown.

Two decision tools sit on top of that signal layer. A **Tactical Rebalancer** says which stocks in a 15-stock index to add or trim today, with a plain-English reason for each and hard portfolio limits respected. A **Strategic Stress Lab** takes a live event and shows what it would cost four different synthetic institutional portfolios (equities, bonds, loans and derivatives), broken down by asset type, sector and driver. An optional local AI copilot explains the results in chat.

What makes it different: it is a real risk product, not an LLM wrapper. Every score, weight and loss is computed by deterministic, tested backend code from data and configuration files. The language model is strictly optional and only rephrases numbers the backend has already computed. The whole app runs offline from committed data, with no API keys and no login, and quietly upgrades itself with live data when the network is available.

Built for the S&P Global and Crisil Campus Hackathon 2026 (problem statement: AI/NLP-driven risk intelligence from unstructured data, feeding tactical rebalancing and strategic stress testing).

---

## Product Overview

**Users.** Portfolio managers, risk analysts and investment-committee members who need early, explainable, portfolio-specific warnings. The UI also adds plain-English helper text so a non-finance reader can follow it.

**Primary workflow.**
1. Open the Overview and see the market risk index, news sentiment, the sector under most pressure, and a 10-day comparison.
2. Drill into a Risk Signal to see why it scored what it did.
3. Check the Rebalancer for today's buy/sell list and the reasons behind it.
4. Pick a live event in the Stress Lab and see what it would cost each selectable portfolio.
5. Ask the copilot follow-up questions in plain language.

**Inputs.** Live GDELT event and theme files, Yahoo Finance prices and headlines, historical financial news, finance and general tweets, and four synthetic portfolios of 155 positions in total.

**Outputs.** Ranked risk signals with factor-level explanations; proposed index weights with turnover and constraint checks; stress-test results (value before and after, absolute and percentage loss, loss by asset, sector and driver, severity curve and break-even point); chat answers backed by charts of the underlying data.

**Real-world use case.** A geopolitical headline breaks. Meridian classifies it, scores it, shows which sectors and companies it touches, and states how much a growth fund would lose compared with a conservative fund, all within one workflow.

---

## Problem Statement

Risk-relevant information is buried in unstructured text: news, filings commentary and social media. Humans cannot read it all, and spreadsheets cannot read it at all. By the time a risk is visible in a price move, it is often too late to act.

Existing approaches fall short in three ways:
- **Sentiment-only tools** treat negative as risky and positive as safe. That ignores event type, source agreement, market volatility, novelty and, most importantly, what a given portfolio actually holds.
- **Black-box AI summaries** are not auditable, which institutional users cannot accept for risk decisions.
- **Generic stress tests** apply one scenario to everyone, hiding the central insight that the risk of an event is not universal: it depends on exposure.

Meridian addresses each: a multi-factor, explainable impact score; deterministic calculations with documented assumptions; and portfolio-specific impact.

---

## Key Features

### Risk Intelligence (the signal layer)
- **Live news ingestion.** Pulls GDELT daily and 15-minute files plus GDELT's own article themes and organisations, so the "top affected sector" comes from real topic tags rather than guesswork. Gives users a view that stays current while the app is open.
- **Unified Risk Signal.** News, tweets and headlines are normalised to the same schema, so downstream modules do not care where a signal came from.
- **Explainable impact score (1 to 10).** Built from seven visible factors: event severity, sentiment strength, confidence, entity relevance, source consensus, volatility regime and novelty. Polarity alone never sets the score, and users can see which factor contributed what.
- **Risk Signal detail page.** Event classification, affected companies and sectors, source consensus, factor breakdown and affected portfolio exposure, so a user can audit any score.

### Overview Dashboard
- **Market risk index, sentiment, top sector, risk-over-time chart, top signals, live market strip** (S&P 500, VIX, 10-year yield).
- **10-day comparison** so users can compare today against recent days instead of reading a single snapshot.
- **Plain-English hints** under each figure, aimed at readers without a finance background.

### Module A: Tactical Rebalancer
- **Buy/sell list with reasons** for a 15-stock mock index, using real market-cap weights from Yahoo Finance (capped at 12%).
- **Relative scoring.** Each stock is scored against the index average from company news, sector news and exposure to current shocks. Recent news counts more than old news, and bad news counts more than good.
- **Hard constraints.** Minimum and maximum weight per stock, a sector cap, total weight of 100% and a turnover limit, so the output is something a manager could actually trade.
- **Day-by-day weight chart** with selectable stocks, so users can see how recommendations evolve.

### Module B: Strategic Stress Lab
- **Four materially different synthetic portfolios** (Global Growth Fund, Wholesale Bank Portfolio, Balanced Institutional Fund, Conservative Allocation), so the same event gives different results.
- **Event-to-shock rules in configuration.** Equities by sector and beta, bonds by duration, convexity and spread, loans by default probability and loss given default, options by delta, gamma and vega, swaps by DV01, and credit default swaps by CS01.
- **Loss-versus-severity curve with break-even.** Answers "how bad would this event need to be to cost this fund 5%?"
- **Ranking of the latest live events** by the damage each would do to the selected portfolio.
- **"One event, four portfolios" comparison** that makes the exposure insight visible.
- Clearly labelled as a simplified prototype methodology, not a regulatory model.

### AI Risk Copilot (optional)
- **Chat interface** with suggested prompts such as "Which holdings are most vulnerable?"
- **Grounded answers.** The backend computes facts first; a local model only rewords them. Each answer has a "data behind this answer" panel rendered as charts.
- **Graceful fallback.** Without a model, template-based answers keep every question working.

### Reliability and Setup
- **Self-refreshing.** A background job refreshes every 15 minutes, shows a recalculating banner and reloads the page when new results are ready.
- **Offline-first.** Runs from committed data with no keys, no login and no paid services.

---

## Engineering Highlights

- **Strict separation of concerns.** FastAPI owns all business logic; the React frontend only renders typed API results and contains no scoring, valuation, stress or rebalancing formulas. This is enforced as a design rule.
- **Backend.** FastAPI with Pydantic request and response models, SQLite storage rebuilt automatically from committed CSVs if missing, and a service layer for signals, portfolios, rebalancing, stress testing, market data and the copilot.
- **Live refresh job.** A background thread fetches GDELT and market data independently, reruns the pipeline only when news actually changed, swaps the database atomically, and invalidates store caches by file modification time. The UI polls a status endpoint to show progress.
- **Resilient data layer.** Missing sources are skipped with warnings instead of crashing; GDELT catch-up is capped at 10 days; Yahoo Finance failures fall back to the committed snapshot.
- **Frontend.** React 18 with Vite, a hash router, an error boundary, and hand-built SVG charts (line charts with hover and end labels, copilot data visuals) in a custom editorial CSS design system. There is no UI framework or chart library.
- **Reproducibility.** The processed artefacts, trained sentiment model and database are all generated by documented commands; scikit-learn is pinned because the model is a pickle.
- **Testing.** An automated pytest suite (11 tests at the last run) covers the engine, API and calculations.
- **Optional LLM isolation.** Availability check, model preference list that skips non-chat models, and automatic fallback to deterministic explanations.
- **Documentation discipline.** A README in the hackathon's required structure, a design document, and an engineering log of real problems and fixes.

---

## AI / ML Components

- **Sentiment ensemble.** Combines a locally trained TF-IDF plus logistic regression classifier, a risk-specific lexicon, GDELT's own tone score, and optionally FinBERT (ProsusAI/finbert). Weights live in configuration.
- **Evaluation and an honest finding.** On held-out financial text, the local TF-IDF model scored about 0.74 accuracy (0.73 macro-F1), while zero-shot FinBERT scored about 0.56 (0.54). The project therefore made the lightweight model the default and FinBERT optional, which was a deliberate, evidence-based choice rather than assuming the bigger model wins.
- **Entity detection and linking.** A company gazetteer (about 100 US and 12 Indian companies) with aliases, cashtag and ticker patterns, and GDELT organisation tags, normalised to tickers and sectors.
- **Event classification.** 12 event classes from weighted keywords, CAMEO event codes and GKG themes, with a confidence cap when only a weak signal (CAMEO alone) is available.
- **Deterministic impact scoring.** Seven weighted factors, calibrated over a window, mapped onto 1 to 10 with a non-linear curve.
- **Local LLM copilot.** Ollama with a small open-weight model (phi4-mini), intent detection, and structured facts supplied as context. Prompting is designed so the model explains but never calculates.
- **Considered and rejected.** Learning per-asset sensitivities from data was explored and dropped as less transparent than explicit, configurable shock assumptions. This is a good example of choosing explainability over model complexity.

---

## Data Engineering / Data Science Components

- **Datasets.** GDELT 1.0 and 2.0 events plus GKG themes; FinancialPhraseBank; Reuters finance news; Indian financial news; finance tweets with sentiment; general tweets; S&P 500 daily prices for 2025; S&P 500 index history; Yahoo Finance prices, market caps and headlines. All are public, with sources and licences documented in `data/README.md`.
- **Pipeline.** Clean, de-duplicate, link entities, score sentiment, classify events, aggregate by source, score impact and generate signals into CSVs and SQLite. Stages are modular and individually testable.
- **Scale.** About 50,000 documents became about 5,300 structured risk signals, 19 of them rated high impact (median score 3.2, so a 7 or above is genuinely rare).
- **Handling messy data.** Headline recovery from article URL slugs; fingerprint de-duplication; CAMEO filtering; sampling large corpora with fixed seeds; a "replay" mechanism that places older corpora onto the live window while keeping their original dates, with the live-versus-replayed distinction stated openly.
- **Financial analytics.** Volatility, beta and a one-year covariance from market data; market-cap weighting with caps; bond duration and convexity; Black-Scholes Greeks; DV01 and CS01; stress curves and break-even search.
- **Synthetic data generation.** A seeded generator creates four portfolios with 155 positions across equities, Treasuries, corporate bonds, loans, options, swaps and CDS, with assumptions labelled.
- **Visualisation.** Risk-over-time lines, weight-change charts, loss-by-asset and sector breakdowns, severity curves and copilot fact charts.

---

## Product Thinking

- **Insight-first design.** The central insight, that event risk depends on exposure, is made visible by the "one event, four portfolios" view rather than being buried in a table.
- **Decision support, not data display.** The Rebalancer opens with a plain buy/sell list and reasons; the Stress Lab opens with one sentence stating the expected loss. Detail sits underneath for those who want to audit it.
- **Trust through explainability.** Factor breakdowns, source consensus, documented assumptions and honest labels ("simplified prototype", "mock portfolios", "replayed data") are product choices aimed at institutional users who must defend decisions.
- **Reducing friction.** No keys, no login, offline-first, one-command start, and an auto-created database. Judges or users can run it immediately.
- **Accessibility of jargon.** Helper text under metrics explains terms in one or two lines, driven by user feedback that a CS reader found the finance language hard.
- **Iterating on feedback.** The Rebalancer and Stress Lab were each redesigned after the first version proved hard to read at a glance; the copilot moved from a plain text box to a chat with visual evidence.
- **Right-sizing AI.** Using an LLM only where language helps (explanation) and keeping calculations deterministic is a deliberate product and risk decision.
- **Scope judgement.** Delivered both downstream modules, but dropped a learned-sensitivity model in favour of transparent rules, and dropped the PDF deck to keep a single editable PowerPoint.
- **Live versus stable.** The dashboard uses live-only data for freshness, while a 10-day comparison gives context.
- **Design language.** Editorial, light, ivory-and-ink financial-publication aesthetic rather than a generic dashboard, chosen to suit the audience.

---

## Technologies Used

**Languages:** Python 3.10, JavaScript (JSX), CSS, SQL

**Backend:** FastAPI, Uvicorn, Pydantic, SQLite, httpx

**Frontend:** React 18, Vite, hash routing, custom SVG charts, custom CSS design system

**Data / ML:** pandas, NumPy, SciPy, scikit-learn (TF-IDF, logistic regression), joblib, openpyxl, FinBERT via Hugging Face Transformers and PyTorch (optional)

**AI / LLM:** Ollama, phi4-mini (local, optional), deterministic template fallback

**Data sources / APIs:** GDELT events and GKG, Yahoo Finance via yfinance, public Hugging Face and Kaggle datasets

**Testing and tooling:** pytest, Git and GitHub, Mermaid for diagrams, python-pptx for the deck

---

## Skills Demonstrated

- Full-stack development (React and FastAPI)
- Backend engineering and service-oriented design
- REST API design with typed schemas
- NLP engineering (entity linking, sentiment, event classification)
- Machine learning model training and evaluation
- Feature engineering and explainable scoring design
- Data pipeline engineering and data cleaning at scale
- Quantitative finance fundamentals (duration, convexity, Greeks, DV01, CS01, covariance, stress testing)
- Applied financial risk modelling
- LLM integration with grounding and graceful fallback
- Prompt and context design
- Real-time data integration and background job design
- Caching, atomic data swaps and cache invalidation
- Database design (SQLite)
- Data visualisation and custom charting
- UX and information design for non-expert readers
- Product thinking and prioritisation
- Technical writing and documentation
- Testing and reproducibility
- Debugging real-world integration problems and recording the learnings

---

## Resume Impact

- Built **Meridian**, a risk intelligence platform that converts live GDELT news, financial news and social text into explainable 1-to-10 risk signals, processing about 50,000 documents into about 5,300 structured signals.
- Designed a deterministic, seven-factor impact-scoring model (severity, sentiment strength, confidence, relevance, source consensus, volatility, novelty) with per-factor explanations, replacing sentiment-only risk heuristics.
- Developed an NLP pipeline combining a locally trained TF-IDF classifier, lexicon, GDELT tone and optional FinBERT; found the lightweight model outperformed zero-shot FinBERT on held-out data (0.74 versus 0.56 accuracy) and made it the default.
- Implemented a tactical rebalancing engine that turns risk signals into constrained weight changes (weight bounds, sector cap, turnover limit) with plain-language reasons, using live market-cap weights.
- Built a stress-testing engine that reprices equities, bonds, loans, options, swaps and CDS across 4 synthetic portfolios (155 positions), including severity curves and break-even analysis driven by configurable event-to-shock assumptions.
- Engineered a self-refreshing live data layer (GDELT 15-minute files, GKG, Yahoo Finance) with atomic database swaps, cache invalidation and offline fallback, so the app works with no API keys.
- Integrated an optional local LLM copilot (Ollama, phi4-mini) that explains backend-computed facts with chart evidence and falls back to deterministic answers when unavailable.
- Developed a React 18 and Vite frontend with hand-built SVG charts and an editorial design system, and enforced a rule that the UI renders results without recomputing financial logic.
- Wrote an automated test suite and complete project documentation, including a design document and an engineering problem log.

---

## Ideal Roles

- AI Engineer / Applied AI Engineer
- NLP Engineer
- Machine Learning Engineer
- Data Scientist
- Data Analyst (financial or risk analytics)
- Full Stack Engineer
- Backend Engineer
- Software Engineer
- Product Engineer
- FinTech / Quantitative Engineering roles
- Technical Product Manager
- Product Manager (data, AI and fintech products)

---

## Portfolio Tags

`FastAPI` `React` `Python` `NLP` `Sentiment Analysis` `FinBERT` `scikit-learn` `GDELT` `Risk Analytics` `FinTech` `Stress Testing` `Portfolio Optimization` `Data Pipelines` `Ollama` `Local LLM` `Explainable AI` `SQLite` `Real-time Data` `Data Visualization` `Product Thinking`

---

## One-line Portfolio Summary

An explainable, live news-to-risk engine that turns global headlines into 1-to-10 risk signals, rebalancing trades and portfolio stress-test losses, with an optional local AI copilot.

---

## Key Numbers Cheat Sheet

Measured from the project's own result files and services on **10 Oct 2026**. Pipeline and model figures change only when the pipeline is rerun; rebalancer and stress figures move with live data, so quote them as "on the day I measured".

**Risk Engine (pipeline run)**
| Metric | Value |
|---|---|
| Documents processed | 50,153 |
| Structured risk signals | 5,345 |
| High-impact signals (score 7 or more) | 19 |
| Impact score distribution | median 3.24, 90th percentile 5.15, 99th percentile 6.53 (so a 7+ is genuinely rare) |
| Event classes | 12 (largest: Geopolitical 1,688; Macroeconomic 1,061; Regulatory 812) |
| Impact factors | 7 |
| Date span | 27 Sep to 10 Oct 2026 |
| Sentiment backend used in the run | FinBERT (cached) in the ensemble |

**Sentiment model evaluation (held-out)**
| Metric | Value |
|---|---|
| Training rows / held-out rows | 42,349 / 8,588 |
| Local TF-IDF + logistic regression | accuracy 0.741, macro-F1 0.732 |
| On finance tweets only | accuracy 0.746, macro-F1 0.728 |
| On FinancialPhraseBank only | accuracy 0.700, macro-F1 0.622 |
| Lexicon alone | accuracy 0.292 (why an ensemble was needed) |
| Zero-shot FinBERT (1,970 held-out rows) | accuracy 0.560, macro-F1 0.535 |

**Tactical Rebalancer (as of 10 Oct 2026, 15-stock index)**
| Metric | Value |
|---|---|
| Constraints | weight 1% to 15%, sector cap 40%, turnover cap 10%, weights sum to 100% |
| Turnover | unconstrained plan 10.8%, scaled back to the 10% cap (step scale 0.925) |
| Estimated portfolio volatility | 15.7% before, 14.2% after |
| Concentration (HHI) | 0.0958 before, 0.0914 after |
| Weighted sentiment of the index | -0.069 before, -0.058 after |
| Signal half-life / lookback | 2 days / 5 days |

**Strategic Stress Lab (same event on all four portfolios)**
Event: "Houthis attack Saudi airport", Geopolitical, impact 5.38, sentiment -0.51.
| Portfolio | Value before | Loss | % impact | Main driver |
|---|---|---|---|---|
| Global Growth Fund | $2.51B | $163.1M | -6.50% | Equity price shock |
| Balanced Institutional Fund | $3.22B | $46.5M | -1.45% | Equity price shock |
| Wholesale Bank Portfolio | $5.66B | $29.0M | -0.51% | Credit-spread widening |
| Conservative Allocation | $1.24B | $2.9M | -0.23% | Credit-spread widening |

The takeaway to remember: the same event costs 6.5% on the growth fund and 0.23% on the conservative one, roughly a 28x spread, and even the main loss driver differs by portfolio.

**Data and scale**
| Metric | Value |
|---|---|
| Synthetic portfolios / positions | 4 / 155 (35, 43, 44 and 33) |
| Asset types repriced | equities, Treasuries and corporate bonds, loans, options, swaps, CDS |
| Companies in the gazetteer | about 100 US and 12 Indian |
| Live refresh interval | 15 minutes |
| Automated tests | 11, all passing |
| Cost to run | no API keys, no login, no paid services |

---

## Interview Prep Notes

Use these when revising for different roles.

**Likely questions and the honest answers**
- *Why not just use an LLM?* Risk numbers must be reproducible and auditable. The LLM only rephrases backend-computed facts, so it cannot invent a loss or a weight, and the app works without it.
- *Why did the small model beat FinBERT?* FinBERT was run zero-shot while the TF-IDF model was trained on in-domain financial text and tweets. The result is reported as measured, and FinBERT stays as an optional backend.
- *How do you avoid "negative sentiment equals high risk"?* The score blends seven factors; sentiment strength is only one of them, and event severity, source agreement, volatility and novelty matter too.
- *Why does a stock gain weight on negative news?* Weights must total 100%. The score is relative to the index average, so a stock holding up better than its peers can gain weight.
- *How is the stress test validated?* It is not a regulatory model. It is a simplified methodology with explicit, configurable shock assumptions and a documented scaling by impact score, with tests on the calculations.
- *What would you do next?* Calibrate shocks against historical event studies, evaluate event classification against labelled data, add backtesting of the rebalancer, and deploy as a single container.
- *What was hardest?* Keeping live and replayed data from being mixed in the dashboard, stale caches after refreshes, and choosing a working Ollama chat model automatically.

**Honest limitations to state confidently**
- Portfolios are synthetic, and ratings, default probabilities and notionals are illustrative.
- Older news corpora and tweets are replayed onto the live window; only GDELT, GKG and Yahoo data are truly live.
- The event classifier and sentiment model have not been validated against a labelled GDELT ground truth beyond the held-out text evaluation.
- The stress model is a prototype, not a production or regulatory methodology.

**Angles by role**
- *Product / TPM:* user feedback loops, trust through explainability, scope trade-offs, one-insight-per-screen design.
- *AI / ML / NLP:* ensemble design, evaluation results, grounding the LLM, rejecting a learned-sensitivity model for transparency.
- *SWE / Backend:* service boundaries, background refresh, atomic swaps, cache invalidation, offline-first resilience.
- *Data Science / Analyst:* messy data handling, de-duplication, calibration, covariance and volatility features, financial metrics.

---

## Repository Evidence

- `README.md` and `design.md`: product scope, pipeline stages, methodology and decisions
- `requirements.txt`: Python dependencies and the pinned model-compatible scikit-learn
- `src/risk_engine/`: ingestion, entity, sentiment, event classification, scoring and signal generation
- `src/modules/rebalancer/` and `src/modules/stress_testing/`: the two downstream engines
- `src/backend/`: FastAPI routes, Pydantic schemas, services (signals, portfolio, rebalance, stress, market, refresh, copilot, LLM)
- `src/data_prep/`: GDELT, GKG and Yahoo Finance fetchers and the portfolio generator
- `src/frontend/`: React pages (Overview, Signals, Rebalancer, Stress Lab, Copilot), SVG chart components and the custom stylesheet
- `data/config/`: event taxonomy, GKG theme mapping, engine settings and stress scenarios
- `data/processed/`: pipeline summary and sentiment evaluation results (source of the figures quoted above)
- `data/portfolios/`: the four synthetic portfolios and mock index
- `tests/`: automated test suite
- `docs/`: architecture image, screenshots and presentation deck

github: https://github.com/pavithra2870/VIT-Pavithra-SP-Hackathon
live demo: https://vimeo.com/1234679155?fl=ip&fe=ec