import { Link } from "wouter";
import type { Brand } from "@shared/schema";

interface BrandsRibbonProps {
  brands: Brand[];
}

export function BrandsRibbon({ brands }: BrandsRibbonProps) {
  if (!brands.length) return null;

  return (
    <section data-testid="section-brands-ribbon">
      <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Бренды</h2>
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
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
    </section>
  );
}
