# PulseOps

**AI-assisted cluster observability and root-cause analysis platform**

PulseOps is a production-style observability platform for fleets of Linux nodes. It collects system metrics, evaluates them against SRE thresholds, raises and deduplicates alerts, manages incidents with full timelines, and uses an AI assistant to propose structured root-cause analyses grounded in a searchable knowledge base of runbooks.

The observability platform is the product. The AI only assists the engineer — it never replaces metrics, logs, or human judgment.

---

## What I Built

PulseOps is a full-stack observability platform that implements the complete detect → alert → incident → diagnose loop used in real infrastructure operations. It consists of:

- **Backend API** (FastAPI): 32 REST endpoints plus WebSocket hub for real-time updates
- **Node Agent** (Python): Lightweight psutil-based collector with Prometheus exposition
- **Frontend Dashboard** (React): 10 pages with live visualizations and incident management
- **Alert Engine**: Rule-based threshold evaluation with deduplication and warning→critical escalation
- **Incident Management**: Full timeline with status transitions (open → investigating → mitigated → resolved)
- **Fault Simulation**: 9 realistic failure modes that flow through the real pipeline
- **AI Diagnosis**: Structured JSON output via Gemini with RAG grounding in runbooks
- **Knowledge Base**: FAISS vector search over PDF/MD/TXT/DOCX runbooks

---

## Why I Built It

I built PulseOps as a portfolio project targeting SRE and infrastructure engineering roles.

The project addresses a real problem: infrastructure teams need to monitor node fleets, detect issues before they become outages, and diagnose incidents quickly. Existing tools (Prometheus, Grafana, Datadog) are powerful but complex — PulseOps shows I understand the fundamentals they implement.

---

## Problems It Solves

**Alert Fatigue**: The alert engine deduplicates alerts (one per node+metric), escalates severity in place, and auto-resolves on recovery — preventing alert storms that overwhelm on-call engineers.

**Incident Context**: Each incident has a chronological timeline showing detection → alert → investigation → resolution, giving engineers the full story instead of isolated events.

**Reproducible Diagnosis**: The fault injection system creates realistic incidents (CPU spike, memory leak, disk full, storage latency, packet loss, network outage, replication failure, service crash, high I/O wait) that flow through the actual pipeline — enabling practice and testing without production risk.

**Knowledge Retrieval**: The RAG system indexes runbooks and retrieves relevant passages during diagnosis, so engineers get cited, actionable guidance instead of generic suggestions.

**Zero-Setup Demo**: Every external dependency (Supabase PostgreSQL, Upstash Redis, Gemini AI, Grafana Cloud) has a zero-credential fallback (SQLite, in-memory cache, deterministic mock, local metrics), so the platform runs immediately after cloning.

---

## Engineering Skills Demonstrated

**Full-Stack Development**: Built a complete backend (FastAPI, SQLAlchemy 2.0 async, Alembic migrations) and frontend (React, Vite, Recharts) with clean layering (routes → services → repositories) and type safety (Pydantic schemas).

**Async Programming**: End-to-end async I/O with FastAPI, asyncpg/aiosqlite database drivers, Redis async client, and WebSocket real-time updates — handling concurrent metric ingestion and live dashboard streaming.

**System Design**: Made deliberate technology choices with documented trade-offs (FastAPI vs Django, PostgreSQL vs MongoDB, Prometheus vs StatsD) and implemented graceful degradation so the system works with or without cloud dependencies.

**Observability**: Instrumented the backend with RED metrics (Rate, Errors, Duration) via prometheus_client, exposed `/metrics` for Prometheus scraping, and created a Grafana dashboard — demonstrating I can build observable systems, not just use them.

**Database Design**: Modeled relational data (clusters → nodes → metrics → alerts → incidents) with proper indexing for time-series queries, implemented Alembic migrations, and used connection pooling with health checks.

**API Design**: Built RESTful APIs with OpenAPI documentation, WebSocket hub for push updates, and structured error handling — following industry patterns for internal tooling.

**Caching Strategies**: Implemented Redis caching with TTL-based invalidation and an in-memory fallback, abstracted behind a single interface — showing understanding of cache-aside patterns and cloud-native trade-offs.

**AI Integration**: Used Gemini with structured JSON schema validation (never free text) to ensure deterministic, parseable output, with a deterministic rule-based fallback for when the AI is unavailable — responsible AI that assists rather than replaces.

**RAG Implementation**: Built a FAISS-based vector search system that ingests PDF/MD/TXT/DOCX runbooks, persists embeddings, and retrieves top-k passages for AI context — demonstrating understanding of retrieval-augmented generation.

**Linux & Systems**: Metrics map to real Linux concepts (load average vs cores, %iowait, RSS growth and OOM killer, ENOSPC, deleted-but-open files, replication lag) — showing deep understanding of operating system internals.

**Networking**: Modeled packet loss vs network outage distinctly, with investigation paths via mtr, ip link, NIC drops, MTU/duplex — demonstrating network troubleshooting knowledge.

**Incident Management**: Implemented the full SRE incident lifecycle with status transitions, timeline events, and fault injection for chaos engineering practices.

**Testing & Quality**: Wrote 20 pytest integration tests covering critical API paths, structured logging with request/cluster/node context, and deterministic seed scripts for reproducible environments.

**Containerization**: Created Dockerfiles for backend and frontend with multi-stage builds, dependency caching, and docker-compose wiring — demonstrating production deployment practices.

---

## Product Thinking

**Human-in-the-Loop AI**: The AI proposes structured diagnoses (root cause, confidence, affected components, investigation steps, fix, prevention) but the engineer decides. The platform works fully without AI (deterministic fallback), ensuring reliability.

**Graceful Degradation**: Production uses managed cloud services (Supabase, Upstash, Gemini, Grafana Cloud) configured via environment variables, but every dependency has a zero-credential fallback. This means a reviewer can clone and demo immediately, and in production a degraded dependency reduces capability instead of causing an outage.

**Interview-Legible Features**: Each feature maps to an SRE concept (RED vs USE methods, golden signals, alert deduplication, incident timelines, fault injection, RAG) — designed specifically for technical discussions.

**Enterprise UX**: The frontend uses a custom design system (not a generic component library) with an enterprise color palette, sortable/filterable tables with sticky headers, and Recharts visualizations — demonstrating attention to user experience in internal tools.

---

## Technologies Proficiency

**Backend**: Python, FastAPI, SQLAlchemy 2.0 (async), Alembic, Pydantic, WebSockets, pytest

**Database**: PostgreSQL (Supabase), SQLite, asyncpg, aiosqlite, connection pooling, migrations

**Caching**: Redis (Upstash), in-memory caching, TTL-based invalidation, pub/sub

**Observability**: Prometheus, prometheus_client, Grafana, RED method, USE method, metrics exposition

**AI/ML**: Google Gemini, structured JSON output, FAISS, vector embeddings, RAG, NumPy

**Frontend**: React, Vite, JavaScript, Recharts, Lucide icons, custom CSS, WebSocket client

**Systems**: Linux internals (CPU, memory, disk, networking, processes), psutil, Prometheus node exporter

**DevOps**: Docker, docker-compose, environment-based configuration

**Testing**: pytest, integration testing, API testing, deterministic seeding

---

## Architecture Highlights

```
Node Agent(s) ──heartbeat/metrics──▶  FastAPI backend  ──▶  PostgreSQL (Supabase)
 (psutil,                              │  alert engine        Redis (Upstash)
  Prometheus)                          │  incident mgr        FAISS (RAG)
                                       │  AI diagnosis ──────▶ Gemini
      Grafana Cloud ◀──/metrics────────┤  WebSocket hub
                                       ▼
                            React + Vite dashboard
```

The backend is stateless and horizontally scalable. WebSocket fan-out can be extended via Redis pub/sub across instances. The metrics table can be partitioned or offloaded to Prometheus for scale. The FAISS index can become a shared service.

---

## Key Differentiators

Unlike toy monitoring projects, PulseOps implements the full incident lifecycle with realistic fault injection that flows through the actual pipeline — not mocked endpoints. The AI integration uses structured JSON with schema validation and RAG grounding, not brittle free-text parsing. Every external dependency has a zero-credential fallback, making it immediately demoable while still being production-shaped with managed services.

This is a portfolio piece that demonstrates I can build, operate, and reason about complex infrastructure systems — not just use them.

link: https://github.com/pavithra2870/PulseOps