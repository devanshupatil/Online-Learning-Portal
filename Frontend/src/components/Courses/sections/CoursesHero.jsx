import React from "react";

const CoursesHero = () => {
  const scrollToFoundation = (e) => {
    e.preventDefault();
    document.getElementById("foundation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-20 pb-16 md:pb-[120px] overflow-hidden bg-surface" id="courses-hero">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-10" />
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-secondary rounded-full mix-blend-multiply filter blur-[100px] opacity-10" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-wider mb-8 border border-primary-fixed/50 shadow-sm">
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          Academic Excellence Defined
        </span>
        <h1 className="font-display text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] text-on-surface mb-6 tracking-tight">
          Elevate Your Potential.
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10">
          Comprehensive academic programs engineered for rigor, clarity, and success. From middle
          school foundations to competitive exam mastery.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            className="inline-flex items-center justify-center px-6 py-[6px] rounded-full gradient-btn text-white font-semibold soft-shadow hover:opacity-90 transition-all hover:-translate-y-1 text-center h-9"
            href="#foundation"
            onClick={scrollToFoundation}
          >
            View Foundation
          </a>
          <span
            className="inline-flex items-center justify-center gap-2 px-6 py-[6px] rounded-full border-2 border-outline-variant text-on-surface-variant/60 font-semibold h-9 cursor-not-allowed select-none"
            title="High School programs coming soon"
          >
            View High School
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container-high">
              Soon
            </span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default CoursesHero;
