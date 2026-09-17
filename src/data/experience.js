export const experience = [
  {
    
  id: 'morph-systems',
  company: 'Morph Systems',
  role: 'Product Management & GTM',
  current: false,
  link: { label: 'poppyfield.ai', href: 'https://poppyfield.ai' },
  summary:
    'Worked across product, engineering, and growth on an AI agent platform — building agent experiences, improving platform reliability, and shaping what gets built and launched next.',
  highlights: [
    'Built and shipped AI agents end to end, breaking complex workflows into reusable skills and hardening outputs through iterative evaluation.',
    'Built platform infrastructure including a dynamic tool registry, usage/cost tracking, workspace file management, and LLM reliability fixes.',
    'Hardened the agent build pipeline with automated quality evaluation, security checks, and review stages for safer, more reliable agent releases.',
    'Built user-facing product features across the agent marketplace and workspace, including agent discovery, chat deep links, file surfacing, and landing-page experiences.',
    'Ran hands-on product testing, identified UX and agent-quality gaps, and turned recurring issues into platform-level product improvements.',
    'Worked on competitive research, product prioritization, GTM strategy, and launch content for new AI product surfaces.'
  ],
  tech: [
    'AI Agent Platforms',
    'Python',
    'FastAPI',
    'JavaScript',
    'Growth', 'Product',
    'Gemini',
    'Product Strategy',
    'GTM'
  ]
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
      'Designed a Retrieval-Augmented Generation system using vector embeddings and vector database for semantic search across technical documentation.',
      'Implemented chunking strategies and retrieval optimization to improve answer quality for complex technical queries.',
    ],
    tech: ['Python', 'HNSW', 'n8n', 'OpenAI embeddings', 'Pinecone'],
  },
  {
    id: 'soul-of-arts',
    company: 'Soul of Arts',
    role: 'Full Stack, Designer & Launch',
    current: false,
    link: { label: 'soulofarts.in', href: 'https://soulofarts.in' },
    summary:
      'An art studio with no prior digital presence. I owned the entire process of turning it into a credible, discoverable, conversion-ready brand - design, engineering, SEO, and launch - as the sole contributor.',
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
