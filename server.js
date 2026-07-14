require("dotenv").config();

const express = require("express");
const Replicate = require("replicate");

const app = express();

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

    let { prompt } = req.body;


    // Fanatsarana prompt ho an'ny olona Malagasy
    prompt = `
A realistic Malagasy person from Madagascar.
Natural Malagasy facial features.
Speaking fluent Malagasy language.
Cinematic realistic video.
High quality.
${prompt}
`;


    const output = await replicate.run(
      "minimax/video-01",
      {
        input: {
          prompt: prompt
        }
      }
    );


    res.json({
      success:true,
      video: output
    });


  } catch(error){

    res.json({
      success:false,
      error:error.message
    });

  }

});


app.listen(3000, ()=>{
 console.log("N-Cut AI Server running on port 3000");
});
