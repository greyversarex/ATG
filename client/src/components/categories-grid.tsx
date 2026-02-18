import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import type { Category } from "@shared/schema";

interface CategoriesGridProps {
  categories: Category[];
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  if (!categories.length) return null;

  return (
    <section data-testid="section-categories">
      <h2 className="text-lg font-bold mb-4">Категории товаров</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/catalog?category=${cat.id}`}>
            <Card
              className="hover-elevate cursor-pointer overflow-visible"
              data-testid={`card-category-${cat.id}`}
            >
              <div className="aspect-square overflow-hidden rounded-t-md bg-muted flex items-center justify-center p-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-3 text-center">
                <span className="text-sm font-medium" data-testid={`text-category-name-${cat.id}`}>
                  {cat.name}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
