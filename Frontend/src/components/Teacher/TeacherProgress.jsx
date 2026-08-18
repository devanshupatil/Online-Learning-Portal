import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PERFORMANCE_DATA = [
  { class: 'Class 12-A', students: 36, avgScore: 91, attendance: 96, passRate: 98 },
  { class: 'Class 12-B', students: 34, avgScore: 84, attendance: 92, passRate: 94 },
  { class: 'Class 11-A', students: 30, avgScore: 79, attendance: 88, passRate: 89 },
  { class: 'Class 11-B', students: 28, avgScore: 75, attendance: 85, passRate: 86 },
];

const TOP_PERFORMERS = [
  { rank: 1, name: 'Alex Mercer', class: '12-A', score: '98.5%', badge: 'Star Achiever' },
  { rank: 2, name: 'Maya Patel', class: '12-A', score: '97.2%', badge: 'High Distinction' },
  { rank: 3, name: 'Emma Chen', class: '11-B', score: '95.8%', badge: 'Distinction' },
  { rank: 4, name: 'Aarav Sharma', class: '12-A', score: '94.6%', badge: 'Distinction' },
];

const TeacherProgress = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-on-surface mb-1">Student Progress & Analytics</h2>
          <p className="text-base text-on-surface-variant font-medium">
            Academic growth, test milestones, and classroom performance
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl border border-surface-variant">
          {[
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'term', label: 'This Term' },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setTimeRange(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === r.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 soft-bloom shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Overall Avg Score</p>
              <h3 className="text-3xl font-bold text-on-surface mt-1">87.4%</h3>
              <p className="text-xs text-[#10B981] font-semibold mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span> +3.2% from last term
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">grade</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 soft-bloom shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pass Percentage</p>
              <h3 className="text-3xl font-bold text-on-surface mt-1">94.2%</h3>
              <p className="text-xs text-[#10B981] font-semibold mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span> 121 of 128 students
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">fact_check</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 soft-bloom shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tests Evaluated</p>
              <h3 className="text-3xl font-bold text-on-surface mt-1">18</h3>
              <p className="text-xs text-on-surface-variant font-semibold mt-1">
                2 pending reviews
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">assignment</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 soft-bloom shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Attendance Rate</p>
              <h3 className="text-3xl font-bold text-on-surface mt-1">92.8%</h3>
              <p className="text-xs text-[#10B981] font-semibold mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span> +1.5% this month
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">event_available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Class Comparison Table & Top Achievers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Wise Breakdown */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 soft-bloom shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display text-on-surface">Class Performance Breakdown</h3>
            <span className="text-xs font-semibold text-on-surface-variant">Mathematics Department</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface-variant text-xs font-bold text-on-surface-variant uppercase">
                  <th className="pb-3">Class</th>
                  <th className="pb-3">Enrolled</th>
                  <th className="pb-3">Avg Score</th>
                  <th className="pb-3">Attendance</th>
                  <th className="pb-3 text-right">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/40">
                {PERFORMANCE_DATA.map((row) => (
                  <tr key={row.class} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 font-bold text-sm text-on-surface">{row.class}</td>
                    <td className="py-3.5 text-sm text-on-surface-variant">{row.students}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-on-surface">{row.avgScore}%</span>
                        <div className="w-16 bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${row.avgScore}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-sm font-semibold text-on-surface">{row.attendance}%</td>
                    <td className="py-3.5 text-right font-bold text-sm text-[#10B981]">{row.passRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant p-6 soft-bloom shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display text-on-surface">Top Performers</h3>
            <span className="material-symbols-outlined text-primary text-[20px]">emoji_events</span>
          </div>
          <div className="space-y-3">
            {TOP_PERFORMERS.map((student) => (
              <div key={student.rank} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-variant/40">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    student.rank === 1 ? 'bg-amber-400 text-slate-900' : student.rank === 2 ? 'bg-slate-300 text-slate-900' : 'bg-amber-700 text-white'
                  }`}>
                    #{student.rank}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">{student.name}</h4>
                    <p className="text-[11px] text-on-surface-variant font-medium">{student.class} • {student.badge}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">{student.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProgress;
