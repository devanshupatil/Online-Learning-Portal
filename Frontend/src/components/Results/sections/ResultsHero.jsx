import React from "react";

const ResultsHero = () => {
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface to-secondary/10" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 text-center flex flex-col items-center py-16">
        <span className="glass-panel px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-primary mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">emoji_events</span>
          RESULTS 2025–26
        </span>
        <h1 className="font-display text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] text-on-surface mb-6 max-w-4xl mx-auto tracking-tight">
          Our Results,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Our Pride
          </span>
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10">
          Celebrating the hard work and success of our students.
        </p>
        <a
          className="inline-flex items-center justify-center px-6 py-[6px] rounded-full gradient-btn text-white font-semibold soft-shadow hover:opacity-90 transition-all hover:-translate-y-1 text-center h-9"
          href="#top-achievers"
          onClick={scrollToAchievers}
        >
          View Our Achievers
        </a>
      </div>
    </section>
  );
};

export default ResultsHero;
