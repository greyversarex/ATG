import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import type { Brand } from "@shared/schema";

interface BrandsRibbonProps {
  brands: Brand[];
}

export function BrandsRibbon({ brands }: BrandsRibbonProps) {
  if (!brands.length) return null;

  return (
    <section data-testid="section-brands-ribbon">
      <h2 className="text-lg font-bold mb-4">Бренды</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {brands.map((brand) => (
          <Link key={brand.id} href={`/catalog?brand=${brand.id}`}>
            <Card
              className="shrink-0 w-28 sm:w-32 hover-elevate cursor-pointer overflow-visible"
              data-testid={`card-brand-${brand.id}`}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-t-md bg-muted flex items-center justify-center p-2">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-2 text-center">
                <span className="text-xs font-medium truncate block" data-testid={`text-brand-name-${brand.id}`}>
                  {brand.name}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
