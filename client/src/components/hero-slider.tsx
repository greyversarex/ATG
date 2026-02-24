import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@shared/schema";

interface HeroSliderProps {
  banners: Banner[];
}

export function HeroSlider({ banners }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (!banners.length) return null;

  const banner = banners[current];

  return (
    <div className="relative w-full overflow-hidden rounded-xl" data-testid="hero-slider">
      <div className="relative aspect-[4/3] sm:aspect-[16/6] w-full">
        {banners.map((b, i) => (
          <div
            key={b.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img
              src={b.image}
              alt={b.title || ""}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-xl px-5 sm:px-10 md:px-16">
            {banner.title && (
              <h2
                className="text-white text-lg sm:text-2xl md:text-4xl font-bold leading-tight mb-2 sm:mb-3 drop-shadow-lg"
                data-testid="text-hero-title"
              >
                {banner.title}
              </h2>
            )}
            {banner.description && (
              <p className="text-white/80 text-xs sm:text-base mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 drop-shadow-md" data-testid="text-hero-description">
                {banner.description}
              </p>
            )}
            {banner.buttonText && banner.buttonLink && (
              <a href={banner.buttonLink}>
                <Button size="sm" className="shadow-lg text-xs sm:text-sm" data-testid="button-hero-cta">
                  {banner.buttonText}
                </Button>
              </a>
            )}
          </div>
        </div>

        {banners.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-black/50 transition-colors cursor-pointer z-10"
              data-testid="button-slider-prev"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-black/50 transition-colors cursor-pointer z-10"
              data-testid="button-slider-next"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
              {banners.map((_, i) => (
                <button
                  key={i}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === current ? "bg-white w-6 sm:w-8 shadow-md" : "bg-white/40 w-1.5 sm:w-2"
                  }`}
                  onClick={() => setCurrent(i)}
                  data-testid={`button-slider-dot-${i}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
