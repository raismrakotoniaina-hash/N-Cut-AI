require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Replicate = require("replicate");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/generate-video", async (req, res) => {

  try {

    let { prompt, avatar, language } = req.body;

    if (!prompt) {
      return res.json({
        success: false,
        error: "Tsy misy prompt"
      });
    }

    let finalPrompt = `
Realistic human video.
High quality cinematic style.
Natural facial features.
Professional AI presenter.

Avatar:
${avatar || "realistic person"}

Language:
${language || "Malagasy"}

Scene:
${prompt}
`;

    const output = await replicate.run(
      "minimax/video-01",
      {
        input: {
          prompt: finalPrompt
        }
      }
    );

    res.json({
      success: true,
      video: output
    });

    } catch(error) {

    console.log("Replicate Error:", error.message);

    if (
      error.message.includes("402") ||
      error.message.includes("Free time limit reached")
    ) {

      return res.json({
        success: true,
        demo: true,
        video: "demo-video.mp4",
        message: "N-Cut AI Demo Mode activated"
      });

    }

    res.json({
      success: false,
      error: error.message
    });

  }

});

app.listen(3000, () => {
  console.log("N-Cut AI Server running on port 3000");
});
