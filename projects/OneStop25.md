# OneStop 25

A Gen Z personal growth and year-end reflection app that uses AI to generate hyper-personalized affirmations, bucket list goals, aura scores, and lifestyle insights based on each user's unique profile.

---

# Elevator Pitch

OneStop 25 is a social self-reflection platform built for a very specific audience: college-aged Gen Z users who want to wrap up 2025 and intentionally plan 2026. Rather than a generic journaling app, it leans fully into internet culture — aura points, IN/OUT lists, vision boards, brainrot humor — and pairs that aesthetic with real AI personalization powered by Google Gemini.

The core idea is simple: you fill in your profile once (goals, major, hobbies, dream company, media taste), and every AI feature in the app becomes personally calibrated to you. The manifestations it writes, the bucket list goals it predicts, the aura moments it surfaces — all of it is grounded in your actual data, not generic templates.

What makes it different is the cultural fit. The app doesn't talk at users the way productivity apps do. It talks like a friend who knows your situation. The copy is irreverent, the UX has sound effects and animations, and the AI prompts are engineered to produce responses that feel personally observed, not machine-generated. That cultural specificity is a deliberate product decision, not an accident.

It also includes a genuine social layer — "Growth Circles" where users collaborate on shared bucket lists, vote on items, and invite friends by email — turning what could be a solo journaling experience into something shared.

---

# Product Overview

Users are college students and young adults (primarily 18–24) navigating the end of one year and the beginning of another. The typical workflow starts with onboarding, where the user fills out a 7-step profile covering their identity, past goals, future ambitions, interests, hobbies, media consumption, and languages. This profile becomes the seed data for every AI feature downstream.

From the dashboard, users access six distinct modules: their profile, an IN/OUT trends list, a 2026 bucket list, a vision board, friend circles, and an aura calculator. Each section is independently functional but collectively builds a picture of the user's year.

Core inputs are the onboarding profile, user-typed items, and AI-generated suggestions that users can accept or dismiss. Outputs are personalized affirmations saved to a vision board, categorized bucket list goals, IN/OUT cultural trend lists, and a running aura score with saved history. The experience is designed to feel like a single cohesive session rather than a collection of disconnected tools.

The real-world use case is someone sitting down in late 2025 or early 2026 to reflect on the year, laugh at memes about it, take a Gen Z lore quiz, and then genuinely set intentions for the year ahead with AI assistance.

---

# Problem Statement

Year-in-review and goal-setting apps exist in abundance, but almost all of them are either too clinical (productivity tools like Notion, Todoist) or too generic (template-based journals). Neither speaks to how Gen Z actually processes their year — through cultural shorthand, humor, peer validation, and aesthetic self-expression.

The existing solutions fail because they treat goal-setting as a serious, structured activity, when for this demographic it is deeply social, often ironic, and identity-driven. A 20-year-old is not going to open a productivity dashboard to reflect on their year; they are going to scroll through memes, make mental notes about what was "in" vs "out," and talk about it with friends.

OneStop 25 fills that gap by building the reflection experience around the culture itself. The tools are real and functional, but they are wrapped in a language and visual style that matches how the target user actually thinks and communicates.

---

# Key Features

## AI-Powered Manifestation Board
The vision board generates personal affirmations using Google Gemini, drawing directly from the user's stored profile — their 2025 goal, whether they achieved it, their 2026 aspirations, dream company, and lifestyle signals. The AI is explicitly instructed to avoid spiritual clichés and produce concrete, identity-grounded sentences in three structured categories: identity shift, daily behavior, and tangible outcome. Users can accept, reject, manually add, edit, and "eternalize" (lock) affirmations to their board. This exists because vague affirmations are useless — the AI is prompted to generate statements the user can actually recognize as their own.

## Aura Calculator
One of the most culturally distinctive features. The AI generates 15 "aura moments" — 10 gains and 5 losses — phrased in Gen Z vernacular (ate, cooked, unbothered, flop era). Each moment carries a point value, and users claim the ones that actually happened to them, accumulating a running aura score persisted in Firestore. The aura history is fed back into future prompts to prevent repetition. This feature demonstrates deliberate prompt engineering: the model is constrained to produce gains more frequently than losses, use specific language registers, and avoid productivity or therapy tone.

## Bucket List with AI Predictions
Users maintain a 2026 bucket list with items tagged by category signals (DREAM, TRAVEL, SELF, GROW, LOVE, WORK). The AI generates four personalized goal predictions based on the user's profile, explicitly formatted with a signal tag. Users can accept individual suggestions or dismiss them. Accepted items integrate directly into the Firestore-backed list with real-time sync. The feature solves the blank-canvas problem — most people struggle to articulate goals, and AI suggestions serve as a starting point rather than a replacement for personal choice.

## IN / OUT Lists
A culturally-loaded feature where users declare what is "in" and "out" for 2026 — habits, behaviors, mindsets. The AI generates four trend suggestions per side, calibrated to the user's profile and explicitly avoiding items already in their list. The dual-column layout makes the contrast immediately visual. This captures a specific internet ritual (the New Year IN/OUT list) and makes it personal and AI-assisted.

## Growth Circles (Collaborative Bucket Lists)
Users can create named "circles" — small groups — and invite friends by email. Within a circle, all members can post items to a shared bucket list, like items, and edit their own contributions. Items are sorted by likes in real time. The invite system looks up users by email in Firestore and adds them to the group's member arrays. This social layer transforms the app from a solo tool into something people use together, increasing retention and engagement.

## 7-Step Onboarding Profile
The onboarding form is the foundation of personalization. It collects name, age, occupation status, major/year, 2025 goal and completion status, 2026 goal, dream location, dream company, interests (from a curated list), media consumption habits, hobbies, and languages. Each step is animated with Framer Motion, accompanied by sound effects, and designed to feel like a conversation rather than a form. The profile is stored in Firestore and read by every AI function at call time.

## Landing Page with Meme Carousel and Lore Quiz
The public-facing landing page is itself a product. It features a scroll-driven color transition, physics-based marquee ticker, a draggable meme carousel of culturally relevant GIFs, and a 10-question Gen Z slang quiz with instant feedback. This is not decoration — it communicates the app's identity to new users immediately and doubles as a cultural filter (if you get the references, you are the target user).

## Rate Limiting on AI Features
Every AI endpoint enforces a per-user, per-feature daily limit of 10 calls using Firestore transactions. When the limit is reached, the client receives a specific error code and displays a humorous modal in the app's voice. The rate limit logic runs inside a Firestore transaction to prevent race conditions. This is a practical cost-control mechanism implemented correctly at the server level.

---

# Engineering Highlights

The backend is built entirely on Firebase Cloud Functions using Google's Genkit framework, which provides a structured, schema-validated interface for calling Gemini models. Each AI function defines explicit input and output schemas using Zod, enforces server-side authentication, runs a rate-limit check via Firestore transaction, fetches user profile data, optionally fetches prior AI outputs to prevent repetition, calls the model with a crafted prompt, validates and sanitizes the response, falls back to hardcoded defaults on failure, and returns clean, typed data.

The frontend is a React SPA using React Router v6 with nested protected routes. Route guards validate both authentication state and UID-to-URL consistency — a security measure that prevents one logged-in user from accessing another's routes by manipulating the URL. All Firebase credentials are stored in environment variables and never committed to source.

Firestore is used as both the primary database and a real-time sync layer. Items in bucket lists, manifestations, IN/OUT entries, aura history, and group items all use `onSnapshot` listeners for live updates without manual polling. Data is organized per-user under sub-collections, and group data lives in a separate top-level `groups` collection with member ID arrays for access control.

Animation throughout the app is handled by Framer Motion, including layout animations, presence transitions, page-level scroll transforms, and interactive hover/tap states. Sound effects play on most user interactions using the Web Audio API via `useRef`-managed Audio objects, adding a tactile layer to the UX.

The app is configured for the Firebase `asia-south1` (Mumbai) region, reflecting a deployment targeting Indian users. API keys for Gemini are stored as Firebase secret manager secrets and injected at function runtime.

---

# AI / ML Components

The app uses Google Gemini 2.0 Flash as its LLM, accessed via the Genkit SDK running in Firebase Cloud Functions. There are four distinct AI flows, each independently callable:

`generateAIVision` produces three structured manifestation sentences based on the full user profile and existing saved manifestations (to prevent repetition). The prompt enforces exact word counts per sentence and assigns each sentence a structural role.

`generateInOut` produces four trend items for either the IN or OUT side of the user's list, calibrated to their profile and avoiding previously generated items.

`generateBucketItems` generates four 2026 bucket list goals with categorical signal tags, grounded in the user's goals, interests, and lifestyle.

`generateAuraMoments` generates exactly 15 aura moments (10 gains, 5 losses) with specific point values, using Gen Z language and avoiding previously claimed moments from the user's history. The aura history (up to 40 past items) is passed into the prompt as a deduplication context.

All four flows use Zod output schemas to structure the model's JSON responses. Each includes a hardcoded fallback array guaranteeing a valid response even if the model returns malformed or insufficient output. This is practical prompt engineering with production-grade reliability handling.

---

# Product Thinking

The most notable product decision in OneStop 25 is the cultural specificity of the target audience. Rather than building a generic goal-setting app, the builder identified a specific moment (year-end 2025), a specific demographic (Gen Z college students), and a specific cultural register (internet humor, aura points, IN/OUT lists), and built the entire product experience around that intersection. This is a sharp product instinct.

The 7-step onboarding is a deliberate investment in personalization infrastructure. Collecting this data upfront enables every downstream AI feature to produce relevant, personalized output — which directly impacts whether users find the AI features delightful or generic. The onboarding is also designed to minimize drop-off: each step is short, visually distinct, and accompanied by animation and sound feedback.

The daily AI rate limit is a product constraint that doubles as a feature. The error modals are written in the app's voice ("Stop abusing AI because you are cooked"), which preserves the brand tone even in error states. This is a small but intentional detail that shows consistency in product thinking.

The decision to include a meme carousel and lore quiz on the landing page is also a product choice, not a development indulgence. It communicates the app's identity instantly, self-selects the right audience, and gives new visitors a reason to engage before signing up.

The Growth Circles feature reflects thinking about social adoption — individual tools are stickier when they have a collaborative component, and shared bucket lists give existing users a reason to invite friends.

---

# Technologies Used

## Languages
- JavaScript (ES2022+)

## Frontend
- React 19
- React Router v6
- Framer Motion
- CSS Modules / Custom CSS
- Web Audio API

## Backend
- Firebase Cloud Functions (Node.js 24)
- Google Genkit (AI flow framework)
- Zod (schema validation)

## Databases
- Firebase Firestore (real-time NoSQL)

## Cloud
- Firebase (Hosting, Auth, Functions, Firestore)
- Google Cloud Secret Manager (API key management)
- Deployed to `asia-south1` region

## AI / ML
- Google Gemini 2.0 Flash (LLM)
- Genkit SDK (`@genkit-ai/googleai`, `@genkit-ai/firebase`)
- Structured output schemas with Zod
- Prompt engineering with fallback guarantees

## Authentication
- Firebase Authentication (Google OAuth via popup)

## APIs
- Firebase Functions HTTPS Callable (client-to-backend)
- Firestore Transactions (atomic rate limiting)

## Tools
- Create React App
- nanoid (custom group ID generation)
- `@motionone/utils` (marquee physics)
- Firebase Emulator Suite (local dev)

---

# Skills Demonstrated

- Full Stack Development
- AI Engineering
- Prompt Engineering
- Backend Engineering (serverless)
- API Design (Firebase Callable Functions)
- Authentication and Authorization
- Real-Time Data Sync (Firestore onSnapshot)
- Database Design (sub-collections, access control arrays)
- Rate Limiting (Firestore transactions)
- Frontend Animation Engineering (Framer Motion)
- UX Thinking and Interaction Design
- Sound Design Integration (Web Audio API)
- Product Strategy and Audience Definition
- Onboarding Flow Design
- Personalization Systems
- Social / Collaborative Feature Design
- Cloud Deployment (Firebase, regional config)
- Security (route guards, UID validation, secret management)
- Error Handling and Graceful Degradation (AI fallbacks)

---

# Resume Impact

- Built a full-stack AI-powered web app using React, Firebase Cloud Functions, and Google Gemini, featuring four independently rate-limited AI flows with structured Zod output schemas and hardcoded fallback guarantees.
- Engineered a personalization pipeline where a 7-step onboarding profile is read at AI call time to generate user-specific manifestations, bucket list goals, lifestyle trend suggestions, and aura scores using Gemini 2.0 Flash.
- Implemented server-side per-user rate limiting across four AI features using atomic Firestore transactions, preventing race conditions and controlling LLM API costs.
- Designed and deployed a collaborative "Growth Circles" feature with real-time Firestore sync, email-based friend invites, and per-item like tracking across shared bucket lists.
- Built route-level security in React Router v6 that validates both authentication state and UID-URL consistency, preventing cross-user route access via URL manipulation.
- Developed four Genkit AI flows with explicit prompt engineering constraints — enforcing exact output counts, word lengths, language registers, and deduplication against prior user history.
- Delivered a production-quality landing page with scroll-driven background animations, physics-based marquee, draggable meme carousel, and an interactive Gen Z lore quiz, communicating brand identity before authentication.
- Stored and managed Gemini API secrets via Firebase Secret Manager, with all Firebase credentials injected via environment variables and excluded from source control.

---

# Ideal Roles

- Full Stack Engineer
- Frontend Engineer
- AI Engineer
- Product Engineer
- Software Engineer (early-stage / consumer apps)
- Technical Product Manager

---

# Portfolio Tags

React · Firebase · Gemini · Genkit · Node.js · AI Engineering · Prompt Engineering · Firestore · Cloud Functions · Full Stack · Real-Time Sync · Google OAuth · Framer Motion · Serverless · Consumer App · Gen Z · Social Features · Rate Limiting · Personalization · LLMs

---

# Project Complexity

**Intermediate — trending toward Production-grade**

The project demonstrates genuine engineering depth: multiple AI flows with schema validation and fallback logic, server-side rate limiting via Firestore transactions, real-time collaborative features, route-level security, regional cloud deployment, and secret management. The code shows deliberate decisions at every layer — not just "it works" but "it works correctly and safely." What keeps it from full production-grade classification is the absence of automated testing, error monitoring, and CI/CD pipelines. The feature surface and engineering quality otherwise match a well-scoped v1 production consumer app.

---

# One-line Portfolio Summary

A Gen Z year-end reflection app with four Gemini-powered AI features, real-time collaborative bucket lists, and a full Firebase backend — personalized from a 7-step onboarding profile to every AI call.

---

# Repository Evidence

- `src/App.js` — routing structure, protected routes, UID validation guard
- `src/AuthContext.js` — Google OAuth, Firestore user sync, onboarding state detection
- `src/OnboardingForm.js` — 7-step profile collection, Firestore write
- `src/Dashboard.js` — hub navigation, section layout
- `src/ManifestationPage.js` — vision board CRUD, AI integration
- `src/AuraCalculator.js` — aura scoring, history persistence, AI integration
- `src/BucketList.js` — categorized list, AI predictions, real-time sync
- `src/InOutSection.js` — dual-column IN/OUT list, AI integration
- `src/GroupList.js` — circle creation, nanoid group IDs, member management
- `src/CircleDetail.js` — collaborative items, likes, email invite system
- `src/LandingPage.js` — meme carousel, lore quiz, scroll animations, marquee
- `src/firebase.js` — Firebase init, `asia-south1` region config
- `functions/index.js` — four Genkit AI flows, Zod schemas, rate limiting, fallbacks
- `functions/package.json` — Genkit, Firebase Functions, Zod dependencies, Node 24
- `package.json` — React 19, Framer Motion, Firebase SDK, Genkit client
- link: https://github.com/pavithra2870/One-Stop-25