# Project Plan: Ontario Grade 7 Math Practice App

## Overview1

A quiz and practice web app aligned to the Ontario Grade 7 Mathematics Curriculum (2020). Students browse strands, select expectations, and complete auto-generated practice questions with instant feedback and progress tracking.

**Design reference:** Ontario Curriculum and Resources portal (dcp.edu.gov.on.ca) — clean government-style UI with dark navy header, left sidebar navigation, white content area, teal/blue accents, breadcrumbs, and collapsible sections.

---

## Tech Stack

| Layer        | Choice                          |
| ------------ | ------------------------------- |
| Framework    | Next.js 15 (App Router)         |
| Language     | TypeScript                      |
| Styling      | Tailwind CSS                    |
| State        | React Context + localStorage    |
| Deployment   | Vercel                          |
| Data         | Static JSON (no database)       |

---

## Design System (Ontario Curriculum Theme)

### Colors

| Token              | Value       | Usage                              |
| ------------------ | ----------- | ---------------------------------- |
| `navy`             | `#1a1a2e`  | Top header bar                     |
| `dark-blue`        | `#16214a`  | Secondary header                   |
| `teal`             | `#007a8c`  | Buttons, active links, accents     |
| `link-blue`        | `#0066cc`  | Sidebar links, breadcrumb links    |
| `bg-white`         | `#ffffff`  | Main content background            |
| `bg-gray`          | `#f5f5f5`  | Sidebar background                 |
| `border-gray`      | `#cccccc`  | Section dividers, card borders     |
| `text-primary`     | `#333333`  | Body text                          |
| `text-secondary`   | `#555555`  | Subheadings, descriptions          |
| `success`          | `#2e7d32`  | Correct answers                    |
| `error`            | `#c62828`  | Incorrect answers                  |

### Typography

- Font: System sans-serif stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- Headings: Bold, dark, clean hierarchy (h1 for strand, h2 for substrand, h3 for expectation)
- Body: 16px base, 1.5 line-height

### Layout

- **Top bar:** Full-width dark navy with app title + Ontario-style branding
- **Secondary nav:** Horizontal links (Curriculum, Practice, Progress)
- **Left sidebar:** Collapsible strand/substrand tree navigation (always visible on desktop, drawer on mobile)
- **Main content area:** White background, max-width ~900px, padded
- **Breadcrumbs:** `Home > Strand B: Number > B2. Operations`
- **Section dividers:** Thin horizontal rules between expectation groups

---

## Site Map & Routes

```
/                           → Home (strand overview cards)
/strand/[strandId]          → Strand page (list substrands)
/strand/[strandId]/[sub]    → Substrand page (list expectations with descriptions)
/practice/[expectationCode] → Practice quiz for a specific expectation (e.g. /practice/B2.1)
/progress                   → Progress dashboard (scores per strand/expectation)
```

---

## Data Architecture

### `/src/data/curriculum.ts`

Static curriculum structure matching curriculum.md:

```ts
type Expectation = {
  code: string           // "B1.1"
  title: string          // "Properties and Relationships"
  description: string    // Full expectation text
}

type Substrand = {
  id: string             // "B1"
  name: string           // "Number Sense"
  expectations: Expectation[]
}

type Strand = {
  id: string             // "B"
  name: string           // "Number"
  substrands: Substrand[]
}
```

### `/src/data/questions.ts`

Question bank keyed by expectation code:

```ts
type Question = {
  id: string
  expectation: string    // "B2.1"
  type: "multiple-choice" | "numeric-input" | "true-false"
  question: string
  choices?: string[]
  correctAnswer: string | number
  hint?: string
  explanation: string
}
```

### `/src/data/progress.ts`

localStorage-backed progress tracker:

```ts
type ExpectationProgress = {
  code: string
  attempted: number
  correct: number
  lastAttempted: string  // ISO date
}
```

---

## Page Breakdown

### 1. Home `/`

- Header with app title
- Grid of 5 strand cards (B through F), each showing:
  - Strand letter + name
  - Number of substrands and expectations
  - Overall progress bar
  - Click → `/strand/[id]`

### 2. Strand Page `/strand/[strandId]`

- Breadcrumb: `Home > Strand B: Number`
- Strand title + description
- List of substrand cards with:
  - Substrand code + name (e.g. "B1. Number Sense")
  - Count of expectations
  - Progress indicator
  - Click → `/strand/[strandId]/[sub]`

### 3. Substrand Page `/strand/[strandId]/[sub]`

- Breadcrumb: `Home > Strand B: Number > B1. Number Sense`
- Overall Expectation dropdown (teal button, matching Ontario site)
- List of specific expectations, each showing:
  - Code in bold (e.g. **B1.1**)
  - Topic label (e.g. "Properties and Relationships")
  - Full description text
  - Collapsible "Practice" section (like "Teacher supports" on Ontario site)
  - "Start Practice" button → `/practice/[code]`
  - Mini progress badge (e.g. "8/10 correct")

### 4. Practice Page `/practice/[expectationCode]`

- Breadcrumb showing full path
- Expectation title + code at top
- Question card:
  - Question number (e.g. "Question 3 of 10")
  - Question text (supports math notation)
  - Answer input (multiple choice radio, numeric input, or true/false)
  - "Check Answer" button
  - Feedback: correct/incorrect + explanation (collapsible)
  - "Next Question" button
- Progress bar at top showing current position
- End-of-quiz summary:
  - Score (e.g. 7/10)
  - Per-question review
  - "Try Again" / "Back to Expectations" buttons

### 5. Progress Page `/progress`

- Overall stats (total attempted, accuracy percentage)
- Strand-by-strand breakdown table:
  - Strand name
  - Expectations covered vs total
  - Accuracy %
  - Progress bar
- Expandable per-expectation detail rows
- "Reset Progress" button (with confirmation)

---

## Component Tree

```
src/
├── app/
│   ├── layout.tsx              → Shell: header + sidebar + main
│   ├── page.tsx                → Home (strand cards)
│   ├── strand/
│   │   ├── [strandId]/
│   │   │   ├── page.tsx        → Strand detail
│   │   │   └── [sub]/
│   │   │       └── page.tsx    → Substrand detail
│   ├── practice/
│   │   └── [code]/
│   │       └── page.tsx        → Quiz page
│   └── progress/
│       └── page.tsx            → Progress dashboard
├── components/
│   ├── Header.tsx              → Dark navy top bar
│   ├── SecondaryNav.tsx        → Horizontal nav links
│   ├── Sidebar.tsx             → Collapsible strand tree
│   ├── Breadcrumb.tsx          → Breadcrumb trail
│   ├── StrandCard.tsx          → Card for home page
│   ├── ExpectationItem.tsx     → Expandable expectation row
│   ├── QuestionCard.tsx        → Renders a single question
│   ├── ProgressBar.tsx         → Reusable progress bar
│   └── QuizSummary.tsx         → End-of-quiz results
├── data/
│   ├── curriculum.ts           → Strand/substrand/expectation data
│   └── questions.ts            → Question bank per expectation
├── hooks/
│   └── useProgress.ts          → localStorage progress read/write
├── context/
│   └── ProgressContext.tsx      → App-wide progress state
└── types/
    └── index.ts                → Shared TypeScript types
```

---

## Build Phases

### Phase 1: Foundation

- [ ] Initialize Next.js 15 + TypeScript + Tailwind
- [ ] Set up Tailwind theme with Ontario curriculum colors
- [ ] Create layout shell (Header, SecondaryNav, Sidebar, Breadcrumb)
- [ ] Build curriculum data file from curriculum.md
- [ ] Implement routes and navigation

### Phase 2: Curriculum Browsing

- [ ] Home page with strand cards
- [ ] Strand detail page with substrand list
- [ ] Substrand page with collapsible expectation items
- [ ] Sidebar tree navigation with active state highlighting
- [ ] Responsive design (sidebar → drawer on mobile)

### Phase 3: Practice & Questions

- [ ] Define question bank (5-10 questions per expectation, start with Strand B)
- [ ] Build QuestionCard component (multiple choice, numeric, true/false)
- [ ] Practice page with sequential question flow
- [ ] Answer checking with correct/incorrect feedback + explanation
- [ ] Quiz summary at end

### Phase 4: Progress Tracking

- [ ] useProgress hook with localStorage
- [ ] ProgressContext provider
- [ ] Progress badges on expectation items
- [ ] Progress dashboard page with strand breakdown
- [ ] Reset progress functionality

### Phase 5: Polish & Deploy

- [ ] Add remaining question banks (Strands C, D, E, F)
- [ ] Accessibility audit (keyboard nav, ARIA labels, contrast)
- [ ] Mobile responsiveness pass
- [ ] Deploy to Vercel
