const express = require('express');
const app = express();
const port = 3000;
const {parse, stringify, toJSON, fromJSON} = require('flatted');
require("dotenv").config()
const axios = require('axios') 

const {Configuration, OpenAIApi} = require("openai")

const config = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
})

const openai = new OpenAIApi(config)

app.get('/', async (req, res) => {
  try {
    const response = await openai.createCompletion({
        model:"gpt-4-turbo",
        prompt:"what is 11 plus 14",

    });
    

    res.send(result);
  } catch(e) {
    // catch errors and send error status
    console.log(e);
    res.sendStatus(500);
}
  
});

app.listen(port, () => {
  console.log(`DMOJ-Assistant listening at http://localhost:${port}`);
});
