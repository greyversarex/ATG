import { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, RotateCcw, ZoomIn, ZoomOut, Move } from "lucide-react";

const CANVAS_SIZE = 400;
const OUTPUT_SIZE = 800;

interface ImageCropModalProps {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
  onSave: (croppedBlob: Blob) => void;
}

export function ImageCropModal({ open, imageUrl, onClose, onSave }: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!imageUrl || !open) return;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      setImg(image);
      const fitScale = Math.min(CANVAS_SIZE / image.width, CANVAS_SIZE / image.height);
      setScale(fitScale);
      setOffset({
        x: (CANVAS_SIZE - image.width * fitScale) / 2,
        y: (CANVAS_SIZE - image.height * fitScale) / 2,
      });
    };
    image.src = imageUrl;
  }, [imageUrl, open]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, offset.x, offset.y, w, h);

    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    const third = CANVAS_SIZE / 3;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(third * i, 0);
      ctx.lineTo(third * i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, third * i);
      ctx.lineTo(CANVAS_SIZE, third * i);
      ctx.stroke();
    }
  }, [img, scale, offset]);

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
    setScale((s) => Math.max(0.05, Math.min(5, s + delta)));
  };

  const handleReset = () => {
    if (!img) return;
    const fitScale = Math.min(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
    setScale(fitScale);
    setOffset({
      x: (CANVAS_SIZE - img.width * fitScale) / 2,
      y: (CANVAS_SIZE - img.height * fitScale) / 2,
    });
  };

  const centerImage = () => {
    if (!img) return;
    const w = img.width * scale;
    const h = img.height * scale;
    setOffset({ x: (CANVAS_SIZE - w) / 2, y: (CANVAS_SIZE - h) / 2 });
  };

  const handleSave = async () => {
    if (!img) return;
    setSaving(true);
    try {
      const outCanvas = document.createElement("canvas");
      outCanvas.width = OUTPUT_SIZE;
      outCanvas.height = OUTPUT_SIZE;
      const ctx = outCanvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

      const ratio = OUTPUT_SIZE / CANVAS_SIZE;
      const w = img.width * scale * ratio;
      const h = img.height * scale * ratio;
      const ox = offset.x * ratio;
      const oy = offset.y * ratio;
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

  const scalePercent = img ? Math.round((scale / Math.min(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height)) * 100) : 100;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[480px] max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle>Настройка изображения</DialogTitle>
        </DialogHeader>

        <p className="px-4 pb-2 text-xs text-muted-foreground flex items-center gap-1">
          <Move className="w-3 h-3" /> Перетащите изображение мышью для позиционирования
        </p>

        <div className="flex justify-center px-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="border-2 border-dashed border-gray-300 rounded-lg cursor-grab active:cursor-grabbing"
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, touchAction: "none" }}
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
              min={0.05}
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
