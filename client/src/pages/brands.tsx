import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageTitle } from "@/hooks/use-page-title";
import type { Brand } from "@shared/schema";

export default function Brands() {
  usePageTitle("Бренды");

  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6" data-testid="text-brands-title">Бренды</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-md" />
          ))}
        </div>
      ) : !brands?.length ? (
        <p className="text-center text-muted-foreground py-16">Бренды не найдены</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map((brand) => (
            <Link key={brand.id} href={`/catalog?brand=${brand.id}`}>
              <Card
                className="hover-elevate cursor-pointer overflow-visible"
                data-testid={`card-brand-${brand.id}`}
              >
                <div className="aspect-[4/3] overflow-hidden rounded-t-md bg-muted flex items-center justify-center p-4">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 text-center">
                  <span className="font-medium text-sm" data-testid={`text-brand-name-${brand.id}`}>
                    {brand.name}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
