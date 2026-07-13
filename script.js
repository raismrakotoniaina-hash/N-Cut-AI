
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ 
    log: true,
    mainName: 'main',
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
});

const videoInput = document.getElementById('video-input');
const resultVideo = document.getElementById('resultVideo');
const status = document.getElementById('status');
const processBtn = document.getElementById('process-btn');
const exportBtn = document.getElementById('export-btn');

let selectedFile;

// 1. Rehefa mifidy Video ny mpampiasa
videoInput.addEventListener('change', (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
        const url = URL.createObjectURL(selectedFile);
        resultVideo.src = url;
        resultVideo.style.display = "block";
        status.innerText = "Video vonona hotapahina!";
    }
});

// 2. Fampandehanana ny FFmpeg (Process)
processBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        alert("Misafidiana video aloha!");
        return;
    }

    status.innerText = "Mampiditra ny motera AI... Miandry kely...";
    
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    status.innerText = "Eo am-panodinana ny video (Processing)...";

    // Soratana ao amin'ny RAM an'ny browser ilay video
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(selectedFile));

    // Ohatra: Tapahina ho 5 segondra fotsiny ilay video
    // Azonao ovaina eto ny baiko (filters, etc.)
    await ffmpeg.run('-i', 'input.mp4', '-t', '5', 'output.mp4');

    status.innerText = "Vita soa aman-tsara!";

    // Vakiana ny valiny (Binary)
    const data = ffmpeg.FS('readFile', 'output.mp4');

    // Avadika URL azo ampiasaina
    const finishedUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    
    resultVideo.src = finishedUrl;
    
    // Mampiseho ny bokotra download
    exportBtn.style.display = "block";
    exportBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = finishedUrl;
        a.download = 'n-cut-output.mp4';
        a.click();
    };
});
