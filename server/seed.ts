import { db } from "./db";
import { brands, categories, products, banners, news, services, users } from "@shared/schema";
import { log } from "./index";
import bcrypt from "bcryptjs";

async function seedAdminUser() {
  const existing = await db.select().from(users);
  if (existing.length > 0) return;
  const hash = await bcrypt.hash("admin123", 10);
  await db.insert(users).values({
    username: "admin",
    password: hash,
    role: "admin",
  });
  log("Default admin user created (login: admin, password: admin123)");
}

export async function seedDatabase() {
  await seedAdminUser();

  const forceReseed = process.env.FORCE_RESEED === "true";

  const existingBrands = await db.select().from(brands);
  if (existingBrands.length > 0 && !forceReseed) {
    log("Database already seeded, skipping");
    return;
  }

  if (forceReseed && existingBrands.length > 0) {
    log("Force reseed: clearing existing data...");
    await db.delete(products);
    await db.delete(news);
    await db.delete(banners);
    await db.delete(services);
    await db.delete(categories);
    await db.delete(brands);
    log("Existing data cleared");
  }

  log("Seeding database...");

  const [thinkcar, tus, xtool, hogert, autel, sivik, texa, launch] = await db.insert(brands).values([
    { name: "THINKCAR", image: "/images/brand-thinkcar.png", sortOrder: 0 },
    { name: "TUS", image: "/images/brand-tus.png", sortOrder: 0 },
    { name: "XTOOL", image: "/images/brand-xtool.png", sortOrder: 0 },
    { name: "HOGERT", image: "/images/brand-hogert.png", sortOrder: 1 },
    { name: "Autel", image: "/images/brand-autel.png", sortOrder: 2 },
    { name: "SIVIK", image: "/images/brand-sivik.png", sortOrder: 3 },
    { name: "TEXA", image: "/images/brand-texa.png", sortOrder: 4 },
    { name: "Launch", image: "/images/brand-launch.png", sortOrder: 5 },
  ]).returning();

  const [
    catAlignment, catBalancer, catTirechanger, catLift, catCompressor,
    catAc, catOil, catGrease, catDiagnostics, catFurniture,
    catToolcart, catHandtools, catDetergents, catCleaning,
    catCarservice, catTruckservice, catGarage, catWorkwear
  ] = await db.insert(categories).values([
    { name: "Стенды сход-развала", image: "/images/cat-alignment.png", sortOrder: 1 },
    { name: "Балансировочные станки", image: "/images/cat-balancer.png", sortOrder: 2 },
    { name: "Шиномонтажное оборудование", image: "/images/cat-tirechanger.png", sortOrder: 3 },
    { name: "Подъёмное оборудование", image: "/images/cat-lift.png", sortOrder: 4 },
    { name: "Компрессорное оборудование", image: "/images/cat-compressor.png", sortOrder: 5 },
    { name: "Заправка автокондиционеров", image: "/images/cat-ac.png", sortOrder: 6 },
    { name: "Оборудование для замены масел и тех. жидкостей", image: "/images/cat-oil.png", sortOrder: 7 },
    { name: "Оборудование для раздачи смазочных материалов", image: "/images/cat-grease.png", sortOrder: 8 },
    { name: "Диагностическое оборудование", image: "/images/cat-diagnostics.png", sortOrder: 9 },
    { name: "Металлическая мебель FERRUM", image: "/images/cat-furniture.png", sortOrder: 10 },
    { name: "Инструментальные тележки", image: "/images/cat-toolcart.png", sortOrder: 11 },
    { name: "Ручной инструмент", image: "/images/cat-handtools.png", sortOrder: 12 },
    { name: "Профессиональные моющие средства", image: "/images/cat-detergents.png", sortOrder: 13 },
    { name: "Клининговое оборудование", image: "/images/cat-cleaning.png", sortOrder: 14 },
    { name: "Легковой автосервис", image: "/images/cat-carservice.png", sortOrder: 15 },
    { name: "Грузовой автосервис", image: "/images/cat-truckservice.png", sortOrder: 16 },
    { name: "Общегаражное оборудование", image: "/images/cat-garage.png", sortOrder: 17 },
    { name: "Спецодежда", image: "/images/cat-workwear.png", sortOrder: 18 },
  ]).returning();

  await db.insert(products).values([
    { name: "3D стенд сход-развала SIVIK SA-3D", description: "Профессиональный 3D стенд для проверки и регулировки углов установки колёс. Высокоточные 3D камеры обеспечивают мгновенные измерения с точностью до 0.01°.", shortSpecs: "3D камеры, точность 0.01°, база данных авто", price: 485000, image: "/images/prod-alignment-3d.png", brandId: sivik.id, categoryId: catAlignment.id, isBestseller: true, discountPercent: 0 },
    { name: "Лазерный стенд сход-развала", description: "Лазерный стенд для проверки углов установки колёс. Компактное решение для небольших автосервисов.", shortSpecs: "Лазерные датчики, компактный, портативный", price: 185000, image: "/images/prod-alignment-laser.png", brandId: sivik.id, categoryId: catAlignment.id, isBestseller: false, discountPercent: 10 },
    { name: "Балансировочный станок SIVIK СБМП-60/3D", description: "Автоматический балансировочный станок с 3D визуализацией. Для легковых и легкогрузовых колёс до 75 кг.", shortSpecs: "До 75 кг, 3D визуализация, автоввод параметров", price: 320000, image: "/images/prod-balancer-auto.png", brandId: sivik.id, categoryId: catBalancer.id, isBestseller: true, discountPercent: 0 },
    { name: "Балансировочный станок для грузовых колёс", description: "Мощный балансировочный станок для грузовых и коммерческих автомобилей. Диаметр колеса до 56 дюймов.", shortSpecs: "До 200 кг, диаметр до 56\", грузовые колёса", price: 580000, image: "/images/prod-balancer-truck.png", brandId: sivik.id, categoryId: catBalancer.id, isBestseller: false, discountPercent: 0 },
    { name: "Шиномонтажный станок автомат SIVIK КС-402А", description: "Автоматический шиномонтажный станок для легковых колёс. Зажим диска 10-24 дюймов.", shortSpecs: "Диски 10-24\", автомат, наддув борта", price: 280000, image: "/images/prod-tirechanger-auto.png", brandId: sivik.id, categoryId: catTirechanger.id, isBestseller: true, discountPercent: 5 },
    { name: "Грузовой шиномонтажный станок", description: "Профессиональный шиномонтажный станок для грузовых автомобилей. Диски до 56 дюймов.", shortSpecs: "Диски до 56\", усиленная конструкция", price: 650000, image: "/images/prod-tirechanger-truck.png", brandId: sivik.id, categoryId: catTirechanger.id, isBestseller: false, discountPercent: 0 },
    { name: "Подъёмник двухстоечный 4т", description: "Электрогидравлический двухстоечный подъёмник грузоподъёмностью 4 тонны. Высота подъёма 1850 мм.", shortSpecs: "4 тонны, высота 1850 мм, электрогидравлика", price: 350000, image: "/images/prod-lift-2post.png", brandId: sivik.id, categoryId: catLift.id, isBestseller: true, discountPercent: 0 },
    { name: "Ножничный подъёмник 3.5т", description: "Ножничный подъёмник для автосервиса. Грузоподъёмность 3.5 тонны, встраивается в пол.", shortSpecs: "3.5 тонны, встраиваемый, ножничный тип", price: 420000, image: "/images/prod-lift-scissor.png", brandId: sivik.id, categoryId: catLift.id, isBestseller: false, discountPercent: 15 },
    { name: "Винтовой компрессор 7.5 кВт", description: "Винтовой компрессор для непрерывной подачи сжатого воздуха. Мощность 7.5 кВт, низкий уровень шума.", shortSpecs: "7.5 кВт, 1050 л/мин, низкий шум", price: 380000, image: "/images/prod-compressor-screw.png", brandId: sivik.id, categoryId: catCompressor.id, isBestseller: true, discountPercent: 0 },
    { name: "Поршневой компрессор 500л", description: "Промышленный поршневой компрессор с ресивером 500 литров. Производительность 1200 л/мин.", shortSpecs: "500л ресивер, 1200 л/мин, 10 бар", price: 195000, image: "/images/prod-compressor-piston.png", brandId: sivik.id, categoryId: catCompressor.id, isBestseller: false, discountPercent: 0 },
    { name: "Станция заправки кондиционеров TEXA 780R", description: "Автоматическая станция для заправки автомобильных кондиционеров. Работает с хладагентом R134a и R1234yf.", shortSpecs: "R134a / R1234yf, автомат, база данных авто", price: 520000, image: "/images/prod-ac-station.png", brandId: texa.id, categoryId: catAc.id, isBestseller: true, discountPercent: 0 },
    { name: "Установка для вакуумной замены масла", description: "Вакуумная установка для замены масла через щуп. Ёмкость бака 80 литров.", shortSpecs: "Вакуумная, 80л бак, колёсная база", price: 85000, image: "/images/prod-oil-extractor.png", brandId: sivik.id, categoryId: catOil.id, isBestseller: false, discountPercent: 0 },
    { name: "Установка для замены жидкости АКПП", description: "Профессиональная установка для полной замены жидкости в автоматических коробках передач.", shortSpecs: "Полная замена ATF, универсальные адаптеры", price: 145000, image: "/images/prod-oil-atf.png", brandId: sivik.id, categoryId: catOil.id, isBestseller: false, discountPercent: 10 },
    { name: "Пневматический нагнетатель смазки", description: "Пневматический нагнетатель консистентной смазки с бочковым насосом. Давление до 400 бар.", shortSpecs: "До 400 бар, пневматический, бочковой", price: 65000, image: "/images/prod-grease-pump.png", brandId: sivik.id, categoryId: catGrease.id, isBestseller: false, discountPercent: 0 },
    { name: "Диагностический сканер THINKCAR Platinum S8", description: "Компактный профессиональный сканер с полной системной диагностикой и онлайн-обновлениями.", shortSpecs: "Полная диагностика, онлайн-обновления, OBD2", price: 125000, image: "/images/prod-diag-scanner.png", brandId: thinkcar.id, categoryId: catDiagnostics.id, isBestseller: true, discountPercent: 5 },
    { name: "Мультимарочный сканер Autel MaxiSys MS906 Pro", description: "Профессиональный мультимарочный диагностический сканер с расширенной базой автомобилей. Поддержка ECU кодирования.", shortSpecs: "Мультимарочный, ECU кодирование, Wi-Fi", price: 285000, image: "/images/prod-diag-scanner.png", brandId: autel.id, categoryId: catDiagnostics.id, isBestseller: true, discountPercent: 0 },
    { name: "Мотортестер-осциллограф Launch X-431 Scope", description: "Профессиональный осциллограф для диагностики электрических систем автомобиля. 4 канала, частота 100 МГц.", shortSpecs: "4 канала, 100 МГц, USB подключение", price: 175000, image: "/images/prod-diag-oscillo.png", brandId: launch.id, categoryId: catDiagnostics.id, isBestseller: false, discountPercent: 0 },
    { name: "Верстак слесарный FERRUM 1500мм", description: "Профессиональный слесарный верстак с перфорированным экраном и ящиками. Столешница из МДФ 28мм.", shortSpecs: "1500x700x850 мм, МДФ столешница, 3 ящика", price: 42000, image: "/images/prod-furniture-bench.png", brandId: hogert.id, categoryId: catFurniture.id, isBestseller: false, discountPercent: 0 },
    { name: "Шкаф инструментальный FERRUM", description: "Металлический шкаф для хранения инструмента. 2 полки, 4 ящика, замок.", shortSpecs: "1000x500x1900 мм, 2 полки, 4 ящика, замок", price: 35000, image: "/images/prod-furniture-cabinet.png", brandId: hogert.id, categoryId: catFurniture.id, isBestseller: false, discountPercent: 0 },
    { name: "Тележка инструментальная HOGERT 7 ящиков", description: "Профессиональная инструментальная тележка на колёсах с 7 выдвижными ящиками. Нагрузка до 250 кг.", shortSpecs: "7 ящиков, до 250 кг, колёса с тормозом", price: 68000, image: "/images/prod-toolcart-pro.png", brandId: hogert.id, categoryId: catToolcart.id, isBestseller: true, discountPercent: 0 },
    { name: "Тележка инструментальная компактная 4 ящика", description: "Компактная инструментальная тележка для небольших помещений. 4 ящика, боковая ручка.", shortSpecs: "4 ящика, компактная, нагрузка 150 кг", price: 38000, image: "/images/prod-toolcart-compact.png", brandId: hogert.id, categoryId: catToolcart.id, isBestseller: false, discountPercent: 10 },
    { name: "Набор инструментов HOGERT 216 предметов", description: "Профессиональный набор инструментов в кейсе. 216 предметов: головки, ключи, отвёртки, плоскогубцы.", shortSpecs: "216 предметов, кейс, CrV сталь", price: 28000, image: "/images/prod-handtool-socket.png", brandId: hogert.id, categoryId: catHandtools.id, isBestseller: true, discountPercent: 0 },
    { name: "Динамометрический ключ 1/2\" 40-210 Нм", description: "Профессиональный динамометрический ключ с трещоткой. Диапазон 40-210 Нм, точность ±3%.", shortSpecs: "1/2\", 40-210 Нм, точность ±3%", price: 12500, image: "/images/prod-handtool-torque.png", brandId: hogert.id, categoryId: catHandtools.id, isBestseller: false, discountPercent: 0 },
    { name: "Автошампунь для бесконтактной мойки 20л", description: "Концентрированный щелочной автошампунь для бесконтактной мойки. Эффективно удаляет дорожную грязь.", shortSpecs: "20 литров, концентрат 1:50, pH 12.5", price: 4500, image: "/images/prod-detergent-shampoo.png", brandId: hogert.id, categoryId: catDetergents.id, isBestseller: false, discountPercent: 0 },
    { name: "Очиститель двигателя 5л", description: "Профессиональный очиститель двигателя и агрегатов. Быстро растворяет масло и технические загрязнения.", shortSpecs: "5 литров, распылитель, биоразлагаемый", price: 3200, image: "/images/prod-detergent-degreaser.png", brandId: hogert.id, categoryId: catDetergents.id, isBestseller: false, discountPercent: 15 },
    { name: "Аппарат высокого давления 200 бар", description: "Профессиональный аппарат высокого давления для мойки автомобилей и оборудования. 200 бар, 900 л/ч.", shortSpecs: "200 бар, 900 л/ч, 3-фазный", price: 85000, image: "/images/prod-cleaning-washer.png", brandId: sivik.id, categoryId: catCleaning.id, isBestseller: true, discountPercent: 0 },
    { name: "Поломоечная машина аккумуляторная", description: "Аккумуляторная поломоечная машина для уборки больших площадей. Ширина уборки 530 мм.", shortSpecs: "Аккумулятор, 530 мм, бак 60 л", price: 245000, image: "/images/prod-cleaning-scrubber.png", brandId: sivik.id, categoryId: catCleaning.id, isBestseller: false, discountPercent: 0 },
    { name: "Комплект для обслуживания легковых авто", description: "Полный комплект оборудования для обслуживания легковых автомобилей: подъёмник, шиномонтаж, балансировка.", shortSpecs: "Подъёмник + шиномонтаж + балансировка", price: 890000, image: "/images/prod-carservice-set.png", brandId: sivik.id, categoryId: catCarservice.id, isBestseller: false, discountPercent: 10 },
    { name: "Домкрат подкатной гидравлический 20т", description: "Профессиональный подкатной домкрат для грузовых автомобилей. Грузоподъёмность 20 тонн.", shortSpecs: "20 тонн, подкатной, высота 190-530 мм", price: 48000, image: "/images/prod-truckservice-jack.png", brandId: hogert.id, categoryId: catTruckservice.id, isBestseller: false, discountPercent: 0 },
    { name: "Домкрат подкатной гидравлический 3.5т", description: "Профессиональный подкатной домкрат для легковых автомобилей и внедорожников. Низкий подхват 89 мм.", shortSpecs: "3.5 тонны, подхват 89 мм, педаль быстрого подъёма", price: 15000, image: "/images/prod-garage-jack.png", brandId: hogert.id, categoryId: catGarage.id, isBestseller: true, discountPercent: 0 },
    { name: "Комбинезон рабочий автомеханика", description: "Профессиональный рабочий комбинезон для автомехаников. Прочная ткань, множество карманов.", shortSpecs: "Хлопок/полиэстер, усиленные колени, карманы", price: 4500, image: "/images/prod-workwear-coverall.png", brandId: hogert.id, categoryId: catWorkwear.id, isBestseller: false, discountPercent: 0 },
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
    {
      type: "bottom",
      image: "/images/hero-banner-2.png",
      title: "Бесплатная доставка по Душанбе",
      description: "При заказе от 5000 сомони — бесплатная доставка оборудования и запчастей по всему Душанбе.",
      buttonText: "Оформить заказ",
      buttonLink: "/catalog",
      sortOrder: 1,
    },
  ]);

  await db.insert(news).values([
    {
      title: "Новое партнёрство с SIVIK — расширение ассортимента",
      content: "AMIR TECH GROUP заключила эксклюзивное партнёрское соглашение с российским производителем оборудования SIVIK. Теперь в нашем каталоге доступен полный ассортимент продукции: стенды сход-развала, балансировочные станки, шиномонтажное и компрессорное оборудование. Все товары поставляются напрямую от производителя с официальной гарантией.",
      image: "/images/news-1.png",
      date: new Date("2026-02-20"),
    },
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
      image: "/images/cat-workwear.png",
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
