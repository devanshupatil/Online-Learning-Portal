# Results Page — Design Spec

Date: 2026-08-15
Status: Approved (architecture), pending spec review

## 1. Goal

Build a dedicated, full-featured "Results" page for EduLearning Platform showcasing
student results/achievers, matching the content outline the user provided (14
sections). This is a marketing/demo page — all data is mock, consistent with the
rest of the frontend (no backend is connected yet).

## 2. Scope decisions (from brainstorming)

- **Build all 14 sections in one pass** (not phased).
- **Skip "Result Verification" (search by name/roll/batch)** — the source spec
  itself says only include it with a real backend, and this project has none.
- **New dedicated route `/results`**, replacing the current `/#results` anchor
  link on the homepage nav.
- **Install `recharts`** for the growth/comparison chart — no charting lib exists
  in the project yet.
- **Student "photos" are `InitialsAvatar` placeholders** (colored circle +
  initials, color derived deterministically from name) — no external avatar
  service, keeps the demo network-independent.

## 3. Routing & file layout

- `Frontend/src/components/Results/ResultsPage.jsx` — top-level page. Renders
  `SiteNav active="Results"`, the 14 section components in order, then
  `SiteFooter`. Mirrors the structure of `AboutPage.jsx`.
- `Frontend/src/components/Results/sections/` — one file per section, in
  render order (see §4 for the same order):
  - `ResultsHero.jsx`
  - `OverallStats.jsx`
  - `YearwiseResults.jsx`
  - `TopAchievers.jsx`
  - `NinetyPlusAchievers.jsx`
  - `EightyPlusAchievers.jsx`
  - `SubjectToppers.jsx`
  - `ClasswiseResults.jsx`
  - `GrowthChart.jsx`
  - `SuccessStories.jsx`
  - `TopperGallery.jsx`
  - `Testimonials.jsx`
  - `FinalCTA.jsx`
  - `AchieverCard.jsx` — shared card used by TopAchievers/NinetyPlusAchievers/EightyPlusAchievers
- `Frontend/src/components/ui/InitialsAvatar.jsx` — reusable avatar component,
  `<InitialsAvatar name="Rahul Patil" size="lg" />`. Deterministic background
  color chosen from a small fixed palette via a hash of the name string.
- `Frontend/src/mockData/resultsData.js` — all mock data for this page (see §5).
- `App.jsx` — add `<Route path="/results" element={<ResultsPage />} />`.
- `SiteChrome.jsx` — change the `Results` entry in `navLinks` from
  `{ label: "Results", path: "/#results" }` to `{ label: "Results", path: "/results" }`.

## 4. Section-by-section content

1. **ResultsHero** — heading "Our Results, Our Pride", subtitle, background
   treatment consistent with `Home.jsx`'s hero section (lines 33-76: Material-3
   tokens, `glass-panel`, gradient text — **not** the unused `HeroSection.jsx`,
   which uses a different, orphaned design system and isn't imported anywhere).
   CTA button "View Our Achievers" that smooth-scrolls to `TopAchievers`, which
   must expose `id="top-achievers"` for the anchor to target.
2. **OverallStats** — 5 large stat cards: 95%+ Pass Rate, 500+ Students Scored
   80%+, 100+ Students Scored 90%+, School/College Toppers count, Years of
   Consistent Results. Same stat-card pattern used in `Home.jsx`'s About section.
3. **YearwiseResults** — pill-tab filter (2025–26 / 2024–25 / 2023–24 / 2022–23);
   selected year shows Total students, Pass %, 80%+ count, 90%+ count, Highest %.
4. **TopAchievers** — one large featured card (e.g. rank-1 topper with big %,
   name, class, year) plus a grid of the next several top achievers.
5. **NinetyPlusAchievers** — grid of student cards: `InitialsAvatar`, name, %,
   class, batch, school/board.
6. **EightyPlusAchievers** — larger grid, with filter controls (Year, Class, %
   range, Stream) implemented as plain styled `<select>`s driving client-side
   filtering of `resultsData.ACHIEVERS_80_PLUS`. Card layout is visually
   consistent with the 90+ cards but renders whichever fields that section's
   data provides (see §5 — 80+ cards show year/stream, not batch/school).
7. **SubjectToppers** — table/grid of Subject → Student → Marks (e.g.
   Mathematics, Science/Physics/Chemistry/Biology, English).
8. **ClasswiseResults** — cards for Class 8–12: appeared, pass %, highest score,
   80%+ count.
9. **GrowthChart** — `recharts` bar or line chart of pass % across the 4
   academic years, single series, simple tooltip. Data is derived directly from
   `RESULTS_BY_YEAR` (mapping `{ year, passPercentage }`) rather than a separate
   dataset, so the chart can never disagree with the Year-wise Results section
   for the same year.
10. **SuccessStories** — 3 detailed stories, each: Student → Challenge →
    Preparation → Result, in a card/timeline layout.
11. **TopperGallery** — "premium gallery" grid of category tiles (School
    Toppers, Class Toppers, Subject Toppers, Prize Distribution) using
    gradient/icon tiles rather than fabricated event photos, since no real
    photos exist.
12. **Testimonials** — short quote cards from students/parents (reuses
    `InitialsAvatar` for attribution).
13. ~~Result Verification~~ — **omitted** (see §2).
14. **FinalCTA** — "Want to Be Our Next Star Achiever?" / "Start your journey
    with Wakhare Classes today." with **Explore Courses** and **Enroll Now**
    buttons linking to `/#courses` and `/#enroll` respectively.

This order (Hero → Stats → Year-wise → Top Achievers → 90%+ → 80%+ → Subject
Toppers → Class-wise → Growth Chart → Success Stories → Gallery → Testimonials →
Final CTA) matches the "Best visual flow" from the original request and is the
single source of truth for both the file list in §3 and the render order in
`ResultsPage.jsx` — no other ordering appears elsewhere in this doc.

All three achiever sections (TopAchievers, NinetyPlusAchievers,
EightyPlusAchievers) render through one shared `AchieverCard` component
(`Results/sections/AchieverCard.jsx`) that accepts `{ name, percentage, class,
...rest }` and displays whichever optional fields (`batch`, `school`, `year`,
`stream`) are present, so the visual language stays identical without forcing a
single rigid schema.

## 5. Mock data shape (`resultsData.js`)

```js
export const RESULTS_OVERALL_STATS = {
  passRate: 95, students80Plus: 500, students90Plus: 100,
  toppers: <N>, yearsConsistent: <N>,
};

export const RESULTS_BY_YEAR = [
  { year: '2025–26', totalStudents, passPercentage, eightyPlusCount, ninetyPlusCount, highestPercentage },
  // ...2024–25, 2023–24, 2022–23
];

export const TOP_ACHIEVERS = [
  { name, percentage, class, year, featured: true|false },
];

export const ACHIEVERS_90_PLUS = [
  { name, percentage, class, batch, school },
];

export const ACHIEVERS_80_PLUS = [
  { name, percentage, class, year, stream, },
];

export const SUBJECT_TOPPERS = [
  { subject, studentName, marks, totalMarks },
];

export const CLASSWISE_RESULTS = [
  { class: 'Class 10', appeared, passPercentage, highestScore, eightyPlusCount },
];

export const SUCCESS_STORIES = [
  { name, challenge, preparation, result },
];

export const RESULT_TESTIMONIALS = [
  { quote, name, role },
];
```

Student names follow the existing convention in `data.js` (Indian names, `STU-`
style not required here since these aren't tied to auth/attendance records).

## 6. Visual language

Reuses the Material-3-token + glass-morphism system already established in
`Home.jsx` / `AboutPage.jsx`: `bg-surface-container-*`, `soft-shadow`,
`glass-panel`, gradient text on headings, alternating section backgrounds,
`hover:-translate-y-1` on cards. No new design system introduced.

## 7. Out of scope

- Real backend / result-verification search (see §2).
- Real student photos (see §2).
- Any change to existing pages other than the `Results` nav link target.
