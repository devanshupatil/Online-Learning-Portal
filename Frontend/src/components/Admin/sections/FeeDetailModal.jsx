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
