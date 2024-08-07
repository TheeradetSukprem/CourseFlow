// fileValidation.js

export const MAX_IMAGE_SIZE_MB = 5; // Maximum size for image files in MB
export const MAX_VIDEO_SIZE_MB = 20; // Maximum size for video files in MB

export const IMAGE_FORMATS = ["image/jpeg", "image/png"];
export const VIDEO_FORMATS = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
];

export const validateFile = (file, allowedFormats, maxSizeMB) => {
  const { size, type } = file;
  const fileSizeMB = size / (1024 * 1024); // Convert size to MB

  if (!allowedFormats.includes(type)) {
    throw new Error(
      `Invalid file format. Allowed formats are: ${allowedFormats.join(", ")}`
    );
  }

  if (fileSizeMB > maxSizeMB) {
    throw new Error(`File size exceeds ${maxSizeMB} MB.`);
  }
};
