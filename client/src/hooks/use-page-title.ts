import { useEffect } from "react";

const PAGE_META: Record<string, { title: string; description: string }> = {
  "": {
    title: "ATG.TJ — №1 поставщик автодиагностического оборудования в Таджикистане",
    description: "AMIR TECH GROUP — автозапчасти, диагностическое оборудование, сход-развал, балансировка в Душанбе. Официальный дилер Autel, Thinkcar, Xtool, Sivik.",
  },
  "Каталог": {
    title: "Каталог автозапчастей и оборудования — ATG.TJ | Душанбе, Таджикистан",
    description: "Каталог автозапчастей, диагностического оборудования, сканеров, стендов сход-развала и балансировки в Душанбе. Доставка по Таджикистану.",
  },
  "Бренды": {
    title: "Бренды — Autel, Thinkcar, Xtool, Sivik | ATG.TJ Душанбе",
    description: "Официальный дилер ведущих мировых брендов автодиагностики в Таджикистане: Autel, Thinkcar, Xtool, Sivik, OBDStar, Xhorse.",
  },
  "Новости": {
    title: "Новости автомобильной отрасли Таджикистана | ATG.TJ",
    description: "Новости автомобильной индустрии, обновления оборудования и акции от AMIR TECH GROUP в Душанбе.",
  },
  "О компании": {
    title: "О компании AMIR TECH GROUP — автозапчасти и сервис в Душанбе | ATG.TJ",
    description: "AMIR TECH GROUP — 7+ лет на рынке Таджикистана. Поставка автозапчастей, диагностическое оборудование, собственный автосервис и учебный центр в Душанбе.",
  },
  "Скидки": {
    title: "Скидки на автозапчасти и оборудование в Душанбе | ATG.TJ",
    description: "Лучшие цены на диагностическое оборудование, автозапчасти и аксессуары в Душанбе, Таджикистан. Скидки до 30%.",
  },
  "Админ-панель": {
    title: "Админ-панель | ATG.TJ",
    description: "",
  },
};

export function usePageTitle(title: string) {
  useEffect(() => {
    const meta = PAGE_META[title];
    if (meta) {
      document.title = meta.title;
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl && meta.description) {
        descEl.setAttribute("content", meta.description);
      }
    } else {
      document.title = title ? `${title} | ATG.TJ — Автозапчасти Душанбе` : "ATG.TJ — AMIR TECH GROUP";
    }
  }, [title]);
}

export function useProductPageTitle(productName: string, brandName?: string) {
  useEffect(() => {
    const brand = brandName ? ` ${brandName}` : "";
    document.title = `${productName}${brand} — купить в Душанбе | ATG.TJ`;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute("content", `Купить ${productName}${brand} в Душанбе, Таджикистан. Официальная гарантия, доставка по всему Таджикистану. AMIR TECH GROUP.`);
    }
  }, [productName, brandName]);
}
