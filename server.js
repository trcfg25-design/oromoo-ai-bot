const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server axaana jira!');
});

app.post('/api/chat', async (req, res) => {
  try {
    const { model, messages } = req.body;

    const response = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messages,
        model: 'openai',
        seed: Math.floor(Math.random() * 9999)
      })
    });

    const replyText = await response.text();

    // Yoo deebiin JSON error ta'e dhiisanii ergaa qulqulluu erguu
    if (replyText.includes('PAYMENT_REQUIRED') || replyText.includes('402')) {
      return res.json({ reply: 'Gommanuun mudateera, irra deebi\'ii yaali.' });
    }

    res.json({ reply: replyText || 'Deebiin hin argamne.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
