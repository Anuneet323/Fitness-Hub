// Cloudinary utility functions
import { v2 as cloudinary } from "cloudinary";

export const extractPublicId = (url: string): string => {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return filename.split(".")[0];
};

export const getResourceType = (url: string): "image" | "video" | "raw" => {
  const extension = url.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || ""))
    return "image";
  if (["mp4", "mov", "avi", "webm"].includes(extension || "")) return "video";
  return "raw";
};

export const generateThumbnail = (videoUrl: string): string => {
  const publicId = extractPublicId(videoUrl);
  return cloudinary.url(publicId, {
    resource_type: "video",
    format: "jpg",
    transformation: [{ width: 800, crop: "scale" }],
  });
};

export const optimizeImage = (
  imageUrl: string,
  width?: number,
  height?: number
): string => {
  const publicId = extractPublicId(imageUrl);
  return cloudinary.url(publicId, {
    transformation: [
      { width: width || 1200, height: height, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });
};
