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
