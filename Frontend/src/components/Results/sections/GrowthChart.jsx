import React from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RESULTS_BY_YEAR } from "../../../mockData/resultsData";

const chartData = [...RESULTS_BY_YEAR]
  .reverse()
  .map((r) => ({ year: r.year, passPercentage: r.passPercentage }));

const GrowthChart = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-[120px] bg-surface" id="growth-chart">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            {t("growthChartTitle")}
          </h2>
          <p className="text-lg text-on-surface-variant">
            {t("growthChartSubtitle")}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl soft-shadow border border-outline-variant/20 p-6 md:p-10 h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c3c6d7" vertical={false} />
              <XAxis dataKey="year" stroke="#434655" tickLine={false} />
              <YAxis stroke="#434655" tickLine={false} domain={[80, 100]} unit="%" />
              <Tooltip
                formatter={(value) => [`${value}%`, t("growthChartPassPercentageLabel")]}
                contentStyle={{ borderRadius: 12, border: "1px solid #c3c6d7" }}
              />
              <Bar dataKey="passPercentage" fill="#004ac6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default GrowthChart;
