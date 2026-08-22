# Student Fee Payment Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let admins track student fee/installment status and record payments, and let students view their own fee status and download receipts — as a self-contained mock-data feature matching the rest of this demo frontend.

**Architecture:** New `feesData.js` mock module (data model + seed + shared helpers) feeds a new in-memory store and 3 routes in the existing `mockFetch.js` regex-route table. Two new self-fetching, self-contained UI trees — `Admin/sections/{FeesManager,FeeDetailModal}.jsx` and `Leraners/sections/{FeesSection,FeeReceipt}.jsx` — are wired into the existing `activeSection`-tab-switching pattern already used by `AdminDashboard.jsx`/`AdminNavbar.jsx` and `NewLearnerDashboard.jsx`/`LearnerNavbar.jsx`.

**Tech Stack:** React (existing app), Tailwind (existing Material-3-style token classes: `bg-surface-container-lowest`, `text-on-surface-variant`, etc.), `react-i18next`, `window.print()` for the receipt download (no new dependency).

**Testing note:** This project has no test runner configured (`Frontend/package.json` has no `test` script, no vitest/jest/testing-library installed), and no other feature in the codebase has automated tests — verification is lint + build + a real headless-browser click-through (see how the Results page work in this same session was verified). This plan follows that same convention rather than introducing new test tooling, per YAGNI. Each task ends in a lint check instead of a test run; Task 10 is the full manual/browser verification pass.

**Corrections from the approved spec (found while mapping exact files):** The spec named `AdminSidebar.jsx` and `adminSidebarFees` i18n key for the admin nav — that component is dead code (nothing imports it; `AdminDashboard.jsx` actually renders `AdminNavbar.jsx`, a top tab bar driven by an `adminNavItems` array). This plan wires the new "Fees" tab into `AdminNavbar.jsx` instead. That navbar's labels come from `t(item.id)` falling back to `item.label` when no translation key exists (confirmed: no `en.json` entries exist for `dashboard`/`users`/etc. either, yet they render fine) — so no i18n file changes are needed for the admin nav label, only for the Learner-side nav/page strings as the spec said. Also: the admin drill-down modal receives the already-fetched record as a prop instead of re-fetching `GET /api/fees/:studentId` (the list endpoint already returns full installment detail, so a second fetch would be redundant) — the Learner side still uses that endpoint directly, as specified.

---

## Task 1: Fee mock data module

**Files:**
- Create: `Frontend/src/mockData/feesData.js`

- [ ] **Step 1: Write the file**

```js
// Mock fee data for the Student Fee Payment Manager. Hand-authored (not
// randomized) so the demo looks the same on every load, following the same
// style as resultsData.js. Consumed by mockFetch.js (the shared in-memory
// store) and directly by the Admin/Learner fee components (for the pure
// helpers below).

export const STUDENT_SELF_ID = 'DIR001';

const TERM_DUE_DATES = {
  T1: '2026-06-15',
  T2: '2026-10-15',
  T3: '2027-02-15',
};

const INSTALLMENT_AMOUNT = 30000;
const TOTAL_FEE = INSTALLMENT_AMOUNT * 3;

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

const makeInstallment = (studentId, term, overrides = {}) => {
  const base = {
    id: `${studentId}-${term}`,
    label: `Term ${term.slice(1)}`,
    dueDate: TERM_DUE_DATES[term],
    amount: INSTALLMENT_AMOUNT,
    paidAmount: 0,
    paidDate: null,
    method: null,
    receiptNo: null,
    ...overrides,
  };
  return { ...base, status: deriveInstallmentStatus(base) };
};

const makeRecord = (studentId, name, className, installmentOverrides) => ({
  student_id: studentId,
  name,
  class: className,
  totalFee: TOTAL_FEE,
  installments: ['T1', 'T2', 'T3'].map((term) =>
    makeInstallment(studentId, term, installmentOverrides[term] || {})
  ),
});

// Mixed spread across the 12 STUDENTS_DIRECTORY entries: 4 fully paid,
// 4 overdue (some fully unpaid, one partially paid past its due date),
// 4 pending (not-yet-due partial or first-installment-only paid).
export const seedFeeRecords = () => [
  makeRecord('DIR001', 'Aarav Sharma', 'Class A', {
    T1: { paidAmount: 30000, paidDate: '2026-06-10', method: 'UPI', receiptNo: 'RCPT-DIR001-T1' },
  }),
  makeRecord('DIR002', 'Vivaan Mehta', 'Class A', {
    T1: { paidAmount: 30000, paidDate: '2026-06-05', method: 'Bank Transfer', receiptNo: 'RCPT-DIR002-T1' },
    T2: { paidAmount: 30000, paidDate: '2026-08-01', method: 'UPI', receiptNo: 'RCPT-DIR002-T2' },
    T3: { paidAmount: 30000, paidDate: '2026-08-15', method: 'Card', receiptNo: 'RCPT-DIR002-T3' },
  }),
  makeRecord('DIR003', 'Ananya Iyer', 'Class B', {
    T1: { paidAmount: 30000, paidDate: '2026-06-12', method: 'Cash', receiptNo: 'RCPT-DIR003-T1' },
    T2: { paidAmount: 15000, paidDate: '2026-08-10', method: 'UPI', receiptNo: 'RCPT-DIR003-T2' },
  }),
  makeRecord('DIR004', 'Diya Nair', 'Class B', {}),
  makeRecord('DIR005', 'Arjun Deshmukh', 'Class C', {
    T1: { paidAmount: 30000, paidDate: '2026-06-01', method: 'Bank Transfer', receiptNo: 'RCPT-DIR005-T1' },
    T2: { paidAmount: 30000, paidDate: '2026-08-05', method: 'UPI', receiptNo: 'RCPT-DIR005-T2' },
    T3: { paidAmount: 30000, paidDate: '2026-08-18', method: 'Card', receiptNo: 'RCPT-DIR005-T3' },
  }),
  makeRecord('DIR006', 'Sai Kulkarni', 'Class C', {
    T1: { paidAmount: 30000, paidDate: '2026-06-14', method: 'Cash', receiptNo: 'RCPT-DIR006-T1' },
    T2: { paidAmount: 30000, paidDate: '2026-08-12', method: 'UPI', receiptNo: 'RCPT-DIR006-T2' },
  }),
  makeRecord('DIR007', 'Sneha Kulkarni', 'Class D', {}),
  makeRecord('DIR008', 'Pooja Jadhav', 'Class D', {
    T1: { paidAmount: 30000, paidDate: '2026-06-08', method: 'UPI', receiptNo: 'RCPT-DIR008-T1' },
    T2: { paidAmount: 30000, paidDate: '2026-08-02', method: 'Bank Transfer', receiptNo: 'RCPT-DIR008-T2' },
    T3: { paidAmount: 30000, paidDate: '2026-08-20', method: 'Cash', receiptNo: 'RCPT-DIR008-T3' },
  }),
  makeRecord('DIR009', 'Kabir Malhotra', 'Class A', {
    T1: { paidAmount: 30000, paidDate: '2026-06-13', method: 'Card', receiptNo: 'RCPT-DIR009-T1' },
  }),
  makeRecord('DIR010', 'Kiara Menon', 'Class B', {
    T1: { paidAmount: 10000, paidDate: '2026-06-16', method: 'Cash', receiptNo: 'RCPT-DIR010-T1' },
  }),
  makeRecord('DIR011', 'Yash Patil', 'Class C', {
    T1: { paidAmount: 30000, paidDate: '2026-06-09', method: 'UPI', receiptNo: 'RCPT-DIR011-T1' },
    T2: { paidAmount: 30000, paidDate: '2026-08-03', method: 'UPI', receiptNo: 'RCPT-DIR011-T2' },
    T3: { paidAmount: 30000, paidDate: '2026-08-16', method: 'Bank Transfer', receiptNo: 'RCPT-DIR011-T3' },
  }),
  makeRecord('DIR012', 'Riya Chavan', 'Class D', {}),
];
```

- [ ] **Step 2: Lint the file**

Run: `cd "Frontend" && bun run lint 2>&1 | grep feesData`
Expected: no output (no lint errors for this file)

- [ ] **Step 3: Commit**

```bash
git add "Frontend/src/mockData/feesData.js"
git commit -m "$(cat <<'EOF'
Add fee payment mock data module

Data model, seed records, and shared status/currency helpers for the new student fee payment manager feature.
EOF
)"
```

---

## Task 2: Wire the mock store and API routes into mockFetch.js

**Files:**
- Modify: `Frontend/src/mockData/mockFetch.js`

- [ ] **Step 1: Add the import and store**

Find this import block near the top of the file:

```js
import {
  STUDENTS_BY_STREAM,
  STUDENTS_DIRECTORY,
  STUDY_MATERIALS_SEED,
  TEST_MATERIALS_SEED,
  LEARNER_MATERIALS,
  LEARNER_TESTS,
  IMAGE_ANALYSIS_SAMPLE,
  seedAttendanceHistory,
} from './data';
```

Add a second import right after it:

```js
import { seedFeeRecords, deriveInstallmentStatus } from './feesData';
```

Find this store declaration:

```js
let attendanceStore = seedAttendanceHistory();
let studyMaterials = [...STUDY_MATERIALS_SEED];
let testMaterials = [...TEST_MATERIALS_SEED];
let nextTestMaterialId = testMaterials.length + 1;
```

Add a new store line right after it:

```js
let feeRecords = seedFeeRecords();
```

- [ ] **Step 2: Add the 3 fee routes**

Find the last route entry in the `routes` array:

```js
  {
    method: 'POST',
    pattern: /^\/admin\/settings$/,
    handler: () => jsonResponse(200, { message: 'Settings saved' }),
  },
];
```

Replace with (adds 3 new routes before the closing `];`):

```js
  {
    method: 'POST',
    pattern: /^\/admin\/settings$/,
    handler: () => jsonResponse(200, { message: 'Settings saved' }),
  },
  {
    method: 'GET',
    pattern: /^\/api\/fees$/,
    handler: () => jsonResponse(200, { data: feeRecords }),
  },
  {
    method: 'GET',
    pattern: /^\/api\/fees\/([^/]+)$/,
    handler: (match) => {
      const record = feeRecords.find((r) => r.student_id === match[1]);
      if (!record) return jsonResponse(404, { message: 'Fee record not found' });
      return jsonResponse(200, { data: record });
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/fees\/([^/]+)\/pay$/,
    handler: (match, _query, body) => {
      const record = feeRecords.find((r) => r.student_id === match[1]);
      if (!record) return jsonResponse(404, { message: 'Fee record not found' });

      const { installmentId, amount, method, date } = JSON.parse(body || '{}');
      const installment = record.installments.find((i) => i.id === installmentId);
      if (!installment) return jsonResponse(404, { message: 'Installment not found' });

      installment.paidAmount += Number(amount) || 0;
      installment.paidDate = date;
      installment.method = method;
      if (!installment.receiptNo) {
        installment.receiptNo = `RCPT-${installment.id}`;
      }
      installment.status = deriveInstallmentStatus(installment);

      return jsonResponse(200, { data: record });
    },
  },
];
```

- [ ] **Step 3: Lint the file**

Run: `cd "Frontend" && bun run lint 2>&1 | grep mockFetch`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add "Frontend/src/mockData/mockFetch.js"
git commit -m "$(cat <<'EOF'
Add fee routes to the mock API

GET /api/fees, GET /api/fees/:studentId, and POST /api/fees/:studentId/pay, backed by a new shared in-memory feeRecords store alongside the existing attendance/materials stores.
EOF
)"
```

---

## Task 3: Admin fee list — FeesManager.jsx

**Files:**
- Create: `Frontend/src/components/Admin/sections/FeesManager.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React, { useEffect, useMemo, useState } from 'react';
import { mockFetch } from '../../../mockData/mockFetch';
import { formatCurrency, deriveOverallStatus, getPaidTotal } from '../../../mockData/feesData';
import FeeDetailModal from './FeeDetailModal';

const STATUS_FILTERS = ['all', 'paid', 'pending', 'overdue'];

const STATUS_BADGE_CLASSES = {
  paid: 'bg-[#10B981]/15 text-[#10B981]',
  pending: 'bg-amber-500/15 text-amber-600',
  overdue: 'bg-error-container text-on-error-container',
};

const FeesManager = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState(null);

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

  const summarized = useMemo(
    () => records.map((record) => {
      const paid = getPaidTotal(record);
      return {
        ...record,
        status: deriveOverallStatus(record),
        paid,
        remaining: record.totalFee - paid,
      };
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

  const handlePaymentRecorded = (updatedRecord) => {
    setRecords((prev) => prev.map((r) => (r.student_id === updatedRecord.student_id ? updatedRecord : r)));
  };

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
            <h2 className="text-2xl font-bold font-display text-on-surface">Fee Management</h2>
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

          {loading ? (
            <p className="text-sm text-on-surface-variant py-8 text-center">Loading fee records...</p>
          ) : (
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
          )}
        </div>
      </div>

      {selectedRecord && (
        <FeeDetailModal
          record={selectedRecord}
          onClose={() => setSelectedStudentId(null)}
          onPaymentRecorded={handlePaymentRecorded}
        />
      )}
    </div>
  );
};

export default FeesManager;
```

- [ ] **Step 2: Lint the file (expect an import error until Task 4 adds FeeDetailModal — that's fine, confirmed clean once both files exist)**

Run: `cd "Frontend" && bun run lint 2>&1 | grep FeesManager`
Expected: may show an unresolved-import-adjacent warning or nothing; re-check after Task 4.

- [ ] **Step 3: Commit**

```bash
git add "Frontend/src/components/Admin/sections/FeesManager.jsx"
git commit -m "$(cat <<'EOF'
Add admin FeesManager component

Stat cards (students/paid/pending/overdue/collected/outstanding) plus a searchable, filterable student fee table.
EOF
)"
```

---

## Task 4: Admin payment recording — FeeDetailModal.jsx

**Files:**
- Create: `Frontend/src/components/Admin/sections/FeeDetailModal.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React, { useState } from 'react';
import { mockFetch } from '../../../mockData/mockFetch';
import { formatCurrency } from '../../../mockData/feesData';

const PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Bank Transfer'];

const STATUS_BADGE_CLASSES = {
  paid: 'bg-[#10B981]/15 text-[#10B981]',
  pending: 'bg-amber-500/15 text-amber-600',
  overdue: 'bg-error-container text-on-error-container',
};

const FeeDetailModal = ({ record, onClose, onPaymentRecorded }) => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [payingInstallmentId, setPayingInstallmentId] = useState(null);
  const [form, setForm] = useState({ amount: '', method: 'UPI', date: new Date().toISOString().slice(0, 10) });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const openPaymentForm = (installment) => {
    setPayingInstallmentId(installment.id);
    setForm({
      amount: String(installment.amount - installment.paidAmount),
      method: 'UPI',
      date: new Date().toISOString().slice(0, 10),
    });
    setFormError('');
  };

  const closePaymentForm = () => {
    setPayingInstallmentId(null);
    setFormError('');
  };

  const handleSubmitPayment = async (installment) => {
    const amount = Number(form.amount);
    const remaining = installment.amount - installment.paidAmount;
    if (!amount || amount <= 0) {
      setFormError('Enter an amount greater than 0.');
      return;
    }
    if (amount > remaining) {
      setFormError(`Amount cannot exceed the remaining ${formatCurrency(remaining)}.`);
      return;
    }
    setSubmitting(true);
    try {
      const response = await mockFetch(`${URL}/api/fees/${record.student_id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ installmentId: installment.id, amount, method: form.method, date: form.date }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      onPaymentRecorded(data.data);
      closePaymentForm();
    } catch (error) {
      console.error('Error recording payment:', error);
      setFormError('Could not record payment. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-lg mx-auto border border-outline-variant max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div>
            <h2 className="font-display text-xl text-on-surface">{record.name}</h2>
            <p className="text-sm text-on-surface-variant">{record.class} &bull; {formatCurrency(record.totalFee)} total</p>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {record.installments.map((installment) => {
            const remaining = installment.amount - installment.paidAmount;
            const isPartial = installment.paidAmount > 0 && installment.status !== 'paid';
            return (
              <div key={installment.id} className="border border-surface-variant rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-on-surface">{installment.label}</p>
                    <p className="text-xs text-on-surface-variant">Due {installment.dueDate}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_BADGE_CLASSES[installment.status]}`}>
                    {installment.status}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant mb-3">
                  {isPartial
                    ? `${formatCurrency(installment.paidAmount)} of ${formatCurrency(installment.amount)} paid`
                    : formatCurrency(installment.amount)}
                </p>

                {installment.status !== 'paid' && payingInstallmentId !== installment.id && (
                  <button
                    onClick={() => openPaymentForm(installment)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Record Payment
                  </button>
                )}

                {payingInstallmentId === installment.id && (
                  <div className="mt-3 space-y-3 bg-surface-container-low rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1">Amount</label>
                        <input
                          type="number"
                          min="1"
                          max={remaining}
                          value={form.amount}
                          onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                          className="w-full px-3 py-2 bg-surface rounded-lg border border-surface-variant/60 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1">Method</label>
                        <select
                          value={form.method}
                          onChange={(e) => setForm((prev) => ({ ...prev, method: e.target.value }))}
                          className="w-full px-3 py-2 bg-surface rounded-lg border border-surface-variant/60 text-sm cursor-pointer"
                        >
                          {PAYMENT_METHODS.map((method) => (
                            <option key={method} value={method}>{method}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-on-surface-variant mb-1">Date</label>
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 bg-surface rounded-lg border border-surface-variant/60 text-sm"
                        />
                      </div>
                    </div>
                    {formError && <p className="text-xs text-error font-medium">{formError}</p>}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSubmitPayment(installment)}
                        disabled={submitting}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                      >
                        {submitting ? 'Saving...' : 'Confirm Payment'}
                      </button>
                      <button
                        onClick={closePaymentForm}
                        className="px-4 py-2 border border-outline-variant rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeeDetailModal;
```

- [ ] **Step 2: Lint both admin fee files together**

Run: `cd "Frontend" && bun run lint 2>&1 | grep -A5 "FeesManager\|FeeDetailModal"`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "Frontend/src/components/Admin/sections/FeeDetailModal.jsx"
git commit -m "$(cat <<'EOF'
Add admin FeeDetailModal component

Per-installment breakdown with an inline record-payment form (amount defaults to the remaining balance, validated client-side against it); partial payments accumulate via POST /api/fees/:id/pay.
EOF
)"
```

---

## Task 5: Wire the Fees tab into the admin dashboard

**Files:**
- Modify: `Frontend/src/components/Admin/AdminNavbar.jsx`
- Modify: `Frontend/src/components/Admin/AdminDashboard.jsx`

- [ ] **Step 1: Add the nav item**

In `AdminNavbar.jsx`, find:

```js
const adminNavItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "users", label: "Users", icon: "manage_accounts" },
  { id: "courses", label: "Courses", icon: "menu_book" },
```

Replace with:

```js
const adminNavItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "users", label: "Users", icon: "manage_accounts" },
  { id: "fees", label: "Fees", icon: "payments" },
  { id: "courses", label: "Courses", icon: "menu_book" },
```

- [ ] **Step 2: Import FeesManager in AdminDashboard.jsx**

Find:

```js
import { mockFetch } from '../../mockData/mockFetch';
```

Replace with:

```js
import { mockFetch } from '../../mockData/mockFetch';
import FeesManager from './sections/FeesManager';
```

- [ ] **Step 3: Render it for the new tab**

Find this exact block (the end of the Users Management tab, right before the Course Management tab comment):

```jsx
                </div>
              </div>
            </div>
          )}

          {/* 3. Course Management Tab */}
          {activeSection === 'courses' && (
```

Replace with:

```jsx
                </div>
              </div>
            </div>
          )}

          {/* Fee Management Tab */}
          {activeSection === 'fees' && (
            <FeesManager />
          )}

          {/* 3. Course Management Tab */}
          {activeSection === 'courses' && (
```

- [ ] **Step 4: Lint both files**

Run: `cd "Frontend" && bun run lint 2>&1 | grep "AdminNavbar\|AdminDashboard"`
Expected: no output

- [ ] **Step 5: Commit**

```bash
git add "Frontend/src/components/Admin/AdminNavbar.jsx" "Frontend/src/components/Admin/AdminDashboard.jsx"
git commit -m "$(cat <<'EOF'
Wire Fees tab into the admin dashboard nav

Adds a "Fees" entry to AdminNavbar between Users and Courses, rendering the new FeesManager section.
EOF
)"
```

---

## Task 6: Student fee status — FeesSection.jsx

**Files:**
- Create: `Frontend/src/components/Leraners/sections/FeesSection.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mockFetch } from '../../../mockData/mockFetch';
import { STUDENT_SELF_ID, formatCurrency, deriveOverallStatus, getPaidTotal } from '../../../mockData/feesData';
import FeeReceipt from './FeeReceipt';

const STATUS_BADGE_CLASSES = {
  paid: 'bg-[#10B981]/15 text-[#10B981]',
  pending: 'bg-amber-500/15 text-amber-600',
  overdue: 'bg-error-container text-on-error-container',
};

const FeesSection = () => {
  const { t } = useTranslation();
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receiptInstallment, setReceiptInstallment] = useState(null);

  const fetchFees = async () => {
    try {
      const response = await mockFetch(`${URL}/api/fees/${STUDENT_SELF_ID}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setRecord(data.data);
    } catch (error) {
      console.error('Error fetching fee record:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  if (loading) {
    return <p className="text-sm text-on-surface-variant py-8 text-center">{t('learnerFeesLoading')}</p>;
  }

  if (!record) {
    return <p className="text-sm text-on-surface-variant py-8 text-center">{t('learnerFeesEmpty')}</p>;
  }

  const status = deriveOverallStatus(record);
  const paid = getPaidTotal(record);
  const remaining = record.totalFee - paid;

  return (
    <div className="mt-4 lg:mt-8 space-y-8">
      <header>
        <h1 className="font-display text-[28px] leading-[36px] md:text-[48px] md:leading-[60px] text-on-surface mb-2 tracking-tight">
          {t('learnerFeesPageTitle')}
        </h1>
        <p className="text-lg leading-[28px] text-on-surface-variant max-w-2xl">
          {t('learnerFeesPageSubtitle')}
        </p>
      </header>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-on-surface">{t('learnerFeesSummaryTitle')}</h2>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_BADGE_CLASSES[status]}`}>
            {status}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('learnerFeesTotal')}</p>
            <p className="text-xl font-bold text-on-surface mt-1">{formatCurrency(record.totalFee)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('learnerFeesPaid')}</p>
            <p className="text-xl font-bold text-on-surface mt-1">{formatCurrency(paid)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('learnerFeesRemaining')}</p>
            <p className="text-xl font-bold text-on-surface mt-1">{formatCurrency(remaining)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {record.installments.map((installment) => {
          const isPartial = installment.paidAmount > 0 && installment.status !== 'paid';
          return (
            <div key={installment.id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-bold text-on-surface">{installment.label}</p>
                <p className="text-sm text-on-surface-variant">
                  {isPartial
                    ? t('learnerFeesPartialPaid', { paid: formatCurrency(installment.paidAmount), total: formatCurrency(installment.amount) })
                    : formatCurrency(installment.amount)}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">{t('learnerFeesDue', { date: installment.dueDate })}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_BADGE_CLASSES[installment.status]}`}>
                  {installment.status}
                </span>
                {installment.status === 'paid' && (
                  <button
                    onClick={() => setReceiptInstallment(installment)}
                    className="px-4 py-2 bg-surface-container-low text-primary rounded-xl text-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    {t('learnerFeesViewReceipt')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {receiptInstallment && (
        <FeeReceipt
          record={record}
          installment={receiptInstallment}
          onClose={() => setReceiptInstallment(null)}
        />
      )}
    </div>
  );
};

export default FeesSection;
```

- [ ] **Step 2: Lint the file**

Run: `cd "Frontend" && bun run lint 2>&1 | grep FeesSection`
Expected: no output (the unresolved `FeeReceipt` import is fine — added in Task 7)

- [ ] **Step 3: Commit**

```bash
git add "Frontend/src/components/Leraners/sections/FeesSection.jsx"
git commit -m "$(cat <<'EOF'
Add student FeesSection component

Summary card (total/paid/remaining/status) plus per-installment status list with a "View Receipt" action once an installment is fully paid.
EOF
)"
```

---

## Task 7: Student receipt view — FeeReceipt.jsx

**Files:**
- Create: `Frontend/src/components/Leraners/sections/FeeReceipt.jsx`

- [ ] **Step 1: Write the file**

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../mockData/feesData';

const FeeReceipt = ({ record, installment, onClose }) => {
  const { t } = useTranslation();

  const handleDownload = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:bg-white print:backdrop-blur-none"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #fee-receipt-print, #fee-receipt-print * { visibility: visible; }
          #fee-receipt-print { position: fixed; inset: 0; margin: 0; box-shadow: none; border: none; }
        }
      `}</style>
      <div id="fee-receipt-print" className="bg-surface-container-lowest rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-md mx-auto border border-outline-variant p-8">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <h2 className="font-display text-xl text-on-surface">{t('learnerFeesReceiptTitle')}</h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="font-display text-lg text-on-surface">EduLearning Platform</p>
          <p className="text-xs text-on-surface-variant">{t('learnerFeesReceiptSubtitle')}</p>
        </div>

        <div className="space-y-2 text-sm border-t border-b border-outline-variant py-4 mb-6">
          <div className="flex justify-between"><span className="text-on-surface-variant">{t('learnerFeesReceiptNo')}</span><span className="font-bold text-on-surface">{installment.receiptNo}</span></div>
          <div className="flex justify-between"><span className="text-on-surface-variant">{t('learnerFeesReceiptStudent')}</span><span className="font-bold text-on-surface">{record.name}</span></div>
          <div className="flex justify-between"><span className="text-on-surface-variant">{t('learnerFeesReceiptClass')}</span><span className="font-bold text-on-surface">{record.class}</span></div>
          <div className="flex justify-between"><span className="text-on-surface-variant">{t('learnerFeesReceiptInstallment')}</span><span className="font-bold text-on-surface">{installment.label}</span></div>
          <div className="flex justify-between"><span className="text-on-surface-variant">{t('learnerFeesReceiptAmount')}</span><span className="font-bold text-on-surface">{formatCurrency(installment.paidAmount)}</span></div>
          <div className="flex justify-between"><span className="text-on-surface-variant">{t('learnerFeesReceiptDate')}</span><span className="font-bold text-on-surface">{installment.paidDate}</span></div>
          <div className="flex justify-between"><span className="text-on-surface-variant">{t('learnerFeesReceiptMethod')}</span><span className="font-bold text-on-surface">{installment.method}</span></div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-xs hover:opacity-90 transition-opacity cursor-pointer print:hidden"
        >
          {t('learnerFeesReceiptDownload')}
        </button>
      </div>
    </div>
  );
};

export default FeeReceipt;
```

Note: date/method shown reflect the installment's most-recent payment only, even if it was settled across multiple partial payments — an accepted simplification (see spec §6), not a bug.

- [ ] **Step 2: Lint both learner fee files together**

Run: `cd "Frontend" && bun run lint 2>&1 | grep -A5 "FeesSection\|FeeReceipt"`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add "Frontend/src/components/Leraners/sections/FeeReceipt.jsx"
git commit -m "$(cat <<'EOF'
Add student FeeReceipt component

On-screen receipt (receipt no., student, class, installment, amount, date, method) with a print-styled Download button using window.print() — no new PDF dependency.
EOF
)"
```

---

## Task 8: Wire the Fees tab into the learner dashboard

**Files:**
- Modify: `Frontend/src/components/Leraners/LearnerNavbar.jsx`
- Modify: `Frontend/src/components/Leraners/NewLearnerDashboard.jsx`

- [ ] **Step 1: Add the nav item**

In `LearnerNavbar.jsx`, find:

```js
const learnerNavItems = [
  { id: "dashboard", labelKey: "learnerNavDashboard", icon: "dashboard" },
  { id: "syllabus", labelKey: "learnerNavSyllabus", icon: "menu_book" },
  { id: "material", labelKey: "learnerNavMaterial", icon: "folder_open" },
  { id: "test", labelKey: "learnerNavTest", icon: "quiz", hasBadge: true },
  { id: "progress", labelKey: "learnerNavProgress", icon: "trending_up" },
  { id: "profile", labelKey: "learnerNavProfile", icon: "person" },
];
```

Replace with:

```js
const learnerNavItems = [
  { id: "dashboard", labelKey: "learnerNavDashboard", icon: "dashboard" },
  { id: "syllabus", labelKey: "learnerNavSyllabus", icon: "menu_book" },
  { id: "material", labelKey: "learnerNavMaterial", icon: "folder_open" },
  { id: "test", labelKey: "learnerNavTest", icon: "quiz", hasBadge: true },
  { id: "progress", labelKey: "learnerNavProgress", icon: "trending_up" },
  { id: "fees", labelKey: "learnerNavFees", icon: "payments" },
  { id: "profile", labelKey: "learnerNavProfile", icon: "person" },
];
```

- [ ] **Step 2: Import FeesSection in NewLearnerDashboard.jsx**

Find:

```js
import ProgressTracking from './ProgressTracking';
```

Replace with:

```js
import ProgressTracking from './ProgressTracking';
import FeesSection from './sections/FeesSection';
```

- [ ] **Step 3: Render it for the new tab**

Find:

```jsx
          {activeSection === 'progress' && (
            <div className="space-y-6">
              <ProgressTracking onViewAllResults={handleViewAllResults} />
            </div>
          )}

          {activeSection === 'profile' && (
```

Replace with:

```jsx
          {activeSection === 'progress' && (
            <div className="space-y-6">
              <ProgressTracking onViewAllResults={handleViewAllResults} />
            </div>
          )}

          {activeSection === 'fees' && (
            <div className="space-y-6">
              <FeesSection />
            </div>
          )}

          {activeSection === 'profile' && (
```

- [ ] **Step 4: Lint both files**

Run: `cd "Frontend" && bun run lint 2>&1 | grep "LearnerNavbar\|NewLearnerDashboard"`
Expected: no output

- [ ] **Step 5: Commit**

```bash
git add "Frontend/src/components/Leraners/LearnerNavbar.jsx" "Frontend/src/components/Leraners/NewLearnerDashboard.jsx"
git commit -m "$(cat <<'EOF'
Wire Fees tab into the learner dashboard nav

Adds a "Fees" entry to LearnerNavbar after Progress, rendering the new FeesSection.
EOF
)"
```

---

## Task 9: Add Learner-side i18n keys (en/hi/mr)

**Files:**
- Modify: `Frontend/src/i18n/locales/en.json`
- Modify: `Frontend/src/i18n/locales/hi.json`
- Modify: `Frontend/src/i18n/locales/mr.json`

- [ ] **Step 1: en.json**

Find:

```json
  "learnerNavProgress": "Progress",
  "learnerNavProfile": "Profile",
```

Replace with:

```json
  "learnerNavProgress": "Progress",
  "learnerNavFees": "Fees",
  "learnerNavProfile": "Profile",
```

Find:

```json
  "learnerTestsPageTitle": "Tests",
  "learnerTestsPageSubtitle": "Track your performance and attempt new tests.",
```

Replace with:

```json
  "learnerTestsPageTitle": "Tests",
  "learnerTestsPageSubtitle": "Track your performance and attempt new tests.",
  "learnerFeesPageTitle": "Fees",
  "learnerFeesPageSubtitle": "Track your fee payments and download receipts.",
  "learnerFeesLoading": "Loading fee details...",
  "learnerFeesEmpty": "No fee record found.",
  "learnerFeesSummaryTitle": "Fee Summary",
  "learnerFeesTotal": "Total Fee",
  "learnerFeesPaid": "Paid",
  "learnerFeesRemaining": "Remaining",
  "learnerFeesDue": "Due {{date}}",
  "learnerFeesPartialPaid": "{{paid}} of {{total}} paid",
  "learnerFeesViewReceipt": "View Receipt",
  "learnerFeesReceiptTitle": "Payment Receipt",
  "learnerFeesReceiptSubtitle": "Official Fee Payment Receipt",
  "learnerFeesReceiptNo": "Receipt No.",
  "learnerFeesReceiptStudent": "Student",
  "learnerFeesReceiptClass": "Class",
  "learnerFeesReceiptInstallment": "Installment",
  "learnerFeesReceiptAmount": "Amount Paid",
  "learnerFeesReceiptDate": "Payment Date",
  "learnerFeesReceiptMethod": "Payment Method",
  "learnerFeesReceiptDownload": "Download Receipt",
```

- [ ] **Step 2: hi.json**

Find:

```json
  "learnerNavProgress": "प्रगति",
  "learnerNavProfile": "प्रोफ़ाइल",
```

Replace with:

```json
  "learnerNavProgress": "प्रगति",
  "learnerNavFees": "फीस",
  "learnerNavProfile": "प्रोफ़ाइल",
```

Find:

```json
  "learnerTestsPageTitle": "परीक्षण",
  "learnerTestsPageSubtitle": "अपने प्रदर्शन को ट्रैक करें और नए परीक्षण दें।",
```

Replace with:

```json
  "learnerTestsPageTitle": "परीक्षण",
  "learnerTestsPageSubtitle": "अपने प्रदर्शन को ट्रैक करें और नए परीक्षण दें।",
  "learnerFeesPageTitle": "फीस",
  "learnerFeesPageSubtitle": "अपने फीस भुगतान को ट्रैक करें और रसीदें डाउनलोड करें।",
  "learnerFeesLoading": "फीस विवरण लोड हो रहा है...",
  "learnerFeesEmpty": "कोई फीस रिकॉर्ड नहीं मिला।",
  "learnerFeesSummaryTitle": "फीस सारांश",
  "learnerFeesTotal": "कुल फीस",
  "learnerFeesPaid": "भुगतान की गई",
  "learnerFeesRemaining": "शेष",
  "learnerFeesDue": "देय तिथि {{date}}",
  "learnerFeesPartialPaid": "{{total}} में से {{paid}} भुगतान की गई",
  "learnerFeesViewReceipt": "रसीद देखें",
  "learnerFeesReceiptTitle": "भुगतान रसीद",
  "learnerFeesReceiptSubtitle": "आधिकारिक फीस भुगतान रसीद",
  "learnerFeesReceiptNo": "रसीद संख्या",
  "learnerFeesReceiptStudent": "छात्र",
  "learnerFeesReceiptClass": "कक्षा",
  "learnerFeesReceiptInstallment": "किस्त",
  "learnerFeesReceiptAmount": "भुगतान राशि",
  "learnerFeesReceiptDate": "भुगतान तिथि",
  "learnerFeesReceiptMethod": "भुगतान विधि",
  "learnerFeesReceiptDownload": "रसीद डाउनलोड करें",
```

- [ ] **Step 3: mr.json**

Find:

```json
  "learnerNavProgress": "प्रगती",
  "learnerNavProfile": "प्रोफाइल",
```

Replace with:

```json
  "learnerNavProgress": "प्रगती",
  "learnerNavFees": "फी",
  "learnerNavProfile": "प्रोफाइल",
```

Find:

```json
  "learnerTestsPageTitle": "चाचण्या",
  "learnerTestsPageSubtitle": "तुमच्या कामगिरीचा मागोवा घ्या आणि नवीन चाचण्या द्या.",
```

Replace with:

```json
  "learnerTestsPageTitle": "चाचण्या",
  "learnerTestsPageSubtitle": "तुमच्या कामगिरीचा मागोवा घ्या आणि नवीन चाचण्या द्या.",
  "learnerFeesPageTitle": "फी",
  "learnerFeesPageSubtitle": "तुमच्या फी भरण्याचा मागोवा घ्या आणि पावत्या डाउनलोड करा.",
  "learnerFeesLoading": "फी तपशील लोड होत आहे...",
  "learnerFeesEmpty": "कोणतीही फी नोंद आढळली नाही.",
  "learnerFeesSummaryTitle": "फी सारांश",
  "learnerFeesTotal": "एकूण फी",
  "learnerFeesPaid": "भरलेली",
  "learnerFeesRemaining": "शिल्लक",
  "learnerFeesDue": "देय तारीख {{date}}",
  "learnerFeesPartialPaid": "{{total}} पैकी {{paid}} भरले",
  "learnerFeesViewReceipt": "पावती पहा",
  "learnerFeesReceiptTitle": "पेमेंट पावती",
  "learnerFeesReceiptSubtitle": "अधिकृत फी भरणा पावती",
  "learnerFeesReceiptNo": "पावती क्रमांक",
  "learnerFeesReceiptStudent": "विद्यार्थी",
  "learnerFeesReceiptClass": "वर्ग",
  "learnerFeesReceiptInstallment": "हप्ता",
  "learnerFeesReceiptAmount": "भरलेली रक्कम",
  "learnerFeesReceiptDate": "भरणा तारीख",
  "learnerFeesReceiptMethod": "भरणा पद्धत",
  "learnerFeesReceiptDownload": "पावती डाउनलोड करा",
```

- [ ] **Step 4: Validate JSON syntax for all three files**

Run: `cd "Frontend" && node -e "JSON.parse(require('fs').readFileSync('src/i18n/locales/en.json')); JSON.parse(require('fs').readFileSync('src/i18n/locales/hi.json')); JSON.parse(require('fs').readFileSync('src/i18n/locales/mr.json')); console.log('OK')"`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add "Frontend/src/i18n/locales/en.json" "Frontend/src/i18n/locales/hi.json" "Frontend/src/i18n/locales/mr.json"
git commit -m "$(cat <<'EOF'
Add i18n keys for the learner Fees tab

English/Hindi/Marathi translations for the nav label, page copy, summary card, installment list, and receipt view.
EOF
)"
```

---

## Task 10: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Lint the whole frontend and confirm no new errors**

Run: `cd "Frontend" && bun run lint 2>&1 | tail -5`
Expected: same pre-existing error count as before this feature (503 errors / 10 warnings, all pre-existing and unrelated — see baseline noted during the earlier Results-page work in this session); zero errors attributable to any file touched in Tasks 1-9.

- [ ] **Step 2: Build**

Run: `cd "Frontend" && bun run build 2>&1 | tail -20`
Expected: `✓ built in ...s`, no errors.

- [ ] **Step 3: Launch the dev server**

Run: `cd "Frontend" && (bun run dev > /tmp/vite-dev.log 2>&1 &) && timeout 30 bash -c 'until curl -sf http://localhost:5173 >/dev/null; do sleep 1; done' && echo "SERVER UP"`
Expected: `SERVER UP`

- [ ] **Step 4: Browser-driven check — Admin flow**

Using Playwright (same approach used earlier this session for the Results page: `bunx playwright install chromium` if not already cached, then a throwaway `.mjs` script in the scratchpad directory — do NOT run `bun add playwright`, it's a one-off dev tool, not a project dependency):

1. Navigate to the admin login/dashboard route (check `App.jsx` for the exact admin route and any login requirement — `AdminAuthContext` may need a mock login first; if so, use its existing demo credentials/flow).
2. Click the "Fees" tab.
3. Screenshot — verify stat cards render (Total Students: 12, Fully Paid: 4, Overdue: 4, Pending: 4) and the table lists all 12 students with correct status badges.
4. Click a row for a student with a `pending`/`overdue` installment (e.g. Diya Nair / DIR004, fully unpaid).
5. Click "Record Payment" on Term 1, confirm the amount field defaults to ₹30,000, submit.
6. Screenshot — verify the installment now shows `paid` and the table/stat cards updated (Fully Paid count unchanged since only 1 of 3 installments paid; overdue count should drop by one once Term 1 is no longer overdue).
7. Check `console --errors` (or the Playwright `pageerror`/`console` listeners) — expect none.

- [ ] **Step 5: Browser-driven check — Student flow**

1. Navigate to `/learners` (or whatever route renders `NewLearnerDashboard`).
2. Click the "Fees" tab.
3. Screenshot — verify the summary card shows Aarav Sharma's (DIR001) totals: Total ₹90,000, Paid ₹30,000, Remaining ₹60,000, status `pending`.
4. Click "View Receipt" on the paid Term 1 installment.
5. Screenshot — verify the receipt shows receipt no. `RCPT-DIR001-T1`, student "Aarav Sharma", amount ₹30,000, date `2026-06-10`, method `UPI`.
6. Confirm no "View Receipt" button appears on the unpaid Term 2/Term 3 rows.
7. Check console errors — expect none.

- [ ] **Step 6: Stop the dev server**

Run: `lsof -ti:5173 -sTCP:LISTEN | xargs -r kill`

- [ ] **Step 7: Final review**

Run `git log --oneline -10` and `git status` to confirm all 9 commits from Tasks 1-9 are present, the working tree is otherwise clean (aside from any pre-existing uncommitted Results-page changes from earlier in this session, which are out of scope here), and — per explicit user instruction — nothing has been pushed and no new branch was created (`git branch --show-current` should still show `main`).
