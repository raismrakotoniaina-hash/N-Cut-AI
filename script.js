
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ 
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
});

// Ireo bokotra sy element
const videoInput = document.getElementById('video-input');
const resultVideo = document.getElementById('resultVideo');
const status = document.getElementById('status');
const processBtn = document.getElementById('process-btn');

let selectedFile;

// Rehefa mifidy video
videoInput.addEventListener('change', (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
        resultVideo.src = URL.createObjectURL(selectedFile);
        resultVideo.style.display = "block";
        status.innerText = "Video efa vonona ho an'ny AI.";
    }
});

// Rehefa tsindrina ny Generate
processBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        status.innerText = "⚠️ Mampidira video aloha!";
        return;
    }

    try {
        if (!ffmpeg.isLoaded()) {
            status.innerText = "⏳ Mampidira motera AI (Miandry kely)...";
            await ffmpeg.load();
        }

        status.innerText = "⚡ Eo am-panodinana ny AI Video...";
        
        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(selectedFile));
        
        // Eto isika no hametraka ny AI filters any aoriana
        await ffmpeg.run('-i', 'input.mp4', '-t', '5', 'output.mp4');

        const data = ffmpeg.FS('readFile', 'output.mp4');
        const finishedUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        
        resultVideo.src = finishedUrl;
        document.getElementById('export-btn').style.display = "block";
        status.innerText = "✅ Vita soa aman-tsara!";
    } catch (e) {
        console.error(e);
        status.innerText = "❌ Nisy olana: " + e.message;
    }
});
