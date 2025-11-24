# File Converter Dashboard

A modern, client-side file converter with multiple tools for image conversion, document conversion, photo editing, and more. All processing happens in your browser - no files are uploaded to any server.

## Features

### 1. Image Converter
- Convert between: JPG, PNG, WEBP, GIF, BMP
- Multi-file batch processing
- Client-side conversion (privacy-first)

### 2. Document Converter
- **PDF Conversions**: PDF → TXT, DOCX, HTML, MD
- **To PDF**: TXT, MD, HTML, DOCX → PDF
- **DOCX Conversions**: DOCX → TXT, HTML, MD, PDF
- **To DOCX**: TXT, MD, HTML → DOCX
- **To PPTX**: TXT → PPTX
- **Text Formats**: CSV ↔ JSON, MD → HTML, HTML → TXT
- Multi-file support

### 3. Photo Editor
- Filters: Brightness, Contrast, Saturation, Blur
- Crop Tool: Drag to select crop area, adjust dimensions
- Rotate & Flip
- Download edited photos

### 4. Passport Photo Maker
- Create passport photos for multiple countries
- Supported formats:
  - USA (2x2 inches)
  - UK (35x45mm)
  - India (35x45mm)
  - China (33x48mm)
  - Japan (35x45mm)
  - Schengen Visa (35x45mm)
- Drag and position photo
- Auto-crop to specifications

### 5. Banner Maker
- Create social media banners and graphics
- Popular templates:
  - Twitter Header (1500x500)
  - Facebook Cover (820x312)
  - YouTube Thumbnail (1280x720)
  - Instagram Post (1080x1080)
  - LinkedIn Banner (1584x396)
- Drag, scale, and position images
- Add text overlays
- Background colors

### 6. Favicon Maker
- Generate favicons in multiple sizes
- Outputs: 16x16, 32x32, 64x64, 128x128, 256x256
- Download all sizes at once

### 7. App Icon Maker
- Create app icons for iOS and Android
- iOS sizes: 29px to 1024px
- Android sizes: 48px to 512px
- Download complete icon sets

### 8. Screenshot Maker
- Create professional app screenshots
- Templates for:
  - iPhone (1170x2532)
  - iPad (1668x2388)
  - Android (1080x1920)
  - Desktop (1920x1080)
- Add device frames
- Overlay text and branding

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## Usage

1. Select a tool from the sidebar navigation
2. Upload your file(s)
3. Choose output format or settings
4. Convert/Edit and download

## Privacy

All conversions and editing happen entirely in your browser. No files are uploaded to any server. Your data stays on your device.

## Technologies

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- PDF.js (PDF reading)
- jsPDF (PDF creation)
- Mammoth (DOCX reading)
- docx (DOCX creation)
- pptxgenjs (PPTX creation)

## License

Free to use for personal and commercial projects.
