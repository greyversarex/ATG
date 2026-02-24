import { createContext, useContext, useCallback, type ReactNode } from "react";

const translations = {
  nav: {
    catalog: "Каталог",
    brands: "Бренды",
    discounts: "Скидки",
    news: "Новости",
    about: "О компании",
    favorites: "Избранное",
  },
  search: {
    placeholder: "Поиск товаров...",
    searching: "Поиск...",
    noResults: "Ничего не найдено",
    showAll: "Показать все",
  },
  home: {
    bestsellers: "Хиты продаж",
    viewAll: "Смотреть все",
    discounts: "Скидки",
    ctaTitle: "Открой или модернизируй автосервис вместе с ATG",
    ctaButton: "Получить бесплатный расчёт",
    services: "Наши услуги",
    news: "Новости",
    categories: "Категории товаров",
  },
  catalog: {
    title: "Каталог",
    filters: "Фильтры",
    categories: "Категории",
    brands: "Бренды",
    price: "Цена",
    clearFilters: "Сбросить фильтры",
    results: "Результаты:",
    found: "Найдено:",
    noProducts: "Товары не найдены",
  },
  brands: {
    title: "Бренды",
    empty: "Бренды не найдены",
  },
  news: {
    title: "Новости",
    empty: "Новостей пока нет",
  },
  discounts: {
    title: "Скидки",
    subtitle: "Специальные предложения на избранные товары",
    empty: "Сейчас нет товаров со скидкой",
  },
  favorites: {
    title: "Избранное",
    emptyTitle: "В избранном пока пусто",
    emptyText: "Нажмите на сердечко на карточке товара, чтобы добавить его в избранное",
    goToCatalog: "Перейти в каталог",
  },
  product: {
    backToCatalog: "Каталог",
    notFound: "Товар не найден",
    backToCatalogBtn: "Вернуться в каталог",
    specs: "Характеристики",
    description: "Описание",
    orderContact: "Для заказа свяжитесь с нами:",
    details: "Подробнее",
    addToFavorites: "Добавить в избранное",
    removeFromFavorites: "Удалить из избранного",
  },
  about: {
    title: "О компании",
    subtitle: "AMIR TECH GROUP (ATG) — ведущий поставщик комплексных решений для автомобильной отрасли в Таджикистане.",
    specialization: "Специализация",
    specText1: "Компания специализируется на дистрибуции автозапчастей, поставке профессионального оборудования для СТО, диагностических сканерах и компонентах пневмоподвески.",
    specText2: "С более чем 10-летним опытом успешной работы мы обеспечиваем высококачественные решения для автомобильной индустрии Таджикистана.",
    keyDirections: "Ключевые направления",
    advantages: "Преимущества",
    contacts: "Контакты",
    company: "Компания:",
    ceo: "Генеральный директор:",
    postalCode: "Почтовый индекс:",
    location: "Наше расположение",
    getDirections: "Построить маршрут",
    yearsOnMarket: "лет на рынке",
    employees: "сотрудников",
    trainingCenter: "учебный центр",
    clients: "клиентов",
    successfulWork: "Успешной работы",
    qualified: "Квалифицированных",
    own: "Собственный",
    trustUs: "Доверяют нам",
    directions: [
      "Продажа диагностического оборудования (Thinkcar, Autel, OBDStar, Xhorse и др.)",
      "Поставка автозапчастей и систем",
      "Сервис и поддержка",
      "Обучение специалистов",
    ],
    advantagesList: [
      "Глубокая экспертиза в автомобильной отрасли",
      "Собственный автосервис и учебный центр",
      "Профессиональная диагностика, сход-развал, балансировка",
      "Обучение специалистов автосервисов",
    ],
  },
  footer: {
    description: "Ведущий поставщик автозапчастей и диагностического оборудования в Таджикистане.",
    description2: "№1 поставщик автодиагностического оборудования. Официальный дилер Autel, Thinkcar, Xtool, Sivik.",
    catalog: "Каталог",
    estimate: "Расчёт",
    navigation: "Навигация",
    contacts: "Контакты",
    location: "Наше расположение",
    getDirections: "Построить маршрут",
    copyright: "Все права защищены.",
    yearsOnMarket: "лет на рынке",
    clients: "клиентов",
    specialists: "специалистов",
    dealerships: "дилерств",
    delivery: "доставка",
  },
  floating: {
    call: "Позвонить",
  },
  currency: "сом.",
  currencyShort: "с.",
} as const;

interface I18nContextValue {
  lang: "ru";
  t: (path: string) => string;
  ta: (path: string) => string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const t = useCallback((path: string): string => {
    const parts = path.split(".");
    let current: any = translations;
    for (const part of parts) {
      current = current?.[part];
    }
    if (typeof current === "string") return current;
    return path;
  }, []);

  const ta = useCallback((path: string): string[] => {
    const parts = path.split(".");
    let current: any = translations;
    for (const part of parts) {
      current = current?.[part];
    }
    if (Array.isArray(current)) return current;
    return [];
  }, []);

  return (
    <I18nContext.Provider value={{ lang: "ru", t, ta }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
