// Source: product/*.md. Links come straight from each file's front matter;
// `figma` is omitted where the source has none (Paytm Pakka).
export const caseStudies = [
  {
    id: 'finlit-saarthi',
    name: 'FinLit Saarthi',
    kind: 'Product case study',
    date: 'Oct 2026',
    headline: 'An AI co-pilot for the moment an investor pauses a SIP.',
    problem:
      'Investors can pause or reduce a SIP with little context on how that affects the goal it funds.',
    approach:
      'An explainable check-in shown right before the pause is confirmed. Deterministic code computes the goal impact; the language model only explains the result within constrained templates. Skip stays visible, and if the check-in fails the standard flow continues.',
    decision: 'Inform, never advise; never block. The investor always decides.',
    metric: 'North Star: Informed Decision Rate, not a lower pause rate.',
    tags: ['Fintech', 'Explainable AI', 'Behavioural design', 'Experimentation'],
    status: 'Concept, with a clickable prototype',
    links: {
      caseStudy:
        'https://drive.google.com/file/d/1_PsTzGPLELwZbvfUlifi7e6FnQ0I1y_b/view?usp=drive_link',
      figma:
        'https://www.figma.com/design/g82WFy9WqbkX6ansZkCddj/FinLit-Saarthi-%E2%80%94-SIP-Pause-Co-pilot--Prototype-?node-id=0-1&t=0dNeOd0LeeqRlG8k-1',
    },
  },
  {
    id: 'paytm-pakka',
    name: 'Paytm Pakka',
    kind: 'Team case study · Team Paytm Karo',
    date: 'Sep 2026',
    headline: 'Building primary-app preference for UPI, from the counter to the app.',
    problem:
      'In the team’s 50 voice-of-customer inputs, 12 of 15 lapsed-primary users opened Paytm only when an offer triggered it, and 14 of 21 merchants mainly needed to know whether money had arrived.',
    approach:
      'Fixed cashback tiers and a scan-first app for customers, paired with payment status, deduction clarity and local support for merchants, so each side has a reason to pick Paytm first.',
    decision: 'Treat merchant trust as part of consumer growth, and test whether behaviour persists after cashback is reduced.',
    metric: 'Eight-week one-city pilot, then four weeks of reduced cashback.',
    tags: ['Product strategy', 'UPI', 'Growth', 'Customer research'],
    status: 'Concept · Paytm UPI Growth Challenge, Round 1',
    links: {
      caseStudy:
        'https://drive.google.com/file/d/1jieV9Y02boAbs6j_aPC3q9glhtFSDHqH/view?usp=drive_link',
    },
  },
  {
    id: 'neu-rewards',
    name: 'Neu Rewards',
    kind: 'Product teardown and proposal',
    date: '2026',
    headline: 'Giving Gen Z a reason to open Tata Neu every week.',
    problem:
      'Between purchases there is no visible balance, progress or weekly reason to open the app, and NeuCoins and NeuPass tiers are hard to follow.',
    approach:
      'A single rewards wallet, weekly rewards, goals and capped referrals that make value visible and carry across Tata categories.',
    decision: 'Define meaningful engagement explicitly, so passive app opens cannot inflate the primary metric.',
    metric: 'Share of Gen Z users with two or more meaningful engagement days a week.',
    tags: ['Product teardown', 'Retention', 'Loyalty', 'Gen Z'],
    status: 'Concept, with a Figma design',
    links: {
      caseStudy:
        'https://drive.google.com/file/d/1RWfna-thxwkjUmtLr5HvC8wnRX7ZlRiM/view?usp=drive_link',
      figma:
        'https://www.figma.com/design/ADujMeThUCbP1jBSdZw1X0/Neu-Rewards---Gen-Z?m=auto&t=RPsAyHumOyXxKQwY-1',
    },
  },
]
