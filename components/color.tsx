interface ColorPaletteProps {
  colors: {
    hex: string
    width?: number // percentage width, defaults to equal distribution
  }[]
}

export function ColorPalette({ colors }: ColorPaletteProps) {
  // Calculate default width if not specified
  const totalSpecifiedWidth = colors.reduce((sum, color) => sum + (color.width || 0), 0)
  const unspecifiedCount = colors.filter((color) => !color.width).length
  const defaultWidth = unspecifiedCount > 0 ? (100 - totalSpecifiedWidth) / unspecifiedCount : 0

  return (
    <div className="flex h-full overflow-hidden   shadow-lg">
      {colors.map((color, index) => {
        const width = color.width || defaultWidth
        // Determine text color based on background brightness
        const hex = color.hex.replace("#", "")
        const r = Number.parseInt(hex.substring(0, 2), 16)
        const g = Number.parseInt(hex.substring(2, 4), 16)
        const b = Number.parseInt(hex.substring(4, 6), 16)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        const textColor = brightness > 128 ? "#000000" : "#ffffff"

        return (
          <div
            key={index}
            className="flex items-end justify-start p-8"
            style={{
              backgroundColor: color.hex,
              width: `${width}%`,
              color: textColor,
            }}
          >
            <span className="text-md font-medium">{color.hex}</span>
          </div>
        )
      })}
    </div>
  )
}
