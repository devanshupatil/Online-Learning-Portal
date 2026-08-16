import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { RESULTS_BY_YEAR } from "../../../mockData/resultsData";

const YearwiseResults = () => {
  const { t } = useTranslation();
  const [activeYear, setActiveYear] = useState(RESULTS_BY_YEAR[0].year);
  const active = RESULTS_BY_YEAR.find((r) => r.year === activeYear) ?? RESULTS_BY_YEAR[0];

  const metrics = [
    { label: t("yearwiseResultsTotalStudentsLabel"), value: active.totalStudents },
    { label: t("yearwiseResultsPassPercentageLabel"), value: `${active.passPercentage}%` },
    { label: t("yearwiseResultsEightyPlusLabel"), value: active.eightyPlusCount },
    { label: t("yearwiseResultsNinetyPlusLabel"), value: active.ninetyPlusCount },
    { label: t("yearwiseResultsHighestPercentageLabel"), value: `${active.highestPercentage}%` },
  ];

  return (
    <section className="py-16 md:py-[120px] bg-surface" id="year-wise-results">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            {t("yearwiseResultsTitle")}
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {RESULTS_BY_YEAR.map((r) => (
            <button
              key={r.year}
              type="button"
              onClick={() => setActiveYear(r.year)}
              className={
                r.year === activeYear
                  ? "px-5 py-2 rounded-full bg-primary text-white font-semibold soft-shadow transition-all"
                  : "px-5 py-2 rounded-full bg-surface-container-lowest text-on-surface-variant font-semibold border border-outline-variant/30 hover:border-primary/40 transition-all"
              }
            >
              {r.year}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-surface-container-lowest p-6 rounded-2xl soft-shadow text-center border border-outline-variant/20"
            >
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{m.value}</div>
              <p className="text-sm text-on-surface-variant">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YearwiseResults;
