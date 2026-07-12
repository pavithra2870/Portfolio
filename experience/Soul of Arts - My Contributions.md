# Soul of Arts — My Contributions

---

# Project Overview

Soul of Arts is a fine art studio located in J.P. Nagar, Bengaluru, offering painting classes, drawing workshops, and creative art programs for children, teenagers, and adults. Classes run Monday, Wednesday, and Friday from 4–6 PM. The studio teaches a range of disciplines including watercolour painting, acrylic painting, and zentangle art.

The business launched from scratch with no prior digital presence, no website, and no students. My work covered the end-to-end process of establishing the studio as a credible, discoverable, and conversion-ready brand online.

---

# My Role

- Full Stack Web Developer
- Frontend Engineer
- UI/UX Designer
- SEO & Growth Engineer
- Deployment & DevOps Engineer
- Google Business Profile Manager
- Product & Launch Consultant

---

# What I Built

## Website Development

Designed and built the entire Soul of Arts website from the ground up as a single-page application in HTML, CSS, and vanilla JavaScript. The site includes:

- Fixed glassmorphism navigation bar with smooth scroll and a mobile hamburger menu
- Full-screen hero section with a staggered editorial image grid, animated entry sequences, and a floating badge
- Animated ticker/marquee strip
- About section with layered image composition and highlight cards
- Masonry-layout art gallery with hover overlays and a click-to-open lightbox viewer
- Classes/offerings grid with hover interaction and per-card age group labeling
- Inspirational quote strip
- Testimonials section with hover lift cards
- Contact and enrollment section with full form, contact details, and social links
- Floating WhatsApp contact button with pulse animation and tooltip
- Floating Maps and Timings quick-access buttons for mobile users
- Footer with brand description, navigation columns, and social links
- Scroll-triggered fade-in animations on all major content sections

## Design

Conceived and executed the complete visual identity for the website:

- Art-forward dark editorial aesthetic using an ink/charcoal/parchment/terracotta color palette
- Curated typography pairing: Playfair Display (serif, editorial headings), Cormorant Garamond (elegant body text), and Inter (clean UI labels)
- Custom CSS design system with CSS custom properties for consistent theming
- Visual hierarchy designed to guide visitors from awareness → exploration → enrollment
- Responsive layouts across desktop, tablet, and mobile breakpoints

## Deployment

- Deployed the website to GitHub Pages
- Configured a custom domain (soulofarts.in) purchased through GoDaddy
- Set up DNS records on GoDaddy to point to GitHub Pages
- Managed production deployment and launch preparation

## SEO

- Wrote a keyword-optimized page title targeting "Fine Art Studio & Painting Classes in JP Nagar, Bengaluru"
- Wrote a descriptive meta description targeting local search intent
- Added meta keywords covering relevant search terms (art classes Bengaluru, painting classes JP Nagar, kids art classes, watercolour, acrylic, zentangle)
- Set `robots` meta to `index, follow`
- Implemented a canonical URL tag
- Implemented Open Graph tags (og:title, og:description, og:image, og:url, og:type) for social sharing
- Implemented Twitter Card tags
- Implemented Schema.org structured data (LocalBusiness type) including name, description, address, telephone, email, opening hours, and social profile link — making the business eligible for rich results in Google Search

## Google Business Profile

- Created and configured the Google Business Profile for Soul of Arts
- Added business name, category, location, contact information, and operating hours
- Optimized the profile to improve discoverability on Google Search and Google Maps
- Connected the profile to the website, enabling users searching for "Soul of Arts" or art classes in JP Nagar to find the business directly

## Enrollment Form

- Integrated FormSubmit.co as a zero-backend form submission service
- Built a custom AJAX submission handler to avoid page reloads
- Added submission state feedback: button changes to "Sending…" during submission, turns green with a checkmark on success, and resets after 4 seconds
- Added client-side validation before submission
- Form fields: name, phone/WhatsApp, class of interest (dropdown), age group (dropdown), message
- Configured a hidden email subject line for inbox organization

## WhatsApp Integration

- Added a persistent floating WhatsApp button with a pre-filled message ("Hi, I'm interested in joining Soul of Arts classes!")
- Added WhatsApp deep-link buttons in the contact section and footer
- Implemented a pulsing ring animation and tooltip to increase button visibility and click-through rate

---

# Engineering Contributions

- Built the entire website in a single well-structured HTML file with embedded CSS and JavaScript — no frameworks, no build tools, no dependencies
- Implemented a custom CSS design system using CSS custom properties
- Used CSS Grid and Flexbox for all layout work
- Built all animations in pure CSS (keyframes for hero entry, ticker, badge float, WhatsApp pulse) and JavaScript (Intersection Observer API for scroll-triggered fade-ins)
- Built a JavaScript-powered image lightbox for the gallery
- Built a JavaScript mobile navigation toggle with animated hamburger-to-close transition
- Integrated a third-party form submission service (FormSubmit.co) via fetch API, with full UX state management
- Implemented Schema.org JSON-LD structured data for local business discovery
- Configured `preconnect` resource hints for Google Fonts to improve load performance
- Applied responsive design via CSS media queries across at least three breakpoints
- Implemented accessibility attributes (ARIA labels, roles, semantic HTML elements) throughout the page

---

# Design Contributions

- Designed the entire visual identity of the Soul of Arts website
- Chose a dark editorial aesthetic — ink/charcoal backgrounds, parchment text, terracotta accents — to position the studio as premium and art-forward rather than generic
- Applied fine art typography conventions: large italic serif headings, lightweight editorial body fonts, clean sans-serif UI labels
- Designed the hero as a two-column editorial layout with a staggered image grid that communicates creativity and craft without any custom illustration work
- Created a floating glassmorphism badge to anchor the hero's credential signal
- Designed the gallery as a masonry grid with hover reveal overlays, creating a tactile, portfolio-like browsing experience
- Designed the class cards with a top-border reveal animation on hover to reward exploration
- Ensured visual hierarchy across all sections: label → title → body → CTA
- Maintained brand consistency across nav, sections, forms, buttons, and footer using the shared design token system

---

# Product Contributions

Soul of Arts existed only as an offline idea before this project. My product contribution was transforming that idea into a functioning digital business:

- Defined the information architecture: which sections to include, what order they appear in, and how they guide a visitor from awareness to inquiry
- Framed the brand positioning through copywriting decisions reflected in the site's section labels, headings, and microcopy
- Built a low-friction enrollment path: visitors can enroll via the on-page form, WhatsApp, phone, or Instagram — meeting users wherever they are
- Designed the contact section for conversion rather than pure information delivery
- Launched the business's first professional digital presence, establishing credibility for a brand-new studio competing with established studios in Bengaluru

---

# Growth & Business Contributions

## SEO

Implemented on-page SEO across all available vectors: title tag, meta description, canonical tag, robots directive, Open Graph, Twitter Card, and Schema.org JSON-LD structured data. These collectively ensure that:

- The website is indexable and signals relevance to Google
- Searches for "Soul of Arts" surface the website directly
- Searches for "art classes JP Nagar" or "painting classes Bengaluru" have a chance to surface the business
- Social shares render rich previews with title, description, and image

## Google Business Profile

Created and optimized the Google Business Profile, which is often the first touchpoint for local discovery in India. Users searching on Google Maps or Google Search for art classes near JP Nagar can now find Soul of Arts with accurate location, hours, and contact information.

## Launch

Coordinated the complete launch: production deployment, domain configuration, DNS setup, SEO readiness, and Google Business Profile activation — ensuring the business went live as a coherent, discoverable digital presence on day one.

---

# Technologies Used

## Frontend
- HTML5
- CSS3 (custom properties, Grid, Flexbox, keyframe animations, media queries)
- Vanilla JavaScript (ES6+, Intersection Observer API, Fetch API)

## Fonts & Typography
- Google Fonts (Playfair Display, Cormorant Garamond, Inter)

## Integrations
- FormSubmit.co (form-to-email service)
- WhatsApp Business deep links
- Schema.org JSON-LD (structured data)
- Open Graph / Twitter Card meta tags

## Deployment & Infrastructure
- GitHub Pages (static hosting)
- GoDaddy (domain registrar and DNS management)
- Custom domain: soulofarts.in

## SEO & Growth
- On-page SEO (title, meta, canonical, robots)
- Schema.org LocalBusiness structured data
- Google Business Profile

---

# Skills Demonstrated

- Full Stack Development
- Frontend Development
- Responsive Web Design
- UI/UX Design
- Brand Identity
- Visual Hierarchy & Typography
- CSS Animation & Interaction Design
- JavaScript (DOM, Fetch API, Intersection Observer)
- Form Integration & UX State Management
- On-Page SEO
- Structured Data (Schema.org / JSON-LD)
- Open Graph & Social Meta Tags
- Google Business Profile Optimization
- Local SEO
- Deployment (GitHub Pages)
- DNS Configuration (GoDaddy)
- Custom Domain Setup
- Product Thinking
- Information Architecture
- Conversion-Focused Design
- Technical Consulting
- Growth Engineering
- Customer Acquisition Support
- Digital Launch Strategy
- End-to-End Product Ownership

---

# Business Outcomes

- Launched a brand-new fine art studio with a fully professional digital presence
- Website deployed to production at soulofarts.in with a custom domain
- Google Business Profile created, configured, and optimized — enabling discovery on Google Search and Google Maps
- Business became discoverable via search for "Soul of Arts" and related local art class queries
- Approximately 10 students enrolled within the first five days after launch

The early student acquisition was supported by the combined effort of building a credible website, configuring SEO, launching the Google Business Profile, and making it easy for interested students to reach out via multiple channels (form, WhatsApp, phone). No single factor caused the growth; the digital presence as a whole lowered the barrier to discovery and enrollment.

---

# Resume Bullets

- Designed, built, and deployed the complete website for Soul of Arts (soulofarts.in), a Bengaluru fine art studio, from zero to production as the sole engineer and designer
- Implemented full on-page SEO including structured data (Schema.org LocalBusiness), Open Graph, Twitter Card, canonical tags, and keyword-targeted meta — enabling the business to be discovered on Google Search from launch day
- Created and optimized the Google Business Profile, establishing the studio's presence on Google Maps and local search results for art classes in J.P. Nagar, Bengaluru
- Integrated a FormSubmit.co-backed enrollment form with custom JavaScript AJAX handling, client-side validation, and real-time UX state feedback — creating a zero-backend lead capture system
- Deployed the production site on GitHub Pages with a custom GoDaddy domain (soulofarts.in), including full DNS configuration
- Designed the complete visual identity and UI/UX for a premium art studio brand, applying editorial typography, a custom CSS design system, scroll-triggered animations, and a conversion-focused information architecture
- Supported a new business in acquiring approximately 10 students within its first five days by establishing a credible, discoverable, and conversion-ready digital presence across web and Google Maps
- Owned the entire product launch lifecycle — strategy, design, engineering, deployment, SEO, and Google Business — as a solo contributor

---

# Portfolio Summary

Soul of Arts is the kind of project that demonstrates what it means to truly own a product.

I joined a fine art studio that had no website, no online presence, and no students — and delivered a production-ready, fully optimized digital product from scratch. I designed the brand aesthetic, built the frontend, integrated a lead capture form, configured DNS and deployment, implemented on-page SEO, and launched the Google Business Profile. Every layer of the digital presence was my work.

The result was a studio that launched with a professional website at its own custom domain, appeared on Google Search and Google Maps from day one, and saw approximately 10 students register in its first five days.

This project demonstrates that I can move across engineering, design, product, and growth — and deliver a complete, working, real-world product without a team around me.
