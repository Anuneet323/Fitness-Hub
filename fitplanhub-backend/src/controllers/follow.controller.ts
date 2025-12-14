// Follow controller
import { Request, Response } from "express";
import { Follow } from "../models/Follow.model";
import { User } from "../models/User.model";
import { Plan } from "../models/Plan.model";
import { Post } from "../models/Post.model";
import { createNotification } from "../services/notification.service";

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
      return res.status(400).json({ message: "Already following" });
    }

    const follow = await Follow.create({
      followerId: req.user.userId,
      followingId: userId,
    });

    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { followingCount: 1 },
    });
    await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } });

    await createNotification({
      userId,
      type: "follow",
      title: "New Follower",
      message: "Someone started following you",
      fromUserId: req.user.userId,
      link: `/profile/${req.user.userId}`,
    });

    res.status(201).json({ message: "Followed user", follow });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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

    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { followingCount: -1 },
    });
    await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });

    res.json({ message: "Unfollowed user" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
        followers: followersWithStatus,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        total,
      });
    }

    res.json({
      followers: followers.map((f: any) => ({
        ...f.followerId.toObject(),
        followedAt: f.createdAt,
      })),
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
      following: following.map((f: any) => ({
        ...f.followingId.toObject(),
        followedAt: f.createdAt,
      })),
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const checkFollowStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.json({ isFollowing: false });
    }

    const { userId } = req.params;

    const follow = await Follow.findOne({
      followerId: req.user.userId,
      followingId: userId,
    });

    res.json({
      isFollowing: !!follow,
      followedAt: follow?.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

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

    if (specialization) query.specializations = { $in: [specialization] };
    if (minExperience) query.experience = { $gte: Number(minExperience) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { specializations: { $in: [new RegExp(search as string, "i")] } },
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (sortBy === "experience") sortOption = { experience: -1 };
    else if (sortBy === "followers") sortOption = { followersCount: -1 };
    else if (sortBy === "popular")
      sortOption = { followersCount: -1, postsCount: -1 };

    const trainers = await User.find(query)
      .select("-passwordHash -resetPasswordToken -resetPasswordExpire")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort(sortOption);

    const total = await User.countDocuments(query);

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
        trainers: trainersWithFollowStatus,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        total,
      });
    }

    res.json({
      trainers,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

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

    const plans = await Plan.find({ trainerId: userId, isActive: true })
      .select(
        "title thumbnail price discountPrice category averageRating totalSubscribers"
      )
      .limit(6)
      .sort({ totalSubscribers: -1 });

    const posts = await Post.find({ authorId: userId, isPublic: true })
      .select("content mediaUrls likesCount commentsCount createdAt")
      .limit(6)
      .sort({ createdAt: -1 });

    const [plansCount, postsCount] = await Promise.all([
      Plan.countDocuments({ trainerId: userId, isActive: true }),
      Post.countDocuments({ authorId: userId, isPublic: true }),
    ]);

    let isFollowing = false;
    if (req.user) {
      const follow = await Follow.findOne({
        followerId: req.user.userId,
        followingId: userId,
      });
      isFollowing = !!follow;
    }

    res.json({
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
    res.status(500).json({ message: "Server error" });
  }
};
