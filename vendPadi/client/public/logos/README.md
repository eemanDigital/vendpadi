# VendPadi Logos

This directory contains all logo variations for VendPadi.

## Logo Files

| File | Description | Use Case |
|------|-------------|----------|
| `favicon.svg` | Main favicon | Browser tab, bookmarks |
| `logo.svg` | Horizontal logo with icon | Header, navigation |
| `logo-full.svg` | Full logo with tagline | Landing page hero |
| `logo-icon-dark.svg` | Icon on dark circle | Dark backgrounds, app icon |
| `logo-mark.svg` | Minimal icon mark | Avatar, favicon alternative |
| `logo-icon.png` | PNG version | Fallback for older browsers |

## Creating PNG Versions

To create PNG versions from the SVGs, you can use:

### Using ImageMagick:
```bash
# Install ImageMagick if needed

# Create favicon.png (512x512)
convert favicon.svg -resize 512x512 favicon.png

# Create icon sizes
convert favicon.svg -resize 192x192 logo-192.png
convert favicon.svg -resize 512x512 logo-512.png

# Create apple-touch-icon
convert favicon.svg -resize 180x180 apple-touch-icon.png
```

### Online Tools:
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [SVGtoPNG](https://svgtopng.com/)
- [Favicon.io](https://favicon.io/)

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Padi Green | #25C866 | Primary brand color |
| Teal | #128C7E | Secondary accent |
| Navy | #1A1A2E | Text, dark backgrounds |
| White | #FFFFFF | Icon backgrounds |

## Font

Primary: **Sora** (Google Fonts)
- Weights: 600 (semibold), 700 (bold), 800 (extrabold)
- Fallback: Inter, system-ui, sans-serif

## Design Guidelines

1. Always maintain the gradient from #25C866 to #128C7E
2. Keep adequate padding around the icon
3. The "Vend" text is dark (#1A1A2E)
4. The "Padi" text uses the green gradient
5. Minimum readable size: 24px height
