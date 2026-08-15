import React from "react";
import AchieverCard from "./AchieverCard";
import { TOP_ACHIEVERS } from "../../../mockData/resultsData";

const TopAchievers = () => {
  const featured = TOP_ACHIEVERS.find((a) => a.featured) ?? TOP_ACHIEVERS[0];
  const rest = TOP_ACHIEVERS.filter((a) => a !== featured);

  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="top-achievers">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Top Achievers
          </h2>
          <p className="text-lg text-on-surface-variant">
            Our highest scorers, leading from the front.
          </p>
        </div>
        <div className="max-w-md mx-auto mb-12">
          <AchieverCard {...featured} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {rest.map((a) => (
            <AchieverCard key={a.name} {...a} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopAchievers;
