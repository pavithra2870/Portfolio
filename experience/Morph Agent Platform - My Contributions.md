# Project

The Morph Agent Platform is an internal system for building and running LLM-powered "agents" — each defined as a folder of natural-language instructions (an `agent.md` file) plus a set of composable "skills" the agent can invoke. Rather than hard-coding behavior in application code, agents are assembled from prose instructions and a registry of shared tools (web search, file I/O, image generation, data analysis, etc.), which are then exposed through a chat-style web UI or API.

On top of that runtime, the platform includes a growing library of purpose-built business agents (market research, HR/legal document review, financial calculators, content generation, and more) and a semi-automated **build pipeline** that takes a plain-language brief through requirements gathering, architecture design, scaffolding, automated evaluation, and a security gate before an agent is considered ready to ship.

The product serves two audiences: internal teams who want a new specialized AI agent stood up quickly and reliably, and end users who interact with those agents through a browser-based chat and workspace interface.

Try my work here: https://poppyfield.ai

---

# My Role

**Full Stack / Product Engineer**, spanning platform infrastructure, developer tooling, and applied AI agent development.

Based on the shape and breadth of the work — core runtime reliability fixes, tool registry and API integrations, a full UI redesign, an observability/usage-tracking subsystem, dozens of test suites, and independent authorship of an entire category of production agents (market research) plus contributions to a dozen+ additional business agents — the role combines backend platform engineering with hands-on AI agent design and product-facing UI work. I operated across the stack: from Gemini API integration and SQLite-backed usage tracking, to the workspace file-manager UI, to designing and hardening the meta-pipeline that other engineers use to build new agents.

---

# What I Built

### Market Research Agent Suite
Designed and built a family of agents (competitor research, customer persona synthesis, review sentiment analysis, and market trend spotting) from a first working prototype through multiple rounds of quality hardening. This gave the business a repeatable way to generate structured market-intelligence reports (competitor profiles, customer personas, sentiment summaries, trend digests) without manual analyst work. I iterated on report-quality issues (formatting, scoring consistency, crash fixes) until output reliably hit a high quality bar suitable for direct business use.

### Agent Build Pipeline Hardening
Contributed to the multi-stage pipeline (`requirements → architecture → create → eval → security`) that turns a plain-language brief into a deployed agent. My work focused on closing failure modes discovered from live pipeline runs: prompt-injection resistance, gate-bypass prevention, tool-failure handling, and a new automated output-quality audit step scored against agent-specific criteria. This made the pipeline safer and more trustworthy to run unattended, reducing the manual review burden for every new agent produced by it.

### Business Agent Library
Authored and/or contributed to over 20 individual business-facing agents covering HR/legal document review (offer letters, contractor agreements, SAFE notes, vendor contracts, PTO policy), financial tools (freelancer tax calculator, stock portfolio tracker), career tools (cover letters, LinkedIn optimization, job-offer negotiation, layoff recovery planning), and content/marketing tools (content calendars, packaging concepts, outreach sequences, case studies). Each agent solves a specific, narrow business or consumer task end-to-end via the platform's chat interface.

### Workspace & File Management UI
Built the file explorer and preview system for the shared agent workspace, added file management operations (create folder, move, rename, delete) with a matching UI, and fixed long-filename and viewport/scroll issues — giving users a reliable way to browse, inspect, and manage files an agent produces or consumes during a session.

### Platform Reliability & API Reliability
Fixed a recurring Gemini API failure mode (`MALFORMED_FUNCTION_CALL`) by trimming conversation history and adding retry logic, keeping long agent conversations from silently failing. Improved error handling and fallback behavior in the external search/extraction tool integration, and hardened the file-write tool with atomic writes and JSON validation to prevent data corruption.

### Usage Tracking & Cost Observability
Designed and shipped a SQLite-backed usage-tracking system recording every LLM and external API call, instrumented it across the search, image-generation, and vision tools, and exposed a usage report and audit-log download in the UI — giving the team visibility into API cost and usage patterns per agent.

### Dynamic Tool Registry
Built a registry system allowing tools to be declared and loaded dynamically rather than hard-wired, reducing the effort to add or scope new capabilities to an agent.

---

# Engineering Contributions

- **Backend / API**: Core conversation engine reliability fixes (Gemini API integration), dynamic tool registry, file-management endpoints (mkdir/move/rename/delete), per-run API key plumbing, streaming response fixes.
- **Frontend**: Full UI redesign (resizable panels, scrollable viewport, dark theme), workspace file explorer and preview system, file manager UI, landing-page agent discovery with category badges, pipeline debugging UI (state/log panels with copy-to-clipboard).
- **Data / Storage**: SQLite-backed usage-tracking schema and query layer for API cost accounting.
- **Testing**: Authored and maintained test coverage across core runtime (single/multi-agent HTTP flows, file tools, third-party API tool tests), end-to-end orchestrator tests for the competitor-research agent, and CI-focused test suites.
- **Automation / Developer Tooling**: Contributed to the automated agent build pipeline (requirements intake → architecture → scaffolding → evaluation → security gate), including new automated quality-scoring and gate-hardening logic used by every agent built through it.
- **Reliability / Bug Fixes**: Root-caused and fixed multiple production-report generation crashes and scoring-logic bugs in the market research agents; fixed API retry/reliability issues in the core engine.

---

# AI / ML Contributions

- **Agent System Design**: Designed multi-skill agent architectures (e.g., splitting a research agent into evidence-collection, profile-extraction, market-analysis, and report-assembly skills) so complex analytical tasks are decomposed into reliable, independently testable steps.
- **Prompt Engineering**: Authored and iteratively refined the natural-language instruction sets (`SKILL.md` files) that drive agent behavior, tuning them across multiple rounds to fix inconsistent scoring and improve output-report quality to a consistent high bar.
- **LLM Integration**: Worked directly with the Gemini API client layer, including diagnosing and fixing a function-calling failure mode and building the retry/history-trimming logic around it.
- **Automated Evaluation**: Built/extended an LLM-as-judge style evaluation step that scores generated agent output against agent-specific quality criteria as part of the build pipeline's quality gate.
- **Tool-Use Agents**: Designed and integrated tool-calling capabilities (search, extraction, image generation, vision analysis) into agents via the platform's tool-registry pattern.

---

# Product Contributions

- Reduced manual analyst effort by delivering a self-serve market-research agent suite (competitor, persona, sentiment, trend analysis) that produces structured reports on demand.
- Improved end-to-end reliability of agent conversations by fixing a recurring silent-failure mode in the core chat engine.
- Improved user productivity and trust in the platform by building a full workspace file-management experience (browse, preview, organize, delete) rather than requiring users to work blind.
- Reduced the review burden for new agents by hardening the automated build pipeline's quality and security gates, cutting down on manual QA before an agent could ship.
- Improved operational visibility by introducing usage/cost tracking, giving the team a way to monitor and audit API spend per agent.
- Expanded the platform's product surface by independently shipping 20+ purpose-built business agents across HR, legal, finance, career, and marketing use cases.

---

# Technologies I Used

**Languages**
- Python
- JavaScript
- HTML/CSS

**Frameworks**
- FastAPI
- Uvicorn

**Backend**
- REST API design
- SQLite
- Async HTTP clients

**Frontend**
- Vanilla JS single-page UI (chat interface, file explorer, resizable panel layout)

**Cloud / External Services**
- Google Gemini API (LLM inference)
- Tavily (web search/extraction API)

**Databases**
- SQLite (usage/audit tracking)

**AI/ML**
- LLM-based agent design (Gemini)
- Prompt engineering
- Tool-calling / function-calling integration
- Automated LLM-based evaluation scoring

**DevOps / Developer Tools**
- pytest
- Git (feature branching, merges from shared team branches)
- YAML-based configuration (tool/skill declarations)

---

# Skills Demonstrated

- Backend API Development (FastAPI)
- LLM Integration & Reliability Engineering
- Prompt Engineering
- AI Agent Architecture & Decomposition
- Tool-Calling / Function-Calling Systems
- Frontend UI Development (vanilla JS, responsive/resizable layouts)
- File System / Workspace Management Features
- SQLite Database Design
- Usage Metering & Cost Observability
- Automated Quality Evaluation (LLM-as-judge patterns)
- Test-Driven Debugging & Root-Cause Analysis
- CI-Oriented Test Suite Authoring
- Developer Tooling / Build Pipeline Design
- Cross-Team Collaboration via Git (merges across shared branches)
- Security-Conscious Design (input hardening, gate-bypass prevention)

---

# Resume Bullets

- Designed and shipped a full-stack market-research agent suite (competitor analysis, customer personas, sentiment analysis, trend spotting), iterating through multiple quality-hardening passes to reach consistent, business-ready report output.
- Diagnosed and fixed a recurring LLM API failure mode in the core conversation engine, adding retry and history-management logic that eliminated silent conversation failures.
- Built a SQLite-backed usage-tracking system instrumented across three external API integrations, giving the team visibility into per-agent API cost and usage.
- Redesigned the platform's web UI with a resizable-panel, dark-theme layout and built a workspace file explorer/manager (create, move, rename, delete, preview) used across all agents.
- Independently authored 20+ production business agents spanning HR/legal document review, financial calculators, career tools, and marketing content generation.
- Hardened an automated agent-build pipeline against prompt-injection, quality-gate bypass, and tool-failure scenarios, and added an automated output-quality audit step used to gate every new agent.
- Built a dynamic tool-registry system enabling new agent capabilities to be declared and scoped without hard-coding integration logic.
- Wrote and maintained test coverage across core runtime paths (single/multi-agent HTTP flows, file tools, third-party API tools) and an end-to-end orchestrator test for a production agent.

---

# Portfolio Summary

I contributed across the full stack of an internal LLM agent platform — from core runtime reliability (diagnosing and fixing LLM API failure modes), to backend systems (a usage-tracking and cost-observability service, a dynamic tool registry), to a complete frontend redesign and workspace file-management experience. This work demonstrates the ability to move fluidly between infrastructure-level reliability work and user-facing product features within the same codebase.

Beyond platform work, I independently designed and shipped a suite of AI agents for market research — decomposing a complex analytical task (competitor intelligence, customer personas, sentiment analysis, trend spotting) into modular, testable skills, then iterating through several rounds of prompt and logic refinement to reach consistent, high-quality output. I extended that agent-design experience into building 20+ additional business-facing agents across HR, legal, finance, and marketing domains, and into hardening the automated pipeline the team uses to build and quality-gate new agents.

This body of work demonstrates engineering maturity in several dimensions: root-cause debugging of intermittent LLM/API failures rather than surface patches, disciplined test coverage across core system paths, a security-conscious approach to automation (prompt-injection and gate-bypass hardening), and product judgment in scoping and shipping user-facing features (file management UI, usage dashboards) end-to-end.

---

# Evidence Used

Conclusions were drawn from the local Git history filtered to commits authored under two identities confirmed as mine (`pavithra-morph <pavithra@morph.systems>` and `pavithra2870 <pavithra922710@gmail.com>`): 74 commits between 2026-05-22 and 2026-07-01, touching `skill_engine/` (core runtime, tools, HTTP server, UI), `agents/market_agents/` (competitor research, customer persona, review sentiment, trend analysis), `agents/*` (20+ individual business agents), `.claude/skills/` (the agent build pipeline), and `tests/`. Feature groupings were inferred from related commit messages (e.g., grouping the sequence of market-research quality-fix commits into one feature narrative) and from the directories/files each commit touched, rather than from any external ticketing or PR system (none was available in this local clone).

---

# Important Notes

This document summarizes only the contributions attributable to the two git identities above, based on locally available Git history. It intentionally omits proprietary business logic, internal architecture details, and any work authored by other contributors to this repository.
