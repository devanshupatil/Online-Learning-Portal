import React from "react";

const PALETTE = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-tertiary-container text-on-tertiary",
  "bg-primary-container text-on-primary-container",
  "bg-secondary-fixed text-on-secondary-fixed",
  "bg-primary-fixed text-on-primary-fixed",
];

const SIZES = {
  sm: "w-10 h-10 text-sm",
  md: "w-14 h-14 text-lg",
  lg: "w-20 h-20 text-2xl",
  xl: "w-28 h-28 text-4xl",
};

const getInitials = (name) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

const getColorClass = (name) => {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
};

const InitialsAvatar = ({ name, size = "md", className = "" }) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold shrink-0 ${SIZES[size]} ${getColorClass(name)} ${className}`}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default InitialsAvatar;
