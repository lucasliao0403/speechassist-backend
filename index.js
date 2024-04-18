const express = require('express');
const multer = require('multer');  
const app = express();
const port = 3000;

require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
    api_key: process.env.OPEN_AI_KEY,
});

// Configure multer for file upload handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ChatGPT endpoint
app.get('/chatgpt', async (req, res) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ 
            role: 'user', 
            content: 'Review this interview response to "What is your greatest weakness?": "My greatest weakness is that I am too smart"'
        }],
        model: 'gpt-3.5-turbo',
    });
    res.send(chatCompletion);
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Whisper endpoint for speech-to-text
app.post('/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
        audio_file: req.file.buffer,
        model: "whisper-large",
    });

    res.send(transcription);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
