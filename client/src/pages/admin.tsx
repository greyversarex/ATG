import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/image-upload";
import { ImageCropModal } from "@/components/image-crop-modal";
import { RichTextEditor } from "@/components/rich-text-editor";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/use-page-title";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Trash2, Plus, Package, Newspaper, Settings, Tag, Megaphone, LogOut, Loader2, Pencil, X, ArrowUp, ArrowDown, ClipboardList, Phone, MessageSquare, MessageCirclePlus, Check, ListOrdered, Crop } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Product, Brand, Category, Banner, News, Service, Order } from "@shared/schema";

type Tab = "products" | "brands" | "categories" | "banners" | "news" | "services" | "orders" | "ribbons";

const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: "orders", label: "Заявки", icon: ClipboardList },
  { id: "products", label: "Товары", icon: Package },
  { id: "ribbons", label: "Ленты", icon: ListOrdered },
  { id: "brands", label: "Бренды", icon: Tag },
  { id: "categories", label: "Категории", icon: Settings },
  { id: "banners", label: "Баннеры", icon: Megaphone },
  { id: "news", label: "Новости", icon: Newspaper },
  { id: "services", label: "Услуги", icon: Settings },
];

export default function Admin() {
  usePageTitle("Админ-панель");

  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("products");

  const { data: user, isLoading: authLoading } = useQuery<{ id: string; username: string; role: string }>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/login");
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [authLoading, user, setLocation]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h1 className="text-2xl font-bold" data-testid="text-admin-title">Админ-панель</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground" data-testid="text-admin-user">{user.username}</span>
          <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()} data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-1" />
            Выйти
          </Button>
        </div>
      </div>

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

      {activeTab === "orders" && <OrdersAdmin />}
      {activeTab === "products" && <ProductsAdmin />}
      {activeTab === "ribbons" && <RibbonsAdmin />}
      {activeTab === "brands" && <BrandsAdmin />}
      {activeTab === "categories" && <CategoriesAdmin />}
      {activeTab === "banners" && <BannersAdmin />}
      {activeTab === "news" && <NewsAdmin />}
      {activeTab === "services" && <ServicesAdmin />}
    </div>
  );
}

const statusLabels: Record<string, string> = {
  new: "Новая",
  processing: "В обработке",
  completed: "Завершена",
  cancelled: "Отменена",
};

const statusColors: Record<string, string> = {
  new: "destructive",
  processing: "default",
  completed: "secondary",
  cancelled: "outline",
};

function OrdersAdmin() {
  const { toast } = useToast();
  const { data: orders } = useQuery<Order[]>({ queryKey: ["/api/admin/orders"] });
  const { data: allProducts } = useQuery<Product[]>({ queryKey: ["/api/products"] });

  const productMap = new Map(allProducts?.map(p => [p.id, p]) || []);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/orders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({ title: "Заявка удалена" });
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ id, adminComment }: { id: string; adminComment: string }) =>
      apiRequest("PATCH", `/api/admin/orders/${id}/comment`, { adminComment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({ title: "Комментарий сохранён" });
      setEditingCommentId(null);
      setCommentText("");
    },
    onError: () => toast({ title: "Ошибка сохранения", variant: "destructive" }),
  });

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const newOrdersCount = orders?.filter(o => o.status === "new").length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="font-semibold text-lg">Заявки</h3>
        {newOrdersCount > 0 && (
          <Badge variant="destructive" data-testid="badge-new-orders-count">
            {newOrdersCount} новых
          </Badge>
        )}
      </div>

      {!orders || orders.length === 0 ? (
        <Card className="p-8 text-center">
          <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Заявок пока нет</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="p-4" data-testid={`admin-order-${order.id}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={statusColors[order.status] as any} data-testid={`badge-order-status-${order.id}`}>
                      {statusLabels[order.status] || order.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("ru-RU")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${order.phone}`} className="text-sm font-medium hover:underline" data-testid={`text-order-phone-${order.id}`}>
                      {order.phone}
                    </a>
                  </div>
                  {order.comment && (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm text-muted-foreground" data-testid={`text-order-comment-${order.id}`}>{order.comment}</p>
                    </div>
                  )}
                </div>
                <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(order.id)} data-testid={`button-delete-order-${order.id}`}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-medium mb-1.5">Товары ({(order.productIds as string[]).length}):</p>
                <ul className="space-y-1">
                  {(order.productIds as string[]).map((pid) => {
                    const product = productMap.get(pid);
                    return (
                      <li key={pid} className="flex items-center gap-2 text-sm">
                        {product ? (
                          <a href={`/product/${pid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 min-w-0 flex-1 hover:text-primary transition-colors" data-testid={`link-order-product-${pid}`}>
                            {product.image && <img src={product.image} alt="" className="w-8 h-8 object-cover rounded shrink-0" />}
                            <span className="truncate hover:underline">{product.name}</span>
                            <span className="text-muted-foreground ml-auto shrink-0">{product.price.toLocaleString("ru-RU")} сом.</span>
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Товар удалён ({pid})</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-3">
                {order.adminComment && editingCommentId !== order.id && (
                  <div className="flex items-start gap-2 mb-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2.5">
                    <MessageCirclePlus className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-blue-800 dark:text-blue-300 flex-1" data-testid={`text-admin-comment-${order.id}`}>{order.adminComment}</p>
                  </div>
                )}

                {editingCommentId === order.id ? (
                  <div className="flex gap-2 items-start">
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Комментарий администратора..."
                      className="text-sm min-h-[60px] flex-1"
                      data-testid={`input-admin-comment-${order.id}`}
                    />
                    <div className="flex flex-col gap-1">
                      <Button
                        size="icon"
                        variant="default"
                        className="h-8 w-8"
                        disabled={commentMutation.isPending}
                        onClick={() => commentMutation.mutate({ id: order.id, adminComment: commentText })}
                        data-testid={`button-save-comment-${order.id}`}
                      >
                        {commentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => { setEditingCommentId(null); setCommentText(""); }}
                        data-testid={`button-cancel-comment-${order.id}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setEditingCommentId(order.id);
                      setCommentText(order.adminComment || "");
                    }}
                    data-testid={`button-add-comment-${order.id}`}
                  >
                    <MessageCirclePlus className="w-3.5 h-3.5 mr-1.5" />
                    {order.adminComment ? "Редактировать комментарий" : "Добавить комментарий"}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const emptyProductForm = {
  name: "", description: "", shortSpecs: "", price: "", image: "",
  images: [] as string[],
  brandId: "", categoryId: "", isBestseller: false, discountPercent: "0",
  priceNegotiable: false, inStock: true,
};

function MultiImageUpload({
  images, primaryImage, onImagesChange, onPrimaryChange,
}: {
  images: string[];
  primaryImage: string;
  onImagesChange: (imgs: string[]) => void;
  onPrimaryChange: (img: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [cropUrl, setCropUrl] = useState<string | null>(null);
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File | Blob, filename?: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file, filename || "image.png");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Ошибка загрузки");
      const data = await res.json();
      return data.url as string;
    } catch { return null; }
    finally { setUploading(false); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    for (const file of files) {
      const url = await uploadFile(file, file.name);
      if (url) {
        const next = [...images, url];
        onImagesChange(next);
        if (!primaryImage) onPrimaryChange(url);
        setCropIndex(next.length - 1);
        setCropUrl(url);
      }
    }
  };

  const handleCropSave = async (blob: Blob) => {
    const url = await uploadFile(blob, "cropped.png");
    if (url !== null && cropIndex !== null) {
      const next = [...images];
      const old = next[cropIndex];
      next[cropIndex] = url;
      onImagesChange(next);
      if (primaryImage === old) onPrimaryChange(url);
    }
    setCropUrl(null);
    setCropIndex(null);
  };

  const handleCropCancel = () => {
    setCropUrl(null);
    setCropIndex(null);
  };

  const openCrop = (url: string, idx: number) => {
    setCropIndex(idx);
    setCropUrl(url);
  };

  const removeImage = (url: string) => {
    const next = images.filter((i) => i !== url);
    onImagesChange(next);
    if (primaryImage === url) onPrimaryChange(next[0] || "");
  };

  const setPrimary = (url: string) => onPrimaryChange(url);

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
      <div className="flex flex-wrap gap-2">
        {images.map((url, idx) => (
          <div key={url} className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors ${primaryImage === url ? "border-primary" : "border-border"}`}>
            <img src={url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
              <button
                onClick={() => openCrop(url, idx)}
                className="w-full flex items-center justify-center gap-1 text-[10px] bg-white/90 text-black px-1.5 py-0.5 rounded font-medium cursor-pointer hover:bg-white"
                title="Корректировать"
              >
                <Crop className="w-2.5 h-2.5" /> Изменить
              </button>
              {primaryImage !== url && (
                <button onClick={() => setPrimary(url)} className="w-full text-[10px] bg-white/90 text-black px-1.5 py-0.5 rounded font-medium cursor-pointer hover:bg-white text-center">Главная</button>
              )}
              <button onClick={() => removeImage(url)} className="w-full text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded cursor-pointer hover:bg-red-600 text-center">Удалить</button>
            </div>
            {primaryImage === url && (
              <div className="absolute top-1 left-1 bg-primary text-white text-[9px] px-1 py-0.5 rounded font-bold">Главная</div>
            )}
          </div>
        ))}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground cursor-pointer transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          <span className="text-[10px]">{uploading ? "Загрузка..." : "Добавить"}</span>
        </button>
      </div>

      {cropUrl && (
        <ImageCropModal
          open={!!cropUrl}
          imageUrl={cropUrl}
          onClose={handleCropCancel}
          onSave={handleCropSave}
          shape="product"
        />
      )}
    </div>
  );
}

function ProductsAdmin() {
  const { toast } = useToast();
  const { data: products } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: brands } = useQuery<Brand[]>({ queryKey: ["/api/brands"] });
  const { data: categories } = useQuery<Category[]>({ queryKey: ["/api/categories"] });

  const [addForm, setAddForm] = useState(emptyProductForm);
  const [editForm, setEditForm] = useState(emptyProductForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    queryClient.invalidateQueries({ queryKey: ["/api/products/bestsellers"] });
    queryClient.invalidateQueries({ queryKey: ["/api/products/discounted"] });
  };

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/products", {
      ...addForm,
      price: parseFloat(addForm.price) || 0,
      discountPercent: parseInt(addForm.discountPercent) || 0,
    }),
    onSuccess: () => {
      invalidateProducts();
      setAddForm(emptyProductForm);
      toast({ title: "Товар добавлен" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PATCH", `/api/admin/products/${id}`, {
      ...editForm,
      price: parseFloat(editForm.price) || 0,
      discountPercent: parseInt(editForm.discountPercent) || 0,
    }),
    onSuccess: () => {
      invalidateProducts();
      setEditForm(emptyProductForm);
      setEditingId(null);
      setEditModalOpen(false);
      toast({ title: "Товар обновлён" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/products/${id}`),
    onSuccess: () => {
      invalidateProducts();
      toast({ title: "Товар удалён" });
    },
  });

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    const imgs = (p.images && p.images.length > 0) ? p.images : (p.image ? [p.image] : []);
    setEditForm({
      name: p.name,
      description: p.description || "",
      shortSpecs: p.shortSpecs || "",
      price: String(p.price),
      image: p.image || "",
      images: imgs,
      brandId: p.brandId || "",
      categoryId: p.categoryId || "",
      isBestseller: p.isBestseller || false,
      discountPercent: String(p.discountPercent || 0),
      priceNegotiable: p.priceNegotiable || false,
      inStock: p.inStock !== false,
    });
    setEditModalOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyProductForm);
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-visible">
        <h3 className="font-semibold mb-3">Добавить товар</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input placeholder="Название" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} data-testid="input-product-name" />
          <div className="flex gap-2 items-center">
            <Input placeholder="Цена" type="number" value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })} disabled={addForm.priceNegotiable} className="flex-1" data-testid="input-product-price" />
            <div className="flex items-center gap-1.5 shrink-0">
              <Checkbox checked={addForm.priceNegotiable} onCheckedChange={(v) => setAddForm({ ...addForm, priceNegotiable: !!v })} id="add-negotiable" data-testid="checkbox-price-negotiable" />
              <label htmlFor="add-negotiable" className="text-xs whitespace-nowrap cursor-pointer">Договорная</label>
            </div>
          </div>
          <Input placeholder="Скидка %" type="number" value={addForm.discountPercent} onChange={(e) => setAddForm({ ...addForm, discountPercent: e.target.value })} data-testid="input-product-discount" />
          <Select value={addForm.brandId} onValueChange={(v) => setAddForm({ ...addForm, brandId: v })}>
            <SelectTrigger data-testid="select-product-brand"><SelectValue placeholder="Бренд" /></SelectTrigger>
            <SelectContent>{brands?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={addForm.categoryId} onValueChange={(v) => setAddForm({ ...addForm, categoryId: v })}>
            <SelectTrigger data-testid="select-product-category"><SelectValue placeholder="Категория" /></SelectTrigger>
            <SelectContent>{categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
          <Input placeholder="Краткие характеристики" value={addForm.shortSpecs} onChange={(e) => setAddForm({ ...addForm, shortSpecs: e.target.value })} data-testid="input-product-specs" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox checked={addForm.isBestseller} onCheckedChange={(v) => setAddForm({ ...addForm, isBestseller: !!v })} data-testid="checkbox-bestseller" />
              <label className="text-sm">Хит продаж</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={addForm.inStock} onCheckedChange={(v) => setAddForm({ ...addForm, inStock: !!v })} id="add-instock" data-testid="checkbox-in-stock" />
              <label htmlFor="add-instock" className="text-sm cursor-pointer">В наличии</label>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium mb-1 block">Фотографии</label>
          <MultiImageUpload
            images={addForm.images}
            primaryImage={addForm.image}
            onImagesChange={(imgs) => setAddForm({ ...addForm, images: imgs, image: addForm.image && imgs.includes(addForm.image) ? addForm.image : (imgs[0] || "") })}
            onPrimaryChange={(img) => setAddForm({ ...addForm, image: img })}
          />
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium mb-1.5 block">Описание</label>
          <RichTextEditor
            value={addForm.description}
            onChange={(val) => setAddForm({ ...addForm, description: val })}
            placeholder="Введите описание товара. Используйте форматирование для структурирования текста..."
            data-testid="input-product-description"
          />
        </div>
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
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs text-muted-foreground">
                    {p.priceNegotiable ? "Договорная" : `${p.price.toLocaleString("ru-RU")} сом.`}
                  </p>
                  <span className={`text-[10px] font-medium ${p.inStock !== false ? "text-emerald-600" : "text-gray-400"}`}>
                    {p.inStock !== false ? "В наличии" : "Нет в наличии"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => startEdit(p)} data-testid={`button-edit-product-${p.id}`}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(p.id)} data-testid={`button-delete-product-${p.id}`}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={editModalOpen} onOpenChange={(open) => { if (!open) cancelEdit(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-edit-product">
          <DialogHeader>
            <DialogTitle>Редактировать товар</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <Input placeholder="Название" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} data-testid="input-edit-product-name" />
            <div className="flex gap-2 items-center">
              <Input placeholder="Цена" type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} disabled={editForm.priceNegotiable} className="flex-1" data-testid="input-edit-product-price" />
              <div className="flex items-center gap-1.5 shrink-0">
                <Checkbox checked={editForm.priceNegotiable} onCheckedChange={(v) => setEditForm({ ...editForm, priceNegotiable: !!v })} id="edit-negotiable" data-testid="checkbox-edit-price-negotiable" />
                <label htmlFor="edit-negotiable" className="text-xs whitespace-nowrap cursor-pointer">Договорная</label>
              </div>
            </div>
            <Input placeholder="Скидка %" type="number" value={editForm.discountPercent} onChange={(e) => setEditForm({ ...editForm, discountPercent: e.target.value })} data-testid="input-edit-product-discount" />
            <Select value={editForm.brandId} onValueChange={(v) => setEditForm({ ...editForm, brandId: v })}>
              <SelectTrigger data-testid="select-edit-product-brand"><SelectValue placeholder="Бренд" /></SelectTrigger>
              <SelectContent>{brands?.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={editForm.categoryId} onValueChange={(v) => setEditForm({ ...editForm, categoryId: v })}>
              <SelectTrigger data-testid="select-edit-product-category"><SelectValue placeholder="Категория" /></SelectTrigger>
              <SelectContent>{categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Краткие характеристики" value={editForm.shortSpecs} onChange={(e) => setEditForm({ ...editForm, shortSpecs: e.target.value })} data-testid="input-edit-product-specs" />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox checked={editForm.isBestseller} onCheckedChange={(v) => setEditForm({ ...editForm, isBestseller: !!v })} data-testid="checkbox-edit-bestseller" />
                <label className="text-sm">Хит продаж</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={editForm.inStock} onCheckedChange={(v) => setEditForm({ ...editForm, inStock: !!v })} id="edit-instock" data-testid="checkbox-edit-in-stock" />
                <label htmlFor="edit-instock" className="text-sm cursor-pointer">В наличии</label>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <label className="text-sm font-medium mb-1 block">Фотографии</label>
            <MultiImageUpload
              images={editForm.images}
              primaryImage={editForm.image}
              onImagesChange={(imgs) => setEditForm({ ...editForm, images: imgs, image: editForm.image && imgs.includes(editForm.image) ? editForm.image : (imgs[0] || "") })}
              onPrimaryChange={(img) => setEditForm({ ...editForm, image: img })}
            />
          </div>
          <div className="mt-3">
            <label className="text-sm font-medium mb-1.5 block">Описание</label>
            <RichTextEditor
              value={editForm.description}
              onChange={(val) => setEditForm({ ...editForm, description: val })}
              placeholder="Введите описание товара. Используйте форматирование для структурирования текста..."
              data-testid="input-edit-product-description"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => editingId && updateMutation.mutate(editingId)} disabled={updateMutation.isPending} data-testid="button-save-edit-product">
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Pencil className="w-4 h-4 mr-1" />}
              Сохранить
            </Button>
            <Button variant="outline" onClick={cancelEdit} data-testid="button-cancel-edit-product">
              Отмена
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BrandsAdmin() {
  const { toast } = useToast();
  const { data: brands } = useQuery<Brand[]>({ queryKey: ["/api/brands"] });
  const [form, setForm] = useState({ name: "", image: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/brands", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      setForm({ name: "", image: "" });
      toast({ title: "Бренд добавлен" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PATCH", `/api/admin/brands/${id}`, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      setForm({ name: "", image: "" });
      setEditingId(null);
      toast({ title: "Бренд обновлён" });
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

  const reorderMutation = useMutation({
    mutationFn: (items: { id: string; sortOrder: number }[]) =>
      apiRequest("PATCH", "/api/admin/brands/reorder", { items }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
    },
  });

  const moveBrand = (index: number, direction: "up" | "down") => {
    if (!brands) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= brands.length) return;
    const newOrder = [...brands];
    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
    const items = newOrder.map((b, i) => ({ id: b.id, sortOrder: i }));
    reorderMutation.mutate(items);
  };

  const startEdit = (b: Brand) => {
    setEditingId(b.id);
    setForm({ name: b.name, image: b.image || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", image: "" });
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate(editingId);
    } else {
      createMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-visible">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-semibold">{editingId ? "Редактировать бренд" : "Добавить бренд"}</h3>
          {editingId && (
            <Button variant="ghost" size="sm" onClick={cancelEdit} data-testid="button-cancel-edit-brand">
              <X className="w-4 h-4 mr-1" />Отмена
            </Button>
          )}
        </div>
        <div className="space-y-3">
          <Input placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="input-brand-name" />
          <div>
            <label className="text-sm font-medium mb-1 block">Логотип</label>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} testId="upload-brand-image" shape="brand" />
          </div>
          <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-add-brand">
            {editingId ? <><Pencil className="w-4 h-4 mr-1" />Сохранить</> : <><Plus className="w-4 h-4 mr-1" />Добавить</>}
          </Button>
        </div>
      </Card>
      <div className="space-y-2">
        {brands?.map((b, i) => (
          <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-card border border-card-border" data-testid={`admin-brand-${b.id}`}>
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <Button size="icon" variant="ghost" className="h-5 w-5" disabled={i === 0 || reorderMutation.isPending} onClick={() => moveBrand(i, "up")} data-testid={`button-brand-up-${b.id}`}>
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-5 w-5" disabled={i === (brands?.length ?? 0) - 1 || reorderMutation.isPending} onClick={() => moveBrand(i, "down")} data-testid={`button-brand-down-${b.id}`}>
                  <ArrowDown className="w-3 h-3" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground w-5 text-center">{i + 1}</span>
              {b.image && <img src={b.image} alt="" className="w-10 h-10 object-contain rounded-md bg-muted shrink-0" />}
              <span className="text-sm font-medium">{b.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => startEdit(b)} data-testid={`button-edit-brand-${b.id}`}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(b.id)} data-testid={`button-delete-brand-${b.id}`}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
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
  const [editingId, setEditingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/categories", { ...form, parentId: form.parentId || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setForm({ name: "", image: "", parentId: "" });
      toast({ title: "Категория добавлена" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PATCH", `/api/admin/categories/${id}`, { ...form, parentId: form.parentId || null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setForm({ name: "", image: "", parentId: "" });
      setEditingId(null);
      toast({ title: "Категория обновлена" });
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

  const reorderMutation = useMutation({
    mutationFn: (items: { id: string; sortOrder: number }[]) =>
      apiRequest("PATCH", "/api/admin/categories/reorder", { items }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });

  const moveCategory = (index: number, direction: "up" | "down") => {
    if (!categories) return;
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= categories.length) return;
    const items = [
      { id: categories[index].id, sortOrder: categories[swapIndex].sortOrder },
      { id: categories[swapIndex].id, sortOrder: categories[index].sortOrder },
    ];
    reorderMutation.mutate(items);
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({ name: c.name, image: c.image || "", parentId: c.parentId || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", image: "", parentId: "" });
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate(editingId);
    } else {
      createMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-visible">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-semibold">{editingId ? "Редактировать категорию" : "Добавить категорию"}</h3>
          {editingId && (
            <Button variant="ghost" size="sm" onClick={cancelEdit} data-testid="button-cancel-edit-category">
              <X className="w-4 h-4 mr-1" />Отмена
            </Button>
          )}
        </div>
        <div className="space-y-3">
          <Input placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="input-category-name" />
          <Select value={form.parentId || "_none"} onValueChange={(v) => setForm({ ...form, parentId: v === "_none" ? "" : v })}>
            <SelectTrigger data-testid="select-category-parent"><SelectValue placeholder="Родительская категория" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_none">Без родительской</SelectItem>
              {categories?.filter(c => c.id !== editingId).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <div>
            <label className="text-sm font-medium mb-1 block">Изображение</label>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} testId="upload-category-image" shape="category" />
          </div>
          <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-add-category">
            {editingId ? <><Pencil className="w-4 h-4 mr-1" />Сохранить</> : <><Plus className="w-4 h-4 mr-1" />Добавить</>}
          </Button>
        </div>
      </Card>
      <div className="space-y-2">
        {categories?.map((c, i) => (
          <div key={c.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-card border border-card-border" data-testid={`admin-category-${c.id}`}>
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <Button size="icon" variant="ghost" className="h-5 w-5" disabled={i === 0 || reorderMutation.isPending} onClick={() => moveCategory(i, "up")} data-testid={`button-category-up-${c.id}`}>
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <Button size="icon" variant="ghost" className="h-5 w-5" disabled={i === (categories?.length ?? 0) - 1 || reorderMutation.isPending} onClick={() => moveCategory(i, "down")} data-testid={`button-category-down-${c.id}`}>
                  <ArrowDown className="w-3 h-3" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground w-5 text-center">{i + 1}</span>
              {c.image && <img src={c.image} alt="" className="w-10 h-10 object-contain rounded-md bg-muted shrink-0" />}
              <span className="text-sm font-medium">{c.name}</span>
              {c.parentId && <span className="text-xs text-muted-foreground">(подкатегория)</span>}
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => startEdit(c)} data-testid={`button-edit-category-${c.id}`}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(c.id)} data-testid={`button-delete-category-${c.id}`}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
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
  const { data: bottomBanners } = useQuery<Banner[]>({ queryKey: ["/api/banners", "bottom"] });
  const [form, setForm] = useState({ type: "hero", image: "", title: "", description: "", buttonText: "", buttonLink: "" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/banners", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      setForm({ type: "hero", image: "", title: "", description: "", buttonText: "", buttonLink: "" });
      toast({ title: "Баннер добавлен" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PATCH", `/api/admin/banners/${id}`, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      setForm({ type: "hero", image: "", title: "", description: "", buttonText: "", buttonLink: "" });
      setEditingId(null);
      toast({ title: "Баннер обновлён" });
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

  const startEdit = (b: Banner) => {
    setEditingId(b.id);
    setForm({
      type: b.type,
      image: b.image || "",
      title: b.title || "",
      description: b.description || "",
      buttonText: b.buttonText || "",
      buttonLink: b.buttonLink || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ type: "hero", image: "", title: "", description: "", buttonText: "", buttonLink: "" });
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate(editingId);
    } else {
      createMutation.mutate();
    }
  };

  const all = [...(heroBanners || []), ...(promoBanners || []), ...(bottomBanners || [])];

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-visible">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-semibold">{editingId ? "Редактировать баннер" : "Добавить баннер"}</h3>
          {editingId && (
            <Button variant="ghost" size="sm" onClick={cancelEdit} data-testid="button-cancel-edit-banner">
              <X className="w-4 h-4 mr-1" />Отмена
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger data-testid="select-banner-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hero">Главный слайд</SelectItem>
              <SelectItem value="promo">Промо баннер</SelectItem>
              <SelectItem value="bottom">Нижний баннер</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Заголовок" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-banner-title" />
          <Input placeholder="Текст" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="input-banner-desc" />
          <Input placeholder="Текст кнопки" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} data-testid="input-banner-btn" />
          <Input placeholder="Ссылка кнопки" value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} data-testid="input-banner-link" />
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium mb-1 block">Изображение</label>
          <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} testId="upload-banner-image" shape={form.type === "hero" ? "hero" : form.type === "bottom" ? "bottom" : "promo"} />
        </div>
        <Button className="mt-3" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-add-banner">
          {editingId ? <><Pencil className="w-4 h-4 mr-1" />Сохранить</> : <><Plus className="w-4 h-4 mr-1" />Добавить</>}
        </Button>
      </Card>
      <div className="space-y-2">
        {all.map((b) => (
          <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-card border border-card-border" data-testid={`admin-banner-${b.id}`}>
            <div className="flex items-center gap-3 min-w-0">
              {b.image && <img src={b.image} alt="" className="w-16 h-10 object-cover rounded-md shrink-0" />}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{b.title || "Без заголовка"}</p>
                <p className="text-xs text-muted-foreground">{b.type === "hero" ? "Главный слайд" : b.type === "bottom" ? "Нижний баннер" : "Промо"}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => startEdit(b)} data-testid={`button-edit-banner-${b.id}`}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(b.id)} data-testid={`button-delete-banner-${b.id}`}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
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
  const [editingId, setEditingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/news", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setForm({ title: "", content: "", image: "" });
      toast({ title: "Новость добавлена" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PATCH", `/api/admin/news/${id}`, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setForm({ title: "", content: "", image: "" });
      setEditingId(null);
      toast({ title: "Новость обновлена" });
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

  const startEdit = (n: News) => {
    setEditingId(n.id);
    setForm({ title: n.title, content: n.content || "", image: n.image || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", content: "", image: "" });
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate(editingId);
    } else {
      createMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-visible">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-semibold">{editingId ? "Редактировать новость" : "Добавить новость"}</h3>
          {editingId && (
            <Button variant="ghost" size="sm" onClick={cancelEdit} data-testid="button-cancel-edit-news">
              <X className="w-4 h-4 mr-1" />Отмена
            </Button>
          )}
        </div>
        <div className="space-y-3">
          <Input placeholder="Заголовок" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-news-title" />
          <div>
            <label className="text-sm font-medium mb-1 block">Изображение</label>
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} testId="upload-news-image" shape="news" />
          </div>
          <Textarea placeholder="Текст новости" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} data-testid="input-news-content" />
        </div>
        <Button className="mt-3" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-add-news">
          {editingId ? <><Pencil className="w-4 h-4 mr-1" />Сохранить</> : <><Plus className="w-4 h-4 mr-1" />Добавить</>}
        </Button>
      </Card>
      <div className="space-y-2">
        {newsList?.map((n) => (
          <div key={n.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-card border border-card-border" data-testid={`admin-news-${n.id}`}>
            <div className="flex items-center gap-3 min-w-0">
              {n.image && <img src={n.image} alt="" className="w-16 h-10 object-cover rounded-md shrink-0" />}
              <p className="text-sm font-medium truncate">{n.title}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => startEdit(n)} data-testid={`button-edit-news-${n.id}`}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(n.id)} data-testid={`button-delete-news-${n.id}`}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
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
  const [editingId, setEditingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/services", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setForm({ title: "", description: "", icon: "wrench" });
      toast({ title: "Услуга добавлена" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: (id: string) => apiRequest("PATCH", `/api/admin/services/${id}`, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setForm({ title: "", description: "", icon: "wrench" });
      setEditingId(null);
      toast({ title: "Услуга обновлена" });
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

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setForm({ title: s.title, description: s.description || "", icon: s.icon || "wrench" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", description: "", icon: "wrench" });
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate(editingId);
    } else {
      createMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 overflow-visible">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-semibold">{editingId ? "Редактировать услугу" : "Добавить услугу"}</h3>
          {editingId && (
            <Button variant="ghost" size="sm" onClick={cancelEdit} data-testid="button-cancel-edit-service">
              <X className="w-4 h-4 mr-1" />Отмена
            </Button>
          )}
        </div>
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
        <Button className="mt-3" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-add-service">
          {editingId ? <><Pencil className="w-4 h-4 mr-1" />Сохранить</> : <><Plus className="w-4 h-4 mr-1" />Добавить</>}
        </Button>
      </Card>
      <div className="space-y-2">
        {services?.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-card border border-card-border" data-testid={`admin-service-${s.id}`}>
            <p className="text-sm font-medium">{s.title}</p>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => startEdit(s)} data-testid={`button-edit-service-${s.id}`}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(s.id)} data-testid={`button-delete-service-${s.id}`}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RibbonOrderList({ title, products, queryKeys }: { title: string; products: Product[]; queryKeys: string[][] }) {
  const { toast } = useToast();
  const [order, setOrder] = useState<Product[]>([]);

  useEffect(() => {
    setOrder(products);
  }, [products]);

  const reorderMutation = useMutation({
    mutationFn: (items: { id: string; sortOrder: number }[]) =>
      apiRequest("PATCH", "/api/admin/products/reorder", { items }),
    onSuccess: () => {
      queryKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      toast({ title: "Порядок сохранён" });
    },
    onError: () => toast({ title: "Ошибка", variant: "destructive" }),
  });

  const move = (index: number, dir: "up" | "down") => {
    const swapIndex = dir === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= order.length) return;
    const newOrder = [...order];
    [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
    setOrder(newOrder);
    const items = newOrder.map((p, i) => ({ id: p.id, sortOrder: i }));
    reorderMutation.mutate(items);
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">{title}</h3>
      {order.length === 0 && <p className="text-sm text-muted-foreground">Нет товаров</p>}
      <div className="space-y-2">
        {order.map((p, i) => (
          <div key={p.id} className="flex items-center justify-between gap-3 p-2 rounded-md bg-muted/40 border border-border" data-testid={`ribbon-item-${p.id}`}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-muted-foreground w-5 text-center shrink-0">{i + 1}</span>
              {p.image && <img src={p.image} alt="" className="w-8 h-8 object-cover rounded shrink-0" />}
              <p className="text-sm font-medium truncate">{p.name}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button size="icon" variant="ghost" className="h-6 w-6" disabled={i === 0 || reorderMutation.isPending} onClick={() => move(i, "up")} data-testid={`button-ribbon-up-${p.id}`}>
                <ArrowUp className="w-3 h-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-6 w-6" disabled={i === order.length - 1 || reorderMutation.isPending} onClick={() => move(i, "down")} data-testid={`button-ribbon-down-${p.id}`}>
                <ArrowDown className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RibbonsAdmin() {
  const { data: bestsellers } = useQuery<Product[]>({ queryKey: ["/api/products/bestsellers"] });
  const { data: discounted } = useQuery<Product[]>({ queryKey: ["/api/products/discounted"] });

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Используйте стрелки, чтобы изменить порядок отображения товаров в лентах на главной странице.</p>
      <RibbonOrderList
        title="Хиты продаж"
        products={bestsellers ?? []}
        queryKeys={[["/api/products/bestsellers"]]}
      />
      <RibbonOrderList
        title="Скидки"
        products={discounted ?? []}
        queryKeys={[["/api/products/discounted"]]}
      />
    </div>
  );
}
