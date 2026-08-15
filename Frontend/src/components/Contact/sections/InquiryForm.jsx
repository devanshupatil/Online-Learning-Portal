import React, { useState } from "react";
import { toast } from "sonner";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "Admissions Inquiry",
  message: "",
};

const inputClass =
  "bg-surface-bright border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200";

const InquiryForm = () => {
  const [form, setForm] = useState(initialForm);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thanks for reaching out! Our team will get back to you shortly.");
    setForm(initialForm);
  };

  return (
    <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-8 soft-shadow border border-outline-variant/20 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <h2 className="text-xl font-bold text-on-surface mb-6 relative z-10">Send an Inquiry</h2>
      <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-bold uppercase tracking-wider text-on-surface-variant"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              className={inputClass}
              id="firstName"
              placeholder="Jane"
              type="text"
              required
              value={form.firstName}
              onChange={handleChange("firstName")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-bold uppercase tracking-wider text-on-surface-variant"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className={inputClass}
              id="lastName"
              placeholder="Doe"
              type="text"
              required
              value={form.lastName}
              onChange={handleChange("lastName")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-xs font-bold uppercase tracking-wider text-on-surface-variant"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            className={inputClass}
            id="email"
            placeholder="jane.doe@example.com"
            type="email"
            required
            value={form.email}
            onChange={handleChange("email")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-xs font-bold uppercase tracking-wider text-on-surface-variant"
            htmlFor="subject"
          >
            Subject
          </label>
          <select
            className={`${inputClass} appearance-none cursor-pointer`}
            id="subject"
            value={form.subject}
            onChange={handleChange("subject")}
          >
            <option>Admissions Inquiry</option>
            <option>Course Information</option>
            <option>Campus Tour Scheduling</option>
            <option>Technical Support</option>
            <option>Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-xs font-bold uppercase tracking-wider text-on-surface-variant"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            className={`${inputClass} resize-none`}
            id="message"
            placeholder="How can we help you achieve your goals?"
            rows={5}
            required
            value={form.message}
            onChange={handleChange("message")}
          />
        </div>
        <button
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full gradient-btn text-white font-semibold soft-shadow hover:opacity-90 transition-all hover:-translate-y-1"
          type="submit"
        >
          Send Message
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>
      </form>
    </div>
  );
};

export default InquiryForm;
