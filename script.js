// DOM Elements
let generateBtn, downloadBtn, userInput, memeText, memeCanvas, laughTrack, title;

// Laugh responses
const laughResponses = [
    "😂 WEAK!",
    "🤣 TRY HARDER!",
    "😭 SO BAD!",
    "💀 PATHETIC!",
    "🔥 TRASH!",
    "😤 NOT DONE!",
    "👎 REALLY?!",
    "🤡 LOL NO!",
    "💯 UNFINISHED!",
    "⚡ KEEP GOING!"
];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    generateBtn = document.getElementById('generateBtn');
    downloadBtn = document.getElementById('downloadBtn');
    userInput = document.getElementById('userInput');
    memeText = document.getElementById('memeText');
    memeCanvas = document.getElementById('memeCanvas');
    laughTrack = document.getElementById('laughTrack');
    title = document.getElementById('title');

    // Event listeners
    generateBtn.addEventListener('click', generateMeme);
    downloadBtn.addEventListener('click', downloadMeme);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateMeme();
        }
    });

    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    let videoInitialized = false;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide tabs
            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });

            // Initialize video generator on first switch to video tab
            if (targetTab === 'videoTab' && !videoInitialized) {
                videoInitialized = true;
                initVideoGenerator();
            }
        });
    });

    // Animate title on load
    animateTitle();
});

function generateMeme() {
    const text = userInput.value.trim();
    
    if (text) {
        memeText.textContent = text.toUpperCase();
        
        // GSAP animation
        gsap.from(memeText, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
        
        createLaugh();
    } else {
        memeText.textContent = 'ENTER SOME TEXT!';
        setTimeout(() => {
            memeText.textContent = '';
        }, 2000);
    }
}

function downloadMeme() {
    const text = memeText.textContent;
    
    if (!text || text === 'ENTER SOME TEXT!') {
        memeText.textContent = 'GENERATE FIRST!';
        setTimeout(() => {
            memeText.textContent = '';
        }, 2000);
        return;
    }

    // Load html2canvas if not already loaded
    if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => captureAndDownload();
        document.head.appendChild(script);
    } else {
        captureAndDownload();
    }
}

function captureAndDownload() {
    html2canvas(memeCanvas, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'jobs-not-finished-meme.png';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });
    });
}

function createLaugh() {
    const response = laughResponses[Math.floor(Math.random() * laughResponses.length)];
    const laugh = document.createElement('div');
    laugh.className = 'laugh';
    laugh.textContent = response;
    
    const x = Math.random() * (window.innerWidth - 200);
    const y = window.innerHeight - 150;
    
    laugh.style.left = `${x}px`;
    laugh.style.top = `${y}px`;
    
    document.body.appendChild(laugh);
    
    setTimeout(() => {
        laugh.remove();
    }, 2000);
}

function animateTitle() {
    gsap.from(title, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "bounce.out"
    });
}

// Video Generator
function initVideoGenerator() {
    const canvas = document.getElementById('videoPreview');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const sourceVideo = document.getElementById('sourceVideo');
    const bgUpload = document.getElementById('bgUpload');
    const bgBtns = document.querySelectorAll('.bg-btn');
    const videoCaption = document.getElementById('videoCaption');
    const captionPosition = document.getElementById('captionPosition');
    const captionColor = document.getElementById('captionColor');
    const captionSize = document.getElementById('captionSize');
    const generateVideoBtn = document.getElementById('generateVideoBtn');
    const downloadVideoBtn = document.getElementById('downloadVideoBtn');
    const statusText = document.getElementById('statusText');

    let ffmpeg = null;
    let ffmpegLoaded = false;
    let generatedVideoBlob = null;

    // Load FFmpeg
    async function loadFFmpeg() {
        if (ffmpegLoaded) return;
        
        statusText.textContent = 'Loading FFmpeg...';
        
        try {
            const { FFmpeg } = await import('https://esm.sh/@ffmpeg/ffmpeg@0.12.10');
            const { toBlobURL } = await import('https://esm.sh/@ffmpeg/util@0.12.10');
            
            ffmpeg = new FFmpeg();
            
            ffmpeg.on('log', ({ message }) => {
                console.log(message);
            });

            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            ffmpegLoaded = true;
            statusText.textContent = 'FFmpeg ready!';
        } catch (error) {
            console.error('FFmpeg load error:', error);
            throw new Error('Failed to load FFmpeg modules. Ensure ES modules are supported.');
        }
    }

    // Set up source video
    sourceVideo.src = 'meme-video.mp4';
    sourceVideo.addEventListener('error', (e) => {
        console.error('Video load error:', e);
        statusText.textContent = 'Error: meme-video.mp4 not found. Please add the video file.';
    });

    // Background image
    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    bgImage.src = 'background-1.webp';

    // Background button handlers
    bgBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            bgBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            bgImage.src = btn.getAttribute('data-bg');
        });
    });

    // Custom background upload
    bgUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            bgImage.src = URL.createObjectURL(e.target.files[0]);
            bgBtns.forEach(b => b.classList.remove('active'));
        }
    });

    // Set up canvas when video loads
    sourceVideo.addEventListener('loadeddata', () => {
        const vidWidth = sourceVideo.videoWidth || 540;
        const vidHeight = sourceVideo.videoHeight || 960;
        canvas.width = vidWidth;
        canvas.height = vidHeight + 100;
        sourceVideo.play();
        renderPreview();
    });

    // Chroma key function
    function chromaKey(imageData) {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Detect green screen
            if (g > r + 80 && g > b + 80 && g > 40) {
                data[i + 3] = 0; // Set alpha to 0 (transparent)
            }
        }
    }

    // Render preview
    function renderPreview() {
        if (sourceVideo.readyState < 2) {
            requestAnimationFrame(renderPreview);
            return;
        }

        const captionHeight = 100;
        const videoHeight = canvas.height - captionHeight;
        const caption = videoCaption.value;
        const position = captionPosition.value;
        const color = captionColor.value;
        const size = parseInt(captionSize.value);

        // Draw caption area (white background)
        const captionY = position === 'top' ? 0 : videoHeight;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, captionY, canvas.width, captionHeight);

        // Draw caption text
        if (caption) {
            ctx.font = `${size}px 'HelveticaNeueMedium', 'Helvetica Neue', Arial, sans-serif`;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(caption, canvas.width / 2, captionY + captionHeight / 2);
        }

        // Draw background
        const videoY = position === 'top' ? captionHeight : 0;
        if (bgImage.complete && bgImage.naturalWidth > 0) {
            ctx.drawImage(bgImage, 0, videoY, canvas.width, videoHeight);
        } else {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, videoY, canvas.width, videoHeight);
        }

        // Draw video with chroma key
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = videoHeight;
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
        
        tempCtx.drawImage(sourceVideo, 0, 0, tempCanvas.width, tempCanvas.height);
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        chromaKey(imageData);
        tempCtx.putImageData(imageData, 0, 0);
        
        ctx.drawImage(tempCanvas, 0, videoY);

        requestAnimationFrame(renderPreview);
    }

    // Start preview
    renderPreview();

    // Generate video
    generateVideoBtn.addEventListener('click', async () => {
        try {
            await loadFFmpeg();
            console.log('FFmpeg loaded successfully');
            
            statusText.textContent = 'Recording canvas...';
            generateVideoBtn.disabled = true;

            // Capture canvas stream
            const stream = canvas.captureStream(30);

            // Try to add audio from the video
            try {
                const audioContext = new AudioContext();
                const source = audioContext.createMediaElementSource(sourceVideo);
                const destination = audioContext.createMediaStreamDestination();
                source.connect(destination);
                source.connect(audioContext.destination);
                
                if (destination.stream.getAudioTracks().length > 0) {
                    stream.addTrack(destination.stream.getAudioTracks()[0]);
                }
            } catch (audioError) {
                console.log('Audio not available:', audioError);
            }

            // Record with MediaRecorder
            const recorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9',
                videoBitsPerSecond: 5000000
            });

            const chunks = [];
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            const duration = sourceVideo.duration || 5;
            sourceVideo.currentTime = 0;
            
            recorder.start();

            await new Promise((resolve) => {
                setTimeout(() => {
                    recorder.stop();
                    recorder.onstop = resolve;
                }, duration * 1000);
            });

            const webmBlob = new Blob(chunks, { type: 'video/webm' });

            // Convert to MP4 with FFmpeg
            statusText.textContent = 'Converting to MP4...';

            const webmData = new Uint8Array(await webmBlob.arrayBuffer());
            await ffmpeg.writeFile('input.webm', webmData);

            await ffmpeg.exec([
                '-i', 'input.webm',
                '-c:v', 'libx264',
                '-preset', 'ultrafast',
                '-pix_fmt', 'yuv420p',
                '-profile:v', 'high',
                '-level', '4.0',
                '-c:a', 'aac',
                '-b:a', '128k',
                '-movflags', '+faststart',
                'output.mp4'
            ]);

            const mp4Data = await ffmpeg.readFile('output.mp4');
            generatedVideoBlob = new Blob([mp4Data.buffer], { type: 'video/mp4' });

            statusText.textContent = 'Video ready!';
            downloadVideoBtn.classList.remove('hidden');
            generateVideoBtn.disabled = false;

        } catch (error) {
            console.error('Video generation error:', error);
            statusText.textContent = `Error: ${error.message}. Retry.`;
            generateVideoBtn.disabled = false;
        }
    });

    // Download video
    downloadVideoBtn.addEventListener('click', () => {
        if (generatedVideoBlob) {
            const url = URL.createObjectURL(generatedVideoBlob);
            const link = document.createElement('a');
            link.download = 'jobs-not-finished-meme.mp4';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        }
    });
}
