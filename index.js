import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import systemInstruction from './systemPrompt.js';

const app = express()
const port = process.env.APP_PORT

const apiKey = process.env.GEMINI_API_KEY
const model = process.env.GEMINI_MODEL
const temperature = process.env.GEMINI_TEMPERATURE

const ai = new GoogleGenAI({
    apiKey
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;
    try {
        if (!Array.isArray(conversation)) {
            throw new Error('Invalid conversation format');
        }

        const contents = conversation.map(({ role, text }) => ({
            role,
            parts: [{ text }],
        }));

        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                temperature: temperature,
                systemInstruction,
            },
        });

        res.status(200).json({
            result: response.text,
        });
    } catch (e) {
        res.status(500).json({
            error: e.message,
        });
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
