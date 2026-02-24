import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import type { Category } from "@shared/schema";

interface CategoriesGridProps {
  categories: Category[];
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  const { t } = useI18n();
  if (!categories.length) return null;

  return (
    <section data-testid="section-categories">
      <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">{t("home.categories")}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/catalog?category=${cat.id}`} data-testid={`link-category-${cat.id}`}>
            <Card
              className="hover-elevate cursor-pointer overflow-visible"
              data-testid={`card-category-${cat.id}`}
            >
              <div className="aspect-square overflow-hidden rounded-t-md" style={{
                background: "linear-gradient(180deg, hsl(220 10% 96%) 0%, hsl(220 10% 92%) 100%)"
              }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-1.5 sm:p-2 text-center">
                <span className="text-[10px] sm:text-xs font-semibold leading-tight line-clamp-2" data-testid={`text-category-name-${cat.id}`}>
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
