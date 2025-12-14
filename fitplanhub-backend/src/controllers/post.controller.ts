// ========================================
// src/controllers/post.controller.ts
// ========================================
import { Request, Response } from "express";
import { Post } from "../models/Post.model";
import { Follow } from "../models/Follow.model";
import mongoose from "mongoose";

export const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { content, mediaUrls, mediaType, hashtags } = req.body;

    const post = await Post.create({
      authorId: req.user.userId,
      content,
      mediaUrls,
      mediaType,
      hashtags,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "authorId",
      "name avatarUrl role"
    );

    res
      .status(201)
      .json({ message: "Post created successfully", post: populatedPost });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFeedPosts = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { page = 1, limit = 10 } = req.query;

    const following = await Follow.find({ followerId: req.user.userId }).select(
      "followingId"
    );
    const followingIds = following.map((f) => f.followingId);

    // Convert userId string to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(req.user.userId);
    followingIds.push(userObjectId);

    const posts = await Post.find({
      authorId: { $in: followingIds },
      isPublic: true,
    })
      .populate("authorId", "name avatarUrl role")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Post.countDocuments({
      authorId: { $in: followingIds },
      isPublic: true,
    });

    res.json({
      posts,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({ authorId: userId, isPublic: true })
      .populate("authorId", "name avatarUrl role")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Post.countDocuments({
      authorId: userId,
      isPublic: true,
    });

    res.json({
      posts,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (likeId) => likeId.toString() === req.user!.userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user!.userId
      );
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      const userObjectId = new mongoose.Types.ObjectId(req.user.userId);
      post.likes.push(userObjectId);
      post.likesCount += 1;
    }

    await post.save();

    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likesCount,
      isLiked: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const commentOnPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const { text } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(req.user.userId);
    post.comments.push({
      userId: userObjectId,
      text,
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    post.commentsCount += 1;

    await post.save();

    const updatedPost = await Post.findById(id).populate(
      "comments.userId",
      "name avatarUrl"
    );

    res.status(201).json({
      message: "Comment added",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
