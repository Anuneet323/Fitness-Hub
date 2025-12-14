import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

export const verifyCloudinaryConfig = (): boolean => {
  const hasCredentials =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!hasCredentials) {
    console.warn(
      "Cloudinary credentials not configured (file upload features disabled)"
    );
    return false;
  }

  console.log("Cloudinary configured successfully");
  return true;
};

export const isCloudinaryConfigured = (): boolean => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

export const cloudinaryUploadOptions = {
  avatar: {
    folder: `${process.env.CLOUDINARY_FOLDER || "fitplanhub"}/avatars`,
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      { quality: "auto", fetch_format: "auto" },
    ],
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },

  coverImage: {
    folder: `${process.env.CLOUDINARY_FOLDER || "fitplanhub"}/covers`,
    transformation: [
      { width: 1200, height: 400, crop: "fill" },
      { quality: "auto", fetch_format: "auto" },
    ],
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },

  planThumbnail: {
    folder: `${process.env.CLOUDINARY_FOLDER || "fitplanhub"}/plans/thumbnails`,
    transformation: [
      { width: 800, height: 600, crop: "fill" },
      { quality: "auto", fetch_format: "auto" },
    ],
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },

  planImage: {
    folder: `${process.env.CLOUDINARY_FOLDER || "fitplanhub"}/plans/images`,
    transformation: [
      { width: 1200, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },

  postMedia: {
    folder: `${process.env.CLOUDINARY_FOLDER || "fitplanhub"}/posts`,
    transformation: [
      { width: 1080, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
    allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
  },

  video: {
    folder: `${process.env.CLOUDINARY_FOLDER || "fitplanhub"}/videos`,
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "avi", "webm"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },

  progressImage: {
    folder: `${process.env.CLOUDINARY_FOLDER || "fitplanhub"}/progress`,
    transformation: [
      { width: 800, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
};

export const uploadToCloudinary = async (
  filePath: string,
  options: any = {}
): Promise<any> => {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  const result = await cloudinary.uploader.upload(filePath, options);
  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<boolean> => {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
  return result.result === "ok";
};

export const deleteMultipleFromCloudinary = async (
  publicIds: string[],
  resourceType: "image" | "video" | "raw" = "image"
): Promise<any> => {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  const result = await cloudinary.api.delete_resources(publicIds, {
    resource_type: resourceType,
  });
  return result;
};

export default cloudinary;
