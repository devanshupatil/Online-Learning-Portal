import React from "react";
import { useTranslation } from "react-i18next";
import resultsHeroBg from "../../../assets/resultsHeroBg.png";

const ResultsHero = () => {
  const { t } = useTranslation();
  const scrollToAchievers = (e) => {
    e.preventDefault();
    document.getElementById("top-achievers")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center pt-20 overflow-hidden bg-surface"
      id="results-hero"
    >
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${resultsHeroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/65" />
        <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-b from-transparent to-surface" />
      </div>
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 text-center flex flex-col items-center py-16">
        <span className="glass-panel px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-primary mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">emoji_events</span>
          {t("resultsHeroBadge")}
        </span>
        <h1 className="font-display text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] text-white mb-6 max-w-4xl mx-auto tracking-tight">
          {t("resultsHeroTitle")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary dark:from-tertiary dark:to-tertiary">
            {t("resultsHeroTitleHighlight")}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
          {t("resultsHeroSubtitle")}
        </p>
        <a
          className="inline-flex items-center justify-center px-6 py-[6px] rounded-full gradient-btn text-white font-semibold soft-shadow hover:opacity-90 transition-all hover:-translate-y-1 text-center h-9"
          href="#top-achievers"
          onClick={scrollToAchievers}
        >
          {t("resultsHeroViewAchieversBtn")}
        </a>
      </div>
    </section>
  );
};

export default ResultsHero;
