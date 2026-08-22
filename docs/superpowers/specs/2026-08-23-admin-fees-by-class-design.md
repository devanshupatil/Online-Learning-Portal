# Admin Fees — Browse by Class — Design Spec

Date: 2026-08-23
Status: Approved (architecture), pending spec review

## 1. Goal

Expand the admin Fee Management feature (built 2026-08-22, see
`2026-08-22-student-fee-payment-manager-design.md`) to cover the whole
coaching institute — Class 1 through Class 12 plus the JEE, NEET, and CET
competitive-exam streams — instead of just the 12 students it covers today.
Admin browses **Classes → that class's student fees**, rather than one flat
table of 12 students.

This builds directly on the existing feature: the installment/record data
shape, the mock API (`GET /api/fees`, `GET /api/fees/:id`,
`POST /api/fees/:id/pay`), the payment-recording modal, and the student-side
Fees tab are all unchanged. Only the roster size/shape and the admin-side
navigation change.

## 2. Scope decisions (from brainstorming)

- **15 classes**: `Class 1`...`Class 12`, `JEE`, `NEET`, `CET`.
- **20 students per class** (300 total). Hand-authoring 300 records like the
  original 12 is impractical, so the roster is **generated programmatically**
  by a deterministic formula (name pools + index-based pairing + 5 fixed
  payment patterns) — not `Math.random`, so the demo still looks identical on
  every reload, matching the existing convention.
- **Fee varies by class tier** (5 tiers, 3 equal installments each):
  - Class 1–5: ₹36,000 total (₹12,000/installment)
  - Class 6–8: ₹54,000 total (₹18,000/installment)
  - Class 9–10: ₹72,000 total (₹24,000/installment)
  - Class 11–12: ₹90,000 total (₹30,000/installment) — unchanged from today
  - JEE / NEET / CET: ₹1,20,000 total (₹40,000/installment)
  - Installment due dates stay the same fixed calendar dates for everyone
    (T1 2026-06-15, T2 2026-10-15, T3 2027-02-15) — only the amount varies.
- **Two-level admin UI**: a Classes grid (15 cards) is the new default Fees
  view; clicking a class drills into that class's student table (today's
  table/search/filter/stat-cards, scoped to ~20 students) with a back button.
- **Search stays per-class** — no global cross-class search, to keep scope
  contained (an admin browses by class, as requested; a "search my whole
  institute for one student" feature wasn't asked for).
- **The linked self-student** (Aarav Sharma, `DIR001` — the one the Learner
  Fees tab reads via `STUDENT_SELF_ID`) moves into `Class 12` and keeps his
  exact existing payment history (Term 1 paid ₹30,000 on 2026-06-10 via UPI),
  so the already-verified student-side receipt flow is untouched.
- **No changes to `mockFetch.js`** — its 3 routes operate generically on
  `feeRecords` regardless of array size or which `class` values appear, so
  nothing there needs to change.
- **No changes to `FeeDetailModal.jsx`** — it already takes a single `record`
  prop and works the same regardless of which class the record belongs to.

## 3. Data model additions

In `Frontend/src/mockData/feesData.js`:

```js
export const CLASS_LIST = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
  'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12',
  'JEE', 'NEET', 'CET',
];

const CLASS_TOTAL_FEE = (className) => {
  const n = Number(className.replace('Class ', ''));
  if (className.startsWith('Class') && n <= 5) return 36000;
  if (className.startsWith('Class') && n <= 8) return 54000;
  if (className.startsWith('Class') && n <= 10) return 72000;
  if (className.startsWith('Class')) return 90000; // 11–12
  return 120000; // JEE / NEET / CET
};
```

### Roster generation

- `FIRST_NAMES` (20) and `LAST_NAMES` (20) pools, reusing names/surnames
  already present elsewhere in this app's mock data (Aarav, Ananya, Diya,
  Ishaan, Kabir, Myra, Kiara, Aadhya, Arjun, Sai, Sneha, Pooja, Riya, Neha,
  Rohan, Priya, Rahul, Isha, Vivaan, Aditya / Sharma, Mehta, Kapoor, Gupta,
  Verma, Malhotra, Iyer, Nair, Reddy, Joshi, Menon, Pillai, Deshmukh,
  Kulkarni, Patil, Shinde, Jadhav, Pawar, Bhosale, Chavan).
- For class index `c` (0–14) and student index `s` (0–19) within that class:
  `firstName = FIRST_NAMES[s]`, `lastName = LAST_NAMES[(s + c * 7) % 20]`.
  Since `gcd(7, 20) = 1`, `(s + c*7) % 20` is a bijection over `s` for fixed
  `c` — every class gets all 20 first names paired with 20 distinct last
  names (no duplicate full name **within** a class); different classes get
  different pairings so most names differ across classes too (occasional
  cross-class repeats are fine for a demo — not a correctness requirement).
- `student_id`: `${PREFIX}-${String(s + 1).padStart(2, '0')}`, where `PREFIX`
  is `C1`...`C12` for grade classes and `JEE`/`NEET`/`CET` for the streams
  (e.g. `C1-01`, `C12-20`, `JEE-05`).
- **Payment pattern by `s % 5`** (so each class gets 4 students in each of
  the 5 shapes — the same shapes the original 12-student set used):
  - `0`: fully paid (T1, T2, T3 all paid in full).
  - `1`: fully unpaid (T1 is now overdue since its due date has passed; T2/T3
    pending).
  - `2`: T1 paid in full, T2 paid half its amount (partial), T3 unpaid.
  - `3`: T1 paid in full only, T2/T3 unpaid (pending — not yet due).
  - `4`: T1 paid one-third its amount (partial, but overdue since its due
    date passed), T2/T3 unpaid.
  - For a "paid" leg, `paidDate = addDays(dueDate, -5)` (a small local
    `addDays` helper — no per-record literal date strings needed) and
    `method` cycles through `['UPI', 'Cash', 'Card', 'Bank Transfer']` by
    `(c + s) % 4`. `receiptNo` follows the existing rule,
    `RCPT-${installment.id}` (same rule `POST /api/fees/:id/pay` already
    uses for a first payment, so seed-time and runtime receipt numbers stay
    consistent).
- **Self-student override**: after generating `Class 12`'s 20 students, index
  0 is overwritten with an explicit record: `student_id: 'DIR001'`,
  `name: 'Aarav Sharma'`, `class: 'Class 12'`, Term 1 paid ₹30,000 on
  2026-06-10 via UPI (`receiptNo: 'RCPT-DIR001-T1'`), Term 2/3 pending —
  identical to his current record, just relabeled from `'Class A'` to
  `'Class 12'`. `STUDENT_SELF_ID` stays `'DIR001'`.

`seedFeeRecords()` returns the flattened 300-record array (15 classes × 20
students, with the one override applied).

## 4. Admin UI restructure

- `Frontend/src/components/Admin/sections/FeesManager.jsx` becomes a thin
  container: fetches `GET /api/fees` once (all 300 records, same as today —
  no API change), holds `selectedClass` state (`null` = classes view), and
  renders either `ClassesGrid` or `ClassFeeTable`. Also owns the
  `handlePaymentRecorded` update (unchanged logic, still patches the fetched
  array in place by `student_id`).
- `Frontend/src/components/Admin/sections/ClassesGrid.jsx` (new): a slim
  summary bar (total students across all classes, total collected, total
  outstanding) above a 15-card grid (same stat-card visual pattern already
  used elsewhere in the admin dashboard). Each card shows the class name,
  student count, and a compact paid/pending/overdue breakdown for that class
  only. Clicking a card calls `onSelectClass(className)`.
- `Frontend/src/components/Admin/sections/ClassFeeTable.jsx` (new): today's
  stat cards + search input + status filter + student table + row-click →
  `FeeDetailModal`, unchanged in behavior, but its input is pre-filtered to
  `records.filter(r => r.class === selectedClass)` and it renders a
  "← Back to Classes" button above the header that calls `onBack()`. This is
  the body that used to live directly in `FeesManager.jsx` — extracted
  as-is, just parameterized by `records`/`onBack` instead of doing its own
  fetch.
- `FeeDetailModal.jsx`: **no changes**.

## 5. Files touched

Modified:
- `Frontend/src/mockData/feesData.js` — add `CLASS_LIST`, class-tier fee
  logic, and replace the 12-record hand-authored `seedFeeRecords()` with the
  300-record generator described above.
- `Frontend/src/components/Admin/sections/FeesManager.jsx` — rewritten as
  the thin container described in §4.

New:
- `Frontend/src/components/Admin/sections/ClassesGrid.jsx`
- `Frontend/src/components/Admin/sections/ClassFeeTable.jsx`

Untouched:
- `Frontend/src/mockData/mockFetch.js` (routes are already generic)
- `Frontend/src/components/Admin/sections/FeeDetailModal.jsx`
- Everything on the Learner/student side (`FeesSection.jsx`, `FeeReceipt.jsx`,
  `LearnerNavbar.jsx`, `NewLearnerDashboard.jsx`, i18n keys) — the self-student
  record shape is unchanged, only its `class` label changes from `'Class A'`
  to `'Class 12'`, which those components already render generically.

## 6. Verification plan

Same approach as the original feature: `bun run lint`, `bun run build`, then
a real headless-browser pass — load the admin Fees tab, confirm the Classes
grid renders all 15 cards with correct counts/totals, click into a couple of
classes (including Class 12, to re-verify Aarav Sharma's record survived the
move), record a payment in a class other than Class 12 and confirm that
class's card updates on the way back out, and re-check the Learner Fees tab
still shows Aarav Sharma's Class 12 record correctly (no regression).
