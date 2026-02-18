import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useState, useMemo } from "react";
import { Filter, X } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import type { Product, Category, Brand } from "@shared/schema";

export default function Catalog() {
  usePageTitle("Каталог");

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h1 className="text-2xl font-bold" data-testid="text-catalog-title">Каталог</h1>
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={() => setShowFilters(!showFilters)}
          data-testid="button-toggle-filters"
        >
          <Filter className="w-4 h-4 mr-1" />
          Фильтры
        </Button>
      </div>

      <div className="flex gap-6">
        <aside
          className={`${
            showFilters ? "block fixed inset-0 z-40 bg-background p-4 overflow-y-auto" : "hidden"
          } lg:block lg:relative lg:z-auto lg:bg-transparent lg:p-0 w-full lg:w-56 shrink-0`}
        >
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h3 className="font-bold">Фильтры</h3>
            <Button size="icon" variant="ghost" onClick={() => setShowFilters(false)} data-testid="button-close-filters">
              <X />
            </Button>
          </div>

          <div className="convex-card p-4 space-y-6">
            {categories && categories.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Категории</h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => {
                        setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                        setShowFilters(false);
                      }}
                      data-testid={`button-filter-category-${cat.id}`}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {brands && brands.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Бренды</h4>
                <div className="space-y-1">
                  {brands.map((brand) => (
                    <Button
                      key={brand.id}
                      variant={selectedBrand === brand.id ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => {
                        setSelectedBrand(selectedBrand === brand.id ? null : brand.id);
                        setShowFilters(false);
                      }}
                      data-testid={`button-filter-brand-${brand.id}`}
                    >
                      {brand.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sm mb-3">Цена</h4>
              <Slider
                min={0}
                max={maxPrice}
                step={100}
                value={priceRange}
                onValueChange={(v) => setPriceRange(v as [number, number])}
                data-testid="slider-price"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{priceRange[0].toLocaleString("ru-RU")} сом.</span>
                <span>{priceRange[1].toLocaleString("ru-RU")} сом.</span>
              </div>
            </div>

            {hasFilters && (
              <Button variant="outline" size="sm" className="w-full" onClick={clearFilters} data-testid="button-clear-filters">
                Сбросить фильтры
              </Button>
            )}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground" data-testid="text-no-products">Товары не найдены</p>
              {hasFilters && (
                <Button variant="outline" size="sm" className="mt-3" onClick={clearFilters}>
                  Сбросить фильтры
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
