import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageTitle } from "@/hooks/use-page-title";
import { useI18n } from "@/lib/i18n";
import type { Brand } from "@shared/schema";

export default function Brands() {
  usePageTitle("brands");
  const { t } = useI18n();

  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" data-testid="text-brands-title">{t("brands.title")}</h1>

      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/2] rounded-lg" />
          ))}
        </div>
      ) : !brands?.length ? (
        <p className="text-center text-muted-foreground py-16 text-sm">{t("brands.empty")}</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
          {brands.map((brand) => (
            <Link key={brand.id} href={`/catalog?brand=${brand.id}`}>
              <div
                className="bg-white rounded-lg overflow-hidden aspect-[3/2] cursor-pointer hover-elevate"
                data-testid={`card-brand-${brand.id}`}
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
