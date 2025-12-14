// ========================================
// src/controllers/follow.controller.ts
// ========================================
import { Request, Response } from "express";
import { Follow } from "../models/Follow.model";
import { User } from "../models/User.model";

export const followUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId } = req.params;

    if (userId === req.user.userId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingFollow = await Follow.findOne({
      followerId: req.user.userId,
      followingId: userId,
    });

    if (existingFollow) {
      return res.status(400).json({ message: "Already following this user" });
    }

    const follow = await Follow.create({
      followerId: req.user.userId,
      followingId: userId,
    });

    res.status(201).json({ message: "Successfully followed user", follow });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId } = req.params;

    const follow = await Follow.findOneAndDelete({
      followerId: req.user.userId,
      followingId: userId,
    });

    if (!follow) {
      return res.status(404).json({ message: "Not following this user" });
    }

    res.json({ message: "Successfully unfollowed user" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const followers = await Follow.find({ followingId: userId })
      .populate("followerId", "name avatarUrl bio")
      .sort({ createdAt: -1 });

    res.json({
      followers: followers.map((f) => f.followerId),
      count: followers.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const following = await Follow.find({ followerId: userId })
      .populate("followingId", "name avatarUrl bio")
      .sort({ createdAt: -1 });

    res.json({
      following: following.map((f) => f.followingId),
      count: following.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
