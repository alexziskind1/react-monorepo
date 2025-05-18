const express = require('express');

const app = express();
const port = process.env.PORT || 3333;
const API_KEY = process.env.YOUTUBE_API_KEY;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

function extractVideoId(url) {
  try {
    if (!url) return null;
    const u = new URL(url);
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1);
    }
    if (u.searchParams.get('v')) {
      return u.searchParams.get('v');
    }
    const match = u.pathname.match(/\/v\/([^/?]+)/);
    if (match) return match[1];
  } catch (e) {
    return null;
  }
  return null;
}

app.get('/api/comments', async (req, res) => {
  const { url } = req.query;
  const videoId = req.query.videoId || extractVideoId(url);
  if (!videoId) {
    return res.status(400).json({ error: 'No video id provided' });
  }
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key missing' });
  }
  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}&maxResults=20`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(500).json({ error: 'YouTube API error' });
    }
    const data = await response.json();
    const comments =
      data.items?.map((i) => i.snippet.topLevelComment.snippet.textDisplay) || [];
    res.json({ comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
