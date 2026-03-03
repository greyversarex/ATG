import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Brand } from "@shared/schema";

interface BrandsRibbonProps {
  brands: Brand[];
}

export function BrandsRibbon({ brands }: BrandsRibbonProps) {
  const [expanded, setExpanded] = useState(false);
  const [rowHeight, setRowHeight] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const firstItem = gridRef.current.children[0] as HTMLElement | undefined;
    if (!firstItem) return;
    const gap = parseFloat(getComputedStyle(gridRef.current).rowGap) || 8;
    setRowHeight(firstItem.offsetHeight + gap);
  }, [brands]);

  if (!brands.length) return null;

  const cols = { sm: 4, md: 6 };
  const maxVisible = cols.md * 2;
  const needsExpander = brands.length > maxVisible || (rowHeight !== null && brands.length > cols.sm * 2);

  const collapsedHeight = rowHeight !== null ? rowHeight * 2 - parseFloat(getComputedStyle(gridRef.current!).rowGap || "8") : undefined;

  return (
    <section data-testid="section-brands-ribbon" className="mt-[-16px] mb-[-16px]">
      <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Бренды</h2>

      <div
        className="overflow-hidden transition-all duration-300"
        style={!expanded && collapsedHeight !== undefined ? { maxHeight: collapsedHeight } : undefined}
      >
        <div
          ref={gridRef}
          className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3"
        >
          {brands.map((brand) => (
            <Link key={brand.id} href={`/catalog?brand=${brand.id}`}>
              <div
                className="bg-white rounded-lg overflow-hidden aspect-[5/2] cursor-pointer hover-elevate"
                data-testid={`card-brand-${brand.id}`}
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {needsExpander && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-muted/60 hover:bg-muted transition-colors text-sm text-muted-foreground cursor-pointer"
          data-testid="button-brands-expand"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Свернуть
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Показать все бренды
            </>
          )}
        </button>
      )}
    </section>
  );
}
