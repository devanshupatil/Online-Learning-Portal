import React from "react";
import InitialsAvatar from "../../ui/InitialsAvatar";
import { SUBJECT_TOPPERS } from "../../../mockData/resultsData";

const SubjectToppers = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface" id="subject-toppers">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Subject-wise Toppers
          </h2>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl soft-shadow border border-outline-variant/20 overflow-hidden">
          <div className="hidden md:grid grid-cols-3 px-8 py-4 bg-surface-container-low text-on-surface-variant text-sm font-bold uppercase tracking-wider">
            <span>Subject</span>
            <span>Student</span>
            <span className="text-right">Marks</span>
          </div>
          {SUBJECT_TOPPERS.map((row) => (
            <div
              key={row.subject}
              className="grid grid-cols-1 md:grid-cols-3 items-center gap-3 px-8 py-5 border-t border-outline-variant/10 first:border-t-0"
            >
              <span className="font-semibold text-on-surface">{row.subject}</span>
              <span className="flex items-center gap-3 text-on-surface-variant">
                <InitialsAvatar name={row.studentName} size="sm" />
                {row.studentName}
              </span>
              <span className="md:text-right font-bold text-primary">
                {row.marks}/{row.totalMarks}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectToppers;
