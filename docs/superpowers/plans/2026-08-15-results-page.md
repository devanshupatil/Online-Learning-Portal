# Results Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dedicated `/results` page for EduLearning Platform with 14 content sections (hero, stats, year-wise filter, achiever grids, subject toppers, class-wise cards, growth chart, success stories, gallery, testimonials, final CTA), backed by new mock data — matching the spec at `docs/superpowers/specs/2026-08-15-results-page-design.md`.

**Architecture:** One file per section under `Frontend/src/components/Results/sections/`, composed by `Frontend/src/components/Results/ResultsPage.jsx`, wired into `App.jsx` as route `/results`. All content comes from a new `Frontend/src/mockData/resultsData.js`. Three achiever sections share one `AchieverCard` component; all "photo" slots use a new `InitialsAvatar` component (no external image service).

**Tech Stack:** React 18 (Vite), React Router, Tailwind CSS 4 (existing `@theme` tokens in `Frontend/src/index.css`), `recharts` (new dependency, for the growth chart only).

**Testing approach:** This project has no test runner configured (`Frontend/package.json` scripts are only `dev`/`build`/`lint`/`preview`) and no existing component (`AboutPage.jsx`, `Home.jsx`, `ParentDashboard.jsx`, etc.) has unit tests. This plan follows that existing convention rather than introducing a new one: every task is verified with `npm run build` (catches syntax/JSX/import errors) and `npm run lint`, and the final task adds a manual visual pass via `npm run dev`. No test framework is added.

---

### Task 1: Install recharts

**Files:**
- Modify: `Frontend/package.json`

- [ ] **Step 1: Install the dependency**

Run: `cd "/home/devanshu/Online Learning Portal/Frontend" && npm install recharts`
Expected: `recharts` added to `dependencies` in `package.json` and `package-lock.json` updated, no errors.

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/package.json Frontend/package-lock.json
git commit -m "Add recharts dependency for Results page growth chart"
```

---

### Task 2: Create mock data file

**Files:**
- Create: `Frontend/src/mockData/resultsData.js`

- [ ] **Step 1: Write the file**

```js
// Dummy data for demo purposes only. The real database is not connected;
// this file stands in for a backend results/marks system on the Results page.

export const RESULTS_OVERALL_STATS = {
  passRate: 96,
  students80Plus: 540,
  students90Plus: 128,
  toppers: 24,
  yearsConsistent: 13,
};

// Newest year first — drives both the Year-wise Results tabs (default
// selection = index 0) and the Growth Chart (which reverses this order).
export const RESULTS_BY_YEAR = [
  { year: '2025–26', totalStudents: 620, passPercentage: 96, eightyPlusCount: 540, ninetyPlusCount: 128, highestPercentage: 98.4 },
  { year: '2024–25', totalStudents: 590, passPercentage: 95, eightyPlusCount: 505, ninetyPlusCount: 118, highestPercentage: 98.0 },
  { year: '2023–24', totalStudents: 560, passPercentage: 94, eightyPlusCount: 470, ninetyPlusCount: 105, highestPercentage: 97.6 },
  { year: '2022–23', totalStudents: 530, passPercentage: 92, eightyPlusCount: 430, ninetyPlusCount: 92, highestPercentage: 96.8 },
];

export const TOP_ACHIEVERS = [
  { name: 'Rahul Patil', percentage: 98.4, class: 'Class 10 · SSC', year: '2025–26', featured: true },
  { name: 'Sneha Kulkarni', percentage: 98.1, class: 'Class 12 · HSC Science', year: '2025–26' },
  { name: 'Aarav Sharma', percentage: 97.9, class: 'Class 10 · SSC', year: '2025–26' },
  { name: 'Ananya Iyer', percentage: 97.6, class: 'Class 12 · HSC Science', year: '2025–26' },
  { name: 'Yash Patil', percentage: 97.2, class: 'Class 10 · SSC', year: '2025–26' },
  { name: 'Diya Nair', percentage: 96.9, class: 'Class 12 · HSC Commerce', year: '2025–26' },
  { name: 'Kabir Malhotra', percentage: 96.5, class: 'Class 10 · SSC', year: '2025–26' },
  { name: 'Riya Chavan', percentage: 96.1, class: 'Class 12 · HSC Science', year: '2025–26' },
];

export const ACHIEVERS_90_PLUS = [
  { name: 'Vivaan Mehta', percentage: 95.8, class: 'Class 10', batch: 'Morning Batch A', school: "St. Xavier's High School" },
  { name: 'Ishaan Kapoor', percentage: 94.6, class: 'Class 12', batch: 'Evening Batch B', school: 'Fergusson College' },
  { name: 'Rohan Gupta', percentage: 93.9, class: 'Class 10', batch: 'Morning Batch A', school: 'Delhi Public School' },
  { name: 'Aditya Verma', percentage: 93.2, class: 'Class 12', batch: 'Evening Batch B', school: 'Modern College' },
  { name: 'Myra Joshi', percentage: 92.8, class: 'Class 9', batch: 'Weekend Batch C', school: 'Ryan International' },
  { name: 'Kiara Menon', percentage: 92.4, class: 'Class 10', batch: 'Morning Batch A', school: "St. Xavier's High School" },
  { name: 'Aadhya Pillai', percentage: 92.0, class: 'Class 12', batch: 'Evening Batch B', school: 'Symbiosis College' },
  { name: 'Arjun Deshmukh', percentage: 91.7, class: 'Class 11', batch: 'Morning Batch A', school: 'Fergusson College' },
  { name: 'Sai Kulkarni', percentage: 91.3, class: 'Class 9', batch: 'Weekend Batch C', school: 'Delhi Public School' },
  { name: 'Om Joshi', percentage: 90.9, class: 'Class 10', batch: 'Morning Batch A', school: 'Ryan International' },
  { name: 'Reyansh Shinde', percentage: 90.5, class: 'Class 11', batch: 'Evening Batch B', school: 'Modern College' },
  { name: 'Tanvi Bhosale', percentage: 90.1, class: 'Class 9', batch: 'Weekend Batch C', school: "St. Xavier's High School" },
];

// stream here is a results-page-only label (SSC/HSC/Foundation tracks), not
// the STREAM_CLASSES used by attendance features in data.js — the two are
// independent mock datasets for different pages.
export const ACHIEVERS_80_PLUS = [
  { name: 'Neha Pawar', percentage: 89.4, class: 'Class 10', year: '2025–26', stream: 'SSC' },
  { name: 'Onkar Bhosale', percentage: 88.7, class: 'Class 12', year: '2025–26', stream: 'HSC Science' },
  { name: 'Siddhi Rane', percentage: 87.2, class: 'Class 9', year: '2025–26', stream: 'JEE Foundation' },
  { name: 'Harsh Thakur', percentage: 85.9, class: 'Class 11', year: '2025–26', stream: 'NEET Foundation' },
  { name: 'Pranav Salunkhe', percentage: 84.3, class: 'Class 10', year: '2025–26', stream: 'SSC' },
  { name: 'Ira Kadam', percentage: 82.6, class: 'Class 12', year: '2025–26', stream: 'HSC Commerce' },
  { name: 'Devika More', percentage: 89.0, class: 'Class 10', year: '2024–25', stream: 'SSC' },
  { name: 'Rutuja Gaikwad', percentage: 86.5, class: 'Class 12', year: '2024–25', stream: 'HSC Science' },
  { name: 'Aryan Naik', percentage: 83.8, class: 'Class 9', year: '2024–25', stream: 'JEE Foundation' },
  { name: 'Manasi Kale', percentage: 81.2, class: 'Class 11', year: '2024–25', stream: 'NEET Foundation' },
  { name: 'Rohit Bansode', percentage: 88.1, class: 'Class 10', year: '2023–24', stream: 'SSC' },
  { name: 'Sanika Phadke', percentage: 84.9, class: 'Class 12', year: '2023–24', stream: 'HSC Commerce' },
  { name: 'Karan Chougule', percentage: 82.0, class: 'Class 9', year: '2023–24', stream: 'JEE Foundation' },
  { name: 'Vaishnavi Ghadge', percentage: 87.4, class: 'Class 10', year: '2022–23', stream: 'SSC' },
  { name: 'Nikhil Sawant', percentage: 83.5, class: 'Class 12', year: '2022–23', stream: 'HSC Science' },
  { name: 'Pallavi Jagtap', percentage: 80.7, class: 'Class 11', year: '2022–23', stream: 'NEET Foundation' },
];

export const SUBJECT_TOPPERS = [
  { subject: 'Mathematics', studentName: 'Rahul Patil', marks: 99, totalMarks: 100 },
  { subject: 'Science', studentName: 'Sneha Kulkarni', marks: 98, totalMarks: 100 },
  { subject: 'English', studentName: 'Ananya Iyer', marks: 96, totalMarks: 100 },
  { subject: 'Physics', studentName: 'Aarav Sharma', marks: 97, totalMarks: 100 },
  { subject: 'Chemistry', studentName: 'Yash Patil', marks: 95, totalMarks: 100 },
  { subject: 'Biology', studentName: 'Diya Nair', marks: 98, totalMarks: 100 },
];

export const CLASSWISE_RESULTS = [
  { class: 'Class 8', appeared: 88, passPercentage: 98, highestScore: 96.5, eightyPlusCount: 62 },
  { class: 'Class 9', appeared: 104, passPercentage: 97, highestScore: 97.2, eightyPlusCount: 74 },
  { class: 'Class 10', appeared: 156, passPercentage: 96, highestScore: 98.4, eightyPlusCount: 118 },
  { class: 'Class 11', appeared: 132, passPercentage: 95, highestScore: 96.8, eightyPlusCount: 92 },
  { class: 'Class 12', appeared: 140, passPercentage: 96, highestScore: 98.1, eightyPlusCount: 106 },
];

export const SUCCESS_STORIES = [
  {
    name: 'Aarav Sharma',
    challenge: 'Struggled with time management in Physics numericals and consistently ran out of time in mock tests.',
    preparation: 'Joined the Morning Batch A intensive track, followed a structured daily practice schedule, and worked one-on-one with faculty on speed-solving techniques.',
    result: 'Improved his Physics score from 68% to 94% and secured 97.9% overall in the SSC 2025–26 boards.',
  },
  {
    name: 'Diya Nair',
    challenge: 'Found Organic Chemistry conceptually difficult and lacked confidence answering long-form questions.',
    preparation: 'Attended weekly doubt-clearing sessions, built a personal formula and reaction notebook, and took part-syllabus tests every two weeks.',
    result: 'Became a Biology subject topper with 98/100 and scored 96.9% in the HSC Commerce 2025–26 exams.',
  },
  {
    name: 'Om Joshi',
    challenge: 'Inconsistent attendance in the early months due to travel, leading to gaps in foundational concepts.',
    preparation: 'Used recorded lecture material to catch up, attended weekend remedial classes, and stayed in close contact with mentors on tracked progress.',
    result: 'Closed every conceptual gap and finished with 90.9%, crossing the 90%+ mark for the first time.',
  },
];

export const RESULT_TESTIMONIALS = [
  { quote: "The teachers didn't just teach the syllabus, they taught us how to think under exam pressure.", name: 'Rahul Patil', role: 'Class 10 SSC, 2025–26' },
  { quote: 'As a parent, the regular progress updates gave me real confidence that my daughter was on track.', name: 'Rakesh Sharma', role: 'Parent of Aarav Sharma' },
  { quote: 'The personalized doubt-clearing sessions made all the difference for my weakest subject.', name: 'Sneha Kulkarni', role: 'Class 12 HSC Science, 2025–26' },
  { quote: 'From a 68% in Physics to full confidence in the exam hall — this place changed how my son studies.', name: 'Suresh Mehta', role: 'Parent of Vivaan Mehta' },
];
```

- [ ] **Step 2: Verify the file is valid JS**

Run: `cd "/home/devanshu/Online Learning Portal/Frontend" && node -e "require('esbuild')" 2>/dev/null; node --input-type=module -e "import('./src/mockData/resultsData.js').then(m => console.log(Object.keys(m)))"`
Expected: prints an array of the exported names (`RESULTS_OVERALL_STATS`, `RESULTS_BY_YEAR`, `TOP_ACHIEVERS`, `ACHIEVERS_90_PLUS`, `ACHIEVERS_80_PLUS`, `SUBJECT_TOPPERS`, `CLASSWISE_RESULTS`, `SUCCESS_STORIES`, `RESULT_TESTIMONIALS`), no errors.

- [ ] **Step 3: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/mockData/resultsData.js
git commit -m "Add mock data for Results page"
```

---

### Task 3: Create InitialsAvatar component

**Files:**
- Create: `Frontend/src/components/ui/InitialsAvatar.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";

const PALETTE = [
  "bg-primary text-white",
  "bg-secondary text-white",
  "bg-tertiary-container text-white",
  "bg-primary-container text-on-primary-container",
  "bg-secondary-fixed text-on-secondary-fixed",
  "bg-primary-fixed text-on-primary-fixed",
];

const SIZES = {
  sm: "w-10 h-10 text-sm",
  md: "w-14 h-14 text-lg",
  lg: "w-20 h-20 text-2xl",
  xl: "w-28 h-28 text-4xl",
};

const getInitials = (name) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

const getColorClass = (name) => {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
};

const InitialsAvatar = ({ name, size = "md", className = "" }) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold shrink-0 ${SIZES[size]} ${getColorClass(name)} ${className}`}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default InitialsAvatar;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/ui/InitialsAvatar.jsx
git commit -m "Add InitialsAvatar placeholder avatar component"
```

---

### Task 4: Create shared AchieverCard component

**Files:**
- Create: `Frontend/src/components/Results/sections/AchieverCard.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";
import InitialsAvatar from "../../ui/InitialsAvatar";

const AchieverCard = ({
  name,
  percentage,
  class: studentClass,
  featured = false,
  batch,
  school,
  year,
  stream,
}) => {
  if (featured) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center soft-shadow border-2 border-primary/30 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-3xl" aria-hidden="true">
          🥇
        </div>
        <InitialsAvatar name={name} size="xl" className="mx-auto mb-4 border-4 border-primary/20" />
        <h3 className="text-2xl font-bold text-on-surface mb-1">{name}</h3>
        <div className="text-4xl font-bold text-primary mb-2">{percentage}%</div>
        <p className="text-on-surface-variant">
          {studentClass}
          {year ? ` | ${year}` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 text-center soft-shadow border border-outline-variant/20 hover:-translate-y-1 transition-transform duration-300">
      <InitialsAvatar name={name} size="lg" className="mx-auto mb-4" />
      <h3 className="text-lg font-bold text-on-surface mb-1">{name}</h3>
      <div className="text-2xl font-bold text-primary mb-2">{percentage}%</div>
      <p className="text-sm text-on-surface-variant">{studentClass}</p>
      {(batch || school) && (
        <p className="text-xs text-on-surface-variant mt-1">
          {[batch, school].filter(Boolean).join(" · ")}
        </p>
      )}
      {(year || stream) && (
        <p className="text-xs text-on-surface-variant mt-1">
          {[year, stream].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
};

export default AchieverCard;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/AchieverCard.jsx
git commit -m "Add shared AchieverCard component for Results page"
```

---

### Task 5: Create ResultsHero section

**Files:**
- Create: `Frontend/src/components/Results/sections/ResultsHero.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";

const ResultsHero = () => {
  const scrollToAchievers = (e) => {
    e.preventDefault();
    document.getElementById("top-achievers")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center pt-20 overflow-hidden bg-surface"
      id="results-hero"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface to-secondary/10" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 text-center flex flex-col items-center py-16">
        <span className="glass-panel px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-primary mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">emoji_events</span>
          RESULTS 2025–26
        </span>
        <h1 className="font-display text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] text-on-surface mb-6 max-w-4xl mx-auto tracking-tight">
          Our Results,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Our Pride
          </span>
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10">
          Celebrating the hard work and success of our students.
        </p>
        <a
          className="inline-flex items-center justify-center px-6 py-[6px] rounded-full gradient-btn text-white font-semibold soft-shadow hover:opacity-90 transition-all hover:-translate-y-1 text-center h-9"
          href="#top-achievers"
          onClick={scrollToAchievers}
        >
          View Our Achievers
        </a>
      </div>
    </section>
  );
};

export default ResultsHero;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/ResultsHero.jsx
git commit -m "Add Results page hero section"
```

---

### Task 6: Create OverallStats section

**Files:**
- Create: `Frontend/src/components/Results/sections/OverallStats.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";
import { RESULTS_OVERALL_STATS } from "../../../mockData/resultsData";

const statCards = [
  { icon: "military_tech", key: "passRate", suffix: "%+", label: "Overall Pass Rate" },
  { icon: "flag", key: "students80Plus", suffix: "+", label: "Students Scored 80%+" },
  { icon: "star", key: "students90Plus", suffix: "+", label: "Students Scored 90%+" },
  { icon: "workspace_premium", key: "toppers", suffix: "+", label: "School/College Toppers" },
  { icon: "trending_up", key: "yearsConsistent", suffix: "", label: "Years of Consistent Results" },
];

const OverallStats = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="overall-stats">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Numbers That Speak for Themselves
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((card) => (
            <div
              key={card.key}
              className="bg-surface p-8 rounded-2xl soft-shadow text-center border border-outline-variant/20 hover:-translate-y-1 transition-transform duration-300"
            >
              <span className="material-symbols-outlined text-primary text-[40px] mb-4 inline-block">
                {card.icon}
              </span>
              <div className="text-3xl font-bold text-on-surface mb-1">
                {RESULTS_OVERALL_STATS[card.key]}
                {card.suffix}
              </div>
              <p className="text-on-surface-variant">{card.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OverallStats;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/OverallStats.jsx
git commit -m "Add Results page overall statistics section"
```

---

### Task 7: Create YearwiseResults section

**Files:**
- Create: `Frontend/src/components/Results/sections/YearwiseResults.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React, { useState } from "react";
import { RESULTS_BY_YEAR } from "../../../mockData/resultsData";

const YearwiseResults = () => {
  const [activeYear, setActiveYear] = useState(RESULTS_BY_YEAR[0].year);
  const active = RESULTS_BY_YEAR.find((r) => r.year === activeYear) ?? RESULTS_BY_YEAR[0];

  const metrics = [
    { label: "Total Students", value: active.totalStudents },
    { label: "Pass Percentage", value: `${active.passPercentage}%` },
    { label: "80%+ Students", value: active.eightyPlusCount },
    { label: "90%+ Students", value: active.ninetyPlusCount },
    { label: "Highest Percentage", value: `${active.highestPercentage}%` },
  ];

  return (
    <section className="py-16 md:py-[120px] bg-surface" id="year-wise-results">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Year-wise Results
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {RESULTS_BY_YEAR.map((r) => (
            <button
              key={r.year}
              type="button"
              onClick={() => setActiveYear(r.year)}
              className={
                r.year === activeYear
                  ? "px-5 py-2 rounded-full bg-primary text-white font-semibold soft-shadow transition-all"
                  : "px-5 py-2 rounded-full bg-surface-container-lowest text-on-surface-variant font-semibold border border-outline-variant/30 hover:border-primary/40 transition-all"
              }
            >
              {r.year}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-surface-container-lowest p-6 rounded-2xl soft-shadow text-center border border-outline-variant/20"
            >
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{m.value}</div>
              <p className="text-sm text-on-surface-variant">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YearwiseResults;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/YearwiseResults.jsx
git commit -m "Add Results page year-wise results section"
```

---

### Task 8: Create TopAchievers section

**Files:**
- Create: `Frontend/src/components/Results/sections/TopAchievers.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";
import AchieverCard from "./AchieverCard";
import { TOP_ACHIEVERS } from "../../../mockData/resultsData";

const TopAchievers = () => {
  const featured = TOP_ACHIEVERS.find((a) => a.featured) ?? TOP_ACHIEVERS[0];
  const rest = TOP_ACHIEVERS.filter((a) => a !== featured);

  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="top-achievers">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Top Achievers
          </h2>
          <p className="text-lg text-on-surface-variant">
            Our highest scorers, leading from the front.
          </p>
        </div>
        <div className="max-w-md mx-auto mb-12">
          <AchieverCard {...featured} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {rest.map((a) => (
            <AchieverCard key={a.name} {...a} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopAchievers;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/TopAchievers.jsx
git commit -m "Add Results page top achievers section"
```

---

### Task 9: Create NinetyPlusAchievers section

**Files:**
- Create: `Frontend/src/components/Results/sections/NinetyPlusAchievers.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";
import AchieverCard from "./AchieverCard";
import { ACHIEVERS_90_PLUS } from "../../../mockData/resultsData";

const NinetyPlusAchievers = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface" id="ninety-plus-achievers">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            90%+ Achievers
          </h2>
          <p className="text-lg text-on-surface-variant">
            Students who crossed the 90% mark this year.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ACHIEVERS_90_PLUS.map((a) => (
            <AchieverCard key={a.name} {...a} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NinetyPlusAchievers;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/NinetyPlusAchievers.jsx
git commit -m "Add Results page 90%+ achievers section"
```

---

### Task 10: Create EightyPlusAchievers section (with filters)

**Files:**
- Create: `Frontend/src/components/Results/sections/EightyPlusAchievers.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React, { useMemo, useState } from "react";
import AchieverCard from "./AchieverCard";
import { ACHIEVERS_80_PLUS } from "../../../mockData/resultsData";

const ALL = "All";
const RANGES = [ALL, "80-84%", "85-89%"];

const EightyPlusAchievers = () => {
  const years = useMemo(() => [ALL, ...new Set(ACHIEVERS_80_PLUS.map((a) => a.year))], []);
  const classes = useMemo(() => [ALL, ...new Set(ACHIEVERS_80_PLUS.map((a) => a.class))], []);
  const streams = useMemo(() => [ALL, ...new Set(ACHIEVERS_80_PLUS.map((a) => a.stream))], []);

  const [year, setYear] = useState(ALL);
  const [studentClass, setStudentClass] = useState(ALL);
  const [stream, setStream] = useState(ALL);
  const [range, setRange] = useState(ALL);

  const filtered = ACHIEVERS_80_PLUS.filter((a) => {
    if (year !== ALL && a.year !== year) return false;
    if (studentClass !== ALL && a.class !== studentClass) return false;
    if (stream !== ALL && a.stream !== stream) return false;
    if (range === "80-84%" && !(a.percentage >= 80 && a.percentage < 85)) return false;
    if (range === "85-89%" && !(a.percentage >= 85 && a.percentage < 90)) return false;
    return true;
  });

  const selectClass =
    "px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant text-sm font-medium focus:outline-none focus:border-primary/50";

  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="eighty-plus-achievers">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            80%+ Achievers
          </h2>
          <p className="text-lg text-on-surface-variant">
            A broader look at consistently strong performance across years.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <select className={selectClass} value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y === ALL ? "All Years" : y}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                {c === ALL ? "All Classes" : c}
              </option>
            ))}
          </select>
          <select className={selectClass} value={range} onChange={(e) => setRange(e.target.value)}>
            {RANGES.map((r) => (
              <option key={r} value={r}>
                {r === ALL ? "All Percentages" : r}
              </option>
            ))}
          </select>
          <select className={selectClass} value={stream} onChange={(e) => setStream(e.target.value)}>
            {streams.map((s) => (
              <option key={s} value={s}>
                {s === ALL ? "All Streams" : s}
              </option>
            ))}
          </select>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-on-surface-variant">No achievers match these filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((a) => (
              <AchieverCard key={a.name} {...a} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EightyPlusAchievers;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/EightyPlusAchievers.jsx
git commit -m "Add Results page 80%+ achievers section with filters"
```

---

### Task 11: Create SubjectToppers section

**Files:**
- Create: `Frontend/src/components/Results/sections/SubjectToppers.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";
import InitialsAvatar from "../../ui/InitialsAvatar";
import { SUBJECT_TOPPERS } from "../../../mockData/resultsData";

const SubjectToppers = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface" id="subject-toppers">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Subject-wise Toppers
          </h2>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl soft-shadow border border-outline-variant/20 overflow-hidden">
          <div className="hidden md:grid grid-cols-3 px-8 py-4 bg-surface-container-low text-on-surface-variant text-sm font-bold uppercase tracking-wider">
            <span>Subject</span>
            <span>Student</span>
            <span className="text-right">Marks</span>
          </div>
          {SUBJECT_TOPPERS.map((row) => (
            <div
              key={row.subject}
              className="grid grid-cols-1 md:grid-cols-3 items-center gap-3 px-8 py-5 border-t border-outline-variant/10 first:border-t-0"
            >
              <span className="font-semibold text-on-surface">{row.subject}</span>
              <span className="flex items-center gap-3 text-on-surface-variant">
                <InitialsAvatar name={row.studentName} size="sm" />
                {row.studentName}
              </span>
              <span className="md:text-right font-bold text-primary">
                {row.marks}/{row.totalMarks}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectToppers;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/SubjectToppers.jsx
git commit -m "Add Results page subject-wise toppers section"
```

---

### Task 12: Create ClasswiseResults section

**Files:**
- Create: `Frontend/src/components/Results/sections/ClasswiseResults.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";
import { CLASSWISE_RESULTS } from "../../../mockData/resultsData";

const ClasswiseResults = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="classwise-results">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Class-wise Results
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CLASSWISE_RESULTS.map((c) => (
            <div
              key={c.class}
              className="bg-surface p-6 rounded-2xl soft-shadow border border-outline-variant/20 hover:-translate-y-1 transition-transform duration-300"
            >
              <h3 className="text-xl font-bold text-primary mb-4">{c.class}</h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li className="flex justify-between">
                  <span>Appeared</span>
                  <span className="font-semibold text-on-surface">{c.appeared}</span>
                </li>
                <li className="flex justify-between">
                  <span>Pass %</span>
                  <span className="font-semibold text-on-surface">{c.passPercentage}%</span>
                </li>
                <li className="flex justify-between">
                  <span>Highest Score</span>
                  <span className="font-semibold text-on-surface">{c.highestScore}%</span>
                </li>
                <li className="flex justify-between">
                  <span>80%+ Students</span>
                  <span className="font-semibold text-on-surface">{c.eightyPlusCount}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClasswiseResults;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/ClasswiseResults.jsx
git commit -m "Add Results page class-wise results section"
```

---

### Task 13: Create GrowthChart section

**Files:**
- Create: `Frontend/src/components/Results/sections/GrowthChart.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RESULTS_BY_YEAR } from "../../../mockData/resultsData";

const chartData = [...RESULTS_BY_YEAR]
  .reverse()
  .map((r) => ({ year: r.year, passPercentage: r.passPercentage }));

const GrowthChart = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface" id="growth-chart">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Consistent Year-on-Year Growth
          </h2>
          <p className="text-lg text-on-surface-variant">
            Our pass percentage has climbed steadily, year after year.
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl soft-shadow border border-outline-variant/20 p-6 md:p-10 h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c3c6d7" vertical={false} />
              <XAxis dataKey="year" stroke="#434655" tickLine={false} />
              <YAxis stroke="#434655" tickLine={false} domain={[80, 100]} unit="%" />
              <Tooltip
                formatter={(value) => [`${value}%`, "Pass Percentage"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #c3c6d7" }}
              />
              <Bar dataKey="passPercentage" fill="#004ac6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default GrowthChart;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/GrowthChart.jsx
git commit -m "Add Results page growth chart section"
```

---

### Task 14: Create SuccessStories section

**Files:**
- Create: `Frontend/src/components/Results/sections/SuccessStories.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";
import InitialsAvatar from "../../ui/InitialsAvatar";
import { SUCCESS_STORIES } from "../../../mockData/resultsData";

const SuccessStories = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="success-stories">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Student Success Stories
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SUCCESS_STORIES.map((s) => (
            <div
              key={s.name}
              className="bg-surface p-8 rounded-2xl soft-shadow border border-outline-variant/20 flex flex-col gap-6"
            >
              <div className="flex items-center gap-4">
                <InitialsAvatar name={s.name} size="md" />
                <h3 className="text-xl font-bold text-on-surface">{s.name}</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-primary font-bold uppercase tracking-wider text-xs">
                    Challenge
                  </span>
                  <p className="text-on-surface-variant mt-1">{s.challenge}</p>
                </div>
                <div>
                  <span className="text-primary font-bold uppercase tracking-wider text-xs">
                    Preparation
                  </span>
                  <p className="text-on-surface-variant mt-1">{s.preparation}</p>
                </div>
                <div>
                  <span className="text-primary font-bold uppercase tracking-wider text-xs">
                    Result
                  </span>
                  <p className="text-on-surface-variant mt-1">{s.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/SuccessStories.jsx
git commit -m "Add Results page success stories section"
```

---

### Task 15: Create TopperGallery section

**Files:**
- Create: `Frontend/src/components/Results/sections/TopperGallery.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";

const galleryCategories = [
  { icon: "school", title: "School Toppers", gradient: "from-primary to-secondary" },
  { icon: "groups", title: "Class Toppers", gradient: "from-secondary to-tertiary-container" },
  { icon: "menu_book", title: "Subject Toppers", gradient: "from-tertiary-container to-primary" },
  { icon: "emoji_events", title: "Prize Distribution", gradient: "from-primary to-tertiary-container" },
];

const TopperGallery = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface" id="topper-gallery">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Toppers Gallery
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryCategories.map((cat) => (
            <div
              key={cat.title}
              className={`relative overflow-hidden rounded-2xl soft-shadow aspect-square flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br ${cat.gradient} text-white hover:-translate-y-1 transition-transform duration-300`}
            >
              <span className="material-symbols-outlined text-[48px] mb-4">{cat.icon}</span>
              <h3 className="text-lg font-bold">{cat.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopperGallery;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/TopperGallery.jsx
git commit -m "Add Results page toppers gallery section"
```

---

### Task 16: Create Testimonials section

**Files:**
- Create: `Frontend/src/components/Results/sections/Testimonials.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";
import InitialsAvatar from "../../ui/InitialsAvatar";
import { RESULT_TESTIMONIALS } from "../../../mockData/resultsData";

const Testimonials = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="testimonials">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            What Our Students &amp; Parents Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESULT_TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-surface p-8 rounded-2xl soft-shadow border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-primary text-[32px] mb-4 inline-block">
                format_quote
              </span>
              <p className="text-on-surface-variant mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <InitialsAvatar name={t.name} size="sm" />
                <div>
                  <div className="font-bold text-on-surface">{t.name}</div>
                  <div className="text-xs text-on-surface-variant">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/Testimonials.jsx
git commit -m "Add Results page testimonials section"
```

---

### Task 17: Create FinalCTA section

**Files:**
- Create: `Frontend/src/components/Results/sections/FinalCTA.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";

const FinalCTA = () => {
  return (
    <section
      className="py-16 md:py-[120px] bg-primary text-white relative overflow-hidden"
      id="final-cta"
    >
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="max-w-[1280px] mx-auto px-6 text-center relative z-10">
        <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] tracking-tight mb-4">
          Want to Be Our Next Star Achiever?
        </h2>
        <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
          Start your journey with EduLearning Platform today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            className="inline-flex items-center justify-center px-6 py-[6px] rounded-full bg-white text-primary font-semibold soft-shadow hover:opacity-90 transition-all hover:-translate-y-1 text-center h-9"
            href="/#courses"
          >
            Explore Courses
          </a>
          <a
            className="inline-flex items-center justify-center px-6 py-[6px] rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all text-center h-9"
            href="/#enroll"
          >
            Enroll Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/sections/FinalCTA.jsx
git commit -m "Add Results page final CTA section"
```

---

### Task 18: Create ResultsPage.jsx

**Files:**
- Create: `Frontend/src/components/Results/ResultsPage.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from "react";
import { SiteNav, SiteFooter } from "../SiteChrome";
import ResultsHero from "./sections/ResultsHero";
import OverallStats from "./sections/OverallStats";
import YearwiseResults from "./sections/YearwiseResults";
import TopAchievers from "./sections/TopAchievers";
import NinetyPlusAchievers from "./sections/NinetyPlusAchievers";
import EightyPlusAchievers from "./sections/EightyPlusAchievers";
import SubjectToppers from "./sections/SubjectToppers";
import ClasswiseResults from "./sections/ClasswiseResults";
import GrowthChart from "./sections/GrowthChart";
import SuccessStories from "./sections/SuccessStories";
import TopperGallery from "./sections/TopperGallery";
import Testimonials from "./sections/Testimonials";
import FinalCTA from "./sections/FinalCTA";

const ResultsPage = () => {
  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden">
      <SiteNav active="Results" />
      <ResultsHero />
      <OverallStats />
      <YearwiseResults />
      <TopAchievers />
      <NinetyPlusAchievers />
      <EightyPlusAchievers />
      <SubjectToppers />
      <ClasswiseResults />
      <GrowthChart />
      <SuccessStories />
      <TopperGallery />
      <Testimonials />
      <FinalCTA />
      <SiteFooter />
    </div>
  );
};

export default ResultsPage;
```

- [ ] **Step 2: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/components/Results/ResultsPage.jsx
git commit -m "Add ResultsPage composing all Results sections"
```

---

### Task 19: Wire up routing and nav link

**Files:**
- Modify: `Frontend/src/App.jsx`
- Modify: `Frontend/src/components/SiteChrome.jsx`

- [ ] **Step 1: Add the route in `App.jsx`**

Add the import near the other page imports:

```jsx
import ResultsPage from './components/Results/ResultsPage'
```

Add the route inside `<Routes>`, after the `/about` route:

```jsx
<Route path="/results" element={<ResultsPage />} />
```

- [ ] **Step 2: Update the nav link in `SiteChrome.jsx`**

In the `navLinks` array, change:

```jsx
{ label: "Results", path: "/#results" },
```

to:

```jsx
{ label: "Results", path: "/results" },
```

- [ ] **Step 3: Verify the build**

Run: `cd "/home/devanshu/Online Learning Portal/Frontend" && npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
cd "/home/devanshu/Online Learning Portal"
git add Frontend/src/App.jsx Frontend/src/components/SiteChrome.jsx
git commit -m "Wire up /results route and update nav link"
```

---

### Task 20: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Run lint**

Run: `cd "/home/devanshu/Online Learning Portal/Frontend" && npm run lint`
Expected: no errors in any new `Results/` or `mockData/resultsData.js` file (pre-existing warnings/errors elsewhere in the repo are out of scope).

- [ ] **Step 2: Run production build**

Run: `cd "/home/devanshu/Online Learning Portal/Frontend" && npm run build`
Expected: build succeeds, no errors.

- [ ] **Step 3: Visual check on the dev server**

Run: `cd "/home/devanshu/Online Learning Portal/Frontend" && npm run dev`
Then open `http://localhost:5173/results` in a browser and check:
- All 13 sections render in order with no console errors.
- Nav bar "Results" link (from any page) navigates to `/results` and highlights as active.
- "View Our Achievers" hero CTA smooth-scrolls to Top Achievers.
- Year-wise Results tabs update the 5 metrics when clicked.
- 80%+ Achievers filters (Year/Class/%Range/Stream) narrow the grid, and show the "no achievers match" message when a combination yields zero results.
- Growth chart renders a bar per year with a working tooltip.
- Footer "Results" quick link also points to `/results`.

- [ ] **Step 4: Stop the dev server** (Ctrl+C) — no commit needed for this task.
