import { useQuery } from "@tanstack/react-query";
import { HeroSlider } from "@/components/hero-slider";
import { BrandsRibbon } from "@/components/brands-ribbon";
import { CategoriesGrid } from "@/components/categories-grid";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Wrench, Shield, GraduationCap, Headphones } from "lucide-react";
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
            <h2 className="text-lg font-bold">Хиты продаж</h2>
            <Link href="/catalog">
              <Button variant="ghost" size="sm" data-testid="button-view-all-bestsellers">
                Смотреть все
              </Button>
            </Link>
          </div>
          {loadingBestsellers ? (
            <ProductsSkeleton />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(bestsellers || []).map((product) => (
                <ProductCard key={product.id} product={product} />
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
              <h2 className="text-lg font-bold">Скидки</h2>
              <Link href="/discounts">
                <Button variant="ghost" size="sm" data-testid="button-view-all-discounts">
                  Смотреть все
                </Button>
              </Link>
            </div>
            {loadingDiscounted ? (
              <ProductsSkeleton />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {discounted.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        )}

        {services && services.length > 0 && (
          <section data-testid="section-services">
            <h2 className="text-lg font-bold mb-4">Наши услуги</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service) => {
                const IconComp = serviceIcons[service.icon] || Wrench;
                return (
                  <div
                    key={service.id}
                    className="convex-card flex flex-col items-center text-center p-6"
                    data-testid={`card-service-${service.id}`}
                  >
                    <div className="mb-3">
                      <IconComp className="w-10 h-10 text-primary" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{service.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        {newsList && newsList.length > 0 && (
          <section data-testid="section-news">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <h2 className="text-lg font-bold">Новости</h2>
              <Link href="/news">
                <Button variant="ghost" size="sm" data-testid="button-view-all-news">
                  Смотреть все
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsList.slice(0, 3).map((item) => (
                <Link key={item.id} href="/news">
                  <Card className="overflow-visible group cursor-pointer hover-elevate" data-testid={`card-home-news-${item.id}`}>
                    <div className="aspect-video overflow-hidden rounded-t-xl">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
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
