import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ButtonWithIcon from "./ui/button-witn-icon";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTheme } from "../context/ThemeContext";
import { AnimatedThemeToggle } from "./ui/animated-theme-toggle";

// `label` here is a stable English id used for route-active comparisons
// (e.g. <SiteNav active="About" />) — it is NOT displayed directly.
// Display text comes from navLabelKey via t(), so it can be translated
// without breaking the active-page highlighting logic below.
export const navLinks = [
  { label: "Home", path: "/", navLabelKey: "navHome" },
  { label: "About", path: "/about", navLabelKey: "navAbout" },
  { label: "Results", path: "/results", navLabelKey: "navResults" },
  { label: "Courses", path: "/courses", navLabelKey: "navCourses" },
  { label: "Contact", path: "/contact", navLabelKey: "navContact" },
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
  const [overHero, setOverHero] = useState(active === "Home");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const heroEl = document.getElementById("home");
    if (!heroEl) {
      setOverHero(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [active]);

  return (
    <>
      <nav
        className={
          overHero
            ? "fixed top-0 w-full z-50 bg-transparent border-b border-transparent transition-colors duration-300"
            : "fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-white/20 shadow-[0_10px_30px_-5px_rgba(37,99,235,0.08)] transition-colors duration-300"
        }
      >
        <div className="w-full pl-6 pr-6 flex justify-between items-center h-20">
          <Link
            className={
              overHero
                ? "font-display text-2xl font-bold text-white transition-colors duration-300"
                : "font-display text-2xl font-bold text-primary transition-colors duration-300"
            }
            to="/"
          >
            EduLearning Platform
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-lg">
            {navLinks.map((link) => (
              <NavItem
                key={link.label}
                path={link.path}
                className={
                  link.label === active
                    ? overHero
                      ? "font-bold text-white border-b-2 border-white pb-1 transition-colors duration-300"
                      : "font-bold text-primary border-b-2 border-primary pb-1 transition-colors duration-300"
                    : overHero
                      ? "relative inline-block font-bold text-white/85 hover:text-white transition-all duration-300 link-hover"
                      : "relative inline-block font-bold text-on-surface-variant hover:text-primary transition-all duration-300 link-hover"
                }
              >
                {t(link.navLabelKey)}
              </NavItem>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <AnimatedThemeToggle
              isDark={theme === "dark"}
              onToggle={toggleTheme}
              aria-label={t("navToggleDarkMode")}
              className={
                overHero
                  ? "h-9 w-9 rounded-full border-0 bg-transparent shadow-none text-white hover:bg-white/10"
                  : "h-9 w-9 rounded-full border-0 bg-transparent shadow-none text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              }
            />
            <a
              className={
                overHero
                  ? "inline-flex items-center justify-center px-6 py-[6px] rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all h-9"
                  : "inline-flex items-center justify-center px-6 py-[6px] rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all h-9"
              }
              href="/#enroll"
            >
              {t("navEnrollNow")}
            </a>
            <ButtonWithIcon label={t("navLogin")} onClick={() => navigate("/login")} />
          </div>
          <button
            className={
              overHero
                ? "md:hidden text-white p-2 transition-colors duration-300"
                : "md:hidden text-on-surface p-2 transition-colors duration-300"
            }
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>
      <div
        className={
          menuOpen
            ? "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden opacity-100 pointer-events-auto transition-opacity duration-300 ease-in-out"
            : "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden opacity-0 pointer-events-none transition-opacity duration-300 ease-in-out"
        }
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={
          menuOpen
            ? "fixed top-0 right-0 h-full w-1/2 z-50 bg-surface-container-lowest shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] md:hidden flex flex-col translate-x-0 transition-transform duration-300 ease-in-out"
            : "fixed top-0 right-0 h-full w-1/2 z-50 bg-surface-container-lowest shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] md:hidden flex flex-col translate-x-full transition-transform duration-300 ease-in-out"
        }
      >
        <div className="flex justify-between items-center h-20 px-6 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <AnimatedThemeToggle
              isDark={theme === "dark"}
              onToggle={toggleTheme}
              aria-label={t("navToggleDarkMode")}
              className="h-9 w-9 rounded-full border-0 bg-transparent shadow-none text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
            />
          </div>
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
                  ? "relative inline-block font-bold text-primary py-3 border-b-2 border-primary"
                  : "relative inline-block font-bold text-on-surface-variant hover:text-primary transition-all duration-300 link-hover py-3"
              }
            >
              {t(link.navLabelKey)}
            </NavItem>
          ))}
          <a
            className="mt-2 inline-flex items-center justify-center px-6 py-[6px] rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all h-9"
            href="/#enroll"
            onClick={() => setMenuOpen(false)}
          >
            {t("navEnrollNow")}
          </a>
          <ButtonWithIcon
            label={t("navLogin")}
            className="w-full"
            onClick={() => {
              setMenuOpen(false);
              navigate("/login");
            }}
          />
        </div>
      </div>
    </>
  );
};

export const SiteFooter = () => {
  const { t } = useTranslation();
  return (
    <footer className="relative w-full bg-surface-container-highest border-t border-outline-variant mt-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 py-[120px] grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-1">
          <h3 className="font-display text-2xl text-primary mb-4">EduLearning Platform</h3>
          <p className="text-on-surface-variant mb-6">{t("footerTagline")}</p>
        </div>
        <div>
          <h4 className="text-2xl text-on-surface mb-4">{t("footerQuickLinks")}</h4>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavItem
                  path={link.path}
                  className="text-on-surface-variant hover:text-primary transition-colors hover:translate-x-1 transition-transform duration-200 inline-block"
                >
                  {t(link.navLabelKey)}
                </NavItem>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-2xl text-on-surface mb-4">{t("footerContactInfo")}</h4>
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
        <div>
          <h4 className="text-2xl text-on-surface mb-4">{t("footerPortals")}</h4>
          <div className="flex flex-col gap-3">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
              <span>{t("footerAdminPortal")}</span>
            </Link>
            <Link
              to="/teachers/dashboard"
              className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-xl">school</span>
              <span>{t("footerTeacherPortal")}</span>
            </Link>
            <Link
              to="/learners/dashboard"
              className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-tertiary/10 text-tertiary hover:bg-tertiary/20 transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-xl">person</span>
              <span>{t("footerStudentPortal")}</span>
            </Link>
            <Link
              to="/parents/dashboard"
              className="inline-flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-xl">family_restroom</span>
              <span>{t("footerParentPortal")}</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-outline-variant/30 py-6 text-center">
        <p className="text-on-surface-variant">{t("footerCopyright")}</p>
      </div>
    </footer>
  );
};
