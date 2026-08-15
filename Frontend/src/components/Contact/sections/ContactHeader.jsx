import React from "react";

const ContactHeader = () => {
  return (
    <section className="max-w-[1280px] mx-auto px-6 mb-16 text-center md:text-left">
      <h1 className="font-display text-[40px] leading-[48px] md:text-[64px] md:leading-[72px] text-on-surface mb-4 tracking-tight">
        Get in Touch
      </h1>
      <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl">
        Whether you have questions about our academic programs, need assistance with enrollment,
        or want to schedule a campus tour, our dedicated team is here to help you take the next
        step toward excellence.
      </p>
    </section>
  );
};

export default ContactHeader;
