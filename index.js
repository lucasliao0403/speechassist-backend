const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const app = express();
const port = 3000;

require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
    api_key: process.env.OPEN_AI_KEY,
});

// Configure multer for file upload handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, "audio.wav");
    },
  });
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
        max_tokens: 100,
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
  
  // TODO: read file

  try {
    const file = fs.createReadStream('./uploads/audio.wav');
    const transcript = await transcribe(file);

    // console.log(transcript);
    res.send(transcript)
  } catch (e) {
      console.log(e);
      res.sendStatus(500);
  }
});

async function transcribe(file) {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        file,
        model: 'whisper-1'
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
  
    return response.data.text;
  }
  


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
