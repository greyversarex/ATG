import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Lang = "ru" | "en";

const translations = {
  nav: {
    catalog: { ru: "Каталог", en: "Catalog" },
    brands: { ru: "Бренды", en: "Brands" },
    discounts: { ru: "Скидки", en: "Discounts" },
    news: { ru: "Новости", en: "News" },
    about: { ru: "О компании", en: "About" },
    favorites: { ru: "Избранное", en: "Favorites" },
  },
  search: {
    placeholder: { ru: "Поиск товаров...", en: "Search products..." },
    searching: { ru: "Поиск...", en: "Searching..." },
    noResults: { ru: "Ничего не найдено", en: "Nothing found" },
    showAll: { ru: "Показать все", en: "Show all" },
  },
  home: {
    bestsellers: { ru: "Хиты продаж", en: "Bestsellers" },
    viewAll: { ru: "Смотреть все", en: "View all" },
    discounts: { ru: "Скидки", en: "Discounts" },
    ctaTitle: { ru: "Открой или модернизируй автосервис вместе с ATG", en: "Open or upgrade your auto service with ATG" },
    ctaButton: { ru: "Получить бесплатный расчёт", en: "Get a free estimate" },
    services: { ru: "Наши услуги", en: "Our services" },
    news: { ru: "Новости", en: "News" },
    categories: { ru: "Категории товаров", en: "Product categories" },
  },
  catalog: {
    title: { ru: "Каталог", en: "Catalog" },
    filters: { ru: "Фильтры", en: "Filters" },
    categories: { ru: "Категории", en: "Categories" },
    brands: { ru: "Бренды", en: "Brands" },
    price: { ru: "Цена", en: "Price" },
    clearFilters: { ru: "Сбросить фильтры", en: "Clear filters" },
    results: { ru: "Результаты:", en: "Results:" },
    found: { ru: "Найдено:", en: "Found:" },
    noProducts: { ru: "Товары не найдены", en: "No products found" },
  },
  brands: {
    title: { ru: "Бренды", en: "Brands" },
    empty: { ru: "Бренды не найдены", en: "No brands found" },
  },
  news: {
    title: { ru: "Новости", en: "News" },
    empty: { ru: "Новостей пока нет", en: "No news yet" },
  },
  discounts: {
    title: { ru: "Скидки", en: "Discounts" },
    subtitle: { ru: "Специальные предложения на избранные товары", en: "Special offers on selected products" },
    empty: { ru: "Сейчас нет товаров со скидкой", en: "No discounted products at the moment" },
  },
  favorites: {
    title: { ru: "Избранное", en: "Favorites" },
    emptyTitle: { ru: "В избранном пока пусто", en: "Your favorites list is empty" },
    emptyText: { ru: "Нажмите на сердечко на карточке товара, чтобы добавить его в избранное", en: "Tap the heart icon on a product card to add it to favorites" },
    goToCatalog: { ru: "Перейти в каталог", en: "Go to catalog" },
  },
  product: {
    backToCatalog: { ru: "Каталог", en: "Catalog" },
    notFound: { ru: "Товар не найден", en: "Product not found" },
    backToCatalogBtn: { ru: "Вернуться в каталог", en: "Back to catalog" },
    specs: { ru: "Характеристики", en: "Specifications" },
    description: { ru: "Описание", en: "Description" },
    orderContact: { ru: "Для заказа свяжитесь с нами:", en: "Contact us to order:" },
    details: { ru: "Подробнее", en: "Details" },
    addToFavorites: { ru: "Добавить в избранное", en: "Add to favorites" },
    removeFromFavorites: { ru: "Удалить из избранного", en: "Remove from favorites" },
  },
  about: {
    title: { ru: "О компании", en: "About us" },
    subtitle: { ru: "AMIR TECH GROUP (ATG) — ведущий поставщик комплексных решений для автомобильной отрасли в Таджикистане.", en: "AMIR TECH GROUP (ATG) — a leading supplier of comprehensive solutions for the automotive industry in Tajikistan." },
    specialization: { ru: "Специализация", en: "Specialization" },
    specText1: { ru: "Компания специализируется на дистрибуции автозапчастей, поставке профессионального оборудования для СТО, диагностических сканерах и компонентах пневмоподвески.", en: "The company specializes in distribution of auto parts, supply of professional equipment for service stations, diagnostic scanners and air suspension components." },
    specText2: { ru: "С более чем 10-летним опытом успешной работы мы обеспечиваем высококачественные решения для автомобильной индустрии Таджикистана.", en: "With more than 10 years of successful experience, we provide high-quality solutions for the automotive industry of Tajikistan." },
    keyDirections: { ru: "Ключевые направления", en: "Key directions" },
    advantages: { ru: "Преимущества", en: "Advantages" },
    contacts: { ru: "Контакты", en: "Contacts" },
    company: { ru: "Компания:", en: "Company:" },
    ceo: { ru: "Генеральный директор:", en: "CEO:" },
    postalCode: { ru: "Почтовый индекс:", en: "Postal code:" },
    location: { ru: "Наше расположение", en: "Our location" },
    getDirections: { ru: "Построить маршрут", en: "Get directions" },
    yearsOnMarket: { ru: "лет на рынке", en: "years on market" },
    employees: { ru: "сотрудников", en: "employees" },
    trainingCenter: { ru: "учебный центр", en: "training center" },
    clients: { ru: "клиентов", en: "clients" },
    successfulWork: { ru: "Успешной работы", en: "Successful work" },
    qualified: { ru: "Квалифицированных", en: "Qualified" },
    own: { ru: "Собственный", en: "Own" },
    trustUs: { ru: "Доверяют нам", en: "Trust us" },
    directions: {
      ru: [
        "Продажа диагностического оборудования (Thinkcar, Autel, OBDStar, Xhorse и др.)",
        "Поставка автозапчастей и систем",
        "Сервис и поддержка",
        "Обучение специалистов",
      ],
      en: [
        "Diagnostic equipment sales (Thinkcar, Autel, OBDStar, Xhorse, etc.)",
        "Auto parts and systems supply",
        "Service and support",
        "Specialist training",
      ],
    },
    advantagesList: {
      ru: [
        "Глубокая экспертиза в автомобильной отрасли",
        "Собственный автосервис и учебный центр",
        "Профессиональная диагностика, сход-развал, балансировка",
        "Обучение специалистов автосервисов",
      ],
      en: [
        "Deep expertise in the automotive industry",
        "Own auto service and training center",
        "Professional diagnostics, wheel alignment, balancing",
        "Training of auto service specialists",
      ],
    },
  },
  footer: {
    description: { ru: "Ведущий поставщик автозапчастей и диагностического оборудования в Таджикистане.", en: "Leading supplier of auto parts and diagnostic equipment in Tajikistan." },
    description2: { ru: "№1 поставщик автодиагностического оборудования. Официальный дилер Autel, Thinkcar, Xtool, Sivik.", en: "#1 supplier of auto diagnostic equipment. Official dealer of Autel, Thinkcar, Xtool, Sivik." },
    catalog: { ru: "Каталог", en: "Catalog" },
    estimate: { ru: "Расчёт", en: "Estimate" },
    navigation: { ru: "Навигация", en: "Navigation" },
    contacts: { ru: "Контакты", en: "Contacts" },
    location: { ru: "Наше расположение", en: "Our location" },
    getDirections: { ru: "Построить маршрут", en: "Get directions" },
    copyright: { ru: "Все права защищены.", en: "All rights reserved." },
    yearsOnMarket: { ru: "лет на рынке", en: "years on market" },
    clients: { ru: "клиентов", en: "clients" },
    specialists: { ru: "специалистов", en: "specialists" },
    dealerships: { ru: "дилерств", en: "dealerships" },
    delivery: { ru: "доставка", en: "delivery" },
  },
  floating: {
    call: { ru: "Позвонить", en: "Call" },
  },
  currency: { ru: "сом.", en: "TJS" },
  currencyShort: { ru: "с.", en: "TJS" },
} as const;

type Translations = typeof translations;
type TranslationPath = {
  [K in keyof Translations]: {
    [K2 in keyof Translations[K]]: Translations[K][K2] extends Record<Lang, string> ? `${K & string}.${K2 & string}` : never;
  }[keyof Translations[K]];
}[keyof Translations];

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string) => string;
  ta: (path: string) => string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("atg-lang");
      if (saved === "en" || saved === "ru") return saved;
    }
    return "ru";
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("atg-lang", newLang);
    document.documentElement.lang = newLang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((path: string): string => {
    const parts = path.split(".");
    let current: any = translations;
    for (const part of parts) {
      current = current?.[part];
    }
    if (current && typeof current === "object" && lang in current) {
      return current[lang];
    }
    return path;
  }, [lang]);

  const ta = useCallback((path: string): string[] => {
    const parts = path.split(".");
    let current: any = translations;
    for (const part of parts) {
      current = current?.[part];
    }
    if (current && typeof current === "object" && lang in current) {
      return current[lang];
    }
    return [];
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, ta }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
