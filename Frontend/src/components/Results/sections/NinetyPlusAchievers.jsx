import React from "react";
import AchieverCard from "./AchieverCard";
import { ACHIEVERS_90_PLUS } from "../../../mockData/resultsData";

const NinetyPlusAchievers = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface" id="ninety-plus-achievers">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            90%+ Achievers
          </h2>
          <p className="text-lg text-on-surface-variant">
            Students who crossed the 90% mark this year.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ACHIEVERS_90_PLUS.map((a) => (
            <AchieverCard key={a.name} {...a} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NinetyPlusAchievers;
