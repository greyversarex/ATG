import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef, useCallback } from "react";
import { HeroSlider } from "@/components/hero-slider";
import { BrandsRibbon } from "@/components/brands-ribbon";
import { CategoriesGrid } from "@/components/categories-grid";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Wrench, Shield, GraduationCap, Headphones, CheckCircle, Award, LifeBuoy, Truck, Calendar, Users, Globe, MapPin, MessageCircle } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { Card } from "@/components/ui/card";
import type { Banner, Brand, Category, Product, Service, News } from "@shared/schema";

function HeroSkeleton() {
  return <Skeleton className="w-full aspect-[16/6] rounded-xl" />;
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

const serviceIcons: Record<string, typeof Wrench> = {
  wrench: Wrench,
  shield: Shield,
  graduation: GraduationCap,
  headphones: Headphones,
};

const serviceIconAnimations: Record<string, string> = {
  wrench: "service-spin",
  shield: "service-shine",
  graduation: "service-glow",
  headphones: "service-pulse",
};

export default function Home() {
  usePageTitle("Главная");

  const { data: heroBanners, isLoading: loadingBanners } = useQuery<Banner[]>({
    queryKey: ["/api/banners", "hero"],
  });

  const { data: promoBanners } = useQuery<Banner[]>({
    queryKey: ["/api/banners", "promo"],
  });

  const { data: bottomBanners } = useQuery<Banner[]>({
    queryKey: ["/api/banners", "bottom"],
  });

  const { data: brands, isLoading: loadingBrands } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const { data: categories, isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: bestsellers, isLoading: loadingBestsellers } = useQuery<Product[]>({
    queryKey: ["/api/products/bestsellers"],
  });

  const { data: discounted, isLoading: loadingDiscounted } = useQuery<Product[]>({
    queryKey: ["/api/products/discounted"],
  });

  const { data: services } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: newsList } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const promoBanner = promoBanners?.[0];
  const bottomBanner = bottomBanners?.[0];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        {loadingBanners ? <HeroSkeleton /> : <HeroSlider banners={heroBanners || []} />}

        <section data-testid="section-hero-intro" className="text-center py-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold leading-tight" data-testid="text-hero-title">
            ATG — №1 поставщик автодиагностического оборудования в Таджикистане
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1.5 max-w-xl mx-auto" data-testid="text-hero-subtitle">
            Официальный дилер Autel, Thinkcar, Xtool, Sivik. Поставка, обучение и сервисная поддержка.
          </p>
          <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
            <Link href="/catalog">
              <Button size="sm" className="font-semibold shadow-sm" data-testid="button-hero-catalog">
                Смотреть каталог
              </Button>
            </Link>
            <a href="https://wa.me/992907109014?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8E" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="font-semibold border bg-white text-black hover:bg-gray-100 dark:bg-white dark:text-black dark:hover:bg-gray-100" data-testid="button-hero-consult">
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                Получить консультацию
              </Button>
            </a>
          </div>
        </section>

        {loadingBrands ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-32 h-28 shrink-0 rounded-xl" />
            ))}
          </div>
        ) : (
          <BrandsRibbon brands={brands || []} />
        )}

        {loadingCategories ? <ProductsSkeleton /> : <CategoriesGrid categories={(categories || []).filter(c => !c.parentId)} />}

        <section data-testid="section-bestsellers">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold">Хиты продаж</h2>
            <Link href="/catalog">
              <Button variant="ghost" size="sm" data-testid="button-view-all-bestsellers">
                Смотреть все
              </Button>
            </Link>
          </div>
          {loadingBestsellers ? (
            <ProductsSkeleton />
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 ribbon-scroll -mx-4 px-4">
              {(bestsellers || []).map((product) => (
                <div key={product.id} className="w-48 sm:w-56 shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>

        {promoBanner && (
          <section data-testid="section-promo-banner">
            <div className="relative overflow-hidden rounded-xl shadow-xl aspect-[16/5] sm:aspect-[16/4]">
              <img
                src={promoBanner.image}
                alt={promoBanner.title || ""}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center px-6 sm:px-10 md:px-16">
                <div className="max-w-lg">
                  {promoBanner.title && (
                    <h3 className="text-white text-lg sm:text-2xl font-bold mb-2 drop-shadow-lg">{promoBanner.title}</h3>
                  )}
                  {promoBanner.description && (
                    <p className="text-white/80 text-sm mb-4 line-clamp-2 drop-shadow-md">{promoBanner.description}</p>
                  )}
                  {promoBanner.buttonText && promoBanner.buttonLink && (
                    <a href={promoBanner.buttonLink}>
                      <Button size="sm" className="shadow-lg">{promoBanner.buttonText}</Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {(discounted && discounted.length > 0) && (
          <section data-testid="section-discounts">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold">Скидки</h2>
              <Link href="/discounts">
                <Button variant="ghost" size="sm" data-testid="button-view-all-discounts">
                  Смотреть все
                </Button>
              </Link>
            </div>
            {loadingDiscounted ? (
              <ProductsSkeleton />
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2 ribbon-scroll -mx-4 px-4">
                {discounted.map((product) => (
                  <div key={product.id} className="w-48 sm:w-56 shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section data-testid="section-cta" className="text-center py-10 px-6 rounded-xl" style={{
          background: "linear-gradient(135deg, hsl(0 84% 38%) 0%, hsl(0 84% 48%) 50%, hsl(0 84% 35%) 100%)"
        }}>
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Открой или модернизируй автосервис вместе с ATG</h2>
          <a href="https://wa.me/992907109014?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D0%B1%D0%B5%D1%81%D0%BF%D0%BB%D0%B0%D1%82%D0%BD%D1%8B%D0%B9%20%D1%80%D0%B0%D1%81%D1%87%D1%91%D1%82%20%D0%BE%D0%B1%D0%BE%D1%80%D1%83%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="mt-3 bg-white text-primary hover:bg-white/90 font-semibold shadow-lg" data-testid="button-cta-calc">
              Получить бесплатный расчёт оборудования
            </Button>
          </a>
        </section>

        {services && services.length > 0 && (
          <section data-testid="section-services">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Наши услуги</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => {
                const iconAnim = serviceIconAnimations[service.icon] || "animate-spin-slow";
                const IconComp = serviceIcons[service.icon] || Wrench;
                return (
                  <div
                    key={service.id}
                    className="group relative rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-5 sm:p-6 flex items-start gap-4 overflow-hidden transition-transform hover:scale-[1.02]"
                    data-testid={`card-service-${service.id}`}
                  >
                    <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                      <IconComp className={`w-6 h-6 text-white ${iconAnim}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base mb-1">{service.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        {newsList && newsList.length > 0 && (
          <section data-testid="section-news">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold">Новости</h2>
              <Link href="/news">
                <Button variant="ghost" size="sm" data-testid="button-view-all-news">
                  Смотреть все
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {newsList.slice(0, 4).map((item) => (
                <Link key={item.id} href="/news" data-testid={`link-home-news-${item.id}`}>
                  <Card className="overflow-visible group cursor-pointer hover-elevate h-full flex flex-col" data-testid={`card-home-news-${item.id}`}>
                    <div className="aspect-video overflow-hidden rounded-t-md">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <time className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString("ru-RU", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <h3 className="font-semibold text-sm mt-1.5 mb-1 line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {bottomBanner && (
          <section data-testid="section-bottom-banner">
            <div className="relative overflow-hidden rounded-xl shadow-xl aspect-[16/5] sm:aspect-[16/4]">
              <img
                src={bottomBanner.image}
                alt={bottomBanner.title || ""}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center px-6 sm:px-10 md:px-16">
                <div className="max-w-lg">
                  {bottomBanner.title && (
                    <h3 className="text-white text-lg sm:text-2xl font-bold mb-2 drop-shadow-lg">{bottomBanner.title}</h3>
                  )}
                  {bottomBanner.description && (
                    <p className="text-white/80 text-sm mb-4 line-clamp-2 drop-shadow-md">{bottomBanner.description}</p>
                  )}
                  {bottomBanner.buttonText && bottomBanner.buttonLink && (
                    <a href={bottomBanner.buttonLink}>
                      <Button size="sm" className="shadow-lg">{bottomBanner.buttonText}</Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
