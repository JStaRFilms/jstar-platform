import React from 'react';

export interface ColorItem {
  hex: string;
  name?: string;
}

export interface ColorPaletteProps {
  colors: ColorItem[];
  columns?: number;
  className?: string;
}

/**
 * ColorPalette Component - Displays color swatches in a responsive grid
 * Matches exact styles from mockup: 3x3 mobile, 3x2 desktop with hex values and copy functionality
 */
export const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  columns,
  className = '',
}) => {
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  const handleCopyColor = async (hex: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  return (
    <div
      className={`bg-neutral-900/50 backdrop-blur-md p-3 rounded-xl border border-neutral-700/50 ${
        columns ? `grid-cols-${Math.min(columns, colors.length)}` : 'grid-cols-3 md:grid-cols-2'
      } grid gap-2 ${className}`}
    >
      <h3 className="col-span-full font-semibold text-white text-sm mb-1">
        Dark Mode Palette
      </h3>
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={(e) => handleCopyColor(color.hex, e)}
          className="group relative space-y-1 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-purple rounded"
          aria-label={`Copy color ${color.hex}`}
        >
          {/* Color swatch */}
          <div
            className="h-10 w-full rounded transition-transform duration-200"
            style={{ backgroundColor: color.hex }}
          />

          {/* Color info */}
          <div className="text-xs text-center">
            <p className="font-medium text-white">
              {color.name || `Color ${index + 1}`}
            </p>
            <p className="text-neutral-400 font-mono group-hover:text-accent-purple transition-colors">
              {color.hex}
            </p>
          </div>

          {/* Copy feedback */}
          {copiedColor === color.hex && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded flex items-center justify-center">
              <span className="text-xs font-medium text-white">Copied!</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ColorPalette;
