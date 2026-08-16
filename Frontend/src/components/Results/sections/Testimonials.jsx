import React from "react";
import { useTranslation } from "react-i18next";
import InitialsAvatar from "../../ui/InitialsAvatar";
import { RESULT_TESTIMONIALS } from "../../../mockData/resultsData";

const Testimonials = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="testimonials">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            {t("testimonialsTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESULT_TESTIMONIALS.map((item) => (
            <div
              key={item.name}
              className="bg-surface p-8 rounded-2xl soft-shadow border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-primary text-[32px] mb-4 inline-block">
                format_quote
              </span>
              <p className="text-on-surface-variant mb-6 italic">&ldquo;{t(item.quoteKey)}&rdquo;</p>
              <div className="flex items-center gap-3">
                <InitialsAvatar name={item.name} size="sm" />
                <div>
                  <div className="font-bold text-on-surface">{item.name}</div>
                  <div className="text-xs text-on-surface-variant">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
