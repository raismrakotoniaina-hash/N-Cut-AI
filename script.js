// 1. Manomboka ny Motera FFmpeg
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ 
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
});

// 2. Mampifandray ireo Elements amin'ny HTML
const status = document.getElementById('status');
const resultVideo = document.getElementById('resultVideo');
const promptInput = document.getElementById('prompt');
const exportBtn = document.getElementById('export-btn');

// --- FONCTION A: TEXT TO VIDEO (Mamadika soratra ho Video) ---
async function textToVideo() {
    const text = promptInput.value;
    if (!text) {
        status.innerText = "⚠️ Manorata hevitra ao amin'ny TEXTAREA aloha!";
        return;
    }

    try {
        if (!ffmpeg.isLoaded()) {
            status.innerText = "⏳ Mampidira motera AI...";
            await ffmpeg.load();
        }

        status.innerText = "⚡ AI eo am-pamoronana video avy amin'ny soratrao...";
        
        // Mamorona video cinematic mainty misy ny soratrao (5 segondra)
        await ffmpeg.run(
            '-f', 'lavfi', '-i', 'color=c=black:s=1280x720:d=5', 
            '-vf', `drawtext=text='${text}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2`,
            'text_video.mp4'
        );

        const data = ffmpeg.FS('readFile', 'text_video.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        
        resultVideo.src = url;
        resultVideo.style.display = "block";
        exportBtn.style.display = "block";
        status.innerText = "✅ Video AI vita sonia!";
        
        exportBtn.onclick = () => downloadVideo(url);
    } catch (e) {
        status.innerText = "❌ Hadisoana: " + e.message;
    }
}

// --- FONCTION B: IMAGE TO VIDEO (Mamadika sary ho Video) ---
async function imageToVideo(imageFile) {
    try {
        if (!ffmpeg.isLoaded()) {
            status.innerText = "⏳ Mampidira motera AI...";
            await ffmpeg.load();
        }

        status.innerText = "⚡ Eo am-panovana ny sary ho Video...";
        ffmpeg.FS('writeFile', 'input_img.png', await fetchFile(imageFile));

        // Mamadika sary ho video 5 segondra
        await ffmpeg.run('-loop', '1', '-i', 'input_img.png', '-t', '5', '-pix_fmt', 'yuv420p', 'output_img.mp4');

        const data = ffmpeg.FS('readFile', 'output_img.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        
        resultVideo.src = url;
        resultVideo.style.display = "block";
        exportBtn.style.display = "block";
        status.innerText = "✅ Sary novana ho Video vita!";
        
        exportBtn.onclick = () => downloadVideo(url);
    } catch (e) {
        status.innerText = "❌ Hadisoana: " + e.message;
    }
}

// --- FONCTION C: DOWNLOAD ---
function downloadVideo(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'n-cut-ai-video.mp4';
    a.click();
}

// --- MAMPANDEHA NY BOKOTRA REHETRA ---

// Bokotra Text to Video
document.getElementById('text-to-video-btn').onclick = textToVideo;

// Bokotra Image to Video (Mampiseho safidy sary)
document.getElementById('image-to-video-btn').onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => imageToVideo(e.target.files[0]);
    input.click();
};

// Bokotra Generate (General Process)
document.getElementById('process-btn').onclick = textToVideo;
