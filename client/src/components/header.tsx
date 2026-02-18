import { Link, useLocation } from "wouter";
import { Menu, X, Phone, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { label: "Каталог", href: "/catalog" },
  { label: "Бренды", href: "/brands" },
  { label: "Скидки", href: "/discounts" },
  { label: "Новости", href: "/news" },
  { label: "О компании", href: "/about" },
];

export function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight tracking-tight">ATG.TJ</span>
                <span className="text-[10px] text-muted-foreground leading-tight">AMIR TECH GROUP</span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  size="sm"
                  data-testid={`nav-${item.href.slice(1)}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="tel:+992176100100"
              className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground"
              data-testid="link-phone"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+992 17 610 01 00</span>
            </a>

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setMobileOpen(false)}
                  data-testid={`mobile-nav-${item.href.slice(1)}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            <a href="tel:+992176100100" className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              +992 17 610 01 00
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
