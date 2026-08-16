import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const ButtonWithIcon = ({ label, onClick, className }) => {
  const { t } = useTranslation();
  return (
    <Button
      onClick={onClick}
      className={`relative text-sm font-medium rounded-full h-9 px-6 ps-5 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-5 w-fit overflow-hidden cursor-pointer ${className ?? ""}`}
    >
      <span className="relative z-10 transition-all duration-500">
        {label ?? t('buttonWithIconDefaultLabel')}
      </span>
      <div className="absolute right-1 w-6 h-6 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
        <ArrowUpRight size={12} />
      </div>
    </Button>
  );
};

export default ButtonWithIcon;
