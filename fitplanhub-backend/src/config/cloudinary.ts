// Cloudinary config - handles file uploads 
import { v2 as cloudinary } from 'cloudinary';

// Load env vars
import * as dotenv from "dotenv";
dotenv.config();

// Basic Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Check if config is working (dev only)
export const verifyCloudinaryConfig = (): boolean => {
  const hasCredentials = 
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!hasCredentials) {
    console.warn('Cloudinary credentials missing - uploads disabled');
    return false;
  }
  
  console.log('Cloudinary config OK');
  return true;
};

// Quick config check
export const isCloudinaryConfigured = (): boolean => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

// Upload presets for different file types
export const cloudinaryUploadOptions = {
  avatar: {
    folder: `${process.env.CLOUDINARY_FOLDER || "hris"}/avatars`,
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      { quality: "auto", fetch_format: "auto" }
    ],
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
  
  coverImage: {
    folder: `${process.env.CLOUDINARY_FOLDER || "hris"}/covers`,
    transformation: [
      { width: 1200, height: 400, crop: "fill" },
      { quality: "auto", fetch_format: "auto" }
    ],
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
  
  // Employee docs, product images
  document: {
    folder: `${process.env.CLOUDINARY_FOLDER || "hris"}/documents`,
    resource_type: "auto" as const,
    allowed_formats: ["pdf", "jpg", "png", "jpeg", "webp"],
  },
  
  productImage: {
    folder: `${process.env.CLOUDINARY_FOLDER || "hris"}/products`,
    transformation: [
      { width: 800, height: 600, crop: "fill" },
      { quality: "auto", fetch_format: "auto" }
    ],
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  }
};

// Main upload function - use in employee profile, product upload routes
export const uploadToCloudinary = async (
  filePath: string, 
  options: any = {}
): Promise<any> => {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary not configured");
  }

  try {
    console.log('Uploading file:', filePath);
    const result = await cloudinary.uploader.upload(filePath, options);
    console.log('Upload done:', result.secure_url);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error: any) {
    console.error('Upload failed:', error.message);
    throw error;
  }
};

// Delete single file - profile pic cleanup
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<boolean> => {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary not configured");
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
  console.log('Delete result:', result.result);
  return result.result === "ok";
};

// Bulk delete - cleanup old employee docs
export const deleteMultipleFromCloudinary = async (
  publicIds: string[],
  resourceType: "image" | "video" | "raw" = "image"
): Promise<any> => {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary not configured");
  }

  const result = await cloudinary.api.delete_resources(publicIds, {
    resource_type: resourceType,
  });
  console.log('Bulk delete done:', result);
  return result;
};

export default cloudinary;
