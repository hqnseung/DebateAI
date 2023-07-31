const express = require('express');
const app = express();
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");
const serverless = require("serverless-http")

app.use(cors({
    origin: "https://hanseung.pages.dev",
    credentials: true   
}));
  
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

let chatHistory = [];

app.post('/debate', async function (req, res) {
    const topic = req.body.topic;
    const userMessage = req.body.userMessage;

    const messages = [
        { role: "system", content: "You are about to engage in a competitive debate with me.In a competitive debate, you're divided into two sides, one for and one against, and you argue your point of view and counter the other's logic to win or lose." },
        { role: "user", content: `You are about to engage in a competitive debate with me. In a competitive debate, you're divided into two sides, one for and one against, and you argue your point of view and counter the other's logic to win or lose.` },
        { role: "assistant", content: `Great! I'm ready to engage in a competitive debate with you. Please let me know the topic we will be debating and which side you would like to take.` },
        { role: "user", content: `You are about to engage in a competitive debate with me.

        In a competitive debate, you're divided into two sides, one for and one against, and you argue your point of view and counter the other's logic to win or lose.
        
        
        - Topic: '${topic}'
        
        - If I'm pro-position, you're anti-position, and if I'm anti-position, you're pro-position.
        
        - You must answer in Korean
        
        - Just answer, don't prefix it with something like "나: ".
        
        Now, let's start the debate. I'll start with my side of the argument.
        
        
        Me: ${userMessage}
        
        
        You :`},
        // 이전 대화 메시지 추가
        ...chatHistory.map((message) => ({ role: message.role, content: message.content })),
    ];

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
        });
        const result = completion.data.choices[0].message.content;
        console.log(result);

        // 새로운 대화 기록 추가
        chatHistory.push({ role: "user", content: userMessage });
        chatHistory.push({ role: "assistant", content: result });

        res.json({
            assistantReply: result,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'An error occurred while processing the request.',
        });
    }
});

module.exports.handler = serverless(app) 