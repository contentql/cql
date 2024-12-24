export function hexToHsl(hex: string): string {
  // Remove the hash sign if present
  hex = hex.replace(/^#/, '')

  // Parse the hex color
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  // Find min and max values
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  // Calculate lightness
  let h = 0,
    s = 0,
    // eslint-disable-next-line prefer-const
    l = (max + min) / 2

  // Calculate saturation
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    // Calculate hue
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h *= 60
  }

  // Convert to percentages and round
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}
