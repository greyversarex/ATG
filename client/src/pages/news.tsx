import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageTitle } from "@/hooks/use-page-title";
import type { News } from "@shared/schema";

export default function NewsPage() {
  usePageTitle("Новости");

  const { data: newsList, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6" data-testid="text-news-title">Новости</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-video rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      ) : !newsList?.length ? (
        <p className="text-center text-muted-foreground py-16">Новостей пока нет</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newsList.map((item) => (
            <Card key={item.id} className="overflow-visible" data-testid={`card-news-${item.id}`}>
              <div className="aspect-video overflow-hidden rounded-t-md bg-muted">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <time className="text-xs text-muted-foreground" data-testid={`text-news-date-${item.id}`}>
                  {new Date(item.date).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h3 className="font-semibold text-sm mt-1 mb-2" data-testid={`text-news-title-${item.id}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
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
