# Lead Qualification Engine
**AI Workflow Engineer Intern — Phantos AI**

## Overview

Built an AI-powered lead qualification engine for automotive dealerships that conducts natural conversations with prospective buyers, extracts buying intent, scores lead quality in real time, and automatically routes qualified leads through the sales pipeline.

The system combines LLM reasoning, workflow orchestration, conversational memory, and structured business logic to replace traditional rule-based lead qualification.

---

# What I Built

## 1. Designed the complete AI conversation workflow

Built the entire multi-stage workflow in n8n that handles:

- Webhook & chat entry points
- Input normalization
- Session management
- AI prompt generation
- LLM execution
- Response parsing
- Lead routing
- Database persistence
- API response generation

The workflow supports both API requests and live chat while sharing the same qualification pipeline.

---

## 2. Engineered structured LLM reasoning

Designed prompts that force the LLM to return structured JSON instead of free-form text.

The model extracts:

- Vehicle interest
- Budget
- Purchase timeline
- Financing preference
- Trade-in information
- Contact details
- Lead confidence scores
- Next conversational step
- Routing decision

This allowed deterministic downstream automation while keeping conversations natural.

---

## 3. Built a stateful conversation engine

Implemented persistent conversation memory using Supabase.

The system:

- restores previous conversations
- remembers previously collected information
- avoids asking duplicate questions
- supports returning users
- continues conversations across sessions

Each conversation is tracked using a unique session ID shared across the workflow.

---

## 4. Developed intelligent lead scoring

Implemented a weighted scoring engine using multiple dimensions:

- Purchase intent
- Customer fit
- Buying urgency
- Contact readiness

Combined these into an overall qualification score that dynamically determines the lead's status throughout the conversation.

---

## 5. Created adaptive conversation routing

Designed business logic that routes users into different conversational paths including:

- Continue qualification
- Request contact information
- Warm lead nurturing
- Hot lead handoff
- Graceful exit
- Cold lead handling
- Conversation re-entry

Routing decisions depend on conversation context instead of fixed turn counts.

---

## 6. Implemented conversational state management

Developed logic for:

- merging newly extracted signals
- preserving previously collected information
- preventing accidental overwrites
- detecting missing qualification fields
- tracking conversation progress

This ensured the AI continuously built user context over multiple interactions.

---

## 7. Built robust response validation

Implemented multiple safety layers including:

- JSON extraction
- malformed response recovery
- fallback handling
- score normalization
- confidence validation
- contact information verification
- contradiction detection

The workflow continues operating even if the LLM returns invalid output.

---

## 8. Engineered lead qualification logic

Implemented qualification rules for:

- Hot leads
- Warm leads
- Contact-ready leads
- Returning users
- Low-intent visitors

The engine automatically determines the next business action based on conversation state and extracted signals.

---

## 9. Designed scalable workflow architecture

Built the workflow as modular components including:

- Trigger layer
- AI reasoning layer
- Parsing layer
- Decision engine
- Database layer
- Routing layer
- Response layer

Each module can be independently extended without affecting the overall pipeline.

---

## 10. Integrated persistent data storage

Connected the workflow with Supabase to maintain:

- Leads
- Sessions
- Messages
- Conversation history
- Extracted signals
- Lead status

Database writes are executed in parallel to reduce latency.

---

# Technical Highlights

### AI

- Prompt Engineering
- Structured JSON generation
- Multi-turn conversations
- Stateful chat
- Context injection
- Response validation

---

### Backend

- n8n workflow orchestration
- REST webhook APIs
- Session management
- Database persistence
- Error recovery
- Parallel workflow execution

---

### Decision Engine

Implemented custom logic for:

- weighted confidence scoring
- lead classification
- qualification thresholds
- contact readiness
- conversation progression
- adaptive routing

---

### Reliability

Built safeguards for:

- malformed LLM outputs
- fallback responses
- invalid contact information
- conversation recovery
- session persistence
- graceful degradation

---

# Tech Stack

- n8n
- Groq API
- JavaScript
- Supabase
- REST APIs
- JSON
- Workflow Automation

---

# Impact

- Automated multi-turn lead qualification
- Reduced manual qualification effort
- Enabled intelligent routing based on buyer intent
- Created reusable conversational AI workflow architecture
- Combined LLM reasoning with deterministic business logic for production-ready automation

---

# Key Engineering Learnings

During this project I gained hands-on experience in:

- Designing production-grade AI workflows
- Building stateful conversational systems
- Prompt engineering for structured outputs
- Workflow orchestration using n8n
- LLM response validation
- Multi-step decision engines
- AI-assisted sales automation
- Session and conversation management
- Production error handling
- Building scalable automation pipelines