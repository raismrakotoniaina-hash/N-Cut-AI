require("dotenv").config();

const express = require("express");
const Replicate = require("replicate");

const app = express();

app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.get("/", (req, res) => {
  res.send("N Cut AI Server is running");
});

app.post("/generate-video", async (req, res) => {
  try {
    const { prompt } = req.body;

    const output = await replicate.run(
      "minimax/video-01",
      {
        input: {
          prompt: prompt
        }
      }
    );

    res.json({
      success: true,
      video: output
    });

  } catch (error) {

    res.json({
      success: false,
      error: error.message
    });

  }
});

app.listen(3000, () => {
  console.log("N Cut AI Server running on port 3000");
});
