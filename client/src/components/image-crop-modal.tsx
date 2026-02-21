import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, RotateCcw, ZoomIn } from "lucide-react";

const ASPECT_PRESETS = [
  { label: "Товар (1:1)", value: 1 },
  { label: "Баннер (16:6)", value: 16 / 6 },
  { label: "Промо (16:5)", value: 16 / 5 },
  { label: "Бренд (8:7)", value: 32 / 28 },
  { label: "Категория (4:3)", value: 4 / 3 },
  { label: "Новость (16:9)", value: 16 / 9 },
  { label: "Свободная", value: 0 },
];

interface ImageCropModalProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
  onSave: (croppedBlob: Blob) => void;
  defaultAspect?: number;
}

export function ImageCropModal({ open, imageUrl, onClose, onSave, defaultAspect }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const [aspect, setAspect] = useState(defaultAspect || 1);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedImg(imageUrl, croppedAreaPixels, rotation);
      if (blob) onSave(blob);
    } catch {
      // fallback
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle>Настройка изображения</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 px-4 pb-2 flex-wrap">
          {ASPECT_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant={aspect === preset.value ? "default" : "outline"}
              size="sm"
              className="text-xs h-7"
              onClick={() => setAspect(preset.value)}
              data-testid={`button-aspect-${preset.label}`}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full bg-black" style={{ height: "400px" }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect || undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-4 py-3 space-y-3">
          <div className="flex items-center gap-3">
            <ZoomIn className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground w-16 shrink-0">Масштаб</span>
            <Slider
              value={[zoom]}
              min={1}
              max={5}
              step={0.1}
              onValueChange={([v]) => setZoom(v)}
              className="flex-1"
              data-testid="slider-zoom"
            />
            <span className="text-xs text-muted-foreground w-10 text-right">{zoom.toFixed(1)}x</span>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground w-16 shrink-0">Поворот</span>
            <Slider
              value={[rotation]}
              min={0}
              max={360}
              step={1}
              onValueChange={([v]) => setRotation(v)}
              className="flex-1"
              data-testid="slider-rotation"
            />
            <span className="text-xs text-muted-foreground w-10 text-right">{rotation}°</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={handleReset} data-testid="button-reset-crop">
              <RotateCcw className="w-4 h-4 mr-1" />
              Сбросить
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose} data-testid="button-cancel-crop">
                Отмена
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} data-testid="button-save-crop">
                <Check className="w-4 h-4 mr-1" />
                {saving ? "Сохранение..." : "Применить"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area, rotation = 0): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const rotRad = (rotation * Math.PI) / 180;
  const { width: bBoxWidth, height: bBoxHeight } = getRotatedSize(image.width, image.height, rotation);

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");
  if (!croppedCtx) return null;

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous";
    image.src = url;
  });
}

function getRotatedSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}
