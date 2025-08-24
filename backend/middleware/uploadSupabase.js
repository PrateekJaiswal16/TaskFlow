// middleware/uploadSupabase.js
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 3,                       // max 3 files total
    fileSize: 25 * 1024 * 1024,     // 25MB per file
  },
}).any(); // <= accept any file field name

module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};
