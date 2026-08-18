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

    // Map models to DuckDuckGo supported models
    let ddgModel = 'gpt-4o-mini';
    if (model.includes('claude')) ddgModel = 'claude-3-haiku';
    if (model.includes('llama')) ddgModel = 'meta-llama/Llama-3-70b-instruct';
    if (model.includes('mixtral')) ddgModel = 'mistralai/Mixtral-8x7B-Instruct-v0.1';

    const statusRes = await fetch('https://duckduckgo.com/duckchat/v1/status', {
      headers: { 
        'x-vqd-accept': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    
    const vqdToken = statusRes.headers.get('x-vqd-4') || '';

    const response = await fetch('https://duckduckgo.com/duckchat/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vqd-4': vqdToken,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: JSON.stringify({ model: ddgModel, messages })
    });

    const rawText = await response.text();
    
    // Parse text stream directly on the backend
    let fullMessage = '';
    const lines = rawText.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') break;
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.message) {
            fullMessage += parsed.message;
          }
        } catch (e) {}
      }
    }

    res.json({ reply: fullMessage || 'Deebiin hin argamne.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
