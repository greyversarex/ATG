import { useEffect } from "react";

type LangMeta = { title: string; description: string };

const PAGE_META: Record<string, { ru: LangMeta; en: LangMeta }> = {
  "": {
    ru: {
      title: "ATG.TJ — №1 поставщик автодиагностического оборудования в Таджикистане",
      description: "AMIR TECH GROUP — автозапчасти, диагностическое оборудование, сход-развал, балансировка в Душанбе. Официальный дилер Autel, Thinkcar, Xtool, Sivik.",
    },
    en: {
      title: "ATG.TJ — #1 Auto Diagnostic Equipment Supplier in Tajikistan",
      description: "AMIR TECH GROUP — auto parts, diagnostic equipment, wheel alignment, balancing in Dushanbe. Official dealer of Autel, Thinkcar, Xtool, Sivik.",
    },
  },
  catalog: {
    ru: {
      title: "Каталог автозапчастей и оборудования — ATG.TJ | Душанбе, Таджикистан",
      description: "Каталог автозапчастей, диагностического оборудования, сканеров, стендов сход-развала и балансировки в Душанбе. Доставка по Таджикистану.",
    },
    en: {
      title: "Auto Parts & Equipment Catalog — ATG.TJ | Dushanbe, Tajikistan",
      description: "Catalog of auto parts, diagnostic equipment, scanners, wheel alignment and balancing stands in Dushanbe. Delivery across Tajikistan.",
    },
  },
  brands: {
    ru: {
      title: "Бренды — Autel, Thinkcar, Xtool, Sivik | ATG.TJ Душанбе",
      description: "Официальный дилер ведущих мировых брендов автодиагностики в Таджикистане: Autel, Thinkcar, Xtool, Sivik, OBDStar, Xhorse.",
    },
    en: {
      title: "Brands — Autel, Thinkcar, Xtool, Sivik | ATG.TJ Dushanbe",
      description: "Official dealer of leading global auto diagnostic brands in Tajikistan: Autel, Thinkcar, Xtool, Sivik, OBDStar, Xhorse.",
    },
  },
  news: {
    ru: {
      title: "Новости автомобильной отрасли Таджикистана | ATG.TJ",
      description: "Новости автомобильной индустрии, обновления оборудования и акции от AMIR TECH GROUP в Душанбе.",
    },
    en: {
      title: "Automotive Industry News in Tajikistan | ATG.TJ",
      description: "Automotive industry news, equipment updates and promotions from AMIR TECH GROUP in Dushanbe.",
    },
  },
  about: {
    ru: {
      title: "О компании AMIR TECH GROUP — автозапчасти и сервис в Душанбе | ATG.TJ",
      description: "AMIR TECH GROUP — 7+ лет на рынке Таджикистана. Поставка автозапчастей, диагностическое оборудование, собственный автосервис и учебный центр в Душанбе.",
    },
    en: {
      title: "About AMIR TECH GROUP — Auto Parts & Service in Dushanbe | ATG.TJ",
      description: "AMIR TECH GROUP — 7+ years in Tajikistan market. Auto parts supply, diagnostic equipment, own auto service and training center in Dushanbe.",
    },
  },
  discounts: {
    ru: {
      title: "Скидки на автозапчасти и оборудование в Душанбе | ATG.TJ",
      description: "Лучшие цены на диагностическое оборудование, автозапчасти и аксессуары в Душанбе, Таджикистан. Скидки до 30%.",
    },
    en: {
      title: "Discounts on Auto Parts & Equipment in Dushanbe | ATG.TJ",
      description: "Best prices on diagnostic equipment, auto parts and accessories in Dushanbe, Tajikistan. Up to 30% off.",
    },
  },
  favorites: {
    ru: {
      title: "Избранное | ATG.TJ",
      description: "Ваши избранные товары из каталога ATG.TJ",
    },
    en: {
      title: "Favorites | ATG.TJ",
      description: "Your favorite products from ATG.TJ catalog",
    },
  },
  admin: {
    ru: {
      title: "Админ-панель | ATG.TJ",
      description: "",
    },
    en: {
      title: "Admin Panel | ATG.TJ",
      description: "",
    },
  },
};

function getLang(): "ru" | "en" {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("atg-lang");
    if (saved === "en" || saved === "ru") return saved;
  }
  return "ru";
}

export function usePageTitle(key: string) {
  useEffect(() => {
    const lang = getLang();
    const meta = PAGE_META[key];
    if (meta) {
      document.title = meta[lang].title;
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl && meta[lang].description) {
        descEl.setAttribute("content", meta[lang].description);
      }
    } else {
      document.title = key ? `${key} | ATG.TJ` : "ATG.TJ — AMIR TECH GROUP";
    }
  }, [key]);
}

export function useProductPageTitle(productName: string, brandName?: string) {
  useEffect(() => {
    const lang = getLang();
    const brand = brandName ? ` ${brandName}` : "";
    if (lang === "en") {
      document.title = `${productName}${brand} — Buy in Dushanbe | ATG.TJ`;
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) {
        descEl.setAttribute("content", `Buy ${productName}${brand} in Dushanbe, Tajikistan. Official warranty, delivery across Tajikistan. AMIR TECH GROUP.`);
      }
    } else {
      document.title = `${productName}${brand} — купить в Душанбе | ATG.TJ`;
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) {
        descEl.setAttribute("content", `Купить ${productName}${brand} в Душанбе, Таджикистан. Официальная гарантия, доставка по всему Таджикистану. AMIR TECH GROUP.`);
      }
    }
  }, [productName, brandName]);
}
