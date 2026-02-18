import { Link } from "wouter";
import { Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto" style={{
      background: "linear-gradient(180deg, hsl(220 15% 12%) 0%, hsl(220 15% 8%) 100%)",
      color: "hsl(220 10% 88%)"
    }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-red-700 flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-bold text-base">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight text-white">ATG.TJ</span>
                <span className="text-[10px] opacity-50 leading-tight">AMIR TECH GROUP</span>
              </div>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              Ведущий поставщик автозапчастей и диагностического оборудования в Таджикистане.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Навигация</h4>
            <ul className="space-y-2">
              {[
                { label: "Каталог", href: "/catalog" },
                { label: "Бренды", href: "/brands" },
                { label: "Скидки", href: "/discounts" },
                { label: "Новости", href: "/news" },
                { label: "О компании", href: "/about" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="text-sm opacity-60 cursor-pointer transition-opacity duration-200" style={{ textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
                      data-testid={`footer-${item.href.slice(1)}`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 opacity-50 shrink-0" />
                <a href="tel:+992176100100" className="text-sm opacity-60" data-testid="footer-phone">
                  +992 17 610 01 00
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 opacity-50 shrink-0" />
                <span className="text-sm opacity-60" data-testid="footer-address">
                  г. Душанбе, р-н Сино, ул. Рахмон Набиев, 2 гузаргох
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">О компании</h4>
            <p className="text-sm opacity-60 leading-relaxed">
              Генеральный директор: Шарипов Парвиз
            </p>
            <p className="text-sm opacity-60 mt-2">
              Почтовый индекс: 734026
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6">
          <p className="text-center text-xs opacity-40" data-testid="text-copyright">
            &copy; {new Date().getFullYear()} AMIR TECH GROUP (ATG). Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
