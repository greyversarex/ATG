import { Card } from "@/components/ui/card";
import { Users, Award, Wrench, GraduationCap, Shield, MapPin, Phone } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

const highlights = [
  { icon: Award, label: "10+ лет", desc: "Успешной работы на рынке" },
  { icon: Users, label: "15", desc: "Квалифицированных сотрудников" },
  { icon: Wrench, label: "Собственный", desc: "Автосервис и учебный центр" },
  { icon: Shield, label: "Доверие", desc: "Высокий уровень доверия клиентов" },
];

const directions = [
  "Продажа диагностического оборудования (Thinkcar, Autel, OBDStar, Xhorse и др.)",
  "Поставка автозапчастей и систем",
  "Сервис и поддержка",
  "Обучение специалистов",
];

const advantages = [
  { icon: Award, text: "Глубокая экспертиза в автомобильной отрасли" },
  { icon: Wrench, text: "Собственный автосервис и учебный центр" },
  { icon: Shield, text: "Профессиональная диагностика, сход-развал, балансировка" },
  { icon: GraduationCap, text: "Обучение специалистов автосервисов" },
];

export default function About() {
  usePageTitle("О компании");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2" data-testid="text-about-title">О компании</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        AMIR TECH GROUP (ATG) — ведущий поставщик комплексных решений для автомобильной отрасли в Таджикистане.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {highlights.map((h, i) => (
          <Card key={i} className="p-5 text-center overflow-visible" data-testid={`card-highlight-${i}`}>
            <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-3 shadow-sm">
              <h.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="font-bold text-lg">{h.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="convex-card p-6">
          <h2 className="font-bold text-lg mb-3">Специализация</h2>
          <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>Компания специализируется на дистрибуции автозапчастей, поставке профессионального оборудования для СТО, диагностических сканерах и компонентах пневмоподвески.</p>
            <p>С более чем 10-летним опытом успешной работы мы обеспечиваем высококачественные решения для автомобильной индустрии Таджикистана.</p>
          </div>
        </div>

        <div className="convex-card p-6">
          <h2 className="font-bold text-lg mb-3">Ключевые направления</h2>
          <ul className="space-y-2.5">
            {directions.map((d, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="font-bold text-lg mb-4">Преимущества</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {advantages.map((a, i) => (
            <div key={i} className="convex-card flex items-start gap-3 p-5" data-testid={`card-advantage-${i}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0 shadow-sm">
                <a.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm pt-2">{a.text}</p>
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6 overflow-visible" data-testid="card-contacts">
        <h2 className="font-bold text-lg mb-4">Контакты</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <p><span className="text-muted-foreground">Компания:</span> Amir Tech Group (ATG)</p>
            <p><span className="text-muted-foreground">Генеральный директор:</span> Шарипов Парвиз</p>
            <p><span className="text-muted-foreground">Почтовый индекс:</span> 734026</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>г. Душанбе, р-н Сино, ул. Рахмон Набиев, 2 гузаргох</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <a href="tel:+992176100100" className="text-primary" data-testid="link-about-phone">+992 17 610 01 00</a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
