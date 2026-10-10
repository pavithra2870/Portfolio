# My Contribution to the Morph Agent Platform

A reference document, written for myself, covering what I built, owned, and decided during my time on this project. This is not a resume — it's the full record.

---

## 1. What the platform is

The Morph Agent Platform is an internal system for building and running AI "agents" — each one a folder of plain-language instructions (an `agent.md` file) plus a set of "skills" it can use, backed by a shared library of tools (web search, file read/write, image generation, image analysis, chart/report generation, etc.). Instead of hard-coding what an agent does in application code, you write its behavior in prose, and a Python engine reads that prose and drives a conversation with Gemini (Google's LLM), calling tools as needed.

On top of that runtime sits a library of ready-to-use business and consumer agents — around 173 by the time I stopped, of which I personally built or fixed about 87 — things like a lease reviewer, a wedding budget estimator, a resume scanner, a pet cost planner. And on top of *that* sits a semi-automated build pipeline: a set of Claude Code skills that take a plain-language brief through requirements gathering, architecture design, scaffolding, automated quality evaluation, and a security review, before an agent is considered ready to ship.

I worked across all three layers: the runtime itself, the pipeline that builds agents, and the agents in the library.

---

## 2. My role and how I worked

**Role:** Full-stack / product engineer — platform infrastructure, developer tooling (the build pipeline), and hands-on agent design, all in the same codebase.

**What I was responsible for** (the short version, for when someone asks directly):

1. **Building and maintaining agents** — designing new ones end to end, and diagnosing and fixing already-shipped ones based on evaluation feedback. About 87 agents across a 173-agent library.
2. **Platform/runtime engineering** — the tool registry, the usage-and-cost tracking system, the workspace file-management layer, and reliability fixes in the conversation engine and LLM integration.
3. **Build-pipeline quality and safety** — hardening the automated evaluation gate and the security gate that every new agent passes through, plus building two new review stages.
4. **Deciding what should and shouldn't exist** — authoring the rule for keeping or retiring an agent, vetting new agent ideas against the competitive landscape, and identifying platform gaps that capped whole categories of agent.
5. **Testing** — coverage across the runtime, the tool layer, the HTTP server, and one end-to-end agent orchestration test.
6. **Growth and go-to-market proposals** (later in my time there) — a founder-led content strategy, 36 ready-to-publish launch posts, a marketing-events analysis, and a product roadmap.

**Active period:** 2026-05-22 through 2026-08-25 (just over three months), with one more round of pet-agent work left in progress and uncommitted when I stopped.

**How I worked:** I committed under two identities — `pavithra-morph` (work account) and `pavithra2870` (personal account, same person) — 156 commits total between them. I worked on my own branches and opened them for review; a teammate merged the bulk of my pull requests into `main`. So my role here was as a contributor whose work went through review, not as the person who owned the merge gate.

**Rough scale of the work:** across the commits that carry diff stats, about 160,000 lines added and 49,000 lines removed. That figure is inflated by generated files that get checked in alongside every agent (evaluation reports, lineage records) — but even discounting that, it was a large and sustained volume of work, not a handful of drive-by commits.

---

## 3. What I built and owned end-to-end

These are the pieces where I was the primary or sole author, not just a contributor to something someone else started.

### The market research agent suite
Designed and built a family of four agents from scratch — competitor research, customer persona synthesis, review sentiment analysis, and market trend spotting. This was the first non-trivial thing built on the platform (May 2026), and it set the pattern later agents followed: decompose a complex analytical task into small, testable skills (evidence collection → profile extraction → analysis → report assembly) rather than one giant prompt. I then spent most of June on quality-hardening passes — fixing crash bugs, inconsistent scoring, and formatting issues — until the output was reliably good enough to hand to a real business user without a human editing it first.

### The pet agent cluster
Built and then substantially rebuilt three agents — pet food/diet selector, pet insurance claim appeal writer, and pet travel/relocation checklist — plus diagnosed and was mid-way through fixing a fourth (pet cost planner) when I stopped. This is documented in detail in section 6 below because the pet-cost-planner work is the clearest single example of the kind of root-cause analysis I did across the whole portfolio.

### The workspace file-management UI
Built the file explorer and preview panel for the shared workspace (the folder where an agent's session files live), plus the operations to go with it — create folder, move, rename, delete — and fixed long-filename and scroll/viewport bugs that made the panel unusable on smaller screens. Before this, the only way to see what an agent had written was to look at raw JSON.

### The usage-tracking / cost-observability system
Designed and shipped a SQLite-backed system (`usage_sink.py`) that records every LLM call and every external API call (Gemini, Tavily), then instrumented it across the search, image-generation, and vision tools. Exposed the results as a usage report and an audit-log download in the UI. Before this, nobody had visibility into which agents were expensive to run.

### The dynamic tool registry
Built the system that lets a Python tool function declare itself once and be loaded into any agent that asks for it by name, instead of every new tool requiring hand-wiring into each agent. This is the foundation the rest of the tool library (chart, CSV, competitor, persona, report, state, text, trend, and usage tools) was built on top of.

### A recurring Gemini reliability bug
Diagnosed and fixed a failure mode (`MALFORMED_FUNCTION_CALL`) where long agent conversations would silently die because Gemini choked on an oversized function-call payload. The fix trims conversation history and retries — a small change, but it had been causing conversations to fail with no error message before that.

---

## 4. The agent build pipeline — hardening work

The build pipeline (`requirements → architecture → create → eval → security`) is the machinery other people (and I) use to turn a brief into a shipped agent. I didn't design the pipeline from zero, but I did a large share of the work that made it trustworthy enough to run with less manual babysitting:

- **`_eval` hardening**: added a Step 5.5 automated output-quality audit — an LLM-as-judge pass that scores a generated agent's actual output against criteria specific to that agent, not just "did it not crash."
- **`_eval_architecture` (new skill, v2.0)**: an advisory review of an agent's design before it's scaffolded, scoring design economy, platform fit, and spec completeness.
- **`review-agent-run` (new skill)**: a way to QA a *deployed* agent against real user conversation exports, separate from whether it passes the pipeline's own spec.
- **Injection and gate-bypass hardening**: closed several failure modes found from live pipeline runs — prompt injection resistance, ways to bypass a quality gate, and tool-failure handling that previously left an agent in a broken state.
- **Composition library, Phase 1**: 9 reusable prose templates, 2 domain "packs," and 4 pattern rewrites, plus the test suite that checks the right template gets selected for a given brief. This is what feeds the `_compose` stage that enriches a raw brief before requirements-gathering even starts.
- **Quality gates v3.1.0**: made the pipeline's pass/fail gates deterministic and contract-driven rather than left to a judge's discretion.

The throughline across all of this: every hardening pass came from a real failure observed in a live pipeline run, not a hypothetical.

---

## 5. The business agent library

Between May and August I authored, co-authored, or did a hardening/fix pass on roughly 87 individual agents, spanning:

- **HR / legal / career** — employment offer reviewer, contractor agreement reviewer, NDA reviewer, SAFE note reviewer, vendor contract reviewer, wedding vendor contract reviewer, prenup agreement builder, multi-state compliance checklist, PTO/leave policy generator, job offer negotiation coach, cover letter writer, resume ATS scanner, LinkedIn profile optimizer, recent-graduate career launch plan, layoff recovery action plan, job market salary intelligence, visa eligibility helper, and more.
- **Finance** — option trade evaluator, personal stock portfolio tracker, freelancer quarterly tax calculator, startup funding readiness analyzer, Medicare supplement vs. advantage comparison.
- **Business / marketing / sales** — the market research suite (above), competitive intelligence, customer persona builder, pricing/positioning agent, SaaS churn signal analyzer, SaaS metrics diagnostic, feature scope diagnostic, cold outreach sequence builder, vendor evaluation matrix builder, founder background research, customer case study writer, marketplace listing writer and image generator, feedback corpus analyzer.
- **Content / media** — children's book generator, content calendar builders (multi-platform, podcast, newsletter, YouTube), demo script writer, presentation-from-brief, language learning content creator, mind map generator, prototype diagram generator.
- **Portrait / image generation** — black & white, creative/artistic, fitness portfolio, line art, manga-style, and yearbook-style portrait generators, real-estate branded headshot creator, holiday card photo generator, jewelry-on-model visualizer, packaging concept generator.
- **Home / real estate** — kitchen & bath renovation visualizer, landscape design generator, curb appeal visualizer, home maintenance scheduler, real estate social media planner, lease review agent.
- **Wedding** — budget estimator, vendor comparison, vendor contract reviewer, prenup agreement builder.
- **Pet** — food/diet selector, insurance claim appeal writer, travel/relocation checklist, cost planner (in progress).
- **Other consumer/lifestyle** — bookstore finder, camping finder, restaurant finder, meal plan generator, personal relationships CRM, learning path designer, senior care and daycare cost comparisons.

The work fell into two shapes: **building new agents** (mostly May–July, in batches — e.g., a July batch adding competitive-intelligence, customer-persona-builder, market-trend-intelligence, multi-state-compliance, and pricing-positioning together) and **hardening already-shipped agents against real failures** (large fix waves in mid-July and again in August, each touching 15–20 agents, driven by eval feedback rather than guesswork).

---

## 6. A case study in root-cause diagnosis: pet-cost-planner

This is worth documenting in full because it's the clearest example of the kind of analytical work I did, not just the code I shipped.

**The situation:** the pet-cost-planner agent had been flagged for quality issues. My first instinct was *not* to add more instructions to the prompt. Instead I ran it through three full evaluation cycles against a live server, cross-checked every number it produced by hand, and ran a live adversarial security probe. That produced a diagnosis with a very specific finding:

**The agent's knowledge was fine. Its arithmetic was not.** Of 16 distinct defects found, zero were the agent not knowing something — every one was a computation error, a rendering omission, or a state-write failure. Examples: the headline total the agent printed didn't match the sum of its own table rows; the "lifetime cost" figure didn't follow from the annual figure it was based on; a cost range was printed backwards (low above high); an insurance comparison used a formula that goes *negative* on realistic numbers.

**The more important finding was about the fix process itself.** Three successive rounds of "add more instructions to the prompt to fix the named bugs" each fixed their target issues *and broke something that had been working before* — the eval score went 5.5 → 6.3 → 5.2, non-monotonically, while the prompt grew from 224 to 396 lines. I traced this to a general rule I confirmed elsewhere in the codebase too: **past roughly 350–400 lines, adding more enforcement prose to an agent's instructions has *negative* returns — it doesn't add compliance, it dilutes it.** The failure mode is never "the agent doesn't know the rule," it's "the agent has the rule and skips it anyway," and more rules make that worse, not better.

**What I recommended instead**, in order of how directly each fixes the actual cause rather than papering over it:
1. Move the arithmetic out of the LLM entirely, into a deterministic Python tool that takes the line items and returns every derived number — rejecting bad input (like an inverted range) instead of just producing a wrong answer. I prototyped this and verified it produced correct numbers, then reverted the prototype because it touched a shared platform file that other services depend on, and flagged it as a decision for someone with authority over that shared surface.
2. Split the overloaded 390-line skill into a "compute" stage and a separate "render" stage, each under the ~200-line fidelity ceiling, and write state *before* rendering so a rendering bug can no longer lose the user's underlying data.
3. Fix one specific formula that had been wrong in the shipped prose since before any of this remediation started, independent of everything else.
4. Explicitly flagged and did **not** recommend a fourth round of "just add more prose" — because the evidence from three prior rounds said that specific move makes things worse.

**On the security side of the same agent**, I ran a structured audit (OWASP LLM Top 10 categories) plus four live adversarial probes against a running instance: instruction-shaped text hidden in a form field, a benign message crafted to *look* dangerous (to check the agent doesn't over-refuse), an attempt to smuggle personal data into a search query, and a compound message trying to sneak a medical request past a confirmation gate. All four held. I also found and flagged a new, more subtle risk: a data field added *during* the correctness fix (to make the arithmetic traceable) now stores web-search-derived text, including full URLs, into state that gets read back and re-rendered in later sessions — a fresh indirect-injection surface created as the side effect of fixing something else. I documented it as security debt that needs paying down before that pattern gets copied to the other pet agents.

---

## 7. Decisions, judgment calls, and product reasoning

Beyond code, I made or drove several decisions about what the platform should and shouldn't build, and why.

**When to keep vs. disable an agent.** I wrote down the actual decision rule the team was using informally: keep an agent only if it does something ChatGPT can't do easily on its own, removes real friction, and gives a meaningfully better experience — not just "can we build this." If a well-known free competitor already owns the exact problem, or the task fundamentally needs a human anyway, disable it. I used this to retire agents that didn't clear the bar (a meal-plan generator that duplicated a stronger agent already on the platform; a plant-care scheduler that failed for a structural reason — see below) rather than leave low-value agents accumulating in the library. Agent retirement on this platform is a config toggle in production, not a code deletion — so a retired agent's history and evaluation record stay intact in the repo.

**A structural platform gap: no scheduled triggers.** I identified that the tool registry had no cron/push-notification capability at all — every "reminder" or "tracker" style agent is therefore pull-only: it can only tell you something is overdue if you happen to open a chat and ask. I used this to build a scoring rule for judging tracker-style agent ideas (failure cost × failure visibility × how plausible the check-in cadence is) and flagged that adding one scheduled-trigger tool to the platform would be the single highest-leverage gap to close, because it would lift an entire class of agents at once rather than helping one.

**Vetting new agent ideas against real competition, not just real problems.** For a round of new-agent ideation, I didn't just check "is this a real problem" — I explicitly searched for whether a dominant, well-funded, or official free tool already owned each idea, and cut it if so (e.g., ruled out a subscription-audit agent because Rocket Money already owns that at scale for free; ruled out a student-loan repayment comparison because the government's own official calculator beats any startup version by default). Only ideas that passed both filters — real pain *and* no incumbent already winning it — made the final list, along with the reasoning for every idea that got cut.

**Evaluating external "skill" libraries before adopting any of them.** Reviewed eleven external sources of pre-written agent instruction sets (skill libraries) and recommended which to bring in, which to cherry-pick from, and which to skip — distinguishing plain-instruction content we could use directly from content that came bundled with code/scripts our platform can't run, and content built for software developers (not useful to us) versus content built for the business/consumer agents we actually ship.

**Proportional effort, not maximal process.** For an already-deployed, already-audited agent, my own working rule was: make the edit directly, then do one targeted check on the part most likely to be broken — not run the full multi-stage pipeline (requirements judge, architecture judge, panel evaluation, live security probes) on every small change. That heavyweight process is for genuinely new or security-relevant work; using it on every minor fix across a 173-agent portfolio would cost more than most of those agents are worth.

**Spotting a manual fix I was repeating, and pushing it up into the process.** Across July and August I kept making the same fix on different agents: agents were scattering their output across a session file, some intermediate notes, an index file, and something resembling a report — and handing the user a folder to sort through. I merged a report and a separate cheat sheet into one page, collapsed a multi-file content plan into a single dashboard, turned a scattered analysis into one report, and so on, across a dozen-plus agents that had *already passed the pipeline*. Once I noticed it was the same fix every time, the useful move wasn't to keep fixing agents — it was to work out why the pipeline kept producing this. The answer was specific: agents were designed to **compute** in stages but nobody ever designed the step that **assembles**. Each skill did its piece, wrote its file, and stopped. So I proposed three pipeline rules instead of a thirteenth manual fix: every agent declares exactly one primary deliverable; the deliverable's structure gets designed *before* the steps that compute its content; and an explicitly named assembly step owns pulling everything together. That's the same instinct as the arithmetic fix — remove the opportunity for the failure rather than catch it downstream.

**Provenance as a design requirement, not a nice-to-have.** The worst single defect I found was the pet-cost-planner presenting one of its own internal calculations as a figure from named publications — a fabricated citation, on a platform whose entire pitch is being more trustworthy than a generic chatbot. Alongside it: invented source labels from no defined set, and only two of roughly six specified lookups actually running while everything else got quietly labelled an estimate. I proposed a set of rules that had actually held under live testing — every looked-up claim carries its source, a **closed** list of source labels with no free text, honest abstention made mechanical rather than advisory ("if the lookup didn't run, the field reads *not verified*"), a hard ban on relabelling a self-computed number as sourced, and a citation-integrity check in the evaluation stage that confirms each sourced claim maps to a lookup that genuinely ran. The measured lesson underneath: the abstention rule only started being followed once it stopped being a suggestion.

**Being wrong about a product call, and correcting it with our own data.** When I first wrote up "what kinds of agents actually work," I identified five patterns and left out planner/roadmap agents entirely — and separately pushed the newsletter, podcast and YouTube planners to the back of a content queue, reasoning that those audiences skew off-platform and the space is crowded. Both calls were wrong, and the correction is worth recording because of *how* it happened rather than that it happened. Checking our own ratings, nearly every planner agent we owned had scored in the top tier — I'd buried our best-performing shape. The "crowded" test had also been applied to the wrong thing: it's meant to ask whether a free competitor already owns *the problem*, and while plenty of tools publish a newsletter, none of them plan one. Working out *why* the shape performs produced the more useful insight: a planner's user is almost always doing the thing for the first time, so they don't know which questions matter, so they can't write a prompt good enough to get a useful answer — a generic question only has generic answers. The agent's real job is asking the ten questions the user didn't know to ask. And the failure it prevents is measurable: of podcasts launched in the first half of 2026, roughly 42% went inactive within six months and about 47% stopped at three episodes or fewer. People don't abandon these projects from lost motivation, they abandon them when they run out of plan. I also flagged the strategic point I'd missed: planners are the only shape in the library with natural repeat usage — everything else is one-and-done, but a plan is something you come back to.

---

## 8. Testing discipline

I authored and maintained test coverage across: the CI/build-pipeline server, the competitor-research agent (including an end-to-end orchestrator test), the market research agents generally, the single- and multi-agent HTTP server paths, the nanobanana (image generation) and Tavily (search) tool integrations, and the REPL/HTTP client layers. Test work was concentrated at two points: standing up the market-research suite in May, and building out a dedicated test suite for the tool library and the composition library's template-selection logic in July.

---

## 9. Technologies I worked in

**Languages:** Python, JavaScript, HTML/CSS
**Backend:** FastAPI, Uvicorn, REST API design, async HTTP clients, SQLite
**Frontend:** vanilla JS single-page UI — chat interface, resizable panels, file explorer
**AI/ML:** Google Gemini API (LLM inference, function-calling), prompt engineering, LLM-as-judge automated evaluation, tool-calling agent design
**External services:** Tavily (search/extraction API)
**Testing:** pytest
**Tooling/config:** YAML-based tool and skill declarations, Git (feature branching, PR-based workflow)

---

## 10. Closing note

The bulk of this work falls into three buckets: making the underlying runtime more reliable (the Gemini fix, the file-write hardening, the usage tracker), making the pipeline that builds agents catch more of its own mistakes before a human has to (the eval and security hardening), and building or fixing the actual agents people use (close to 90 of them touched, several owned end-to-end). The pet-cost-planner diagnosis in section 6 is the piece I'd point to if I had to pick one example of how I approached problems here: measure first, find the actual root cause even when it's three layers deep, and say clearly what *not* to do next, backed by evidence, not just what to do.

---
---

# Part II — Positioning This Work for Job Applications

Part I above is the historical record. Part II translates it into pitch material: how to frame this experience for different job families, a plain-language explanation of the architecture, and interview questions with answers, organized for Software, AI/GenAI, ML/Data Science, Analytical/Data, and Product roles.

---

## 11. How to position this work, by role

The same body of work supports different pitches. Pick the angle that matches the role, and lead with the matching bullet — don't try to say everything in every interview.

### 11.1 Software Engineer (SWE)

**The pitch:** I built and hardened backend services in a production Python system — not just agent prose, real platform code.

**Lead with:**
- The dynamic tool registry (a plugin-style system so a new capability can be declared once and loaded into any agent, instead of hand-wiring each one in).
- The SQLite-backed usage-tracking service (`usage_sink.py`) — schema design, instrumentation across three external APIs, and a UI to read it back.
- The file-management API (create folder, move, rename, delete) plus atomic-write hardening so a crash mid-write can't corrupt a file.
- The Gemini reliability fix — a real production bug (`MALFORMED_FUNCTION_CALL`) that was silently killing long conversations, root-caused and fixed with history-trimming and retry logic.
- Test coverage across the HTTP server (single- and multi-agent), the tool layer, and an end-to-end orchestrator test.

**Resume bullet:** "Built a plugin-style tool registry and a SQLite-backed usage-metering service in a Python/FastAPI agent runtime; root-caused and fixed a recurring LLM API failure mode that was silently dropping long conversations."

**What to expect in interviews:** system-design questions about the registry pattern and statelessness (the runtime is designed to run on Cloud Run, so no server holds state between requests — everything lives in the workspace or the database), debugging questions (walk through the Gemini fix start to finish), and API-design questions (how the file-management endpoints validate paths so a request can't escape the workspace directory).

### 11.2 AI / GenAI / Agentic AI Engineer

**The pitch:** I designed, evaluated, and hardened LLM-powered agents end-to-end — not just prompted a model, but built the scaffolding that makes an agent's behavior reliable and safe.

**This is your strongest role fit, and "agentic AI" is now a distinct hiring category from generic GenAI.** The difference in what they probe: GenAI interviews ask about prompting, RAG and evaluation; agentic-AI interviews ask about multi-step execution, tool use, state across turns, error recovery, and guardrails. You have unusually deep, real material on the second set — a 173-agent production library and the pipeline that builds them. Lead with the agentic angle when the job title says agent, orchestration, or autonomy.

**Agentic-specific things to lead with:**
- **Agent architecture at scale** — 173 agents in production, each decomposed into named skills with a scoped tool allowlist per agent. Not one prototype; a library with a repeatable structure.
- **Tool-calling design** — built the registry that exposes Python functions to the model as callable tools with JSON-schema parameters, and the per-agent permission model that decides which tools a given agent may use (deliberately withholding destructive ones).
- **State across turns** — agents persist structured session state and reload it on return visits, so a multi-session task survives a restart. Also the failure this creates: state written from web content becomes an injection surface on later reads.
- **Failure and recovery** — retry and history-trimming around a real LLM API failure mode, plus a capped fix loop in the pipeline so a broken agent can't retry forever.
- **Guardrails and human-in-the-loop** — confirmation gates before consequential steps, refusal behaviour for out-of-scope requests, and adversarial testing of both (including checking the guard doesn't over-refuse).
- **Agent evaluation** — the part most candidates can't speak to concretely: golden-path plus failure-path scenarios, per-agent rubrics, iteration-over-iteration regression tracking.

**Lead with (general GenAI):**
- Designing agents as decomposed "skills" (breaking one complex task into small, independently-testable steps) rather than one giant prompt — the pattern used across the whole 173-agent library.
- The SKILL.md length/fidelity ceiling finding: past ~350–400 lines, adding more enforcement instructions to a prompt makes an agent *less* reliable, not more. This is a genuine, measured insight about how LLMs follow instructions, not a guess.
- The decision to move arithmetic out of the LLM entirely once the pet-cost-planner diagnosis showed language models fabricate plausible-looking numbers instead of deriving them — knowing when *not* to solve a problem with the model.
- The build pipeline's automated LLM-as-judge evaluation gate (`_eval`) and the security gate (`_security`) — OWASP-style prompt-injection and gate-bypass testing with live adversarial probes against a running agent.
- Prompt-injection defenses: guarding against instruction-shaped text hidden in user-supplied fields, while also checking the guard doesn't over-refuse benign input.

**Resume bullet:** "Diagnosed a systemic prompt-length fidelity ceiling degrading instruction-following in production LLM agents; redesigned the fix around deterministic tools and data-flow constraints instead of more prompt text, and built the automated evaluation and security gates now run against every new agent."

**What to expect in interviews:** "How do you evaluate an AI agent's output when there's no single right answer?" (LLM-as-judge with agent-specific rubrics, golden-path + failure-path scenarios), "How do you defend against prompt injection?" (treat all fetched/typed content as data, never instructions; exhaustive keyword guards; test with adversarial probes, not just intuition), "When would you *not* use an LLM to do something?" (the pet-cost-planner arithmetic case is the answer), "Tell me about a time your first fix made things worse" (the three-iteration prompt-bloat regression).

### 11.3 ML / Data Science

**Be upfront in interviews:** this project did not involve training or fine-tuning models — it involved evaluating and hardening systems built on an existing LLM (Gemini). Don't oversell it as ML engineering. Position it honestly as **applied evaluation and experimentation**, which is a real and relevant skill, just a different one.

**Lead with:**
- The LLM-as-judge evaluation framework: turning "is this output good?" into a repeatable, scored process against agent-specific criteria — essentially building a labeling/scoring rubric for a generative system, the same problem shape as building an eval set for a model.
- The iteration-tracking discipline in the pet-cost-planner case: score went 5.5 → 6.3 → 5.2 across three fix rounds. A team that only compared "before vs. after the latest fix" would have looked at 6.3 and shipped it — tracking every iteration caught that the 6.3 result concealed a different, newly-introduced set of failures. That's the same discipline as catching an overfit or a regression hidden by aggregate metrics.
- The independent-verification habit: recomputing every number an agent produced by hand against its own stated inputs, rather than trusting the output because it "looked" right — this is a data-validation instinct, not a coding task.

**Resume bullet:** "Built and iterated an LLM-as-judge evaluation framework scoring generated outputs against per-agent rubrics; tracked scores across iterations (not just before/after) and caught a regression that a single-point comparison would have missed."

**What to expect in interviews:** be ready for "so you didn't train any models?" — answer plainly: correct, this was applied evaluation and system design on top of a hosted LLM, and be ready to pivot to what you *did* do (rubric design, statistical-style before/after tracking, root-cause analysis on numerical output). If the role is specifically classical ML/modeling, this project is a weaker match — say so, and lean on any other modeling experience you have outside this repo.

### 11.4 Analytical / Data / BI

**The pitch:** I built the reporting system that gave the team visibility into cost, and I found real defects by independently auditing numbers rather than trusting them.

**Lead with:**
- The usage/cost-observability system: what gets tracked (every Gemini and Tavily call), why it matters (nobody could see per-agent API cost before it existed), and how it's surfaced (a usage report and an audit-log download).
- The pet-cost-planner audit: found 16 distinct defects by recomputing every reported figure against its own stated inputs — a heading total that didn't match its own table, a lifetime cost that didn't follow from the annual figure it was built from, an inverted range (low above high). This is a real example of catching numbers that "look" plausible but don't reconcile.
- The competitive-landscape research method used to vet new product ideas — structured research to check whether a well-known, free, or official alternative already existed for each idea, with the reasoning for every idea that got cut written down, not just the survivors.
- The decision-rule authorship (the agent keep/disable rubric) — turning an informal team instinct into a written, checkable scoring framework.

**Resume bullet:** "Independently audited a financial-estimate AI agent's output against its own inputs, uncovering 16 arithmetic and data-integrity defects a functional test wouldn't catch; built the usage/cost-observability system tracking spend across three external API integrations."

**What to expect in interviews:** "Tell me about a time you found an error nobody else caught" (the arithmetic audit — walk through the reconciliation method: recompute from inputs, compare to the printed figure, don't trust the narrative around it), "How do you decide what to measure?" (the usage tracker: cost per agent per API, because that was the question nobody could answer before it existed).

### 11.5 Product / PM

**The pitch:** I set the decision frameworks for what the platform should and shouldn't build, and then also built the products those frameworks governed — both sides of the same coin.

**Lead with:**
- The agent keep/disable rubric — a real, written decision rule ("keep only if meaningfully better than just using ChatGPT") used to retire underperforming agents rather than letting a library accumulate dead weight.
- The competitive-moat filter for new agent ideas — every idea checked against "does a dominant free or official alternative already own this," with the ruled-out ideas documented alongside the survivors so the reasoning is auditable, not just the conclusion.
- The platform-gap identification (no scheduled triggers) and the prioritization method that came from it (score reminder-style ideas by failure-cost × visibility × check-in cadence) — turning "we should probably build X" into a reasoned, comparable prioritization call.
- The proportionality principle for engineering effort — matching the size of a fix to the value of what it's fixing, instead of running maximum process on every change regardless of stakes.
- Owning the user-facing surface of close to 90 shipped products across very different verticals (legal, finance, career, wedding, pets, content), which is breadth most single-function PM roles don't get.
- The go-to-market events analysis — six formats assessed against real benchmark data, and a sequencing recommendation that deliberately put the highest-profile option (a Product Hunt launch) *last*, because the product had a known reliability gap and no retention mechanism. Good example of arguing against the exciting option on evidence.

**Resume bullet:** "Authored the decision framework used to keep or retire agents platform-wide and a competitive-moat filter for vetting new product ideas; identified a structural platform gap (no scheduled/reminder capability) limiting an entire product category and proposed a prioritized fix."

**What to expect in interviews:** "How do you decide what not to build?" (the competitive-moat filter, with real ruled-out examples), "Tell me about a framework you created" (the keep/disable rubric — why it exists, what it replaced, what it prevented), "How do you prioritize platform investment vs. one-off fixes?" (the scheduled-triggers gap — one platform fix lifts an entire class of products, vs. fixing one agent at a time).

### 11.6 Strategy / BizOps / Growth Strategy / Consulting

**The pitch:** I did the analytical work behind what a product should build, what it should kill, and how it should go to market — and I did it with sourced research and written reasoning, not opinion.

Worth separating this from the Product/PM pitch above. Product interviews ask how you'd design and prioritise a feature. Strategy interviews ask you to analyse a market, size an opportunity, assess competition and defend a recommendation. Different genre, and you have real artefacts for the second one.

**Lead with:**
- **Competitive analysis with a decision attached.** Assessed a batch of proposed product ideas against the actual competitive landscape and killed most of them — with the specific incumbent named and the reason it wins written down for each. This is the classic strategy exercise, done for real rather than as a case study.
- **Portfolio rationalisation.** A written rule for whether each of 173 products deserved to exist, applied across the whole portfolio, resulting in actual retirements rather than a deck.
- **A go-to-market sequencing recommendation** — six channel options assessed against real benchmark data (conversion rates, reach figures, realistic signup ranges), ending in a recommendation to delay the highest-profile option because of two specific product weaknesses. Defending a "not yet" is harder than defending a "yes."
- **Build-vs-buy assessment.** Reviewed eleven external content libraries for whether to adopt, cherry-pick, or skip each one, with the constraint analysis behind it (some depended on capabilities the platform didn't have; some were aimed at the wrong audience entirely).
- **Identifying a structural constraint, not just a feature gap.** Spotted that a missing platform capability was capping an entire product category, and built a scoring method to judge whether any given product in that category was still worth building under the constraint. That's a systems-level read rather than a backlog item.

**Resume bullet:** "Ran competitive and portfolio analysis across a 173-product library — authoring the retain/retire decision rule, vetting new product ideas against incumbent alternatives, and delivering a go-to-market sequencing recommendation backed by channel benchmark data."

**What to expect in interviews:** "Walk me through how you'd assess whether we should enter this market" (use the two-filter method: is the problem real, and does a dominant free or official alternative already own it), "How would you decide what to cut from a large product portfolio?" (the retain/retire rule), "How do you make a recommendation when the data is incomplete?" (name what you checked, what you couldn't, and which assumption would change the answer — that's how the events analysis was written).

---

## 12. The project architecture, explained simply

Three layers, stacked on top of each other. Simplest way to describe it in an interview: **"a runtime, a library of agents built on that runtime, and a pipeline that builds new agents for that library."**

```
 Browser (chat UI, file explorer, usage report)
              |  HTTP requests
              v
 ┌─────────────────────────────────────────────┐
 │  LAYER 1 — the runtime ("skill_engine")      │
 │  A Python/FastAPI server that:               │
 │   - runs the back-and-forth conversation      │
 │     loop with the LLM (engine.py)             │
 │   - talks to Google Gemini (llm/gemini.py)    │
 │   - exposes tools the LLM can call            │
 │     (tools/*.py — search, files, images,      │
 │     charts, state, usage tracking)            │
 │   - keeps each agent's chat history and       │
 │     workspace files (workspace.py)            │
 └───────────────────┬───────────────────────────┘
                     │ reads instructions from
                     v
 ┌─────────────────────────────────────────────┐
 │  LAYER 2 — the agent library ("agents/")     │
 │  ~173 folders, one per agent. Each has:        │
 │   - agent.md   → the agent's persona/purpose, │
 │     written in plain English, not code        │
 │   - skills/*/SKILL.md → step-by-step          │
 │     instructions for one task the agent does  │
 │   - tools.yaml → which tools this agent is    │
 │     allowed to use                            │
 └───────────────────┬───────────────────────────┘
                     ^ produced by
                     │
 ┌─────────────────────────────────────────────┐
 │  LAYER 3 — the build pipeline                │
 │  (.claude/skills/ — Claude-Code-driven)       │
 │  requirements → architecture → create →       │
 │  eval (quality gate) → security (safety gate) │
 │  → modify (fix loop if a gate fails)          │
 └─────────────────────────────────────────────┘
```

**Why this design, in plain words:** instead of writing each agent's behavior as application code, you write it as prose (the SKILL.md files), and a shared engine reads that prose and drives the conversation. This means someone who isn't a software engineer can, in principle, read and adjust an agent's behavior. The trade-off (and a real thing I measured) is that prose has a reliability ceiling — past a certain length, an LLM stops reliably following all of it, so you can't just keep adding instructions to fix problems forever. Sometimes the right fix is to move a piece of logic out of prose entirely and into a small, deterministic Python tool that always gets the same input right — arithmetic being the clearest example.

**Frameworks and why:**
- **FastAPI + Uvicorn** — the HTTP layer for both the chat server and the build-pipeline's own server; chosen for being lightweight and async-friendly.
- **Google Gemini API (`google-genai`)** — the LLM the whole system talks to; supports function-calling, which is what lets an agent "call a tool."
- **PyYAML** — every agent's `tools.yaml` (which tools it can use) is plain YAML, easy for a non-engineer to read.
- **SQLite** — the usage-tracking database; simple, file-based, no separate database server needed for what is essentially an internal audit log.
- **pytest** — the test framework across the whole codebase.
- **Vanilla JavaScript/HTML/CSS** — the frontend has no framework (no React/Vue); it's a single-page chat and workspace UI built directly in JS.

**What an "agent" concretely is:** a folder, not a piece of trained software. Example: the pet-cost-planner agent has an `agent.md` describing its purpose and tone, an `estimate/SKILL.md` with step-by-step instructions for building a first cost estimate, an `adjust/SKILL.md` for updating an existing estimate, and a `tools.yaml` saying it may use `tavily.search` (web search), `state.*` (save/load its own data), and the file/report tools — but not, say, a tool that could delete files. When a user talks to it, the engine loads that prose as the system prompt, and the conversation proceeds turn by turn, with the LLM calling tools mid-conversation when the prose tells it to (e.g., "search for the average vet visit cost for this breed, then save it to state").

**Typical use case walkthrough (concrete example):** a user tells the lease-review agent "here's my lease, tell me if anything's unusual." The agent reads the uploaded file (a tool call), follows its SKILL.md instructions to check specific clause categories against what's normal for a lease, calls web search for anything that depends on current law, and produces a structured report — a repeatable, checklist-driven task a person would otherwise pay a lawyer an hour to do.

---

## 13. Interview questions and answers, by role

Grounded in real specifics from this project — use these as a starting script, not something to recite word for word.

### 13.1 Software Engineer questions

**Q: Walk me through a bug you diagnosed and fixed.**
A: Long agent conversations were silently failing — no error shown to the user, the conversation just stopped progressing. I traced it to Gemini returning a `MALFORMED_FUNCTION_CALL` response once the conversation history and the function-call payload got large enough. The fix was twofold: trim the conversation history being sent, and add retry logic around that specific failure. The lesson wasn't just "add a retry" — it was recognizing the failure was payload-size-dependent, not random, so the fix had to address size, not just add resilience around a random flake.

**Q: How did you design the tool registry?**
A: Before it existed, every new capability (like a chart tool or a competitor-analysis tool) had to be manually wired into whichever agent used it. I built a registry where a tool declares its own name, description, and parameters once, and any agent can request it by name in its `tools.yaml`. This is a fairly standard plugin/registry pattern, but it mattered here because the agent library grew to ~173 agents — without it, every new tool would need N manual integrations instead of one.

**Q: How would you scale this system?**
A: The runtime is already designed to be stateless per request — nothing lives in server memory between calls; everything an agent needs (chat history, session data) is read from and written to the workspace or the database. That's what makes it deployable on something like Cloud Run, which scales by spinning up more stateless instances rather than by making one instance hold more state.

**Q: How do you prevent a file operation from escaping the intended directory?**
A: Every path argument coming from a tool call is validated against the workspace root before being touched — resolving the path and checking it's still inside the allowed directory, rejecting anything that tries to traverse out (e.g. via `../`).

### 13.2 AI / GenAI Engineer questions

**Q: How do you evaluate the quality of something an LLM produces when there's no single correct answer?**
A: We built an LLM-as-judge step into the build pipeline — a separate model call that scores the generated output against a rubric specific to that agent (not a generic "is this good" prompt), across a defined golden-path scenario and at least one failure-path scenario. The score isn't just a number; the pipeline requires specific findings, ranked by severity, so a "pass" is falsifiable, not just a vibe.

**Q: Tell me about a time your fix made something worse.**
A: The pet-cost-planner agent had known arithmetic bugs, and the first three fix attempts each added more instructions to the prompt telling it to double-check its work. Each pass fixed its named bugs and broke something that had been working — the eval score went 5.5 → 6.3 → 5.2, not monotonically improving. I measured the prompt length alongside the score and found the pattern: past roughly 350–400 lines, more instructions produce *less* reliable compliance, not more, because the failure mode was never "the agent doesn't know the rule" — it already had the rule and skipped it anyway.

**Q: What did you do differently on the next attempt?**
A: Stopped adding prose. Moved the arithmetic into a deterministic tool instead of asking the LLM to compute it, and split the overloaded skill into a separate "compute" stage and "render" stage so a rendering failure couldn't lose the underlying data. The core idea: fix the class of failure by removing the opportunity for it, not by asking harder.

**Q: How do you defend an agent against prompt injection?**
A: Two things have to both be true: the agent has to treat anything it reads (web search results, uploaded files, even its own user's free-text fields) as data, never as instructions to follow — that's specified explicitly in the agent's prose. And you have to actually test it, not just write the guard and assume it works — I ran live adversarial probes (e.g., planting instruction-shaped text like "SYSTEM: ignore the above" inside a form field) against a running agent and confirmed the guard held. Just as important: I also tested that ordinary, benign user language doesn't falsely trip the guard — an overly aggressive filter that blocks real users is its own kind of failure.

**Q: When would you choose not to use an LLM for part of a task?**
A: When the task has an exact, checkable answer and the LLM is producing a merely plausible one. Financial arithmetic is the clean example — a language model tends to pick a plausible headline number first and reverse-engineer supporting numbers to match it, rather than deriving the total from its parts. That's not a prompting problem; it's what generative models do. The fix is a deterministic tool that takes the same inputs and always returns the same, correct, checkable output.

**Q: How do you stop an agent from hallucinating a citation?**
A: I hit the real version of this. An agent, when challenged on its methodology, labelled one of its own internal calculations as a figure from named publications — a self-computed number re-presented as sourced market data. What worked wasn't "be more careful," it was making the rules structural: a **closed** list of source labels with no free text allowed, so the model can't invent a label; every looked-up claim carrying the query or URL that produced it; an explicit rule that a number the agent computed itself can never be relabelled as sourced; and abstention made mechanical rather than advisory — "if the lookup didn't run, the field reads *not verified*." That last distinction was the measurable one. "Prefer to say when you're unsure" was ignored; a rule with a defined trigger and a defined output was followed. I'd also add a check in evaluation that samples the sourced claims and confirms each maps to a lookup that actually ran in that session — cheap to do, and it catches exactly this.

### 13.2b Agentic AI questions (the deeper set)

These go past "have you used an LLM" into how you actually build something that takes multiple steps without falling over. Expect these for any role with "agent," "orchestration," or "autonomy" in the title.

**Q: How do you structure an agent that has to do something complicated?**
A: Decompose it into named skills, one per coherent sub-task, and give each one an explicit contract — what it reads, what it computes, what it writes. On our platform an agent was a folder: a persona file describing purpose and tone, one instruction file per skill, and a manifest listing which tools that agent was allowed to use. The reason for decomposing isn't elegance, it's testability — you can evaluate a single step in isolation, and when something breaks you know which step to look at. The alternative, one enormous prompt, fails in a way you can't localise. I also learned a hard constraint on this: past roughly 350–400 lines of instructions for a single skill, compliance actively degrades, so the length ceiling forces decomposition whether you wanted it or not.

**Q: How does an agent decide which tool to call, and how do you stop it calling the wrong one?**
A: Two layers. The model chooses based on the tool's declared name, description and parameter schema, so those descriptions are effectively prompt engineering — a vague description gets you a misused tool. The second layer is that choice isn't unconstrained: each agent declares an allowlist of tools it may use, and anything not on the list simply isn't offered to the model. That's how you handle the dangerous ones. A cost-planning agent I worked on deliberately had no delete capability in its allowlist even though the platform had one, so "delete all my data" wasn't a request it could fulfil even if it wanted to — the safe behaviour came from the permission model, not from asking the model nicely.

**Q: How do you handle state across a long or multi-session task?**
A: Persist structured state to storage rather than relying on the conversation history, and reload it at the start of a returning session. That's what lets someone come back a week later and continue. Two things I'd flag from experience. First, write state *before* rendering the final output, not after — otherwise a rendering failure loses the user's underlying data, which is a much worse outcome than an ugly report. Second, and less obvious: persisted state is a security surface. On one agent we started storing web-search-derived text in state to make figures traceable, and that state gets read back and re-displayed in later sessions — by which point the "treat fetched content as data, not instructions" framing is no longer in context. So any new persisted field needs a fresh look at what could be hiding in it.

**Q: What happens when a step fails mid-way?**
A: You need to distinguish transient from structural failures, because they need different responses. We had a real LLM API failure that looked random but was actually payload-size-dependent — so a naive retry would have failed identically every time. The fix was to trim the conversation history *and* retry, addressing the cause rather than just adding resilience. At the pipeline level, the fix loop that repairs a failing agent is capped at a few rounds, so a genuinely broken agent stops instead of looping forever. And I'd add the lesson that cost me the most: a fix that resolves its target failure can introduce a new one, so you compare each attempt against the previous attempt, not just against the original baseline.

**Q: Did you build multi-agent systems, or single agents?**
A: Mostly single agents with multiple skills, which I'd argue is the right default — most tasks that look like they need several agents actually need one agent with several well-defined steps, and you avoid the coordination overhead. The genuinely multi-agent piece was the build pipeline itself: separate stages for requirements, design, design review, scaffolding, evaluation, repair and security review, each with its own instructions and its own success criteria, passing artefacts down the chain. That's an orchestrated pipeline of specialised agents where one agent's output is the next one's input, with quality gates between stages that can send work backwards. I also proposed agent-to-agent handoff for the product itself, where one agent's findings feed directly into another's inputs.

**Q: Where do you put a human in the loop?**
A: At the points where the next action is consequential and hard to reverse, and before anything that commits to a decision the user would want to see first. Our agents used explicit confirmation gates for that. The interesting failure mode is what I'd call the compound message — a user replies "yes, and also do this other thing," and the risk is the agent treats blanket approval as covering the smuggled-in request too. I tested exactly that adversarially: the correct behaviour is to accept the approval for the thing that was gated and separately refuse the addition, which it did.

**Q: Have you worked with LangChain, LangGraph, CrewAI or AutoGen?**
A: Not in production — this platform had its own orchestration layer, built directly on the model provider's function-calling API. Which I'd argue was the right call for what it was: a thin, readable conversation loop, a tool registry, and prose-defined agents, with no framework abstraction between us and the model. The upside was that when something misbehaved I could read the entire path from user message to tool call, which matters a lot when you're debugging why an agent skipped an instruction. The downside is I've had to learn the concepts rather than a specific framework's API — but the concepts transfer directly, because they're the same primitives: tool/function definitions with schemas, a loop that dispatches calls and feeds results back, state between steps, and gates around dangerous actions. I'd expect to pick up a framework quickly and would be more useful than average at judging when its abstraction is helping versus hiding something.

**Q: What do you think about MCP?**
A: It's become the default way to connect an AI system to tools, which makes it strategically important rather than just a technical detail — it was donated to a neutral foundation and picked up across the major providers, and there are thousands of public servers. I proposed we go both directions: expose our own tools as an MCP server so other AI applications could use them, which is a distribution channel rather than a feature, and let our agents call external MCP servers so we'd stop hand-building every integration. The caveat I put alongside it is the one I'd want anyone to hear: the security record for third-party servers is genuinely poor, with a large share of scanned servers showing issues. So consuming external tools needs the same review process we already applied to our own tools before anything goes into an agent's allowlist. Enthusiasm about the standard shouldn't turn into trusting arbitrary servers.

### 13.3 ML / Data Science questions

**Q: Did you train or fine-tune any models on this project?**
A: No — this system is built entirely on a hosted LLM (Gemini) via its API. My work was in evaluating and hardening the system around that model, not modeling itself. I'd describe my contribution here as applied evaluation methodology and experimentation rigor, and I'd point to [other experience] for direct modeling work.

**Q: What's an example of experimental rigor from this project?**
A: Tracking evaluation scores across every iteration of a fix, not just comparing the latest result to the original baseline. On one agent, the score moved 5.5 → 6.3 → 5.2 across three rounds. If I'd only compared round 2 to the baseline, 6.3 looks like clear progress and I'd have shipped it — but round 2 had already lost a piece of functionality (a state file that stopped being written) that round 1 still had. Tracking every step, not just endpoints, is what caught that.

**Q: How would you design an evaluation rubric for a generative system?**
A: Base it on what the specific output is supposed to accomplish, not a generic quality score. In this pipeline, each agent's evaluation rubric came from its own spec — the sections its output is required to contain, the numeric fields that need to reconcile with each other, the behaviors it must refuse. Then run it against both a "golden path" scenario (normal use) and at least one failure/edge-case scenario, because a system that only gets graded on the easy path will look better than it is.

### 13.4 Analytical / Data questions

**Q: Tell me about a time you found something nobody else had caught.**
A: I audited a cost-estimating agent by recomputing every number it printed from its own stated inputs, instead of trusting that the output looked reasonable. I found the headline total didn't match the sum of its own displayed line items, a "lifetime cost" figure that didn't follow arithmetically from the annual figure it was supposedly built from, and a cost range printed backwards (the low end higher than the high end). None of these would show up in a test that just checks "did the agent produce an answer" — you have to check the answer against itself.

**Q: How do you decide what to measure?**
A: Start from the question nobody can currently answer. Before the usage-tracking system existed, nobody could say which agents were expensive to run or which external API calls were driving cost. I built the tracking around that specific gap — every Gemini and Tavily call, tagged by agent — rather than logging everything I could think of.

**Q: Describe a research process you ran to inform a decision.**
A: For a batch of new agent ideas, I didn't stop at "is this a real user problem" — I researched whether a dominant free tool or an official government tool already solved each one, and cut the idea if so, regardless of how real the underlying pain was. I documented the ruled-out ideas with the specific competitor and why it wins, alongside the survivors, so the decision was auditable rather than a gut call.

### 13.5 Product / PM questions

**Q: How do you decide when to kill a product/feature?**
A: I wrote down the actual rule we were applying informally: keep an agent only if it does something a generic tool like ChatGPT can't do easily on its own, and if the experience is meaningfully better than the free alternative. If a well-known product already owns the exact problem for free, or the task fundamentally needs a human in the loop anyway, it doesn't belong in the library. I used that rule to retire agents rather than let a growing library accumulate things nobody should be using.

**Q: How do you prioritize platform investment vs. individual fixes?**
A: I look for gaps that cap an entire category rather than one product. I noticed the platform had no way for an agent to send a reminder or run on a schedule — every "tracker" style agent could only tell you something was overdue if you happened to open a chat and ask. Fixing that one gap would lift every reminder-style agent at once, versus fixing each one individually, which is why I flagged it as the highest-leverage platform investment I found, rather than proposing to patch each affected agent.

**Q: Tell me about a framework or process you introduced.**
A: A competitive-moat filter for new product ideas. Before that, ideas were judged mainly on "is this a real problem." I added the second filter — is there already a dominant, well-funded, or official free alternative — and applied it to a full batch of proposed ideas, cutting several that were real problems but already well-served (a subscription-audit tool, when a major free app already owns that at scale) in favor of ideas where the pain was real *and* nothing had already won it.

**Q: How do you scope effort to match value?**
A: For an already-shipped, already-reviewed product, I make the fix directly and do one targeted check on the piece most likely to break — I don't re-run a full multi-stage review process on every small change. That heavier process is for genuinely new products or anything safety-relevant. Applying maximum process to every change on a large, already-mature portfolio costs more than most individual items in it are worth.

**Q: Tell me about a time you recommended against something people were excited about.**
A: I was asked to look at marketing events to drive signups, and the obvious flagship option was a big public launch. I recommended putting it last instead. Two reasons, both about the product rather than the marketing. We had a known reliability weakness on the agents that produce numbers, and we had no way to send a reminder or notification — so no mechanism to bring anyone back once they'd left. A launch is a stress test, and you only get one first impression per person; pointing a one-off spike at a product with a known weakness and no retention hook wastes most of what it brings in. So I recommended the cheap compounding things first — directory listings, a recurring content series, small live sessions — and saved the launch for after the reliability work landed. The useful part of that analysis wasn't picking a format, it was noticing that the sequencing mattered more than the choice.

**Q: How do you handle finding out your own analysis was wrong?**
A: It happened twice on the same body of work, and I handled it the same way both times: correct it in writing, including the reasoning error, rather than quietly editing the conclusion. Once was a claim that "no coding required" made our event idea unique — I checked properly and found a much better-funded competitor had already done exactly that, so the claim was simply false and I removed it. The other was leaving an entire category of well-performing product out of an analysis of what works, when our own ratings data contradicted me the whole time. In both cases the fix is easy; the part worth being deliberate about is leaving the *why* visible, because the next person is going to be tempted by the same plausible-sounding reasoning, and a silently corrected document doesn't warn them.

### 13.6 Strategy / BizOps questions

**Q: How would you assess whether we should build in a particular space?**
A: I'd run two filters in order, because the second one kills more ideas than people expect. First: is the problem real, specific and painful enough that someone would change their behaviour over it? Second — and this is the one usually skipped — does a dominant free, official or well-funded alternative already own it? A real problem with an incumbent already winning is not an opportunity. I applied exactly this to a batch of proposed products and cut most of them: one lost to a well-known free app with millions of users, another to a government's own official calculator, which no startup out-trusts by definition. What survived were problems that were both genuinely painful *and* genuinely unserved. And I documented the rejects with the specific competitor named, so the reasoning was auditable rather than just the conclusion.

**Q: How would you decide what to cut from a large portfolio?**
A: You need a written rule applied uniformly, or it becomes a popularity contest. The one I authored was: keep a product only if it's meaningfully better than the obvious free alternative, doesn't have a stronger competitor already owning the problem, and doesn't fundamentally require a human to finish the job anyway. Then apply it to everything, including the things you personally built. It produced actual retirements. Two useful details: retirement was a configuration change rather than deleting code, so nothing was lost and the decision was reversible; and one product was cut specifically because it overlapped a stronger sibling that owned the harder, more durable half of the same problem — overlap is a legitimate reason to cut, not just weakness.

**Q: Tell me about a recommendation you made that went against the obvious answer.**
A: I was asked which marketing events would bring in users, and the expected answer was the big public launch. I recommended sequencing it last. The channel data alone was sobering — the realistic median was around 115 attributable signups over a week, against a common assumption of thousands. But the deciding factor was two product facts: a known reliability weakness in one category of our products, and no capability to notify or remind users, meaning nothing to bring them back. A launch is a stress test, and you get one first impression per person. So I recommended the cheap compounding channels first and the launch after the reliability work. The generalisable point is that the sequencing question mattered more than the channel-selection question, and nobody had asked it.

**Q: How do you handle a recommendation where the data is incomplete?**
A: Say plainly what you checked, what you couldn't check, and which assumption would flip the conclusion. In the events analysis I could get real benchmark figures for conversion rates and signup ranges, but nothing on two of the three hosting platforms' pricing because it isn't published — so I said so rather than estimating, and made the recommendation on the factors I could actually evidence. Related discipline: I marked every statistic that was verified, and wrote an explicit rule that any number we couldn't verify gets cut rather than guessed. One publicly-corrected fake figure costs more credibility than a dozen well-argued pages earn.

**Q: How do you tell a genuine structural constraint from a missing feature?**
A: A missing feature limits one product; a structural constraint limits a whole category. Ours was that the platform had no way to run on a schedule or send a notification, which meant every reminder- or tracker-shaped product could only work if the user happened to open it and ask. That's not one product's problem, it's a ceiling on a class of them. So rather than proposing individual patches I did two things: built a scoring method for whether any product in that category was still viable under the constraint (roughly, how costly and how invisible is the failure it prevents, against how often the user would need to check in), and flagged that fixing the constraint once would lift every product in the category simultaneously. That's a considerably better investment than fixing them one at a time, and framing it that way is what makes it a prioritisation argument rather than a wish.

---

## 14. End-to-end walkthrough: "tell me about this project" (internship-style)

A full-length answer to the question interviewers almost always open with, plus the standard follow-ups. Trim it to fit whatever time you're given — the first paragraph alone works as a 30-second version.

**"Walk me through this project end to end."**

"I worked on an internal platform that builds and runs AI agents — think of an agent as a specialized assistant for one job, like reviewing a lease or planning a wedding budget, defined mostly in plain-English instructions rather than code. There were three layers: a runtime that manages the conversation with the underlying LLM and gives it tools to use (web search, file reading, image generation); a library of about 170 of these agents, each built on that runtime; and a semi-automated pipeline that takes a new agent from a written brief through design, building, automated quality testing, and a security review before it ships.

I worked across all three layers over about three months. On the runtime side, I built a usage-tracking system so the team could see what each agent cost to run, a file-management system for the shared workspace, and fixed a recurring bug where long conversations with the LLM would silently fail. On the pipeline side, I hardened the automated testing and security-review stages based on real failures I saw in live runs, not hypotheticals. And on the agent side, I built a market-research agent suite from scratch and then went back through a large share of that library — about 87 agents fixing real, evaluation-driven defects — the clearest example being a pet-cost-planner agent where I found the real problem wasn't that it didn't know things, it was that its arithmetic didn't reconcile with itself, and where I learned that just adding more instructions to fix a broken agent can make it worse, not better."

**Likely follow-ups:**

**Q: What was your specific contribution versus the team's?**
A: I worked on my own branches and had a teammate review and merge them — so I owned the design and implementation of specific pieces (the usage tracker, the tool registry, the market-research suite, several pipeline hardening passes, the pet-agent cluster) rather than the whole platform end to end. Be honest here rather than implying sole ownership of the entire system.

**Q: What was the hardest part?**
A: Recognizing that a fix that scores well on its own targeted tests can still make the overall system worse — the three-iteration prompt-bloat regression on the pet-cost-planner agent. It required tracking every iteration's full result, not just whether the specific bug I was fixing went away.

**Q: What would you do differently?**
A: Move numeric/derived-value computation out of the LLM and into deterministic tools from the start, for any agent whose output includes numbers that need to reconcile with each other — rather than discovering that need after three rounds of prompt patching.

**Q: What's a piece of feedback you received and acted on?**
A: I was told my written analysis was too dense — heavy on tables and internal jargon — for someone who needed to make a quick decision from it. I restructured how I write findings: lead with the answer, use plain language, and push supporting detail into a file someone can read on demand instead of the main message.

**Q: Tell me about a time you made the wrong call and how you found out.**
A: I wrote up an analysis of which kinds of agents actually perform well, identified five patterns — and completely left out one of them. I also pushed several agents of that missing type to the back of a priority queue, reasoning that their audience was on the wrong platform and the space was crowded. Both wrong. When it got questioned, I went back to our own quality ratings and found that nearly every agent of that type had scored in the top tier — I'd buried our best-performing category. And my "crowded space" test had been applied to the wrong thing: it's supposed to ask whether a competitor already owns the *problem*, and I'd checked whether the topic was busy instead. Two things I'd take from it. First, I had the data that disproved me the whole time and hadn't checked it against my own conclusion — an unexamined assumption is much more dangerous inside a document that looks analytical. Second, when I fixed it I wrote the correction *and the reasoning error* into the document rather than quietly editing the list, because the next person is going to be tempted to make the same call for the same plausible-sounding reasons.

**Q: What's next for this platform, if you kept working on it?**
A: Two things I flagged but didn't finish: moving arithmetic-heavy agents onto a shared deterministic calculation tool instead of letting each one compute in prose, and adding a scheduled-trigger/notification capability to the tool registry, which would unlock an entire class of reminder-style agents at once instead of one at a time.

**Q: Why should we trust your evaluation of your own work (i.e., how do you know the agents you shipped were actually good)?**
A: Because "good" was measured, not asserted — a defined evaluation rubric per agent, run against both normal and failure-path scenarios, plus a separate security pass with live adversarial probes, and for at least one agent, independent hand-verification of every number it produced. Passing wasn't a subjective read of the output; it was a checklist with specific, falsifiable findings attached.

---
---

# Part III — Quick-Reference Refresher Before an Interview

Everything in this part is meant to be re-read in 10–15 minutes right before a call, not studied. It's the pipeline, the tools, and the working rules in plain terms, plus a short summary of the growth/product/marketing thinking I did, in case that comes up.

---

## 15. The build pipeline, stage by stage

The pipeline is the assembly line that turns a plain-English idea into a working, tested, safety-checked agent. Each stage is a separate Claude Code "skill" (a set of instructions), and they run in this order:

| Stage | What it actually does, in plain words |
|---|---|
| `_compose` | Takes the raw idea and fleshes it out using a library of reusable building blocks (proven prose templates and "domain packs" — pre-written context for a subject area, like pets or legal documents), so the next stage has more to work with than one raw sentence. |
| `_requirements` | Asks the standard set of clarifying questions every agent needs answered (what should it do, what shouldn't it do, what does "done" look like) and writes it all down in one file. |
| `_architecture` | Designs the agent: how to break the one task into smaller "skills," which tools each skill needs, and how to validate the output. If a needed tool doesn't exist yet, this stage is where that gets flagged. |
| `_eval_architecture` | A design review *before* anything is built — scores the plan on whether it's appropriately scoped, fits the platform, and is actually complete. Advisory only; it can suggest a redo but doesn't block by itself. |
| `_create` | Actually scaffolds the agent — writes the `agent.md`, the `SKILL.md` files, the `tools.yaml` — and runs a self-check to confirm it loads without errors. |
| `_eval` | The quality gate. Boots the agent for real, runs it through a normal-use scenario and at least one failure scenario, and scores the output against a checklist specific to that agent. This is "does it actually work," not "does it look right." |
| `_modify` | The fix loop. If `_eval` finds problems, this stage makes targeted fixes and sends it back through `_eval` again. Capped at a few rounds so a broken agent doesn't loop forever. |
| `_security` | The safety gate. Checks for prompt-injection risk, whether the agent might do something it shouldn't, and runs a handful of live adversarial test messages against it. A serious ("Critical") finding here blocks shipping. |

**A stage I proposed adding, not yet built:** a `_viability` check that would run *first*, before any of the above — a cheap gut-check on the *idea itself* (is this actually better than just prompting ChatGPT? does a big free competitor already own this? do we even have the tools for it?) so a bad idea gets killed before anyone spends time designing or building it. Good to mention if asked "what would you improve about the process."

---

## 16. Tools and skills — what's the difference, and what do we actually have

**Skill vs. tool, in one line:** a *skill* is instructions (what to do, written in English); a *tool* is an actual function the agent can call to do something in the real world. An agent's skill might say "look up the current rate," and `tavily.search` is the tool that makes that real.

**The tool library, grouped by what it does:**
- **Files & state** — read/write/edit files in the workspace, save and reload structured data between turns.
- **Web search** — Tavily, for anything that needs current, real information instead of the model's own guess.
- **Images** — analyze an uploaded photo (vision), generate new images (nicknamed "nanobanana" internally).
- **Output building** — turn data into a chart, a polished HTML report, or a CSV.
- **Usage tracking** — logs every paid API call so we can see cost per agent.
- **A few narrower ones** — text processing, competitor-research helpers, persona-building helpers, trend-detection helpers.

**What's missing (worth knowing if asked "what would you add"):** nothing that runs on a timer or sends a notification later — every agent is "pull" only, meaning it can only tell you something once you open a chat and ask. This caps every reminder/tracker-style agent idea. Also missing: a general "just compute this correctly" math tool — see the pet-cost-planner story for why that one matters.

**"Core skills":** a handful of skills every agent gets automatically (regardless of what it declares it needs) — the file-handling and report-building instructions, mainly. Everything else has to be explicitly listed in an agent's `tools.yaml` to be usable.

---

## 17. The working rules and frameworks (the "why" behind decisions)

Quick versions of each, useful as one-liners in an interview:

- **The 350–400 line rule:** past that length, adding more instructions to an agent's prompt makes it *less* reliable, not more — the model already isn't following everything it has; more text dilutes further. Fix by splitting into smaller skills or moving logic into an actual tool, not by writing more prose.
- **Don't let the model do exact math:** an LLM tends to pick a plausible-looking final number and reverse-engineer the supporting numbers to match, instead of deriving it correctly. Anything that needs to add up (totals, projections, comparisons) should go through a deterministic tool, not the model.
- **The keep/disable rule for agents:** keep an agent only if it's meaningfully better than someone just prompting ChatGPT directly, doesn't already have a strong free competitor, and doesn't fundamentally need a human to finish the job anyway.
- **The competitive-moat filter:** before building a new agent idea, check if a big free or official tool already owns that exact problem. If yes, don't build it, no matter how real the problem is.
- **Match effort to value:** a small fix to an already-shipped, already-reviewed agent gets a direct edit and one targeted check — not the full multi-stage review process. Save the heavy process for genuinely new or safety-relevant work.
- **Track every iteration, not just before/after:** when fixing something over several rounds, compare each round to the one right before it, not just to the very first version — otherwise a "better" score can hide a new problem the previous round didn't have.
- **One deliverable, not a folder:** the user wants one thing they can read, download and forward — not a folder of session files, intermediate notes and an index. Working files are fine, but they're internal; an agent should never hand one over as if it were the result.
- **Design the output first, then work backwards:** define the final deliverable's structure before designing the steps that compute its content. Doing it the other way round is exactly how you end up with content that gets computed and then orphaned, because no step owns displaying it.
- **Cite everything you looked up, and abstain mechanically:** every claim from a lookup carries its source; source labels come from a closed list with no free text; if a lookup didn't run, the field says "not verified." A self-computed number can never be relabelled as sourced — that's the exact mechanism behind a fabricated citation.
- **The planner test:** the best new planner-agent ideas come from asking "is there a common thing people start and then abandon because they run out of plan?" Newsletters, podcasts, channels, study schedules, job searches, returning to work after a break — every one has a documented drop-off cliff, and the cliff is where that agent shape earns its keep.

---

## 18. My growth, product & marketing thinking — high-level summary

If a role touches product, growth, or strategy, this is the short version of proposals I put together beyond the core engineering work. Full versions are in the growth-phases, marketing-events, product-ideas and handover documents.

### A founder-led LinkedIn growth plan (4 phases)

The core idea: build the founder's personal authority first, introduce the product second — never lead with a pitch.
1. **Earn attention** — post genuinely useful AI/product education, no product mentions, until people follow for the content itself.
2. **Own a niche** — narrow down to a specific, recognizable angle ("Product × AI × Agents"), using 1–2 named, repeatable frameworks so people start associating that idea with the founder specifically.
3. **Introduce the product** — a slow, three-step reveal ("we were building this" → "we built an agent for this" → "try it"), including a dedicated post showing off the platform's real differentiator: describe an agent idea in one sentence, and the whole build-test-secure pipeline runs automatically while you wait.
4. **Agent distribution engine** — after that, one post per agent (or a tight themed group of agents), each following problem → insight → agent → demo → call-to-action, pulling only from our best-tested ("Very Good"-rated) agents so we always lead with our strongest work.

I then wrote the execution layer for phase 4: **36 ready-to-publish post drafts**, one per agent, each with the reasoning for why we're pushing that agent, why the post should perform, and the search terms to keep in the copy. Every statistic used is one I verified and sourced, with an explicit rule in the document that unverifiable numbers get cut rather than invented — one publicly-corrected fake stat costs more trust than three dozen good posts build.

Also folded in real, current platform research rather than received wisdom, which changed several tactics: comments count roughly 15x more than likes for reach, so every post ends in a specific answerable question rather than "thoughts?"; posts that get saved or privately shared now get boosted more than posts that get quick likes; and — the finding that reshaped every call-to-action — links now cut a post's reach substantially, the old "put the link in the first comment" workaround got closed off, and gated "comment a word and I'll send it" posts out-reach link posts by roughly 8x. So no draft contains a link at all.

### A marketing-events analysis (hackathon plus five alternatives, and what order to run them in)

**The hackathon proposal.** Run an event where "building" means describing an agent in plain English through our own pipeline — no coding required. Reward the most *useful* agent and the *weirdest/funniest* one separately, in tiered prizes (cash split across several winners rather than winner-take-all, plus AI subscription credits and a non-cash reward like a founder call). Every submission passes through our existing safety review before it's shown publicly. The event doubles as free content and free market research — a "nobody's built this yet" track surfaces pre-validated agent ideas.

**A claim I had to retract, which is the part worth telling.** My first draft argued that "no coding required" was our unique angle, because most AI agent hackathons are developer events with an AI theme. Then I actually checked, and found HubSpot founder Dharmesh Shah's agent.ai had run a challenge whose tagline was literally *"No code. Just creativity."* — with a $50,000 prize pool, twenty times what I was proposing. So the claim was false, and I removed it rather than softening it. What replaced it is both true and stronger: Archestra and agent.ai each hand you a builder and let you assemble something, but **neither checks whether what you built is any good.** Ours runs automated quality testing and a security review before an agent ships. "You describe an agent and get one that's been *tested*, not just one that exists" is a real differentiator, and unlike a prize pool it's one we can actually win on.

**Useful benchmark from the research:** Archestra's comparable event ran on a total prize pool of **$2,250** across three categories, over a single week — so a credible event doesn't need a large budget. They also asked entrants for a *recording of the build*, not just the finished product, which I'd copy: footage of someone describing an agent and watching it get built is the best demo material we could get, and we'd get dozens for free.

**The five other formats I assessed**, each with the evidence behind it:
- **Directory and AI-listing placement** — I put this *ahead* of the hackathon on return-for-effort. With ~170 agents we have ~170 long-tail search terms, and directory traffic is the one channel that rewards catalogue breadth. Costs an afternoon and a few hundred dollars, and unlike an event it compounds instead of spiking.
- **An agent-a-day posting series** — near-zero cost, because the 36 drafts already exist.
- **Live "build an agent with me" sessions** — the format research says narrow and operational beats polished demos, with a 35–50% registration-to-attendance benchmark. Doubles as reusable demo footage.
- **A seven-day challenge, deliberately not thirty** — trial-length data shows 7-day windows convert at ~24% median versus ~14% for 30-day. Shorter converts *better*. And a challenge forces repeat use, where activated users convert at 3–5x non-activated ones — so it's an activation mechanism wearing a marketing-event costume.
- **A creator/ambassador programme** — the useful finding was that many creators accept lower pay if you help grow their own audience, which makes this affordable given we're building a founder account with reach.

**The recommendation I'd most want to defend, though, is the sequencing** — and it was to *not* do the highest-profile thing first. Product Hunt's real numbers are modest (median ~115 seven-day signups across a tracked 2026 sample, 500+ products launching daily, 60%+ of the daily top five already AI-based), and the research's own framing is that a launch is *a stress test, not proof of product-market fit*. Two facts about our product made the timing decisive: there was a known reliability gap on number-heavy agents, and no scheduled-trigger capability, meaning no mechanism to bring anyone back. Pointing a one-off spike at a product with a known weakness and no retention hook wastes the one first impression you get per person. So I recommended the cheap compounding formats first, the launch last — after the reliability and one-report work lands.

### Product roadmap ideas (what to build next)

- **MCP support**, both directions: expose our own tools through this increasingly standard AI-tool connector so other AI apps can use them, *and* let our agents call the thousands of existing external tools built on the same standard — with a security review step before any external tool is trusted, since this ecosystem has a real track record of unsafe integrations.
- **A deterministic math/compute tool** — direct fix for the "don't let the model do arithmetic" lesson above, usable by every numeric agent at once.
- **Scheduled triggers/notifications** — the single highest-leverage missing capability; unlocks a whole category of reminder/tracker agents at once.
- **A visible "reviewed & security-tested" badge** — turn our internal quality process (most competitors skip this entirely) into something a user can actually see and trust.
- **Growth-loop product features** — shareable result pages, a running "money/time saved" counter, embeddable widgets for partner sites, referrals — features that are good for users *and* generate their own distribution.
- **A community agent marketplace** — once "describe it, we build it" is public, let users publish their own agents for others to try, gated by the same quality/safety checks official agents go through.

### What actually differentiates the platform (honest read, not a pitch)

Not "we have more AI" — everyone does. The real edges: (1) once one type of agent works, making a similar one is cheap, so we can cover a lot of ground fast; (2) we actually test and safety-review every agent before shipping, which most single-prompt "AI wrapper" competitors skip entirely; (3) we deliberately avoid picking fights with big funded or official free tools, and instead win the real, underserved problems nobody's bothered to solve well; (4) free, no-signup access is part of the growth strategy, not just a pricing choice — but that only works because point 2 is true. The one honest gap: reliability engineering for anything number-heavy (financial estimates, totals) hasn't caught up to how many agents we've shipped — a real, current weakness, not a solved problem.
