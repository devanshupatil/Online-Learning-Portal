import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import LanguageSwitcher from "../LanguageSwitcher";
import { AnimatedThemeToggle } from "../ui/animated-theme-toggle";

const learnerNavItems = [
  { id: "dashboard", labelKey: "learnerNavDashboard", icon: "dashboard" },
  { id: "syllabus", labelKey: "learnerNavSyllabus", icon: "menu_book" },
  { id: "material", labelKey: "learnerNavMaterial", icon: "folder_open" },
  { id: "test", labelKey: "learnerNavTest", icon: "quiz", hasBadge: true },
  { id: "progress", labelKey: "learnerNavProgress", icon: "trending_up" },
  { id: "profile", labelKey: "learnerNavProfile", icon: "person" },
];

const LearnerNavbar = ({ activeSection, onSectionChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [testBadge, setTestBadge] = useState(0);

  useEffect(() => {
    const count = parseInt(localStorage.getItem("learner_test_badge") || "0", 10);
    setTestBadge(count);
  }, [activeSection]);

  const handleLogout = () => {
    // Clear any stored auth/session data
    localStorage.removeItem("learner_token");
    localStorage.removeItem("learner_user");
    sessionStorage.clear();
    setMenuOpen(false);
    navigate("/");
  };

  const handleSelect = (id) => {
    onSectionChange(id);
    setMenuOpen(false);
  };

  const renderTab = (item, isMobile = false) => {
    const isActive = activeSection === item.id;
    const showBadge = item.hasBadge && testBadge > 0;
    if (isMobile) {
      return (
        <button
          key={item.id}
          onClick={() => handleSelect(item.id)}
          className={
            isActive
              ? "inline-flex items-center gap-2 py-3 text-primary border-b-2 border-primary font-bold"
              : "inline-flex items-center gap-2 py-3 text-on-surface-variant hover:text-primary font-bold link-hover"
          }
        >
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
          {t(item.labelKey)}
          {showBadge && (
            <span className="ml-auto bg-error text-on-error text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {testBadge}
            </span>
          )}
        </button>
      );
    }
    return (
      <button
        key={item.id}
        onClick={() => handleSelect(item.id)}
        className={
          isActive
            ? "text-primary border-b-2 border-primary pb-1 font-bold text-sm transition-colors whitespace-nowrap cursor-pointer"
            : "text-on-surface-variant hover:text-primary font-bold text-sm transition-colors whitespace-nowrap cursor-pointer"
        }
      >
        {t(item.labelKey)}
        {showBadge && (
          <span className="ml-1.5 bg-error text-on-error text-[10px] font-bold rounded-full w-4 h-4 inline-flex items-center justify-center">
            {testBadge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <header className="bg-surface text-primary w-full fixed top-0 left-0 border-b border-outline-variant z-50 h-20 flex items-center justify-center">
        <div className="w-full px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 min-w-0">
            <Link
              className="flex items-center gap-3 group min-w-0"
              to="/learners"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">school</span>
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="font-display text-xl font-bold text-primary leading-tight tracking-tight truncate">
                  {t("coachingName") || "EduLearning"}
                </span>
                <span className="text-xs font-semibold text-on-surface-variant dark:text-gray-400 leading-tight truncate">
                  {t("footerStudentPortal") || "Student Portal"}
                </span>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              {learnerNavItems.map((item) => renderTab(item))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-2">
              <LanguageSwitcher />
            </div>
            <AnimatedThemeToggle
              isDark={theme === "dark"}
              onToggle={toggleTheme}
              aria-label={t("learnerToggleDarkMode")}
              className="h-10 w-10 rounded-full border-0 bg-transparent shadow-none text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
            />
            <button
              onClick={handleLogout}
              className="hidden lg:inline-flex items-center gap-1 px-4 py-2 border border-outline-variant text-on-surface text-sm font-bold rounded-lg hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              {t("learnerNavLogout")}
            </button>
            <button
              className="lg:hidden flex-shrink-0 text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t("learnerNavToggleMenu")}
            >
              <span className="material-symbols-outlined text-[24px]">
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={
          menuOpen
            ? "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden opacity-100 pointer-events-auto transition-opacity duration-300 ease-in-out"
            : "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden opacity-0 pointer-events-none transition-opacity duration-300 ease-in-out"
        }
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={
          menuOpen
            ? "fixed top-0 right-0 h-full w-3/4 z-50 bg-surface shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] lg:hidden flex flex-col translate-x-0 transition-transform duration-300 ease-in-out"
            : "fixed top-0 right-0 h-full w-3/4 z-50 bg-surface shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] lg:hidden flex flex-col translate-x-full transition-transform duration-300 ease-in-out"
        }
      >
        <div className="flex justify-between items-center h-20 px-6 border-b border-outline-variant">
          <LanguageSwitcher />
          <button
            className="text-on-surface p-2"
            onClick={() => setMenuOpen(false)}
            aria-label={t("learnerNavCloseMenu")}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex flex-col px-6 py-4 gap-3 overflow-y-auto">
          {learnerNavItems.map((item) => renderTab(item, true))}
          <button
            onClick={handleLogout}
            className="mt-4 inline-flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            {t("learnerNavLogout")}
          </button>
        </div>
      </div>

    </>
  );
};

export default LearnerNavbar;
