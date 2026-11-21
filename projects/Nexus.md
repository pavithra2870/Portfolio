# NEXUS — project brief

Every number below comes from a stored evaluation result, the test run, or the code. Where a number comes from an earlier development run rather than a stored result, I say so.

---

## 1. The project in one minute

NEXUS is a local-first document intelligence platform. I built it as a refactor of an older project of mine that had twelve modules, several of which were thin wrappers around an LLM and none of which was measured. I cut it to seven modules that can be measured, put all retrieval behind one hybrid pipeline, and built an evaluation harness and a test suite around it. Later I moved three of the seven (market intel, customer reviews, trends) into a separate project, because they work on noisy public web text rather than documents you own, and kept the four that share one idea: answer from a document, then check the answer against it.

The four modules: knowledge RAG, knowledge graph, due-diligence PDF analysis, and compliance checking (GDPR Article 13 and CCPA, rebuilt after the first version failed on real policies). There is a React front end with six pages, one of which shows the evaluation results and can run them.

Headline results (all CPU-only, local models):

- Retrieval on SQuAD v2 (300 questions, 1,204 paragraphs): recall@5 0.98, MRR@10 0.937.
- Retrieval on GDPR questions (300 questions, 99 articles): article hit@5 0.953, MRR@10 0.874.
- Refusing out-of-corpus questions: AUROC 0.996.
- Compliance on 11 real privacy policies (296 labelled cells): precision 0.97, recall 0.92; on the 4 policies added after the prompts were frozen, precision 0.99 and recall 0.91.
- Annual-report questions (UDA TatHybrid, 303 questions): 41.7 against 43.5 for GPT-4-Turbo in the paper.
- Due diligence on four real annual reports: 20 of 20 key figures correct, every claim checked against a quote.
- 346 automated tests, 9 evaluation suites.

---

## 2. Elevator pitches

**30 seconds**

I built a document intelligence tool that runs on a laptop. You index your own documents and ask questions; it answers with numbered citations and refuses when the documents don't contain the answer. The same retrieval pipeline powers a due-diligence analyser that checks every figure against the filing, a knowledge graph and a compliance checker. What I care about most is that every module is benchmarked: on SQuAD v2 it finds the right paragraph in the top five 98% of the time, and it refuses out-of-corpus questions with an AUROC of 0.996.

**2 minutes**

The starting point was an older project of mine with twelve "agents". When I reviewed it honestly, several were prompts around a language model with nothing to measure, there were four different retrieval implementations, and there were no tests. So I cut it down to seven modules where I could produce a number, and later kept the four that are about documents.

The core is one retrieval pipeline: BM25 and dense vectors fused with reciprocal rank fusion, then reranked with a cross-encoder. RAG, due diligence and the compliance checker's targeted search all use it. On top of it, RAG answers with numbered citations and refuses when the best rerank score is too low, without calling the language model.

For compliance I first used natural-language inference on single sentences. It scored well on short test snippets and found none of its flagged violations real on real policies, so I rebuilt it: a hosted model reads the whole policy and must quote the passage that proves each GDPR Article 13 and CCPA item, and code checks the quote and has it judged twice. The knowledge graph extracts subject-predicate-object triples with evidence sentences, merges aliases, and supports search and shortest-path queries.

I built an evaluation harness with nine suites, using public benchmarks where they exist (SQuAD v2) and labelled or synthetic sets otherwise. Evaluating it found real bugs: a spaCy configuration that silently broke every NLP step, a due-diligence pipeline that got 1 of 15 headline figures right on real filings, and an evaluation metric that was wrong by a factor of ten. The results are visible in the app.

---

## 3. The problem and how it was modelled

**Problem.** Analysts and consultants need to extract answers and signals from documents. Cloud tools raise privacy concerns for sensitive documents, and generic chatbots give answers with no evidence and no measured accuracy.

**Setup.** The retrieval models, NLI and parser run locally on CPU: sentence-transformer encoder (MiniLM-L6), an MS MARCO cross-encoder for reranking, a DeBERTa-v3-small NLI model, spaCy for parsing, and a language model: Ollama-served gemma3:4b locally, plus a hosted model of about 30B that the document chat, due diligence and compliance can use (chosen per feature in configuration). Model names and sampling settings are configuration, not code.

**Key rules.**
- Retrieval is one code path. Evaluation modes (BM25 only, dense only, hybrid, hybrid plus rerank) use the same code as production.
- The language model never decides facts unchecked. In the graph, deterministic extraction produces the findings. In due diligence and compliance the model proposes answers, but each must carry a quote that is found in the document, and the summary, verdict and statuses are built by code.
- Answers must cite numbered passages; if the top rerank score is below a threshold, the system refuses without calling the model.
- A compliance answer counts only if its quote is found in the policy and two separate checks accept it; if they disagree it is marked for review, not guessed.

**Flow.**
```
Documents -> sentence-aware chunks (120 words, 20 overlap)
          -> dense (FAISS) + BM25 -> RRF (k=60) -> cross-encoder rerank (top 20)
          -> abstention gate -> numbered-passage prompt -> local LLM
          -> answer + citations (cited passages highlighted)

Policy text -> first read by a hosted model: status + quote per item
            -> quote found in the policy? two separate support checks
            -> not verified: search the policy for the item, ask again
            -> disclosed / needs review / not found, each with its quote
```

---

## 4. Methods compared, and why

**Retrieval (measured on two benchmarks).** I compared BM25, dense, hybrid with RRF, and hybrid with a cross-encoder rerank, all through the same code. Reranking was the only stage that clearly improved results; fusion beat dense but only matched BM25.

**Compliance.** The first version scored single policy sentences with NLI against a rule. It looked good on short snippets and failed on real policies. The rebuilt version asks, per required item, whether the policy states it and makes the model quote the passage; code checks the quote exists, two differently worded model questions judge whether the passage by itself states the item, and anything not verified is searched for again from retrieved passages. I tested NLI as the support check and dropped it: it flagged 31 of 74 correct quotes and accepted a wrong one at 0.99.

**Knowledge graph.** Rule-based dependency extraction (active, passive with agent, apposition, prepositional objects, conjunctions, simple pronoun resolution) rather than prompting a language model per entity pair. It is deterministic, fast, and scorable against labelled triples.

**Due diligence.** Index the filing by section, search per topic, make the model quote the filing for every claim, and check the quote and its figures against the text. The first version sent only the first four chunks (about 4% of each filing) to the model and got 1 of 15 headline figures right; the rebuilt one gets 20 of 20 on four filings.

**Retrieval models.** MiniLM-L6 encoder and an MS MARCO MiniLM cross-encoder, chosen because they run on CPU. I did not compare other encoders.

---

## 5. Results

### How it was tested
- Retrieval: SQuAD v2 dev (300 sampled answerable questions against all 1,204 paragraphs) and 300 sampled questions from the GDPR question-and-answer data in the repo, scored at article level.
- Abstention: 6 of 35 SQuAD articles removed from the index; 120 questions (60 in-corpus, 60 out-of-corpus).
- Generation: 40 questions (30 answerable, 10 out-of-corpus) through the real pipeline with gemma3:4b.
- Compliance: 11 real privacy policies (7 used to write the prompts, 4 added after they were frozen), 14 GDPR and 14 CCPA items each, scored against an answer key I made by reading every quote and searching the policy for every item the pipeline did not find (296 cells; 12 I could not call are left out).
- Knowledge graph: 30 hand-labelled sentences and 12 entity-merge pairs.
- Diligence: 150 generated filing paragraphs with known amounts and categories.
- Unit and API tests: 346, using fake encoder, reranker and LLM so they run without model downloads.

### Retrieval ablation (MRR@10 / recall@5)

| Config | SQuAD v2 MRR | SQuAD v2 R@5 | GDPR MRR | GDPR hit@5 |
|---|---|---|---|---|
| BM25 | 0.864 | 0.943 | 0.796 | 0.893 |
| Dense | 0.785 | 0.897 | 0.655 | 0.787 |
| Hybrid (RRF) | 0.863 | 0.947 | 0.744 | 0.893 |
| Hybrid + rerank | **0.937** | **0.980** | **0.874** | **0.953** |

Median latency per query: BM25 under 2 ms, hybrid about 18 to 22 ms, hybrid plus rerank 1.75 s (GDPR) and 2.14 s (SQuAD) on CPU.

### Other results

| Suite | Result |
|---|---|
| Abstention | AUROC 0.996; at the configured threshold (-3.0) answers 100% of in-corpus and refuses 90% of out-of-corpus (balanced accuracy 0.95); best threshold on this set (-2.0) gives 0.958 |
| Generation (gemma3:4b, n=40) | answer contains gold 0.90, citation hit 0.83, faithfulness 0.60, out-of-corpus refusal 0.80, wrongful refusal 0.0, median 17 s per answer |
| Compliance (11 policies, 296 cells) | precision 0.974, recall 0.917, F1 0.944; on the 4 unseen policies (108 cells) precision 0.988, recall 0.913; 6 false passes, 20 misses, 14 cells sent for review |
| Knowledge graph | triple F1 0.765 (precision 0.684, recall 0.867); entity resolution 0.917 (11 of 12) |
| Diligence extraction (synthetic) | amount and category F1 1.00 |

### What the overall numbers hide
- Fusion alone did not help much. Hybrid ties BM25 on SQuAD and loses to it on GDPR MRR (0.744 versus 0.796). The reranker is what produces the gain: +0.074 MRR on SQuAD and +0.130 on GDPR over hybrid.
- The reranker costs about 2 seconds per query on this machine, roughly 100 times the hybrid latency.
- Compliance errors lean towards missing things: of 26 errors, 20 were items the policy states that did not end verified, and 6 were passages accepted that do not prove the item.
- Generation faithfulness is 0.60. That number is for a 4B model and an NLI-based sentence check; the same check scored 0.81 on the first 12 questions, so small samples were misleading.
- The diligence eval suite uses synthetic data written by me. A perfect score only shows the extraction rules work on the patterns I generated; the real test is the four filings below.

### Ablations and checks
- Four-way retrieval ablation above, on two datasets.
- Abstention threshold sweep from -10 to +3 in steps of 0.5.

### Experiment: fixing "refuse instead of trying" in the document chat (ladder vs summaries)
Problem: "give me 10 key takeaways" was refused, because no single passage matches the words and the relevance gate reads "no good match" as "no answer". Two fixes were built and tested against each other: a **ladder** (if the first search is weak, reword the question and search again, read excerpts from across the document, run a separate yes/partly/no sufficiency check, then answer or refuse) and **summaries** (at upload the model writes summaries per section, per group of sections and for the whole document; they sit in the same index). Four modes: baseline, ladder, summaries, both.

Test: 3 real PDFs, 39 questions (15 specific, 14 whole-document, 10 unanswerable), every mode answering each question in turn with the same hosted model (Nemotron 3.5 Lightning, about 30B, thinking off), temperature 0, router on and then off (off imitates a misrouted question). Scored by plain text matching of the facts a good answer must contain. Noise between two identical runs: 2 to 4 questions, 3 to 6 points on the whole-document score.

| Mode (router on) | Specific facts | Whole-document topics | Unanswerable handled right | Median s |
|---|---|---|---|---|
| baseline | 0.90 | 0.51 | 10 of 10 | 2.4 |
| ladder | 0.90 | 0.49 | 10 of 10 | 2.5 |
| summaries | 0.90 | 0.74 | 10 of 10 | 2.9 |
| both | 0.97 | 0.72 | 10 of 10 | 2.9 |

Router off: baseline refused 21% of whole-document questions (score 0.47); ladder 0% (0.65); summaries alone 21% (0.45); both 0% (0.63).
- Summaries help when the router sends the question the right way; the ladder helps when it does not. Only "both" works either way, so it is the chosen mode.
- With a stronger router the failure moved: "key takeaways" was no longer refused but went to the overview route, which reads about 6 excerpts and covered about 0.3 of the topics. Summaries fixed that (0.29 to 1.00 on that question).
- Costs: about 0.5 s more per question; a one-time build at upload (134 summaries for the 3 PDFs, about 95 s on the hosted model); on two questions a summary pushed out the real passage and the answer got worse.
- The ladder's first version answered unanswerable questions from the model's memory ("Argentina", "1907"). A separate sufficiency check fixed one; it reduces guessing but is not a guarantee.
- Not fixed by any mode: the router sent "what is the difference between a 301 and a 302 redirect" (a question the system design book answers) to the chat route in 3 of 4 modes, and in the fourth the reply came from the model's memory with no citation; and with the router off, "how many employees does Mastra have" was answered "3 employees" in every mode, because a weak passage passed the relevance gate.
- Caveat: 39 questions, 3 documents, text-match scoring, one run each.

Follow-up: which model should run the chat. I expected the 4B local model to route worse than the 30B hosted one. The test (same questions and index, mode "both", router on) showed otherwise:

| | Answerable questions sent to the documents | Whole chat: specific / whole-doc / unanswerable | Median answer time |
|---|---|---|---|
| gemma3:4b (local) | 29 of 29 | 0.95 / 0.72 / 9 of 10 | 31.4 s |
| phi4-mini (local, routing only) | 29 of 29 | not run | router 3.3 s |
| Hosted Nemotron (~30B) | 28 of 29 | 0.90 / 0.77 / 10 of 10 | 2.4 s |

The small models never sent a document question to the chat route (partly because they send nearly everything to search, the safe default); the hosted one did once, on the 301 vs 302 question. Answer quality was close, so the real difference is speed (about 13 times) and privacy (the hosted model receives document text). Caveats: one run, 39 questions, and the local rows reuse summaries written by the hosted model.

Upload to ready (mode "both", hosted model writes summaries, one measured run): chat works as soon as the file is read and indexed, and summaries are written in the background afterwards.

| Document | Read | Index | Chat usable after | Summaries | All ready |
|---|---|---|---|---|---|
| Slide deck (2k words) | 57 s | 2 s | about 1 min | +4 s | about 1 min |
| AI agents book (13k words) | 58 s | 57 s | about 2 min | +32 s | about 2.5 min |
| System design book (46k words) | 18 s | 42 s | about 1 min | +59 s | about 2 min |

All three took about 5.5 minutes; summaries add 20 to 25% and do not delay chat. With local gemma they would take hours, so a fully local setup should skip them.

### Benchmark: annual-report questions (UDA TatHybrid)

Setup: 20 of 170 company annual reports (fixed random seed; reports with at least 40 questions and up to 5 MB), 303 questions spread over span, multi-span, count and arithmetic. Each question is asked against its own report, as in the benchmark. Scored with the benchmark's own numeric-F1 scorer; baseline mode, hosted model.

| | Score (0 to 100) |
|---|---|
| Paper: GPT-4-Turbo / GPT-3.5 / Llama-3-70B / Qwen-1.5-32B / Llama-3-8B | 43.5 / 33.9 / 30.9 / 27.9 / 22.5 |
| **This system** | **41.7** |
| By type: span / multi-span / arithmetic | 64.9 / 41.3 / **21.0** |
| Evidence in top 5 chunks (corrected proxy) | about 85% (paper 80 to 85) |

Search is not the main loss: arithmetic questions, 135 of 303, lose points to unit rewriting, missing calculations, sign errors and refusals (11 of 303 refused). Caveats: one run; baseline mode only; the paper used a different sample and models; multi-span answers are capped at 0.67 by the scorer; the retrieval figure is my proxy; the unit instruction was written on one of the 20 reports.

### Knowledge graph: edge quality, before and after the extractor fixes

Method: every edge judged against its source sentence (true / useful / wrong, one reviewer); recall as written-in facts found. Sets: 3 press-release files (47 edges, 35 facts), 30 random edges of the VMware annual report, and a held-out text written before the fixes (14 facts).

| | Before | After |
|---|---|---|
| Held-out text: facts found / useful edges | 8/14 / 8 of 15 | **12/14 / 13 of 13** |
| Press-release files: facts found | 28/35 (80%) | **31/35 (89%)** |
| Press-release files: useful edges | 27/47 (57%) | **31/31** |
| VMware 30 edges: true / wrong / useful | 18 / 12 / 2 | **25 / 5 / 11** |

Why it was low: dates and generic nouns became targets; page headers ("Table of Contents") became subjects; "Inc." followed by a capital merged two sentences; "we/our" pointed at nobody; the parser hung "to X" / "in X" on the object noun so the edge was lost; labels used only the first word. Fixes (all general): both ends must be named things, clean and split text by paragraph, resolve "we/our" to the most-mentioned company, re-attach prepositions to the verb, label from every word. Still weak on annual-report prose (14 of 30 VMware edges true but low value, departments pass as entities, a few plain facts missed). Caveats: one reviewer, small samples, only the held-out text was not used while fixing, long reports read only to 60,000 characters.

### Compliance on 7 real privacy policies (the first version)

Method: the existing checker run on Anthropic, Appian, Atlassian, Groq, LeetCode, NVIDIA and Stripe policies for GDPR, CCPA and HIPAA; every finding read against the text, one reviewer.

| | Result |
|---|---|
| Findings | 68 (29 compliant, 27 missing, 12 violation) |
| Flagged violations that are real | **0 of 12** |
| HIPAA rules firing on non-health policies | 12 of 12 spurious |
| Compliant calls with the right evidence sentence | 21 of 29 |
| Privacy-notice rule "missing" | 7 of 7 |

Why: loose rule-applies patterns, tables read as one sentence, hypotheses that no single sentence can satisfy, wrong evidence sentences. The 0.81 / 0.94 on 54 short snippets did not carry over to real policies. The literature points to a modular design (filter, retrieve, annotate with a strong model against a fixed label list, self-correct), e.g. GPT-4.1 passage F1 0.83 on a GDPR transparency set. That is why it was rebuilt (next section).

### Compliance rebuilt: quoted disclosures, tested on policies it had not seen

Design: a policy text shows what a company says, not what it does, so "violation" was the wrong answer. Each item (14 from GDPR Article 13, 14 from the CCPA's policy-content rules) ends "disclosed" (a quote that passed two support checks), "needs review" (the two checks disagreed) or "not found". Steps: the whole policy goes to a hosted model that must quote the passage for each item; the quote must exist in the policy; two differently worded questions judge the passage alone; anything not verified is searched for again from the retrieved passages. HIPAA was dropped: no labelled policy set, and it caused all the spurious findings.

Method: the prompts were written on the 7 policies above, frozen, then run unchanged on 4 policies downloaded afterwards (Dropbox, GitHub, Spotify, Zoom). I read every quote and searched each policy for every item the pipeline did not find. The answer key and policies are kept in the repo and scored by an evaluation suite that reruns the pipeline.

| | All 11 policies (296 cells) | 4 unseen policies (108 cells) |
|---|---|---|
| Precision of "disclosed" | 0.974 | **0.988** |
| Recall of "disclosed" | 0.917 | **0.913** |
| False passes / misses | 6 / 20 | 1 / 8 |

Along the way: a first pass with whole-policy reading plus quotes never invented a quote (122 of 122 found in the text) but about 7 in 36 real quotes did not prove their item; splitting items into parts (for example, "transfers happen" and "a safeguard is named") fixed over-credit; the double support check and the targeted retry brought weak accepted quotes to about 4%. The same status came out on 97 of 98 cells in two runs.

Caveats: one reviewer; the key was started from earlier runs' outputs that I then read and corrected; 12 ambiguous cells are excluded; four unseen policies is a small sample, and on those the GDPR recall (0.87) is lower than the CCPA recall (0.96); the CCPA prompts were written on the 7 seen policies; "needs review" counts as not disclosed; and with the hosted model the policy text leaves the machine.

### Due diligence on real filings: before and after the rebuild

Method: Telkonet, Chefs' Warehouse and Brainstorm annual reports, plus Resonant as a fourth; every figure the analysis stated was checked against the filing; two passes each.

| | Before | After |
|---|---|---|
| Key figures right (5 per filing) | 1 of 15 | **20 of 20**, 0 missing, 0 wrong, both passes |
| Verdicts | Decline on all three at 100% confidence | Caution, Caution, Decline, Caution; identical in both passes |
| CRITICAL risks | 9, 4, 9 (Resonant 5) | 2 to 3, 0, 1 (Resonant 1) |
| Risks listed | 19 to 26 | 10 |
| Time per filing | 24 s (read the cover page only) | 59 to 83 s |

Why it was wrong: the model read about 4% of each filing (the first four chunks) and invented the rest; the verdict came from a risk count. Fixes: index by section and retrieve per topic; every fact and risk needs a verbatim quote that is checked against the filing, with its figures inside the quote; a second focused search for missing core figures; severity follows the quote's wording; summary and verdict are built by rules from verified signals (going-concern doubt, cash runway, covenant status, sign of equity). Saved runs on the page (open, delete with confirmation). Caveats: the rules and prompts were adjusted while looking at these same filings; a loss can print without its sign in the summary; 3 to 9 of the 10 risks are still HIGH; a figure can match the filing but belong to the wrong line item. Frozen.

---

## 6. Key decisions and trade-offs

| Decision | Why | Trade-off |
|---|---|---|
| Cut 12 modules to 7 | Only keep what I can measure; remove prompt wrappers | Lost features (report writer, risk monitor, persona generator, document comparator) |
| Move market intel, reviews and trends to a separate project | The project had no single claim; those three work on noisy public web text with different data access, and market intel returned an empty report when its only source was blocked | Less breadth in this project; their measured results (aspect sentiment, trend detection) now live elsewhere |
| One retrieval pipeline | Four implementations disagreed and none was measured | Hybrid fusion is not clearly better than BM25 alone on these sets |
| Cross-encoder rerank on by default | Largest measured quality gain | About 2 s per query on CPU; I cut candidates from 30 to 20 and max length from 384 to 256 to control it |
| Quoted, double-checked disclosures for compliance | A policy shows what a company says, not what it does, so "violation" was the wrong answer; a quote the reader can check is the right one | Needs a hosted model; some items come out as "needs review"; HIPAA dropped until a labelled policy set exists |
| Two model questions instead of NLI to check a quote | NLI flagged 31 of 74 correct quotes and accepted a wrong one at 0.99 | A second model call per quote; the answers still change on a few cells between runs |
| LLM only for prose | Findings stay deterministic and testable | Explanations are optional extras, not the core |
| Rule-based graph extraction | Deterministic, scorable, fast | Small spaCy model misses names; recall limited to what the parse exposes |
| Public benchmarks plus labelled sets | Numbers a reader can check | Labelled sets are small (11 policies and 30 sentences) |
| Config for the local model | Swap models without code changes | Quality numbers depend on the model I happened to have |
| Dropped heavy optional libraries | Smaller install, fewer failure points | Gave up BERTopic and the optional FLAIR NER model; the requirements list lost 8 more packages when the three modules moved out |
| Document chat mode "both" (summaries + ladder) | Only mode that handled whole-document questions whether or not the router was right | About 0.5 s per question, a one-time summary build at upload, and summaries can displace the exact passage |
| Hosted model for the document chat and due diligence | A 4B local model is a weak router and writer, and a poor reader of long filings | Document text leaves the machine (fine for public filings, not for private deal documents); other features stay local |
| Verified quotes in due diligence | The first version invented most of its figures | One extra search and a quote check per claim; a figure can match the filing and still sit on the wrong line item |
| Scope a question to a document only when the user's own words name it | The small router invented or carried over document names, and a wrong scope hides the answer | A follow-up like "and about memory?" loses its scope and searches everything |
| Topic route (8 passages, summaries compete, bare subject searched first) | "What does the guide say about X" needs more than one fact but less than the whole document | Sample was 4 topic questions; one still scores 0.67 by text match |
| Router advises, search decides | A chat-routed message that matches a passage (score ≥ 0) is a question; 301 vs 302 scored +8.7, greetings ≤ -1.2 | One extra quick search on every chat message |
| Test on a public benchmark of real PDFs (UDA annual reports) | Numbers others can check, and it exercises parsing, tables and arithmetic | 41.7 vs 43.5 for GPT-4-Turbo on a different sample; arithmetic at 21.0 is not fixed |
| Book study is out of scope | Whole-book prompting matches or beats RAG on book QA, and people already use ChatGPT or Claude for it; a book mode would be a wrapper | The product is for lookup, support and many-document questions, not for learning from one book |

---

## 7. Problems found and what they taught me

Problems 2, 4, 9 and 11 come from the aspect-sentiment, trend and review modules that now live in a separate project; the lessons still stand.

**1. A configuration that silently broke NLP.**
Situation: the knowledge graph returned nothing on obvious sentences. What I did: traced it to the spaCy pipeline being loaded with the shared feature layer excluded, so tagging, parsing and entity recognition ran without inputs and produced garbage without raising errors. I loaded the full pipeline. Result: the same sentence set went from 0 triples to 10. Every other module using spaCy had been degraded too. Lesson: a smoke test on a trivial input finds in seconds what weeks of reading code did not.

**2. Aspect sentiment looked like chance.**
Situation: first run gave 0.67 (restaurants) and 0.51 (laptops) positive/negative accuracy. What I did: forced a positive-versus-negative decision on a few hundred non-neutral rows and got 0.93 to 0.95, so the model was fine and my neutral rule was mislabelling clear opinions. I averaged three phrasings per polarity and tuned the neutral margin on a separate half of the data. Result: held-out restaurants 0.83, laptops 0.68. Lesson: isolate the component before blaming it; tune on one split and report on another.

**3. A metric that was wrong by a factor of ten.**
Situation: generation faithfulness was 0.08 for answers that were plainly correct. What I did: printed per-example entailment scores (about 0.002 for correct answers) and realised the NLI model handles sentence premises, not 150-word paragraphs. I scored each answer sentence against the individual sentences of the cited passages and took the best match. Result: 0.81 on 12 questions, then 0.60 on 40. Lesson: sanity-check an evaluation metric on cases where you know the answer before trusting it.

**4. Trend detector false alarms.**
Situation: no-trend corpora produced about 3.35 false alarms per run, and emerging precision was 0.39 (earlier development runs). What I did: tested every unigram and bigram in the corpus at once, so I added Benjamini-Hochberg control, a minimum effect size and a minimum support, and pruned redundant phrases. A planted two-letter term was also being dropped by a length filter. Result: 0.2 false alarms per null corpus; emerging F1 0.98. Lesson: multiple-comparison control matters as soon as you test a vocabulary.

**5. Financial categories were wrong because context crossed sentences.**
Situation: amounts were found (F1 0.99 in the earlier run) but category F1 was 0.63. What I did: the classifier looked 120 characters either side of an amount, so a neighbouring sentence's keyword decided the category. I restricted context to the same sentence and used the nearest keyword. The "expenses" class still lagged, because keywords were singular only. Result: category F1 0.95, then 1.00 after plural handling. Lesson: a high headline number (amounts) can hide a broken second stage.

**6. Confident wrong violations in compliance.**
Situation: an end-to-end run flagged an unrelated sentence as violating the lawful-basis rule at 0.98 confidence. What I did: NLI contradiction scores are arbitrary on unrelated text, so I added a topic gate so only sentences mentioning the requirement can be evidence. Result: violation precision 0.94 on the labelled set. Lesson: an inference model needs a relevance filter in front of it. (That checker was later replaced; see problem 18.)

**7. Hybrid retrieval did not beat BM25.**
Situation: I expected fusion to win. What I did: ran the ablation on two datasets and reported what I saw. Result: hybrid ties BM25 on SQuAD and trails it on GDPR; the cross-encoder gives the gain. Lesson: report an ablation honestly; a component you built can be the one that does not earn its place on a given dataset.

**8. Evaluation was too slow to iterate on.**
Situation: the first retrieval run was still going after more than an hour. What I did: profiled it, found reranking took about 2.8 s per query for 30 candidates, cut candidates to 20 and max length to 256, reduced samples to 300, and ran slow suites in the background while tuning on fast ones. Result: each retrieval suite takes 12 to 13 minutes on this CPU. Lesson: measure per-component latency before launching a long job.

**9. Screenshots caught what tests missed.**
Situation: the trends page showed a serialisation error and a stat overlapped its neighbour. What I did: fixed the numpy float leaking into the response and shrank long stat values, then added a regression test. Result: the page works and the bug cannot return unnoticed. Lesson: look at the product, not only the test output.

**10. Shared HTTP client tied to a closed loop.**
Situation: one generation call failed with "event loop is closed". What I did: the evaluation used two separate event loops with one shared client; I ran the health check and generation in a single loop. Result: clean runs. Lesson: shared async resources need to share a loop.

**11. A dataset mirror rate-limited me mid-tuning.**
Situation: fetching the SemEval training split returned 502 then 429. What I did: stopped hammering it and split the test sentences by hash instead, tuning on one half and reporting the other. Result: no leakage and no more downloads. Lesson: design the split so you can proceed without the resource you wanted.

**12. A small first sample flattered a result.**
Situation: I reported generation faithfulness from 12 questions. A 40-question run lowered it from 0.81 to 0.60. Lesson: do not quote a number until the sample is large enough that it stops moving.

**13. The fix I planned was aimed at a problem the better model had already moved.**
Situation: I assumed "10 key takeaways" failed because the relevance gate refused it, and planned a ladder. What I did: tested the ladder against section summaries on 39 questions. With the stronger router the question was not refused; it went to an overview route that reads only 6 excerpts, which the ladder never touches. Result: summaries lifted whole-document coverage from about 0.5 to 0.73 and the ladder did nothing; with the router forced wrong the ladder helped and summaries did not. Lesson: test the fix against the failure as it now happens, and keep a fix for each place the failure can occur. A related catch: a question about 301 versus 302 redirects was sent to the chat route and answered from memory with no citation, a router error no retrieval mode can repair.

**14. I fixed each failing query by hand and kept calling it fixed.**
Situation: live questions on two books kept failing, and each patch (a plural-form fix, a title rule, a document-name check) covered only the query it came from. What I did: traced the last failure to the router writing a document name into its own rewrite, which my name check then took as proof the user had said it; made the check use only the user's words. Then read the 8 sources of a chapter-title question: 5 right, 1 table of contents, 2 from another chapter, and the model cited the wrong two. Result: the cause is a flat index that does not know which chapter a passage is from, which no prompt can fix. Research then showed whole-book prompting matches or beats RAG for studying one book, so I dropped that use case instead of building chapter tagging. Lesson: do not call a fix done on queries you picked; measure on questions you did not, and when failures keep moving, question the use case, not the next patch.

**15. My own test setup was costing points, and my first retrieval number was too good.**
Situation: the first benchmark report scored 30.4. What I did: read the answers next to the gold values and tested the scorer directly; it needs the unit word ("149,727 thousand") and I had told the extra answer step to drop units. Result: 39.9 after the fix. Later I told you retrieval looked ahead of the paper from one easy report (90.6 at 5 chunks); across 20 reports it was 77.6, and 85 after I found 23 of 68 misses were my phrase match failing on line breaks. Lesson: read the scorer and the misses before judging the system, and do not quote a number from one document.

**16. The knowledge graph looked fine on my samples and was poor on a real report.**
Situation: the graph page was built and checked on short press-release text. Scored properly, only 57% of its edges were useful there, and on the VMware annual report 2 of 30 random edges were useful. What I did: judged every edge against its sentence, listed the causes (dates and generic nouns as targets, page headers as subjects, sentences merged after "Inc.", "we" unresolved, prepositions attached to the wrong word, first-word-only labels), fixed each as a general rule, and scored again on three sets including a text I wrote before the fixes. Result: held-out facts found 8/14 to 12/14; useful edges 57% to 100% on the press files; VMware useful edges 2 to 11 of 30. Lesson: a graph that looks right on clean demo text says nothing about real documents; sample the edges and read them, and keep one test text you did not tune on. It is still weak on dense report prose.

**17. The due-diligence module read 4% of each filing and made up the numbers.**
Situation: the module looked fine on a synthetic extraction test (F1 1.00). Checked against three real annual reports it stated 1 of 15 headline figures correctly (a $14.2M net loss that was $1.93M, equity of +$12.3M that was a deficit of $12.2M, a debt that appears nowhere), marked all three Decline at 100% confidence, and listed four copies of the same risk. What I did: found the cause (only the first four chunks of 270,000 to 390,000 characters were sent to the model, and the verdict came from a risk count), read the literature (retrieval is the bottleneck, whole documents are worse, claim-level verification works), then rebuilt it: retrieve by section and topic, require a verbatim quote for every claim and check it against the filing, search again for missing figures, calibrate severity to the quote, and write the summary and verdict by rules from verified signals. Along the way my own checks were wrong several times (a number check that accepted any small number as millions, a food-safety sentence read as a covenant breach, a missing import that broke a whole run because no test reached it, a short table-row quote rejected), and each became a test. Result: 20 of 20 key figures right on four filings and the same verdicts on two passes. Lesson: score a generated analysis against the source document, not against its own synthetic test; make the model quote its evidence and check the quote; and keep prose that can misread a number out of the pipeline where a template will do.

**18. The compliance checker's good score came from easy test cases.**
Situation: 0.81 accuracy and 0.94 violation precision on 54 short snippets. On seven real privacy policies none of its 12 flagged violations was real and every HIPAA finding was spurious. What I did: read all 68 findings, traced the causes (loose applicability patterns, tables read as a single premise, hypotheses one sentence cannot meet), and compared with the literature, which uses a retrieve, annotate and self-correct design on a strong model. Result: rebuilt around quoted disclosures (a hosted model reads, a quote proves, code decides) and scored on 11 real policies; on 4 policies added after the prompts were frozen, precision 0.99 and recall 0.91. Lesson: a test written by the same person, close to the rule wording, measures the wording and not the task; test on documents you did not write before quoting a number.

---

## 8. Resume bullets, blurb, demo, skills

### ML / NLP flavour
- Built a hybrid retrieval pipeline (BM25 + dense, reciprocal rank fusion, cross-encoder rerank) reaching recall@5 0.98 / MRR 0.94 on SQuAD v2 and article hit@5 0.95 on GDPR questions; ablated each stage and showed the reranker, not fusion, drives the gain.
- Rebuilt a privacy-policy compliance checker as a hosted-model pipeline whose every answer carries a quote checked in the policy text and judged twice; precision 0.99 and recall 0.91 on four policies it had not seen (0.97 / 0.92 across eleven).
- Rebuilt a due-diligence analyser around claim verification: each figure must carry a quote that is checked against the filing; 20 of 20 key figures correct on four real annual reports.
- Measured and improved knowledge-graph extraction on real text: 12 of 14 facts found on a held-out text, and every kept edge useful on three press-release files.

### Systems / engineering flavour
- Consolidated four inconsistent retrieval implementations into one persistent, filterable hybrid index with measured latency (hybrid about 20 ms, reranked about 2 s per query on CPU).
- Built a FastAPI service with 31 API paths, Pydantic v2 request and response schemas, model warm-up, and a local LLM client configured entirely from environment settings; refuses unanswerable questions without invoking the model.
- Created an evaluation harness with 9 suites (public benchmarks, labelled sets, synthetic controls) plus a results page that runs and displays them.
- Wrote 346 pytest tests using fake models so the suite runs without model downloads.

### Full-stack / product flavour
- Rebuilt the front end as six React pages (RAG chat with citation highlighting, interactive knowledge graph with search and shortest-path, compliance report, due-diligence runs, evaluation dashboard).
- Reduced twelve modules to seven by removing those that could not be measured, then split three into a separate project to keep this one focused on documents.

### Portfolio blurb
NEXUS is a local-first document intelligence platform. It answers questions over your own documents with numbered citations and refuses when the evidence is missing, analyses annual reports with every figure checked against the filing, builds queryable knowledge graphs with evidence, and checks privacy policies against GDPR Article 13 and CCPA items, quoting the passage behind every answer. It runs on a laptop (with an optional hosted model), and every module is benchmarked: 0.98 recall@5 on SQuAD v2, 0.996 AUROC for refusing out-of-corpus questions, and an evaluation page that shows all the results.

### 3-minute demo script
1. (20 s) Overview page: "Everything here runs locally, and the cards show measured results." Open Evaluations briefly.
2. (50 s) Knowledge RAG: paste a privacy policy, ask "Can users ask for their data to be deleted?" Show the cited passage. Then ask something unrelated and show the refusal.
3. (40 s) Compliance: run the sample policy; show an item with its quoted passage, one marked for review, and one not found. Say that it reads what the policy states, not what the company does.
4. (40 s) Knowledge graph: rebuild the sample graph, click a node to show evidence sentences, run a shortest path.
5. (30 s) Evaluations: show the retrieval ablation table and say the reranker is what helped, not fusion.
6. (10 s) Close: "346 tests, 9 evaluation suites, local by default."

### Skills to list
Retrieval-augmented generation, hybrid search (BM25, FAISS, RRF), cross-encoder reranking, natural-language inference, claim verification, knowledge graphs, dependency parsing (spaCy), evaluation design (ablations, held-out splits), FastAPI, Pydantic, pytest, React, Vite, Recharts, local LLM serving (Ollama), hosted LLM calls with fallback, PyTorch, NetworkX, PDF/OCR ingestion.

---

## 9. Interview question bank

**Why did you rebuild it?**
The first version had twelve modules, no tests and no measurements, and some were prompts around a model. I wanted a version where each claim has a number behind it.

**Why hybrid retrieval?**
I expected BM25 and dense search to cover each other's weaknesses. The ablation showed it only partly did: hybrid beat dense but only tied BM25 on SQuAD and lost to it on GDPR MRR. I kept it because it is cheap and a reasonable default, but I say plainly that the reranker is the part that helps.

**What does reciprocal rank fusion do?**
It combines ranked lists by summing 1/(k + rank) for each document across the lists (k=60 here), so it needs no score calibration between BM25 and cosine similarity.

**How does the system know when not to answer?**
It checks the top cross-encoder score against a threshold and refuses without calling the model. On a held-out test the score separates in-corpus from out-of-corpus questions with AUROC 0.996. The language model is also told to refuse if the passages do not contain the answer.

**How do you know the answers are grounded?**
Citations are parsed and checked against the retrieved passages, and the evaluation checks that each answer sentence is entailed by a sentence in a cited passage. Faithfulness came out at 0.60 for a 4B model, so it is not solved.

**How does the compliance checker work, and why not NLI?**
A hosted model reads the whole policy and must quote the passage for each GDPR Article 13 and CCPA item. Code checks the quote exists in the policy, two differently worded questions judge whether the passage by itself states the item, and anything not verified is searched for again from retrieved passages. I tried NLI first on single sentences and it failed on real policies; I also tested it as the support check and dropped it, because it flagged 31 of 74 correct quotes and accepted a wrong one at 0.99.

**What was the hardest bug?**
The spaCy configuration that silently broke parsing. Nothing crashed; outputs were just poor. I found it because a graph smoke test returned zero triples in a few milliseconds.

**Tell me about a mistake.**
I reported generation faithfulness from 12 questions and it looked good (0.81). A 40-question run gave 0.60. I also made two process mistakes: I left scratch files and images in the project root, and I deleted screenshots without being asked, then had to regenerate them. I now use a scratch directory and confirm before removing anything I did not create for the task.

**How did you avoid overfitting your evaluation?**
For the knowledge graph I kept a text written before the fixes and never tuned on it. For compliance I wrote the prompts on seven policies, froze them, and scored four policies added afterwards. For due diligence I did adjust prompts and rules while looking at the four filings, and I say so; an unseen filing is the real test.

**What would you not trust in your results?**
The synthetic diligence suite, the compliance answer key (one reviewer, eleven policies), the 30-sentence graph set, and the 40-question generation run. They are useful as regression checks, not as proof of general accuracy.

**How would you scale it?**
Reranking at about 2 s per query on CPU is the first limit; I would move it to a GPU or use a smaller reranker. The FAISS index is flat, which is fine for thousands of chunks and would need an approximate index for millions.

**Why not use an LLM for everything?**
Deterministic extraction and NLI give testable findings and run fast; an LLM is used where prose is the output. It also keeps the system usable when the model is offline.

**What would you do with more time?**
Larger labelled sets, a lighter reranker, an encoder comparison, one unseen filing for due diligence, and a second reviewer for the compliance answer key.

---

## 10. Limitations and next steps

- Reranking costs about 2 seconds per query on CPU. Next: a smaller reranker or GPU.
- Compliance under-reports: most errors are items the policy states that did not end verified (a long policy can hide a passage from the first read). Next: a larger answer key, a second reviewer, and more policies from outside the set.
- Generation faithfulness is 0.60 with a 4B model. Next: compare larger local models and tighter prompts.
- The diligence eval suite is synthetic, and the graph and compliance sets are small.
- The graph uses a small spaCy model, which misses some names; relations are single-sentence only.
- Market intel, reviews and trends are no longer part of this project. Market intel was never evaluated and returned an empty report when its only data source (Reddit) was blocked.
- Only one language model and one encoder were evaluated.
- The document-chat experiments use 3 documents and 39 questions, one run each, with text-match scoring. Local gemma3:4b answers in about 31 s per question on this CPU. Next: let the router advise instead of decide, check borderline matches before answering, and a bigger question set.
- The document chat is not meant for studying one long book: passages carry no chapter, so a chapter-title question pulled two passages from another chapter. Whole-book prompting does better there.
- The last two router fixes were checked on two live questions and the unit tests, not on the 48-question set.
- On annual-report questions the system scores 41.7 (paper: GPT-4-Turbo 43.5), but arithmetic questions score only 21.0: units are rewritten, calculations skipped, signs flipped. Not fixed. Only baseline mode was scored on all 20 reports.
- The compliance checker reports what a policy states, not whether the company follows it, and covers GDPR Article 13 and CCPA only (HIPAA was dropped: no labelled policy set). The answer key is one reviewer; the four unseen policies are a small sample; a few items change between runs. The first version, which scored well on short snippets, found none of its flagged violations real on real policies.
- Due diligence is checked on four real filings (20 of 20 key figures right, same verdicts on two passes), but the rules and prompts were tuned on those same filings. A loss can print without its sign, many risks are still HIGH, and the verdict thresholds are my own. The hosted model receives the filing text.
- No GPU was used; all timings are CPU.

---

## 11. Cheat sheet, glossary, phrasing

### Quick facts

| Item | Value |
|---|---|
| Modules | 4 analysis modules + evaluation page (from 12, then 7) |
| Front-end pages | 6 |
| API paths | 31 |
| Evaluation suites | 9 |
| Automated tests | 346 |
| Compliance items | 28 (GDPR Article 13: 14, CCPA: 14) |
| Law index | 399 chunks (391 GDPR from 99 articles) |
| Chunking | 120 words, 20 overlap, sentence-aware |
| RRF constant / rerank candidates | 60 / 20 |
| Abstention threshold | -3.0 (best on test set: -2.0) |
| Models | MiniLM-L6 encoder, MS MARCO MiniLM cross-encoder, DeBERTa-v3-small NLI, gemma3:4b via Ollama |
| Hardware | CPU only |
| SQuAD v2 | recall@5 0.98, MRR 0.937 |
| GDPR | hit@5 0.953, MRR 0.874 |
| Abstention AUROC | 0.996 |
| Compliance (11 policies) | precision 0.974, recall 0.917; unseen 0.988 / 0.913 |
| Annual-report questions (TatHybrid) | 41.7 (GPT-4-Turbo 43.5) |
| Diligence key figures, 4 real filings | 20 of 20 |
| Graph triple F1 | 0.765 |

### Glossary
- **RAG:** retrieve relevant passages, then have a model answer from them.
- **BM25:** keyword-based ranking function.
- **Dense retrieval:** ranking by embedding similarity.
- **RRF:** reciprocal rank fusion; merges ranked lists using ranks only.
- **Cross-encoder:** a model that scores a query and passage together; slower and more accurate than embeddings.
- **MRR / recall@k / nDCG:** ranking metrics; MRR rewards putting the right item first, recall@k asks whether it is in the top k.
- **NLI:** natural-language inference; does one sentence entail, contradict or say nothing about another.
- **AUROC:** probability that a random positive scores above a random negative.
- **Abstention:** refusing to answer when evidence is weak.
- **Faithfulness:** whether each answer claim is supported by the cited text.

### Say it like this / avoid saying

| Say | Avoid |
|---|---|
| "The reranker gave the gain; fusion only matched BM25." | "Hybrid search is better." |
| "0.99 precision on four unseen policies, a small set, one reviewer." | "99% accurate compliance checking." |
| "Synthetic data, so it validates the rules, not real-world accuracy." | "Perfect extraction." |
| "Faithfulness is 0.60 with a 4B model on 40 questions." | "The answers are reliable." |
| "Runs locally on CPU; reranking takes about 2 s." | "Production-ready" or "real-time." |
| "I found it by testing a trivial input." | "I optimised the whole pipeline." |
| "The metric was wrong, and I fixed the metric." | "The model improved from 0.08 to 0.81." |

Repo: https://github.com/pavithra2870/Consultancy-AI