import React from "react";
import { useTranslation } from "react-i18next";
import { SiteNav, SiteFooter } from "./SiteChrome";

const methodology = [
  {
    step: 1,
    icon: "menu_book",
    titleKey: "aboutMethodologyStep1Title",
    textKey: "aboutMethodologyStep1Text",
  },
  {
    step: 2,
    icon: "edit_document",
    titleKey: "aboutMethodologyStep2Title",
    textKey: "aboutMethodologyStep2Text",
  },
  {
    step: 3,
    icon: "quiz",
    titleKey: "aboutMethodologyStep3Title",
    textKey: "aboutMethodologyStep3Text",
  },
  {
    step: 4,
    icon: "analytics",
    titleKey: "aboutMethodologyStep4Title",
    textKey: "aboutMethodologyStep4Text",
  },
  {
    step: 5,
    icon: "trending_up",
    titleKey: "aboutMethodologyStep5Title",
    textKey: "aboutMethodologyStep5Text",
  },
  {
    step: 6,
    icon: "workspace_premium",
    titleKey: "aboutMethodologyStep6Title",
    textKey: "aboutMethodologyStep6Text",
    highlight: true,
  },
];

const faculty = [
  {
    name: "Dr. A. Wakhare",
    roleKey: "aboutFacultyRole1",
    credentialsKey: "aboutFacultyCredentials1",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQH2a7sescF-N1ciBsCeqIsNILgPrPLAZmKWKogdEsuPF06cCF_hsG_jvk-xZAaE54sU4lZ0DQ3QlWnl40aLydukEN2jj7CdK9se_LFLl4MQP4VDJ29_MJzYKV8ifGzfPSZCompSv8Q0MZNgqUqGEkJpeQCoPgseJX6IHBsYb-p8a30SFzVl33a5UTTOAARW9mxkBC8g9v0Scs9pPMWn9LK4r7f3bAcfdLZduLCBrDOreAQ4vPLUd0",
  },
  {
    name: "Prof. S. Mehta",
    roleKey: "aboutFacultyRole2",
    credentialsKey: "aboutFacultyCredentials2",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOzmAFCU7GvasHMXANUtYXi16OULhDnPyywfv19SO4IR2NbnBbyuXrF0S9iqwtMZFnpFPTtP-M0kMA8ekTakkNZSz6urnZXSJHZsw7c5erN63XwePX2LzL6NHzVuapovNBM0tVe65xQC1LlX3vTX4UXyEEiuWfDVeSzU64akTk5DKGJAAlxCOeyOY8e-c0YT6VYiw-P7js0bjfggWH53sbQc2n-FpZyFNVBGoZMdvUCRBVb208CIFl",
  },
  {
    name: "Mr. R. Deshmukh",
    roleKey: "aboutFacultyRole3",
    credentialsKey: "aboutFacultyCredentials3",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFhanuswmGgbQDHu7ATP7U4qtL1SI30xeG2cREqdKOMomoGWynrJWOsCTwUcwew8jMT5dpvoDlDs4z7ge4vV6t07v7grjBrorT5CNEhK-Dgwf5XWmFRZ0fcotZHBenCfVdL3z2Bn8GhwRwiqhN_rUNHO2qBQ1J3Rv3gQquM1gwF6tgcSYdLdyjxcTkk6-w3OPNr3gSye1FogvmdjeFaGkVQGqNG_6Fv3qPAP4o3pVvO94trUb89H3l",
  },
  {
    name: "Dr. N. Joshi",
    roleKey: "aboutFacultyRole4",
    credentialsKey: "aboutFacultyCredentials4",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLuUwlIHp5fca-hAVK3sNiKK1G6VqeXiEJ2l6deRbnE9ddfp6pIK4uHF-1I7IJwGxN2UBjaH_agCGh7IPu3ccaXp29Y3NOq9x9Gxrd7SwhgXjsn5F57lISKf_KIx5kaMOUxFL02tGsvfAVZwvGNyuoKcrnxtcPxqGwIcyOzyzqdQeZo6NAhQh43ai6IL59dndtKSuhyKzQaVjMMnWwdjY9IicKBMpVphTFOZnUPz0j49kt6sQweL-S",
  },
];

const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden">
      <SiteNav active="About" />

      {/* Hero Section */}
      <section className="max-w-[1280px] mx-auto px-6 pt-32 pb-16 md:pb-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-block py-1.5 px-3 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-wider">
              {t("aboutHeroBadge")}
            </span>
            <h1 className="text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] font-extrabold text-on-surface tracking-tight">
              {t("aboutHeroTitle")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {t("aboutHeroTitleHighlight")}
              </span>
              .
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-xl">
              {t("aboutHeroText")}
            </p>
          </div>
          <div className="relative h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden soft-shadow">
            <img
              alt={t("aboutHeroImageAlt")}
              className="absolute inset-0 w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV90c5Hd7AJbn0TTFoipqCyOpNA4EfswSGMrj-qzfwtH9vy81jnPxhnSM07NEQuswkmIqTEH9nY_96wfq5DCskZ2iBtgKj3nQuZXNMUm2ZQ6mcg3KhNM-qIZpXNHjsG7BQixX9KQuuBhTAzn-xKDFRqdRFAuP8HZGPnK_Ff9aYJjhgsdW_l-nnCFyd9GIOmiBFLLPG9Oh9roJniHJHov6QBzOewk-pwtsnezGJPu8kqQciIW7KQeZe"
            />
            <div className="absolute bottom-6 left-6 right-6 p-6 glass-panel rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">school</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">{t("aboutHeroStatValue")}</h3>
                  <p className="text-on-surface-variant">{t("aboutHeroStatLabel")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-surface-container-low py-16 md:py-[120px] border-y border-outline-variant/10">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-10 rounded-2xl soft-shadow flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">explore</span>
              </div>
              <h2 className="text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] font-bold text-on-surface tracking-tight">
                {t("aboutMissionTitle")}
              </h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                {t("aboutMissionText")}
              </p>
            </div>
          </div>
          <div className="bg-primary text-primary-foreground p-10 rounded-2xl soft-shadow flex flex-col justify-between relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="space-y-6 relative z-10">
              <div className="w-14 h-14 rounded-xl bg-white/20 text-primary-foreground flex items-center justify-center backdrop-blur-sm">
                <span className="material-symbols-outlined text-3xl">visibility</span>
              </div>
              <h2 className="text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] font-bold tracking-tight">
                {t("aboutVisionTitle")}
              </h2>
              <p className="text-lg text-primary-foreground/90 leading-relaxed">
                {t("aboutVisionText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Teaching Methodology */}
      <section className="max-w-[1280px] mx-auto px-6 py-16 md:py-[120px]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] font-bold text-on-surface tracking-tight mb-4">
            {t("aboutMethodologyTitle")}
          </h2>
          <p className="text-lg text-on-surface-variant">
            {t("aboutMethodologySubtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {methodology.map((item) => (
            <div
              key={item.step}
              className={
                item.highlight
                  ? "bg-surface-container-lowest p-8 rounded-2xl soft-shadow border border-outline-variant/20 border-l-4 border-l-primary hover:border-primary/30 transition-colors"
                  : "bg-surface-container-lowest p-8 rounded-2xl soft-shadow border border-outline-variant/20 hover:border-primary/30 transition-colors"
              }
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={
                    item.highlight
                      ? "w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold"
                      : "w-10 h-10 rounded-full bg-surface-variant text-on-surface flex items-center justify-center font-bold"
                  }
                >
                  {item.step}
                </div>
                <span className="material-symbols-outlined text-3xl text-primary">
                  {item.icon}
                </span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">{t(item.titleKey)}</h3>
              <p className="text-on-surface-variant">{t(item.textKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Our Faculty */}
      <section className="bg-surface-bright py-16 md:py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] font-bold text-on-surface tracking-tight mb-4">
                {t("aboutFacultyTitle")}
              </h2>
              <p className="text-lg text-on-surface-variant">
                {t("aboutFacultySubtitle")}
              </p>
            </div>
            <a
              className="text-primary text-lg font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity"
              href="/#contact"
            >
              {t("aboutFacultyViewAllLink")}
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {faculty.map((member) => (
              <div key={member.name} className="group">
                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 soft-shadow bg-surface-variant">
                  <img
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={member.img}
                  />
                </div>
                <h3 className="text-xl font-bold text-on-surface">{member.name}</h3>
                <p className="text-primary font-medium mb-1">{t(member.roleKey)}</p>
                <p className="text-on-surface-variant text-sm">{t(member.credentialsKey)}</p>
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
