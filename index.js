const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const cors = require('cors'); // Require CORS package
const app = express();
const port = 3000;

require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
    api_key: process.env.OPEN_AI_KEY,
});

app.use(express.json());


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

// Enable CORS for all routes, or customize per route as needed
app.use(cors({
  origin: 'http://localhost:3001',  // Adjust this if you're serving the front-end from other locations
  credentials: true
}));

// ChatGPT endpoint
app.post('/chatgpt', async (req, res) => {
  try {
    const transcript = req.body.transcript;
    const prompt = req.body.prompt
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ 
            role: 'user', 
            content: "Respond within 5 sentences. Respond using the same language as the user's reponse. You are reviewing my response to this interview question:" + prompt + "User response:" + transcript
        }],
        model: 'gpt-4-turbo',
        max_tokens: 250,
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
  
  // Read file
  try {
    const file = fs.createReadStream('./uploads/audio.wav');
    const transcript = await transcribe(file);
    res.send(transcript);
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
