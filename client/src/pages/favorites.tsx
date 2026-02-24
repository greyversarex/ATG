import { useQuery } from "@tanstack/react-query";
import { useFavorites } from "@/hooks/use-favorites";
import { ProductCard } from "@/components/product-card";
import { Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import type { Product } from "@shared/schema";

export default function Favorites() {
  const { favorites } = useFavorites();

  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const favoriteProducts = allProducts?.filter((p) => favorites.includes(p.id)) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        <h1 className="text-2xl font-bold" data-testid="text-favorites-title">
          Избранное
        </h1>
        {favoriteProducts.length > 0 && (
          <span className="text-muted-foreground text-sm">
            ({favoriteProducts.length})
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : favoriteProducts.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2" data-testid="text-favorites-empty">
            В избранном пока пусто
          </h2>
          <p className="text-muted-foreground mb-6">
            Нажмите на сердечко на карточке товара, чтобы добавить его в избранное
          </p>
          <Link href="/catalog">
            <Button data-testid="button-go-catalog">Перейти в каталог</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
