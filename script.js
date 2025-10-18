(function() {
    'use strict';
    
    const LAUGH_RESPONSES = [
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

    const getRandomItem = arr => arr[Math.floor(Math.random() * arr.length)];

    const createLaugh = () => {
        const laugh = document.createElement('div');
        laugh.className = 'laugh';
        laugh.textContent = getRandomItem(LAUGH_RESPONSES);
        laugh.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
        laugh.style.top = `${window.innerHeight - 150}px`;
        document.body.appendChild(laugh);
        setTimeout(() => laugh.remove(), 2000);
    };

    const animateTitle = () => {
        gsap.from('#title', {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: "bounce.out"
        });
    };

    const initImageGenerator = () => {
        const generateBtn = document.getElementById('generateBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const userInput = document.getElementById('userInput');
        const memeText = document.getElementById('memeText');
        const memeCanvas = document.getElementById('memeCanvas');

        const generateMeme = () => {
            const text = userInput.value.trim();
            
            if (text) {
                memeText.textContent = text.toUpperCase();
                gsap.from(memeText, {
                    y: -20,
                    opacity: 0,
                    duration: 0.5,
                    ease: "back.out"
                });
                createLaugh();
            } else {
                memeText.textContent = 'ENTER SOME TEXT!';
                setTimeout(() => memeText.textContent = '', 2000);
            }
        };

        const downloadMeme = () => {
            const text = memeText.textContent;
            
            if (!text || text === 'ENTER SOME TEXT!') {
                memeText.textContent = 'GENERATE FIRST!';
                setTimeout(() => memeText.textContent = '', 2000);
                return;
            }

            if (!window.html2canvas) {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                script.onload = () => captureAndDownload(memeCanvas);
                document.head.appendChild(script);
            } else {
                captureAndDownload(memeCanvas);
            }
        };

        const captureAndDownload = (element) => {
            html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'jobs-not-finished-meme.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(err => {
                console.error('Download failed:', err);
                memeText.textContent = 'DOWNLOAD FAILED!';
                setTimeout(() => memeText.textContent = text, 2000);
            });
        };

        generateBtn.addEventListener('click', generateMeme);
        downloadBtn.addEventListener('click', downloadMeme);
        userInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') generateMeme();
        });
    };

    const initVideoGenerator = () => {
        const canvas = document.getElementById('videoPreview');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const bgUpload = document.getElementById('bgUpload');
        const bgDefault1 = document.getElementById('bgDefault1');
        const bgDefault2 = document.getElementById('bgDefault2');
        const videoCaption = document.getElementById('videoCaption');
        const captionPosition = document.getElementById('captionPosition');
        const captionColor = document.getElementById('captionColor');
        const captionSize = document.getElementById('captionSize');
        const generateVideoBtn = document.getElementById('generateVideoBtn');
        const downloadVideoBtn = document.getElementById('downloadVideoBtn');
        const renderStatus = document.getElementById('renderStatus');

        let ffmpeg = null;
        let ffmpegLoaded = false;
        let generatedVideoBlob = null;

        const loadFFmpeg = async () => {
            if (ffmpegLoaded) return;
            
            renderStatus.textContent = 'Loading FFmpeg...';
            
            try {
                const { FFmpeg } = await import('https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/+esm');
                const { toBlobURL } = await import('https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.10/+esm');
                
                ffmpeg = new FFmpeg();
                ffmpeg.on('log', ({ message }) => console.log(message));

                const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd';
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
                });

                ffmpegLoaded = true;
                renderStatus.textContent = 'FFmpeg ready!';
            } catch (error) {
                console.error('FFmpeg load error:', error);
                throw new Error('FFmpeg import failed. Check ES modules support.');
            }
        };

        const sourceVideo = document.createElement('video');
        sourceVideo.src = 'meme-video.mp4';
        sourceVideo.loop = true;
        sourceVideo.muted = true;
        sourceVideo.playsInline = true;
        sourceVideo.crossOrigin = 'anonymous';
        sourceVideo.addEventListener('error', () => {
            console.error('Video load error');
            renderStatus.textContent = 'Failed to load meme-video.mp4';
        });

        const backgroundImage = new Image();
        backgroundImage.crossOrigin = 'anonymous';
        backgroundImage.src = 'background-1.webp';

        bgDefault1.addEventListener('click', () => backgroundImage.src = 'background-1.webp');
        bgDefault2.addEventListener('click', () => backgroundImage.src = 'background-2.png');
        bgUpload.addEventListener('change', e => {
            if (e.target.files?.[0]) {
                backgroundImage.src = URL.createObjectURL(e.target.files[0]);
            }
        });

        sourceVideo.addEventListener('loadeddata', () => {
            const captionHeight = 100;
            canvas.width = sourceVideo.videoWidth || 540;
            canvas.height = (sourceVideo.videoHeight || 960) + captionHeight;
            sourceVideo.play();
            renderPreview();
        });

        const chromaKey = (imageData) => {
            const data = imageData.data;
            const threshold = 80;
            const sensitivity = 40;
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                if (g > r + threshold && g > b + threshold && g > sensitivity) {
                    data[i + 3] = 0;
                }
            }
            
            return imageData;
        };

        const renderPreview = () => {
            if (sourceVideo.readyState < 2) {
                requestAnimationFrame(renderPreview);
                return;
            }

            const captionHeight = 100;
            const videoHeight = canvas.height - captionHeight;
            const caption = videoCaption.value;
            const position = captionPosition.value;
            const color = captionColor.value;
            const size = parseInt(captionSize.value, 10);

            const captionY = position === 'top' ? 0 : videoHeight;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, captionY, canvas.width, captionHeight);

            if (caption) {
                ctx.font = `${size}px 'HelveticaNeueMedium', 'Helvetica Neue', Arial, sans-serif`;
                ctx.fillStyle = color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(caption, canvas.width / 2, captionY + captionHeight / 2);
            }

            const videoY = position === 'top' ? captionHeight : 0;
            if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
                ctx.drawImage(backgroundImage, 0, videoY, canvas.width, videoHeight);
            } else {
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, videoY, canvas.width, videoHeight);
            }

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = videoHeight;
            const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
            
            tempCtx.drawImage(sourceVideo, 0, 0, tempCanvas.width, tempCanvas.height);
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const processed = chromaKey(imageData);
            tempCtx.putImageData(processed, 0, 0);
            ctx.drawImage(tempCanvas, 0, videoY);

            requestAnimationFrame(renderPreview);
        };

        generateVideoBtn.addEventListener('click', async () => {
            try {
                await loadFFmpeg();
                console.log('FFmpeg loaded successfully');
                
                renderStatus.textContent = 'Recording canvas...';
                generateVideoBtn.disabled = true;

                const stream = canvas.captureStream(30);

                try {
                    const audioContext = new AudioContext();
                    const source = audioContext.createMediaElementSource(sourceVideo);
                    const destination = audioContext.createMediaStreamDestination();
                    source.connect(destination);
                    source.connect(audioContext.destination);
                    
                    const audioTrack = destination.stream.getAudioTracks()[0];
                    if (audioTrack) stream.addTrack(audioTrack);
                } catch (audioError) {
                    console.log('Audio not available:', audioError);
                }

                const recorder = new MediaRecorder(stream, {
                    mimeType: 'video/webm;codecs=vp9',
                    videoBitsPerSecond: 5000000
                });

                const chunks = [];
                recorder.ondataavailable = e => {
                    if (e.data.size > 0) chunks.push(e.data);
                };

                const duration = sourceVideo.duration || 5;
                sourceVideo.currentTime = 0;
                recorder.start();

                await new Promise(resolve => {
                    setTimeout(() => {
                        recorder.stop();
                        recorder.onstop = resolve;
                    }, duration * 1000);
                });

                const webmBlob = new Blob(chunks, { type: 'video/webm' });

                renderStatus.textContent = 'Converting to MP4...';

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

                renderStatus.textContent = 'Video ready!';
                downloadVideoBtn.classList.remove('hidden');
                generateVideoBtn.disabled = false;

            } catch (error) {
                console.error('Video generation error:', error);
                renderStatus.textContent = `Error: ${error.message}. Retry.`;
                generateVideoBtn.disabled = false;
            }
        });

        downloadVideoBtn.addEventListener('click', () => {
            if (generatedVideoBlob) {
                const url = URL.createObjectURL(generatedVideoBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'jobs-not-finished-meme.mp4';
                link.click();
                URL.revokeObjectURL(url);
            }
        });

        renderPreview();
    };

    const initTabs = () => {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const imageTab = document.getElementById('imageTab');
        const videoTab = document.getElementById('videoTab');
        let videoInitialized = false;

        const switchTab = (targetTab) => {
            tabBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === targetTab);
            });

            if (targetTab === 'imageTab') {
                imageTab.classList.remove('hidden');
                videoTab.classList.add('hidden');
            } else {
                imageTab.classList.add('hidden');
                videoTab.classList.remove('hidden');
                
                if (!videoInitialized) {
                    videoInitialized = true;
                    initVideoGenerator();
                }
            }
        };

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
        animateTitle();
        initImageGenerator();
        initTabs();
    });
})();
