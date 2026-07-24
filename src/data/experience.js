export const experience = [
  {
    id: 'morph-systems',
    company: 'Morph Systems',
    role: 'Product Management & GTM Intern',
    current: true,
    link: { label: 'poppyfield.ai', href: 'https://poppyfield.ai' },
    summary:
      'Working across product and engineering on an internal AI agent platform — helping shape what gets built next, owning a product line of my own, and contributing to the systems that let the team ship new AI agents quickly and reliably.',
    highlights: [
      'Own an AI agent product line end to end, iterating through multiple rounds of quality hardening until output is consistently business-ready.',
      'Contributed to a growing internal agent library that has shipped 20+ AI agents into production.',
      'Contribute to platform reliability and internal tooling that make it faster and safer to build and ship new agents.',
      'Work cross-functionally between product and engineering, translating a plain-language brief into a scoped, shippable feature.',
      'Support go-to-market execution for new product surfaces, from positioning through launch.',
    ],
    tech: ['Product Strategy', 'Go-To-Market', 'AI Agent Platforms', 'Cross-Functional Collaboration'],
  },
  {
    id: 'phantos-ai',
    company: 'Phantos AI',
    role: 'AI Workflow Engineer Intern',
    current: false,
    summary:
      'Built a lead-qualification engine for automotive dealerships end to end: an n8n workflow that holds a natural conversation with a prospective buyer, extracts structured buying signals, scores lead quality in real time, and routes the conversation automatically — replacing a rule-based qualification process with one grounded in LLM reasoning and deterministic business logic.',
    highlights: [
      'Engineered prompts that force the LLM into strict structured JSON — vehicle interest, budget, timeline, financing preference, contact readiness, confidence — so downstream automation could stay deterministic while the conversation itself stayed natural.',
      'Built a stateful conversation layer on Supabase that restores prior context, avoids re-asking known information, and supports users returning across sessions.',
      'Designed a weighted lead-scoring engine (intent, fit, urgency, contact readiness) that drives adaptive routing — hot handoff, warm nurturing, re-engagement, or graceful exit — based on conversation state rather than fixed turn counts.',
      'Added a 3-pass agentic JSON-healing loop plus fallback handling so the pipeline keeps operating even when the LLM returns malformed output.',
    ],
    tech: ['n8n', 'Groq API', 'JavaScript', 'Supabase', 'REST APIs', 'Prompt engineering', 'Workflow automation'],
  },
  {
    id: 'kognitive-networks',
    company: 'Kognitive Networks',
    role: null,
    current: false,
    summary:
      'Worked across search infrastructure, network analytics, and support automation — four distinct systems spanning retrieval, forecasting, and agent orchestration.',
    highlights: [
      'Architected a production RAG search bot for complex internal documents, adding semantic caching via HNSW to reduce inference costs and latency.',
      'Designed a Retrieval-Augmented Generation system using OpenAI embeddings and Pinecone vector database for semantic search across technical documentation.',
      'Implemented chunking strategies and retrieval optimization to improve answer quality for complex technical queries.',
    ],
    tech: ['Python', 'HNSW', 'n8n', 'OpenAI embeddings', 'Pinecone'],
  },
  {
    id: 'soul-of-arts',
    company: 'Soul of Arts',
    role: 'Full Stack Developer, Designer & Launch Consultant (independent)',
    current: false,
    link: { label: 'soulofarts.in', href: 'https://soulofarts.in' },
    summary:
      'A fine art studio with no prior digital presence. I owned the entire process of turning it into a credible, discoverable, conversion-ready brand - design, engineering, SEO, and launch - as the sole contributor.',
    highlights: [
      'Designed and built the full site as a single-page application in HTML, CSS, and vanilla JavaScript — glassmorphism nav, staggered hero grid, masonry gallery with lightbox, and scroll-triggered reveals via the Intersection Observer API — with no frameworks or build tools.',
      'Implemented complete on-page SEO: keyword-targeted meta, canonical tags, Open Graph and Twitter Card markup, and Schema.org LocalBusiness structured data for rich search results.',
      'Created and optimized the Google Business Profile, connecting the studio to Google Search and Maps for the first time.',
      'Integrated a zero-backend enrollment form (FormSubmit.co) with custom AJAX handling and real-time submission-state feedback, plus a floating WhatsApp deep link for low-friction inquiries.',
      'Deployed to GitHub Pages on a custom GoDaddy domain with full DNS configuration.',
    ],
    outcome:
      'The studio launched with a professional web presence, appeared on Google Search and Maps from day one, and enrolled roughly 10 students within its first five days.',
    tech: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'GitHub Pages', 'GoDaddy DNS', 'FormSubmit.co'],
  },
]
