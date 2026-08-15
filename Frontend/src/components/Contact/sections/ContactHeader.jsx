import React from "react";
import { useTranslation } from "react-i18next";

const ContactHeader = () => {
  const { t } = useTranslation();

  return (
    <section className="max-w-[1280px] mx-auto px-6 mb-16 text-center md:text-left">
      <h1 className="font-display text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] text-on-surface mb-4 tracking-tight">
        {t("contactHeroTitle")}
      </h1>
      <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl">
        {t("contactHeroSubtitle")}
      </p>
    </section>
  );
};

export default ContactHeader;
