const express = require('express');
const app = express();
const port = 3000;
const {parse, stringify, toJSON, fromJSON} = require('flatted');
require("dotenv").config()
const axios = require('axios') 

const {OpenAI} = require("openai")

const openai = new OpenAI({
    api_key: process.env.OPEN_AI_KEY,
  });

app.get('/chatgpt', async (req, res) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ 
        role: 'user', 
        content: 'Review this interview response to \"What is your greatest weakness?\": \"My greatest weakness is that I am too smart\""' }],
        model: 'gpt-3.5-turbo',
        max_tokens: 100,
    });
    

    res.send(chatCompletion);
  } catch(e) {
    // catch errors and send error status
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
        model: "whisper-large", //whisper models
    });

    res.send(transcription);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Interview-Assistant listening at http://localhost:${port}`);
});
