import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, RotateCcw, ZoomIn, ZoomOut, Move } from "lucide-react";

const MAX_CANVAS_W = 420;

interface CardShape {
  ratio: number;
  label: string;
  rounded: boolean;
  bg: string;
}

export const CARD_SHAPES: Record<string, CardShape> = {
  brand: { ratio: 3 / 2, label: "Карточка бренда", rounded: true, bg: "#ffffff" },
  product: { ratio: 1, label: "Карточка товара", rounded: true, bg: "#f0f1f3" },
  category: { ratio: 1, label: "Карточка категории", rounded: true, bg: "#f0f1f3" },
  hero: { ratio: 16 / 6, label: "Герой-баннер", rounded: true, bg: "#1a1a1a" },
  promo: { ratio: 16 / 5, label: "Промо-баннер", rounded: true, bg: "#1a1a1a" },
  news: { ratio: 16 / 9, label: "Карточка новости", rounded: true, bg: "#f0f1f3" },
};

interface ImageCropModalProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
  onSave: (croppedBlob: Blob) => void;
  shape?: string;
}

export function ImageCropModal({ open, imageUrl, onClose, onSave, shape = "brand" }: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);

  const card = CARD_SHAPES[shape] || CARD_SHAPES.brand;
  const canvasW = MAX_CANVAS_W;
  const canvasH = Math.round(MAX_CANVAS_W / card.ratio);
  const outputW = 900;
  const outputH = Math.round(900 / card.ratio);

  const fitImage = useCallback(
    (image: HTMLImageElement) => {
      const fitScale = Math.min(canvasW / image.width, canvasH / image.height) * 0.85;
      return {
        scale: fitScale,
        offset: {
          x: (canvasW - image.width * fitScale) / 2,
          y: (canvasH - image.height * fitScale) / 2,
        },
      };
    },
    [canvasW, canvasH]
  );

  useEffect(() => {
    if (!imageUrl || !open) return;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      setImg(image);
      const fit = fitImage(image);
      setScale(fit.scale);
      setOffset(fit.offset);
    };
    image.src = imageUrl;
  }, [imageUrl, open, fitImage]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = card.bg;
    ctx.fillRect(0, 0, canvasW, canvasH);

    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, offset.x, offset.y, w, h);
  }, [img, scale, offset, canvasW, canvasH, card.bg]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    setDragging(true);
    setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || e.touches.length !== 1) return;
    e.preventDefault();
    const t = e.touches[0];
    setOffset({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };

  const handleTouchEnd = () => setDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.02 : 0.02;
    setScale((s) => Math.max(0.02, Math.min(5, s + delta)));
  };

  const handleReset = () => {
    if (!img) return;
    const fit = fitImage(img);
    setScale(fit.scale);
    setOffset(fit.offset);
  };

  const centerImage = () => {
    if (!img) return;
    const w = img.width * scale;
    const h = img.height * scale;
    setOffset({ x: (canvasW - w) / 2, y: (canvasH - h) / 2 });
  };

  const handleSave = async () => {
    if (!img) return;
    setSaving(true);
    try {
      const outCanvas = document.createElement("canvas");
      outCanvas.width = outputW;
      outCanvas.height = outputH;
      const ctx = outCanvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = card.bg;
      ctx.fillRect(0, 0, outputW, outputH);

      const ratioX = outputW / canvasW;
      const ratioY = outputH / canvasH;
      const w = img.width * scale * ratioX;
      const h = img.height * scale * ratioY;
      const ox = offset.x * ratioX;
      const oy = offset.y * ratioY;
      ctx.drawImage(img, ox, oy, w, h);

      outCanvas.toBlob(
        (blob) => {
          if (blob) onSave(blob);
          setSaving(false);
        },
        "image/png",
        1
      );
    } catch {
      setSaving(false);
    }
  };

  const scalePercent = img
    ? Math.round((scale / (Math.min(canvasW / img.width, canvasH / img.height) * 0.85)) * 100)
    : 100;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[500px] max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle>Настройка изображения</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-2 space-y-0.5">
          <p className="text-xs font-medium text-foreground">{card.label}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Move className="w-3 h-3" /> Перетащите мышью для позиционирования
          </p>
        </div>

        <div className="flex justify-center px-4">
          <canvas
            ref={canvasRef}
            width={canvasW}
            height={canvasH}
            className="shadow-md cursor-grab active:cursor-grabbing"
            style={{
              width: canvasW,
              height: canvasH,
              touchAction: "none",
              border: "2px solid #e5e7eb",
              borderRadius: card.rounded ? "12px" : "4px",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            data-testid="canvas-crop"
          />
        </div>

        <div className="px-4 py-3 space-y-3">
          <div className="flex items-center gap-3">
            <ZoomOut className="w-4 h-4 text-muted-foreground shrink-0" />
            <Slider
              value={[scale]}
              min={0.02}
              max={5}
              step={0.01}
              onValueChange={([v]) => setScale(v)}
              className="flex-1"
              data-testid="slider-zoom"
            />
            <ZoomIn className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground w-12 text-right">{scalePercent}%</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset} data-testid="button-reset-crop">
                <RotateCcw className="w-4 h-4 mr-1" />
                Сбросить
              </Button>
              <Button variant="outline" size="sm" onClick={centerImage} data-testid="button-center-crop">
                <Move className="w-4 h-4 mr-1" />
                По центру
              </Button>
            </div>
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
