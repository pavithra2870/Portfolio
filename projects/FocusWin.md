# FocusWin

A full-stack collaborative task management application that combines personal productivity tracking with team workspaces, built on a modern MERN + Firebase stack.

---

# Elevator Pitch

FocusWin is a productivity application built for individuals and small teams who need more than a basic to-do list. It starts where most task managers stop — with a 10-level priority scale, task difficulty tagging, recurrence scheduling, and a rich analytics dashboard that turns completed work into actionable insights.

The personal workspace lets users stay deeply organized through nested group hierarchies, smart filters like "My Day" and "Important", and a streak-based habit tracker backed by a custom algorithm. A calendar heatmap visually distinguishes on-time completions from late ones, giving users an honest picture of their own consistency.

Beyond personal use, FocusWin extends into team collaboration through a Spaces feature. Users can create shared workspaces, invite teammates by email, assign tasks, and track progress across a Kanban board — all updated in real time via Firestore listeners. The personal and team layers are cleanly separated, both in data and in UI, so context never bleeds across.

What makes FocusWin distinct is the level of intentionality in its product decisions — from duplicate-safe group creation to celebrations when all your tasks for the day are done, every interaction reflects a genuine understanding of how people actually use productivity tools.

---

# Product Overview

FocusWin serves two types of users: individuals tracking their own work and teams managing shared objectives.

For personal use, the core workflow is: create tasks with a title, notes, due date, priority (1–10), difficulty tag (Easy / Medium / Hard), group assignment, and optional recurrence. Tasks are viewed through a sidebar with Quick Filters (All, My Day, Important, Upcoming) and custom group categories. Users sort and search across tasks in real time. When all of today's tasks are complete, the app surfaces a celebration moment.

The analytics dashboard gives users a backward-looking view of their effort. It displays total, completed, pending, and overdue counts; a 7-day completion line chart; a completion rate pie chart; a priority distribution bar chart; and a calendar heatmap for the past 6 months. A streak counter tracks consecutive days of task completion. AI-style productivity insights are surfaced in plain English — most and least productive days of the week, weekday vs. weekend trends.

For teams, the Spaces feature allows users to create a named workspace, invite members by email via a Firebase Cloud Function, and collaboratively manage tasks. Tasks in a Space can be assigned to specific members, tagged with status (Todo / In Progress / Done), and viewed either as a flat list (Manage view) or a Kanban board. Changes are reflected in real time for all members via Firestore onSnapshot listeners.

Real-world use cases include solo professionals managing project backlogs, students tracking assignments by subject group, and small engineering teams running lightweight sprint boards.

---

# Problem Statement

Most task managers fall into one of two categories: too simple to be genuinely useful, or too complex to actually use. Apps like basic to-do lists offer no insight into completion patterns. Apps like Jira are built for enterprise scale and introduce friction for smaller workflows.

There is also a gap between personal productivity tools and lightweight collaboration tools. Users often manage personal tasks in one app and team tasks in another, with no shared context.

FocusWin addresses both problems. It brings analytical depth — streak counters, heatmaps, productivity trend summaries — to personal task management without complexity. And it offers a team workspace that shares the same data model and UX patterns as the personal experience, reducing context switching.

---

# Key Features

## Task Management
- 10-level importance scale gives users fine-grained control over prioritization, going beyond the typical High / Medium / Low model.
- Difficulty tagging (Easy, Medium, Hard) adds a second axis for planning — how important vs. how hard — enabling more realistic scheduling.
- Notes field supports longer context alongside task titles.
- Recurrence scheduling supports daily, weekly (by day of week), and monthly (by day of month) patterns, handled on the frontend with a recurrenceProcessed flag to avoid duplicate generation.
- Due date and time tracking with a smart countdown that shows exact remaining hours and minutes for tasks due within 24 hours.

## Organization
- Custom groups with optional notes and star-rated priority let users categorize work the way they think about it.
- Nested subgroups (parent-child hierarchy) rendered as a tree allow complex project breakdowns within a single sidebar.
- Quick Filters — My Day, Important, Upcoming — provide immediate access to the most relevant subset of tasks without manual filtering.
- Duplicate group detection with a modal prompt rather than a silent failure, preserving user intent.

## Analytics Dashboard
- Completion rate, streak, average priority, overdue count, and tasks completed today are presented as stat cards alongside a navigable calendar.
- Weekly productivity line chart and completion rate pie chart give a visual summary of recent output.
- Pending Tasks by Importance bar chart shows where unfinished work is concentrated.
- Most/least productive days bar charts and a weekday vs. weekend pie chart surface behavioral patterns.
- Calendar heatmap distinguishes on-time completions from late ones per day, with emoji indicators for high-activity days and hover tooltips for detail.

## Motivation and Habits
- Streak counter tracks consecutive days with at least one task completed. Handles edge cases like streaks starting from yesterday (not just today).
- "My Day" celebration toast fires when all tasks due today are marked complete, with automatic reset if the user unchecks a task.
- IST-aware date formatting throughout the dashboard for Indian users.

## Team Spaces
- Users can create a shared workspace with a custom name and invite teammates via email using a Firebase Cloud Function.
- Space tasks support assignee, status (todo / progress / done), group, difficulty, importance, and due date fields.
- Manage view shows a filterable, sortable task list with full CRUD. Kanban view shows tasks organized in three columns with drag-left/right arrows for status changes.
- Real-time sync via Firestore onSnapshot listeners ensures all members see updates instantly without a page refresh.

## Authentication
- Email/password signup and login backed by Firebase Authentication.
- Google Sign-In via OAuth popup for one-click access.
- Persistent session managed by Firebase's onAuthStateChanged listener, with user profile stored in Firestore.
- Route guards redirect unauthenticated users to login and redirect authenticated users away from the login page.

---

# Engineering Highlights

The frontend is a React 18 single-page application using React Router v7 for client-side navigation. State is managed locally with hooks; a global AuthContext provides user identity across all routes. The component architecture separates personal and team workflows into distinct route trees and CSS namespaces, avoiding style collisions.

Firebase Firestore is the primary database. Collections for users, tasks, groups, spaces, space_tasks, and space_groups are accessed through a service layer that abstracts all Firestore SDK calls behind clean async functions. The service layer mirrors the original Express/MongoDB API contract (e.g., getTasks, createTask, updateTask, deleteTask), which means the backend and frontend data models are aligned.

The backend (Express + MongoDB + Mongoose) remains in the codebase with a complete data model for tasks, users, and groups, session-based authentication via express-session with MongoStore, a notifications route, and a node-cron setup for scheduled jobs. The frontend has been migrated to Firebase, but the backend provides a complete reference implementation for a REST API alternative.

A key engineering decision is the completedAt timestamp management. A pre-save middleware in Mongoose and a client-side applyCompletedAtLogic function both ensure that completedAt is set when a task is marked complete and cleared when unchecked. This powers the streak algorithm and heatmap without any server-side computation at read time.

The streak algorithm sorts completed task timestamps into a set of unique day-level epoch values, then walks backward from today checking for consecutive days. It correctly handles the case where no task has been completed today but one was completed yesterday.

Firestore security is enforced client-side via user ID checks in every service function. Every read/write validates that auth.currentUser.uid matches the task's userId before proceeding.

A Spline 3D scene (via @splinetool/react-spline) is embedded on the landing page, and Framer Motion handles UI transitions. Recharts powers all dashboard visualizations. react-calendar-heatmap renders the 6-month activity grid.

The testing layer uses Selenium WebDriver (Python, pytest) with a session-scoped browser fixture, a logged-in driver fixture that authenticates before each test, and automatic screenshot capture on test failure. Tests cover CRUD operations, search/filter behavior, form validation, authentication flows (valid login, invalid credentials, duplicate signup, password toggle, loading states), and dashboard navigation.

Web Push notifications and email notification infrastructure are stubbed in the codebase (server route and frontend hooks both present), indicating planned or partially implemented notification delivery.

---

# AI / ML Components

Not applicable. This project does not include LLMs, embeddings, vector databases, OCR, speech, computer vision, or trained ML models. The productivity insight messages ("Your most productive day is Monday") are computed deterministically from task completion timestamps, not from an AI model.

---

# Data Engineering / Data Science Components

The analytics dashboard represents light data processing work. Completion timestamps are aggregated by day of week, calendar date, and week range to produce the charts and insights. The pending-by-importance histogram buckets tasks across a 1–10 scale. Weekend vs. weekday splits are computed by filtering on getDay() values. All analytics are derived from the user's own task history without batch pipelines or external datasets.

---

# Product Thinking

FocusWin reflects several concrete product decisions worth highlighting.

The 10-level priority system is a deliberate departure from conventional High/Medium/Low scales. The reasoning is that real-world tasks rarely fit cleanly into three buckets, and a numeric scale allows users to express relative importance more precisely. The difficulty tag adds orthogonal information: a task can be high-importance and easy (do it now) or high-importance and hard (schedule it).

The "My Day" view is a well-known pattern from Microsoft To Do, but FocusWin pairs it with a celebration animation when all day's tasks are complete. This is a small but intentional motivational loop — it rewards follow-through rather than just task creation.

Nested groups were added to support users managing complex projects with sub-categories (e.g., a "Work" group containing "Frontend" and "Backend" subgroups). The tree renderer and parent-child data model support arbitrary depth, though the UI guides users toward two levels in practice.

The Spaces feature is architecturally separate from personal tasks. Tasks in a Space carry a spaceId field; personal tasks carry spaceId: null. The frontend filters aggressively to prevent cross-contamination, which is a product correctness concern as much as an engineering one.

Real-time sync in Spaces (via onSnapshot) is a deliberate product choice to reduce the perception of lag for collaborative users. For personal tasks, polling-on-demand is sufficient; for a shared Kanban, immediacy matters.

The decision to persist the heatmap's on-time vs. late distinction (rather than just a count) reflects a commitment to honest self-assessment over vanity metrics. A day with three late completions looks different from a day with three on-time completions.

---

# Technologies Used

## Languages
- JavaScript (ES2022+)
- Python 3

## Frontend
- React 18
- React Router v7
- Framer Motion
- Recharts
- react-calendar-heatmap
- react-tooltip
- Tailwind CSS v4
- @splinetool/react-spline
- @react-three/fiber, @react-three/drei

## Backend
- Node.js
- Express.js v5
- Mongoose
- node-cron
- Socket.io (installed)
- web-push (installed)

## Databases
- Firebase Firestore (primary, production)
- MongoDB with Mongoose (secondary, reference implementation)

## Cloud
- Firebase Authentication
- Firebase Firestore
- Firebase Cloud Functions

## Authentication
- Firebase Authentication (email/password, Google OAuth)
- express-session + connect-mongo (backend reference)
- bcryptjs, jsonwebtoken (backend reference)

## Testing
- Python pytest
- Selenium WebDriver
- webdriver-manager
- pytest-html (reports)

## APIs
- Firebase SDK (Firestore, Auth, Functions)
- Web Push API (browser notifications, stubbed)
- Notification API (browser)

## Tools
- Figma (design, per README)
- Canva (per README)
- Spline (3D scene)
- nodemon
- Create React App

---

# Skills Demonstrated

- Full Stack Development
- Frontend Engineering (React, component architecture, custom hooks)
- Backend Engineering (REST API design, Express middleware, session management)
- Firebase / BaaS Integration
- Real-time Data Synchronization (Firestore onSnapshot)
- Authentication & Authorization (Firebase Auth, OAuth, session-based fallback)
- Database Design (Firestore collections, Mongoose schemas, relational-style references)
- Data Aggregation and Visualization (Recharts, custom analytics algorithms)
- Collaborative Feature Design (team workspaces, role-based task assignment)
- State Management (React hooks, Context API)
- Client-Side Filtering and Sorting
- Streak and Habit Tracking Algorithms
- End-to-End Testing (Selenium, pytest, fixture design, screenshot capture)
- Form Validation and UX Error Handling
- Responsive UI Design
- Cloud Function Integration
- Service Layer Abstraction
- Product Thinking (motivational UX, honest analytics, user-centric filtering)

---

# Resume Impact

- Engineered a full-stack productivity application using React 18, Firebase Firestore, and Node.js/Express, supporting real-time collaborative team workspaces with Kanban board views and live task sync via Firestore onSnapshot listeners.
- Designed and implemented a 10-level task prioritization system with difficulty tagging and recurrence scheduling (daily, weekly, monthly), enabling users to manage complex nested project hierarchies.
- Built a data-driven analytics dashboard with Recharts and react-calendar-heatmap, surfacing 8 key productivity metrics, 5 chart types, and a 6-month heatmap that differentiates on-time vs. late task completions.
- Developed a custom streak algorithm that aggregates completion timestamps into day-level sets and walks backward through sorted dates, correctly handling edge cases such as yesterday-only streaks and invalid Firestore timestamps.
- Implemented Firebase Authentication with email/password and Google OAuth, backed by Firestore user profiles and a React Context provider with protected routes and automatic session restoration.
- Architected a clean service abstraction layer that mirrors a REST API contract over Firestore SDK calls, enabling the codebase to support both Firebase and a fully functional Express/MongoDB backend implementation.
- Built a real-time team collaboration feature with invite-by-email via Firebase Cloud Functions, per-task assignment, Kanban status transitions, and live updates shared across all workspace members.
- Wrote a comprehensive Selenium/pytest test suite covering 20+ test cases across authentication flows and CRUD operations, with session-scoped browser fixtures, logged-in driver fixtures, and automatic failure screenshot capture.

---

# Ideal Roles

- Full Stack Engineer
- Frontend Engineer
- Backend Engineer
- Product Engineer
- Software Engineer

---

# Portfolio Tags

React
Firebase
Firestore
Node.js
Express
MongoDB
MERN
TailwindCSS
Recharts
Selenium
Pytest
Real-time
Collaboration
Analytics
Authentication
Google OAuth
Kanban
Productivity
Full Stack
Testing

---

# Project Complexity

**Intermediate to Advanced**

The project goes significantly beyond a CRUD tutorial. It implements real-time multi-user collaboration, a dual-backend architecture (Firebase and Express/MongoDB coexisting in the same repo), a non-trivial streak algorithm, a rich analytics layer with multiple chart types, nested group hierarchies, and a comprehensive Selenium test suite with session management and failure capture. The separation of personal and team data models and the intentional product decisions throughout the UI push this firmly into advanced student or junior-professional territory. It does not have production-grade concerns like CI/CD, monitoring, or infrastructure-as-code, which places it just below production-grade.

---

# One-line Portfolio Summary

Full-stack task management app with real-time team collaboration, a 10-level priority system, and a data-driven analytics dashboard built on React, Firebase, and Node.js.

---

# Repository Evidence

- `client/package.json` — React 18, Recharts, react-calendar-heatmap, Framer Motion, Firebase SDK, Tailwind CSS, Spline, React Router v7
- `server/package.json` — Express v5, Mongoose, express-session, connect-mongo, bcryptjs, jsonwebtoken, socket.io, web-push, node-cron
- `server/server.js` — Route registration, session setup, MongoDB connection, node-cron setup
- `server/models/Task.js` — Mongoose schema with importance (1–10), recurrence, completedAt pre-save hook
- `server/models/Group.js` — Compound unique index on (name, userId)
- `client/src/firebase.js` — Firebase app initialization, Auth and Firestore exports
- `client/src/services/authService.js` — Firebase Auth (email/password, Google OAuth), Firestore user profile management
- `client/src/services/tasksService.js` — Full Firestore CRUD service layer mirroring REST API contract
- `client/src/AuthContext.js` — React Context with onAuthStateChanged subscription
- `client/src/App.js` — Route tree with personal and Spaces route groups, auth guards
- `client/src/Main.js` — Personal task manager with nested groups, filters, recurrence, celebration logic
- `client/src/Dashboard.js` — Analytics dashboard with streak algorithm, heatmap, charts, productivity insights
- `client/src/spaces/SpaceMain.js` — Team task manager with real-time Firestore listeners, assignment, filtering
- `client/src/spaces/SpaceDashboard.js` — Kanban board with real-time sync, invite-by-email via Cloud Function
- `tests/conftest.py` — pytest session fixture, logged-in driver fixture, screenshot-on-failure hook
- `tests/test_todo_ui.py` — 10 Selenium UI tests covering CRUD, search, filter, validation, dashboard navigation
- `tests/test_authentication.py` — 13 Selenium auth tests covering login, signup, validation, Google flow, loading states
- `tests/requirements.txt` — Python test dependencies
- `client/src/spaces/services/` — Separate Firestore service layer for Spaces collections
- link: https://github.com/pavithra2870/FocusWin-Firebase