# Swiggy Meal Match: Case Study Notes

Reference sheet for interview prep, resume bullets, job application answers and portfolio copy. Written to be read by a person or fed to an LLM.

## 0. Links
- Case study: https://drive.google.com/file/d/1ZMfnx8KI_AGZZaR_CB4jJ7pJFBE8ZAgs/view
- Interactive prototype (before vs after): https://pavithra2870.github.io/Swiggy-Meal-Match/

## 1. Snapshot
- **Project:** Swiggy Meal Match, a multi-dish restaurant discovery feature for Swiggy food search (India).
- **Type:** Independent end-to-end product case study: problem discovery, competitor teardown, users and JTBD, strategy, UX design, prioritisation, technical architecture, experiment design, GTM, risks.
- **Author:** Pavithra K R. October 2026.
- **Status:** Concept. Not an official Swiggy feature or design. Demo data is synthetic. No results are claimed; the plan is to prove impact with an A/B test.
- **Artifacts:** a 10-slide deck, 10 high-fidelity mobile screens plus a UI kit, and an interactive before-vs-after prototype.
- **One-liner:** Find one restaurant that has your whole meal.
- **Elevator pitch:** People think in meals, but food search works dish by dish. Meal Match lets users list the dishes they want, mark them required or optional, and see restaurants ranked by complete, orderable-now matches, so they order once instead of checking menu after menu.

## 2. Problem
- Users want combinations ("sambar vada and dahi papdi chaat, from one place"). Search answers "who has dish 1", not "who has both".
- Today's journey: decide the meal, search dish 1, open a menu, go back and repeat, compare, then settle (one dish, two orders, or give up). The user holds the comparison in their head.
- Costs: taps, scrolling and back-navigation per check, no combination signal, availability unknown (a dish on the menu may be unavailable right now), memory load.
- **Problem statement:** Users with a multi-dish meal in mind have no direct way to find a restaurant that can deliver all of those dishes now. They verify combinations by hand, which costs time and may lead to compromise or abandonment.
- Why one restaurant matters to the user: one delivery fee, dishes arrive together and hot, one ETA to track, one cart to check, fewer places for an item to go missing.

## 3. Context and insight
Three ways people decide what to order:
| Mode | Example | Served today by |
|---|---|---|
| Restaurant-first | "I feel like Udupi food tonight." | Restaurant listings, filters, cuisine search |
| Dish-first | "I want sambar vada." | Dishes tab: items with price, rating, ADD |
| **Meal-first** | "I want sambar vada and dahi papdi chaat, from one place, together." | **No dedicated flow (the gap)** |

**Insight:** the meal is the unit of intent, but the product only models restaurants and single dishes.

## 4. Research and evidence
Evidence base is my own hands-on testing of Swiggy and Zomato, plus informal conversations. Treat as observed behaviour in my sessions, not platform-wide claims.

**Swiggy current experience (screenshots captured):**
- Works: item cards show price, rating and ADD; restaurant sections show rating, ETA, offers; veg toggle, sort and filter chips; add a dish without opening the full menu.
- Missing for a meal: the query is one text string so dishes cannot be listed separately; no card says whether a restaurant has every dish; no way to mark must-have dishes. Example: for "Burger And Sandwich" the visible results were mostly sandwich items, and checking for burgers meant opening menus.

**Zomato tests:**
- Test A, "nachos and burritos": surfaced restaurants that appeared to offer both, but ordering ignored proximity. Some results were about 20 km away while a restaurant about 1 km away that usually sells both appeared only on a later search.
- Test B, "sambar vada and dahi papdi chaat": some cards had only one requested dish, so menus had to be opened to check. Cards did not say whether all items were orderable at that moment.

## 5. Competitor analysis
| What I checked | Swiggy | Zomato | Meal Match takes |
|---|---|---|---|
| Restaurants that offer every dish in a multi-dish query | No visible combination signal; results grouped by restaurant with matching items | Surfaced restaurants that appeared to offer both dishes | Make combination matching explicit, with a count |
| Can I tell which requested dishes a card has? | Item cards show each matching dish with price, rating, ADD | Some cards had only one requested dish | Show available and missing dishes on every card |
| Act on a dish from results | ADD directly from search results | Restaurant card first; items added only after opening it | Keep Swiggy's item-level ADD inside match results |

Also from testing: rank by distance and ETA inside each tier (Zomato's ranking looked off for proximity), and use orderable-now status with a recheck at cart.

**Opportunity:** combine Zomato's combination matching with Swiggy's transparent, actionable item cards, then add ranking by distance and ETA plus live availability.

## 6. Users and jobs to be done
Proto-personas drawn from my own sessions and conversations.
1. **The specific craver:** knows the exact two or three dishes, wants them hot and together. Pain: hunts across menus. Needs: proof every dish is orderable now.
2. **The household orderer:** orders for family members who want different things. Pain: someone's dish gets dropped to keep one order. Needs: required vs optional dishes, one delivery fee.
3. **The lunch-break planner:** short break, fixed idea of lunch. Pain: ETA and availability uncertainty eat into the break. Needs: fastest complete match at a glance.

**JTBD:** When I know the dishes I want for a meal, I want to find a nearby restaurant that can deliver all of them now, so I can order once without checking menu after menu.
- Functional: find a place with every required dish, fast.
- Emotional: feel sure the order will arrive complete.
- Social: get everyone's dish in one order.

## 7. Opportunity sizing (framework, no numbers assumed)
Bottom-up model: incremental complete-meal orders per week = A x B x C x D.
- A: food search sessions per week (search logs)
- B: share naming 2+ distinct dishes (query parsing on logs)
- C: share of those with at least one complete match nearby (catalogue and availability join)
- D: lift in complete-meal orders vs today (A/B test)
- Multiply by average order value and contribution margin for business value.
- Worth testing because these are high-intent sessions (the user already knows what to buy) and the feature reuses services a delivery app already needs.
- Not worth it if B is tiny, or C is so low that most searches end in partial matches.

## 8. Strategy and product principles
**Vision:** order the meal you have in mind, not just a dish. **Value proposition:** tell us your meal; we show who can deliver all of it now, fastest first.
1. **Orderable now beats on the menu:** a dish counts only if it can be ordered at this moment from a restaurant that delivers to the user.
2. **Count, do not score:** show "2/2 required available", never an opaque relevance score.
3. **Live inside search:** an entry point and an intent suggestion, not a new tab or a crowded search bar.
4. **One restaurant, one cart:** cross-restaurant carts change logistics, not discovery, so out of scope.
5. **Precision over recall:** better to miss a fuzzy match than call two different dishes the same.
6. **Fail back to normal search:** if matching is slow or unsure, degrade to familiar results, clearly labelled.

Value by stakeholder (hypotheses to be tested): users get less searching and confidence every must-have dish is orderable; restaurants get orders for whole meals and menu breadth gets found; Swiggy gets conversion of high-intent sessions and possibly fewer missing-item issues.

## 9. The solution and UX
**Core mechanics:** a meal list of 2 to 5 dishes, each marked Required or Optional. Results are tiered: complete matches (every required dish orderable now) always above partial matches; sort never mixes tiers. A badge counts required dishes ("2/2 required available"); optional matches get a separate grey badge. Partial cards name each missing dish and why (not on menu, sold out) and offer a recovery link. Stock and price are rechecked when an item is added and again at checkout.

**User flow (six steps, inside search):**
1. Entry point: a "Build your meal" card on the search landing.
2. Or intent detected: typing two dishes offers Meal Match above normal suggestions.
3. Build the meal: add dishes, set required or optional, running count, suggestions.
4. See matches: complete first, then partial.
5. Pick items: only your dishes, variants, prices, ADD, required-progress bar, full menu one tap away.
6. Cart check: stock and price rechecked; if a dish sold out, offer a swap to a restaurant with a full match.

**Screens designed (10 plus UI kit, 360 x 800 Android):** search entry point; multi-dish intent; meal builder list; builder autocomplete (duplicate blocked, aliases vs distinct dishes); complete matches; partial matches; edit-meal sheet (toggle a dish to optional, live result count before applying); no complete match (explanation and one-tap fixes); matching items at a restaurant; cart availability revalidation.

**Design decisions to talk about:**
- Built on Swiggy's existing visual language (orange accents, white surfaces, rounded cards, ADD actions) so it is realistic to ship, while not implying it is official.
- Honest states over optimistic ones: no-match, sold-out-at-cart and "not confirmed" are first-class designs.
- Live result count in the refine sheet so users see the effect of making a dish optional before applying.
- Counts instead of scores for transparency; tiers instead of mixed ranking for trust.

**Prototype:** standalone HTML, CSS and JavaScript, runs locally with no API keys. Before view replays today's journey (about 9 taps across 4 menus); After view lets you use the Meal Match flow; Compare shows both side by side.

## 10. Scope and prioritisation
**MoSCoW**
- Must: meal list (2 to 5 dishes), required/optional, complete and partial tiers with counts, orderable-now item status, cart revalidation.
- Should: intent detection in search, sort by ETA, distance, total, no-match recovery.
- Could: saved meals, "often added with" suggestions, variant preselection.
- Won't (now): cross-restaurant carts, AI meal suggestions, group ordering.

**RICE (relative scales; reach 1 to 10, impact 0.25 to 3, effort in assumed person-months; all inputs are my assumptions)**
| Feature | Reach | Impact | Confidence | Effort | RICE |
|---|---|---|---|---|---|
| Complete / partial tiers + counts | 10 | 2 | 60% | 3 | 4.0 |
| Meal list with required / optional | 8 | 2 | 50% | 3 | 2.7 |
| Orderable-now status on cards | 10 | 2 | 50% | 4 | 2.5 |
| Intent detection in search | 10 | 1 | 50% | 2 | 2.5 |
| Cart revalidation + swap | 6 | 1 | 70% | 2 | 2.1 |
| Semantic dish matching | 4 | 1 | 30% | 4 | 0.3 |
| Cross-restaurant cart | 3 | 1 | 20% | 8 | 0.1 |

Judgement call worth mentioning: the meal list scores below the tiers on its own, but every Must depends on it, so it ships in the MVP. Semantic matching waits until rule-based matching shows where it falls short.

## 11. Technical approach
**Architecture:** Swiggy app search UI (meal-list state, entry point, intent suggestion) calls a Meal Match API orchestrator (validates the list, fans out calls, applies a time budget), which returns cards and item results (tier, counts, available and missing dishes, prices).
- Services it relies on: dish normalisation (canonical dish IDs, curated aliases), search index (dish ID to restaurant menu items), item availability (orderable-now per item), serviceability and ETA, pricing and offers.
- Match aggregation and ranking: group items by restaurant, then tier (complete/partial), then ETA, distance, price, optional matches.
- Cart and checkout validation re-reads stock and price on add and at checkout.
- Supporting: cache (catalogue long TTL, availability seconds), analytics and experiment flags, graceful degradation (slow service shows "not confirmed", never "complete").
- **Four separate truths, never blurred:** on the menu, orderable now, delivers to you, valid at checkout.

**Matching rules:** exact canonical dish ID first; curated aliases map to one dish (papdi = papri, Medu Vada = Uddina Vade); distinct dishes never merge (Rasam Vada is not Sambar Vada, Dahi Vada is not Dahi Puri); low-confidence mappings shown as "may match" and never counted; semantic retrieval only for autocomplete, and only if it beats rules.

**Data flow:** meal list and location, resolve dish IDs, candidate items in the delivery area, orderable-now check (batched), ETA and distance, group, tier and sort, cards and item results, recheck stock and price on add.

**Latency and failure:** design target p95 under 500 ms (a target, not a measurement); cap candidates by distance before availability calls; availability slow shows "not confirmed"; matching down falls back to normal search.

## 12. Metrics and experiment
- **North Star:** complete-meal orders per eligible session. Numerator: orders containing every required dish from that session, placed in the session. Denominator: sessions with a multi-dish query or meal list (2+ dishes), counted the same way in both arms.
- **Hypothesis:** showing complete, orderable matches raises complete-meal orders for multi-dish searches.
- **Design:** A/B test, user-level 50/50 among users who issue a multi-dish query. Control: current search. Treatment: intent suggestion plus Meal Match. Sample size and minimum detectable effect to be set from baseline rates before launch.
- **Supporting metrics:** complete-match search rate, search to restaurant selection, time to a viable restaurant, search abandonment, cart conversion and order completion, repeat use, CSAT.
- **Guardrails:** item unavailable after selection, missing-item cancellations and refunds, average order value, contribution margin, overall search conversion, results latency.
- **Reading the result:** North Star up and guardrails hold means expand by city. Used but North Star flat means discovery works and price, stock or ETA is the blocker. Overall search conversion down means the entry point distracts, so rethink placement.

## 13. Go-to-market
- **Positioning:** "Your cravings. One place." **Goal:** drive awareness, first-time usage and repeat orders.
- **Target audience:** users who want multiple dishes from one restaurant, or struggle to find all desired items in one place.
- **Phases (advance on results, not dates):**
  1. Test: limited-area pilot. In-app popup introduces Meal Match; A/B popup vs a persistent search entry point to learn which entry drives first use.
  2. Launch: in-app banners, targeted push notifications, Instagram Reels and food creators, official social channels such as Swiggy Diaries. Behavioural insights decide who sees it; tie to relevant food occasions.
  3. Scale: repeat usage and expansion to new areas based on pilot results.
- **Success metrics:** feature adoption, search-to-order conversion, completed orders with all requested dishes, repeat usage, cancellation rate.
- **Strategy in one line:** start with in-app discovery, validate through experiments, then scale external marketing based on results.

## 14. Risks, trade-offs and assumptions
| Risk | Why it matters | Mitigation |
|---|---|---|
| Wrong dish mapping | A false "complete match" breaks trust fast | Canonical IDs, curated aliases, precision audits; uncertain items never counted |
| Stale availability | Sold-out dish shown as available | Short-TTL cache, recheck on add and checkout, swap offer |
| Latency from fan-out | Slow results undo the time saved | Candidate caps, batching, time budget, fallback |
| Low discoverability | Feature exists but few find it | Intent suggestion inside search; test placement |
| Hurts normal search or AOV | Wins one metric, loses the business | Guardrails in the A/B; stop rules set before launch |

- **Trade-offs accepted:** precision over recall; one restaurant only for now; counts instead of a smart score; rules before machine learning.
- **Key assumptions:** item-level availability exists and is fresh enough; menu items can be mapped to dish IDs at scale; multi-dish queries are frequent enough to matter; a delivery-area restaurant index already exists.
- **Dependencies:** catalogue and menu data, availability service, ETA service, search platform, experimentation platform.
- **Honest framing:** the architecture is a proposal built on analogous platform services; I do not claim knowledge of Swiggy internals. RICE inputs and latency figures are my own assumptions and targets.

## 15. Skills demonstrated
Product discovery, problem framing, competitive analysis, persona and JTBD definition, opportunity sizing, product strategy and principles, UX and interaction design, high-fidelity mobile UI design, design systems and tokens, prototyping (HTML, CSS, JavaScript), prioritisation (MoSCoW, RICE), technical product management (system architecture, matching logic, latency and degradation), experimentation and metrics design (North Star, guardrails, A/B), go-to-market planning, risk management, product storytelling.

## 16. Resume bullets (pick and adapt)
- Conceived and designed "Meal Match", a multi-dish discovery feature for Swiggy search that ranks restaurants by complete, orderable-now matches, addressing the gap between how users think (meals) and how search works (dish by dish).
- Benchmarked Swiggy and Zomato multi-dish search through hands-on testing and identified three opportunities: explicit combination matching, per-card dish availability, and ETA- and distance-aware ranking.
- Defined personas and a JTBD, then prioritised an MVP with MoSCoW and RICE; kept scope to one-restaurant carts and rule-based matching.
- Designed 10 high-fidelity mobile screens and a UI kit, including honest edge states (partial match, no match, sold out at cart).
- Built an interactive before-vs-after HTML prototype showing the journey shrinking from about 9 taps across 4 menus to a single search.
- Specified architecture, matching rules and failure fallbacks (orderable-now status, "not confirmed" labelling, fallback to normal search) with a p95 latency target.
- Designed an A/B experiment with a North Star (complete-meal orders per eligible session), supporting metrics, guardrails and decision rules, plus a phased GTM plan.

## 17. Short answers for applications
- **Tell us about a project you are proud of (about 60 words):** I designed Meal Match, a Swiggy search feature for people who want several dishes from one restaurant. I tested Swiggy and Zomato myself, found that neither reliably shows complete combinations, and designed a flow with required and optional dishes, tiered results and live availability. I delivered a deck, ten mobile screens, an interactive prototype and an A/B test plan.
- **How do you prioritise?** I list features, score them with RICE, then apply judgement on dependencies. In Meal Match the meal list scored lower than the result tiers, but every must-have depended on it, so it stayed in the MVP.
- **How do you measure success?** One North Star, complete-meal orders per eligible session, with supporting metrics for discovery and guardrails for AOV, cancellations, overall search conversion and latency, with decision rules agreed before launch.
- **How do you handle trade-offs?** I write them down. For Meal Match: precision over recall, one restaurant only, counts instead of scores, rules before machine learning.

## 18. Likely interview questions
- *Why this problem?* It is high-intent and everyday: users already know what to buy and the product still makes them verify by hand.
- *Why not just improve ranking?* The query is a single string; without a structured list of dishes there is nothing to match against or mark required.
- *Why counts, not a relevance score?* Users need to trust a "complete" label. "2/2 required available" is explainable, a score is not.
- *How would you avoid false matches?* Canonical dish IDs, curated aliases, distinct dishes never merge, low-confidence mappings never counted, precision audits.
- *What if availability is stale?* Short-TTL cache, recheck on add and at checkout, offer a swap to a full-match restaurant.
- *What would you cut?* Semantic matching, cross-restaurant carts, AI suggestions, group ordering.
- *How would you launch?* Limited-area pilot with an A/B test, in-app first, external marketing only after in-app discovery shows impact.
- *What would make you stop?* Multi-dish intent is rare in logs, complete matches are too rare to help, or guardrails (search conversion, AOV, cancellations) degrade.
- *What did you learn?* Trust is the product: honest partial and no-match states matter as much as the happy path.

## 19. Portfolio copy
**Headline:** Meal Match: order the meal you have in mind, not just a dish.
**Summary:** A concept for Swiggy search that lets users list the dishes they want, mark them required or optional, and see restaurants ranked by complete, orderable-now matches. Includes competitive teardown, personas, MVP scope, ten mobile screens, an interactive prototype, architecture and an A/B plan.
**Sections to use:** The gap (restaurant-first, dish-first, meal-first) / What I found testing Swiggy and Zomato / Who it is for / Principles / The flow / Key screens / What I would ship first / How I would prove it / Risks and trade-offs.
**Tags:** product management, product strategy, UX design, mobile design, food delivery, search and discovery, experimentation, GTM, technical PM.
