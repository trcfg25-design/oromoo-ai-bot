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

    const statusRes = await fetch('https://duckduckgo.com/duckchat/v1/status', {
      headers: { 'x-vqd-accept': '1' }
    });
    const vqdToken = statusRes.headers.get('x-vqd-4') || '';

    const response = await fetch('https://duckduckgo.com/duckchat/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-vqd-4': vqdToken
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.text();
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
