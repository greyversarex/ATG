import { Link, useLocation } from "wouter";
import { Menu, X, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

const navItems = [
  { label: "Каталог", href: "/catalog" },
  { label: "Бренды", href: "/brands" },
  { label: "Скидки", href: "/discounts" },
  { label: "Новости", href: "/news" },
  { label: "О компании", href: "/about" },
];

function SearchDropdown({ query, onClose }: { query: string; onClose: () => void }) {
  const [, setLocation] = useLocation();
  const { data: results, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/search", query],
    queryFn: async () => {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      return res.json();
    },
    enabled: query.length >= 2,
  });

  if (query.length < 2) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto" data-testid="search-dropdown">
      {isLoading ? (
        <div className="p-4 text-sm text-muted-foreground text-center">Поиск...</div>
      ) : !results?.length ? (
        <div className="p-4 text-sm text-muted-foreground text-center">Ничего не найдено</div>
      ) : (
        <div>
          {results.slice(0, 6).map((product) => (
            <button
              key={product.id}
              className="w-full flex items-center gap-3 p-2.5 text-left hover-elevate cursor-pointer"
              onClick={() => {
                setLocation(`/product/${product.id}`);
                onClose();
              }}
              data-testid={`search-result-${product.id}`}
            >
              <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-muted">
                <img src={product.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.price.toLocaleString("ru-RU")} сом.
                </p>
              </div>
            </button>
          ))}
          {results.length > 6 && (
            <button
              className="w-full p-2.5 text-center text-sm text-primary cursor-pointer hover-elevate"
              onClick={() => {
                setLocation(`/catalog?search=${encodeURIComponent(query)}`);
                onClose();
              }}
              data-testid="search-view-all"
            >
              Показать все ({results.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [, setLoc] = useLocation();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      setLoc(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50" style={{
      background: "linear-gradient(135deg, hsl(0 84% 38%) 0%, hsl(0 84% 48%) 40%, hsl(0 75% 42%) 70%, hsl(0 84% 35%) 100%)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
    }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-3 h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <img src="/images/atg-logo.png" alt="ATG" className="h-28 object-contain drop-shadow-md" />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className={location === item.href
                    ? "bg-white/20 text-white border-white/10 no-default-hover-elevate no-default-active-elevate"
                    : "text-white/90 no-default-hover-elevate no-default-active-elevate hover:bg-white/10 hover:text-white"
                  }
                  data-testid={`nav-${item.href.slice(1)}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div ref={searchRef} className="relative hidden sm:block mr-1">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Поиск товаров..."
                  className="w-56 md:w-80 pl-8 text-sm bg-white border-white/30 text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  data-testid="input-search"
                />
              </form>
              {searchOpen && searchQuery.length >= 2 && (
                <SearchDropdown
                  query={searchQuery}
                  onClose={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                />
              )}
            </div>

            <a
              href="tel:+992176100100"
              className="hidden md:flex items-center gap-1.5 text-sm text-white/70"
              data-testid="link-phone"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+992 17 610 01 00</span>
            </a>

            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden text-white no-default-hover-elevate no-default-active-elevate hover:bg-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/15" style={{
          background: "linear-gradient(180deg, hsl(0 84% 42%) 0%, hsl(0 84% 38%) 100%)"
        }}>
          <nav className="flex flex-col p-4 gap-1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim().length >= 2) {
                  setLoc(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
                  setMobileOpen(false);
                  setSearchQuery("");
                }
              }}
              className="relative sm:hidden mb-2"
            >
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              <Input
                type="text"
                placeholder="Поиск товаров..."
                className="w-full pl-8 text-sm bg-white/15 border-white/20 text-white placeholder:text-white/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-mobile"
              />
            </form>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start no-default-hover-elevate no-default-active-elevate ${
                    location === item.href
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setMobileOpen(false)}
                  data-testid={`mobile-nav-${item.href.slice(1)}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <a href="tel:+992176100100" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70">
              <Phone className="w-4 h-4" />
              +992 17 610 01 00
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
