# Jobs Not Finished Meme Generator

A fully interactive, client-side web app inspired by Kobe Bryant's iconic "jobs not finished" meme. Create both static image memes and animated video memes with custom captions and backgrounds.

## Features

### Image Meme Generator
- Generate static memes using the classic Kobe Bryant template
- Add custom text captions
- Download memes as PNG images
- Animated floating laugh reactions
- GSAP-powered smooth animations

### Video Meme Generator
- Create video memes with chroma key (green screen) technology
- Customize backgrounds (2 defaults + custom upload)
- Adjustable caption text, position, color, and size
- Export as MP4 files
- Real-time canvas preview

## Design

- **Dark Theme**: Background #111111, text #ffffff
- **Typography**: HelveticaNeueMedium font (local) with Arial fallback
- **Mobile Responsive**: 
  - Stacks video sections vertically on screens <800px
  - Reduces font sizes on screens <600px
- **Animations**: GSAP v3.12.2 for smooth, professional transitions

## Usage

### Image Tab
1. Enter your meme text in the input field
2. Click "GENERATE MEME" or press Enter
3. Download your meme with "DOWNLOAD MEME" button
4. Watch for floating laugh reactions!

### Video Tab
1. Switch to the "Video" tab
2. Choose a background (BG 1, BG 2, or upload custom)
3. Customize your caption:
   - Edit the text
   - Choose position (top/bottom)
   - Pick a color
   - Adjust font size (24-96px)
4. Click "GENERATE MEME MP4" (first load may take time for FFmpeg)
5. Wait for video processing
6. Download your MP4!

## Technical Details

### Dependencies (All from CDN)
- **GSAP v3.12.2**: Animation library
- **Tailwind CSS**: Utility-first CSS framework
- **html2canvas**: For image meme downloads
- **FFmpeg.js v0.12.10**: For video conversion to MP4
- **@ffmpeg/util v0.12.10**: FFmpeg utilities

### Required Assets
- `meme-video.mp4`: Green screen video source (5-10 seconds, 540x960)
- `background-1.webp`: Default background image
- `background-2.png`: Alternative background image
- `HelveticaNeueMedium.otf`: Primary font file

### Browser Support
- **Recommended**: Chrome, Firefox, Edge (latest versions)
- Requires ES6+ module support for video generation
- Canvas API and MediaRecorder API required

### Features Implementation
- **Chroma Key**: Real-time green screen removal in browser
- **Client-Side Only**: No backend required, all processing in browser
- **Canvas Rendering**: 30 FPS preview with custom composition
- **Video Recording**: MediaRecorder captures canvas stream
- **FFmpeg Conversion**: Converts WebM to MP4 with H.264 codec

## File Structure

```
/
├── index.html              # Main HTML structure
├── styles.css              # All styling and responsive design
├── script.js               # Image and video generation logic
├── meme-video.mp4          # Source video with green screen
├── background-1.webp       # Default background 1
├── background-2.png        # Default background 2
├── HelveticaNeueMedium.otf # Primary font
├── README.md               # This file
└── ASSETS-README.md        # Asset requirements guide
```

## Performance Notes

- Video generation uses `ultrafast` preset for quick encoding
- Canvas rendering at 30 FPS for smooth preview
- Chroma key processing optimized for real-time performance
- First video generation loads FFmpeg (~30MB), subsequent generations are faster

## Known Limitations

- Video generation requires modern browser with ES6 module support
- First video generation takes longer due to FFmpeg loading
- Large videos may take time to process
- Audio from source video may not always be included (browser dependent)

## Credits

Inspired by Kobe Bryant's legendary "jobs not finished" mentality and iconic meme.

---

**No backend required. All processing happens in your browser.**
