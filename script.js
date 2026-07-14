const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ 
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
});

const status = document.getElementById('status');
const resultVideo = document.getElementById('resultVideo');
const promptInput = document.getElementById('prompt');
const exportBtn = document.getElementById('export-btn');

// --- 1. REHEFA MIFIDY VIDEO ---
function handleVideoSelect(input) {
    const file = input.files[0];
    if (file) {
        resultVideo.src = URL.createObjectURL(file);
        resultVideo.style.display = "block";
        status.innerText = "Video efa voaray. Azonao tsindrina ny Generate.";
    }
}

// --- 2. REHEFA TSINDRINA NY TEXT TO VIDEO ---
async function handleTextToVideo() {
    const text = promptInput.value;
    if (!text) {
        alert("Manorata zavatra aloha!");
        return;
    }

    try {
        status.innerText = "⏳ Mampidira motera AI...";
        if (!ffmpeg.isLoaded()) await ffmpeg.load();

        status.innerText = "⚡ Eo am-pamoronana video...";
        
        await ffmpeg.run(
            '-f', 'lavfi', '-i', 'color=c=black:s=1280x720:d=5', 
            '-vf', `drawtext=text='${text}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2`,
            'tmp_video.mp4'
        );

        const data = ffmpeg.FS('readFile', 'tmp_video.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        
        showResult(url);
    } catch (e) {
        alert("Hadisoana: " + e.message);
    }
}

// --- 3. REHEFA MIFIDY SARY (IMAGE TO VIDEO) ---
async function handleImageSelect(input) {
    const file = input.files[0];
    if (!file) return;

    try {
        status.innerText = "⏳ Mampidira motera...";
        if (!ffmpeg.isLoaded()) await ffmpeg.load();

        status.innerText = "⚡ Manova sary ho video...";
        ffmpeg.FS('writeFile', 'img.png', await fetchFile(file));

        await ffmpeg.run('-loop', '1', '-i', 'img.png', '-t', '5', '-pix_fmt', 'yuv420p', 'img_video.mp4');

        const data = ffmpeg.FS('readFile', 'img_video.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        
        showResult(url);
    } catch (e) {
        alert("Hadisoana: " + e.message);
    }
}

// --- FANEHOANA NY VALINY ---
function showResult(url) {
    resultVideo.src = url;
    resultVideo.style.display = "block";
    exportBtn.style.display = "block";
    status.innerText = "✅ Vita soa aman-tsara!";
    
    exportBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'n-cut-ai.mp4';
        a.click();
    };
            }
