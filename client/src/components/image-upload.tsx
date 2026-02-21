import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, RefreshCw, Crop } from "lucide-react";
import { ImageCropModal } from "./image-crop-modal";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  testId?: string;
  defaultAspect?: number;
}

export function ImageUpload({ value, onChange, testId, defaultAspect }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File | Blob, filename?: string) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file, filename || "image.jpg");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Ошибка загрузки");
      }
      const data = await res.json();
      return data.url as string;
    } catch (e: any) {
      setError(e.message || "Ошибка загрузки");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelected = async (file: File) => {
    const url = await uploadFile(file, file.name);
    if (url) {
      setCropImage(url);
    }
  };

  const handleCropSave = async (croppedBlob: Blob) => {
    const url = await uploadFile(croppedBlob, "cropped.jpg");
    if (url) {
      onChange(url);
    }
    setCropImage(null);
  };

  const handleCropCancel = () => {
    if (cropImage) {
      onChange(cropImage);
    }
    setCropImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
    e.target.value = "";
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelected(file);
    } else {
      setError("Допустимы только изображения");
    }
  }, []);

  const openCropExisting = () => {
    if (value) {
      setCropImage(value);
    }
  };

  return (
    <div data-testid={testId}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative inline-block group">
          <img
            src={value}
            alt="Превью"
            className="w-32 h-32 object-cover rounded-lg border border-border"
          />
          <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={openCropExisting}
              title="Обрезать / масштабировать"
              data-testid={testId ? `${testId}-crop` : undefined}
            >
              <Crop className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              onClick={() => inputRef.current?.click()}
              title="Заменить"
              data-testid={testId ? `${testId}-replace` : undefined}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              onClick={() => onChange("")}
              data-testid={testId ? `${testId}-remove` : undefined}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Загрузка...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Перетащите изображение или нажмите для выбора
              </span>
              <span className="text-xs text-muted-foreground/70">
                JPG, PNG, GIF, WebP, SVG (до 10 МБ)
              </span>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}

      {cropImage && (
        <ImageCropModal
          open={!!cropImage}
          imageUrl={cropImage}
          onClose={handleCropCancel}
          onSave={handleCropSave}
          defaultAspect={defaultAspect}
        />
      )}
    </div>
  );
}
