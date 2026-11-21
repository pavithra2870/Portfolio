# OAuth Guides

An AI-assisted guide generator that shows developers how hard it is, how long it takes, and who does what to get an OAuth app registered and approved for any API provider.

> Tagline: **"Know the path before you build."**

---

# Elevator Pitch

Before an AI-agent product can let users connect Spotify, Xero or TikTok, the developer often has to register their own OAuth app and pass the provider's review. That can take 30 minutes or a quarter, and nothing tells you which up front. Developers piece it together from scattered docs, forums and support emails.

OAuth Guides gives each app one page: a difficulty verdict, a realistic time plan, a visual timeline of every step, and who owns each step (AI can draft it / only you can do it / the provider is reviewing). Search any app. If it's in the library you get the guide instantly. If not, an agent researches the provider's docs live, streams its progress, and produces a shareable guide in about a minute.

What makes it different: **the model writes, the code verifies.** Every claim must carry a verbatim quote, and code checks that quote against the fetched page and assigns the evidence level (Documented / Reported / Inferred / Tested). The product is honest about what it knows. Built as a take-home for a Product Manager internship at Composio (an AI-agent integrations platform), which is why it is framed around a real platform problem.

---

# Product Overview

- **Users:** developers and agent builders who need to connect third-party apps for their end users; secondary: PMs/founders estimating integration timelines.
- **Primary workflow:** search an app name or website → instant library guide, or live research → read the verdict and journey strip → follow steps / copy AI prompts / tick the checklist → share the link (`/g/<app>`).
- **Inputs:** app name or URL; a multi-select of apps for launch planning.
- **Outputs:** shareable guide (difficulty, timing, steps, requirements, gotchas, rejection fixes, sources); a multi-app launch comparison.
- **UX:** dark, document-style guide with a timeline hero; live "watch the agent work" screen instead of a spinner; filters; saved checklists; visible fair-use counter.
- **Real-world use:** a team planning an agent product decides which integrations to start first because one provider's review takes six weeks.

---

# Problem Statement

Setting up an OAuth app is the hidden critical path of every integration. Developers can't tell up front whether it's an hour or weeks of waiting, what blocks approval, or what they can build while waiting. Docs are written per provider, in different shapes, and say nothing about overall effort. Forums are stale. Existing aggregators list API endpoints, not the registration/approval journey.

Key insight from Composio's catalog (127 apps managed, 275 bring-your-own): apps like GitHub, Slack and Notion are already managed, so the real pain is the long tail where developers must register their own app. The product targets exactly that gap.

---

# Key Features

**Decision up front**
- *Verdict:* difficulty (easy / medium / hard / gated) plus "Plan for 2–6 weeks". Lets users decide before investing.
- *Step zero:* whether Composio already offers a managed OAuth app, so you may skip registration.

**Seeing the journey**
- *Journey strip:* every step as a block, colour-coded hands-on / AI-assisted / provider wait. Shows the review wait, not the work, sets the date.
- *Two kinds of time:* active effort vs. provider waiting shown separately ("2 hours of work" vs. "2 weeks of review").

**Doing the work**
- *Who does what:* AI-draftable vs. human-only (logins, payment, identity, legal), with copy-ready prompts where AI genuinely helps.
- *Step-by-step path:* times, direct links, browser-saved checklist.
- *Before approval:* what you can build and test while you wait.
- *Requirements, gotchas, rejection reasons* each with a concrete fix.

**Trust**
- *Evidence badges + sources:* every claim links to its source with an evidence level. Uncertain topics are listed, not hidden.

**Planning**
- *Compare / plan my launch:* several apps on one scale; the slowest approval is flagged as "start this first".
- *Library filters* by difficulty and managed-vs-bring-your-own.

**Live generation**
- *Streaming research screen* showing each pipeline stage; shared runs when two people ask for the same app; shareable URL.
- *Fair use made visible:* remaining live researches shown in the search box; library reads unlimited.

---

# Engineering Highlights

- **Backend:** FastAPI service with an orchestrated research pipeline (search → extract → write → verify → compute timing → save), server-sent events for live progress, job de-duplication so concurrent requests share one run.
- **Frontend:** React 19 + Vite SPA, React Router, context-based library state, custom SSE client, small markdown renderer, custom journey-strip layout logic, all hand-written CSS (no UI kit).
- **Data:** Postgres (Supabase) when hosted, SQLite locally, same code for both; the guides store doubles as a cache and usage events power rate limiting.
- **Reliability:** API-key rotation, LLM model fallback chain (Gemini → Groq), per-model timeouts, trimmed prompts for small-context fallbacks, daily caps.
- **Integrations:** Tavily search/extract, Gemini, Groq, Composio public catalog snapshot.
- **Deployment:** hosted live on Render's free tier.

---

# AI / ML Components

- **LLM guide writer** producing strict structured JSON against a detailed schema and a difficulty rubric.
- **Evidence-grounded generation:** forced verbatim quotes; code-side quote matching sets evidence levels; the model never self-grades.
- **Agentic research:** two-stage search (general, then restricted to the provider's own domains), official-source prioritisation, reading the best pages.
- **Prompt engineering:** hard rules against invented durations/fees, explicit "uncertain" channel, step-owner taxonomy (agent / you / provider), scope guard (no "build your app" steps), credential-ordering rule, honest AI-assist notes (left empty when AI can't help).
- **Multi-model fallback** across providers with token-budget-aware prompts.

---

# Product Thinking

- **Start from the decision, not the docs.** The verdict and timeline come first; detail follows.
- **Reframed "effort" into hands-on vs. waiting**, and into human vs. AI ownership: the honest answer to "what can an agent do for me?"
- **Trust as a feature:** evidence levels, sources, research dates, "confirm on the provider's site" disclaimer. Chose "Tested" as a reserved level instead of over-claiming.
- **Safety by design:** never asks for logins or keys; the user performs sensitive steps on the provider's site.
- **Focused on the real gap** (bring-your-own list) after analysing Composio's catalog.
- **Cold-start and cost thinking:** curated library of varied apps (30-min to multi-week) for instant value; live generation for the long tail; free-tier limits exposed to users instead of failing silently.
- **Shareability and virality:** every guide is a link; compare view supports team planning.
- **Roadmap:** "draft this for me" (app description, scope justification, privacy policy), browser agent that fills registration forms and hands off at login/payment, scheduled re-research to keep guides fresh.

---

# Technologies Used

**Languages:** Python 3.10, JavaScript (ES modules), SQL, CSS, HTML
**Frontend:** React 19, Vite 8, React Router 7, custom CSS design tokens
**Backend:** FastAPI, Uvicorn, httpx, Pydantic 2, server-sent events
**Databases:** Supabase Postgres (psycopg + pool), SQLite
**AI/ML:** Google Gemini (flash family), Groq (gpt-oss), Tavily search/extract
**Hosting/DevOps:** Render (static frontend), free-tier backend host, env-based config, Git/GitHub

---

# Skills Demonstrated

Full-stack development · Backend engineering · API design · Streaming/SSE · AI engineering · Agentic workflows · Prompt engineering · Structured LLM output · Grounding & verification · Database design · Rate limiting & caching · Reliability (fallbacks, key rotation) · Product strategy · Product discovery · Problem framing · UX thinking · Information design · Design systems · Technical writing · Cloud deployment · System integration · Cost-aware engineering

---

# Resume Impact

- Designed and shipped a full-stack AI research product (React, FastAPI, Postgres) that turns any API provider's docs into a shareable OAuth setup guide in about a minute.
- Built an evidence-verification layer that matches LLM claims to verbatim source quotes and assigns confidence levels in code, reducing unsupported claims in generated guides.
- Created a "journey strip" timeline UI separating hands-on effort, AI-assisted work and provider wait time, so developers see the true critical path of an integration at a glance.
- Analysed Composio's managed-auth catalog (127 managed vs. 275 bring-your-own apps) to target the product at the bring-your-own long tail.
- Implemented streaming live-research UX with server-sent events and shared jobs, so concurrent requests for the same app reuse one run.
- Engineered a resilient LLM pipeline with multi-key rotation, Gemini→Groq model fallback, prompt budgeting and per-user daily caps on free-tier infrastructure.
- Built a multi-app launch planner that identifies the slowest approval as the schedule-setting item.
- Authored a curated library of 9 varied apps (Beeminder to Xero) and deployed the product publicly with a demo video and write-up.

---

# Ideal Roles

Product Manager / Associate PM / APM · Technical Product Manager · Product Designer / UX Engineer · Product Engineer · Full Stack Engineer · AI Engineer · Developer Experience / Developer Tools roles

---

# Portfolio Tags

React, Vite, FastAPI, Python, Postgres, SQLite, Supabase, Gemini, Groq, Tavily, LLMs, Agents, Prompt Engineering, SSE, Developer Experience, OAuth, Product Design, UX, Product Strategy, Dark UI

---

# Project Complexity

**Advanced.** Multi-stage AI pipeline with verification, streaming UX, dual-database support, rate limiting, fallbacks and public deployment, built under a 6–8 hour take-home budget. Not "production-grade": no automated tests, guides are AI-generated from public docs and not yet hand-verified, and it runs on free tiers.

---

# One-line Portfolio Summary

OAuth Guides: an evidence-checked AI agent that turns any API provider's docs into a visual, shareable plan showing how long OAuth approval will really take and who does what.

---

# Interview Notes (talking points)

- **Why this problem:** integrations are the bottleneck for agent products; approval waits, not code, set launch dates.
- **Hardest decision:** not trusting the model. Verbatim quotes + code-set evidence levels.
- **Trade-off:** breadth vs. trust. 9 curated guides vs. the 100 asked for; chose to prove the live flow and honesty model.
- **Honest limitations to volunteer:** guides not yet hand-verified; no "Tested" guides; docs-based only; free-tier quotas; renamed apps (Twitter/X) work best by URL.
- **What I'd do next:** hand-verify a sample and log corrections, scheduled refresh, form-filling browser agent, draft-my-submission feature.
- **Metrics I'd track:** guide-to-checklist progress, share rate, live-research success rate, evidence-level mix, time-to-first-guide.
- **Constraint story:** free-tier LLMs retired mid-build; built a fallback chain and token-budgeted prompts.

---

# Design Notes (for the portfolio site)

- **Style:** Composio-inspired dark UI: near-black surfaces, lavender + electric-blue accents, generous radius, calm motion. Document-style guide page with a timeline hero. Editorial, minimal, no UI kit.
- **Tokens:** bg `#111111`, surface `#161616 / #1c1c1c / #232323`, border `#2a2a2a`, text `#ffffff` / muted `#a8a8a8`; lavender `#e9b3ff` (AI-assisted), blue `#4d5dff` (you), grey blocks (provider wait); status green `#4ade80`, amber `#fbbf24`, orange `#fb923c`, red `#f87171`.
- **Type:** Inter (UI), JetBrains Mono (code/labels).
- **Shape/motion:** card radius 20px, md 12px, pill, button 6px; ease `cubic-bezier(0.22,1,0.36,1)`, 400ms; page max 1120px, reading width 760px.
- **Signature visual:** the journey strip (colour = who does the work, width = time). Reuse it as the hero image/motif of the case study.
- **Suggested case-study flow:** problem → insight (catalog split) → journey strip hero → evidence model → live agent screen → compare view → results/limits → next steps.
- **Hero assets:** product screenshots (home, guide, who-does-what, compare) and the demo video.

---

# Links

- Live app: https://oauth-guides-o66y.onrender.com/
- Demo video: https://vimeo.com/1244693576
- Source code: https://github.com/pavithra2870/OAuth-Guides