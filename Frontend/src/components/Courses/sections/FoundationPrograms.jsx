import React from "react";
import { FOUNDATION_PROGRAMS } from "../../../mockData/coursesData";

const FoundationPrograms = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface-container-low" id="foundation">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="mb-16 border-b border-outline-variant/30 pb-8">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Foundation &amp; Middle School
          </h2>
          <p className="text-lg text-on-surface-variant max-w-xl">
            Building a robust conceptual understanding to prepare students for future academic
            challenges. Focus on critical thinking over rote learning.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FOUNDATION_PROGRAMS.map((program) => (
            <div
              key={program.class}
              className={
                program.popular
                  ? "bg-surface-container-lowest rounded-2xl p-8 soft-shadow border border-primary/30 flex flex-col h-full relative hover:-translate-y-1 transition-transform duration-300"
                  : "bg-surface-container-lowest rounded-2xl p-8 soft-shadow border border-outline-variant/20 flex flex-col h-full relative hover:-translate-y-1 transition-transform duration-300"
              }
            >
              {program.popular && (
                <span className="absolute -top-3 -right-3 gradient-btn text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider soft-shadow">
                  Popular
                </span>
              )}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-4">
                  {program.class}
                </span>
                <h3 className="text-xl font-bold text-on-surface mb-2">{program.title}</h3>
                <p className="text-on-surface-variant">{program.description}</p>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                {program.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-0.5">
                      check_circle
                    </span>
                    <span className="text-on-surface">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6 border-t border-outline-variant/20 mt-auto">
                <div className="flex items-center gap-2 mb-4 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-outline">schedule</span>
                  {program.schedule}
                </div>
                <button
                  type="button"
                  className="w-full py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all"
                >
                  Explore Program
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundationPrograms;
