import React from "react";
import { RESULTS_OVERALL_STATS } from "../../../mockData/resultsData";

const statCards = [
  { icon: "military_tech", key: "passRate", suffix: "%+", label: "Overall Pass Rate" },
  { icon: "flag", key: "students80Plus", suffix: "+", label: "Students Scored 80%+" },
  { icon: "star", key: "students90Plus", suffix: "+", label: "Students Scored 90%+" },
  { icon: "workspace_premium", key: "toppers", suffix: "+", label: "School/College Toppers" },
  { icon: "trending_up", key: "yearsConsistent", suffix: "", label: "Years of Consistent Results" },
];

const OverallStats = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="overall-stats">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Numbers That Speak for Themselves
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((card) => (
            <div
              key={card.key}
              className="bg-surface p-8 rounded-2xl soft-shadow text-center border border-outline-variant/20 hover:-translate-y-1 transition-transform duration-300"
            >
              <span className="material-symbols-outlined text-primary text-[40px] mb-4 inline-block">
                {card.icon}
              </span>
              <div className="text-3xl font-bold text-on-surface mb-1">
                {RESULTS_OVERALL_STATS[card.key]}
                {card.suffix}
              </div>
              <p className="text-on-surface-variant">{card.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OverallStats;
