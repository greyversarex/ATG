import { Link } from "wouter";
import { Phone, MapPin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto" style={{
      background: "linear-gradient(135deg, hsl(0 84% 35%) 0%, hsl(0 84% 45%) 30%, hsl(0 75% 40%) 60%, hsl(0 84% 32%) 100%)",
      color: "hsl(0 0% 95%)"
    }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/images/atg-logo.png" alt="ATG" className="h-28 object-contain drop-shadow-md" />
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
                <Mail className="w-4 h-4 mt-0.5 opacity-50 shrink-0" />
                <a href="mailto:Amirtechgroup.tj@gmail.com" className="text-sm opacity-60" data-testid="footer-email">
                  Amirtechgroup.tj@gmail.com
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
            <h4 className="font-semibold text-sm mb-4 text-white">Наше расположение</h4>
            <div className="rounded-md overflow-hidden shadow-md" style={{ aspectRatio: "4/3" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3068.8!2d68.7864!3d38.5598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0JTRg9GI0LDQvdCx0LUsINGA0LDQudC-0L0g0KHQuNC90L4!5e0!3m2!1sru!2s!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ATG Location"
                data-testid="map-footer"
              />
            </div>
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
