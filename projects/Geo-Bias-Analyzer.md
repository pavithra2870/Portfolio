# GEO Research: interview, resume and portfolio brief

- Repository: https://github.com/pavithra2870/GEO-Bias-Analyzer
- Results site: https://pavithra2870.github.io/GEO-Bias-Analyzer/

Every number below is measured in the results or the code. Where I could not verify something, I left it out.

## 1. The project in one minute

I audited which brands AI assistants recommend. I asked 14 language models from 12 labs about 1,080 questions each, in three markets (CRM software, ecommerce platforms, personal finance apps). That gave 15,104 usable answers and 70,552 brand mentions, which I merged into 3,188 brands and checked one by one for whether the product is still offered.

Headline results:
- A few brands win. In CRM the top 10 brands take 82% of mentions (Zoho 17.8%). Ecommerce needs 23 brands to reach 80%, personal finance 52.
- Which model you ask matters more than how you ask. The model explains 18% to 27% of which brand comes first. Rewording explains under 0.5%.
- 8.4% of mentions go to a retired product (shut down, renamed or folded into another), 10.9% if I count Magento's partly renamed edition. Mint is named 3,086 times.
- Established companies get 69.9% of mentions and 80.8% of first places.
- A classifier names the writing model correctly 71% of the time out of 14 (guessing gives 7%).
- Wikipedia fame, brand age and size do not predict how often a brand is recommended on brands the model has not seen.

## 2. Elevator pitches

**30 seconds.** People now ask chatbots what software to buy. I measured who the chatbots name. I asked 14 models about 15,000 questions across CRM, ecommerce and personal finance, matched the 70,552 brand mentions into 3,188 brands and checked each against public records. The results: a few brands take most of the mentions, the model matters more than the wording, about one mention in ten points to a product that has been retired, and big established companies get about 70%.

**2 minutes.** The question was whether language models favour established brands when they recommend products. I built a pipeline that can be stopped and restarted at any time: every call has a fixed ID, every answer is saved the moment it arrives, and raw text is never edited. I ran 14 models across three channels at once: three on a laptop, seven on free Kaggle GPUs and four through cloud APIs.

The hard part was not asking, it was matching. Models write one brand many ways, so I built four matching layers and an evidence ladder (website check, Wikidata and App Store records, a blind web search, a human decision) to say whether each brand is real, renamed or retired. Then I measured concentration, what drives the first pick, agreement between models, stale knowledge, incumbent share and fame. I also used machine learning for explanation: a classifier that recognises which model wrote an answer, and surrogate models that predict each model's first pick from the question alone. Some results were negative, and I report them: fame does not explain who gets recommended.

## 3. The problem and how it was modelled

**Setup.** 648 questions = 3 markets x 4 buying stages x 3 personas (student, early-stage founder, enterprise CTO) x 3 countries (global, India, USA) x 2 framings (neutral, quality-focused) x 3 wordings. Each model answers each question about 1.7 times on average (about 1,080 answers per model), at temperature 0.7 so repeats can differ. Each answer asks for up to five brands as compact JSON with company, product, website and a short reason.

**Key rules.**
- Plan first: the full to-do list is stored before any call, so a run only does what is pending.
- The answer ID is a hash of question, model, sample number and generation settings, so old and new answers can never mix.
- Each answer is saved in one transaction with its raw text, so parsing can be redone without asking again.
- One database per channel, because the engine allows one writer per file. A repeatable merge by answer ID combines them.
- The prompt text is frozen after a pilot.
- Every brand status carries evidence; every ML score is on questions the model never saw.

**Architecture, as a flow.**
Questions -> 14 models over 3 parallel channels -> per-channel database -> merge by answer ID -> parse and repair JSON -> four matching layers (clean name, group by website, same name and site, reviewed merges) -> verification ladder -> company facts and incumbent flag -> statistics and ML -> shareable tables, charts and a results page.

## 4. Methods compared, and why

| Choice | Compared | What I found | Why I chose it |
|---|---|---|---|
| Fingerprint classifier | Gradient-boosted trees vs logistic regression vs guessing | 71.0% vs 67.3% vs 7.1% | Boosted trees were best; logistic confirms the signal is not a tree artefact |
| Fingerprint inputs | Brands only vs writing style only vs both | 65.9% vs 25.9% vs 71.0% | Both carry signal; brands matter most |
| Surrogate model | Guess the category's usual brand vs depth-3 tree vs depth-5 tree vs boosted trees | 54.6% vs 63.2% vs 69.9% vs 72.8% (mean over 14 models) | Depth-3 tree is readable, boosted trees show how far the prompt alone can go |
| Company facts | Wikidata vs web search vs search-derived parents | Wikidata gave a founding year for 45 of the top 100 brands; web search for 199 of the top 200; search parents were wrong too often to use | Used web search for year, staff and listing; parents come from a short curated list |
| Matching external records | By name vs by official website | Names link Mint to a herb | Accept a Wikidata item only if its website matches the brand's |
| Staleness check | Website check vs dated current-status check | 0.9% vs 8.4% of mentions | Status check; a live site is not proof the product is offered |
| Incumbent rule | 1, 2 or 3 of 4 criteria; founded by 2010, 2013, 2015 | 92.7%, 69.9%, 47.5%; 69.6%, 69.9%, 72.0% of mentions | At least 2 of 4 and 2013, because one criterion separates nothing and the cutoff barely matters |
| Fame test | Pooled over markets vs within each market | Pooled mixed unrelated brands (Apple in a CRM comparison) | Compare brands only within their market |

## 5. Results

**How it was tested.** Intervals on concentration come from resampling prompts, not mentions. Driver effects use chance-corrected mutual information with a permutation test. Proportions have Wilson intervals. The incumbent test uses a binomial model with errors clustered by prompt. All ML scores use cross-validation grouped by prompt. Brand matching was scored on 170 hand-labelled pairs, drawn blind from hard, close-looking cases.

**Concentration.**

| Market | Top-10 share | Brands for 80% | Top brand |
|---|---|---|---|
| CRM | 82.2% | 10 | Zoho 17.8% |
| Ecommerce | 66.3% | 23 | Shopify 17.4% |
| Personal finance | 54.6% | 52 | YNAB 15.5% |

**What drives which brand comes first** (share of uncertainty explained):

| Factor | CRM | Ecommerce | Personal finance |
|---|---|---|---|
| Model | 17.9% | 18.4% | 26.9% |
| Persona | 9.3% | 9.3% | 2.5% |
| Buying stage | 7.5% | 8.5% | 4.5% |
| Country | 6.1% | 6.8% | 7.9% |
| Quality vs neutral | 0.8% | 0.8% | 1.0% |
| Rewording | 0.3% | 0.4% | 0.1% |

**Other results.** Two models share 36% of their top-40 brands on average; 20 brands are in ten or more models' lists and 77 in just one. Two answers to the same question overlap 0.54, against 0.31 across questions. For India questions in personal finance, 13.3% of mentions go to .in sites, against 0.2% for global questions. 95.2% of mentions point to real, active brands.

**What the overall numbers hide.**
- The 8.4% stale figure is 0.6% in CRM, 7% to 9% in ecommerce and 18% to 28% in personal finance. By model it runs from 1.4% (Gemini 3.1 Flash-Lite) to about 19% (OLMo 2 1B).
- The 70% incumbent share runs from 50% (Gemini) to 84% (OLMo 2 1B). Enterprise-CTO questions get 75.7%, student questions 65.8%, the "alternatives" stage 56.8%, and quality framing lowers it from 72.8% to 66.9%.
- The 71% fingerprint accuracy ranges from 91% (Gemini) to 55% (Nemotron). The two OLMo 2 sizes are mistaken for each other 7% to 10% of the time.
- Fame: rank correlation with mentions is +0.41 in CRM, +0.29 in ecommerce and -0.25 in personal finance. Age and size show nothing. Held-out R-squared is at or below zero for every combination (category alone -0.007, everything -0.045).
- Brand-matching accuracy: merged pairs are truly the same 78 of 88 times (88.6%, interval 80% to 94%); look-alikes kept apart are truly different 66 of 82 times (80.5%, 71% to 88%). The sample is hard on purpose, so these understate accuracy over mentions.

**Ablations and robustness.**
- Drop-one-factor on the surrogate: removing category costs about 64 points of accuracy, persona 16, stage 12, locality 10, framing 4. Rewording also costs 4, which is the noise level.
- Robustness: without unverified brands, with only confirmed-real brands, or with products rolled up to their parent (Mint as Intuit), the top-10 share stays between 67.7% and 70.8%, stale share between 10.1% and 11.1%, model overlap at 0.36 to 0.37 and incumbent share between 69.8% and 70.5%.
- Model age: models released later recommend fewer retired names (rank correlation -0.63, p = 0.02, 13 models). With only 6 published training cutoffs, the same test is not significant (-0.62, p = 0.19).
- Surrogate ceiling: predicting each answer from the same model's other answers to the same question gives 74.9%; the boosted-tree surrogate reaches 72.8% of that.

## 6. Key decisions and the trade-off of each

1. **Deterministic call IDs and plan-first.** Safe to stop and restart, no duplicates. Cost: more design work up front, and any change to settings creates new calls.
2. **Raw answers never edited.** Any matching mistake is fixed in seconds. Cost: more tables and a rebuild step.
3. **One database per channel.** The three channels run at once. Cost: a merge step.
4. **Frozen prompt after the pilot.** Answers stay comparable. Cost: no chance to improve the wording.
5. **Compact single-line JSON.** Valid answers rose from 49% to 95% for the weakest local model. Cost: short reasons.
6. **Accept external records only on a website match.** No false links. Cost: low coverage (258 of 669 checked brands linked to Wikidata).
7. **Incumbent = at least 2 of 4 criteria, founded by 2013.** A usable split. Cost: thresholds are my choice, so I report the alternatives.
8. **Owner list curated by hand.** Search-derived parents were unreliable. Cost: it is short and I wrote it from general knowledge.
9. **Dropped Gemini 2.5 Flash.** It covered one market only, so it could not be compared. Cost: one fewer model.
10. **Reported the negative fame result** instead of searching for a model that "works".
11. **No deep learning.** The data is 15,000 tabular answers; trees fit it. Cost: nothing to show on that front, and I say so.

## 7. Problems found and what they taught me

1. **A third of the answers failed to parse.** After the first big Kaggle import, 1,480 of 4,320 answers were rejected. I read a sample and found every rejection was a consistent slip: an extra list around the answer, a stray quote, trailing braces. I wrote a fallback parser that only runs when the normal parse fails. Usable answers rose to about 4,263 of 4,320 (98.7%) with no new GPU time. Lesson: read the rejects before re-running anything.
2. **Wikidata rate-limited me.** The first full lookup pass lost 388 of 630 brands to HTTP 429. The throttle waited once per brand, but each brand made 3 to 5 requests. I throttled every request, ran one worker at one request per second, and stopped saving rate-limit errors as "no data" (only a real 404 counts). Lesson: throttle requests, not items, and never store a failure as an answer.
3. **My first staleness number was wrong by a factor of ten.** Website checks said Mint and Personal Capital were live, so only 0.9% of mentions looked stale. A dated status check of the 80 most-mentioned brands gave 8.4%. Later I also overstated Mint: its address still loads and tells visitors it moved to Credit Karma, so the product retired but the brand did not vanish. I now say "retired product" and record what changed. Lesson: a live site proves little, and wording matters.
4. **I read a product rename as a company rename.** A search answer said Oracle was renamed; only its CRM line was. That added 1.5 points to staleness until I caught it. Lesson: status checks must say what changed.
5. **Looking at the sample before labelling paid off.** "Commerce Layer" and "CommerceLayer" were kept apart. Ignoring spacing merged 27 more brands (3,228 to 3,201) and I redrew the sample. A separate bug sent a mention named Mint to Intuit because its website outranked its name. Lesson: inspect before you measure.
6. **A review list that was too long.** Flagging every brand seen under several websites gave 480 review items, almost all correct merges of typo sites. Requiring the extra sites to hold at least 15% of the brand and 20 mentions cut it to 30. Lesson: design the human step so a human can finish it.
7. **A 4-minute step took 3 seconds.** The first grouping run spent 99% of its time binding about 690,000 values one at a time into the database. Writing rows to a temporary file and loading them in one bulk step fixed it. Lesson: profile before optimising, and load big writes from a file.
8. **My ML ceiling was wrong twice.** The first ceiling was how often a model repeats itself, which some surrogates beat. The second counted each answer as predicting itself and gave 90%. The fair version predicts each answer from the model's other answers to the same question (74.9%). Lesson: an upper bound must be checked as hard as the result.
9. **Signatures made of absent brands.** My first table of what gives each model away listed brands the model never writes, because absence also pushes towards a model. I counted only brands actually listed, with at least 8 examples. The standard SHAP package could not read the multi-class boosted trees, so I used the library's built-in exact tree explanations. Lesson: look at the explainer output, not only the score.
10. **My first project's headline was an artefact.** The earlier version reported a strong model of what makes a brand recommended, but 888 of its 899 brands were recommended ones and only 11 were not. It only separated a tiny odd group. That is why I rebuilt the study. Lesson: check what the model was never shown.
11. **Free infrastructure kept breaking.** Kaggle downloads died with "read-only file system", first on the fifth model and later on the second; the only fix was one model per fresh session. Reasoning models spent their whole token budget thinking and returned nothing; switching thinking off got valid answers in about 3 to 6 seconds. Catalogue models that were listed were not served, and a model I paid attention to covered only one market. Lesson: test one call per model before planning a run.

## 8. Resume bullets, portfolio blurb, skills

**ML and AI flavour**
- Audited 14 LLMs across 70,552 brand mentions; showed the model explains 18% to 27% of which brand is recommended while question wording explains under 0.5%.
- Built a model-fingerprinting classifier (71% accuracy over 14 classes, 7% chance) and surrogate models with grouped cross-validation, using exact tree explanations to show what gives each model away.
- Quantified stale knowledge: 8.4% of recommendations go to retired products, ranging from 1.4% to about 19% by model.

**Data and analytics flavour**
- Resolved 70,552 raw brand mentions into 3,188 brands with four matching layers and an evidence ladder, then checked each against public records and a blind web search.
- Measured concentration, agreement and incumbent bias with bootstrap intervals, permutation tests and clustered regression; found incumbents get 70% of mentions.
- Reported negative results with held-out tests: fame, age and size did not predict recommendations.

**Systems and engineering flavour**
- Built a resumable audit pipeline (fixed call IDs, atomic saves, one database per channel, merge by ID) that ran 14 models across a laptop, free GPUs and cloud APIs.
- Recovered 98.7% of answers from parser rejections without new compute by adding a fallback JSON repair, and removed a 4-minute bulk write by loading from a file in about 3 seconds.
- Wrote 79 automated tests, generated architecture diagrams from code, and packaged a documented dataset and results dashboard.

**Portfolio blurb.** I asked 14 AI models which CRM, ecommerce and money apps to buy, 15,000 times, and tracked every brand they named. I built a resumable collection pipeline, matched 70,552 mentions into 3,188 brands, checked which products are still offered, and measured concentration, stale knowledge, incumbent bias and model fingerprints. The model matters more than the wording, about one mention in ten goes to a retired product, and established companies take about 70%. The write-up includes the failures.

**Skills to list.** Python, SQL and DuckDB, pandas, NumPy, SciPy, statsmodels, scikit-learn, XGBoost, SHAP-style tree explanations, NetworkX, matplotlib, Ollama, Hugging Face Transformers and vLLM (Kaggle notebook), REST APIs (Wikidata, Wikipedia, Exa and three LLM providers), pytest, HTML, JavaScript and SVG.

## 9. Interview question bank

**What was the main finding?** The model you ask matters more than how you ask, a few brands take most of the mentions, and about one mention in ten goes to a retired product.

**Why this design?** I had free or cheap compute and one researcher, so reliability came first: fixed IDs, saved answers and raw text kept meant any failure was a restart, not a redo.

**Tell me about a mistake.** My first staleness figure was 0.9%, because I trusted that websites were live. A status check showed 8.4%. Later I overstated Mint by calling it shut down, when its address still loads and points to Credit Karma. I fixed the number, then fixed the wording to "retired product", and recorded what changed.

**What would you do differently?** Plan the brand matching before the prompting, since matching took most of the project, and check status from the start, not after the first analysis.

**How do you know the brand matching is good?** I hand-labelled 170 pairs blind: merges were right 88.6% of the time and kept-apart look-alikes were right 80.5%. The sample is deliberately hard, so real accuracy over mentions is higher, but I only claim what I measured.

**How do you avoid leakage in the ML?** Every score is on questions the model never saw, with folds grouped by question, because answers to the same question are near-copies.

**Is the 71% fingerprint accuracy impressive?** Against 7% for guessing it is a real signal. Brands carry most of it (66%), style alone gives 26%. It does not mean the models are very different: Gemini and MiniMax are confused with each other more than with any other model.

**Why no deep learning?** The data is 15,000 tabular answers and 14 classes; trees fit it and are explainable. A neural network would add decoration, not a finding.

**What does 70% incumbent share mean?** Established companies get most mentions, but it depends on my definition (any one criterion gives 93%, three give 48%). I report all of them and the ranking of models barely changes.

**Does model size matter?** I could not show it: with 12 sized models, neither concentration nor diversity depends on size by a significant margin.

**What did not work?** Fame did not predict recommendations. Search-derived parent companies were too noisy to use. Gemini 2.5 Flash could not be compared. The first ML ceiling and signatures were wrong.

**Why is "no evidence" not the same as "fake"?** A quarter of a random sample of obscure brands with no search hits turned out to be real, so I never call a brand invented without evidence.

**What are the most interesting things you learned?**
- Matching, not prompting, was the hard part of the project.
- A live website is weak evidence that a product still exists: Mint still has a page, but the app is gone.
- People with a browser beat two search tools on the hard cases, such as a one-letter misspelling of Budgetista.
- A fix can create a new error: one product rename read as a company rename inflated staleness by 1.5 points.
- Free tiers are not infrastructure: providers withdrew access and listed models they did not serve.
- Keep negative results: "fame does not explain it" is a finding.

**Can you reproduce it?** Yes. One command rebuilds the tables and charts from the stored answers, and 79 tests cover the planner, parser, matcher, verification, statistics and ML helpers.

## 10. Limitations and next steps

- API answers are not what chat apps show: apps add web search, memory and a system prompt.
- Staleness is measured against today, not each model's training date.
- Company facts cover the top 200 brands (about 93% of mentions). Employee counts are rough, and the owner list is short and curated.
- About 1,200 brands, mostly mentioned once or twice, have no evidence either way.
- The model-age result rests on release dates for 13 models and published cutoffs for 6, so it is exploratory.
- 15,104 of 15,120 planned calls produced usable answers.
- Three markets, English questions and one run per setting at temperature 0.7.
- Not done: name-swap, fictional-brand and web-search-versus-memory experiments (designed, not run), and training-data exposure counts for the open-data models.

## 11. Quick facts and glossary

**Quick facts**
- 14 models, 12 labs; 3 on a laptop, 7 on Kaggle GPUs, 4 through cloud APIs.
- 648 questions; about 1,080 answers per model; 15,104 usable answers; 70,552 brand mentions.
- 3,201 distinct brands became 3,188 after 37 reviewed merges.
- 95.2% of mentions point to real, active brands; 2.2% could not be verified; 1.4% retired or renamed.
- 8.4% of mentions go to a retired product (10.9% with Magento).
- Incumbents: 137 of 358 flagged brands; 69.9% of mentions; coverage 92.6% of mentions.
- Fingerprint: 71.0% accuracy, 90.4% top-3. Surrogate: 72.8% on unseen questions, ceiling 74.9%.
- 79 tests pass.

**Glossary**
- **Share of Model:** the share of answers (or mentions) that name a brand.
- **Mention:** one brand named in one answer.
- **Incumbent:** a brand meeting at least 2 of: founded by 2013, 1,000+ staff, publicly listed, owned by a larger company.
- **Retired product:** shut down, renamed or folded into another product.
- **Concentration index (HHI):** the sum of squared shares; higher means fewer brands dominate.
- **Mutual information (chance-corrected):** how much knowing a factor reduces uncertainty about the first-place brand.
- **Overlap (Jaccard):** shared brands divided by all brands in two lists.
- **Wilson interval:** a confidence interval for a proportion.
- **Surrogate model:** a simple model trained to imitate a more complex one.
- **Fingerprint:** a model's recognisable pattern of brands and style.
- **Grouped cross-validation:** folds that keep all answers to one question together.
- **TreeSHAP:** exact per-feature contributions for tree models.
- **Entity resolution:** deciding which names refer to the same real thing.
