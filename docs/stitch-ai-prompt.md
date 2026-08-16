# Stitch AI Prompt — Student Dashboard Redesign

**Role:** You are a senior product designer creating the UI for the **Student (Learner) Dashboard** of an online learning platform. The dashboard is a web app built with React 19 + Tailwind CSS v4. Your output must be clean, modern, professional, and highly usable.

**Project context**
This is the redesign of an existing student page. Today it is a single-page dashboard with a sidebar that switches between 5 sections: Syllabus (my courses), Material (study files), Test (available tests + results), Progress (analytics), and Profile (account + streak). The page is desktop-first with a left sidebar; on mobile/tablet the sidebar becomes a slide-out drawer opened from a hamburger icon in the sticky header. There is also a separate full-screen Test Taking page with a countdown timer and multiple-choice/free-text questions.

**Important: The redesign MUST use a top navigation bar** — all navigation lives in a horizontal bar at the top of the page (below the sticky header), NOT a left sidebar and NOT a mobile drawer. The top nav is the single source of navigation on all screen sizes; on mobile it scrolls horizontally and wraps gracefully.

**Design goals (in priority order)**
1. Clean, calm, professional aesthetic — generous white space, soft shadows, subtle borders, consistent rounded corners. No clutter, no aggressive gradients.
2. A welcoming Dashboard overview must be the first thing a student sees (currently the syllabus is the default landing, which is wrong).
3. Clear visual hierarchy: typography, color and spacing should guide the eye.
4. All data must be presented at a glance — students should understand their progress, next class, and pending work in under 5 seconds.
5. Fully responsive: mobile, tablet, desktop. Touch-friendly targets on mobile (min 44px).
6. Accessible: WCAG AA contrast, keyboard navigation, focus states, `prefers-reduced-motion` support.
7. Consistent component system so the design is repeatable across other portals (Teacher, Admin, Parent).

**Design system to use**
- Typography: **Roboto** for body/UI, **Slabo 27px** for headings.
- Colors: primary blue `#004ac6`, secondary indigo `#4b41e1`, soft surface background `#f7f9fb`, near-black text `#191c1e`, success green, warning amber, danger red used sparingly and meaningfully.
- Style language: white cards on a light gray page background, `rounded-2xl`, `shadow-lg` (soft), 1px `border-gray-200`, blue accent for primary actions.
- Icons: Material Symbols or Lucide (line icons, consistent stroke weight).
- Spacing: 8px grid; max content width ~1152px; consistent card padding (24px).

**Page structure — Dashboard Overview (default landing)**
1. **Welcome hero strip:** gradient blue/indigo banner with greeting ("Welcome back, Alex!"), today's date, a subtle motivational line, and the student's avatar with online dot on the right.
2. **Quick stats row (4 cards):** Active Courses, Upcoming Classes, Pending Assignments/Tests, Overall Progress % — each with icon, big number, label, small trend indicator.
3. **Two-column content:**
   - Left (2/3): **Continue Learning** — 2–3 course cards with progress bars, "Resume" button; below it **Recent Activity** feed (tests taken, materials viewed, streaks).
   - Right (1/3): **Today's Schedule** (upcoming classes/tests with time chips), **Weekly Streak** (Mon–Sun flame dots), and a **Quick Actions** card (Start a Test, View Material, Message Instructor).
4. **Top navigation bar** — always visible across all sections and screen sizes: Dashboard | My Courses | Material | Tests | Progress | Profile. Active item highlighted (blue filled pill/tab); hover state; horizontally scrollable on mobile (min-tap-target 44px).

**Section specs**
- **My Courses:** grid of course cards (title, instructor, category badge, progress bar, "Resume/Start Course" button). An "+ Add Course" button and "See all" affordance.
- **Material:** list of study files (PDF/image/video icons in colored tiles, name, size, uploaded date, view/download button). Empty state: friendly illustration + CTA.
- **Tests:** two sub-views — *Available Tests* (name, subject, duration, date, "Start Test" button) and *Results* (score %, colored pass/fail, marks, date, per-subject performance bars).
- **Progress:** overall average card with large % and progress bar, subject-wise performance bars, recent test history. Charts should be simple, label-led, and readable without hover.
- **Profile:** avatar with edit camera button, name, bio, email/phone/location, level + progress bar, editable fields in a modal.
- **Test Taking (separate full-screen page):** sticky header with question counter, countdown timer (turns red under 5 min), question text, options as large tappable radio cards or a textarea, "Submit" button, and a progress indicator.

**States to design**
Loading (skeleton shimmer), empty (no courses/material), error (with retry), and all responsive breakpoints (mobile ≤639px, tablet 640–1023px, desktop ≥1024px).

**Behavior notes**
- The top navigation bar is the only navigation. No left sidebar, no hamburger drawer. On mobile it stays at the top and scrolls horizontally; the hero collapses to a compact strip.
- All buttons must be clearly labeled; no icon-only buttons without aria-labels.

**Deliverables**
- A high-fidelity design for the Dashboard Overview plus all 5 sections and the Test Taking page.
- Component library (buttons, cards, stat cards, progress bars, badges, avatar, modals, empty states).
- Responsive views for at least phone + desktop.
- A short rationale of the visual system and spacing choices.
