const express = require('express');
const path = require('path');
const { findLatestInputImage } = require('./findLatestInputImage');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// API endpoint to get the latest input image URL
app.get('/api/latest-input-image', (req, res) => {
  const latestImage = findLatestInputImage();
  if (latestImage) {
    res.json({ imageUrl: latestImage });
  } else {
    res.status(404).json({ error: 'No images found in inputs folder' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
