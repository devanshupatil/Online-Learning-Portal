import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिंदी", short: "हि" },
  { code: "mr", label: "मराठी", short: "मर" },
];

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const current = i18n.language?.split("-")[0] ?? "en";

  return (
    <div
      role="group"
      aria-label="Select language"
      className={`inline-flex items-center gap-1 rounded-full border border-outline-variant p-1 ${className}`}
    >
      {LANGUAGES.map(({ code, label, short }) => (
        <button
          key={code}
          type="button"
          onClick={() => i18n.changeLanguage(code)}
          aria-pressed={current === code}
          aria-label={`Switch to ${label}`}
          className={
            current === code
              ? "px-3 py-1 rounded-full text-sm font-semibold bg-primary text-primary-foreground transition-colors"
              : "px-3 py-1 rounded-full text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          }
        >
          {short}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
