import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Phone } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import type { Product, Brand, Category } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
  });

  const { data: brand } = useQuery<Brand>({
    queryKey: ["/api/brands", product?.brandId],
    enabled: !!product?.brandId,
  });

  const { data: category } = useQuery<Category>({
    queryKey: ["/api/categories", product?.categoryId],
    enabled: !!product?.categoryId,
  });

  usePageTitle(product?.name || "Товар");

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">Товар не найден</p>
        <Link href="/catalog">
          <Button variant="outline">Вернуться в каталог</Button>
        </Link>
      </div>
    );
  }

  const discountedPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link href="/catalog">
        <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back-catalog">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Каталог
        </Button>
      </Link>

      <Card className="overflow-visible p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative aspect-square overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none" style={{
            background: "linear-gradient(180deg, hsl(220 10% 96%) 0%, hsl(220 10% 92%) 100%)"
          }}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPercent && product.discountPercent > 0 ? (
              <div className="absolute top-4 left-4">
                <Badge variant="destructive" className="text-sm font-bold shadow-lg">
                  -{product.discountPercent}%
                </Badge>
              </div>
            ) : null}
          </div>

          <div className="p-6 md:p-8 space-y-5">
            <div>
              <h1 className="text-2xl font-bold mb-2.5" data-testid="text-product-title">{product.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {brand && (
                  <Badge variant="secondary" data-testid="badge-brand">{brand.name}</Badge>
                )}
                {category && (
                  <Badge variant="outline" data-testid="badge-category">{category.name}</Badge>
                )}
              </div>
            </div>

            <div>
              {discountedPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary" data-testid="text-discounted-price">
                    {discountedPrice.toLocaleString("ru-RU")} сом.
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {product.price.toLocaleString("ru-RU")} сом.
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold" data-testid="text-product-price">
                  {product.price.toLocaleString("ru-RU")} сом.
                </span>
              )}
            </div>

            {product.shortSpecs && (
              <div className="convex-card p-4">
                <h3 className="font-semibold text-sm mb-1.5">Характеристики</h3>
                <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-specs">
                  {product.shortSpecs}
                </p>
              </div>
            )}

            {product.description && (
              <div>
                <h3 className="font-semibold text-sm mb-1.5">Описание</h3>
                <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-description">
                  {product.description}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-3">Для заказа свяжитесь с нами:</p>
              <a href="tel:+992176100100">
                <Button className="shadow-md" data-testid="button-call">
                  <Phone className="w-4 h-4 mr-2" />
                  +992 17 610 01 00
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
