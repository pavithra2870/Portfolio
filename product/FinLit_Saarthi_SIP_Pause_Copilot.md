---
category: Product Management
date: October 2026
featured: true
links:
  case_study: "https://drive.google.com/file/d/1_PsTzGPLELwZbvfUlifi7e6FnQ0I1y_b/view?usp=drive_link"
  figma: "https://www.figma.com/design/g82WFy9WqbkX6ansZkCddj/FinLit-Saarthi-%E2%80%94-SIP-Pause-Co-pilot--Prototype-?node-id=0-1&t=0dNeOd0LeeqRlG8k-1"
  source_document: FinLit_Saarthi_SIP_Pause_Pavithra.pdf
role: Product case study
slug: finlit-saarthi-sip-pause-copilot
status: concept
tags:
- Product Management
- Fintech
- AI
- Explainability
- Behavioural Design
- SIP
- Experimentation
title: FinLit Saarthi --- An AI Co-pilot for the SIP Pause Moment
type: product-case-study
---

# FinLit Saarthi: An AI Co-pilot for the SIP Pause Moment

## At a glance

**The problem:** Investors can pause or reduce a Systematic Investment
Plan (SIP) with little context about how that decision could affect a
goal they are funding.

**The proposal:** Saarthi is an explainable, goal-aware intervention
shown immediately before a user confirms a pause or reduction. It
explains market context, estimates goal impact using deterministic
calculations, and presents options without taking the decision away from
the investor.

**Product principle:** Inform, never advise; never block. The investor
always decides.

## Problem framing

Financial platforms can present information after a decision has
effectively been made. Saarthi focuses on the high-stakes moment when an
investor is about to pause or reduce an SIP.

The case study argues that generic educational content and existing
pause flows do not adequately connect the decision to an investor's
goal. It also acknowledges the counterpoint: pausing can be rational, so
the product should not shame users or assume continuing is always
correct.

## Target user

**Lead persona:** Rohan Mehta, a fictional 29-year-old software engineer
in Bengaluru who has three SIPs and is funding a home down-payment goal.
His portfolio is down, negative headlines are increasing anxiety, and he
is considering pausing a ₹10,000 monthly SIP.

The persona is illustrative and is used to make the decision journey
concrete.

## Product concept

Saarthi appears when a user taps Continue in a pause or reduce flow for
an eligible goal-linked SIP. In a full intervention, it provides a short
check-in with:

1.  **Market context:** Explain the relevant market movement and what it
    means for the SIP, in plain language.
2.  **Goal impact:** Compare illustrative outcomes for continuing,
    reducing or pausing, with assumptions and ranges visible.
3.  **Options:** Let the investor choose to keep the SIP, reduce it, or
    pause it.

A visible skip option preserves the existing pause flow. If Saarthi
fails or times out, the standard flow continues unchanged.

## Design principles

-   **Moment over chatbot:** Intervene at the pause decision, not in a
    separate chat experience.
-   **Context over overload:** Keep the check-in to market context, goal
    impact and options.
-   **Explainable over black box:** Make inputs, assumptions and the
    reason for the intervention inspectable.
-   **Control over automation:** Keep skip visible and leave the final
    decision to the investor.

## AI and calculation architecture

The proposal separates deterministic financial calculations from
language generation.

**Flow:** Detect pause intent → retrieve SIP, holdings, goal, risk
profile, horizon and market data → compute scenarios → narrate in plain
language → verify and log.

The projection engine calculates scenarios, unit uplift and goal gaps.
The language model explains the engine's output using constrained
templates. Outputs are checked against templates and prohibited-phrase
rules, with an audit trail.

The model must not invent financial figures or recommend a fund, buying,
selling or market timing. If the system fails, the existing pause flow
remains available.

## Guardrails and compliance considerations

-   Never recommend a fund, buy, sell or market timing.
-   Never block the user's pause decision.
-   Avoid fear-based or urgency-based language.
-   Label projections as illustrative and show assumptions and ranges.
-   Explain why the user is seeing the intervention.
-   Limit the intervention to once per attempt, with a proposed 30-day
    quiet period.
-   Obtain legal review of the information-versus-advice boundary before
    a pilot.
-   Apply consent and purpose limits to goal and portfolio data.

The case study flags regulatory review as an open item; this document is
not legal advice.

## Prioritisation

The case study uses RICE scoring and MoSCoW prioritisation. The proposed
MVP prioritises transparency, pause-intent interception, option
comparison, market context and goal-impact projections. Resume
reminders, reason capture and regional languages follow; a behavioural
risk-tolerance model is lower priority.

The v1 scope excludes redemption, portfolio exit, fund recommendations
and automated action on behalf of the investor.

## Metrics and experiment design

**North Star:** Informed Decision Rate --- the share of pause or reduce
attempts finalised after the investor has seen personalised goal impact.

**Proposed pilot targets:** - At least 90% of eligible attempts see the
check-in. - At least 55% tap "Show me what changes." - Median additional
time of no more than 75 seconds. - Trust score of at least 4.2/5. -
Complaints below 0.1% of check-ins shown. - Track 90-day SIP continuity
versus a holdout, with a proposed target of +8 percentage points.

These are proposed targets, not measured results. The case study
recommends a holdout group and monitoring reversals, skip rate, trust,
complaints and time added to the flow. Pause rate itself is monitored
rather than treated as a success target.

## Go-to-market and rollout

-   **Seed, Oct--Dec 2026:** Test the prototype with 20 investors,
    conduct legal review and dogfood internally.
-   **Pilot, Q1 2027:** Show Saarthi to 5% of eligible users with a 10%
    holdout; tune triggers and assess guardrails.
-   **Scale, Q2 2027 onward:** Ramp gradually from 5% to 25% to 100%
    only if results hold.

The proposal also considers SMS or WhatsApp recaps, resume reminders,
educational content and later licensing to AMCs or distributors. These
are roadmap ideas, not shipped capabilities.

## Key product decisions

-   Intervene at the exact decision moment rather than adding another
    dashboard.
-   Use deterministic calculations for financial numbers and AI only for
    constrained explanation.
-   Measure informed decisions and user trust, not simply fewer pauses.
-   Treat pausing as a valid choice and preserve a fail-open path.
-   Start with goal-linked SIPs and expand only after validating
    usefulness and compliance.

## Limitations and assumptions

Saarthi is a product case-study proposal, not a deployed financial
product. Market statistics, funnel estimates, projection examples, pilot
targets and rollout dates are taken from the submitted presentation and
should be validated before external use. Illustrative projections are
not guaranteed returns or personalised financial advice.

## Interview talking points

-   Why intervene at the pause moment rather than build a general
    investment chatbot?
-   Why should deterministic code own the financial calculations?
-   How would you prevent the intervention from becoming paternalistic
    or manipulative?
-   Why is Informed Decision Rate a better North Star than reducing
    pause rates?
-   How would you run the holdout experiment and handle confounders?
-   What would you do if users skip the intervention or goal data is
    missing?

## Links

-   [Read the case
    study](https://drive.google.com/file/d/1_PsTzGPLELwZbvfUlifi7e6FnQ0I1y_b/view?usp=drive_link)
-   [Open the Figma
    prototype](https://www.figma.com/design/g82WFy9WqbkX6ansZkCddj/FinLit-Saarthi-%E2%80%94-SIP-Pause-Co-pilot--Prototype-?node-id=0-1&t=0dNeOd0LeeqRlG8k-1)

> **Publishing note:** Replace the portfolio URL with the final public
> case-study URL. The Figma URL is taken from the submitted PDF.
