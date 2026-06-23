import { useEffect, useState } from "react";
import { Category, Match } from "../types";

interface TabHomeProps {
  banners: Record<string, { img: string; link?: string }>;
  noticeText: string;
  categories: Record<string, Category>;
  matches: Match[];
  onSelectCategory: (categoryId: string) => void;
}

export default function TabHome({
  banners,
  noticeText,
  categories,
  matches,
  onSelectCategory,
}: TabHomeProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const bannerList = Object.values(banners || {});

  useEffect(() => {
    if (bannerList.length <= 1) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % bannerList.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerList.length]);

  return (
    <div id="tab-home-view" className="app-section active pb-[90px]">
      <div className="hero-banner">
        <div className="slider-container" id="slider-touch-area">
          <div
            id="banner-slider-wrapper"
            className="slider-wrapper"
            style={{
              transform: `translateX(-${slideIndex * 100}%)`,
              display: "flex",
              transition: "transform 0.5s ease-in-out",
            }}
          >
            {bannerList.map((banner, i) => (
              <div
                key={i}
                className="slide min-w-full h-full flex-shrink-0 cursor-pointer"
                onClick={() => {
                  if (banner.link) {
                    try {
                      window.open(banner.link, "_blank");
                    } catch (err) {
                      console.warn("Banner link navigation blocked:", err);
                    }
                  }
                }}
              >
                <img
                  src={banner.img}
                  alt={`Banner ${i}`}
                  className="w-full h-full object-cover block"
                />
              </div>
            ))}
          </div>
        </div>
        <div id="slider-dots" className="slider-dots">
          {bannerList.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === slideIndex ? "active" : ""}`}
              onClick={() => setSlideIndex(i)}
            ></div>
          ))}
        </div>
      </div>

      <div className="home-content-wrapper">
        <div className="marquee-container overflow-hidden whitespace-nowrap flex items-center">
          <div id="dynamic-notice" className="inline-block pl-full">
            {noticeText || "Welcome to Dream Tour! Join matches and win big prizes."}
          </div>
        </div>

        <div className="category-title">FREE FIRE</div>

        <div id="dynamic-category-list" className="category-grid">
          {Object.entries(categories || {}).map(([categoryId, cat]) => {
            const count = matches.filter(
              (m) => m.categoryId === categoryId && m.status !== "Finished"
            ).length;

            return (
              <div
                key={categoryId}
                className="cat-card-new"
                onClick={() => onSelectCategory(categoryId)}
              >
                <img src={cat.img} className="cat-card-img" alt={cat.name} />
                <div className="cat-card-info">
                  <div className="cat-card-title text-left">{cat.name}</div>
                  <div className="cat-card-count text-left">{count} matches found</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
