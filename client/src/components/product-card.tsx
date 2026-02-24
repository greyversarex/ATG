import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggle, isFavorite } = useFavorites();
  const liked = isFavorite(product.id);
  const discountedPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : null;

  return (
    <Card className="overflow-visible group flex flex-col h-full" data-testid={`card-product-${product.id}`}>
      <div className="relative aspect-square overflow-hidden rounded-t-md" style={{
        background: "linear-gradient(180deg, hsl(220 10% 96%) 0%, hsl(220 10% 92%) 100%)"
      }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.discountPercent && product.discountPercent > 0 ? (
          <div className="absolute top-2.5 left-2.5">
            <Badge variant="destructive" className="text-xs font-bold shadow-md" data-testid={`badge-discount-${product.id}`}>
              -{product.discountPercent}%
            </Badge>
          </div>
        ) : null}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md transition-all duration-200 hover:scale-110 hover:bg-white cursor-pointer"
          data-testid={`button-favorite-${product.id}`}
          aria-label={liked ? "Удалить из избранного" : "Добавить в избранное"}
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors duration-200 ${
              liked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col flex-1 p-3.5 gap-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 h-[2.5em]" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 h-[2.5em]">
          {product.shortSpecs || "\u00A0"}
        </p>

        <div className="mt-auto pt-1 flex items-end justify-between gap-2">
          <div className="flex flex-col min-w-0">
            {discountedPrice ? (
              <>
                <span className="text-xs text-muted-foreground line-through whitespace-nowrap">
                  {product.price.toLocaleString("ru-RU")} сом.
                </span>
                <span className="font-bold text-sm text-primary whitespace-nowrap" data-testid={`text-price-${product.id}`}>
                  {discountedPrice.toLocaleString("ru-RU")} сом.
                </span>
              </>
            ) : (
              <span className="font-bold text-sm whitespace-nowrap" data-testid={`text-price-${product.id}`}>
                {product.price.toLocaleString("ru-RU")} сом.
              </span>
            )}
          </div>

          <Link href={`/product/${product.id}`}>
            <Button size="sm" className="shrink-0" data-testid={`button-details-${product.id}`}>
              Подробнее
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
