// ========================================
// src/controllers/upload.controller.ts
// ========================================
import { Request, Response } from "express";
import { uploadService } from "../services/upload.service";
import { User } from "../models/User.model";
import { isCloudinaryConfigured } from "../config/cloudinary";

// Upload avatar
export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        message: "File upload service is not configured",
      });
    }

    const result = await uploadService.uploadAvatar(req.file.path);

    // Update user avatar
    await User.findByIdAndUpdate(req.user.userId, {
      avatarUrl: result.url,
    });

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error("Upload avatar error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

// Upload cover image
export const uploadCoverImage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        message: "File upload service is not configured",
      });
    }

    const result = await uploadService.uploadCoverImage(req.file.path);

    // Update user cover image
    await User.findByIdAndUpdate(req.user.userId, {
      coverImageUrl: result.url,
    });

    res.json({
      success: true,
      message: "Cover image uploaded successfully",
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error("Upload cover error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

// Upload plan thumbnail
export const uploadPlanThumbnail = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "trainer") {
      return res.status(403).json({
        message: "Only trainers can upload plan media",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        message: "File upload service is not configured",
      });
    }

    const result = await uploadService.uploadPlanThumbnail(req.file.path);

    res.json({
      success: true,
      message: "Plan thumbnail uploaded successfully",
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error("Upload plan thumbnail error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

// Upload plan image
export const uploadPlanImage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "trainer") {
      return res.status(403).json({
        message: "Only trainers can upload plan media",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        message: "File upload service is not configured",
      });
    }

    const result = await uploadService.uploadPlanImage(req.file.path);

    res.json({
      success: true,
      message: "Plan image uploaded successfully",
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error("Upload plan image error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

// Upload post media
export const uploadPostMedia = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        message: "File upload service is not configured",
      });
    }

    const result = await uploadService.uploadPostMedia(req.file.path);

    res.json({
      success: true,
      message: "Post media uploaded successfully",
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error("Upload post media error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

// Upload video
export const uploadVideo = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        message: "File upload service is not configured",
      });
    }

    const result = await uploadService.uploadVideo(req.file.path);

    res.json({
      success: true,
      message: "Video uploaded successfully",
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error("Upload video error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

// Delete file
export const deleteFile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { publicId } = req.params;
    const { resourceType = "image" } = req.body;

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        message: "File upload service is not configured",
      });
    }

    const deleted = await uploadService.deleteFile(
      publicId,
      resourceType as "image" | "video"
    );

    if (deleted) {
      res.json({
        success: true,
        message: "File deleted successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to delete file",
      });
    }
  } catch (error: any) {
    console.error("Delete file error:", error);
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};

// Upload multiple files
export const uploadMultiple = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        message: "File upload service is not configured",
      });
    }

    const uploadPromises = req.files.map((file: Express.Multer.File) =>
      uploadService.uploadPostMedia(file.path)
    );

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `${results.length} files uploaded successfully`,
      files: results,
    });
  } catch (error: any) {
    console.error("Upload multiple error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};
