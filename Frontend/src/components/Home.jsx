import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import bgImage from "../assets/bgImage.png";
import studentImage from "../assets/student.jpg";
import { SiteNav, SiteFooter } from "./SiteChrome";

const aboutStats = [
  { icon: "history_edu", value: "13+", labelKey: "homeAboutStatYears" },
  { icon: "groups", value: "5,000+", labelKey: "homeAboutStatStudents" },
  { icon: "person", value: "50+", labelKey: "homeAboutStatFaculty" },
  { icon: "military_tech", value: "98%", labelKey: "homeAboutStatSuccessRate" },
];

const topAchievers = [
  { name: "Aarav Sharma", score: "98.5%", tag: "Topper", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdIZ9WUb6HkYi1ej5zJEFabpEp2-P4_5ZEM0FXgVlJueBsYVJYzD5ig69Wj6sxyx329jgGAjxX__aO4QVetGbx1HdCu4CZkx68TEC-uZ6H3dqedlgtZ0aC8Z_oAGtoM7kA5Eyv4x1KWKYbFMkEu_oIUsTrrWHfP59vFAs4ng4aiSMRRd9X6X-_v_ltvDrkvsfnhvhtdy5rHqRDQ95SfcAHEYwY4_wCDSBxZJcjOibwhZ-Mq6DRAkQl" },
  { name: "Priya Patel", score: "97.8%", tag: "Distinction", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA33vqyyVCKMAFAdEcZ0HWpBFq6EZ-SObpvkJhUT6qbryG7-wBxb_O4M86EDLqKUNykxrCRcJpErBcUScWuW3tNomp2FmF3SDBFkLC83gS-7sUdVN8NXEQhSmGNyGfODE5o2sZIW2NyjGjqAURpSBxi1PyX5gINfOo0ApeDUAc6gqmqZXdfYLouaY0egqq56oi6MaAuomrV-SykJt8etU-iQF4s4MsuMcNV7dDva7Qk2K2b7j9RVJXE" },
  { name: "Isha Gupta", score: "97.2%", tag: "Distinction", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYieSzskhHwYE05Jisoh83BmxLLguyyCw5EeP_VyAqKJLoD-vqq9arfOOCSuNgRBEunAkYYdLJBFX-kNNmxurqkyKWyfZ1g9VCpOW7VXoQPPPQZd91S7FzXMGjmbQuYJscvWYX96F-IyAcIpbU8Jey26UnLiQNspzGMfOU_KPymKhyYTTrZK7liCQsRvb_Th6a0jQAZWOLmEAqhsQKJ5jQet7_gz7FY5pAaiJTwxCundhjYPvRi8HK" },
  { name: "Rohan Deshmukh", score: "96.5%", tag: "Distinction", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyNn1zRNq5h76n0tJCAnay1Pc2wZXIY1KiVod8hlIIRvwLhmmvRIyzrWr_CFi_rUTs4fEXvmCXirzMdzVTFbIKcZPqDBvDAO2I-Z4SY2iT0ulrouZ3PE5Zo78Q4QH8vNj8ZyiMKZcj3uoSwOmyj1doyNdS-x_gUSWGeKWG2cSTm7NR6lZcxLLLAVBuSewFb0Nk50tVkEQTkox9nELF5K8hWrvw3T1U870zkHdy03AJgkF4HmqUjO84" },
  { name: "Vikram Singh", score: "96.0%", tag: "Distinction", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOL7LgqVvSgDUc69IvfW59KEVI3pTYs6CF3CIvodVoFrS1uwyxOSRRI8rl02bqbpAErzhZqs4RAQ2l9mXcCkQMr84BZypfE-orud8qKs3zMcknyIH7gs-Zn08MH6FQJF2KfDwv8UQoJ0HB56r47iQz0c72xi2RMBuvYla8XF_aYRkqEaKPFdeBzL7lVWmgJGoluTSN9Cj9y7rLgr4oyb8EOkEopLjMLzfYMQT8B68cfyLi4rgQhqwF" },
  { name: "Sneha Kulkarni", score: "95.4%", tag: "Distinction", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfwjPhC-KEMlz6Fc6z662oXuE0seTcLi051N86d48flrdp6jqQX4vk7FzjZPEOpOpsIntho70W2ZxFo1ssr7osMydiL17ZgR8zvbZfYIudPwIJ2AQ-Y4WXQq4PgoCVi8nsg1XtD0QqBWFE29DWFls_a3fslHxvllwQLeXUBDBLL7HtXwP2r9Vo9kXXo4-3Y-p2-4cz9BCBXqN8wcDPhnDsFKq14vFc6X2bdfp1R9E1jT5aLW40gcOo" },
  { name: "Aditya Joshi", score: "94.8%", tag: "Distinction", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvI-5wi8mENzH3IojX_CaGJJz67p-R-ro-HyRaqtKC2LBChaGbPESuB7AAdSa0Z4zL1gyy2Jo8B1Rw97PSr64bsUYbNb4F4xjCIXhGI9AUQQrcUbR6mADrz5NeN_ea_H3qr1PATKfbmdaSwdWjIMTTleaxS_EEPVtCOIiEB_JB4xCEMXe9wn3Ny7ogwSX_xqp7cQO2faeoaEf7G2bJnhn14VglbseXiQIPHdMfX0nIpdKmtpYra74u" },
  { name: "Neha Reddy", score: "93.5%", tag: "Distinction", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwwqVsGX_gM6T6e0OsuCDHXtua1-Z_xFkfNheDBJEeeRthnDYs2X9zdRTlxte6uDveX2qf_baWmDE6g1_XLLEg9EqVBPJbHo89eOpXXAN4peJjh8lv-Oykg2F1IGDH0lT5ajOPpmBHTZRJNtaqPZNCj0cliK4v8us8xXDdB1QfAOKgYPEnKvxlEtIYiOHgLjS8uHAZuptaTwj68ML7HeQw4xYIk-VpldRqa6KjIlUIxc2CrcnWjUvF" },
  { name: "Kabir Das", score: "92.9%", tag: "Distinction", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWbiPEJ7NiWr60_60bQB-X-SrDJQ6UMQK3FqXDXJwxeANpm4PQQYmUcIrzb8NZ_WXtYVTerARA3gStdseHrVf0N6LTSEPalY6lfrGkUyjyoNyyXpmPGEAtEudgdVFWxoiw42sLjgJFJpWtOtBJV-ZpdHJ6ue6aVlutevbOQ1UmxBGfr7VdZVkX87Z4pug-YOEHvVjvu89-DPE9QEDHb02hxZewLBrPsdgcu-tEikDvuuFc17YVroz7" },
  { name: "Meera Nair", score: "92.1%", tag: "Distinction", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKvnyGBsg3Dn8jT11pxBHexDgRrLWS8hUo2jz3IUi0kCxiUBrZOEBQGN20jbt0qVZdUFCnQE2AAeue9j10FL3SX8C3XJUOaVCv0y7oeV1ONitzjrQvPuceudhEkRjbd0AXoT0FWAWmvmF_7UOJUCrkEkrEo9Yji8QTC0ILCpgO_Xg3gb1PYfc7ShdMEDc3B6QkjC6A72N-RhE34EhtqhTsH67nWXui2ibR2ktGBNHzEB31oAJSPWzo" },
];

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-background text-on-background font-sans antialiased overflow-x-hidden">
      <SiteNav active="Home" />

      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden"
        id="home"
      >
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${bgImage})`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,14,26,0.92)_0%,rgba(10,14,26,0.7)_35%,rgba(10,14,26,0.15)_60%,transparent_80%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-b from-transparent to-surface" />
        </div>
        <div className="relative z-10 w-full max-w-[1280px] px-6 text-left flex flex-col items-start">
          <span className="glass-panel px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">school</span>
            {t("homeHeroBadge")}
          </span>
          <h1 className="font-display text-[28px] leading-[34px] md:text-[40px] md:leading-[48px] text-white mb-6 max-w-md md:max-w-lg tracking-tight">
            {t("homeHeroTitle")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {t("homeHeroTitleHighlight")}
            </span>
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-md mb-10">
            {t("homeHeroSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              className="inline-flex items-center justify-center px-6 py-[6px] rounded-full gradient-btn text-white font-semibold soft-shadow hover:opacity-90 transition-all hover:-translate-y-1 text-center h-9"
              href="#enroll"
            >
              {t("navEnrollNow")}
            </a>
            <Link
              className="inline-flex items-center justify-center px-6 py-[6px] rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all text-center h-9"
              to="/login"
            >
              {t("navLogin")}
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-[120px] bg-surface-container-lowest relative" id="about">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden soft-shadow max-w-md mx-auto lg:mx-0">
                <img
                  alt={t("homeAboutImageAlt")}
                  className="w-full h-full object-cover"
                  src={studentImage}
                />
              </div>
              <div className="glass-panel hidden sm:flex absolute -bottom-6 -right-2 lg:right-6 rounded-2xl p-5 soft-shadow items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[32px]">
                  workspace_premium
                </span>
                <div className="text-left">
                  <div className="text-xl font-bold text-on-surface">5,000+</div>
                  <div className="text-xs text-on-surface-variant">{t("homeAboutSuccessStoriesLabel")}</div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-primary bg-primary/10 mb-4">
                {t("homeAboutBadge")}
              </span>
              <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface mb-6 tracking-tight">
                {t("homeAboutTitle")}
              </h2>
              <p className="text-lg text-on-surface-variant mb-8">
                {t("homeAboutText")}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {aboutStats.map((stat) => (
                  <div
                    key={stat.labelKey}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5"
                  >
                    <span className="material-symbols-outlined text-primary text-[28px]">
                      {stat.icon}
                    </span>
                    <div>
                      <div className="text-lg font-bold text-on-surface leading-tight">
                        {stat.value}
                      </div>
                      <div className="text-xs text-on-surface-variant">{t(stat.labelKey)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a
                className="inline-flex items-center justify-center px-6 py-[6px] rounded-full gradient-btn text-white font-semibold soft-shadow hover:opacity-90 transition-all hover:-translate-y-1 text-center h-9"
                href="#courses"
              >
                {t("homeAboutExploreCoursesBtn")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 md:py-[120px] bg-surface relative" id="results">
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-primary bg-primary/10 mb-4">
              {t("homeResultsBadge")}
            </span>
            <h2 className="font-display text-[30px] leading-[38px] md:text-[42px] md:leading-[52px] text-on-surface mb-6 tracking-tight">
              {t("homeResultsTitle")}
            </h2>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto">
              {t("homeResultsSubtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {topAchievers.map((student) => (
              <div
                key={student.name}
                className="glass-panel rounded-2xl p-6 text-center soft-shadow transform transition-transform hover:-translate-y-2"
              >
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-primary/20">
                  <img
                    alt={student.name}
                    className="w-full h-full object-cover"
                    src={student.img}
                  />
                </div>
                <div className="text-xl font-bold text-on-surface mb-1">{student.name}</div>
                <div className="text-3xl font-bold text-primary mb-2">{student.score}</div>
                <span
                  className={
                    student.tag === "Topper"
                      ? "inline-block px-3 py-1 bg-tertiary-container/10 text-tertiary-container text-xs font-bold rounded-full uppercase tracking-wider"
                      : "inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full uppercase tracking-wider"
                  }
                >
                  {t(student.tag === "Topper" ? "homeResultsTagTopper" : "homeResultsTagDistinction")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Home;
