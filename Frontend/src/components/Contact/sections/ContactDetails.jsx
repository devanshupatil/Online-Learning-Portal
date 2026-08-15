import React from "react";

const ContactDetails = () => {
  return (
    <div className="lg:col-span-5 flex flex-col gap-6">
      <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-outline-variant/20 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary">location_on</span>
        </div>
        <div>
          <h3 className="font-semibold text-on-surface mb-1">Campus Address</h3>
          <p className="text-on-surface-variant leading-relaxed">
            123 Education Hub, Knowledge City,
            <br />
            State - 400001
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-outline-variant/20 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-secondary">call</span>
        </div>
        <div>
          <h3 className="font-semibold text-on-surface">Telephone</h3>
          <a
            className="text-on-surface-variant hover:text-primary transition-colors"
            href="tel:+919876543210"
          >
            +91 98765 43210
          </a>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-6 soft-shadow border border-outline-variant/20 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
        <div className="w-10 h-10 rounded-full bg-tertiary-container/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-tertiary-container">mail</span>
        </div>
        <div>
          <h3 className="font-semibold text-on-surface">Electronic Mail</h3>
          <a
            className="text-on-surface-variant hover:text-primary transition-colors"
            href="mailto:info@edulearningplatform.com"
          >
            info@edulearningplatform.com
          </a>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 soft-shadow h-64 relative overflow-hidden flex items-end">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px), radial-gradient(circle at 40% 80%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <span className="material-symbols-outlined text-white text-[64px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90">
          location_on
        </span>
        <div className="glass-panel py-2 px-4 rounded-full flex items-center gap-2 relative z-10">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface">
            Knowledge City
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
