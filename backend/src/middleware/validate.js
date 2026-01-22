// === LOCAL STORAGE (comment when using Cloudinary) ===
// import { removeFile } from "../utils/file.js";

// === CLOUDINARY (uncomment when using Cloudinary) ===
import { deleteCloudinaryImage, getPublicIdFromUrl } from "../config/cloudinary.js";

const cleanupUploadedFiles = async (req) => {
  // Kumpulkan semua file yang mungkin dikirim (single, array, atau fields object)
  const files = [];
  if (req.file) files.push(req.file);
  if (Array.isArray(req.files)) {
    files.push(...req.files);
  } else if (req.files && typeof req.files === "object") {
    Object.values(req.files).forEach((val) => {
      if (Array.isArray(val)) files.push(...val);
    });
  }

  // === LOCAL STORAGE (comment when using Cloudinary) ===
  // await Promise.all(
  //   files.map((file) => removeFile(file.path || file.filename))
  // );

  // === CLOUDINARY (uncomment when using Cloudinary) ===
  await Promise.all(
    files.map((file) => {
      if (file.path) {
        const public_id = getPublicIdFromUrl(file.path);
        return deleteCloudinaryImage(public_id);
      }
      return Promise.resolve();
    })
  );
};

export const validate = (schema) => async (req,res,next) =>{
    const result = schema.safeParse(req.body)
    if(!result.success) {
      // Jika validasi gagal, bersihkan file yang sudah ter-upload
      await cleanupUploadedFiles(req);
      const formattedError = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
      return res.status(422).json({
        success: false,
        message: "Validation error",
        error : formattedError,
      })
    }
    req.body = result.data
    next();
}
