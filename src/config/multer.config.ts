import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const multerImageConfig = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.mimetype)) {
      return cb(
        new BadRequestException('Only JPG, PNG, or WEBP images are allowed'),
        false,
      );
    }
    cb(null, true);
  },
};
