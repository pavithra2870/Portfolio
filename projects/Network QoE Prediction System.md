# Network QoE Prediction System

A production-grade intelligence platform for telecom operators that predicts Quality of Experience degradation and silent churn before users complain, with explainable AI for root cause analysis.

---

# Elevator Pitch

This project is a proactive network intelligence platform designed for telecom operators and network operations teams. It addresses the critical problem of silent churn—users who gradually reduce usage due to poor network experience without ever filing complaints. Traditional monitoring systems only react to explicit complaints or outages, missing the majority of churn risk that manifests through subtle QoE degradation patterns.

The system combines deep learning (LSTM networks with attention) for sequence-based prediction, gradient boosting (XGBoost) for tabular analysis, and SHAP-based explainable AI to provide both accurate predictions and interpretable root cause insights. What makes this solution interesting is its dual-model architecture that captures temporal patterns in user sessions while maintaining fast, explainable baseline predictions, all wrapped in an interactive dashboard that enables network operators to move from reactive firefighting to proactive intervention.

The platform differentiates itself through comprehensive explainability—every prediction comes with feature-level attribution showing exactly which network KPIs drove the decision, enabling operators to take targeted action rather than guessing at root causes.

---

# Product Overview

**Users**: Network operations teams, telecom engineers, customer retention specialists, and network planning analysts at telecom operators and ISPs.

**Primary Workflow**: Operators launch the dashboard to view real-time network health, identify at-risk users through QoE and churn predictions, drill down into specific users or regions to understand root causes via SHAP explanations, and receive actionable intervention recommendations based on trend forecasting.

**Core Functionality**: The system ingests network session data (latency, throughput, packet loss, application metrics, user behavior) and outputs QoE scores (1-5), QoE classifications (good/medium/poor), and churn probabilities per user per session. It maintains rolling historical views, detects degradation trends, and flags users at high risk of churn.

**Inputs**: Network QoS metrics (latency, jitter, packet loss, throughput, signal strength), application QoE metrics (video buffering, page load times, bitrate), user behavior data (session duration, frequency, abandonment patterns), and contextual information (device type, network type, region, plan tier).

**Outputs**: Predictive QoE scores and classifications, churn probabilities with risk segmentation, SHAP-based feature importance rankings, root cause analysis reports, trend forecasts, and prioritized intervention recommendations.

**User Experience**: A dark glassmorphism Streamlit dashboard with seven interactive sections allowing operators to filter by network type, user profile, plan tier, and time range. The interface presents executive-level KPIs alongside detailed drill-down capabilities, enabling both high-level monitoring and granular investigation.

**Real-World Use Case**: A network operations center uses the platform daily to identify regions experiencing QoE degradation, understand which specific KPIs (e.g., packet loss during peak hours) are driving the issues, and proactively reach out to at-risk users with targeted offers or network optimizations before churn occurs.

---

# Problem Statement

Telecom operators lose significant revenue to silent churn—users who gradually reduce service usage due to poor Quality of Experience without ever filing complaints or contacting support. Traditional network monitoring systems focus on uptime and explicit fault detection, missing the subtle degradation patterns that precede churn. By the time a user cancels service, the opportunity for intervention has passed.

This problem is critical because customer acquisition costs in telecom are extremely high, and retention is far more cost-effective than acquisition. Existing solutions are insufficient because they either lack predictive capabilities, don't account for temporal patterns in user behavior, or provide black-box predictions that operators cannot trust or act upon. Network teams need both accurate early warning systems and interpretable insights to take effective action.

---

# Key Features

## Predictive Intelligence

- **QoE Score Prediction**: LSTM-based sequence models predict QoE scores (1-5) by analyzing patterns across 10 consecutive sessions, capturing temporal degradation that single-session metrics miss.

- **Churn Risk Assessment**: Bidirectional LSTM models predict churn probability per user by learning from historical session patterns, abandonment streaks, and usage decay signals.

- **Dual-Model Architecture**: Combines deep learning for sequence modeling with XGBoost for fast, explainable tabular predictions, providing both accuracy and interpretability.

## Explainable AI

- **Global Feature Importance**: SHAP values reveal which network KPIs (latency, packet loss, throughput, etc.) most strongly influence QoE and churn across the entire user base.

- **Per-User Explanations**: Local SHAP explanations show exactly which features drove each individual user's prediction, enabling personalized intervention strategies.

- **Root Cause Ranking**: Aggregates SHAP contributions to identify top degradation drivers and churn factors per day, helping operators prioritize network improvements.

## Proactive Operations

- **Trend Forecasting**: Projects QoE and churn risk trajectories based on historical patterns, enabling operators to anticipate issues before they escalate.

- **Intervention Recommendations**: Provides ranked suggestions for at-risk users based on their specific churn drivers and risk profiles.

- **Risk Segmentation**: Categorizes users into high/medium/low risk buckets for prioritized outreach and resource allocation.

## Data Generation

- **LLM-Enhanced Synthesis**: Optional Ollama pipeline uses multi-model prompting to generate realistic synthetic training data when real data is unavailable.

- **Mathematical Fallback**: AR(1) process with physics-based correlations ensures reliable data generation even without LLM access.

- **Profile-Based Simulation**: Generates five distinct user profiles (normal, gradual degradation, sudden failure, silent churn, premium) to train models on diverse scenarios.

## Interactive Dashboard

- **Executive Overview**: High-level KPI cards, QoE trends with confidence intervals, churn timeline, and profile breakdown for strategic decision-making.

- **Network Health Visualization**: Region-by-day heatmaps, peak hour analysis, congestion flow diagrams, and network type comparisons for operational monitoring.

- **User Behavior Analytics**: Session decay patterns, usage trend cohorts, plan type analysis, and abandonment rate tracking for customer insight.

- **Prediction Explorer**: Risk segmentation donut charts, probability distributions, and per-user timeline views for detailed investigation.

- **XAI Insights Panel**: SHAP bar charts, per-user contribution waterfalls, and decision summaries for model interpretation.

- **Root Cause Analysis**: Day-level anomaly detection, correlation ranking, and impact tables for troubleshooting.

- **Proactive Alerts**: Forecast charts, at-risk user tables, and ranked intervention recommendations for action planning.

---

# Engineering Highlights

**Deep Learning Architecture**: PyTorch-based LSTM models with multi-head self-attention mechanisms capture temporal dependencies in user session sequences. The QoE LSTM uses a dual-head design for simultaneous regression (score prediction) and classification (good/medium/poor), while the Churn LSTM employs bidirectional layers to capture both historical and local patterns. Training includes early stopping, gradient clipping, OneCycleLR scheduling, and class imbalance weighting.

**Gradient Boosting Baselines**: XGBoost models provide fast, interpretable predictions on engineered tabular features. Both QoE regression and churn classification models use hyperparameter-tuned configurations with regularization, subsampling, and F1-optimal threshold calibration for churn classification.

**Feature Engineering Pipeline**: Stateless transformations prevent data leakage while generating rolling statistics (3/7/14-day windows), QoE trend slopes via linear regression, usage decay signals, abandonment streaks, session interval features, and temporal encodings. The pipeline handles categorical encoding with LabelEncoders and numeric scaling with StandardScaler.

**Explainability Layer**: SHAP TreeExplainer provides exact, fast explanations for XGBoost models. The system computes global feature importance across samples, local per-instance explanations, top degradation drivers (negative SHAP), and top churn drivers (positive SHAP). Root cause analysis combines QoE and churn SHAP values into unified impact rankings.

**Data Generation**: Multi-model Ollama pipeline uses three specialized LLM prompts (network metrics, behavior patterns, label generation) with JSON validation and automatic fallback to mathematical AR(1) synthesis. Profile-based simulation ensures realistic temporal consistency and feature correlations.

**Model Persistence**: Joblib serializes XGBoost models, scalers, encoders, and feature column lists. PyTorch state dictionaries save LSTM architectures. SHAP values and global importance rankings are persisted as Parquet files for fast dashboard loading without recomputation.

**Dashboard Architecture**: Streamlit application with modular component structure, cached data loading with TTL, and sidebar filtering for network type, user profile, plan type, and day ranges. Custom CSS implements dark glassmorphism theme with gradient accents and responsive layouts.

**Pipeline Orchestration**: End-to-end pipeline script orchestrates data generation, model training, SHAP computation, and dashboard launch with configurable parameters for dataset size, simulation duration, epochs, and Ollama usage.

**Performance Optimization**: GPU acceleration for LSTM training (CUDA), batch processing for LLM data generation, Parquet format for efficient data storage, and background sampling for SHAP computation to balance accuracy with speed.

---

# AI / ML Components

**Deep Learning**: PyTorch LSTM networks with stacked layers, bidirectional processing, multi-head self-attention, and dual-head output design for multi-task learning. Custom loss functions combine MSE regression with cross-entropy classification.

**Gradient Boosting**: XGBoost models for tabular QoE regression and churn classification with hyperparameter tuning, regularization, and probability calibration.

**Sequence Modeling**: Sliding window sequence construction from user session histories, enabling LSTM models to learn temporal patterns in QoE degradation and churn precursors.

**Feature Engineering**: Rolling window statistics, linear regression trend slopes, decay ratios, streak detection, and interval analysis transform raw metrics into predictive signals.

**Explainable AI**: SHAP TreeExplainer for global and local model interpretations, feature importance ranking, root cause attribution, and churn driver analysis.

**LLM Integration**: Ollama multi-model prompting pipeline for synthetic data generation with structured JSON output, validation, and automatic fallback to mathematical generation.

**Class Imbalance Handling**: Weighted binary cross-entropy loss for churn prediction, F1-optimal threshold calibration, and stratified sampling considerations.

**Training Infrastructure**: Early stopping, learning rate scheduling (OneCycleLR), gradient clipping, AdamW optimization, and train/validation/test splitting with reproducible random seeds.

**Model Evaluation**: Regression metrics (MSE, MAE) for QoE, classification metrics (accuracy, precision, recall, F1) for churn, and threshold optimization for business-aligned decision boundaries.

---

# Technologies Used

## Languages

Python

## Frontend

Streamlit (dashboard framework)
Plotly (interactive visualizations)
Matplotlib (static charts)
Seaborn (statistical graphics)

## Backend

PyTorch (deep learning)
XGBoost (gradient boosting)
scikit-learn (preprocessing and metrics)
Pandas (data manipulation)
NumPy (numerical computing)

## Databases

Parquet (data persistence via PyArrow)
Joblib (model serialization)

## AI/ML

PyTorch (LSTM, attention mechanisms)
XGBoost (gradient boosting)
SHAP (explainable AI)
Ollama (local LLM inference)

## APIs

Ollama HTTP API (local LLM calls)

## Frameworks

PyTorch (deep learning framework)
Streamlit (web framework)

## Tools

tqdm (progress bars)
python-dateutil (date handling)
requests (HTTP client)

---

# Skills Demonstrated

- Deep Learning Engineering
- Sequence Modeling with LSTM
- Attention Mechanisms
- Gradient Boosting with XGBoost
- Explainable AI (SHAP)
- Feature Engineering
- Time Series Analysis
- Multi-Task Learning
- Class Imbalance Handling
- Model Training Orchestration
- Data Pipeline Design
- Synthetic Data Generation
- LLM Integration
- Dashboard Development
- Interactive Visualization
- Product Thinking for ML Systems
- Proactive Analytics Design
- Root Cause Analysis
- Model Interpretability
- Python Software Engineering
- PyTorch Framework
- Streamlit Framework

---

# Resume Impact

- Architected and implemented a production-grade network intelligence platform combining LSTM deep learning and XGBoost for QoE prediction and churn prevention
- Designed dual-model architecture with sequence-based LSTM networks and tabular gradient boosting to capture both temporal patterns and fast explainable predictions
- Implemented comprehensive explainable AI layer using SHAP to provide global feature importance and per-user root cause analysis for model interpretability
- Built end-to-end data pipeline with feature engineering including rolling statistics, trend analysis, and churn signal detection from raw network session data
- Developed interactive 7-section Streamlit dashboard with real-time filtering, executive KPIs, and drill-down capabilities for network operations teams
- Engineered multi-model LLM pipeline using Ollama for realistic synthetic data generation with automatic fallback to mathematical AR(1) processes
- Deployed training infrastructure with early stopping, learning rate scheduling, GPU acceleration, and class imbalance handling for robust model performance
- Created proactive alerting system with trend forecasting and intervention recommendations to enable operators to prevent churn before users cancel service

---

# Ideal Roles

- AI Engineer
- Machine Learning Engineer
- Data Scientist
- Applied Scientist
- Backend Engineer (ML-focused)
- Full Stack Engineer (ML applications)
- Product Engineer
- Technical Product Manager (ML products)
- MLOps Engineer
- Data Engineer

---

# Portfolio Tags

PyTorch

LSTM

XGBoost

SHAP

Explainable AI

Time Series

Sequence Modeling

Deep Learning

Gradient Boosting

Feature Engineering

Streamlit

Dashboard

Telecom

Network Analytics

Churn Prediction

QoE

LLM Integration

Ollama

Data Pipeline

Python

---

# Project Complexity

Advanced

This project demonstrates advanced engineering through its integration of multiple ML paradigms (deep learning, gradient boosting, explainable AI), sophisticated feature engineering pipeline, dual-model architecture, production-grade training infrastructure, and complete end-to-end system from data generation to interactive dashboard. The combination of sequence modeling, attention mechanisms, SHAP explanations, and LLM integration places this well beyond intermediate tutorial-level work.

---

# One-line Portfolio Summary

Production-grade telecom intelligence platform combining LSTM deep learning and XGBoost with SHAP explainable AI to predict network QoE degradation and prevent silent churn through proactive root cause analysis.

---

# Repository Evidence

- config.py: Central configuration with model hyperparameters, feature ranges, and directory structure
- requirements.txt: Complete dependency stack including PyTorch, XGBoost, SHAP, Streamlit
- src/models/lstm_model.py: PyTorch LSTM architectures with attention, dual-head design, and custom loss functions
- src/models/xgboost_model.py: XGBoost model implementations with hyperparameter tuning
- src/models/trainer.py: Training orchestration with early stopping, learning rate scheduling, and model persistence
- src/features/engineering.py: Feature engineering pipeline with rolling statistics, trend analysis, and sequence building
- src/explainability/shap_explainer.py: SHAP-based explainability with global and local explanations
- src/data_generation/ollama_pipeline.py: Multi-model LLM pipeline for synthetic data generation
- src/data_generation/synthetic_generator.py: Mathematical AR(1) fallback data generator
- dashboard/app.py: Streamlit application with modular component structure and filtering
- dashboard/components/: Seven dashboard sections for executive overview, network health, predictions, XAI, root cause, and alerts
- scripts/run_pipeline.py: End-to-end pipeline orchestration
- scripts/train_models.py: Model training entry point
- scripts/generate_data.py: Data generation entry point
- link: https://github.com/pavithra2870/QoE