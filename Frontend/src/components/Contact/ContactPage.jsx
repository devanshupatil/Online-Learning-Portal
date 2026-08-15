import React from "react";
import { SiteNav, SiteFooter } from "../SiteChrome";
import ContactHeader from "./sections/ContactHeader";
import InquiryForm from "./sections/InquiryForm";
import ContactDetails from "./sections/ContactDetails";

const ContactPage = () => {
  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden">
      <SiteNav active="Contact" />
      <main className="pt-32 pb-16 md:pb-[120px]">
        <ContactHeader />
        <section className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <InquiryForm />
          <ContactDetails />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ContactPage;
