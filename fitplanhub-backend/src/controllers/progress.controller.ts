// ========================================
// src/controllers/progress.controller.ts
// ========================================
import { Request, Response } from "express";
import { Progress } from "../models/Progress.model";

export const logProgress = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const progressData = {
      userId: req.user.userId,
      ...req.body,
    };

    const existingProgress = await Progress.findOne({
      userId: req.user.userId,
      planId: req.body.planId,
      date: req.body.date,
    });

    if (existingProgress) {
      const updated = await Progress.findByIdAndUpdate(
        existingProgress._id,
        { $set: progressData },
        { new: true }
      );
      return res.json({ message: "Progress updated", progress: updated });
    }

    const progress = await Progress.create(progressData);
    res.status(201).json({ message: "Progress logged successfully", progress });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getMyProgress = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { planId, startDate, endDate } = req.query;

    const query: any = { userId: req.user.userId };
    if (planId) query.planId = planId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    const progress = await Progress.find(query)
      .populate("planId", "title")
      .sort({ date: -1 });

    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProgressStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { planId } = req.params;

    const progress = await Progress.find({
      userId: req.user.userId,
      planId,
    }).sort({ date: 1 });

    const stats = {
      totalEntries: progress.length,
      weightChange:
        progress.length > 1
          ? (progress[progress.length - 1].weight || 0) -
            (progress[0].weight || 0)
          : 0,
      avgCalories:
        progress.reduce((sum, p) => sum + (p.calories || 0), 0) /
          progress.length || 0,
      totalWorkouts: progress.reduce(
        (sum, p) => sum + (p.workoutsDone || 0),
        0
      ),
      avgWorkoutDuration:
        progress.reduce((sum, p) => sum + (p.workoutDuration || 0), 0) /
          progress.length || 0,
    };

    res.json({ stats, progress });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
