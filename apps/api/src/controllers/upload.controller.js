import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadImageBuffer } from '../services/upload.service.js';

export const uploadQuestionImage = asyncHandler(async (req, res) => {
  const image = await uploadImageBuffer(req.file, 'nimcet/questions');
  return ok(res, { image }, 'Image uploaded');
});
