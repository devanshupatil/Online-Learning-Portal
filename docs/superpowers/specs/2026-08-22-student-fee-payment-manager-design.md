# Student Fee Payment Manager — Design Spec

Date: 2026-08-22
Status: Approved (architecture), pending spec review

## 1. Goal

Let admins track which students have paid their fees, how much each still owes,
and record payments. Let students see their own fee status and view/download
receipts for payments already made.

This is a demo-frontend feature, consistent with the rest of the app: no
backend/DB is connected (`Frontend/src/mockData/mockFetch.js` intercepts
`fetch()` and serves in-memory mock data — see its header comment). All fee
state lives in a new in-memory mock store, following the existing
`attendanceStore` / `studyMaterials` pattern.

## 2. Scope decisions (from brainstorming)

- **Fee structure**: each student has one total fee, split into 3 fixed
  installments (Term 1/2/3), each with its own due date, amount, and status.
  No per-item fee types (tuition/exam/material) — out of scope.
- **Admin can record payments**, not just view. Recording a payment mutates
  the shared mock store, so it's reflected live in the demo (mirrors how
  attendance/materials actions already work).
- **Receipt**: on-screen receipt view + a "Download" button. Download uses
  `window.print()` on a print-styled receipt (the user picks "Save as PDF" in
  the browser print dialog) — no new dependency. No PDF library (jsPDF etc.)
  is added.
- **Identity link**: the Learner dashboard's mock "current student" (today a
  generic, unlinked "Alex Johnson" persona) is treated as `DIR001` (Aarav
  Sharma) from `STUDENTS_DIRECTORY` — the same student already used as
  `PARENT_CHILD` elsewhere in mock data. This makes the demo coherent: admin
  marks DIR001's installment paid → student's own Fees tab shows it paid,
  because both read from the same `feeStore`.
- **No real auth changes** — this doesn't touch `AdminAuthContext` or add any
  student login/session system. The student-side link to DIR001 is a fixed
  mock constant, same spirit as `Material.jsx`'s hardcoded `student123`.
- **i18n**: Admin section body copy is hardcoded English strings, matching the
  existing convention in `AdminDashboard.jsx` (only sidebar nav labels are
  translated there). Learner-side nav label and page title/subtitle follow the
  Learner convention of translated strings (e.g. `learnerNavFees`,
  `learnerFeesPageTitle`) added to `en.json`/`hi.json`/`mr.json`; installment
  labels ("Term 1") and status words stay as plain constants (matching the
  mixed-translation style already present in `TestResults.jsx` vs
  `ProgressTracking.jsx`).

## 3. Data model

`Frontend/src/mockData/feesData.js` (new file, mirrors `resultsData.js`):

```js
// One installment
{
  id: 'DIR001-T1',
  label: 'Term 1',
  dueDate: '2025-06-15',
  amount: 30000,
  status: 'paid' | 'pending' | 'overdue',
  paidAmount: 30000,       // 0 until paid
  paidDate: '2025-06-10',  // null until paid
  method: 'UPI',           // null until paid
  receiptNo: 'RCPT-DIR001-T1', // null until paid
}

// One student's fee record
{
  student_id: 'DIR001',
  name: 'Aarav Sharma',      // denormalized for admin table display/search
  class: 'Class A',
  totalFee: 90000,
  installments: [ /* 3 installments */ ],
}
```

`status` per installment is derived at seed time and recomputed on payment:
`paid` if `paidAmount >= amount`; else `overdue` if `dueDate` is in the past;
else `pending`. A student's overall status (used for the admin table badge)
is: `paid` if all 3 installments paid, `overdue` if any installment is
overdue, else `pending`.

`seedFeeRecords()` in `feesData.js` builds one record per entry in
`STUDENTS_DIRECTORY` (12 students) with a realistic mixed spread: a few fully
paid, several partially paid (Term 1 paid, Term 2/3 pending or overdue based
on today's date), a couple fully unpaid/overdue. Deterministic (no `Math.random`
for status assignment) so the demo looks the same on every load — matches
`resultsData.js`'s style of hand-authored realistic mock rows rather than
`seedAttendanceHistory()`'s randomized approach.

`STUDENT_SELF_ID = 'DIR001'` exported from `feesData.js` — the constant the
Learner Fees tab uses to look up "my" record.

## 4. Mock API (mockFetch.js)

New module-level store: `let feeRecords = seedFeeRecords();`

New routes, following the existing regex-route-table pattern:

- `GET /api/fees` → `{ data: feeRecords }` (admin list — summary + status per
  student, used by the admin table and stat cards).
- `GET /api/fees/:studentId` → `{ data: <single record> }` (detail — used by
  both the admin drill-down modal and the Learner Fees tab).
- `POST /api/fees/:studentId/pay` → body `{ installmentId, amount, method,
  date }`. Finds the installment, sets `paidAmount`, `paidDate`, `method`,
  generates `receiptNo` if not already set, recomputes status. Returns the
  updated record. Mutates `feeRecords` in place (same pattern as the
  `attendance` POST handler).

No DELETE/edit-payment route — out of scope (matches "record payments"
approval, not "manage a payment ledger").

## 5. Admin UI

- `Frontend/src/components/Admin/AdminSidebar.jsx` — add `{ id: 'fees', label:
  t('adminSidebarFees'), icon: Wallet }` between `users` and `courses`. Add
  `adminSidebarFees` key to the 3 locale files (sidebar labels are translated
  there, unlike section bodies).
- `Frontend/src/components/Admin/sections/FeesManager.jsx` (new) — rendered
  when `activeSection === 'fees'` in `AdminDashboard.jsx`, fetched via
  `mockFetch('/api/fees')` in a `useEffect`, same loading pattern as the
  existing `users`/`courses` tabs in that file.
  - Stat cards row: Total Students, Fully Paid, Pending, Overdue, Total
    Collected (₹), Total Outstanding (₹) — computed client-side from the
    fetched records, same stat-card visual pattern already used elsewhere in
    `AdminDashboard.jsx`.
  - Search input (by name) + status filter pills (All/Paid/Pending/Overdue) —
    mirrors the existing Users tab's search/filter block.
  - Table: Name, Class, Total Fee, Paid, Remaining, Status badge. Row click
    opens the detail view.
- `Frontend/src/components/Admin/sections/FeeDetailModal.jsx` (new) — shown on
  row click. Lists the 3 installments (due date, amount, status). Each
  unpaid/overdue installment has a "Record Payment" button opening an inline
  form (amount pre-filled to the installment's remaining amount, method
  select: Cash/UPI/Card/Bank Transfer, date defaulting to today). Submitting
  calls `POST /api/fees/:studentId/pay`, updates local state with the
  response, closes the form.

## 6. Student UI

- `Frontend/src/components/Leraners/LearnerNavbar.jsx` — add `{ id: 'fees',
  labelKey: 'learnerNavFees', icon: 'payments' }` after `progress`.
- `Frontend/src/components/Leraners/NewLearnerDashboard.jsx` — add
  `activeSection === 'fees'` block rendering `<FeesSection />`, same pattern
  as the existing `progress`/`profile` blocks.
- `Frontend/src/components/Leraners/sections/FeesSection.jsx` (new) — fetches
  `GET /api/fees/DIR001` (`STUDENT_SELF_ID`) on mount.
  - Summary card: total fee, paid, remaining, overall status badge — same
    card treatment as other Learner summary cards (e.g. `WeeklyStreakIndicator`).
  - List of 3 installments: label, due date, amount, status badge. Paid
    installments show a "View Receipt" button; unpaid ones show "Due on
    <date>" (or "Overdue" styling if past due) with no action (payment
    initiation from the student side is out of scope — matches the brainstorm
    answer that this is a *status + receipt* view, not a payment gateway).
- `Frontend/src/components/Leraners/sections/FeeReceipt.jsx` (new) — modal
  opened by "View Receipt". Shows receipt no., student name, class,
  installment label, amount, paid date, method, and institute name/branding
  (reuse whatever the app already uses elsewhere, e.g. footer branding in
  `SiteChrome.jsx`). "Download" button calls `window.print()`; the modal has a
  `print:` Tailwind-styled layout (hide navbar/overlay chrome, show only the
  receipt block) via a dedicated print stylesheet class, same technique as
  browsers' standard print-CSS approach — no new dependency.

## 7. Files touched

New:
- `Frontend/src/mockData/feesData.js`
- `Frontend/src/components/Admin/sections/FeesManager.jsx`
- `Frontend/src/components/Admin/sections/FeeDetailModal.jsx`
- `Frontend/src/components/Leraners/sections/FeesSection.jsx`
- `Frontend/src/components/Leraners/sections/FeeReceipt.jsx`

Modified:
- `Frontend/src/mockData/mockFetch.js` — new store + 3 routes
- `Frontend/src/components/Admin/AdminSidebar.jsx` — new nav item
- `Frontend/src/components/Admin/AdminDashboard.jsx` — new `activeSection` branch
- `Frontend/src/components/Leraners/LearnerNavbar.jsx` — new nav item
- `Frontend/src/components/Leraners/NewLearnerDashboard.jsx` — new `activeSection` branch
- `Frontend/src/i18n/locales/en.json`, `hi.json`, `mr.json` — new Learner-side keys

## 8. Error handling

All mock fetches follow the existing pattern elsewhere in the app: a loading
state, and on fetch failure a toast (`sonner`, already used in `LoginForm.jsx`
etc.) — no new error-handling pattern introduced. `POST /pay` validates
`amount > 0` and `amount <= remaining` client-side before submitting (mock
backend doesn't re-validate, consistent with the other mock POST handlers
which trust the caller).

## 9. Verification plan

- `bun run lint` on all new/changed files.
- `bun run build` to confirm no build errors.
- Launch dev server, drive both flows in a real headless browser (Admin: mark
  an installment paid, confirm stat cards/table update; Student: confirm the
  same installment now shows paid on the Fees tab, open and print-preview the
  receipt) — same verification approach used for the Results page work.
