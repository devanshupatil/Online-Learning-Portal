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
