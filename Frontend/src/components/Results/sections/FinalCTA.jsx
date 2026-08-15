import React from "react";

const FinalCTA = () => {
  return (
    <section
      className="py-16 md:py-[120px] bg-primary text-white relative overflow-hidden"
      id="final-cta"
    >
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="max-w-[1280px] mx-auto px-6 text-center relative z-10">
        <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] tracking-tight mb-4">
          Want to Be Our Next Star Achiever?
        </h2>
        <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
          Start your journey with EduLearning Platform today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            className="inline-flex items-center justify-center px-6 py-[6px] rounded-full bg-white text-primary font-semibold soft-shadow hover:opacity-90 transition-all hover:-translate-y-1 text-center h-9"
            href="/#courses"
          >
            Explore Courses
          </a>
          <a
            className="inline-flex items-center justify-center px-6 py-[6px] rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all text-center h-9"
            href="/#enroll"
          >
            Enroll Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
