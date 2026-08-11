const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '..', '..', 'public', 'inputs'); // Adjust path from src/services to project root public/inputs

function findLatestInputImage() {
  try {
    const files = fs.readdirSync(INPUT_DIR).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
    if (files.length === 0) return null;

    const filePaths = files.map(file => path.join(INPUT_DIR, file));
    const latestFile = filePaths.reduce((latest, file) => {
      const currentFileStat = fs.statSync(file);
      if (!latest || currentFileStat.mtime > latest.mtime) {
        return { file, mtime: currentFileStat.mtime };
      }
      return latest;
    }, null);

    return latestFile ? `/inputs/${path.basename(latestFile.file)}` : null;
  } catch (err) {
    console.error('Error finding latest input image:', err);
    return null;
  }
}

module.exports = { findLatestInputImage };
