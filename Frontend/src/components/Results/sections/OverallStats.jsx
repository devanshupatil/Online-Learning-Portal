import React from "react";
import { useTranslation } from "react-i18next";
import { RESULTS_OVERALL_STATS } from "../../../mockData/resultsData";

const statCards = [
  { icon: "military_tech", key: "passRate", suffix: "%+", labelKey: "overallStatsPassRateLabel" },
  { icon: "flag", key: "students80Plus", suffix: "+", labelKey: "overallStatsStudents80PlusLabel" },
  { icon: "star", key: "students90Plus", suffix: "+", labelKey: "overallStatsStudents90PlusLabel" },
  { icon: "workspace_premium", key: "toppers", suffix: "+", labelKey: "overallStatsSchoolTopersLabel" },
  { icon: "trending_up", key: "yearsConsistent", suffix: "", labelKey: "overallStatsYearsConsistentLabel" },
];

const OverallStats = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="overall-stats">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            {t("overallStatsTitle")}
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
              <p className="text-on-surface-variant">{t(card.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OverallStats;
