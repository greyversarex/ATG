import { Link } from "wouter";
import { Phone, MapPin, Mail, Navigation, MessageCircle } from "lucide-react";
import { SiTiktok, SiFacebook, SiYoutube, SiInstagram } from "react-icons/si";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  const navItems = [
    { label: t("nav.catalog"), href: "/catalog" },
    { label: t("nav.brands"), href: "/brands" },
    { label: t("nav.discounts"), href: "/discounts" },
    { label: t("nav.news"), href: "/news" },
    { label: t("nav.about"), href: "/about" },
  ];

  return (
    <footer className="mt-auto" style={{
      background: "linear-gradient(135deg, hsl(0 84% 35%) 0%, hsl(0 84% 45%) 30%, hsl(0 75% 40%) 60%, hsl(0 84% 32%) 100%)",
      color: "hsl(0 0% 95%)"
    }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5 mt-[-42px] mb-[-42px] pt-[9px] pb-[9px]">
              <img src="/images/atg-logo.png" alt="ATG" className="h-20 sm:h-28 object-contain drop-shadow-md mt-[-4px] mb-[-4px] ml-[-13px] mr-[-13px]" />
            </div>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed ml-[0px] mr-[0px] mt-[7px] mb-[7px]">
              {t("footer.description")}
            </p>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed mt-1.5 hidden sm:block">
              {t("footer.description2")}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Link href="/catalog">
                <span className="inline-flex items-center px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs font-semibold bg-white text-red-700 hover:bg-white/90 transition-colors cursor-pointer shadow-sm" data-testid="button-footer-catalog">
                  {t("footer.catalog")}
                </span>
              </Link>
              <a href="https://wa.me/992907109014?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C%20%D1%80%D0%B0%D1%81%D1%87%D1%91%D1%82" target="_blank" rel="noopener noreferrer">
                <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs font-semibold border border-white/30 hover:bg-white/10 transition-colors cursor-pointer" data-testid="button-footer-estimate">
                  <MessageCircle className="w-3 h-3" />
                  {t("footer.estimate")}
                </span>
              </a>
            </div>
          </div>

          <div className="ml-[69px] mr-[69px]">
            <h4 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4 text-white">{t("footer.navigation")}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="text-xs sm:text-sm opacity-80 cursor-pointer transition-opacity duration-200" style={{ textDecoration: "none" }}
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
            <h4 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4 text-white">{t("footer.contacts")}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 opacity-70 shrink-0" />
                <a href="tel:+992176100100" className="text-xs sm:text-sm opacity-80" data-testid="footer-phone">
                  +992 17 610 01 00
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 opacity-70 shrink-0" />
                <a href="mailto:Amirtechgroup.tj@gmail.com" className="text-xs sm:text-sm opacity-80 break-all" data-testid="footer-email">
                  Amirtechgroup.tj@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 opacity-70 shrink-0" />
                <span className="text-xs sm:text-sm opacity-80" data-testid="footer-address">
                  г. Душанбе, р-н Сино, ул. Рахмон Набиев
                </span>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h4 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4 text-white">{t("footer.location")}</h4>
            <div className="rounded-md overflow-hidden shadow-md" style={{ aspectRatio: "16/9" }}>
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
              className="mt-2 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-medium bg-white/15 hover:bg-white/25 transition-colors rounded-md py-1.5 sm:py-2 px-3"
              data-testid="button-footer-directions"
            >
              <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t("footer.getDirections")}
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-2 mt-5 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10 text-center">
          {[
            { num: "7+", label: t("footer.yearsOnMarket") },
            { num: "1000+", label: t("footer.clients") },
            { num: "300+", label: t("footer.specialists") },
            { num: "5+", label: t("footer.dealerships") },
            { num: "0 с.", label: t("footer.delivery") },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-sm sm:text-base font-extrabold text-white">{s.num}</span>
              <span className="text-[9px] sm:text-[10px] opacity-60">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-5 mt-4 sm:mt-6" data-testid="social-links">
          <a href="https://www.instagram.com/doujinbuu?igsh=MWM4eHM2cnRveXQyZg==" target="_blank" rel="noopener noreferrer" data-testid="link-instagram" aria-label="Instagram" className="opacity-80 hover:opacity-100 transition-opacity duration-200">
            <SiInstagram className="w-6 h-6" />
          </a>
          <a href="https://www.tiktok.com/@atg.tj?_r=1&_t=ZS-94EyDcsmUc8" target="_blank" rel="noopener noreferrer" data-testid="link-tiktok" aria-label="TikTok" className="opacity-80 hover:opacity-100 transition-opacity duration-200">
            <SiTiktok className="w-6 h-6" />
          </a>
          <a href="https://youtube.com/@atg-tj?si=A3YuP0vsmbPl4jpS" target="_blank" rel="noopener noreferrer" data-testid="link-youtube" aria-label="YouTube" className="opacity-80 hover:opacity-100 transition-opacity duration-200">
            <SiYoutube className="w-7 h-7" />
          </a>
          <a href="https://www.facebook.com/share/18BttMYQhh/" target="_blank" rel="noopener noreferrer" data-testid="link-facebook" aria-label="Facebook" className="opacity-80 hover:opacity-100 transition-opacity duration-200">
            <SiFacebook className="w-6 h-6" />
          </a>
        </div>

        <div className="border-t border-white/10 mt-4 sm:mt-6 pt-3 sm:pt-4">
          <p className="text-center text-[10px] sm:text-xs opacity-60" data-testid="text-copyright">
            &copy; {new Date().getFullYear()} AMIR TECH GROUP (ATG). {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
