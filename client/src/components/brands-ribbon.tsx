import { Link } from "wouter";
import type { Brand } from "@shared/schema";

interface BrandsRibbonProps {
  brands: Brand[];
}

export function BrandsRibbon({ brands }: BrandsRibbonProps) {
  if (!brands.length) return null;

  return (
    <section data-testid="section-brands-ribbon">
      <h2 className="text-lg font-bold mb-4">Бренды</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {brands.map((brand) => (
          <Link key={brand.id} href={`/catalog?brand=${brand.id}`}>
            <div
              className="bg-white rounded-lg flex items-center justify-center p-4 aspect-[3/2] cursor-pointer hover-elevate overflow-visible"
              data-testid={`card-brand-${brand.id}`}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
