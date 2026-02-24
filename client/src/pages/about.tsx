import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Wrench, GraduationCap, Shield, MapPin, Phone, Mail, Navigation } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCount(0);
          const duration = 1500;
          const steps = 40;
          const increment = value / steps;
          let current = 0;
          timerRef.current = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              if (timerRef.current) clearInterval(timerRef.current);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); if (timerRef.current) clearInterval(timerRef.current); };
  }, [value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const ATG_LAT = 38.5437;
const ATG_LNG = 68.8068;
const ATG_ADDRESS = "Душанбе, р-н Сино, ул. Рахмон Набиев, 2 гузаргох";

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

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${ATG_LAT},${ATG_LNG}&travelmode=driving`;
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3069.5!2d${ATG_LNG}!3d${ATG_LAT}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38b5d17b0bbfffff%3A0x1!2z0JDQvNC40YAg0KLQtdGFINCT0YDRg9C_0L8!5e0!3m2!1sru!2s!4v1700000000000!5m2!1sru!2s`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2" data-testid="text-about-title">О компании</h1>
      <p className="text-muted-foreground mb-8 max-w-2xl">
        AMIR TECH GROUP (ATG) — ведущий поставщик комплексных решений для автомобильной отрасли в Таджикистане.
      </p>

      <section className="rounded-2xl py-10 px-6 sm:px-10 text-white overflow-hidden relative mb-10" style={{
        background: "linear-gradient(135deg, hsl(0 84% 35%) 0%, hsl(0 70% 25%) 50%, hsl(0 84% 30%) 100%)"
      }}>
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px, 80px 80px"
        }} />
        <div className="relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { num: 10, suffix: "+", label: "лет на рынке", sublabel: "Успешной работы" },
              { num: 15, suffix: "", label: "сотрудников", sublabel: "Квалифицированных" },
              { num: 1, suffix: "", label: "учебный центр", sublabel: "Собственный" },
              { num: 1000, suffix: "+", label: "клиентов", sublabel: "Доверяют нам" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center gap-1" data-testid={`stat-about-${item.label}`}>
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  <AnimatedCounter value={item.num} suffix={item.suffix} />
                </span>
                <span className="text-sm text-white/90 font-medium">{item.label}</span>
                <span className="text-xs text-white/60">{item.sublabel}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <Card className="p-6 overflow-visible mb-10" data-testid="card-contacts">
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
              <span>г. {ATG_ADDRESS}</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <a href="tel:+992176100100" className="text-primary" data-testid="link-about-phone">+992 17 610 01 00</a>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <a href="mailto:Amirtechgroup.tj@gmail.com" className="text-primary" data-testid="link-about-email">Amirtechgroup.tj@gmail.com</a>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden" data-testid="card-map">
        <div className="p-4 pb-3 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-lg">Наше расположение</h2>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              г. {ATG_ADDRESS}
            </p>
          </div>
          <a href={googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-2" data-testid="button-directions">
              <Navigation className="w-4 h-4" />
              Построить маршрут
            </Button>
          </a>
        </div>
        <div style={{ aspectRatio: "16/7" }}>
          <iframe
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="ATG Location"
            data-testid="map-about"
          />
        </div>
      </Card>
    </div>
  );
}
