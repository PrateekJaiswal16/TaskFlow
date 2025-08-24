// utils/uploadSupabase.js
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const BUCKET = process.env.SUPABASE_BUCKET || 'documents';

function publicUrlFor(filePath) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

async function uploadFileToSupabase(file, userId = 'anonymous') {
  const safeName = file.originalname || 'file.bin';
  const filePath = `task-documents/${userId}/${Date.now()}_${safeName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype || 'application/octet-stream',
      upsert: true,
    });

  if (error) throw error;

  return {
    storagePath: filePath,
    filename: path.basename(safeName),
    url: publicUrlFor(filePath),
  };
}

async function deleteFromSupabase(storagePath) {
  if (!storagePath) return;
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error && error.message !== 'Object not found') throw error;
}

// ✅ Export functions explicitly
exports.uploadFileToSupabase = uploadFileToSupabase;
exports.deleteFromSupabase = deleteFromSupabase;
