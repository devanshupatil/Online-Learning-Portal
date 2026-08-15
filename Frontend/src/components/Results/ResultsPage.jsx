import React from "react";
import { SiteNav, SiteFooter } from "../SiteChrome";
import ResultsHero from "./sections/ResultsHero";
import OverallStats from "./sections/OverallStats";
import YearwiseResults from "./sections/YearwiseResults";
import TopAchievers from "./sections/TopAchievers";
import NinetyPlusAchievers from "./sections/NinetyPlusAchievers";
import EightyPlusAchievers from "./sections/EightyPlusAchievers";
import SubjectToppers from "./sections/SubjectToppers";
import ClasswiseResults from "./sections/ClasswiseResults";
import GrowthChart from "./sections/GrowthChart";
import SuccessStories from "./sections/SuccessStories";
import TopperGallery from "./sections/TopperGallery";
import Testimonials from "./sections/Testimonials";
import FinalCTA from "./sections/FinalCTA";

const ResultsPage = () => {
  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden">
      <SiteNav active="Results" />
      <ResultsHero />
      <OverallStats />
      <YearwiseResults />
      <TopAchievers />
      <NinetyPlusAchievers />
      <EightyPlusAchievers />
      <SubjectToppers />
      <ClasswiseResults />
      <GrowthChart />
      <SuccessStories />
      <TopperGallery />
      <Testimonials />
      <FinalCTA />
      <SiteFooter />
    </div>
  );
};

export default ResultsPage;
