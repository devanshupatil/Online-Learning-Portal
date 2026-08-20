import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import LanguageSwitcher from "../LanguageSwitcher";
import { AnimatedThemeToggle } from "../ui/animated-theme-toggle";

const adminNavItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "users", label: "Users", icon: "manage_accounts" },
  { id: "courses", label: "Courses", icon: "menu_book" },
  { id: "content", label: "Content", icon: "folder_open" },
  { id: "classes", label: "Classes", icon: "event" },
  { id: "analytics", label: "Analytics", icon: "bar_chart" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const AdminNavbar = ({ activeSection, onSectionChange, searchQuery, onSearchChange, admin, logout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    if (logout) logout();
    setMenuOpen(false);
    setProfileDropdownOpen(false);
    navigate("/");
  };

  const handleSelect = (id) => {
    onSectionChange(id);
    setMenuOpen(false);
  };

  // Derive initials from admin name/email
  const adminName = (admin?.name || admin?.email || "Admin").charAt(0).toUpperCase() + (admin?.name || admin?.email || "Admin").slice(1);
  const initials = adminName
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  const renderTab = (item, isMobile = false) => {
    const isActive = activeSection === item.id;
    const label = (t(item.id) || item.label).charAt(0).toUpperCase() + (t(item.id) || item.label).slice(1);
    if (isMobile) {
      return (
        <button
          key={item.id}
          onClick={() => handleSelect(item.id)}
          className={`inline-flex items-center gap-2 py-3 font-bold cursor-pointer transition-colors ${isActive
              ? "text-primary border-b-2 border-primary"
              : "text-on-surface-variant hover:text-primary link-hover"
            }`}
        >
          <span className={`material-symbols-outlined text-[20px] ${isActive ? "[font-variation-settings:'FILL'_1]" : ""}`}>
            {item.icon}
          </span>
          {label}
        </button>
      );
    }
    return (
      <button
        key={item.id}
        onClick={() => handleSelect(item.id)}
        className={`flex items-center gap-2 pb-1 font-bold text-sm transition-colors whitespace-nowrap cursor-pointer ${isActive
            ? "text-primary border-b-2 border-primary"
            : "text-on-surface-variant hover:text-primary"
          }`}
      >
        <span className={`material-symbols-outlined text-[20px] ${isActive ? "[font-variation-settings:'FILL'_1]" : "group-hover:scale-110 transition-transform duration-150"}`}>
          {item.icon}
        </span>
        {label}
      </button>
    );
  };

  return (
    <>
      <header className="bg-surface dark:bg-surface-dim sticky top-0 w-full z-50 border-b border-outline-variant dark:border-outline flex flex-col shadow-sm">
        {/* Top Row: Brand, Search, Actions */}
        <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            </div>
            <div className="flex flex-col text-left min-w-0">
              <h1 className="text-xl font-bold font-display tracking-tight text-primary leading-tight truncate">
                {t("coachingName") || "EduLearning"}
              </h1>
              <p className="text-xs font-semibold text-on-surface-variant dark:text-gray-400 leading-tight truncate">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Search - center */}
          <div className="flex-1 items-center justify-center hidden md:flex">
            <div className="relative w-full max-w-xl">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-transparent rounded-full text-sm text-on-surface focus:bg-surface focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-on-surface-variant/70"
                placeholder="Search users, courses, content…"
                type="text"
                value={searchQuery || ""}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer relative"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            <button
              className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors cursor-pointer"
              aria-label="Help"
            >
              <span className="material-symbols-outlined text-[22px]">help_outline</span>
            </button>
            <div className="hidden sm:block h-8 w-px bg-outline-variant mx-1"></div>

            {/* Language Switcher */}
            <div className="hidden lg:flex items-center">
              <LanguageSwitcher />
            </div>

            {/* Theme Toggle */}
            <AnimatedThemeToggle
              isDark={theme === "dark"}
              onToggle={toggleTheme}
              aria-label="Toggle dark mode"
              className="h-10 w-10 rounded-full border-0 bg-transparent shadow-none text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
            />

            {/* Admin Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 focus:ring-2 focus:ring-primary/20 outline-none rounded-full p-1 pr-2 hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold border border-outline-variant">
                  {initials || "AD"}
                </span>
                <span className="text-xs font-semibold text-on-surface hidden lg:block">{adminName}</span>
                <span className="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-variant py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-surface-variant">
                    <p className="text-sm font-bold text-on-surface">{adminName}</p>
                    <p className="text-xs text-on-surface-variant">Administrator</p>
                  </div>
                  <button
                    onClick={() => { handleSelect("settings"); setProfileDropdownOpen(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error-container/30 flex items-center gap-2 cursor-pointer border-t border-surface-variant mt-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              className="lg:hidden flex-shrink-0 text-on-surface p-1.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Navigation Links */}
        <div className="hidden lg:block px-4 sm:px-6 lg:px-8 bg-surface-container-low dark:bg-surface-container-lowest border-t border-outline-variant/50">
          <ul className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-2 pt-2.5 no-scrollbar">
            {adminNavItems.map((item) => (
              <li key={item.id}>
                {renderTab(item)}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={
          menuOpen
            ? "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden opacity-100 pointer-events-auto transition-opacity duration-300 ease-in-out"
            : "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden opacity-0 pointer-events-none transition-opacity duration-300 ease-in-out"
        }
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={
          menuOpen
            ? "fixed top-0 right-0 h-full w-3/4 max-w-sm z-50 bg-surface shadow-2xl lg:hidden flex flex-col translate-x-0 transition-transform duration-300 ease-in-out"
            : "fixed top-0 right-0 h-full w-3/4 max-w-sm z-50 bg-surface shadow-2xl lg:hidden flex flex-col translate-x-full transition-transform duration-300 ease-in-out"
        }
      >
        <div className="flex justify-between items-center h-16 px-6 border-b border-outline-variant">
          <LanguageSwitcher />
          <button
            className="text-on-surface p-2 rounded-lg hover:bg-surface-container-low"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex flex-col px-6 py-4 gap-2 overflow-y-auto">
          {adminNavItems.map((item) => renderTab(item, true))}
          <button
            onClick={handleLogout}
            className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-4 border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-container-low active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
