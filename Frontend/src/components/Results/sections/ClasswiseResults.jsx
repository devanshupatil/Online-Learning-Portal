import React from "react";
import { CLASSWISE_RESULTS } from "../../../mockData/resultsData";

const ClasswiseResults = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="classwise-results">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Class-wise Results
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {CLASSWISE_RESULTS.map((c) => (
            <div
              key={c.class}
              className="bg-surface p-6 rounded-2xl soft-shadow border border-outline-variant/20 hover:-translate-y-1 transition-transform duration-300"
            >
              <h3 className="text-xl font-bold text-primary mb-4">{c.class}</h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li className="flex justify-between">
                  <span>Appeared</span>
                  <span className="font-semibold text-on-surface">{c.appeared}</span>
                </li>
                <li className="flex justify-between">
                  <span>Pass %</span>
                  <span className="font-semibold text-on-surface">{c.passPercentage}%</span>
                </li>
                <li className="flex justify-between">
                  <span>Highest Score</span>
                  <span className="font-semibold text-on-surface">{c.highestScore}%</span>
                </li>
                <li className="flex justify-between">
                  <span>80%+ Students</span>
                  <span className="font-semibold text-on-surface">{c.eightyPlusCount}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClasswiseResults;
