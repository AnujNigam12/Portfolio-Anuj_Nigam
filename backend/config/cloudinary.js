const { v2: cloudinary } = require('cloudinary');

const FOLDER = 'portfolio/projects';

const isConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

// Configure lazily so dotenv has always been loaded by the time this runs
const configure = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

// Upload an in-memory image buffer. Resolves to { url, publicId }.
const uploadImage = (buffer) =>
  new Promise((resolve, reject) => {
    configure();
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        resource_type: 'image',
        transformation: [{ width: 1600, crop: 'limit' }, { quality: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });

// Best-effort delete: never throws, so a Cloudinary hiccup can't block saving or deleting a project.
const deleteImage = async (publicId) => {
  if (!publicId || !isConfigured()) return;
  try {
    configure();
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
  } catch (err) {
    console.warn(`[Cloudinary] Could not delete image ${publicId}: ${err.message}`);
  }
};

module.exports = { isConfigured, uploadImage, deleteImage };
