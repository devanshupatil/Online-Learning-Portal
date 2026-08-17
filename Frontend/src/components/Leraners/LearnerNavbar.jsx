import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";

const learnerNavItems = [
  { id: "dashboard", labelKey: "learnerNavDashboard", icon: "dashboard" },
  { id: "syllabus", labelKey: "learnerNavSyllabus", icon: "menu_book" },
  { id: "material", labelKey: "learnerNavMaterial", icon: "folder_open" },
  { id: "test", labelKey: "learnerNavTest", icon: "quiz" },
  { id: "progress", labelKey: "learnerNavProgress", icon: "trending_up" },
  { id: "profile", labelKey: "learnerNavProfile", icon: "person" },
];

const LearnerNavbar = ({ activeSection, onSectionChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
      </button>
    );
  };

  return (
    <>
      <header className="bg-surface text-primary w-full fixed top-0 left-0 border-b border-outline-variant z-50 h-16 flex items-center justify-center">
        <div className="max-w-[1440px] w-full px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-6">
            <Link
              className="font-display text-lg sm:text-2xl lg:text-3xl text-primary whitespace-nowrap font-bold"
              to="/learners"
            >
              {t("learnerNavBrand")}
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              {learnerNavItems.map((item) => renderTab(item))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center">
              <LanguageSwitcher />
            </div>
            <button
              onClick={handleLogout}
              className="hidden lg:inline-flex items-center gap-1 px-4 py-2 border border-outline-variant text-on-surface text-sm font-bold rounded-lg hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              {t("learnerNavLogout")}
            </button>
            <button
              className="lg:hidden text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
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
        <div className="flex justify-between items-center h-16 px-6 border-b border-outline-variant">
          <LanguageSwitcher />
          <button
            className="text-on-surface p-2"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
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
