# AirMind AI: Urban Air Intelligence Operating System

## Project Overview

AirMind AI is a comprehensive urban air quality management system that transforms cities from reactive pollution monitoring to proactive intervention. Unlike traditional AQI dashboards that simply display current conditions, AirMind AI serves as a mission-control console for Smart City Commissioners, enabling them to forecast pollution events, attribute causes, plan interventions, simulate scenarios, and provide AI-powered guidance to both citizens and administrators.


## The Problem I Solved

Most air quality tools tell you pollution is bad *after* it's already bad. They lack predictive capabilities, actionable insights, and the ability to explain *why* air quality is deteriorating or *what* to do about it. City administrators operate without a unified system to forecast pollution, understand its sources, evaluate intervention strategies, or communicate effectively with citizens.

AirMind AI addresses this by providing an integrated operating system that combines real-time monitoring, machine learning forecasting, source attribution, intervention planning, and grounded AI assistance—all in one platform.

## What I Built

### Core Modules

**Live City Intelligence Dashboard**
- Real-time AQI monitoring with composite scoring
- Interactive map (Leaflet.js) displaying pollution hotspots, schools, hospitals, industries, and construction zones
- Weather conditions and meteorological data
- Geospatial risk visualization with heatmaps

**Forecast Engine**
- AQI predictions at 6h, 24h, 48h, and 72h horizons with confidence bands
- XGBoost model trained on historical air quality data
- Bounded recursive forecasting to prevent unrealistic predictions
- Last-week comparison for context
- Graceful fallback to analytic projection when model unavailable

**Pollution Attribution Agent**
- Data-driven source apportionment computed from live pollutant concentrations
- Identifies contributions from traffic, construction dust, industry, biomass burning, and ozone
- Provides evidence-based rationale with specific pollutant measurements
- Dynamic attribution that changes with actual conditions (not hardcoded)

**Intervention Planner**
- Ranked, actionable measures with expected AQI improvement (Δ)
- City-agnostic planning that targets actual hotspots and facilities
- Impact estimation with confidence scores
- Diminishing-returns aggregation for realistic combined projections
- Authority references for each intervention

**Scenario Simulator**
- "What-if" counterfactual modeling (e.g., "stop construction", "rain event", "reduced traffic")
- Live counterfactual model that estimates AQI changes
- Helps administrators pressure-test decisions before implementation

**Citizen Copilot**
- RAG-powered Q&A for everyday questions (jogging safety, children's outdoor activities, cycling routes)
- Grounded answers with sources, confidence scores, and retrieved chunks
- Refuses to answer when insufficient context exists (no hallucination)
- Incorporates live air quality conditions into responses

**Commissioner Copilot**
- Administrative AI assistant for ward priorities and recommended actions
- One-click report generation with PDF export
- RAG-based answers drawing from policy documents and operational guidelines

## Engineering Approach

### Architecture

**Full-Stack Design**
- Frontend: React + Vite with custom CSS (glassmorphism design, no framework dependencies)
- Backend: FastAPI with modular architecture (api → services → agents → ai/rag)
- REST API communication with axios
- Clean separation of concerns with dedicated layers per module

**Data Pipeline**
- Live ingestion from WAQI (World Air Quality Index) API
- Historical backfill from OpenWeather for model training
- Supabase (Postgres) for persistent storage
- City profile system with graceful fallback chain (Supabase → local cache → seed data)
- Config-driven multi-city support (Delhi, Chennai profiles included)

**AI/ML Integration**
- XGBoost forecaster trained on real historical data with feature engineering (AQI lags, hour-of-day, day-of-week)
- Bounded recursive prediction with physical plausibility constraints
- RAG pipeline: documents → chunking → MiniLM embeddings → FAISS vector store → retrieval → LLM context injection → grounded answers
- Similarity threshold gating to prevent hallucination
- Graceful degradation: hashed embeddings when MiniLM unavailable, numpy search when FAISS unavailable, extractive composition when LLM unavailable

### Key Technical Decisions

**DEMO_MODE by Default**
- System runs fully with zero API keys using realistic mock data
- Enables immediate demonstration and development without external dependencies
- Seamless transition to live mode through environment configuration

**Graceful Degradation Strategy**
- Every external dependency has a fallback path
- System never "breaks on camera" during demos
- Examples: no MiniLM → hashed embeddings, no FAISS → numpy cosine search, no trained model → analytic projection, no backend → frontend mock layer

**Grounded AI Philosophy**
- RAG answers always include sources, confidence scores, and retrieved chunks
- System refuses to answer when similarity score falls below threshold
- Live air quality context injected into LLM prompts for situationally relevant responses

**City-Agnostic Design**
- Single source of truth through `load_city()` function
- Switching cities requires only environment variable + JSON profile
- All modules (attribution, interventions, map) automatically adapt to city data
- Map auto-recenters based on city coordinates

**Data-Driven Intelligence**
- Attribution computed from actual pollutant mix (NO₂/CO→traffic, coarse PM→dust, SO₂→industry, etc.)
- Interventions target live top hotspots and name actual city facilities
- Expected AQI deltas scale with current pollution severity
- No hardcoded city-specific logic in agents

## Technologies Demonstrated

**Frontend Development**
- React 18 with modern hooks (useState, useMemo)
- Vite build system for fast development
- Custom CSS architecture with design tokens and glassmorphism
- Leaflet.js + React-Leaflet for interactive maps
- Recharts for data visualization
- Component-based architecture with reusable UI elements

**Backend Development**
- FastAPI with async support and automatic OpenAPI documentation
- Pydantic for data validation and settings management
- Modular project structure (api, services, agents, ai, rag, database)
- CORS middleware configuration
- Environment-based configuration with pydantic-settings

**Machine Learning**
- XGBoost for time-series forecasting
- Feature engineering with lag features and temporal encoding
- Model training pipeline with metrics tracking
- Bounded recursive prediction to prevent error compounding
- scikit-learn for data preprocessing

**Retrieval-Augmented Generation**
- sentence-transformers (MiniLM) for embeddings
- FAISS for efficient vector similarity search
- Custom chunking strategy for documents
- RAG pipeline orchestration with threshold gating
- Gemini LLM integration with context injection
- Extractive fallback when LLM unavailable

**Data Engineering**
- Supabase client integration for PostgreSQL operations
- Real-time API ingestion (WAQI, OpenWeather)
- Data backfill pipelines for historical training data
- JSON-based city profiles with comprehensive geospatial data
- Repository pattern for database operations

**Geospatial & Visualization**
- Interactive mapping with Leaflet.js
- Custom map overlays for pollution hotspots, facilities, and zones
- AQI dial visualization with color-coded categories
- Time-series charts for forecasts and historical comparisons
- Heatmap representations for pollution distribution

**API Integration**
- RESTful API design with FastAPI
- External API integration (WAQI, OpenWeather, Gemini)
- Error handling and retry logic
- Response caching strategies
- Mock data layer for offline development

**System Design**
- Graceful degradation patterns
- Configuration-driven architecture
- Multi-tenancy support (multiple cities)
- Fallback chains for data sources
- Environment-based feature flags

## Product Thinking

**User-Centric Design**
- Dual user personas: citizens (everyday questions) and commissioners (administrative decisions)
- Context-aware responses that incorporate live conditions
- Clear visual hierarchy with glassmorphism UI for modern aesthetics
- Progressive disclosure of complex information

**Trust & Transparency**
- Every AI answer includes sources and confidence scores
- System explicitly states when using trained models vs. analytic projections
- Refusal to answer rather than hallucination when context insufficient
- Evidence-based attribution with specific pollutant measurements

**Actionability**
- Interventions ranked by impact with expected AQI improvements
- Scenario simulator enables decision testing before implementation
- One-click report generation for administrators
- Specific target wards and facilities named in recommendations

**Reliability**
- System designed to never fail during demonstrations
- Comprehensive fallback chains for all external dependencies
- Realistic mock data that mirrors live system behavior
- Clear communication of system state and data sources

## Impact & Skills

This project demonstrates proficiency in:
- **Full-stack development** with modern React and FastAPI
- **Machine learning engineering** including model training, feature engineering, and production deployment
- **RAG system implementation** with embeddings, vector stores, and LLM integration
- **Data engineering** with real-time ingestion, historical backfill, and database operations
- **Geospatial visualization** and interactive mapping
- **System design** with graceful degradation and configuration-driven architecture
- **API design** and external service integration
- **UI/UX design** with custom CSS and modern aesthetics
- **Product thinking** focused on user needs, trust, and actionability

The system represents a complete, production-grade application that combines cutting-edge AI with practical urban management needs, demonstrating the ability to deliver complex, multi-disciplinary solutions that solve real-world problems.

link: https://github.com/pavithra2870/AirMind-AI