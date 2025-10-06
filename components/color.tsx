import { BrandColor } from "./BrandForm";

interface ColorPaletteProps {
  colors: BrandColor[]
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  if (!colors || colors.length === 0) return null;

  // Calculate equal width distribution for all colors
  const equalWidth = 100 / colors.length;

  return (
    <div className="flex h-full overflow-hidden shadow-lg">
      {colors.map((color, index) => {
        return (
          <div
            key={index}
            className="flex items-center justify-center"
            style={{
              backgroundColor: color.hex,
              width: `${equalWidth}%`,
            }}
          >
            {/* No labels - clean color display only */}
          </div>
        );
      })}
    </div>
  );
}
