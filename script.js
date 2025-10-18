document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const userInput = document.getElementById('userInput');
    const memeText = document.getElementById('memeText');
    const memeCanvas = document.getElementById('memeCanvas');
    const laughTrack = document.getElementById('laughTrack');
    const title = document.getElementById('title');

    // Laugh responses
    const laughResponses = [
        "HAHAHA! What a terrible meme!",
        "LOL that's the worst meme ever!",
        "ROFL! Even a boomer makes better memes!",
        "LMAO! That's going straight to cringe compilation!",
        "HA! Did you just discover memes yesterday?",
        "BWAHAHA! Pure garbage meme!",
        "HEE HEE! That's hilariously bad!",
        "HOHOHO! Santa wouldn't even share that meme!",
        "*wheeze* I can't breathe, that meme is so bad!",
        "TEE HEE! What a joke of a meme!"
    ];

    // Button click events
    generateBtn.addEventListener('click', generateMeme);
    downloadBtn.addEventListener('click', downloadMeme);

    // Also generate on Enter key
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateMeme();
        }
    });

    const tabs = document.querySelectorAll('.tab-btn');
    const imageTab = document.getElementById('imageTab');
    const videoTab = document.getElementById('videoTab');
    tabs.forEach(btn=>btn.addEventListener('click',()=>switchTab(btn.dataset.tab)));
    function switchTab(id){ 
        tabs.forEach(b=>b.classList.toggle('active',b.dataset.tab===id)); 
        imageTab.classList.toggle('hidden',id!=='imageTab'); 
        videoTab.classList.toggle('hidden',id!=='videoTab');
        if(id === 'videoTab' && !window.__videoInit) {
            initVideoGenerator();
            window.__videoInit = true;
        }
    }

    function generateMeme() {
        const userIdea = userInput.value.trim();

        if (userIdea) {
            memeText.textContent = userIdea; 
            gsap.from(memeText, {
                y: -20,
                opacity: 0,
                duration: 0.5,
                ease: "back.out"
            });

            // Add laugh responses
            createLaugh();
        } else {
            memeText.textContent = "Enter some text first, jobs not finished master"; 
            setTimeout(() => {
                memeText.textContent = "";
            }, 2000);
        }
    }

    function downloadMeme() {
        if (memeText.textContent && memeText.textContent !== "Enter some text first, jobs not finished master") {
            // Use html2canvas to capture the meme (load from CDN)
            const script = document.createElement('script');
            script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
            script.onload = function() {
                html2canvas(memeCanvas).then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'jobs-not-finished-meme.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                });
            };
            document.head.appendChild(script);
        } else {
            memeText.textContent = "Make a meme first, jobs not finished lord"; 
            setTimeout(() => {
                memeText.textContent = "";
            }, 2000);
        }
    }

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function createLaugh() {
        const laugh = document.createElement('div');
        laugh.className = 'laugh';
        laugh.textContent = getRandomItem(laughResponses);

        // Random position
        const x = Math.random() * (window.innerWidth - 200);
        const y = window.innerHeight - 150;

        laugh.style.left = `${x}px`;
        laugh.style.top = `${y}px`;

        document.body.appendChild(laugh);

        // Remove after animation completes
        setTimeout(() => {
            laugh.remove();
        }, 2000);
    }

    // Video Generator
    function initVideoGenerator() {
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

        // Load FFmpeg
        let ffmpeg = null;
        let ffmpegLoaded = false;

        async function loadFFmpeg() {
            if (ffmpegLoaded) return;
            
            renderStatus.textContent = 'Loading video encoder...';
            
            // Load FFmpeg from CDN
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js';
            document.head.appendChild(script);
            
            await new Promise((resolve) => {
                script.onload = resolve;
            });
            
            const coreScript = document.createElement('script');
            coreScript.src = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js';
            document.head.appendChild(coreScript);
            
            await new Promise((resolve) => {
                coreScript.onload = resolve;
            });
            
            // Access FFmpeg from global window object after scripts load
            const { FFmpeg } = window.FFmpegWASM || window;
            ffmpeg = new FFmpeg();
            
            ffmpeg.on('log', ({ message }) => {
                console.log(message);
            });
            
            await ffmpeg.load({
                coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
                wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm'
            });
            
            ffmpegLoaded = true;
            renderStatus.textContent = 'Video encoder ready!';
        }

        // Hidden video element for loading source
        const sourceVideo = document.createElement('video');
        sourceVideo.src = 'meme-video.mp4';
        sourceVideo.loop = true;
        sourceVideo.muted = true;
        sourceVideo.playsInline = true;
        sourceVideo.crossOrigin = 'anonymous';

        let backgroundImage = new Image();
        backgroundImage.crossOrigin = 'anonymous';
        let generatedVideoBlob = null;

        // Load default background
        backgroundImage.src = 'background-1.webp';
        
        bgDefault1.onclick = () => {
            backgroundImage.src = 'background-1.webp';
        };
        
        bgDefault2.onclick = () => {
            backgroundImage.src = 'background-2.png';
        };
        
        bgUpload.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                backgroundImage.src = URL.createObjectURL(file);
            }
        };

        // Start video preview
        sourceVideo.addEventListener('loadeddata', () => {
            const captionBarHeight = 100;
            canvas.width = sourceVideo.videoWidth || 540;
            canvas.height = (sourceVideo.videoHeight || 960) + captionBarHeight;
            sourceVideo.play();
            renderPreview();
        });

        function chromaKey(imageData) {
            const data = imageData.data;
            const threshold = 80;
            const sensitivity = 40;
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                // Green screen detection
                if (g > r + threshold && g > b + threshold && g > sensitivity) {
                    data[i + 3] = 0; // Make transparent
                }
            }
            return imageData;
        }

        function renderPreview() {
            if (sourceVideo.readyState < 2) {
                requestAnimationFrame(renderPreview);
                return;
            }

            const captionBarHeight = 100;
            const videoHeight = canvas.height - captionBarHeight;

            // Draw white caption bar at top
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, captionBarHeight);

            // Draw caption text if present
            const caption = videoCaption.value;
            if (caption) {
                ctx.font = `${captionSize.value}px HelveticaNeueMedium, Arial, sans-serif`;
                ctx.fillStyle = captionColor.value;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                ctx.fillText(caption, canvas.width / 2, captionBarHeight / 2);
            }

            // Draw background below caption bar
            if (backgroundImage.complete) {
                ctx.drawImage(backgroundImage, 0, captionBarHeight, canvas.width, videoHeight);
            } else {
                ctx.fillStyle = '#000';
                ctx.fillRect(0, captionBarHeight, canvas.width, videoHeight);
            }

            // Draw video with chroma key
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = videoHeight;
            const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
            
            tempCtx.drawImage(sourceVideo, 0, 0, canvas.width, videoHeight);
            const imageData = tempCtx.getImageData(0, 0, canvas.width, videoHeight);
            const processedData = chromaKey(imageData);
            tempCtx.putImageData(processedData, 0, 0);
            
            ctx.drawImage(tempCanvas, 0, captionBarHeight);

            requestAnimationFrame(renderPreview);
        }

        generateVideoBtn.onclick = async () => {
            try {
                await loadFFmpeg();
                
                renderStatus.textContent = 'Recording video...';
                generateVideoBtn.disabled = true;

                const stream = canvas.captureStream(30);
                
                // Get audio from source video if available
                let audioTrack = null;
                try {
                    const audioContext = new AudioContext();
                    const source = audioContext.createMediaElementSource(sourceVideo);
                    const destination = audioContext.createMediaStreamDestination();
                    source.connect(destination);
                    source.connect(audioContext.destination);
                    audioTrack = destination.stream.getAudioTracks()[0];
                    if (audioTrack) {
                        stream.addTrack(audioTrack);
                    }
                } catch (e) {
                    console.log('No audio track available');
                }

                const recorder = new MediaRecorder(stream, { 
                    mimeType: 'video/webm;codecs=vp9',
                    videoBitsPerSecond: 5000000
                });
                const chunks = [];

                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.push(e.data);
                };

                const duration = sourceVideo.duration || 5;
                
                sourceVideo.currentTime = 0;
                recorder.start();
                
                await new Promise(resolve => setTimeout(resolve, duration * 1000));
                
                recorder.stop();

                await new Promise(resolve => {
                    recorder.onstop = () => resolve();
                });

                const webmBlob = new Blob(chunks, { type: 'video/webm' });
                
                renderStatus.textContent = 'Converting to MP4 (H.264)...';
                
                // Convert WebM to MP4 using FFmpeg
                const webmData = new Uint8Array(await webmBlob.arrayBuffer());
                await ffmpeg.writeFile('input.webm', webmData);
                
                // FFmpeg command for QuickTime-compatible MP4
                // -c:v libx264: H.264 video codec
                // -preset fast: encoding speed
                // -pix_fmt yuv420p: pixel format for compatibility
                // -profile:v high -level 4.0: H.264 profile settings
                // -c:a aac: AAC audio codec
                // -b:a 128k: audio bitrate
                // -movflags +faststart: move moov atom to start for web streaming
                await ffmpeg.exec([
                    '-i', 'input.webm',
                    '-c:v', 'libx264',
                    '-preset', 'fast',
                    '-pix_fmt', 'yuv420p',
                    '-profile:v', 'high',
                    '-level', '4.0',
                    '-c:a', 'aac',
                    '-b:a', '128k',
                    '-movflags', '+faststart',
                    'output.mp4'
                ]);
                
                const mp4Data = await ffmpeg.readFile('output.mp4');
                const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });
                generatedVideoBlob = mp4Blob;

                renderStatus.textContent = 'MP4 ready for download!';
                downloadVideoBtn.classList.remove('hidden');
                generateVideoBtn.disabled = false;
            } catch (error) {
                console.error('Error generating video:', error);
                renderStatus.textContent = 'Error generating video. Please try again.';
                generateVideoBtn.disabled = false;
            }
        };

        downloadVideoBtn.onclick = () => {
            if (generatedVideoBlob) {
                const url = URL.createObjectURL(generatedVideoBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'jobs-not-finished-meme.mp4';
                a.click();
                URL.revokeObjectURL(url);
            }
        };
    }

    animateTitle();
});

function animateTitle() {
    gsap.from(title, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "bounce.out"
    });
}