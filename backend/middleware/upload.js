const multer = require('multer');

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = /^image\/(jpeg|png|webp|gif)$/;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED.test(file.mimetype)) return cb(null, true);
    cb(new Error('Only JPG, PNG, WEBP or GIF images are allowed'));
  },
});

// Accepts an optional single file in the "image" field; JSON requests pass straight through.
const uploadProjectImage = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (!err) return next();
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5MB or smaller' : err.message;
    res.status(400).json({ success: false, message });
  });
};

module.exports = { uploadProjectImage };
