import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, RotateCcw, ZoomIn, ZoomOut, Move } from "lucide-react";

const PREVIEW_W = 420;

interface CardShape {
  ratio: number;
  label: string;
  bg: string;
}

export const CARD_SHAPES: Record<string, CardShape> = {
  brand: { ratio: 3 / 2, label: "Карточка бренда", bg: "#ffffff" },
  product: { ratio: 1, label: "Карточка товара", bg: "#f0f1f3" },
  category: { ratio: 1, label: "Карточка категории", bg: "#f0f1f3" },
  hero: { ratio: 16 / 6, label: "Герой-баннер", bg: "#1a1a1a" },
  promo: { ratio: 16 / 5, label: "Промо-баннер", bg: "#1a1a1a" },
  bottom: { ratio: 16 / 5, label: "Нижний баннер", bg: "#1a1a1a" },
  news: { ratio: 16 / 9, label: "Карточка новости", bg: "#f0f1f3" },
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
  const imgRef = useRef<HTMLImageElement | null>(null);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const [, forceUpdate] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const card = CARD_SHAPES[shape] || CARD_SHAPES.brand;
  const previewW = PREVIEW_W;
  const previewH = Math.round(PREVIEW_W / card.ratio);
  const outW = 900;
  const outH = Math.round(900 / card.ratio);

  const setScale = (v: number) => {
    scaleRef.current = v;
    forceUpdate((n) => n + 1);
  };
  const setOffset = (v: { x: number; y: number }) => {
    offsetRef.current = v;
    forceUpdate((n) => n + 1);
  };

  const fitImage = useCallback(
    (image: HTMLImageElement) => {
      const s = Math.min(previewW / image.width, previewH / image.height) * 0.85;
      return {
        scale: s,
        offset: {
          x: (previewW - image.width * s) / 2,
          y: (previewH - image.height * s) / 2,
        },
      };
    },
    [previewW, previewH]
  );

  useEffect(() => {
    if (!imageUrl || !open) return;
    setImgLoaded(false);
    const image = new Image();
    image.onload = () => {
      imgRef.current = image;
      const fit = fitImage(image);
      scaleRef.current = fit.scale;
      offsetRef.current = fit.offset;
      setImgLoaded(true);
    };
    image.src = imageUrl;
  }, [imageUrl, open, fitImage]);

  const drawCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const img = imgRef.current;
      if (!img) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const sx = w / previewW;
      const sy = h / previewH;

      ctx.fillStyle = card.bg;
      ctx.fillRect(0, 0, w, h);

      const iw = img.width * scaleRef.current * sx;
      const ih = img.height * scaleRef.current * sy;
      const ix = offsetRef.current.x * sx;
      const iy = offsetRef.current.y * sy;
      ctx.drawImage(img, ix, iy, iw, ih);
    },
    [previewW, previewH, card.bg]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgLoaded) return;
    drawCanvas(canvas, previewW, previewH);
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y });
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
    setDragStart({ x: t.clientX - offsetRef.current.x, y: t.clientY - offsetRef.current.y });
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
    setScale(Math.max(0.02, Math.min(5, scaleRef.current + delta)));
  };

  const handleReset = () => {
    const img = imgRef.current;
    if (!img) return;
    const fit = fitImage(img);
    scaleRef.current = fit.scale;
    offsetRef.current = fit.offset;
    forceUpdate((n) => n + 1);
  };

  const centerImage = () => {
    const img = imgRef.current;
    if (!img) return;
    const w = img.width * scaleRef.current;
    const h = img.height * scaleRef.current;
    setOffset({ x: (previewW - w) / 2, y: (previewH - h) / 2 });
  };

  const handleSave = () => {
    if (!imgRef.current) return;
    setSaving(true);

    try {
      const outCanvas = document.createElement("canvas");
      outCanvas.width = outW;
      outCanvas.height = outH;
      drawCanvas(outCanvas, outW, outH);

      outCanvas.toBlob(
        (blob) => {
          if (blob && blob.size > 0) {
            onSave(blob);
          } else {
            try {
              const dataUrl = outCanvas.toDataURL("image/png");
              const byteString = atob(dataUrl.split(",")[1]);
              const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              const fallbackBlob = new Blob([ab], { type: mimeString });
              onSave(fallbackBlob);
            } catch {
              setSaving(false);
            }
          }
        },
        "image/png"
      );
    } catch {
      setSaving(false);
    }
  };

  const scalePercent = imgRef.current
    ? Math.round(
        (scaleRef.current /
          (Math.min(previewW / imgRef.current.width, previewH / imgRef.current.height) * 0.85)) *
          100
      )
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
            width={previewW}
            height={previewH}
            className="shadow-md cursor-grab active:cursor-grabbing"
            style={{
              width: previewW,
              height: previewH,
              touchAction: "none",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
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
              value={[scaleRef.current]}
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
