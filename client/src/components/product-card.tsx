import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : null;

  return (
    <Card className="overflow-visible group flex flex-col" data-testid={`card-product-${product.id}`}>
      <div className="relative aspect-square overflow-hidden rounded-t-md bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.discountPercent && product.discountPercent > 0 ? (
          <div className="absolute top-2 left-2">
            <Badge variant="destructive" className="text-xs font-bold" data-testid={`badge-discount-${product.id}`}>
              -{product.discountPercent}%
            </Badge>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col flex-1 p-3 gap-2">
        <h3 className="font-medium text-sm leading-tight line-clamp-2 min-h-[2.5em]" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>

        {product.shortSpecs && (
          <p className="text-xs text-muted-foreground line-clamp-2">{product.shortSpecs}</p>
        )}

        <div className="mt-auto pt-2 flex items-end justify-between gap-2 flex-wrap">
          <div className="flex flex-col">
            {discountedPrice ? (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  {product.price.toLocaleString("ru-RU")} сом.
                </span>
                <span className="font-bold text-sm text-primary" data-testid={`text-price-${product.id}`}>
                  {discountedPrice.toLocaleString("ru-RU")} сом.
                </span>
              </>
            ) : (
              <span className="font-bold text-sm" data-testid={`text-price-${product.id}`}>
                {product.price.toLocaleString("ru-RU")} сом.
              </span>
            )}
          </div>

          <Link href={`/product/${product.id}`}>
            <Button size="sm" data-testid={`button-details-${product.id}`}>
              Подробнее
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
