import { db } from "./db";
import { brands, categories, products, banners, news, services } from "@shared/schema";
import { log } from "./index";

export async function seedDatabase() {
  const existingBrands = await db.select().from(brands);
  if (existingBrands.length > 0) {
    log("Database already seeded, skipping");
    return;
  }

  log("Seeding database...");

  const [thinkcar, autel, obdstar, xhorse, launch] = await db.insert(brands).values([
    { name: "Thinkcar", image: "/images/product-scanner.png", sortOrder: 1 },
    { name: "Autel", image: "/images/product-tablet.png", sortOrder: 2 },
    { name: "OBDStar", image: "/images/product-keyprog.png", sortOrder: 3 },
    { name: "Xhorse", image: "/images/product-keyprog.png", sortOrder: 4 },
    { name: "Launch", image: "/images/product-scanner.png", sortOrder: 5 },
  ]).returning();

  const [catDiag, catEquip, catSusp, catParts] = await db.insert(categories).values([
    { name: "Диагностическое оборудование", image: "/images/cat-diagnostics.png", sortOrder: 1 },
    { name: "Оборудование для СТО", image: "/images/cat-equipment.png", sortOrder: 2 },
    { name: "Пневмоподвеска", image: "/images/cat-suspension.png", sortOrder: 3 },
    { name: "Автозапчасти", image: "/images/cat-parts.png", sortOrder: 4 },
  ]).returning();

  await db.insert(products).values([
    {
      name: "Thinkcar Thinktool Max",
      description: "Профессиональный мультимарочный диагностический сканер с расширенными функциями ECU кодирования и программирования.",
      shortSpecs: "12.3\" экран, Android, Wi-Fi, Bluetooth",
      price: 25000,
      image: "/images/product-scanner.png",
      brandId: thinkcar.id,
      categoryId: catDiag.id,
      isBestseller: true,
      discountPercent: 0,
    },
    {
      name: "Autel MaxiSys MS906 Pro",
      description: "Диагностический планшет с поддержкой более 80 марок автомобилей, кодирование и адаптация.",
      shortSpecs: "8\" сенсорный экран, Android 10, полная диагностика",
      price: 18500,
      image: "/images/product-tablet.png",
      brandId: autel.id,
      categoryId: catDiag.id,
      isBestseller: true,
      discountPercent: 10,
    },
    {
      name: "OBDStar X300 DP Plus",
      description: "Программатор ключей и иммобилайзеров с поддержкой широкого спектра автомобилей.",
      shortSpecs: "Программирование ключей, коррекция одометра, EEPROM",
      price: 12000,
      image: "/images/product-keyprog.png",
      brandId: obdstar.id,
      categoryId: catDiag.id,
      isBestseller: true,
      discountPercent: 0,
    },
    {
      name: "Xhorse VVDI Key Tool Max",
      description: "Универсальный инструмент для генерации и программирования автомобильных ключей.",
      shortSpecs: "Генерация транспондеров, дистанционное программирование",
      price: 8500,
      image: "/images/product-keyprog.png",
      brandId: xhorse.id,
      categoryId: catDiag.id,
      isBestseller: false,
      discountPercent: 15,
    },
    {
      name: "Стенд сход-развала 3D",
      description: "Профессиональный 3D стенд для проверки и регулировки углов установки колёс.",
      shortSpecs: "3D камеры, автоматическая калибровка, база данных авто",
      price: 45000,
      image: "/images/product-alignment.png",
      brandId: launch.id,
      categoryId: catEquip.id,
      isBestseller: true,
      discountPercent: 0,
    },
    {
      name: "Балансировочный станок B-500",
      description: "Автоматический балансировочный станок для колёс легковых автомобилей и внедорожников.",
      shortSpecs: "Диаметр до 24\", точность 1г, автозажим",
      price: 15000,
      image: "/images/product-balancer.png",
      brandId: launch.id,
      categoryId: catEquip.id,
      isBestseller: false,
      discountPercent: 5,
    },
    {
      name: "Компрессор пневмоподвески BMW X5",
      description: "Оригинальный компрессор пневматической подвески для BMW X5 (E70, F15).",
      shortSpecs: "OEM качество, гарантия 12 месяцев",
      price: 3500,
      image: "/images/product-suspension.png",
      brandId: autel.id,
      categoryId: catSusp.id,
      isBestseller: false,
      discountPercent: 0,
    },
    {
      name: "Пневмобаллон задний Mercedes ML",
      description: "Пневматический баллон задней подвески для Mercedes-Benz ML/GL W164/X164.",
      shortSpecs: "Совместимость: W164, X164, ресурс 80000 км",
      price: 2800,
      image: "/images/product-suspension.png",
      brandId: thinkcar.id,
      categoryId: catSusp.id,
      isBestseller: false,
      discountPercent: 20,
    },
  ]);

  await db.insert(banners).values([
    {
      type: "hero",
      image: "/images/hero-banner-1.png",
      title: "Профессиональное диагностическое оборудование",
      description: "Широкий ассортимент сканеров и приборов для автосервисов от ведущих мировых производителей.",
      buttonText: "Смотреть каталог",
      buttonLink: "/catalog",
      sortOrder: 1,
    },
    {
      type: "hero",
      image: "/images/hero-banner-2.png",
      title: "Оборудование для СТО",
      description: "Стенды сход-развала, балансировочные станки и подъёмники. Полное оснащение автосервиса.",
      buttonText: "Подробнее",
      buttonLink: "/catalog",
      sortOrder: 2,
    },
    {
      type: "hero",
      image: "/images/hero-banner-3.png",
      title: "Обучение и сертификация",
      description: "Собственный учебный центр для подготовки специалистов автомобильной диагностики.",
      buttonText: "О компании",
      buttonLink: "/about",
      sortOrder: 3,
    },
    {
      type: "promo",
      image: "/images/promo-banner.png",
      title: "Скидки до 20% на диагностическое оборудование",
      description: "Специальные цены на сканеры Thinkcar и Autel до конца месяца.",
      buttonText: "Смотреть скидки",
      buttonLink: "/discounts",
      sortOrder: 1,
    },
  ]);

  await db.insert(news).values([
    {
      title: "Открытие нового учебного центра ATG",
      content: "AMIR TECH GROUP открывает новый учебный центр для подготовки специалистов автомобильной диагностики в Душанбе. Центр оснащён современным оборудованием и позволяет проводить практические занятия на реальных автомобилях. Курсы доступны для специалистов всех уровней подготовки.",
      image: "/images/news-1.png",
      date: new Date("2026-02-10"),
    },
    {
      title: "Участие в международной выставке автооборудования",
      content: "Компания ATG приняла участие в международной выставке автомобильного оборудования, где были представлены новейшие диагностические сканеры и системы для автосервисов. Наши специалисты провели демонстрации работы оборудования Thinkcar и Autel.",
      image: "/images/news-2.png",
      date: new Date("2026-01-25"),
    },
    {
      title: "Новые поступления пневмоподвески",
      content: "В наш каталог добавлены компоненты пневматической подвески для BMW, Mercedes-Benz и Audi. Все детали имеют OEM качество и гарантию 12 месяцев. Доступны компрессоры, пневмобаллоны и блоки клапанов.",
      image: "/images/cat-suspension.png",
      date: new Date("2026-01-15"),
    },
  ]);

  await db.insert(services).values([
    { title: "Диагностика", description: "Компьютерная диагностика всех систем автомобиля с использованием профессионального оборудования.", icon: "wrench", sortOrder: 1 },
    { title: "Гарантия качества", description: "Все товары сертифицированы и имеют официальную гарантию от производителей.", icon: "shield", sortOrder: 2 },
    { title: "Обучение", description: "Профессиональное обучение специалистов работе с диагностическим оборудованием.", icon: "graduation", sortOrder: 3 },
    { title: "Поддержка", description: "Техническая поддержка и консультации по всем вопросам эксплуатации оборудования.", icon: "headphones", sortOrder: 4 },
  ]);

  log("Database seeded successfully");
}
