# Agent-Orchestra-RL: project brief for interviews, portfolio and resume

Everything here is taken from the project's own results and notes.
Numbers are measured values; where a number comes from an older version of the task it is marked "before Group B".
Use this file to prepare answers, not to copy blindly: the "Say it like this" and "Avoid saying" parts at the end of section 9 keep the claims accurate.

---

## 1. The project in one minute

**Agent-Orchestra-RL** is a reinforcement-learning project about one question: at each step of a task, which tool should an AI agent call, or should it stop, ask, or hand over to a human, so that the task succeeds at low cost and low latency?

It has two parts:

1. **The original project**: a small simulated tool-orchestration environment with ten task types, compared across tabular Q-learning, SARSA, DQN, PPO, offline CQL and a multi-agent extension. It was built in four phases.
2. **The main use case, the e-commerce customer-support agent**: a much more realistic case study built on top of the same ideas, with its own simulator, safety layer, language layer, backend, dashboard and evaluation framework. **This is the part to talk about in interviews.**

**The e-commerce agent in one sentence:** a customer writes a message; a language layer turns it into goals; a *learned RL policy* chooses every tool call (look up the order, check eligibility, refund, cancel, change payment, open a return, look up a policy, ask the customer, hand over to a human); hard safety rules in code make illegal actions impossible; an independent evaluator judges the final database state.

**Headline results (simulated shop, 1,410 held-out scenarios, 7 test sets, 4 runs each, 3 training seeds):**

| | |
|---|---|
| Best learned agent | DQN 98.5% success (99.6% with failure-aware training) |
| Offline RL | CQL 97.6%, learned from a fixed log of 4,000 past conversations, zero live training episodes |
| Safety | 0.0% rule violations for every agent with the guardrail; no refund before an inspection passed |
| Without the guardrail | DQN falls to 21.1% (16.6% rule breaks); a random agent breaks a rule in 83.2% of runs |
| Hand-written playbook | 99.9%: no learned agent beat it |
| A small local LLM choosing the tools | 28.3% success, 40.5 s per conversation (DQN: 100% on the same sample, under 0.1 s) |

---

## 2. Elevator pitches (pick the length you need)

**30 seconds.**
"I built a reinforcement-learning customer-support agent for a simulated online shop. The RL policy decides which tool to call at every step: look up an order, check eligibility, refund, cancel, open a return, look up a policy, ask the customer, or hand over to a human. A language layer reads the message, hard rules in code make unsafe actions impossible, and an independent evaluator judges the final database state. DQN reached 98.5% on 1,410 held-out scenarios with zero rule violations, and I compared five RL methods, ablations and a local LLM."

**2 minutes (add).**
"The interesting part was not getting a high score; the shop's rules are simple enough that a hand-written playbook scores 99.9%. The interesting part was building something I could trust: an action mask so the agent cannot choose an illegal action, an evaluator that ignores what the agent says and checks the database, held-out test sets for unseen goal combinations, tool failures and unseen wording, and an oracle that knows the hidden truth so I can measure regret. That evaluation showed things the headline number hid, like PPO collapsing on goal combinations it had never seen (66.6%) while DQN did not (99.6%). I also extended the agent when the task grew, adding returns, damage claims with an instant-refund tier, and policy questions, retrained everything once, and froze the old results so before and after were never mixed."

**Behavioural framing (what the project shows about you).**
Careful evaluation habits; comfort with the whole stack (simulator, RL, NLP, API, UI, tests); finding and owning my own mistakes (a leaked tuning protocol, a contaminated training log, a test set I had read); and working with a real user's feedback in the loop.

---

## 3. The problem and how it was modelled

### 3.1 The shop (simulated)
A seeded fake database of customers, orders, shipments and payments. Tools read and change it using real business rules. Nothing touches a real system. The same seed always gives the same world, so every result is reproducible.

### 3.2 The MDP (what an RL interviewer will ask)

| Element | Definition |
|---|---|
| State (85 numbers) | which goals were found, handled or need a human; whether the customer and order are verified; what each tool has revealed (shipment status, eligibility results); whether the customer still has to name a payment method or answer the return questions; failures per tool; steps and cost used; parser confidence and scope score; the last action. **No hidden ground truth** is ever in the state. |
| Actions (16, discrete) | 13 tools (`lookup_customer`, `lookup_order`, `check_shipment`, `get_payment_details`, `check_payment_change_eligibility`, `update_payment_method`, `check_refund_eligibility`, `initiate_refund`, `check_cancel_eligibility`, `cancel_order`, `check_return_eligibility`, `process_return`, `lookup_policy`) plus `request_clarification`, `escalate_to_human`, `finish_task`. The policy picks the tool; the environment fills in ids, the customer's answers and the policy topic from verified context, so the policy cannot invent or mistype an argument. |
| Reward | small cost and latency penalties per step (cost weight 0.1, latency weight 0.05); +1 when a requested goal is handled; at the end +5 for a fully correct run or -2 otherwise, decided by the independent evaluator; -5 per executed safety violation; small penalties for blocked and unneeded actions. All weights are in a YAML config. |
| Episode ends | `finish_task`, `escalate_to_human`, or 16 steps. |
| Legal actions | given by an action mask computed from the state (see 3.4). |

**Why the reward is mostly outcome-based:** a 2026 paper on customer-service tool agents found naive per-turn rewards can hurt. In this project, removing the +1 per handled goal changed little (DQN 98.5% to 98.7%), so the study does not show dense rewards are needed here.

### 3.3 Goals and rules
Six goals, any combination in one message: delivery status, payment change, refund, cancel, return / exchange / damage claim, and policy question.

- **Payment change:** only on unpaid, open orders, and only to a method the customer named (the agent may never pick one).
- **Refund:** depends on status and a high-value limit (5,000 rupees; above it a human decides). A delivered item is never refunded directly: the customer returns it first and the refund follows once it passes inspection.
- **Cancel:** only before shipping; a paid cancelled order is refunded.
- **Damaged item:** reported within 48 hours; the customer chooses exchange or return-and-refund and confirms the condition. Orders up to 500 rupees with fewer than 2 damage claims in 30 days (one claim per order, courier-confirmed delivery, paid) get the refund straight away or an exchange is opened. Everything else (big order, late report, claim history) goes to staff.
- **Change of mind:** 7 days, no fee, customer confirms the item is unused. A human supply-chain team inspects it (simulated). Passed: refund or replacement. Failed: no refund, the item goes back.
- **Policy question:** answered by the `lookup_policy` tool from texts generated from the same numbers the rules use. No order needed, nothing changes.
- **Every refund, cancel, payment change and return asks the customer yes or no first** (a step before the agent runs).
- Currency is rupees. All thresholds live in the YAML config.

### 3.4 Guardrails (four layers)
1. **Input:** an embedding router with a scope score and a calibrated confidence; typo repair from the router's own example words.
2. **Actions (hard rules in code):** a state-changing tool is legal only with a verified order, a passed eligibility check, a matching customer request and, for payments and returns, the answers only the customer can give. Retries are capped, then a human takes over. Illegal actions are masked out of the policy **and** out of the learning targets (the maximum in the Q-learning target is over legal next actions only). Tools also re-check the rules before touching the database ("defence in depth").
3. **Output:** replies are built from verified tool results. An optional LLM rewording is fact-checked (invented ids, dates, numbers, claims, wrong meaning) and replaced by the template if anything is unsupported. Questions to the customer and policy answers are never LLM-worded.
4. **Escalation:** out of scope, large refund, damage claims that need review, or repeated tool failure go to a human.

---

## 4. System architecture

```
customer message (+ last 3 messages as history)
  -> language layer
       router (MiniLM embeddings) -> goals, scope score, calibrated confidence
       optional local LLM (phi4-mini) reads the message; the router cross-checks it
       order resolver (deterministic code): named order / conversation / only order / inference from the goal
       yes/no confirmation before anything that changes money or the order
  -> state (85 numbers)
  -> RL policy picks the next action; illegal actions are masked out
  -> tool runs on the seeded fake database (real business rules, random failures)
  -> reply built from verified results (template, or an LLM draft that must pass the checker)
  -> independent evaluator judges the final database state, never the agent's own words
```

**Tech stack:** Python, PyTorch, gymnasium, NumPy/pandas, scikit-learn, sentence-transformers (all-MiniLM-L6-v2), Ollama with phi4-mini, FastAPI, pydantic, SQLite, React, Vite, pytest, Playwright (browser checks), Streamlit (original app), matplotlib/seaborn (diagrams).

---

## 5. The agents compared
- **Random (legal actions only):** the lower bound.
- **Rule-based playbook:** a hand-written support procedure that uses only what the state shows. The bar to beat.
- **Oracle:** knows the hidden truth and follows the cheapest correct plan; used only to measure regret and to test the environment.
- **Tabular Q-learning and SARSA:** off-policy and on-policy baselines on a compressed (discretised) state.
- **DQN:** value-based deep RL with experience replay, a target network and action masking in the targets.
- **PPO:** clipped policy gradient with GAE, trained online.
- **CQL (offline):** conservative Q-learning, trained only on a log of 4,000 conversations made by a mostly sensible rule-based agent with some random moves plus fully random runs; no live interaction while learning.
- **LLM tool-chooser (benchmark only):** phi4-mini shown the same state and legal actions as the RL agents.

Training budgets (kept after a pilot): DQN 4,000 episodes, PPO 12,000, tabular 5,000, CQL 20,000 gradient steps. Full retrain of everything (3 seeds, ablations, failure-aware variants) took about 33 minutes.

---

## 6. Results

### 6.1 Evaluation design (why the numbers can be trusted)
- **Independent evaluator:** success is decided from the scenario's ground truth, the final database state and the trace, never from the agent's words. Success means every goal reached its correct outcome (done, correctly declined, or handed to a human), the run ended the right way, and no rule was broken.
- **7 test sets, 1,410 scenarios, 4 runs each, 3 training seeds:** `iid`, `heldout_combos` (five goal combinations never seen in training), `tool_failures` (3x failure rate, sometimes a tool fully down), `missing_info` (missing or wrong order id, low parser confidence), `out_of_scope`, `returns` (all twelve return outcomes), `policy`. A paraphrase set (unseen wording) tests the real language pipeline. Each set has its own seed range; a test checks they share no scenario.
- **Metrics:** success, pass^4 (solved in all four runs, i.e. consistency), safety violations, regret against the oracle, steps, cost, latency, asking and hand-over quality.
- **Honest checks of the checker:** the oracle and the rule-based playbook score 100% on every set with tool failures switched off. That is how I know the task is solvable and the environment is consistent.

### 6.2 Overall ranking (all test sets pooled)

| Agent | Success | pass^4 | Rule breaks | Regret | Steps |
|---|---:|---:|---:|---:|---:|
| Rule-based playbook | 99.9% | 99.6% | 0.0% | 0.05 | 5.3 |
| DQN, failure-aware training | 99.6% | 99.0% | 0.0% | 0.24 | 6.3 |
| DQN | 98.5% | 98.1% | 0.0% | 0.23 | 5.9 |
| CQL (offline) | 97.6% | 97.3% | 0.0% | 0.24 | 5.3 |
| PPO, failure-aware training | 96.6% | 96.1% | 0.0% | 0.72 | 7.7 |
| PPO | 94.0% | 93.6% | 0.0% | 0.84 | 7.2 |
| Q-learning | 68.0% | 55.8% | 0.0% | 2.84 | 4.5 |
| SARSA | 66.9% | 54.3% | 0.0% | 2.93 | 4.5 |
| Random (legal actions) | 7.6% | 0.4% | 0.0% | 7.78 | 2.1 |

### 6.3 The overall number hides the real differences

| Agent | iid | held-out combos | tool failures | missing info | out of scope | returns | policy |
|---|---:|---:|---:|---:|---:|---:|---:|
| Rule-based | 100% | 100% | 99.1% | 99.8% | 100% | 100% | 100% |
| DQN | 100% | 99.6% | 91.6% | 99.9% | 100% | 98.8% | 100% |
| CQL | 99.1% | 97.2% | 93.9% | 97.2% | 100% | 96.8% | 100% |
| PPO | 99.9% | **66.6%** | 91.4% | 99.8% | 100% | 100% | 99.7% |
| Q-learning | 92.5% | **6.8%** | 79.0% | 87.4% | 100% | 60.1% | 69.0% |
| SARSA | 91.3% | **7.0%** | 77.7% | 86.6% | 100% | 56.8% | 69.6% |

- On familiar scenarios almost everything looks fine. On goal combinations never seen in training, PPO and both tabular methods fail while DQN and CQL do not. PPO is perfect on three of the five held-out combinations and fails the two that combine several older goals (payment+refund 25%, delivery+payment+refund 6%). **Why** DQN generalises and PPO does not is **not tested**; I would present it as an open question.
- **Tool failures:** every plain learner loses 5 to 9 points, always by finishing instead of handing over when a tool stays down (training scenarios never had a tool that stayed down). Training with such scenarios in 30% of the pool fixes it: DQN 98.2% and PPO 98.5% on that test set.

### 6.4 Returns and damage claims, by outcome (returns test set)
DQN is at least 96% on every one of twelve outcome types (the weakest is the instant damage refund, 96%). PPO and the playbook are at 100%. **CQL is weakest at knowing when a human must decide** (repeat claimer 80%, over the 500-rupee cap 85%, high-value change of mind 86%, late report 94%), plausibly because those rarer cases are thin in its log. No guarded agent refunded anything before an inspection passed.

### 6.5 What each design choice buys (ablations)

| Change | Before | After |
|---|---:|---:|
| No guardrail, DQN | 98.5% | 21.1% (16.6% rule breaks) |
| No guardrail, PPO | 94.0% | 7.8% (very short conversations, 2.6 steps vs 7.2) |
| No guardrail, random agent | 0.0% rule breaks | 83.2% rule breaks |
| Outcome-only reward, DQN | 98.5% | 98.7% |
| Outcome-only reward, PPO | 94.0% | 96.3% |
| CQL without the conservative penalty | 97.6% | 98.7%, but wasteful (7.6 steps vs 5.3, regret 0.53 vs 0.24) |
| Train with tool-failure scenarios, DQN / PPO (tool-failure set) | 91.6% / 91.4% | 98.2% / 98.5% |

The guardrail does two jobs: it makes unsafe behaviour impossible for any policy, and it makes the task learnable at all. (An important nuance: "no guardrail" is an experiment; the live system never runs without it.)

### 6.6 Sample efficiency (validation split)

| Method | Steps to 90% | Environment steps |
|---|---:|---:|
| DQN | 933 episodes | 2,674 |
| CQL | 1,000 gradient steps | **0** live steps |
| Q-learning | 4,000 episodes | 15,534 |
| SARSA | 4,400 episodes | 17,314 |
| PPO | 4,600 episodes | 19,574 |

### 6.7 Language layer
- **Router** (all-MiniLM-L6-v2 embeddings, nearest example sentences, a calibrated confidence): exact goal-set match on the fresh held-out wording set 93.8% (92.0% with more examples); wording it has seen 97.2%.
- **Policy questions** (21 held-out): router recognises 95.2%, right topic found 95.2%, both right 90.5%; 1.2% of ordinary requests wrongly called policy questions.
- **End to end with the real router (200 messages):** goal set exactly right in 93.0%; language errors cost the agents up to 8.3 points (rule-based 100% to 95.0%, DQN 99.8% to 94.9%, CQL 99.0% to 94.2%, PPO 87.0% to 78.7%). A late-found gap between the simulator and the real router (off-topic messages arrived as 'very confident' instead of 'unsure') was fixed; before the fix the cost was 3.3 to 9.8 points.
- **The router's confidence is not a usable error detector:** it flagged none of its wrong parses on this sample.
- **LLM parser (60 held-out messages):** router only 91.7% exact; raw LLM 81.7% (invents a goal 13.3%, misses 18.3%); LLM plus router cross-check 81.7%, with 90.9% of its errors flagged low-confidence. The cross-check works as a safety signal, not an accuracy gain. 4.9 s per message.
- **LLM replies:** 8 of 25 drafts rejected by the checker and replaced by the template; 0 unsupported claims shipped; 5.1 s per reply. (Taking demo screenshots showed the LLM once writing a dollar amount in a rupee shop; the checker now rejects any other currency.) LLM wording is the least reliable part of the system.

### 6.8 LLM as the decision-maker (benchmark)
phi4-mini (3.8B, CPU) shown the same state and legal actions: **28.3%** success, 40.5 s per conversation, mostly by handing over to a human when it should not (60 scenarios, one run each). DQN 100%, CQL 98.3%, PPO 91.7%, playbook 100%, tabular 78.3%, random 16.7% on the same sample. This says a small local LLM is a poor tool-chooser for this task; it does not say a larger one would be (not tested).

### 6.9 Before the returns / policy extension ("before Group B")
13 actions, a 68-number state, 4 goals, 910 scenarios over 5 test sets: rule-based 99.9%, DQN 97.5% (98.6% failure-aware), CQL 96.1%, PPO 78.9%, Q-learning 73.5%, SARSA 72.9%, random 6.5%; held-out combinations DQN 97.5%, CQL 98.3%, PPO 12.6%, tabular about 6.5%; router on unseen wording 90.8% (96.0% with more examples). **These measure a different, smaller task, so do not put them side by side with the current numbers as if they were a before/after of one test.**

---

## 7. Key decisions and why (the "decision log" for interviews)

1. **A separate folder instead of changing the original project.** The original deliverable stays valid; the new work is additive.
2. **Re-implement the agents inside the case study.** The originals hard-code the action count, use a task-id embedding and have no action masking. New code with the same algorithms, with masking in both acting and learning targets, was safer than refactoring.
3. **RL picks tools; the LLM only reads and words.** Flavour choice: RL for decisions (controllable, testable, fast), an LLM for language, both of its outputs checked. Fine-tuning a language model with RL was kept as related work (needs GPUs, a different kind of model).
4. **Embeddings route the query; the policy never reads text.** The agent trains on state, so any wording with the same goals gives the same behaviour, and honest held-out wording tests become possible.
5. **Hard safety rules in the mask, not in the policy.** The agent cannot learn to break a rule it is not allowed to choose. Defaults inside the environment were removed (see the payment story below).
6. **Facts come from tools, not the parser.** The parser only reads what was typed; tools verify the order exists and belongs to the customer. The wording of "order not found" is identical for a missing order and someone else's order, so the bot never reveals another customer's data.
7. **Mostly outcome-based reward.** Judged by the independent evaluator on the final database state.
8. **An independent evaluator and an oracle.** Success from the database, not the agent's claims; an oracle with hidden truth for regret and as a test of the environment itself.
9. **Three wording sets (A examples, C tuning, B final test).** Stops language results from being inflated by tuning on the test wording.
10. **Template mode first, LLM as an extra switch, then LLM-by-default with template fallback.** Everything works without an LLM; auto mode uses the LLM when it is running and falls back when a draft fails the checks. Questions to the customer are always templates.
11. **Train with tool-failure scenarios.** Agents can only learn behaviour their training data exercises.
12. **Last 3 messages as memory, no summary.** The main focus is RL, not the chatbot; three messages cover the one-step follow-ups seen in real chats.
13. **Deterministic order inference using the same business rules as the tools.** "Where is my order" with one undelivered order picks it and says so; several candidates are listed; none qualifying is explained. Anything that changes money still waits for a yes.
14. **Confirm before every refund, cancel, payment change and return.** A chat-layer step before the agent runs. Making confirmation an RL action was considered and not built.
15. **A persistent demo database with a restore button.** Evaluation runs on frozen copies; the interactive demo keeps changes so multi-step conversations make sense, and "Restore original data" resets from the seed.
16. **Returns done as part of the RL environment, not as a shortcut.** New tools, masks so the agent cannot act before the customer has answered (reason, exchange or refund, condition), a rule that a delivered item is refunded only after inspection, new test sets, one combined retrain. An earlier shortcut (a routing shortcut for policy questions that bypassed the agent) was built by mistake, measured, switched off and replaced.
17. **One combined retrain, old results frozen.** The old task's results are kept separately so before and after stay separate. Pilot runs first confirmed the budgets.

---

## 8. Problems found and what they taught me (best interview stories)

Format for each: situation, what I did, result, lesson.

1. **The oracle failed the environment test.** A perfect-information planner only succeeded 85% of the time, which should be impossible without tool failures. I traced one failing run: the environment judged "was a question needed?" from what the agent had already looked up, not from the ground truth. Fixed; oracle then scored 100% on every set. *Lesson: use a perfect agent to test the environment itself.*
2. **A change that "did nothing" was not applied.** Router accuracy was identical before and after an order-id clean-up. The shell had collapsed double backslashes, so a regex contained an invisible backspace character. I printed the raw line, saw the control characters, fixed it, and held-out accuracy went 88.6% to 90.8%. *Lesson: when a fix does nothing, check it was applied before concluding it did not help.* (This shell issue recurred twice more; I switched to the editor tool for regexes.)
3. **My own smoke test contaminated the real experiment.** The CQL page said "300 past conversations". A tiny test log had been left in the real data folder and silently reused; CQL's held-out result (43.8%) was partly a data-size effect. I made the trainer refuse logs under 4,000 episodes and record the dataset with every run; retrained, held-out went to 98.3% (before Group B). *Lesson: validate inputs and record them with every run.*
4. **PPO looked weak only because of its budget.** 72.7% vs DQN's 100%, but PPO had about 16 updates in 4,000 episodes. With 12,000 episodes all settings reached 100%. *Lesson: rule out "not trained enough" before calling an algorithm worse.*
5. **The ablation that showed no effect.** A "no guardrail" random agent broke no rules because my runner enforced the mask anyway. *Lesson: an ablation with no effect is a suspicion about the experiment first.*
6. **A real user found failures my tests did not.** The LLM reworded a question into the opposite meaning; "order 4749" and "ord 4175" were not understood; "where it is" never got a goal; "the other one" had nothing to point at. Fixes: meaning checks on replies, questions always templated, order references by id/digits/status/item word, last-3-message memory, follow-ups parsed like any message. *Lesson: tests built from the user's actual messages; metrics miss reversed meanings.*
7. **The agent changed a payment method nobody named.** "wanna pay now online itself" led DQN to change the method, because the environment silently defaulted to UPI and the mask did not block it. Fix: a method counts only if the customer wrote it; the actions are masked until it is known; the question lists UPI or card. Four agents now ask and change nothing. *Lesson: safety rules belong in the mask, not in defaults.*
8. **I reported a fix the user could not see.** The user's server still ran old code, so my "fixed" claim was wrong for them. I now reproduce the user's exact case on fresh code, show it, and give the restart command. *Lesson: a fix is a fix only for the reported case on the process they use.*
9. **I built a design before we had agreed it.** I added a routing shortcut for policy questions that bypassed the RL agent; the user wanted a tool the agent is retrained to call. I switched it off, then built the real tool. *Lesson: propose in plain words, list the costs, wait for a clear go.*
10. **Adding two classes dropped the router 11 points, and I broke my own test set.** 90.8% fell to 79.6% with seven classes. Broader examples and typo repair brought it back, but I had read the test-set errors, so the set stopped being a test. I wrote a fresh set and reported only on that. *Lesson: the moment you read the test errors, the test is spent.*
11. **A dictionary key overwrote the outcome.** The return was opened correctly but the reply said it failed, because the tool's `kind` field collided with the outcome's `kind`. Found by running the flow end to end. *Lesson: unit tests miss integration collisions; run the user flow.*
12. **The faithfulness test caught my new reply text.** "48 hours" and "delivered" in a template were not in the verified facts. I made the rule numbers part of the facts and avoided unverified status words. *Lesson: a checker is useful against your own code too.*
13. **The demo world could not show the new flows.** No customer had a small order delivered recently. I added five demo-only customers to the demo world only, leaving training and evaluation worlds untouched.
14. **A safety check blocked my clean-up, and I did not work around it.** I moved old results into a frozen folder instead of deleting them.

---

## 9. Resume, portfolio and profile content

### 9.1 Resume bullets (pick 3 to 5; all numbers are measured on the simulated shop)

**RL / ML flavour**
- Built a reinforcement-learning customer-support agent for a simulated e-commerce shop; a DQN policy chooses among 16 actions (13 tools, ask, hand over, finish) and reached **98.5% success on 1,410 held-out scenarios with 0.0% safety violations** (99.6% with failure-aware training).
- Compared tabular Q-learning, SARSA, DQN, PPO and offline CQL against a rule-based playbook, an oracle and a local LLM; CQL reached **97.6% from a fixed 4,000-conversation log with zero live training episodes**.
- Designed an evaluation framework with an independent database-state evaluator, an oracle for regret, held-out goal combinations, tool-failure and unseen-wording test sets; it exposed PPO collapsing on unseen goal combinations (**66.6% vs DQN 99.6%**), a gap the overall score hid.
- Implemented action masking in both acting and learning targets; without the guardrail DQN fell from 98.5% to 21.1% with 16.6% rule breaks, with it **0.0% across all agents**.

**Systems / full-stack flavour**
- Built an end-to-end support platform: seeded simulator, gymnasium environment, FastAPI backend streaming per-step events (SSE), React dashboard (live conversation, agent comparison, training curves, failure replay), SQLite run tracker, and **216 automated tests**.
- Added returns, damage claims (instant-refund tier by order value, report time and claim history) and policy lookup as new RL tools; retrained every agent once and froze the old results for a clean before/after.

**NLP / LLM flavour**
- Built a language layer in which embeddings route messages to goals (93.8% exact goal-set match on a fresh held-out wording set), a local LLM (phi4-mini) cross-checks parsing, and every LLM reply is fact- and meaning-checked, with templates as fallback (8 of 25 drafts rejected, 0 unsupported claims shipped).
- Showed a small local LLM is a poor tool-chooser for this task (28.3% success, 40.5 s per conversation vs DQN 100% in under 0.1 s on the same sample).

**Engineering-discipline flavour**
- Found and fixed my own evaluation mistakes (a leaked tuning protocol, a contaminated offline log, a spent test set), and documented 31 problems with causes, fixes and measured results.

**One-line versions**
- "Reinforcement-learning tool-orchestration agent for simulated customer support: DQN 98.5% on 1,410 held-out scenarios, 0 safety violations, 216 tests, FastAPI + React dashboard."
- "Compared 5 RL methods on a safety-masked support environment; offline CQL matched online agents without live training."

### 9.2 Portfolio blurb (short)
> **Agent-Orchestra-RL: learning which tool to call.** A reinforcement-learning agent that runs a simulated online shop's customer support. It decides, step by step, whether to look up an order, check a rule, refund, cancel, open a return, answer a policy question, ask the customer or hand over to a human. Hard safety rules make illegal actions impossible, an independent evaluator checks the final database, and five RL methods are compared against a hand-written playbook and a local LLM. DQN reaches 98.5% on 1,410 held-out scenarios with no rule violations. Built with Python, PyTorch, FastAPI, React and SQLite.

### 9.3 Portfolio write-up (longer, section outline)
1. **The question** (which tool, or stop?) and why it matters (cost, latency, safety).
2. **The simulated shop** (six goals, real business rules, five scenario types, tool failures).
3. **How the agent works** (language layer, RL policy, safety mask, tools, evaluator).
4. **How I tested it** (independent evaluator, oracle, held-out sets, ablations).
5. **What I found** (the ranking table, the held-out-combination gap, what the guardrail is worth, offline RL).
6. **What went wrong and what I learned** (pick 3 stories from section 8).
7. **Try it**: the dashboard and its demo customers (below).
8. **What I would do next** (section 11).

**Demo script (3 minutes):** (1) Ishaan Verma, "the item in my order ORD-9001 arrived broken": buttons for exchange or refund, confirm the condition, yes, instant refund of 180 rupees. (2) Tanvi Kulkarni's big damaged order goes to staff. (3) Rishi Pillai, "i want to return my order": a return opens; use the "Inspection passed" button in the staff panel and the refund is released. (4) A policy question, "what happens if my order is lost?". (5) Open Compare to show the held-out-combination gap and Language to show the router numbers. **Restore original data** resets everything.

### 9.4 Skills to list
Reinforcement learning (DQN, PPO, Q-learning, SARSA, offline CQL, action masking, reward design), evaluation design (held-out sets, ablations, regret, pass^k), PyTorch, gymnasium, NLP with sentence embeddings, LLM integration with output verification, FastAPI, React, SQLite, pytest, experiment tracking and reproducibility (seeded runs, saved configs).

---

## 10. Interview question bank

### RL
**Why RL here and not just an LLM agent or rules?** The decisions are sequential tool choices with costs, rules and failures. A trained policy is fast (under 0.1 s), consistent and testable. The small LLM I benchmarked got 28.3% at 40.5 s per conversation. The honest part: a hand-written playbook scores 99.9% because the shop's rules are fully known, so RL's advantage would be larger where rules are hard to write down.

**Describe the MDP.** State of 85 numbers (goals, verification, tool results, failures, budget, parser confidence), 16 discrete actions, a mostly outcome-based reward from an independent evaluator, episodes ending on finish, hand-over or 16 steps. No hidden truth in the state; the environment fills in arguments from verified context.

**Why DQN, PPO, CQL and the tabular methods?** They learn differently: tables, value-based deep RL with replay, policy gradient, offline from a fixed log. Differences showed up in sample efficiency (DQN 933 episodes to 90% vs Q-learning 4,000) and in generalisation to unseen goal combinations, not on familiar scenarios.

**How does action masking work and why is it in the targets too?** The mask comes from the state and removes illegal actions before the agent chooses. In the learning targets, the max over next actions is taken over legal actions only; otherwise the agent would bootstrap from actions it can never take.

**What is offline RL and why does CQL matter here?** Learning only from logged data. CQL adds a conservative penalty on actions the log does not support. It reached 97.6% from 4,000 logged conversations with zero live steps. Removing the penalty gave a slightly higher success rate (98.7%) but a wasteful agent (7.6 steps vs 5.3, regret 0.53 vs 0.24). Its weak spot is knowing when to hand over, plausibly because those cases are rare in the log.

**Why did PPO fail on unseen combinations?** I do not know; I did not test it. Hypothesis: it saw those combinations of goal flags only as new input patterns. A next experiment would be goal-permutation augmentation or training on more combinations.

**How did you design the reward?** Small cost and latency penalties, +1 per handled goal, +5 or -2 at the end from the evaluator, -5 per violation. Removing the +1 per goal barely changed results, so dense shaping was not needed here.

**What is regret and pass^k?** Regret is oracle reward minus agent reward (oracle: hidden truth, tool failures off). pass^4 is the share of scenarios solved in all four runs, a consistency measure.

**How do you know it generalises?** Held-out goal combinations, tool failures, missing information, unseen wording, and new goals (returns, policy) as separate test sets. The overall number would have hidden PPO's 66.6% and the tabular methods' 7%.

### Safety and evaluation
**How do you prevent unsafe actions?** Four layers: input checks, a hard action mask in code (state-changing tools need a verified order, a passed eligibility check, a matching request, and the customer's own answers where relevant), reply checks, and escalation. Tools also re-check the rules. Result: 0.0% violations for every guarded agent; no refund before an inspection passed.

**Without the guardrail the numbers collapse. Should you worry?** It shows the policy alone is not safe; safety comes from the code around it, by design. The live chat never runs without the mask, and no unmasked agent is offered in the dashboard. One caveat: the evaluator counts an attempt as a violation even if a tool refuses it, so I cannot say how many unmasked runs would have changed the database wrongly.

**How do you avoid evaluating on training data?** Separate seed ranges per split, a test that checks no scenario is shared, three wording sets (examples, tuning, final test), and held-out goal combinations. When I read the errors on the final wording set I replaced it with a fresh one.

**What does "independent evaluator" mean?** It decides success from the ground truth, the final database state and the trace, never from what the agent says. It also flags a refund of a delivered item without an instant-refund claim or a passed inspection.

### Language and LLM
**How do embeddings fit in?** Only in the language layer: they match a message to known request types, give a scope score and a confidence. The router uses nearest example sentences per class, with typo repair from its own vocabulary. The policy never sees text.

**How do you keep the LLM from making things up?** The LLM extracts goals into a strict JSON schema and the router cross-checks it; a goal with no router support is dropped. For replies, the LLM only rewords verified facts, and a checker looks for invented ids, dates, numbers, claims and flipped meaning; failures fall back to the template. Questions and policy answers are never LLM-worded. In my runs 8 of 25 LLM drafts were rejected and none with unsupported claims shipped. The checker covers invented ids, dates, numbers, status claims, currency and flipped meaning.

**What was the weakest part of the system?** Language. Real-parser mistakes cost the agents up to 8.3 points, the router's confidence did not flag any of its wrong parses, and LLM wording needs checks.

**How does the agent handle "where is my order" with several orders?** A deterministic resolver using the same business rules as the tools: named order, conversation ("the other one"), only order, then inference from the goal (for delivery, orders still on their way). One match is assumed and stated; several are listed; none qualifying is explained. Money-changing actions still wait for a yes.

### Engineering
**How did you structure the project for reproducibility?** Typed YAML config copied with every run, seeded worlds and scenarios, versioned state layout (checkpoints from a different layout are refused), and old results frozen when the task changed.

**How did you test it?** 216 tests: business rules case by case, hand-built golden scenarios (including the example from the brief), safety invariants (a random legal policy must never break a rule), evaluator and metrics, language, order inference (including a property test over generated worlds), return and damage flows through the API, policy questions, and a real background job. I also drove the dashboard in a headless browser for the main flows.

**Describe the backend and dashboard.** FastAPI with an orchestrator that emits one event per stage (start, parse, state, decisions, tools, reply, evaluation, done) streamed over server-sent events and saved to SQLite so any run can be replayed; background jobs with validated arguments; a React dashboard with seven pages.

### Behavioural
**Tell me about a mistake.** Use story 3 (contaminated CQL log), 10 (spent test set) or 9 (building before agreeing). Structure: what happened, how I noticed, what I changed so it cannot recur.

**Tell me about handling feedback.** Stories 6 and 8: real user messages broke things my tests did not; I rebuilt the tests from their exact messages and changed how I report fixes.

**What would you do differently?** Decide the test sets before looking at any errors; agree a design in plain words before building; test the user's exact flow before saying "fixed".

---

## 11. Limitations and next steps (say these yourself before someone asks)
- Everything is simulated; the shop's rules are simple and fully known, which is why a hand-written playbook can be perfect.
- Three training seeds; some spreads are large (PPO with failure training: 77.6% ±14.1 on held-out combinations). Only five goal combinations are held out; PPO's failure is unexplained.
- The evaluator's code also drives the terminal reward, so agents are optimised for what it measures.
- A customer lying about an item's condition is only modelled as an inspection result after the episode, not something the agent must detect.
- The agent does not check a policy before acting on a request; it looks a policy up only when asked.
- LLM results use a 3.8B model on CPU and small samples (60 messages, 60 scenarios, 25 replies).
- No user study.

**Next steps:** test why PPO fails on unseen combinations; let the agent check a policy before it acts; add more hand-over cases to the offline log; make the router's uncertainty informative or use LLM disagreement to trigger questions; repeat the LLM benchmark with a larger model; add a second domain with the same environment code.

---

## 12. Quick facts and cheat sheet

- **Counts:** 16 actions, 85-number state, 6 goals, 7 test sets, 1,410 scenarios x 4 runs, 3 seeds, 216 new tests (plus the original project's 25 passing tests and one stale test I reported but left alone).
- **Success (overall):** rule-based 99.9%, DQN 98.5% (99.6% failure-aware), CQL 97.6%, PPO 94.0%, Q-learning 68.0%, SARSA 66.9%, random 7.6%.
- **Held-out combinations:** DQN 99.6%, CQL 97.2%, PPO 66.6%, tabular about 7%.
- **Tool failures:** plain learners 79% to 94%; failure-aware DQN 98.2%, PPO 98.5%.
- **Returns / policy:** DQN 98.8% / 100%, PPO 100% / 99.7%, CQL 96.8% / 100%.
- **Language:** router 93.8% on fresh held-out wording; policy topic 95.2%; end-to-end cost of language errors up to 8.3 points; LLM as tool-chooser 28.3%.
- **Speed:** DQN to 90% in 933 episodes; CQL needs 0 live steps; full retrain about 33 minutes.
- **Thresholds (config):** instant damage refund up to 500 rupees, 48-hour report window, 2 claims in 30 days, 7-day return window, high-value refund limit 5,000 rupees.
- **Run it** (Windows cmd, from the repo root): `venv\Scripts\activate.bat`, then `python -m ecommerce.backend.main`, open http://127.0.0.1:8000 (Ctrl+F5). Tests: `python -m pytest ecommerce/tests -q`. Demo customers CUST-0061 to CUST-0065; "Restore original data" resets the demo.
- **Glossary:** *state* what the agent is told now; *action masking* removing illegal actions before choosing (and from the learning targets); *oracle* a planner with the hidden truth; *regret* oracle reward minus agent reward; *pass^k* solved in all k runs; *offline RL* learning from a fixed log; *CQL* offline Q-learning with a conservative penalty; *held-out* never used for training or tuning; *ablation* removing a part to see what it was worth; *SSE* one-way server-to-browser stream.

### Say it like this / avoid saying
- **Say:** "in a simulated shop", "on 1,410 held-out simulated scenarios", "the hand-written playbook still scored higher", "I did not test why PPO fails".
- **Avoid:** implying real customers or production deployment; "RL beats rules" (it did not); claiming the LLM result generalises to larger models; comparing the old (13-action) numbers with the new (16-action) ones as if one test.

Writeup: https://pavithra2870.github.io/Agent-Orchestra-RL/

Demo: