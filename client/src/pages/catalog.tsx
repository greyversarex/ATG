import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useState, useMemo } from "react";
import { Filter, X, Check } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useI18n } from "@/lib/i18n";
import type { Product, Category, Brand } from "@shared/schema";

function FilterCheckbox({
  checked,
  label,
  onClick,
  testId,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full py-1.5 px-1 rounded text-sm hover-elevate overflow-visible cursor-pointer text-left"
      data-testid={testId}
    >
      <span
        className={`flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-colors ${
          checked
            ? "bg-primary border-primary text-primary-foreground"
            : "border-border"
        }`}
      >
        {checked && <Check className="w-3 h-3" />}
      </span>
      <span className={checked ? "font-medium" : ""}>{label}</span>
    </button>
  );
}

export default function Catalog() {
  usePageTitle("catalog");
  const { t } = useI18n();

  const search = useSearch();
  const params = new URLSearchParams(search);
  const brandFilter = params.get("brand");
  const categoryFilter = params.get("category");
  const searchFilter = params.get("search");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFilter);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(brandFilter);
  const [searchText, setSearchText] = useState(searchFilter || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  const maxPrice = useMemo(() => {
    if (!products?.length) return 100000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      if (selectedCategory && p.categoryId !== selectedCategory) return false;
      if (selectedBrand && p.brandId !== selectedBrand) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (searchText.trim().length >= 2) {
        const q = searchText.toLowerCase();
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const specMatch = p.shortSpecs?.toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !specMatch) return false;
      }
      return true;
    });
  }, [products, selectedCategory, selectedBrand, priceRange, searchText]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSearchText("");
    setPriceRange([0, maxPrice]);
  };

  const hasFilters = selectedCategory || selectedBrand || searchText.trim().length >= 2 || priceRange[0] > 0 || priceRange[1] < maxPrice;
  const locale = "ru-RU";

  const filterContent = (
    <div className="space-y-5">
      {categories && categories.length > 0 && (
        <div>
          <h4 className="font-bold text-sm mb-2 uppercase tracking-wide">{t("catalog.categories")}</h4>
          <div className="space-y-0.5 max-h-[40vh] overflow-y-auto lg:max-h-none">
            {categories.map((cat) => (
              <FilterCheckbox
                key={cat.id}
                checked={selectedCategory === cat.id}
                label={cat.name}
                onClick={() => {
                  setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                  setShowFilters(false);
                }}
                testId={`button-filter-category-${cat.id}`}
              />
            ))}
          </div>
        </div>
      )}

      {brands && brands.length > 0 && (
        <div>
          <h4 className="font-bold text-sm mb-2 uppercase tracking-wide">{t("catalog.brands")}</h4>
          <div className="space-y-0.5">
            {brands.map((brand) => (
              <FilterCheckbox
                key={brand.id}
                checked={selectedBrand === brand.id}
                label={brand.name}
                onClick={() => {
                  setSelectedBrand(selectedBrand === brand.id ? null : brand.id);
                  setShowFilters(false);
                }}
                testId={`button-filter-brand-${brand.id}`}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-bold text-sm mb-3 uppercase tracking-wide">{t("catalog.price")}</h4>
        <Slider
          min={0}
          max={maxPrice}
          step={100}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          data-testid="slider-price"
        />
        <div className="flex justify-between gap-2 mt-2 text-xs text-muted-foreground">
          <span>{priceRange[0].toLocaleString(locale)} {t("currency")}</span>
          <span>{priceRange[1].toLocaleString(locale)} {t("currency")}</span>
        </div>
      </div>

      {hasFilters && (
        <Button variant="destructive" size="sm" className="w-full" onClick={() => { clearFilters(); setShowFilters(false); }} data-testid="button-clear-filters">
          <X className="w-3.5 h-3.5 mr-1.5" />
          {t("catalog.clearFilters")}
        </Button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold" data-testid="text-catalog-title">{t("catalog.title")}</h1>
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden text-xs sm:text-sm"
          onClick={() => setShowFilters(!showFilters)}
          data-testid="button-toggle-filters"
        >
          <Filter className="w-4 h-4 mr-1" />
          {t("catalog.filters")}
          {hasFilters && <span className="ml-1 w-2 h-2 rounded-full bg-primary" />}
        </Button>
      </div>

      <div className="flex gap-6">
        {showFilters && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setShowFilters(false)}
          />
        )}
        <aside
          className={`${
            showFilters
              ? "fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl max-h-[85dvh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
              : "hidden"
          } lg:block lg:relative lg:z-auto lg:bg-transparent lg:rounded-none lg:shadow-none lg:max-h-none lg:animate-none w-full lg:w-60 shrink-0`}
        >
          <div className="flex items-center justify-between lg:hidden p-4 pb-2 sticky top-0 bg-background z-10">
            <h3 className="font-bold text-lg">{t("catalog.filters")}</h3>
            <Button size="icon" variant="ghost" onClick={() => setShowFilters(false)} data-testid="button-close-filters">
              <X />
            </Button>
          </div>
          <div className="w-full h-1 flex justify-center lg:hidden -mt-1 mb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
          </div>

          <div className="bg-card border border-border rounded-md p-4 mx-4 mb-4 lg:mx-0 lg:mb-0">
            {filterContent}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {searchText && (
            <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
              <span className="text-xs sm:text-sm text-muted-foreground">{t("catalog.results")}</span>
              <span className="text-xs sm:text-sm font-semibold">"{searchText}"</span>
              <Button variant="ghost" size="sm" onClick={() => setSearchText("")} data-testid="button-clear-search">
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-3 sm:h-4 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-muted-foreground text-sm" data-testid="text-no-products">{t("catalog.noProducts")}</p>
              {hasFilters && (
                <Button variant="outline" size="sm" className="mt-3" onClick={clearFilters}>
                  {t("catalog.clearFilters")}
                </Button>
              )}
            </div>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4" data-testid="text-products-count">
                {t("catalog.found")} {filtered.length}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
