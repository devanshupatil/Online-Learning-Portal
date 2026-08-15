import React from "react";
import InitialsAvatar from "../../ui/InitialsAvatar";
import { SUCCESS_STORIES } from "../../../mockData/resultsData";

const SuccessStories = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="success-stories">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Student Success Stories
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SUCCESS_STORIES.map((s) => (
            <div
              key={s.name}
              className="bg-surface p-8 rounded-2xl soft-shadow border border-outline-variant/20 flex flex-col gap-6"
            >
              <div className="flex items-center gap-4">
                <InitialsAvatar name={s.name} size="md" />
                <h3 className="text-xl font-bold text-on-surface">{s.name}</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-primary font-bold uppercase tracking-wider text-xs">
                    Challenge
                  </span>
                  <p className="text-on-surface-variant mt-1">{s.challenge}</p>
                </div>
                <div>
                  <span className="text-primary font-bold uppercase tracking-wider text-xs">
                    Preparation
                  </span>
                  <p className="text-on-surface-variant mt-1">{s.preparation}</p>
                </div>
                <div>
                  <span className="text-primary font-bold uppercase tracking-wider text-xs">
                    Result
                  </span>
                  <p className="text-on-surface-variant mt-1">{s.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
