import React from "react";

const galleryCategories = [
  { icon: "school", title: "School Toppers", gradient: "from-primary to-secondary" },
  { icon: "groups", title: "Class Toppers", gradient: "from-secondary to-tertiary-container" },
  { icon: "menu_book", title: "Subject Toppers", gradient: "from-tertiary-container to-primary" },
  { icon: "emoji_events", title: "Prize Distribution", gradient: "from-primary to-tertiary-container" },
];

const TopperGallery = () => {
  return (
    <section className="py-16 md:py-[120px] bg-surface" id="topper-gallery">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface tracking-tight mb-4">
            Toppers Gallery
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryCategories.map((cat) => (
            <div
              key={cat.title}
              className={`relative overflow-hidden rounded-2xl soft-shadow aspect-square flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br ${cat.gradient} text-white hover:-translate-y-1 transition-transform duration-300`}
            >
              <span className="material-symbols-outlined text-[48px] mb-4">{cat.icon}</span>
              <h3 className="text-lg font-bold">{cat.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopperGallery;
