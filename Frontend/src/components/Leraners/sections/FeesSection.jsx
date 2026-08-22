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
