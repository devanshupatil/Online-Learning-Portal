# Mobile Navbar Hamburger Visibility Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent the mobile hamburger toggle from being squeezed off-screen on narrow phone widths (~360-390px) in all four portal navbars.

**Architecture:** Pure Tailwind CSS class changes to four existing React navbar components — no new files, no state/behavior changes, no breakpoint value changes. Add `min-w-0`/`truncate` to brand text so it shrinks instead of overflowing, `flex-shrink-0` to protect the action-button group and hamburger button, and hide the notification bell below `sm` (640px) on the three navbars that have one.

**Tech Stack:** React 19, Tailwind CSS v4, Vite. No test framework is configured in this project (no Jest/Vitest/RTL) — verification is `npm run lint` plus manual browser responsive-mode checks, per the spec.

**Spec:** `docs/superpowers/specs/2026-08-20-mobile-navbar-hamburger-fix-design.md`

---

### Task 1: Fix AdminNavbar.jsx

**Files:**
- Modify: `Frontend/src/components/Admin/AdminNavbar.jsx`

- [ ] **Step 1: Add `min-w-0` to the brand block and `truncate` to its title/subtitle**

In `Frontend/src/components/Admin/AdminNavbar.jsx`, find (around line 88):

```jsx
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-xl font-bold font-display tracking-tight text-primary leading-tight">
                {t("coachingName") || "EduLearning"}
              </h1>
              <p className="text-xs font-semibold text-on-surface-variant dark:text-gray-400 leading-tight">
                Admin Portal
              </p>
            </div>
          </div>
```

Replace with:

```jsx
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            </div>
            <div className="flex flex-col text-left min-w-0">
              <h1 className="text-xl font-bold font-display tracking-tight text-primary leading-tight truncate">
                {t("coachingName") || "EduLearning"}
              </h1>
              <p className="text-xs font-semibold text-on-surface-variant dark:text-gray-400 leading-tight truncate">
                Admin Portal
              </p>
            </div>
          </div>
```

- [ ] **Step 2: Protect the actions container and hide the notification bell below `sm`**

Find (around line 117):

```jsx
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer relative"
              aria-label="Notifications"
            >
```

Replace with:

```jsx
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer relative"
              aria-label="Notifications"
            >
```

- [ ] **Step 3: Protect the hamburger button from shrinking**

Find (around line 184):

```jsx
            <button
              className="lg:hidden text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
```

Replace with:

```jsx
            <button
              className="lg:hidden flex-shrink-0 text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
```

- [ ] **Step 4: Lint**

Run: `cd "Frontend" && npm run lint`
Expected: No new errors/warnings introduced by this file.

- [ ] **Step 5: Commit**

```bash
git add Frontend/src/components/Admin/AdminNavbar.jsx
git commit -m "fix: prevent hamburger toggle from overflowing on narrow phone widths in AdminNavbar"
```

---

### Task 2: Fix TeacherNavbar.jsx

**Files:**
- Modify: `Frontend/src/components/Teacher/TeacherNavbar.jsx`

- [ ] **Step 1: Add `min-w-0` to the brand block and `truncate` to its title/subtitle**

Find (around line 84):

```jsx
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-xl font-bold font-display tracking-tight text-primary leading-tight">
                {t("coachingName") || "EduLearning"}
              </h1>
              <p className="text-xs font-semibold text-on-surface-variant dark:text-gray-400 leading-tight">
                {t("footerTeacherPortal") || "Teacher Portal"}
              </p>
            </div>
          </div>
```

Replace with:

```jsx
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <div className="flex flex-col text-left min-w-0">
              <h1 className="text-xl font-bold font-display tracking-tight text-primary leading-tight truncate">
                {t("coachingName") || "EduLearning"}
              </h1>
              <p className="text-xs font-semibold text-on-surface-variant dark:text-gray-400 leading-tight truncate">
                {t("footerTeacherPortal") || "Teacher Portal"}
              </p>
            </div>
          </div>
```

- [ ] **Step 2: Protect the actions container and hide the notification bell below `sm`**

Find (around line 113):

```jsx
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer relative"
              aria-label={t("teacherNavNotifications")}
            >
```

Replace with:

```jsx
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer relative"
              aria-label={t("teacherNavNotifications")}
            >
```

- [ ] **Step 3: Protect the hamburger button from shrinking**

Find (around line 180):

```jsx
            <button
              className="lg:hidden text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t("teacherNavToggleMenu")}
            >
```

Replace with:

```jsx
            <button
              className="lg:hidden flex-shrink-0 text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t("teacherNavToggleMenu")}
            >
```

- [ ] **Step 4: Lint**

Run: `cd "Frontend" && npm run lint`
Expected: No new errors/warnings introduced by this file.

- [ ] **Step 5: Commit**

```bash
git add Frontend/src/components/Teacher/TeacherNavbar.jsx
git commit -m "fix: prevent hamburger toggle from overflowing on narrow phone widths in TeacherNavbar"
```

---

### Task 3: Fix ParentNavbar.jsx

**Files:**
- Modify: `Frontend/src/components/Parents/ParentNavbar.jsx`

- [ ] **Step 1: Add `min-w-0` to the brand block and `truncate` to its title/subtitle**

Find (around line 80):

```jsx
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-tertiary shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-xl font-bold font-display tracking-tight text-primary leading-tight">
                {t("parentNavBrand") || "EduLearning"}
              </h1>
              <p className="text-xs font-semibold text-on-surface-variant dark:text-gray-400 leading-tight">
                {t("parentNavPortal") || "Parent Portal"}
              </p>
            </div>
          </div>
```

Replace with:

```jsx
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-tertiary shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <div className="flex flex-col text-left min-w-0">
              <h1 className="text-xl font-bold font-display tracking-tight text-primary leading-tight truncate">
                {t("parentNavBrand") || "EduLearning"}
              </h1>
              <p className="text-xs font-semibold text-on-surface-variant dark:text-gray-400 leading-tight truncate">
                {t("parentNavPortal") || "Parent Portal"}
              </p>
            </div>
          </div>
```

- [ ] **Step 2: Protect the actions container and hide the notification bell below `sm`**

Find (around line 109):

```jsx
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer relative"
              aria-label={t("parentNavNotifications")}
            >
```

Replace with:

```jsx
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer relative"
              aria-label={t("parentNavNotifications")}
            >
```

- [ ] **Step 3: Protect the hamburger button from shrinking**

Find (around line 176):

```jsx
            <button
              className="lg:hidden text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t("parentNavToggleMenu")}
            >
```

Replace with:

```jsx
            <button
              className="lg:hidden flex-shrink-0 text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t("parentNavToggleMenu")}
            >
```

- [ ] **Step 4: Lint**

Run: `cd "Frontend" && npm run lint`
Expected: No new errors/warnings introduced by this file.

- [ ] **Step 5: Commit**

```bash
git add Frontend/src/components/Parents/ParentNavbar.jsx
git commit -m "fix: prevent hamburger toggle from overflowing on narrow phone widths in ParentNavbar"
```

---

### Task 4: Fix LearnerNavbar.jsx

**Files:**
- Modify: `Frontend/src/components/Leraners/LearnerNavbar.jsx`

This file has no notification bell, help button, divider, or profile avatar — skip that step here. The brand wrapper is a `Link`, not a `div`, and the title/subtitle are `<span>` elements. The `Link` is also nested one level deeper here than in the other three navbars: the actual direct flex item of the top-row container is the `<div className="flex items-center gap-6">` that wraps both the `Link` and the desktop `<nav>`, so that wrapper needs `min-w-0` too — not just the `Link` and inner text div.

- [ ] **Step 1: Add `min-w-0` to the brand wrapper, the `Link`, and `truncate` to its title/subtitle spans**

Find (around line 91):

```jsx
          <div className="flex items-center gap-6">
            <Link
              className="flex items-center gap-3 group"
              to="/learners"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">school</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-display text-xl font-bold text-primary leading-tight tracking-tight">
                  {t("coachingName") || "EduLearning"}
                </span>
                <span className="text-xs font-semibold text-on-surface-variant dark:text-gray-400 leading-tight">
                  {t("footerStudentPortal") || "Student Portal"}
                </span>
              </div>
            </Link>
```

Replace with:

```jsx
          <div className="flex items-center gap-6 min-w-0">
            <Link
              className="flex items-center gap-3 group min-w-0"
              to="/learners"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">school</span>
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="font-display text-xl font-bold text-primary leading-tight tracking-tight truncate">
                  {t("coachingName") || "EduLearning"}
                </span>
                <span className="text-xs font-semibold text-on-surface-variant dark:text-gray-400 leading-tight truncate">
                  {t("footerStudentPortal") || "Student Portal"}
                </span>
              </div>
            </Link>
```

- [ ] **Step 2: Protect the actions container from shrinking**

Find (around line 112):

```jsx
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2">
              <LanguageSwitcher />
            </div>
```

Replace with:

```jsx
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-2">
              <LanguageSwitcher />
            </div>
```

- [ ] **Step 3: Protect the hamburger button from shrinking**

Find (around line 129):

```jsx
            <button
              className="lg:hidden text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t("learnerNavToggleMenu")}
            >
```

Replace with:

```jsx
            <button
              className="lg:hidden flex-shrink-0 text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t("learnerNavToggleMenu")}
            >
```

- [ ] **Step 4: Lint**

Run: `cd "Frontend" && npm run lint`
Expected: No new errors/warnings introduced by this file.

- [ ] **Step 5: Commit**

```bash
git add "Frontend/src/components/Leraners/LearnerNavbar.jsx"
git commit -m "fix: prevent hamburger toggle from overflowing on narrow phone widths in LearnerNavbar"
```

---

### Task 5: Manual cross-navbar verification

**Files:** None (verification only — no code changes)

- [ ] **Step 1: Start the dev server**

Run: `cd "Frontend" && npm run dev`
Expected: Vite dev server starts, prints a local URL (e.g. `http://localhost:5173`).

- [ ] **Step 2: Verify each navbar at each narrow width**

Using browser dev tools responsive/device mode, for each of the four routes/portals (Admin, Teacher, Parent, Learner dashboards) and each width **360px, 375px, 390px, 430px**, confirm:
- Brand title/subtitle truncate with an ellipsis rather than overflowing or wrapping.
- On Admin, Teacher, and Parent: the notification bell is hidden below 640px width.
- The hamburger button is fully visible, not clipped, and clickable at every listed width.
- Clicking the hamburger opens the mobile drawer correctly, and clicking the close button / overlay closes it (confirms no regression to existing drawer behavior).

- [ ] **Step 3: Spot-check no regression above the `lg` breakpoint**

At a desktop width (e.g. 1280px) for each of the four portals, confirm the full horizontal nav row still shows (no hamburger, no drawer) exactly as before — i.e. the `lg:hidden`/`hidden lg:block` behavior is unchanged.

- [ ] **Step 4: Report result**

If any check fails, note which portal/width/behavior failed before proceeding — do not mark this task done until all checks in Steps 2 and 3 pass.
