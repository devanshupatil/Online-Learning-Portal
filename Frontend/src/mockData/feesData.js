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
