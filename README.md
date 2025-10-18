# Jobs Not Finished Meme Generator

A fully interactive, client-side web app inspired by Kobe Bryant's iconic "jobs not finished" meme. Create both static image memes and animated video memes with custom captions and backgrounds.

## Features

### Image Meme Generator
- Generate static memes using the classic Kobe Bryant template
- Add custom text captions (Enter key or button)
- Download memes as high-quality PNG images
- Animated floating laugh reactions with 10 different responses
- Smooth GSAP animations

### Video Meme Generator
- Create video memes with real-time chroma key (green screen) technology
- Customize backgrounds (2 defaults + custom upload support)
- Adjustable caption: text, position (top/bottom), color, and size (24-96px)
- Export as MP4 files with H.264 encoding
- Real-time 30 FPS canvas preview

## Design

- **Monochrome Theme**: Pure black (#000000) background, pure white (#ffffff) text and buttons
- **Typography**: HelveticaNeueMedium from CDN with Arial fallback
- **Mobile Responsive**: 
  - Video sections stack vertically on screens <800px
  - Reduced font sizes on screens <600px (title: 42px, meme text: 38px)
- **Animations**: GSAP v3.12.2 for professional transitions
- **Clean Code**: Modern ES6+, IIFE pattern (no global pollution), optimized logic

## Technical Implementation

### Architecture
- **No Backend Required**: 100% client-side processing
- **Zero Global Pollution**: Entire app wrapped in IIFE
- **Modern ES6+**: Arrow functions, async/await, optional chaining, template literals
- **Error Handling**: Comprehensive try-catch blocks for all edge cases
- **Optimized Performance**: Single RAF loop, efficient canvas rendering

### Dependencies (All from CDN)
- **GSAP v3.12.2** (cdnjs.cloudflare.com): Animation library
- **Tailwind CSS** (cdn.tailwindcss.com): Utility-first CSS
- **html2canvas v1.4.1** (cdnjs.cloudflare.com): Image capture
- **FFmpeg.js v0.12.10 UMD** (cdn.jsdelivr.net): Video encoding (H.264 + AAC)
- **@ffmpeg/util v0.12.10 UMD** (cdn.jsdelivr.net): FFmpeg utilities
- **HelveticaNeueMedium** (fonts.cdnfonts.com): Primary font

### Key Technologies
- **Chroma Key Algorithm**: Real-time green screen removal with configurable threshold
- **Canvas API**: 30 FPS rendering with composition layers
- **MediaRecorder API**: Canvas stream capture at 5Mbps
- **FFmpeg WebAssembly**: Browser-based video encoding (H.264, AAC audio)
- **Dynamic Script Loading**: Lazy-load html2canvas only when needed

### Video Processing Pipeline
1. Canvas captures composited layers (background + chroma-keyed video + caption)
2. MediaRecorder records canvas stream as WebM (VP9 codec)
3. FFmpeg converts WebM to MP4 (H.264/AAC, ultrafast preset)
4. Blob download with proper MIME types and faststart flag

## Usage

### Image Tab (Default)
1. Enter your meme text in the input field
2. Press Enter or click "GENERATE MEME"
3. Watch for animated laugh reactions 😂
4. Click "DOWNLOAD MEME" to save as PNG

### Video Tab
1. Click the "Video" tab
2. Customize your meme:
   - **Background**: Choose BG 1, BG 2, or upload custom image
   - **Caption**: Enter text, choose position, pick color, adjust size
3. Preview updates in real-time on the canvas
4. Click "GENERATE MEME MP4" (first load initializes FFmpeg ~30MB)
5. Wait for recording and conversion (~5-10 seconds)
6. Click "DOWNLOAD MP4" when ready

## Required Assets

Place these files in the root directory:

- **meme-video.mp4**: Green screen video source (5-10 seconds, portrait format 540x960 recommended)
- **background-1.webp**: Default background image
- **background-2.png**: Alternative background image

> **Note**: If video file is missing, the video tab will show an error message but the image tab will continue to work.

## Browser Compatibility

- **Recommended**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Required APIs**: Canvas, MediaRecorder, WebAssembly
- **FFmpeg Loading**: Uses UMD build (broad browser support)
- **Mobile Support**: iOS Safari, Android Chrome

## File Structure

```
/
├── index.html          # Clean HTML structure (75 lines)
├── styles.css          # Complete styling (371 lines)
├── script.js           # All logic with IIFE (374 lines)
├── meme-video.mp4      # Green screen source video
├── background-1.webp   # Default background
├── background-2.png    # Alternative background
└── README.md           # This file
```

## Code Quality

- ✅ No duplicate code or logic
- ✅ No unnecessary comments
- ✅ Modern ES6+ syntax throughout
- ✅ IIFE pattern prevents global pollution
- ✅ Comprehensive error handling
- ✅ Optimized rendering (single RAF loop)
- ✅ Lazy loading for html2canvas
- ✅ Clean separation of concerns
- ✅ No linter errors

## Performance Notes

- Video encoding uses `ultrafast` preset for speed
- Canvas rendering optimized with `willReadFrequently` flag
- Chroma key processes only visible pixels
- FFmpeg loads once and persists across generations
- Image download dynamically loads html2canvas only when needed

## Error Handling

The app gracefully handles:
- Missing video file (shows error message)
- FFmpeg load failures (retry prompt)
- Invalid user input (temporary error display)
- Audio unavailability (continues without audio)
- Download failures (error logging)
- CORS issues (crossOrigin attributes set)

## Credits

Inspired by Kobe Bryant's legendary work ethic and the iconic "jobs not finished" mentality.

---

**100% Client-Side • No Backend • No Build Step • Just Open and Use**
