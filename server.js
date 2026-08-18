const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
        model: 'meta-llama/llama-3.2-1b-instruct:free',
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
