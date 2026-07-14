const status = document.getElementById("status");
const resultVideo = document.getElementById("resultVideo");
const promptInput = document.getElementById("prompt");
const genBtn = document.getElementById("generate-btn");

genBtn.onclick = async () => {
    const prompt = promptInput.value;

    if (!prompt) {
        alert("Manorata hevitra aloha!");
        return;
    }

    genBtn.disabled = true;
    status.innerText = "🚀 N-Cut AI mamorona video...";

    try {
        const response = await fetch("/generate-video", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        const data = await response.json();

        if (data.success) {
            status.innerText = "✅ Vita ny video!";

            resultVideo.src = data.video;
            resultVideo.style.display = "block";

        } else {
            throw new Error(data.error);
        }

    } catch (error) {
        status.innerText = "❌ Olana: " + error.message;
    }

    genBtn.disabled = false;
};
