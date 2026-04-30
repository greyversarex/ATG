import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingContact } from "@/components/floating-contact";
import { SplashScreen } from "@/components/splash-screen";
import { I18nProvider } from "@/lib/i18n";
import { useState, useCallback, lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "@/pages/not-found";

const Home = lazy(() => import("@/pages/home"));
const Catalog = lazy(() => import("@/pages/catalog"));
const ProductDetail = lazy(() => import("@/pages/product-detail"));
const Brands = lazy(() => import("@/pages/brands"));
const NewsPage = lazy(() => import("@/pages/news"));
const About = lazy(() => import("@/pages/about"));
const Discounts = lazy(() => import("@/pages/discounts"));
const Favorites = lazy(() => import("@/pages/favorites"));
const Admin = lazy(() => import("@/pages/admin"));
const Login = lazy(() => import("@/pages/login"));

function PageFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">{() => <Suspense fallback={<PageFallback />}><Home /></Suspense>}</Route>
      <Route path="/catalog">{() => <Suspense fallback={<PageFallback />}><Catalog /></Suspense>}</Route>
      <Route path="/product/:id">{() => <Suspense fallback={<PageFallback />}><ProductDetail /></Suspense>}</Route>
      <Route path="/brands">{() => <Suspense fallback={<PageFallback />}><Brands /></Suspense>}</Route>
      <Route path="/news">{() => <Suspense fallback={<PageFallback />}><NewsPage /></Suspense>}</Route>
      <Route path="/about">{() => <Suspense fallback={<PageFallback />}><About /></Suspense>}</Route>
      <Route path="/discounts">{() => <Suspense fallback={<PageFallback />}><Discounts /></Suspense>}</Route>
      <Route path="/favorites">{() => <Suspense fallback={<PageFallback />}><Favorites /></Suspense>}</Route>
      <Route path="/login">{() => <Suspense fallback={<PageFallback />}><Login /></Suspense>}</Route>
      <Route path="/admin">{() => <Suspense fallback={<PageFallback />}><Admin /></Suspense>}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <I18nProvider>
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <FloatingContact />
          <Toaster />
        </I18nProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
