const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ 
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
});

const status = document.getElementById('status');
const resultVideo = document.getElementById('resultVideo');
const promptInput = document.getElementById('prompt');

// 1. Function hanombohana ny motera
async function loadEngine() {
    if (!ffmpeg.isLoaded()) {
        status.innerText = "⏳ Mampiditra ny motera AI (Honor 8X Tooling)...";
        await ffmpeg.load();
    }
}

// 2. TEXT TO VIDEO
document.getElementById('txt-vid-btn').onclick = async () => {
    const text = promptInput.value;
    if (!text) { alert("Manorata zavatra aloha!"); return; }

    try {
        await loadEngine();
        status.innerText = "⚡ Eo am-pamoronana ny video-nao...";
        
        // Mamorona video cinematic tsotra
        await ffmpeg.run(
            '-f', 'lavfi', '-i', 'color=c=black:s=640x360:d=3', 
            '-vf', `drawtext=text='${text}':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=(h-text_h)/2`,
            'output.mp4'
        );

        showResult('output.mp4');
    } catch (e) {
        status.innerText = "❌ Hadisoana: " + e.message;
    }
};

// 3. IMAGE TO VIDEO
document.getElementById('img-input').onchange = async (e) => {
    const file = e.target.files[0];
    try {
        await loadEngine();
        status.innerText = "⚡ Manova sary ho video...";
        ffmpeg.FS('writeFile', 'input_img.png', await fetchFile(file));
        
        await ffmpeg.run('-loop', '1', '-i', 'input_img.png', '-t', '5', '-pix_fmt', 'yuv420p', 'output.mp4');
        
        showResult('output.mp4');
    } catch (err) { status.innerText = "❌ Diso: " + err.message; }
};

// 4. Mampiseho ny Video vita
async function showResult(fileName) {
    const data = ffmpeg.FS('readFile', fileName);
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    
    resultVideo.src = url;
    resultVideo.style.display = "block";
    status.innerText = "✅ Vita soa aman-tsara!";
    
    const dlBtn = document.getElementById('download-btn');
    dlBtn.style.display = "block";
    dlBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'n-cut-ai-video.mp4';
        a.click();
    };
        }
// Mampifandray ny bokotra GENERATE VIDEO
document.getElementById('generate-btn').onclick = async () => {
    const text = promptInput.value;
    if (!text) {
        alert("⚠️ Manorata hevitra na 'Prompt' ao amin'ny faritra fanoratana aloha!");
        return;
    }

    try {
        await loadEngine();
        status.innerText = "🚀 AI eo am-pamoronana ny video-nao (Miandry kely)...";
        
        // Ity baiko ity dia mamorona video avy amin'ny soratrao
        // Mampiasa resolution 640x360 ho an'ny Honor 8X
        await ffmpeg.run(
            '-f', 'lavfi', '-i', 'color=c=0x1e293b:s=640x360:d=4', 
            '-vf', `drawtext=text='${text}':fontcolor=white:fontsize=30:x=(w-text_w)/2:y=(h-text_h)/2:box=1:boxcolor=black@0.5`,
            'generated.mp4'
        );

        showResult('generated.mp4');
        status.innerText = "✅ Video vao namboarinao dia vonona!";
    } catch (e) {
        status.innerText = "❌ Hadisoana: " + e.message;
        alert("Nisy olana: " + e.message);
    }
};

// Function hanapahana video avy amin'ny finday (Local Video Edit)
async function handleLocalVideo(input) {
    const file = input.files[0];
    if(file) {
        status.innerText = "📁 Video avy ao amin'ny finday voafidy.";
        resultVideo.src = URL.createObjectURL(file);
        resultVideo.style.display = "block";
        // Eto dia mbola Preview fotsiny fa afaka asiana AI filter avy eo
    }
}
// Ity dia mampiasa ny API Google Translate maimaim-poana
async function translateToEnglish(text) {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=mg&tl=en&dt=t&q=${encodeURI(text)}`);
    const data = await res.json();
    return data[0][0][0]; // Ity no mamoaka ilay teny anglisy
}

// Avy eo, ao anatin'ny genBtn.onclick, soloy an'ity ny andalana voalohany:
const malagasyText = prompt.value;
const englishText = await translateToEnglish(malagasyText);
// Dia ilay englishText no alefa any amin'ny AI...
