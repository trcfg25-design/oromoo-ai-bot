const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// API Key kee kallattiidhaan bakka kanaan gadii kana jalatti galchi
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ reply: 'Gaaffiin (messages) sirriitti hin ergamne.' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY.trim()}`,
        'HTTP-Referer': 'https://bonsa-ai.onrender.com',
        'X-Title': 'Bonsa AI',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemma-2-9b-it:free',
        messages: messages
      })
    });

    const data = await response.json();

    if (response.ok && data.choices && data.choices[0]) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      const errorMsg = data.error ? data.error.message : 'API Response Error';
      res.status(response.status).json({ reply: `API Error: ${errorMsg}` });
    }
  } catch (error) {
    res.status(500).json({ reply: `Server Error: ${error.message}` });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
