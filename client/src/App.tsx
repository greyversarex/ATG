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
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import ProductDetail from "@/pages/product-detail";
import Brands from "@/pages/brands";
import NewsPage from "@/pages/news";
import About from "@/pages/about";
import Discounts from "@/pages/discounts";
import Favorites from "@/pages/favorites";
import NotFound from "@/pages/not-found";

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
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/brands" component={Brands} />
      <Route path="/news" component={NewsPage} />
      <Route path="/about" component={About} />
      <Route path="/discounts" component={Discounts} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/login">
        {() => (
          <Suspense fallback={<PageFallback />}>
            <Login />
          </Suspense>
        )}
      </Route>
      <Route path="/admin">
        {() => (
          <Suspense fallback={<PageFallback />}>
            <Admin />
          </Suspense>
        )}
      </Route>
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
