const multer = require("multer");
const path = require("path");
const supabase = require("../config/supabaseClient");

// Use memory storage — files go to buffer, then we push to Supabase Storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const valid =
    allowed.test(path.extname(file.originalname).toLowerCase()) &&
    allowed.test(file.mimetype);
  valid ? cb(null, true) : cb(new Error("Only images are allowed"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

/**
 * Upload a single file buffer to Supabase Storage.
 * Returns the public URL string.
 */
async function uploadToSupabase(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

  const { error } = await supabase.storage
    .from("uploads")
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const { data } = supabase.storage.from("uploads").getPublicUrl(filename);
  return data.publicUrl;
}

module.exports = upload;
module.exports.uploadToSupabase = uploadToSupabase;
