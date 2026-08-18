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
    const { messages } = req.body;
    const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : '';

    if (!lastMsg) {
      return res.json({ reply: 'Mee gaaffii kee barreessi.' });
    }

    // Direct GET request to avoid 502 Bad Gateway
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(lastMsg)}?model=openai&seed=${Math.floor(Math.random() * 999)}`);
    
    if (!response.ok) {
      return res.json({ reply: 'Server-ni yeroof busy ta’eera, mee irra deebi\'ii yaali.' });
    }

    const replyText = await response.text();

    res.json({ reply: replyText || 'Deebiin hin argamne.' });
  } catch (error) {
    res.status(500).json({ reply: 'Dogoggorri uumameera, mee irra deebi\'ii yaali.' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
