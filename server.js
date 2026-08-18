const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// API Key guutuu copy goote sana asitti paste godhi:
const OPENROUTER_API_KEY = "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"; 

app.get('/', (req, res) => {
  res.send('Server nagaadhan hojjechaa jira!');
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-1b-instruct:free',
        messages: messages
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.json({ reply: 'Deebii argachuun hin danda\'amne.' });
    }
  } catch (error) {
    res.status(500).json({ reply: 'Dogoggorri uumameera, mee irra deebi\'ii yaali.' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
