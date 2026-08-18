const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// API Key kee isa pottalii irraa fudhatte
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AQ.Ab8RN6Lwol723QhJho8gnogLmroeJu4CakBtjjZzzwygT_J1-Q';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY.trim() });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ reply: 'Gaaffiin sirriitti hin ergamne.' });
    }

    const lastUserMessage = messages[messages.length - 1].content;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: lastUserMessage,
    });

    if (response && response.text) {
      res.json({ reply: response.text });
    } else {
      res.status(500).json({ reply: 'Deebii argachuu hin dandaamne.' });
    }
  } catch (error) {
    res.status(500).json({ reply: `Server Error: ${error.message}` });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
