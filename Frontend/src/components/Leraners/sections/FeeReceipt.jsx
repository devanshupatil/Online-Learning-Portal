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
