import { useQuery } from "@tanstack/react-query";
import { useFavorites } from "@/hooks/use-favorites";
import { ProductCard } from "@/components/product-card";
import { Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/use-page-title";
import { useI18n } from "@/lib/i18n";
import type { Product } from "@shared/schema";

export default function Favorites() {
  usePageTitle("favorites");
  const { favorites } = useFavorites();
  const { t } = useI18n();

  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const favoriteProducts = allProducts?.filter((p) => favorites.includes(p.id)) || [];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 fill-red-500" />
        <h1 className="text-xl sm:text-2xl font-bold" data-testid="text-favorites-title">
          {t("favorites.title")}
        </h1>
        {favoriteProducts.length > 0 && (
          <span className="text-muted-foreground text-xs sm:text-sm">
            ({favoriteProducts.length})
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : favoriteProducts.length === 0 ? (
        <div className="text-center py-16 sm:py-20">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-base sm:text-lg font-semibold mb-2" data-testid="text-favorites-empty">
            {t("favorites.emptyTitle")}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6 max-w-xs mx-auto">
            {t("favorites.emptyText")}
          </p>
          <Link href="/catalog">
            <Button size="sm" data-testid="button-go-catalog">{t("favorites.goToCatalog")}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
