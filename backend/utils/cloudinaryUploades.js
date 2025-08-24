// utils/cloudinaryUploades.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (file) => {
  if (!file || !file.tempFilePath) {
    throw new Error('Invalid file object or missing tempFilePath');
  }

  // Try to preserve the .pdf extension in public_id for friendlier URLs
  const original = file.name || file.originalname || 'document.pdf';
  const base = path.parse(original).name;
  const ext = (path.parse(original).ext || '.pdf').replace('.', '').toLowerCase();
  const isPDF = ext === 'pdf';

  const buffer = fs.readFileSync(file.tempFilePath);

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',             // raw for PDFs
        folder: 'task-documents',
        access_mode: 'public', 
        public_id: base,                  // no extension in public_id
        overwrite: true,
        unique_filename: false,
        type: 'upload',                   // ensure public delivery
      },
      (err, res) => (err ? reject(err) : resolve(res))
    );
    stream.end(buffer);
  });

  try { fs.unlinkSync(file.tempFilePath); } catch {}

  // Cloudinary may not always set result.format for raw; enforce pdf if mimetype/filename says so
  const format = isPDF ? 'pdf' : (result.format || 'pdf');

  // View inline:
  // Use a URL that ends with .pdf so the browser sets Content-Type correctly.
  const viewUrl = cloudinary.url(result.public_id, {
    resource_type: 'auto',
    type: 'upload',
    access_mode: 'public', 
    format,           // -> .../task-documents/file.pdf
    secure: true,
  });

  // Force download:
  const downloadUrl = cloudinary.url(result.public_id, {
    resource_type: 'auto',
    type: 'upload',
    access_mode: 'public', 
    format,
    flags: 'attachment',
    secure: true,
  });

  return {
    viewUrl,
    downloadUrl,
    filename: `${path.basename(result.public_id)}.${format}`,
    public_id: result.public_id,          // e.g. task-documents/file
    resource_type: result.resource_type,  // 'raw'
    format,                               // 'pdf'
  };
};

module.exports = { uploadToCloudinary };
