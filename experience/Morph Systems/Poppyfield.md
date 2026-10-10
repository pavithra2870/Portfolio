# Contributions — Pavithra K R

**Project:** Poppyfield — an AI agent marketplace and chat workspace
**Active period:** 28 July 2026 → 26 August 2026

---

## At a glance

| | |
|---|---|
| Features and fixes delivered | **11** (10 shipped to the main branch, 1 delivered and pending review) |
| Commits | **20** |
| Source lines added / removed | **~1,801 / ~216** (excludes generated build output) |
| Quality reports written | **26** |
| Components built and owned outright | **1** (902 lines) |
| Areas worked in | 9 frontend components, 2 pages, the Go server, 2 shared library modules |

Two roles carried at the same time:

1. **Frontend engineer** — shipped work across the landing page, agent catalog, chat workspace, and admin console.
2. **Product quality owner** — ran hands-on user testing and wrote the deepest agent-quality and deliverable-format critiques on the project. Several became other engineers' work.

**Tech stack worked in:** TypeScript, Lit (web components), Tailwind CSS, Go (chi router), PostgreSQL-backed APIs, Playwright for browser verification.

---

## Part 1 — What I owned

### Built from scratch and owned: the landing page workflow comparison

A 902-line Lit component, **7 of its 8 commits mine**, built from nothing and maintained through four rounds of change.

It is the animated side-by-side on the landing page showing the traditional multi-tool workflow against the Poppyfield one. Not a small widget — it is a scripted, cancellable animation timeline with:

- a separate mobile variant
- a pace control (snappy / cinematic / slow) applied across the whole timeline
- image preloading
- an `IntersectionObserver` so it starts when scrolled into view
- a replay path, and safe restart on remount

This is the largest piece of solely-owned code in my contribution.

### Areas I worked in

| Area | What I did |
|---|---|
| Agent detail page | Filmstrip carousel with full-view overlay; fixed lightbox image cropping |
| Agent catalog | Page size; made categories and agent cards real links |
| Chat panel | Output-file surfacing; per-reply feedback thumbs |
| Files panel | Post-turn listing refresh |
| Workspace shell | Deep links, browser history, file-panel auto-reveal |
| Chat sidebar | Chat rows as real links |
| Admin console | Agent details export |
| Shared UI library | New reusable link-click guard; exposed filtered rows on the shared table component |
| Go server | Landing page served at the root URL |
| Landing page | Comparison section mounted under the hero |

Worth noting the range: this was not only leaf-component work. It included a **backend Go change**, a **new shared library module**, and **an addition to a base UI component used across the whole application**.

---

## Part 2 — Work delivered, in order

### Glass filmstrip carousel with full-view overlay — *28 July*
Agent detail pages got a filmstrip-style image carousel with a full-view overlay. My first contribution to the codebase.

### Lightbox shows the whole image — *30 July*
The lightbox was cropping images to fit its frame, so users could not see what they had generated. Changed to fit the image inside the viewport instead of clipping it. I found this while testing, reported it, then fixed it.

### Landing page served at the root URL — *31 July*
**Backend change** in the Go server. The root URL previously redirected to `/home_page.html`; it now serves the landing page directly. This matters for SEO and for how the site appears when shared.

### Animated workflow comparison section — *7 August*
My largest feature. A new 900-line component under the hero, plus 9 WebP image assets.

It answers a gap I had reported myself: the landing page could not explain *how this is different from ChatGPT or Gemini*. Rather than argue it in copy, I built the answer as a side-by-side animation a visitor can watch.

Same effort also included:
- Correcting which side of the conversation uploaded-file pills appear on.
- Acting on reviewer feedback before merge.
- Resolving a generated-stylesheet conflict the correct way for this codebase — regenerating it on the merged base rather than hand-editing.

### Catalog page size raised 12 → 18 — *7 August*
Small and deliberate: more agents visible per page so users scroll less to find one. Tied to a discovery and choice-overload report I had filed.

### Comparison animation: breakpoint restart + pacing — *18 August*
Three things in one change, all in my owned component:

1. **Bug fix.** Desktop and mobile ran different animation flows, and only the mobile one advanced its phase counter. Resizing across the breakpoint flipped the layout but left the old flow running, so the animation froze waiting on a phase that would never arrive. It now restarts into the flow matching the new width, debounced 220 ms so dragging across the boundary does not restart on every pass.
2. **Remount robustness.** Moved the `IntersectionObserver` from `firstUpdated` to `connectedCallback` — `firstUpdated` fires only once per element lifetime, so a reconnected section would otherwise sit dormant with no observer to start it. Also replaced a hand-rolled partial reset with a full replay, since the old path left stale state behind.
3. **Pacing.** Questions sped up (2550 ms → 1680 ms each); generation slowed down (2.3 s → 3.5 s) so the step claiming to produce six images feels like real work rather than a flash.

I also flagged, in the review, that the reported symptom was inverted relative to the main branch after an earlier rename — same root cause, and my fix covered both directions.

### Agent output files surfaced instead of buried — *17 August*
A user-facing failure with a subtle single cause. When an agent finished a turn and wrote several files, the workspace looked like nothing had happened: the Files panel still read *"No files yet"* and every file chip was collapsed behind a "N more files" toggle.

**Root cause.** One branch promoted files inline only when there were 3 or fewer of them outside the expected output folder. An agent that wrote 7 such files surfaced **nothing** — which emptied the chip row *and* skipped the auto-open that reveals the panel and re-lists the directory. The more the agent produced, the less the user saw.

**Fix, entirely frontend:**
- Made the promotion unconditional. The existing inline cap already prevents flooding the chat and, unlike the old gate, can never produce an empty result.
- Added a session-scoped listing refresh to the Files panel, called when a turn ends. Nothing else re-listed after a turn — the existing poll only ran with the Progress accordion open and a task list present.
- Relaxed the auto-reveal check so a session whose files live in a subfolder still reveals the panel on reload.

Verified old logic against new on identical data: 0 chips → 4, stale empty listing → all 7 files, and the finished document auto-opening in the preview.

### Feedback thumbs fill only on the rated reply — *25 August*
From a bug I filed myself. Giving one reply a thumbs-up turned **every** later reply green.

**Root cause.** The rating was a single panel-level value, and the thumbs render on whichever message is last. Nothing recorded *which* reply had been rated.

**Fix.** Added a "which message was voted on" index and threaded it through submit and render, so only the rated reply fills. The thumbs also now stay visible on the rated reply after newer turns arrive, instead of disappearing.

I deliberately kept this to **one vote bound to one message**, mirroring what the backend actually stores — one rating per session, with no message identifier. A per-reply map would have shown several greens while the database held one, so the interface would have been lying about the data. I documented the resulting reload gap rather than faking it: the fill cannot be restored after a refresh until the rating carries a message id server-side.

### Categories and agent cards made real links — *25 August*
Categories and agent cards were plain elements navigating via JavaScript. That gives the browser nothing to work with, so right-click → "open in new tab", ctrl/cmd-click, middle-click and copy-link all did nothing.

**No backend change was needed** — I established that first, by confirming every URL already existed and already worked on a cold load.

- Built the category link from the live query string so the other active filters carry over, rather than duplicating the URL-sync logic and letting the two drift apart.
- Extracted a single source for the agent detail address so the link and the JavaScript navigation cannot diverge.
- Used a **stretched link** on cards: an empty anchor covering the card, which avoids nesting a button inside a link (invalid HTML), with the Run button lifted above it so it keeps its own clicks.
- Plain left-click behaviour left unchanged throughout — the change only *adds* what the browser can do once a real link exists.

### Each chat session given its own URL — *25 August*
From a request I filed myself. Two parts, and the first was a real bug I found while scoping the feature.

1. **Blocker fixed.** Opening the workspace with a session in the URL showed an **empty chat**. The deep-link path set up the *files* panel but never told the chat panel to load the transcript, because the function that opens a session was only reachable from a sidebar click. This meant **reloading any chat lost your place** — a defect that existed independently of the feature I was building.
2. **URL and history.** The open chat is now written to the address bar as a new history entry, and a history-restore handler re-opens whichever session the URL names. Browser Back and Forward now move between chats.
3. **Sidebar rows made links** with the same stretched-link pattern, skipped while renaming so the rename input keeps focus, and with the row action menu lifted above the overlay.

I also created a **shared library module** here for the modified-click guard, rather than copying it into a second component.

### Agent details export for the admin console — *26 August, delivered pending review*
An **Export agent details** button on the admin Agents view, downloading agent name, description, and enabled/disabled status as a spreadsheet.

- **Follows the search box** — "export" should mean "what I am looking at". Rather than re-implementing the table's filter rule, I exposed the filtered rows on the shared table component so the two cannot drift apart.
- **Formula-injection guard.** Agent names and descriptions are creator-supplied, so a value starting `=`, `+` or `@` would execute as a formula when an admin opens the file. Those are prefixed so the spreadsheet treats them as text. A leading `-` is deliberately left alone, because spreadsheets read those as numbers and guarding it would mangle ordinary bullet text.
- Full quoting so commas, quotes and newlines survive, and a UTF-8 byte-order mark so accented text does not arrive garbled.
- Chose CSV over a true Excel file and stated the trade-off: a real `.xlsx` would mean bundling a spreadsheet library for a single button.

---

## Part 3 — Quality reports and product testing

26 reports, written from hands-on use rather than reading code. Each describes what a real user experienced, then the mechanism, then what good would look like.

### Found by me, then fixed by me
- Image full-view cropping → fixed
- Thumbs-up state persisting across all replies → fixed
- Chat sessions needing their own shareable URL → built
- Landing page not answering "how is this different from ChatGPT/Gemini?" → built the comparison section
- Agent discovery and choice overload → partially addressed by the catalog page-size change
- Copy Image button not actually copying the image → reported

This loop — **notice it as a user, write it down clearly, then go and fix it** — is the strongest pattern in my work here.

### Non-technical user testing
A body of work in itself, testing the product with people who are not engineers:

- Chat and output-rendering friction found in non-technical user testing
- Agent question cards burying the response they were asking about, because there was no token streaming
- A proposed interim workaround — simulated token streaming — to recover the lost context cheaply while the real fix waited
- Inconsistent full-screen behaviour and interface scroll issues

The question-card pair is worth calling out: I identified the problem *and* proposed a pragmatic stopgap, instead of only demanding the expensive fix.

### Per-agent quality critiques
Five detailed reports on shipped agents, each explaining why the output was not actually usable:

- **Headshot Generator** — input robustness, attire replacement, fidelity-gate exposure
- **LinkedIn About Writer** — robotic tone, and no usable destination for the output
- **LinkedIn Profile Optimizer** — raw JSON surfaced as the deliverable; users cannot use it
- **Learning Path Designer** — needs an editable, trackable destination and progress nudges
- **Resume ATS Scanner** — reports the problems but does not give the fixes

### Platform-level arguments
- **Stop shipping raw JSON and markdown as deliverables** — add real destinations such as Google Docs and LinkedIn. This generalised the five reports above into a single platform position.
- **Enforce tool-call and cost limits in the engine** — backed by a real figure: one book-generation session cost **$2.02 and delivered nothing**.
- **Add a cost-computation tool** so cost arithmetic runs in Python rather than being done by the language model.
- **Agent builder pipeline usability** — a full report from the point of view of a user trying it for the first time.

### Bugs reported
- Profile first name not updating after Google sign-in
- Workspace agent showing the previous agent's welcome message on a new chat
- Reloading the page during an agent run halting the run
- Missing re-upload and attach-from-workspace guidance
- Image generation not supported in agents created by the deployed pipeline
- Mobile search bar size and category button spacing
- Missing Open Graph and Twitter Card metadata for social sharing

---

## Part 4 — How I worked

Patterns visible across my changes — the difference between a fix that lands and one that causes a second bug:

**Root cause over symptom.** The file-surfacing and thumbs-up fixes both trace a messy user-visible failure to one wrong condition, and say so plainly. Neither patches the symptom.

**Establish the blast radius before writing code.** For the catalog links I confirmed no backend change was needed by checking that every URL already existed and worked on a cold load. For the chat-session URLs I verified that session lookups were already scoped to the owner in the database *before* making those URLs shareable — the right question to ask before turning something into a link people can send each other.

**Reuse instead of copy.** The modified-click guard went into the shared library rather than being duplicated into a second component. I exposed the shared table's filtered rows so the export could not drift from the table's own filter rule. Both follow the codebase's rule against duplication between components.

**Honest about what is not fixed.** Every change I delivered names its gaps:
- the thumbs fill cannot survive a reload until feedback carries a message id server-side
- an agent with no slug produces an ugly link; category filters do not step through browser Back
- a cleaner chat URL path would need a small backend route
- CSV instead of a true Excel file, and why

**Separate concerns into separate changes.** The deep-link bug was found while scoping the session-links feature, and I called it out as a standalone defect rather than quietly bundling it.

**Build discipline.** Compiled output and the generated stylesheet regenerated and committed with every UI change, never hand-edited. Stylesheet conflicts resolved by regenerating on the merged base, which is the documented correct resolution for this codebase.

**Verified live before shipping.** Changes checked in a running browser, not just reasoned about — including before-and-after comparisons on identical data, driven through Playwright.

**Took review feedback properly.** One feature has a dedicated commit acting on reviewer comments. Another explicitly flagged a partial revert for the reviewer's attention rather than slipping it through.

---

## Part 5 — Open threads at handover

**Delivered, pending review**
- Agent details export for the admin console.

**Follow-ups I identified and wrote down**
- Restoring the thumbs-up fill across a reload needs session feedback to carry a message id — a backend and schema change.
- Category filters use history *replace* rather than *push*, so browser Back does not step through filter changes.
- The base64 agent-link fallback may now be dead code, since agents have slugs.
- A cleaner chat URL path would need a backend route.
- The comparison component's progress bar drives a 51-iteration timer loop against a width that already has a CSS transition; it could be one state change plus one CSS transition. Raised in review and deferred as pre-existing.
- The repository's build-verification scripts fail on Windows — they invoke `npx` in a way Windows cannot spawn. Found incidentally, unrelated to any one change.

**Open product questions awaiting platform decisions** — 14 of my reports remain open, including the five per-agent quality critiques, the deliverable-destinations position, cost controls, agent discovery, and the pipeline usability report.

---

## Summary

Over one month: **11 features and fixes delivered, 20 commits, roughly 1,800 lines of source, and 26 quality reports** — spanning the landing page, agent catalog, chat workspace, admin console, a shared UI library, and the Go server.

My contribution had two halves that reinforced each other. One was engineering: root-cause fixes to real user-facing failures, a 900-line component I built and owned, and changes made carefully enough to include security guards, accessibility labels, reuse of shared code, and written-down trade-offs. The other was product quality: sustained, specific user testing that produced the most detailed agent-quality and deliverable-format critiques on the project — several of which became other engineers' work.

The recurring signature: **use the product as a real user, notice exactly where it fails, write it down clearly, then go and fix it.**
