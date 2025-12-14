// ========================================
// src/controllers/review.controller.ts
// ========================================
import { Request, Response } from "express";
import { Review } from "../models/Review.model";
import { Plan } from "../models/Plan.model";
import { Subscription } from "../models/Subscription.model";

export const createReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { planId, rating, title, comment, images } = req.body;

    const subscription = await Subscription.findOne({
      userId: req.user.userId,
      planId,
      status: { $in: ["active", "expired"] },
    });

    if (!subscription) {
      return res
        .status(403)
        .json({ message: "You must subscribe to this plan to leave a review" });
    }

    const existingReview = await Review.findOne({
      userId: req.user.userId,
      planId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this plan" });
    }

    const review = await Review.create({
      userId: req.user.userId,
      planId,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase: true,
    });

    // Update plan average rating
    const reviews = await Review.find({ planId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Plan.findByIdAndUpdate(planId, {
      averageRating: avgRating,
      totalReviews: reviews.length,
    });

    const populatedReview = await Review.findById(review._id).populate(
      "userId",
      "name avatarUrl"
    );

    res.status(201).json({
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getPlanReviews = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const { page = 1, limit = 10, sort = "recent" } = req.query;

    let sortOption: any = { createdAt: -1 };
    if (sort === "helpful") sortOption = { helpfulCount: -1 };
    if (sort === "rating-high") sortOption = { rating: -1 };
    if (sort === "rating-low") sortOption = { rating: 1 };

    const reviews = await Review.find({ planId })
      .populate("userId", "name avatarUrl")
      .sort(sortOption)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Review.countDocuments({ planId });

    res.json({
      reviews,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const markReviewHelpful = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const alreadyMarked = review.helpful.some(
      (uid) => uid.toString() === req.user!.userId
    );

    if (alreadyMarked) {
      review.helpful = review.helpful.filter(
        (uid) => uid.toString() !== req.user!.userId
      );
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      review.helpful.push(req.user.userId as any);
      review.helpfulCount += 1;
    }

    await review.save();

    res.json({
      message: alreadyMarked ? "Removed helpful mark" : "Marked as helpful",
      helpfulCount: review.helpfulCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
