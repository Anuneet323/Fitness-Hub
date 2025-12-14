// ========================================
// src/controllers/follow.controller.ts - UPDATED
// ========================================
import { Request, Response } from "express";
import { Follow } from "../models/Follow.model";
import { User } from "../models/User.model";
import { Plan } from "../models/Plan.model";
import { Post } from "../models/Post.model";
import { createNotification } from "../controllers/notification.controller";

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

    // Update follower/following counts
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { followingCount: 1 },
    });
    await User.findByIdAndUpdate(userId, {
      $inc: { followersCount: 1 },
    });

    // Create notification
    await createNotification({
      userId: userId,
      type: "follow",
      title: "New Follower",
      message: `${userToFollow.name} started following you`,
      fromUserId: req.user.userId,
      link: `/profile/${req.user.userId}`,
    });

    res.status(201).json({
      success: true,
      message: "Successfully followed user",
      follow,
    });
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

    // Update follower/following counts
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { followingCount: -1 },
    });
    await User.findByIdAndUpdate(userId, {
      $inc: { followersCount: -1 },
    });

    res.json({
      success: true,
      message: "Successfully unfollowed user",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const followers = await Follow.find({ followingId: userId })
      .populate("followerId", "name avatarUrl bio role specializations")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Follow.countDocuments({ followingId: userId });

    // Check if current user is following any of these followers
    if (req.user) {
      const followerIds = followers.map((f: any) => f.followerId._id);
      const currentUserFollowing = await Follow.find({
        followerId: req.user.userId,
        followingId: { $in: followerIds },
      });

      const followingMap = new Set(
        currentUserFollowing.map((f) => f.followingId.toString())
      );

      const followersWithStatus = followers.map((f: any) => ({
        ...f.followerId.toObject(),
        isFollowing: followingMap.has(f.followerId._id.toString()),
        followedAt: f.createdAt,
      }));

      return res.json({
        success: true,
        followers: followersWithStatus,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        total,
      });
    }

    res.json({
      success: true,
      followers: followers.map((f: any) => ({
        ...f.followerId.toObject(),
        followedAt: f.createdAt,
      })),
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const following = await Follow.find({ followerId: userId })
      .populate("followingId", "name avatarUrl bio role specializations")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Follow.countDocuments({ followerId: userId });

    res.json({
      success: true,
      following: following.map((f: any) => ({
        ...f.followingId.toObject(),
        followedAt: f.createdAt,
      })),
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Check if current user is following a specific user
export const checkFollowStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.json({ success: true, isFollowing: false });
    }

    const { userId } = req.params;

    const follow = await Follow.findOne({
      followerId: req.user.userId,
      followingId: userId,
    });

    res.json({
      success: true,
      isFollowing: !!follow,
      followedAt: follow?.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all trainers with optional filters
export const getAllTrainers = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 12,
      specialization,
      minExperience,
      search,
      sortBy = "createdAt",
    } = req.query;

    const query: any = { role: "trainer", isActive: true };

    // Filter by specialization
    if (specialization) {
      query.specializations = { $in: [specialization] };
    }

    // Filter by minimum experience
    if (minExperience) {
      query.experience = { $gte: Number(minExperience) };
    }

    // Search by name, bio, or specializations
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { specializations: { $in: [new RegExp(search as string, "i")] } },
      ];
    }

    // Sorting options
    let sortOption: any = {};
    if (sortBy === "experience") {
      sortOption = { experience: -1 };
    } else if (sortBy === "followers") {
      sortOption = { followersCount: -1 };
    } else if (sortBy === "popular") {
      sortOption = { followersCount: -1, postsCount: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const trainers = await User.find(query)
      .select("-passwordHash -resetPasswordToken -resetPasswordExpire")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort(sortOption);

    const total = await User.countDocuments(query);

    // If user is authenticated, check follow status
    if (req.user) {
      const trainerIds = trainers.map((t) => t._id);
      const follows = await Follow.find({
        followerId: req.user.userId,
        followingId: { $in: trainerIds },
      });

      const followMap = new Set(follows.map((f) => f.followingId.toString()));

      const trainersWithFollowStatus = trainers.map((trainer) => ({
        ...trainer.toObject(),
        isFollowing: followMap.has(trainer._id.toString()),
      }));

      return res.json({
        success: true,
        trainers: trainersWithFollowStatus,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        total,
      });
    }

    res.json({
      success: true,
      trainers,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get trainer profile by ID with detailed info
export const getTrainerProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const trainer = await User.findOne({
      _id: userId,
      role: "trainer",
      isActive: true,
    }).select("-passwordHash -resetPasswordToken -resetPasswordExpire");

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // Get trainer's plans
    const plans = await Plan.find({
      trainerId: userId,
      isActive: true,
    })
      .select("title thumbnail price discountPrice category averageRating totalSubscribers")
      .limit(6)
      .sort({ totalSubscribers: -1 });

    // Get trainer's recent posts
    const posts = await Post.find({
      authorId: userId,
      isPublic: true,
    })
      .select("content mediaUrls likesCount commentsCount createdAt")
      .limit(6)
      .sort({ createdAt: -1 });

    // Get stats
    const plansCount = await Plan.countDocuments({
      trainerId: userId,
      isActive: true,
    });

    const postsCount = await Post.countDocuments({
      authorId: userId,
      isPublic: true,
    });

    // Check if current user is following this trainer
    let isFollowing = false;
    if (req.user) {
      const follow = await Follow.findOne({
        followerId: req.user.userId,
        followingId: userId,
      });
      isFollowing = !!follow;
    }

    res.json({
      success: true,
      trainer: {
        ...trainer.toObject(),
        isFollowing,
        stats: {
          plansCount,
          postsCount,
          followersCount: trainer.followersCount,
          followingCount: trainer.followingCount,
        },
      },
      plans,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
