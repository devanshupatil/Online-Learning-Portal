import React from "react";
import classroomImage from "../assets/bgImage.png";
import { SiteNav, SiteFooter } from "./SiteChrome";

const features = [
  {
    icon: "school",
    title: "Elite Faculty",
    text: "Instruction delivered by distinguished educators with proven track records of shaping top performers.",
  },
  {
    icon: "menu_book",
    title: "Rigorous Curriculum",
    text: "A structured, comprehensive syllabus designed to challenge students and ensure mastery of core concepts.",
  },
  {
    icon: "insights",
    title: "Continuous Evaluation",
    text: "Frequent, uncompromising assessments to pinpoint weaknesses and reinforce strengths methodically.",
  },
];

const achievers = [
  {
    name: "Rahul D.",
    score: "99.8%",
    exam: "STATE BOARD",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCPB6PanccHwjEg26SbRgbDLvHYCDZTdfwOJ5hBz3kLcrLyD6i_DFcSU6Yzm2yTeItJstVvfcpwDLsTngIqydJvzSMxU7BT1GxL7pW7Gqlg-ATMimGcjTw7YAXWCVd0fE1Z-c0cMYeWP6S6Kx2gPR8XkFvUKQz8-mPvtZogywGbh4VbX3YD6lAMF4IuiKBXkXzNJfcETraxsrhMlKCpQ2xeewwHdNURHoSp95LntjvcJyzyMJ1w2fm1",
  },
  {
    name: "Ananya S.",
    score: "99.5%",
    exam: "JEE ADVANCED",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1fqIA9GJ_jSFCZiBJXXWEKk5iNbUKZMQLNaMtZqbO3Bh1bI25vgkxKIKOxXiX8MIHhnFVUSbgLdZaPaaX6CE2PAiZfa14g0o7CfGaiW5KriBJFS_QsENNhkawgsZw__Pljstr4Ou5NTxf3QtfQ_xmDEs3my_951wJMoFPnEjV9VPckcamsQXH5hB5N_NYjdGheOhQMdLQNUXjSRdb_iAQjq4j7ZuUyOT-9WCV4jHFyXPThD0oC54u",
  },
  {
    name: "Vikram P.",
    score: "99.2%",
    exam: "NEET",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYde61gYFrXNFnhxULyfnHzs9hQLItRWyLm4wMUsiMjMw6ptCWHEhnEVnnW0KzFqSb-72cgBga9Pj1BGZ_PysX6y5v6zK7M9-HmkNJYNc3gw0Q0h7vuy_QESkoyN-BXQz-y9vRe6weFnEvG1PLL8tk5i6prn88QMn30ii2GYu05_HfY0ysh2gR598W08WeoFcFA12yq9lo0SbNodntDUHoHQyoWCBmvNsgXD7TBspJT9PA5yQDS9EA",
  },
  {
    name: "Priya M.",
    score: "98.9%",
    exam: "STATE BOARD",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkSw1FBi4YyIz80chf-MshSExOe3TXUe0C7sn_Bm1KntQxk_ig7HmK7ickbMHPGkRPNmIR39U9Ldk7o9fS9ZzCewaCWTRqHf26-ac0AcFNNvSklkjsxK4zEtZbagqb-2JP455xPgOhHIUycf7tbVLG2vM5sRzYUqtVt-y5URchmFCMX9OZ3Dd-NXZmrZ9Gvmn77XaOhKFfv_MGme9qFvxwootHsRZG3HacUaUgPsOdtUEehUoKpc9V",
  },
];

const AboutPage = () => {
  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden">
      <SiteNav active="About" />

      {/* Hero Section */}
      <section className="relative pt-40 pb-16 md:pb-[120px] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 flex flex-col items-start text-left gap-6">
            <span className="glass-panel px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">school</span>
              ABOUT US
            </span>
            <h1 className="text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] font-extrabold text-on-surface max-w-lg tracking-tight">
              Excellence in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Academic Rigor
              </span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-md">
              Cultivating brilliant minds through disciplined study, expert guidance, and an
              unwavering commitment to success.
            </p>
            <a
              className="px-8 py-4 rounded-[1.25rem] gradient-btn text-white font-semibold soft-shadow hover:opacity-90 transition-all hover:-translate-y-1 text-center"
              href="/#courses"
            >
              Discover Our Methodology
            </a>
          </div>
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl overflow-hidden soft-shadow">
              <img
                alt="Modern bright classroom"
                className="w-full h-96 object-cover"
                src={classroomImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-[120px] bg-surface-container-lowest relative">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-panel rounded-2xl p-8 soft-shadow transform transition-transform hover:-translate-y-2"
            >
              <span className="material-symbols-outlined text-primary text-[36px] mb-4 block">
                {feature.icon}
              </span>
              <h3 className="text-xl font-bold text-on-surface mb-2">{feature.title}</h3>
              <p className="text-on-surface-variant">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Star Achievers Section */}
      <section className="py-16 md:py-[120px] bg-surface relative">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-primary bg-primary/10 mb-4">
              OUR PROUD LEGACY
            </span>
            <h2 className="text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface font-bold tracking-tight">
              Star Achievers
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievers.map((achiever) => (
              <div
                key={achiever.name}
                className="glass-panel rounded-2xl p-6 text-center soft-shadow transform transition-transform hover:-translate-y-2"
              >
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-primary/20">
                  <img
                    alt={achiever.name}
                    className="w-full h-full object-cover"
                    src={achiever.img}
                  />
                </div>
                <div className="text-xl font-bold text-on-surface mb-1">{achiever.name}</div>
                <div className="text-3xl font-bold text-primary mb-2">{achiever.score}</div>
                <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full uppercase tracking-wider">
                  {achiever.exam}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default AboutPage;
