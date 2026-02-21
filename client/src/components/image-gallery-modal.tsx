import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2, Upload, Check, Search } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  url: string;
  name: string;
  size: number;
  createdAt: string;
}

interface ImageGalleryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function ImageGalleryModal({ open, onClose, onSelect }: ImageGalleryModalProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: files, isLoading } = useQuery<UploadedFile[]>({
    queryKey: ["/api/uploads"],
    enabled: open,
  });

  const deleteMutation = useMutation({
    mutationFn: (filename: string) => apiRequest("DELETE", `/api/uploads/${filename}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/uploads"] });
      toast({ title: "Изображение удалено" });
    },
    onError: () => toast({ title: "Ошибка удаления", variant: "destructive" }),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Ошибка загрузки");
      queryClient.invalidateQueries({ queryKey: ["/api/uploads"] });
      toast({ title: "Изображение загружено" });
    } catch {
      toast({ title: "Ошибка загрузки", variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
  };

  const filtered = files?.filter(f =>
    search ? f.name.toLowerCase().includes(search.toLowerCase()) : true
  ) || [];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Галерея изображений</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по имени файла..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-gallery-search"
            />
          </div>
          <label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
            <Button variant="outline" asChild disabled={uploading} data-testid="button-gallery-upload">
              <span>
                {uploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Загрузить
              </span>
            </Button>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {search ? "Ничего не найдено" : "Нет загруженных изображений"}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map((file) => (
                <div
                  key={file.url}
                  className="group relative rounded-lg border border-border overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  data-testid={`gallery-image-${file.name}`}
                >
                  <div
                    className="aspect-square"
                    onClick={() => {
                      onSelect(file.url);
                      onClose();
                    }}
                  >
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(file.url);
                        onClose();
                      }}
                      data-testid={`button-select-${file.name}`}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate(file.name);
                      }}
                      data-testid={`button-delete-upload-${file.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white truncate">{file.name}</p>
                    <p className="text-[10px] text-white/70">{formatSize(file.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
