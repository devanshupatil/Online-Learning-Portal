import React, { useMemo, useState } from "react";
import AchieverCard from "./AchieverCard";
import { ACHIEVERS_80_PLUS } from "../../../mockData/resultsData";

const ALL = "All";
const RANGES = [ALL, "80-84%", "85-89%"];

const EightyPlusAchievers = () => {
  const years = useMemo(() => [ALL, ...new Set(ACHIEVERS_80_PLUS.map((a) => a.year))], []);
  const classes = useMemo(() => [ALL, ...new Set(ACHIEVERS_80_PLUS.map((a) => a.class))], []);
  const streams = useMemo(() => [ALL, ...new Set(ACHIEVERS_80_PLUS.map((a) => a.stream))], []);

  const [year, setYear] = useState(ALL);
  const [studentClass, setStudentClass] = useState(ALL);
  const [stream, setStream] = useState(ALL);
  const [range, setRange] = useState(ALL);

  const filtered = ACHIEVERS_80_PLUS.filter((a) => {
    if (year !== ALL && a.year !== year) return false;
    if (studentClass !== ALL && a.class !== studentClass) return false;
    if (stream !== ALL && a.stream !== stream) return false;
    if (range === "80-84%" && !(a.percentage >= 80 && a.percentage < 85)) return false;
    if (range === "85-89%" && !(a.percentage >= 85 && a.percentage < 90)) return false;
    return true;
  });

  const selectClass =
    "px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant text-sm font-medium focus:outline-none focus:border-primary/50";

  return (
    <section className="py-16 md:py-[120px] bg-surface-container-lowest" id="eighty-plus-achievers">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            80%+ Achievers
          </h2>
          <p className="text-lg text-on-surface-variant">
            A broader look at consistently strong performance across years.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <select className={selectClass} value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y === ALL ? "All Years" : y}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                {c === ALL ? "All Classes" : c}
              </option>
            ))}
          </select>
          <select className={selectClass} value={range} onChange={(e) => setRange(e.target.value)}>
            {RANGES.map((r) => (
              <option key={r} value={r}>
                {r === ALL ? "All Percentages" : r}
              </option>
            ))}
          </select>
          <select className={selectClass} value={stream} onChange={(e) => setStream(e.target.value)}>
            {streams.map((s) => (
              <option key={s} value={s}>
                {s === ALL ? "All Streams" : s}
              </option>
            ))}
          </select>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-on-surface-variant">No achievers match these filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((a) => (
              <AchieverCard key={a.name} {...a} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EightyPlusAchievers;
