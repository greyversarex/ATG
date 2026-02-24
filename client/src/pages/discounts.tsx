import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageTitle } from "@/hooks/use-page-title";
import type { Product } from "@shared/schema";

export default function Discounts() {
  usePageTitle("Скидки");

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/discounted"],
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2" data-testid="text-discounts-title">Скидки</h1>
      <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">Специальные предложения на избранные товары</p>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-3 sm:h-4 w-3/4" />
              <Skeleton className="h-3 sm:h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : !products?.length ? (
        <p className="text-center text-muted-foreground py-16 text-sm" data-testid="text-no-discounts">
          Сейчас нет товаров со скидкой
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
