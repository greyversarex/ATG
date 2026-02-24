import { Link } from "wouter";
import { Phone, MapPin, Mail, Navigation, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto" style={{
      background: "linear-gradient(135deg, hsl(0 84% 35%) 0%, hsl(0 84% 45%) 30%, hsl(0 75% 40%) 60%, hsl(0 84% 32%) 100%)",
      color: "hsl(0 0% 95%)"
    }}>
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <img src="/images/atg-logo.png" alt="ATG" className="h-36 object-contain drop-shadow-md mt-[-47px] mb-[-47px] pl-0 pr-0 ml-[-17px] mr-[-17px]" />
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Ведущий поставщик автозапчастей и диагностического оборудования в Таджикистане.
            </p>
            <p className="text-sm opacity-80 leading-relaxed mt-1.5">
              №1 поставщик автодиагностического оборудования. Официальный дилер Autel, Thinkcar, Xtool, Sivik.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Link href="/catalog">
                <span className="inline-flex items-center px-3 py-1.5 rounded text-xs font-semibold bg-white text-red-700 hover:bg-white/90 transition-colors cursor-pointer shadow-sm" data-testid="button-footer-catalog">
                  Смотреть каталог
                </span>
              </Link>
              <a href="https://wa.me/992907109014?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D1%80%D0%B0%D1%81%D1%87%D1%91%D1%82" target="_blank" rel="noopener noreferrer">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold border border-white/30 hover:bg-white/10 transition-colors cursor-pointer" data-testid="button-footer-estimate">
                  <MessageCircle className="w-3 h-3" />
                  Получить расчёт
                </span>
              </a>
            </div>
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
                    <span className="text-sm opacity-80 cursor-pointer transition-opacity duration-200" style={{ textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
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
                <Phone className="w-4 h-4 mt-0.5 opacity-70 shrink-0" />
                <a href="tel:+992176100100" className="text-sm opacity-80" data-testid="footer-phone">
                  +992 17 610 01 00
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 opacity-70 shrink-0" />
                <a href="mailto:Amirtechgroup.tj@gmail.com" className="text-sm opacity-80" data-testid="footer-email">
                  Amirtechgroup.tj@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 opacity-70 shrink-0" />
                <span className="text-sm opacity-80" data-testid="footer-address">
                  г. Душанбе, р-н Сино, ул. Рахмон Набиев, 2 гузаргох
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">Наше расположение</h4>
            <div className="rounded-md overflow-hidden shadow-md" style={{ aspectRatio: "4/3" }}>
              <iframe
                src="https://maps.google.com/maps?q=38.5437,68.8068&z=16&output=embed&hl=ru"
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
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=38.5437,68.8068&travelmode=driving"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium bg-white/15 hover:bg-white/25 transition-colors rounded-md py-2 px-3"
              data-testid="button-footer-directions"
            >
              <Navigation className="w-3.5 h-3.5" />
              Построить маршрут
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-6 pt-6 border-t border-white/10 text-center">
          {[
            { num: "7+", label: "лет на рынке" },
            { num: "1000+", label: "клиентов" },
            { num: "300+", label: "обученных специалистов" },
            { num: "5+", label: "официальных дилерств" },
            { num: "0 с.", label: "доставка по Душанбе" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-base font-extrabold text-white">{s.num}</span>
              <span className="text-[10px] opacity-60">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-6 pt-4">
          <p className="text-center text-xs opacity-60" data-testid="text-copyright">
            &copy; {new Date().getFullYear()} AMIR TECH GROUP (ATG). Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
