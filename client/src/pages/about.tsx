import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Wrench, GraduationCap, Shield, MapPin, Phone, Mail, Navigation } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useI18n } from "@/lib/i18n";

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

const advantageIcons = [Award, Wrench, Shield, GraduationCap];

export default function About() {
  usePageTitle("about");
  const { t, ta } = useI18n();

  const directions = ta("about.directions");
  const advantageTexts = ta("about.advantagesList");

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${ATG_LAT},${ATG_LNG}&travelmode=driving`;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${ATG_LAT},${ATG_LNG}&z=16&output=embed&hl=ru`;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2" data-testid="text-about-title">{t("about.title")}</h1>
      <p className="text-muted-foreground text-xs sm:text-base mb-6 sm:mb-8 max-w-2xl">
        {t("about.subtitle")}
      </p>

      <section className="rounded-xl sm:rounded-2xl py-6 sm:py-10 px-4 sm:px-10 text-white overflow-hidden relative mb-6 sm:mb-10" style={{
        background: "linear-gradient(135deg, hsl(0 84% 35%) 0%, hsl(0 70% 25%) 50%, hsl(0 84% 30%) 100%)"
      }}>
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px, 80px 80px"
        }} />
        <div className="relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              { num: 10, suffix: "+", label: t("about.yearsOnMarket"), sublabel: t("about.successfulWork") },
              { num: 15, suffix: "", label: t("about.employees"), sublabel: t("about.qualified") },
              { num: 1, suffix: "", label: t("about.trainingCenter"), sublabel: t("about.own") },
              { num: 1000, suffix: "+", label: t("about.clients"), sublabel: t("about.trustUs") },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center gap-0.5 sm:gap-1" data-testid={`stat-about-${item.label}`}>
                <span className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  <AnimatedCounter value={item.num} suffix={item.suffix} />
                </span>
                <span className="text-xs sm:text-sm text-white/90 font-medium">{item.label}</span>
                <span className="text-[10px] sm:text-xs text-white/60">{item.sublabel}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-10">
        <div className="convex-card p-4 sm:p-6">
          <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">{t("about.specialization")}</h2>
          <div className="space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <p>{t("about.specText1")}</p>
            <p>{t("about.specText2")}</p>
          </div>
        </div>

        <div className="convex-card p-4 sm:p-6">
          <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-3">{t("about.keyDirections")}</h2>
          <ul className="space-y-2 sm:space-y-2.5">
            {directions.map((d: string, i: number) => (
              <li key={i} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-6 sm:mb-10">
        <h2 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">{t("about.advantages")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {advantageTexts.map((text: string, i: number) => {
            const Icon = advantageIcons[i] || Award;
            return (
              <div key={i} className="convex-card flex items-start gap-3 p-4 sm:p-5" data-testid={`card-advantage-${i}`}>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs sm:text-sm pt-1.5 sm:pt-2">{text}</p>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="p-4 sm:p-6 overflow-visible mb-6 sm:mb-10" data-testid="card-contacts">
        <h2 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">{t("about.contacts")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="space-y-2 sm:space-y-3">
            <p><span className="text-muted-foreground">{t("about.company")}</span> Amir Tech Group (ATG)</p>
            <p><span className="text-muted-foreground">{t("about.ceo")}</span> Шарипов Парвиз</p>
            <p><span className="text-muted-foreground">{t("about.postalCode")}</span> 734026</p>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>г. {ATG_ADDRESS}</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground mt-0.5 shrink-0" />
              <a href="tel:+992176100100" className="text-primary" data-testid="link-about-phone">+992 17 610 01 00</a>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground mt-0.5 shrink-0" />
              <a href="mailto:Amirtechgroup.tj@gmail.com" className="text-primary break-all" data-testid="link-about-email">Amirtechgroup.tj@gmail.com</a>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden" data-testid="card-map">
        <div className="p-3 sm:p-4 pb-2 sm:pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <div>
            <h2 className="font-bold text-base sm:text-lg">{t("about.location")}</h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              г. {ATG_ADDRESS}
            </p>
          </div>
          <a href={googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-2 w-full sm:w-auto text-xs sm:text-sm" data-testid="button-directions">
              <Navigation className="w-4 h-4" />
              {t("about.getDirections")}
            </Button>
          </a>
        </div>
        <div style={{ aspectRatio: "16/9" }} className="sm:aspect-auto sm:h-auto" >
          <iframe
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "250px" }}
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
