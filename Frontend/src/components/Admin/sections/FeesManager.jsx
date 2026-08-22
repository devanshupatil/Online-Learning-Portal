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
