require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { fal } = require("@fal-ai/client");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

fal.config({
  credentials: process.env.FAL_KEY
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


app.post("/generate-video", async (req, res) => {

  try {

    let { prompt, avatar, language } = req.body;

    if (!prompt) {
      return res.json({
        success:false,
        error:"Tsy misy prompt"
      });
    }


    const result = await fal.subscribe(
      "fal-ai/kling-video/v3/standard/text-to-video",
      {
        input:{
          prompt: `
Realistic cinematic video.
Professional AI presenter.
Natural human movement.
Language: ${language || "Malagasy"}.
Avatar: ${avatar || "realistic person"}.

Scene:
${prompt}
`,
          duration:"5",
          aspect_ratio:"16:9"
        }
      }
    );


    console.log("KLING OUTPUT:", result);


    res.json({
      success:true,
      video: result.data.video.url
    });


  } catch(error){

    console.log("Kling Error:", error.message);

    res.json({
      success:false,
      error:error.message
    });

  }

});


app.listen(3000, ()=>{
 console.log("N-Cut AI Kling Server running");
});
