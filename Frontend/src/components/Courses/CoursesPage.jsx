import React from "react";
import { SiteNav, SiteFooter } from "../SiteChrome";
import CoursesHero from "./sections/CoursesHero";
import FoundationPrograms from "./sections/FoundationPrograms";

const CoursesPage = () => {
  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden">
      <SiteNav active="Courses" />
      <CoursesHero />
      <FoundationPrograms />
      <SiteFooter />
    </div>
  );
};

export default CoursesPage;
