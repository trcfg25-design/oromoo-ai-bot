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
    
    // Ergaa xumuraa fuudhuu
    const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : '';

    if (!lastMsg) {
      return res.json({ reply: 'Mee gaaffii kee barreessi.' });
    }

    // Pollinations Text API (100% Free & No Blocking)
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(lastMsg)}`);
    const replyText = await response.text();

    res.json({ reply: replyText || 'Deebiin hin argamne.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
