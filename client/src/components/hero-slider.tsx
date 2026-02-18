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
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
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
      <div className="relative aspect-[16/6] sm:aspect-[16/5] md:aspect-[16/6] w-full">
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
          <div className="max-w-xl px-6 sm:px-10 md:px-16">
            {banner.title && (
              <h2
                className="text-white text-xl sm:text-2xl md:text-4xl font-bold leading-tight mb-2 sm:mb-3 drop-shadow-lg"
                data-testid="text-hero-title"
              >
                {banner.title}
              </h2>
            )}
            {banner.description && (
              <p className="text-white/80 text-sm sm:text-base mb-4 line-clamp-3 drop-shadow-md" data-testid="text-hero-description">
                {banner.description}
              </p>
            )}
            {banner.buttonText && banner.buttonLink && (
              <a href={banner.buttonLink}>
                <Button size="default" className="shadow-lg" data-testid="button-hero-cta">
                  {banner.buttonText}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white backdrop-blur-sm no-default-hover-elevate"
            onClick={prev}
            data-testid="button-slider-prev"
          >
            <ChevronLeft />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white backdrop-blur-sm no-default-hover-elevate"
            onClick={next}
            data-testid="button-slider-next"
          >
            <ChevronRight />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-white w-8 shadow-md" : "bg-white/40 w-2"
                }`}
                onClick={() => setCurrent(i)}
                data-testid={`button-slider-dot-${i}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
