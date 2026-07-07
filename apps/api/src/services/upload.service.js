import { cloudinary } from '../configs/cloudinary.js';
import { AppError } from '../utils/AppError.js';

export async function uploadImageBuffer(file, folder) {
  if (!file?.buffer) throw new AppError('No image file provided', 400, 'FILE_REQUIRED');

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', overwrite: false },
      (error, result) => {
        if (error) return reject(error);
        return resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(file.buffer);
  });
}

export async function deleteImage(publicId) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}
