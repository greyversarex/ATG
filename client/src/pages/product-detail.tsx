import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Phone, Heart, ShoppingCart } from "lucide-react";
import { useProductPageTitle } from "@/hooks/use-page-title";
import { useFavorites } from "@/hooks/use-favorites";
import { useI18n } from "@/lib/i18n";
import { OrderModal } from "@/components/order-modal";
import type { Product, Brand, Category } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { toggle, isFavorite } = useFavorites();
  const { t } = useI18n();
  const [orderOpen, setOrderOpen] = useState(false);

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

  useProductPageTitle(product?.name || "Товар", brand?.name);

  const locale = "ru-RU";

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Skeleton className="h-6 w-24 mb-4 sm:mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
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
        <p className="text-muted-foreground mb-4">{t("product.notFound")}</p>
        <Link href="/catalog">
          <Button variant="outline">{t("product.backToCatalogBtn")}</Button>
        </Link>
      </div>
    );
  }

  const discountedPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : null;

  const liked = isFavorite(product.id);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <Link href="/catalog">
        <Button variant="ghost" size="sm" className="mb-3 sm:mb-4 text-xs sm:text-sm" data-testid="button-back-catalog">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t("product.backToCatalog")}
        </Button>
      </Link>

      <Card className="overflow-visible p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative aspect-square sm:aspect-auto sm:min-h-[400px] overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none" style={{
            background: "linear-gradient(180deg, hsl(220 10% 96%) 0%, hsl(220 10% 92%) 100%)"
          }}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPercent && product.discountPercent > 0 ? (
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <Badge variant="destructive" className="text-xs sm:text-sm font-bold shadow-lg">
                  -{product.discountPercent}%
                </Badge>
              </div>
            ) : null}
            <button
              onClick={() => toggle(product.id)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md transition-all hover:scale-110 hover:bg-white cursor-pointer active:scale-95"
              data-testid="button-favorite-detail"
              aria-label={liked ? t("product.removeFromFavorites") : t("product.addToFavorites")}
            >
              <Heart className={`w-5 h-5 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </button>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold mb-2" data-testid="text-product-title">{product.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {brand && (
                  <Badge variant="secondary" className="text-xs" data-testid="badge-brand">{brand.name}</Badge>
                )}
                {category && (
                  <Badge variant="outline" className="text-xs" data-testid="badge-category">{category.name}</Badge>
                )}
              </div>
            </div>

            <div>
              {discountedPrice ? (
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-primary" data-testid="text-discounted-price">
                    {discountedPrice.toLocaleString(locale)} {t("currencyShort")}
                  </span>
                  <span className="text-sm sm:text-lg text-muted-foreground line-through">
                    {product.price.toLocaleString(locale)} {t("currencyShort")}
                  </span>
                </div>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold" data-testid="text-product-price">
                  {product.price.toLocaleString(locale)} {t("currencyShort")}
                </span>
              )}
            </div>

            {product.shortSpecs && (
              <div className="convex-card p-3 sm:p-4">
                <h3 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-1.5">{t("product.specs")}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed" data-testid="text-specs">
                  {product.shortSpecs}
                </p>
              </div>
            )}

            {product.description && (
              <div>
                <h3 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-1.5">{t("product.description")}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed" data-testid="text-description">
                  {product.description}
                </p>
              </div>
            )}

            <Button
              size="lg"
              className="w-full text-sm sm:text-base font-semibold shadow-md"
              onClick={() => setOrderOpen(true)}
              data-testid="button-buy"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Купить
            </Button>

            <div className="pt-3 sm:pt-4 border-t border-border/50">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{t("product.orderContact")}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a href="tel:+992176100100" className="flex-1 sm:flex-initial">
                  <Button className="shadow-md w-full sm:w-auto text-xs sm:text-sm" data-testid="button-call">
                    <Phone className="w-4 h-4 mr-2" />
                    +992 17 610 01 00
                  </Button>
                </a>
                <a
                  href="https://wa.me/992907109014?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D1%82%D0%BE%D0%B2%D0%B0%D1%80"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial"
                >
                  <Button variant="outline" className="w-full sm:w-auto text-xs sm:text-sm" data-testid="button-whatsapp">
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <OrderModal
        open={orderOpen}
        onOpenChange={setOrderOpen}
        productIds={[product.id]}
        productNames={[product.name]}
      />
    </div>
  );
}
