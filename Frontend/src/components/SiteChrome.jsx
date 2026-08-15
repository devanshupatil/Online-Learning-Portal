import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ButtonWithIcon from "./ui/button-witn-icon";

export const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Results", path: "/#results" },
  { label: "Courses", path: "/#courses" },
  { label: "Contact", path: "/#contact" },
];

const NavItem = ({ path, className, children, onClick }) => {
  if (path.includes("#")) {
    return (
      <a className={className} href={path} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={path} onClick={onClick}>
      {children}
    </Link>
  );
};

export const SiteNav = ({ active = "Home" }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-white/20 shadow-[0_10px_30px_-5px_rgba(37,99,235,0.08)]">
        <div className="w-full pl-6 pr-6 flex justify-between items-center h-20">
          <Link className="font-display text-2xl font-bold text-primary" to="/">
            EduLearning Platform
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-lg">
            {navLinks.map((link) => (
              <NavItem
                key={link.label}
                path={link.path}
                className={
                  link.label === active
                    ? "font-bold text-primary border-b-2 border-primary pb-1"
                    : "font-bold text-on-surface-variant hover:text-primary transition-colors hover:opacity-90 transition-all duration-300"
                }
              >
                {link.label}
              </NavItem>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-[1.25rem] border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all"
              href="/#enroll"
            >
              Enroll Now
            </a>
            <ButtonWithIcon label="Login" onClick={() => navigate("/login")} />
          </div>
          <button
            className="md:hidden text-on-surface p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-1/2 z-50 bg-surface-container-lowest shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] md:hidden flex flex-col">
            <div className="flex justify-between items-center h-20 px-6 border-b border-outline-variant">
              <span className="font-display text-xl font-bold text-primary">
                Menu
              </span>
              <button
                className="text-on-surface p-2"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col px-6 py-4 gap-2 overflow-y-auto">
              {navLinks.map((link) => (
                <NavItem
                  key={link.label}
                  path={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={
                    link.label === active
                      ? "font-bold text-primary py-3 border-b-2 border-primary"
                      : "font-bold text-on-surface-variant hover:text-primary transition-colors py-3"
                  }
                >
                  {link.label}
                </NavItem>
              ))}
              <a
                className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-[1.25rem] border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all"
                href="/#enroll"
                onClick={() => setMenuOpen(false)}
              >
                Enroll Now
              </a>
              <ButtonWithIcon
                label="Login"
                className="w-full"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export const SiteFooter = () => {
  return (
    <footer className="relative w-full bg-surface-container-highest border-t border-outline-variant mt-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 py-[120px] grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-1">
          <h3 className="font-display text-2xl text-primary mb-4">EduLearning Platform</h3>
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
              <span>info@edulearningplatform.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-outline-variant/30 py-6 text-center">
        <p className="text-on-surface-variant">
          © 2026 EduLearning Platform. Excellence in Education.
        </p>
      </div>
    </footer>
  );
};
