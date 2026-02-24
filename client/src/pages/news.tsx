import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageTitle } from "@/hooks/use-page-title";
import { useI18n } from "@/lib/i18n";
import type { News } from "@shared/schema";

export default function NewsPage() {
  usePageTitle("news");
  const { t, lang } = useI18n();

  const { data: newsList, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" data-testid="text-news-title">{t("news.title")}</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-video rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      ) : !newsList?.length ? (
        <p className="text-center text-muted-foreground py-16 text-sm">{t("news.empty")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {newsList.map((item) => (
            <Card key={item.id} className="overflow-visible group" data-testid={`card-news-${item.id}`}>
              <div className="aspect-video overflow-hidden rounded-t-xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-3 sm:p-4">
                <time className="text-[10px] sm:text-xs text-muted-foreground" data-testid={`text-news-date-${item.id}`}>
                  {new Date(item.date).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h3 className="font-semibold text-xs sm:text-sm mt-1 sm:mt-1.5 mb-1.5 sm:mb-2" data-testid={`text-news-title-${item.id}`}>
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {item.content}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
