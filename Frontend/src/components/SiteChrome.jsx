import React from "react";
import { Link } from "react-router-dom";

export const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Results", path: "/#results" },
  { label: "Courses", path: "/#courses" },
  { label: "Contact", path: "/#contact" },
];

const NavItem = ({ path, className, children }) => {
  if (path.includes("#")) {
    return (
      <a className={className} href={path}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={path}>
      {children}
    </Link>
  );
};

export const SiteNav = ({ active = "Home" }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-white/20 shadow-[0_10px_30px_-5px_rgba(37,99,235,0.08)]">
      <div className="max-w-[1280px] mx-auto px-6 flex justify-between items-center h-20">
        <Link className="text-2xl font-bold text-primary" to="/">
          Online Learning Portal
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavItem
              key={link.label}
              path={link.path}
              className={
                link.label === active
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-on-surface-variant hover:text-primary transition-colors hover:opacity-90 transition-all duration-300"
              }
            >
              {link.label}
            </NavItem>
          ))}
        </div>
        <a
          className="hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded-[1.25rem] gradient-btn text-white font-semibold soft-shadow hover:opacity-90 transition-all active:scale-95 transition-transform"
          href="/#enroll"
        >
          Enroll Now
        </a>
        <button className="md:hidden text-on-surface p-2">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </nav>
  );
};

export const SiteFooter = () => {
  return (
    <footer className="relative w-full bg-surface-container-highest border-t border-outline-variant mt-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 py-[120px] grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-2xl font-bold text-primary mb-4">Online Learning Portal</h3>
          <p className="text-on-surface-variant mb-6">
            Excellence in Education since 2011. Building foundations for future leaders.
          </p>
        </div>
        <div>
          <h4 className="text-2xl text-on-surface mb-4">Quick Links</h4>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavItem
                  path={link.path}
                  className="text-on-surface-variant hover:text-primary transition-colors hover:translate-x-1 transition-transform duration-200 inline-block"
                >
                  {link.label}
                </NavItem>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-2xl text-on-surface mb-4">Contact Info</h4>
          <ul className="space-y-3 text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <span>123 Education Hub, Knowledge City, State - 400001</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">call</span>
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">mail</span>
              <span>info@onlinelearningportal.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-outline-variant/30 py-6 text-center">
        <p className="text-on-surface-variant">
          © 2026 Online Learning Portal. Excellence in Education.
        </p>
      </div>
    </footer>
  );
};
