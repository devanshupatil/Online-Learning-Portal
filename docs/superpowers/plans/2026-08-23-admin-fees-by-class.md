# Admin Fees Browse-by-Class Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the admin Fee Management feature from 12 hand-authored students to the whole coaching institute (Class 1–12 + JEE/NEET/CET, 20 students each = 300), with a two-level Classes-grid → class-student-table navigation.

**Architecture:** `feesData.js`'s `seedFeeRecords()` is rewritten to generate 300 records deterministically (name pools + index-based pairing + 5 fixed payment patterns, no `Math.random`) instead of listing 12 by hand. `FeesManager.jsx` becomes a thin container (fetch once, hold `selectedClass` state) that renders either a new `ClassesGrid.jsx` (15 cards) or a new `ClassFeeTable.jsx` (today's stat-cards/search/filter/table body, extracted as-is and parameterized by the selected class's records). `mockFetch.js`, `FeeDetailModal.jsx`, and everything on the Learner side are untouched — the record shape doesn't change, only its scale and per-class fee amounts.

**Tech Stack:** Same as the existing fee feature (React, Tailwind Material-3 tokens, mock API in `mockFetch.js`). No new dependencies.

**Testing note:** Same as the original fee feature — no test runner in this project; verification is lint + build + a real headless-browser pass (Task 5).

**Correction from spec during planning:** The spec's payment-pattern helper used `paidDate = addDays(dueDate, -5)` per installment. For the "fully paid" pattern, that means T2/T3's paid dates land on their own due dates minus 5 days (e.g. 2026-10-10, 2027-02-10) — which, viewed on today's date, would show a receipt for a payment that "hasn't happened yet." This plan instead uses **3 fixed early-payment dates** (`T1: 2026-06-10`, `T2: 2026-07-10`, `T3: 2026-08-10`) for whichever installments a pattern pays — all safely in the past, no `addDays` helper needed at all (simpler than the spec's version, same deterministic intent).

---

## Task 1: Rewrite feesData.js for the 300-student roster

**Files:**
- Modify: `Frontend/src/mockData/feesData.js`

- [ ] **Step 1: Replace the entire file**

```js
// Mock fee data for the Student Fee Payment Manager, covering the whole
// coaching institute (Class 1-12 + JEE/NEET/CET). Generated deterministically
// (not Math.random) so the demo looks the same on every load — see
// seedFeeRecords() below for how the 300 records are built.

export const STUDENT_SELF_ID = 'DIR001';

export const CLASS_LIST = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
  'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12',
  'JEE', 'NEET', 'CET',
];

const TERM_DUE_DATES = {
  T1: '2026-06-15',
  T2: '2026-10-15',
  T3: '2027-02-15',
};

// Fixed early-payment dates for whichever installments a pattern pays —
// safely in the past regardless of which installment, so a "fully paid"
// record never shows a payment date that looks like it hasn't happened yet.
const EARLY_PAID_DATES = { T1: '2026-06-10', T2: '2026-07-10', T3: '2026-08-10' };

const classTotalFee = (className) => {
  if (className.startsWith('Class')) {
    const n = Number(className.slice('Class '.length));
    if (n <= 5) return 36000;
    if (n <= 8) return 54000;
    if (n <= 10) return 72000;
    return 90000; // Class 11-12
  }
  return 120000; // JEE / NEET / CET
};

const classPrefix = (className) =>
  className.startsWith('Class') ? `C${className.slice('Class '.length)}` : className;

export const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export const deriveInstallmentStatus = (installment) => {
  if (installment.paidAmount >= installment.amount) return 'paid';
  const today = new Date().toISOString().slice(0, 10);
  return installment.dueDate < today ? 'overdue' : 'pending';
};

export const deriveOverallStatus = (record) => {
  if (record.installments.every((i) => i.status === 'paid')) return 'paid';
  if (record.installments.some((i) => i.status === 'overdue')) return 'overdue';
  return 'pending';
};

export const getPaidTotal = (record) =>
  record.installments.reduce((sum, i) => sum + i.paidAmount, 0);

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Ananya', 'Diya', 'Ishaan', 'Kabir', 'Myra',
  'Kiara', 'Aadhya', 'Arjun', 'Sai', 'Sneha', 'Pooja', 'Riya', 'Neha',
  'Rohan', 'Priya', 'Rahul', 'Isha',
];

const LAST_NAMES = [
  'Sharma', 'Mehta', 'Kapoor', 'Gupta', 'Verma', 'Malhotra', 'Iyer', 'Nair',
  'Reddy', 'Joshi', 'Menon', 'Pillai', 'Deshmukh', 'Kulkarni', 'Patil',
  'Shinde', 'Jadhav', 'Pawar', 'Bhosale', 'Chavan',
];

const PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'Bank Transfer'];

const makeInstallment = (studentId, term, amount, overrides = {}) => {
  const base = {
    id: `${studentId}-${term}`,
    label: `Term ${term.slice(1)}`,
    dueDate: TERM_DUE_DATES[term],
    amount,
    paidAmount: 0,
    paidDate: null,
    method: null,
    receiptNo: null,
    ...overrides,
  };
  return { ...base, status: deriveInstallmentStatus(base) };
};

const makeRecord = (studentId, name, className, installmentOverrides) => {
  const amount = classTotalFee(className) / 3;
  return {
    student_id: studentId,
    name,
    class: className,
    totalFee: amount * 3,
    installments: ['T1', 'T2', 'T3'].map((term) =>
      makeInstallment(studentId, term, amount, installmentOverrides[term] || {})
    ),
  };
};

// 5 fixed payment patterns, cycled by student index within a class, so
// every class gets an even, varied mix (paid / overdue / partial / etc.)
// without any randomness — same shapes as the original 12-student set.
const paymentOverridesForPattern = (pattern, studentId, amount, method) => {
  const paidLeg = (term, fraction = 1) => ({
    paidAmount: Math.round(amount * fraction),
    paidDate: EARLY_PAID_DATES[term],
    method,
    receiptNo: `RCPT-${studentId}-${term}`,
  });
  switch (pattern) {
    case 0: // fully paid
      return { T1: paidLeg('T1'), T2: paidLeg('T2'), T3: paidLeg('T3') };
    case 1: // fully unpaid (T1 now overdue)
      return {};
    case 2: // T1 paid, T2 partial
      return { T1: paidLeg('T1'), T2: paidLeg('T2', 0.5) };
    case 3: // T1 paid only
      return { T1: paidLeg('T1') };
    case 4: // T1 partial (overdue, since its due date has passed)
    default:
      return { T1: paidLeg('T1', 1 / 3) };
  }
};

const generateClassRoster = (className, classIndex) => {
  const prefix = classPrefix(className);
  const amount = classTotalFee(className) / 3;
  return Array.from({ length: 20 }, (_, s) => {
    const firstName = FIRST_NAMES[s];
    const lastName = LAST_NAMES[(s + classIndex * 7) % 20];
    const studentId = `${prefix}-${String(s + 1).padStart(2, '0')}`;
    const method = PAYMENT_METHODS[(classIndex + s) % PAYMENT_METHODS.length];
    const overrides = paymentOverridesForPattern(s % 5, studentId, amount, method);
    return makeRecord(studentId, `${firstName} ${lastName}`, className, overrides);
  });
};

export const seedFeeRecords = () => {
  const records = CLASS_LIST.flatMap((className, classIndex) =>
    generateClassRoster(className, classIndex)
  );

  // Self-student override: DIR001 / Aarav Sharma is the identity the
  // Learner Fees tab reads via STUDENT_SELF_ID. He's already established
  // elsewhere in this app's mock data (STUDENTS_BY_STREAM, PARENT_CHILD) as
  // a JEE-stream student, so he's placed in JEE here too (replacing
  // generated slot JEE-01) rather than a numbered class. Term 1 paid in
  // full — ₹40,000, JEE's per-installment amount — so the "paid → view
  // receipt" flow keeps working exactly as already verified.
  const jeeIndex = records.findIndex((r) => r.student_id === 'JEE-01');
  records[jeeIndex] = makeRecord('DIR001', 'Aarav Sharma', 'JEE', {
    T1: { paidAmount: 40000, paidDate: '2026-06-10', method: 'UPI', receiptNo: 'RCPT-DIR001-T1' },
  });

  return records;
};
```

- [ ] **Step 2: Lint the file**

Run: `cd "Frontend" && bun run lint 2>&1 | grep -A5 feesData`
Expected: no output

- [ ] **Step 3: Sanity-check the generated roster from the command line**

Run:
```bash
cd "Frontend" && bun -e "
import('./src/mockData/feesData.js').then(({ seedFeeRecords, CLASS_LIST, deriveOverallStatus, getPaidTotal }) => {
  const records = seedFeeRecords();
  console.log('total records:', records.length); // expect 300
  console.log('classes covered:', new Set(records.map(r => r.class)).size); // expect 15
  console.log('unique student_ids:', new Set(records.map(r => r.student_id)).size); // expect 300
  const jee = records.filter(r => r.class === 'JEE');
  console.log('JEE class size:', jee.length); // expect 20
  const self = records.find(r => r.student_id === 'DIR001');
  console.log('self student:', self.name, self.class, self.totalFee, getPaidTotal(self), deriveOverallStatus(self));
  // expect: Aarav Sharma JEE 120000 40000 pending
  for (const className of CLASS_LIST) {
    const classRecords = records.filter(r => r.class === className);
    const statuses = classRecords.map(deriveOverallStatus);
    console.log(className, classRecords.length, 'paid:', statuses.filter(s => s === 'paid').length, 'pending:', statuses.filter(s => s === 'pending').length, 'overdue:', statuses.filter(s => s === 'overdue').length);
  }
});
"
```
Expected: 300 total records, 15 classes, 300 unique student_ids, JEE class size 20, self student is `Aarav Sharma JEE 120000 40000 pending`, and every class prints counts that sum to 20 (paid+pending+overdue).

- [ ] **Step 4: Commit**

```bash
git add "Frontend/src/mockData/feesData.js"
git commit -m "$(cat <<'EOF'
Expand fee mock data to the full coaching institute

seedFeeRecords() now generates 300 students (Class 1-12 + JEE/NEET/CET, 20 each) deterministically instead of 12 hand-authored records, with per-class-tier fee amounts and 5 cycled payment patterns. The linked self-student (Aarav Sharma) moves from a placeholder "Class A" into JEE, matching his stream elsewhere in this app's mock data.
EOF
)"
```

---

## Task 2: Classes grid — ClassesGrid.jsx

**Files:**
- Create: `Frontend/src/components/Admin/sections/ClassesGrid.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React, { useMemo } from 'react';
import { CLASS_LIST, formatCurrency, deriveOverallStatus, getPaidTotal } from '../../../mockData/feesData';

const ClassesGrid = ({ records, onSelectClass }) => {
  const summarized = useMemo(
    () => records.map((record) => {
      const paid = getPaidTotal(record);
      return { ...record, status: deriveOverallStatus(record), paid, remaining: record.totalFee - paid };
    }),
    [records]
  );

  const overall = useMemo(() => ({
    totalStudents: summarized.length,
    totalCollected: summarized.reduce((sum, r) => sum + r.paid, 0),
    totalOutstanding: summarized.reduce((sum, r) => sum + r.remaining, 0),
  }), [summarized]);

  const classSummaries = CLASS_LIST.map((className) => {
    const classRecords = summarized.filter((r) => r.class === className);
    return {
      className,
      total: classRecords.length,
      paid: classRecords.filter((r) => r.status === 'paid').length,
      pending: classRecords.filter((r) => r.status === 'pending').length,
      overdue: classRecords.filter((r) => r.status === 'overdue').length,
    };
  });

  return (
    <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-on-surface">Fee Management</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-0.5">Browse fee status by class</p>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Students</p>
            <p className="text-xl font-bold text-on-surface mt-1">{overall.totalStudents}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Collected</p>
            <p className="text-xl font-bold text-on-surface mt-1">{formatCurrency(overall.totalCollected)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Outstanding</p>
            <p className="text-xl font-bold text-on-surface mt-1">{formatCurrency(overall.totalOutstanding)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
        {classSummaries.map((cls) => (
          <button
            key={cls.className}
            onClick={() => onSelectClass(cls.className)}
            className="text-left bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 interactive-card shadow-xs hover:-translate-y-0.5 transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-on-surface">{cls.className}</h3>
              <span className="material-symbols-outlined text-primary text-[22px]">chevron_right</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">{cls.total} students</p>
            <div className="flex justify-between text-center">
              <div>
                <p className="text-sm font-bold text-[#10B981]">{cls.paid}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Paid</p>
              </div>
              <div>
                <p className="text-sm font-bold text-amber-600">{cls.pending}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Pending</p>
              </div>
              <div>
                <p className="text-sm font-bold text-error">{cls.overdue}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Overdue</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClassesGrid;
```

- [ ] **Step 2: Lint the file**

Run: `cd "Frontend" && bun run lint 2>&1 | grep -A5 ClassesGrid`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "Frontend/src/components/Admin/sections/ClassesGrid.jsx"
git commit -m "$(cat <<'EOF'
Add ClassesGrid component for admin fees

Top-level Fees view: an all-classes summary bar plus a 15-card grid (Class 1-12, JEE, NEET, CET), each showing student count and paid/pending/overdue counts, clicking through to that class's student table.
EOF
)"
```

---

## Task 3: Class student table — ClassFeeTable.jsx

**Files:**
- Create: `Frontend/src/components/Admin/sections/ClassFeeTable.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React, { useMemo, useState } from 'react';
import { formatCurrency, deriveOverallStatus, getPaidTotal } from '../../../mockData/feesData';
import FeeDetailModal from './FeeDetailModal';

const STATUS_FILTERS = ['all', 'paid', 'pending', 'overdue'];

const STATUS_BADGE_CLASSES = {
  paid: 'bg-[#10B981]/15 text-[#10B981]',
  pending: 'bg-amber-500/15 text-amber-600',
  overdue: 'bg-error-container text-on-error-container',
};

const ClassFeeTable = ({ classLabel, records, onBack, onPaymentRecorded }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const summarized = useMemo(
    () => records.map((record) => {
      const paid = getPaidTotal(record);
      return { ...record, status: deriveOverallStatus(record), paid, remaining: record.totalFee - paid };
    }),
    [records]
  );

  const stats = useMemo(() => ({
    totalStudents: summarized.length,
    fullyPaid: summarized.filter((r) => r.status === 'paid').length,
    pending: summarized.filter((r) => r.status === 'pending').length,
    overdue: summarized.filter((r) => r.status === 'overdue').length,
    totalCollected: summarized.reduce((sum, r) => sum + r.paid, 0),
    totalOutstanding: summarized.reduce((sum, r) => sum + r.remaining, 0),
  }), [summarized]);

  const filtered = summarized.filter((r) =>
    (statusFilter === 'all' || r.status === statusFilter) &&
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedRecord = summarized.find((r) => r.student_id === selectedStudentId) || null;

  const statCards = [
    { title: 'Total Students', value: stats.totalStudents, icon: 'group', colorClass: 'bg-primary-fixed text-on-primary-fixed' },
    { title: 'Fully Paid', value: stats.fullyPaid, icon: 'check_circle', colorClass: 'bg-primary-container text-on-primary-container' },
    { title: 'Pending', value: stats.pending, icon: 'schedule', colorClass: 'bg-secondary-fixed text-on-secondary-fixed' },
    { title: 'Overdue', value: stats.overdue, icon: 'error', colorClass: 'bg-error-container text-on-error-container' },
    { title: 'Total Collected', value: formatCurrency(stats.totalCollected), icon: 'payments', colorClass: 'bg-tertiary-fixed text-on-tertiary-fixed' },
    { title: 'Total Outstanding', value: formatCurrency(stats.totalOutstanding), icon: 'account_balance_wallet', colorClass: 'bg-error-container text-on-error-container' },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:opacity-80 transition-opacity cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Classes
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
        {statCards.map((card) => (
          <div key={card.title} className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 interactive-card shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-bold text-on-surface mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.colorClass} shadow-xs`}>
                <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant soft-bloom p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-variant">
          <div>
            <h2 className="text-2xl font-bold font-display text-on-surface">{classLabel}</h2>
            <p className="text-sm text-on-surface-variant font-medium mt-0.5">Track student fee status and record payments</p>
          </div>
        </div>

        <div className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-surface-variant/60 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-surface-container-low border border-surface-variant/60 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-surface-variant/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-variant text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Class</th>
                  <th className="py-3.5 px-4">Total Fee</th>
                  <th className="py-3.5 px-4">Paid</th>
                  <th className="py-3.5 px-4">Remaining</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/30 text-sm font-medium text-on-surface">
                {filtered.map((record) => (
                  <tr
                    key={record.student_id}
                    onClick={() => setSelectedStudentId(record.student_id)}
                    className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-bold">{record.name}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{record.class}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{formatCurrency(record.totalFee)}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{formatCurrency(record.paid)}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{formatCurrency(record.remaining)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_BADGE_CLASSES[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedRecord && (
        <FeeDetailModal
          record={selectedRecord}
          onClose={() => setSelectedStudentId(null)}
          onPaymentRecorded={onPaymentRecorded}
        />
      )}
    </div>
  );
};

export default ClassFeeTable;
```

- [ ] **Step 2: Lint the file**

Run: `cd "Frontend" && bun run lint 2>&1 | grep -A5 ClassFeeTable`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "Frontend/src/components/Admin/sections/ClassFeeTable.jsx"
git commit -m "$(cat <<'EOF'
Add ClassFeeTable component for admin fees

Extracted from the original FeesManager body (stat cards + search/filter/table + record-payment modal), now parameterized by a class's records instead of owning its own fetch, with a Back to Classes control.
EOF
)"
```

---

## Task 4: Rewrite FeesManager.jsx as a thin container

**Files:**
- Modify: `Frontend/src/components/Admin/sections/FeesManager.jsx`

- [ ] **Step 1: Replace the entire file**

```jsx
import React, { useEffect, useState } from 'react';
import { mockFetch } from '../../../mockData/mockFetch';
import ClassesGrid from './ClassesGrid';
import ClassFeeTable from './ClassFeeTable';

const FeesManager = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  const fetchFees = async () => {
    try {
      const response = await mockFetch(`${URL}/api/fees`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setRecords(data.data || []);
    } catch (error) {
      console.error('Error fetching fee records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handlePaymentRecorded = (updatedRecord) => {
    setRecords((prev) => prev.map((r) => (r.student_id === updatedRecord.student_id ? updatedRecord : r)));
  };

  if (loading) {
    return <p className="text-sm text-on-surface-variant py-8 text-center mt-4 sm:mt-5">Loading fee records...</p>;
  }

  if (selectedClass) {
    return (
      <ClassFeeTable
        classLabel={selectedClass}
        records={records.filter((r) => r.class === selectedClass)}
        onBack={() => setSelectedClass(null)}
        onPaymentRecorded={handlePaymentRecorded}
      />
    );
  }

  return <ClassesGrid records={records} onSelectClass={setSelectedClass} />;
};

export default FeesManager;
```

- [ ] **Step 2: Lint the file**

Run: `cd "Frontend" && bun run lint 2>&1 | grep -A5 FeesManager`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "Frontend/src/components/Admin/sections/FeesManager.jsx"
git commit -m "$(cat <<'EOF'
Restructure FeesManager into Classes-grid / class-table container

FeesManager now only fetches the roster and tracks which class (if any) is selected, rendering ClassesGrid or ClassFeeTable accordingly — the search/filter/table body it used to own directly moved to ClassFeeTable in the previous commit.
EOF
)"
```

---

## Task 5: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Lint the whole frontend**

Run: `cd "Frontend" && bun run lint 2>&1 | tail -5`
Expected: same 503 pre-existing errors as the baseline (see the original fee feature's plan) — zero new errors attributable to any file touched in Tasks 1-4. Warning count may tick up by the same kind of `useEffect` missing-dependency warning already present on `fetchFees` (pre-existing style, unrelated to this change).

- [ ] **Step 2: Build**

Run: `cd "Frontend" && bun run build 2>&1 | tail -20`
Expected: `✓ built in ...s`, no errors.

- [ ] **Step 3: Launch the dev server**

Run: `cd "Frontend" && lsof -ti:5173 -sTCP:LISTEN | xargs -r kill 2>/dev/null; (bun run dev > /tmp/vite-dev.log 2>&1 &) && timeout 30 bash -c 'until curl -sf http://localhost:5173 >/dev/null; do sleep 1; done' && echo "SERVER UP"`
Expected: `SERVER UP`

- [ ] **Step 4: Browser-driven check — Classes grid**

Using Playwright (same approach as the original feature's verification — `bunx playwright` is already installed in `node_modules` from that pass, no need to `bun add` it):

1. Log into `/admin` (demo credentials `admin@example.com` / `admin123`), click the "Fees" tab.
2. Screenshot — verify a summary bar (300 total students) plus a 15-card grid (Class 1–12, JEE, NEET, CET) each showing "20 students" and paid/pending/overdue counts that sum to 20.
3. Click the "JEE" card.
4. Screenshot — verify the class table shows 20 JEE students including "Aarav Sharma" with Total Fee ₹1,20,000, Paid ₹40,000, Remaining ₹80,000, status Pending.
5. Click "Back to Classes", then click a different class (e.g. "Class 1").
6. Record a payment on one of that class's unpaid/overdue installments (same flow as the original feature's verification).
7. Click "Back to Classes" — screenshot and verify that class's card on the grid reflects the updated paid/pending/overdue counts.
8. Check console errors — expect none.

- [ ] **Step 5: Browser-driven check — Learner side regression**

1. Navigate to `/learners`, click "Fees".
2. Screenshot — verify Aarav Sharma's summary now shows Total ₹1,20,000, Paid ₹40,000, Remaining ₹80,000, status Pending, and Term 1 (₹40,000) shows Paid with a working "View Receipt" button showing `RCPT-DIR001-T1`.
3. Check console errors — expect none.

- [ ] **Step 6: Stop the dev server**

Run: `lsof -ti:5173 -sTCP:LISTEN | xargs -r kill`

- [ ] **Step 7: Final review**

Run `git log --oneline -6` and `git status` to confirm all 4 commits from Tasks 1-4 are present, working tree is otherwise clean, and — per explicit user instruction — nothing has been pushed and no new branch was created (`git branch --show-current` should still show `main`).
