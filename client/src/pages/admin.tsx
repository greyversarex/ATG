import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Trash2, Plus, Package, Newspaper, Settings, Tag, Megaphone } from "lucide-react";
import type { Product, Brand, Category, Banner, News, Service } from "@shared/schema";

type Tab = "products" | "brands" | "categories" | "banners" | "news" | "services";

const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: "products", label: "Товары", icon: Package },
  { id: "brands", label: "Бренды", icon: Tag },
  { id: "categories", label: "Категории", icon: Settings },
  { id: "banners", label: "Баннеры", icon: Megaphone },
  { id: "news", label: "Новости", icon: Newspaper },
  { id: "services", label: "Услуги", icon: Settings },
];

export default function Admin() {
  usePageTitle("Админ-панель");

  const [activeTab, setActiveTab] = useState<Tab>("products");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6" data-testid="text-admin-title">Админ-панель</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            data-testid={`button-tab-${tab.id}`}
          >
            <tab.icon className="w-4 h-4 mr-1" />
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "products" && <ProductsAdmin />}
      {activeTab === "brands" && <BrandsAdmin />}
      {activeTab === "categories" && <CategoriesAdmin />}
      {activeTab === "banners" && <BannersAdmin />}
      {activeTab === "news" && <NewsAdmin />}
      {activeTab === "services" && <ServicesAdmin />}
    </div>
  );
}

function ProductsAdmin() {
  const { toast } = useToast();
  const { data: products } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: brands } = useQuery<Brand[]>({ queryKey: ["/api/brands"] });
  const { data: categories } = useQuery<Category[]>({ queryKey: ["/api/categories"] });

  const [form, setForm] = useState({
    name: "", description: "", shortSpecs: "", price: "", image: "",
    brandId: "", categoryId: "", isBestseller: false, discountPercent: "0",
  });

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/products", {
      ...form,
      price: parseFloat(form.price) || 0,
      discountPercent: parseInt(form.discountPercent) || 0,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/bestsellers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/discounted"] });
      setForm({ name: "", description: "", shortSpecs: "", price: "", image: "", brandId: "", categoryId: "", isBestseller: false, discountPercent: "0" });
      toast({ title: "Товар добавлен" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/bestsellers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/discounted"] });
      toast({ title: "Товар удалён" });
    },
  });

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-visible">
        <h3 className="font-semibold mb-3">Добавить товар</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="input-product-name" />
          <Input placeholder="Цена" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} data-testid="input-product-price" />
          <Input placeholder="Скидка %" type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} data-testid="input-product-discount" />
          <Select value={form.brandId} onValueChange={(v) => setForm({ ...form, brandId: v })}>
            <SelectTrigger data-testid="select-product-brand"><SelectValue placeholder="Бренд" /></SelectTrigger>
            <SelectContent>{brands?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
            <SelectTrigger data-testid="select-product-category"><SelectValue placeholder="Категория" /></SelectTrigger>
            <SelectContent>{categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
          <Input placeholder="Краткие характеристики" value={form.shortSpecs} onChange={(e) => setForm({ ...form, shortSpecs: e.target.value })} data-testid="input-product-specs" />
          <div className="flex items-center gap-2">
            <Checkbox checked={form.isBestseller} onCheckedChange={(v) => setForm({ ...form, isBestseller: !!v })} data-testid="checkbox-bestseller" />
            <label className="text-sm">Хит продаж</label>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium mb-1 block">Изображение</label>
          <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} testId="upload-product-image" />
        </div>
        <Textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-3" data-testid="input-product-description" />
        <Button className="mt-3" onClick={() => createMutation.mutate()} disabled={createMutation.isPending} data-testid="button-add-product">
          <Plus className="w-4 h-4 mr-1" />Добавить
        </Button>
      </Card>

      <div className="space-y-2">
        {products?.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-card border border-card-border" data-testid={`admin-product-${p.id}`}>
            <div className="flex items-center gap-3 min-w-0">
              {p.image && <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-md shrink-0" />}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.price.toLocaleString("ru-RU")} сом.</p>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(p.id)} data-testid={`button-delete-product-${p.id}`}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandsAdmin() {
  const { toast } = useToast();
  const { data: brands } = useQuery<Brand[]>({ queryKey: ["/api/brands"] });
  const [form, setForm] = useState({ name: "", image: "" });

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/brands", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      setForm({ name: "", image: "" });
      toast({ title: "Бренд добавлен" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/brands/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({ title: "Бренд удалён" });
    },
  });

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-visible">
        <h3 className="font-semibold mb-3">Добавить бренд</h3>
        <div className="space-y-3">
          <Input placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="input-brand-name" />
          <div>
            <label className="text-sm font-medium mb-1 block">Логотип</label>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} testId="upload-brand-image" />
          </div>
          <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending} data-testid="button-add-brand">
            <Plus className="w-4 h-4 mr-1" />Добавить
          </Button>
        </div>
      </Card>
      <div className="space-y-2">
        {brands?.map((b) => (
          <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-card border border-card-border" data-testid={`admin-brand-${b.id}`}>
            <div className="flex items-center gap-3">
              {b.image && <img src={b.image} alt="" className="w-10 h-10 object-contain rounded-md bg-muted shrink-0" />}
              <span className="text-sm font-medium">{b.name}</span>
            </div>
            <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(b.id)} data-testid={`button-delete-brand-${b.id}`}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesAdmin() {
  const { toast } = useToast();
  const { data: categories } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  const [form, setForm] = useState({ name: "", image: "", parentId: "" });

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/categories", { ...form, parentId: form.parentId || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setForm({ name: "", image: "", parentId: "" });
      toast({ title: "Категория добавлена" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Категория удалена" });
    },
  });

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-visible">
        <h3 className="font-semibold mb-3">Добавить категорию</h3>
        <div className="space-y-3">
          <Input placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="input-category-name" />
          <div>
            <label className="text-sm font-medium mb-1 block">Изображение</label>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} testId="upload-category-image" />
          </div>
          <Button onClick={() => createMutation.mutate()} disabled={createMutation.isPending} data-testid="button-add-category">
            <Plus className="w-4 h-4 mr-1" />Добавить
          </Button>
        </div>
      </Card>
      <div className="space-y-2">
        {categories?.map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-card border border-card-border" data-testid={`admin-category-${c.id}`}>
            <div className="flex items-center gap-3">
              {c.image && <img src={c.image} alt="" className="w-10 h-10 object-contain rounded-md bg-muted shrink-0" />}
              <span className="text-sm font-medium">{c.name}</span>
            </div>
            <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(c.id)} data-testid={`button-delete-category-${c.id}`}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BannersAdmin() {
  const { toast } = useToast();
  const { data: heroBanners } = useQuery<Banner[]>({ queryKey: ["/api/banners", "hero"] });
  const { data: promoBanners } = useQuery<Banner[]>({ queryKey: ["/api/banners", "promo"] });
  const [form, setForm] = useState({ type: "hero", image: "", title: "", description: "", buttonText: "", buttonLink: "" });

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/banners", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      setForm({ type: "hero", image: "", title: "", description: "", buttonText: "", buttonLink: "" });
      toast({ title: "Баннер добавлен" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({ title: "Баннер удалён" });
    },
  });

  const all = [...(heroBanners || []), ...(promoBanners || [])];

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-visible">
        <h3 className="font-semibold mb-3">Добавить баннер</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger data-testid="select-banner-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hero">Главный слайд</SelectItem>
              <SelectItem value="promo">Промо баннер</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Заголовок" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-banner-title" />
          <Input placeholder="Текст" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="input-banner-desc" />
          <Input placeholder="Текст кнопки" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} data-testid="input-banner-btn" />
          <Input placeholder="Ссылка кнопки" value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} data-testid="input-banner-link" />
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium mb-1 block">Изображение</label>
          <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} testId="upload-banner-image" />
        </div>
        <Button className="mt-3" onClick={() => createMutation.mutate()} disabled={createMutation.isPending} data-testid="button-add-banner">
          <Plus className="w-4 h-4 mr-1" />Добавить
        </Button>
      </Card>
      <div className="space-y-2">
        {all.map((b) => (
          <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-card border border-card-border" data-testid={`admin-banner-${b.id}`}>
            <div className="flex items-center gap-3 min-w-0">
              {b.image && <img src={b.image} alt="" className="w-16 h-10 object-cover rounded-md shrink-0" />}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{b.title || "Без заголовка"}</p>
                <p className="text-xs text-muted-foreground">{b.type === "hero" ? "Главный слайд" : "Промо"}</p>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(b.id)} data-testid={`button-delete-banner-${b.id}`}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsAdmin() {
  const { toast } = useToast();
  const { data: newsList } = useQuery<News[]>({ queryKey: ["/api/news"] });
  const [form, setForm] = useState({ title: "", content: "", image: "" });

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/news", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setForm({ title: "", content: "", image: "" });
      toast({ title: "Новость добавлена" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Новость удалена" });
    },
  });

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-visible">
        <h3 className="font-semibold mb-3">Добавить новость</h3>
        <div className="space-y-3">
          <Input placeholder="Заголовок" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-news-title" />
          <div>
            <label className="text-sm font-medium mb-1 block">Изображение</label>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} testId="upload-news-image" />
          </div>
          <Textarea placeholder="Текст новости" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} data-testid="input-news-content" />
        </div>
        <Button className="mt-3" onClick={() => createMutation.mutate()} disabled={createMutation.isPending} data-testid="button-add-news">
          <Plus className="w-4 h-4 mr-1" />Добавить
        </Button>
      </Card>
      <div className="space-y-2">
        {newsList?.map((n) => (
          <div key={n.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-card border border-card-border" data-testid={`admin-news-${n.id}`}>
            <div className="flex items-center gap-3 min-w-0">
              {n.image && <img src={n.image} alt="" className="w-16 h-10 object-cover rounded-md shrink-0" />}
              <p className="text-sm font-medium truncate">{n.title}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(n.id)} data-testid={`button-delete-news-${n.id}`}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesAdmin() {
  const { toast } = useToast();
  const { data: services } = useQuery<Service[]>({ queryKey: ["/api/services"] });
  const [form, setForm] = useState({ title: "", description: "", icon: "wrench" });

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/services", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setForm({ title: "", description: "", icon: "wrench" });
      toast({ title: "Услуга добавлена" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Услуга удалена" });
    },
  });

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-visible">
        <h3 className="font-semibold mb-3">Добавить услугу</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input placeholder="Название" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-service-title" />
          <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
            <SelectTrigger data-testid="select-service-icon"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="wrench">Wrench</SelectItem>
              <SelectItem value="shield">Shield</SelectItem>
              <SelectItem value="graduation">Graduation</SelectItem>
              <SelectItem value="headphones">Headphones</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-3" data-testid="input-service-description" />
        <Button className="mt-3" onClick={() => createMutation.mutate()} disabled={createMutation.isPending} data-testid="button-add-service">
          <Plus className="w-4 h-4 mr-1" />Добавить
        </Button>
      </Card>
      <div className="space-y-2">
        {services?.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-card border border-card-border" data-testid={`admin-service-${s.id}`}>
            <p className="text-sm font-medium">{s.title}</p>
            <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(s.id)} data-testid={`button-delete-service-${s.id}`}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
