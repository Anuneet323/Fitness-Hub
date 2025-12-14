// Upload controller
import { Request, Response } from "express";
import { uploadService } from "../services/upload.service";
import { User } from "../models/User.model";
import { isCloudinaryConfigured } from "../config/cloudinary";

const handleUpload = async (
  req: Request,
  res: Response,
  uploadFn: (path: string) => Promise<any>,
  updateFn?: (userId: string, url: string) => Promise<void>
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file" });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({ message: "Upload service unavailable" });
    }

    const result = await uploadFn(req.file.path);

    if (updateFn) {
      await updateFn(req.user.userId, result.url);
    }

    res.json({
      message: "Upload successful",
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  await handleUpload(
    req,
    res,
    uploadService.uploadAvatar,
    async (userId, url) => {
      await User.findByIdAndUpdate(userId, { avatarUrl: url });
    }
  );
};

export const uploadCoverImage = async (req: Request, res: Response) => {
  await handleUpload(
    req,
    res,
    uploadService.uploadCoverImage,
    async (userId, url) => {
      await User.findByIdAndUpdate(userId, { coverImageUrl: url });
    }
  );
};

export const uploadPlanThumbnail = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "trainer") {
      return res.status(403).json({ message: "Trainer only" });
    }
    await handleUpload(req, res, uploadService.uploadPlanThumbnail);
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};

export const uploadPlanImage = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "trainer") {
      return res.status(403).json({ message: "Trainer only" });
    }
    await handleUpload(req, res, uploadService.uploadPlanImage);
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};

export const uploadPostMedia = async (req: Request, res: Response) => {
  await handleUpload(req, res, uploadService.uploadPostMedia);
};

export const uploadVideo = async (req: Request, res: Response) => {
  await handleUpload(req, res, uploadService.uploadVideo);
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({ message: "Upload service unavailable" });
    }

    const { publicId } = req.params;
    const { resourceType = "image" } = req.body;

    const deleted = await uploadService.deleteFile(
      publicId,
      resourceType as "image" | "video"
    );

    if (deleted) {
      res.json({ message: "File deleted" });
    } else {
      res.status(400).json({ message: "Delete failed" });
    }
  } catch (error: any) {
    console.error("Delete failed:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};

export const uploadMultiple = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ message: "No files" });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({ message: "Upload service unavailable" });
    }

    const uploadPromises = req.files.map((file: Express.Multer.File) =>
      uploadService.uploadPostMedia(file.path)
    );

    const results = await Promise.all(uploadPromises);

    res.json({
      message: `${results.length} files uploaded`,
      files: results,
    });
  } catch (error: any) {
    console.error("Multiple upload failed:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};
