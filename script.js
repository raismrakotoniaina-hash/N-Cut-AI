// 1. Loading FFmpeg miaraka amina rafitra tsotra
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ 
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
});

const status = document.getElementById('status');
const resultVideo = document.getElementById('resultVideo');
const promptInput = document.getElementById('prompt');

// Function mpanampy hanehoana hafatra
function updateStatus(msg) {
    console.log(msg);
    status.innerText = msg;
}

// --- INITIALISATION ---
async function initFFmpeg() {
    if (!ffmpeg.isLoaded()) {
        try {
            updateStatus("⏳ Mampidira motera AI (Miandry kely)...");
            await ffmpeg.load();
            updateStatus("✅ Motera vonona!");
        } catch (e) {
            updateStatus("❌ Tsy mandeha ny motera: " + e.message);
            // Matetika dia SharedArrayBuffer no olana eto
            alert("Olana amin'ny Browser: Andramo sokafy amin'ny Chrome na Edge vao maika.");
        }
    }
}

// --- TEXT TO VIDEO ---
async function handleTextToVideo() {
    const text = promptInput.value;
    if (!text) {
        alert("Manorata soratra aloha!");
        return;
    }

    try {
        await initFFmpeg();
        updateStatus("⚡ Eo am-pamoronana video...");

        // Mamorona video cinematic tsotra
        await ffmpeg.run(
            '-f', 'lavfi', 
            '-i', 'color=c=black:s=640x360:d=3', // Nataoko kely ny resolution (360p) mba ho haingana
            '-vf', `drawtext=text='${text}':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=(h-text_h)/2`,
            'output_text.mp4'
        );

        const data = ffmpeg.FS('readFile', 'output_text.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        
        showResult(url);
    } catch (e) {
        updateStatus("❌ Error: " + e.message);
    }
}

function showResult(url) {
    resultVideo.src = url;
    resultVideo.style.display = "block";
    document.getElementById('export-btn').style.display = "block";
    document.getElementById('export-btn').onclick = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ncv-video.mp4';
        a.click();
    };
    updateStatus("✅ Vita soa aman-tsara!");
}
