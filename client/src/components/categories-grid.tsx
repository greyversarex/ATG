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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/catalog?category=${cat.id}`}>
            <Card
              className="hover-elevate cursor-pointer overflow-visible"
              data-testid={`card-category-${cat.id}`}
            >
              <div className="aspect-square overflow-hidden rounded-t-xl" style={{
                background: "linear-gradient(180deg, hsl(220 10% 96%) 0%, hsl(220 10% 92%) 100%)"
              }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3 text-center">
                <span className="text-sm font-semibold" data-testid={`text-category-name-${cat.id}`}>
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
