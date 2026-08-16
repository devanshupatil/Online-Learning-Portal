import React from "react";
import { useTranslation } from "react-i18next";
import InitialsAvatar from "../../ui/InitialsAvatar";

const AchieverCard = ({
  name,
  percentage,
  classKey,
  featured = false,
  batchKey,
  school,
  year,
  streamKey,
}) => {
  const { t } = useTranslation();
  const studentClass = classKey ? t(classKey) : "";

  if (featured) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center soft-shadow border-2 border-primary/30 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-3xl" aria-hidden="true">
          🥇
        </div>
        <InitialsAvatar name={name} size="xl" className="mx-auto mb-4 border-4 border-primary/20" />
        <h3 className="text-2xl font-bold text-on-surface mb-1">{name}</h3>
        <div className="text-4xl font-bold text-primary mb-2">{percentage}%</div>
        <p className="text-on-surface-variant">
          {studentClass}
          {year ? ` | ${year}` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 text-center soft-shadow border border-outline-variant/20 hover:-translate-y-1 transition-transform duration-300">
      <InitialsAvatar name={name} size="lg" className="mx-auto mb-4" />
      <h3 className="text-lg font-bold text-on-surface mb-1">{name}</h3>
      <div className="text-2xl font-bold text-primary mb-2">{percentage}%</div>
      <p className="text-sm text-on-surface-variant">{studentClass}</p>
      {(batchKey || school) && (
        <p className="text-xs text-on-surface-variant mt-1">
          {[batchKey ? t(batchKey) : null, school].filter(Boolean).join(" · ")}
        </p>
      )}
      {(year || streamKey) && (
        <p className="text-xs text-on-surface-variant mt-1">
          {[year, streamKey ? t(streamKey) : null].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
};

export default AchieverCard;
